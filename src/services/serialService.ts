// Web Serial API Communication Service
// Team Syntropy - SIGNOVA Glove Interface
// Manages USB Serial streaming at 115200 baud, chunk buffering, newline splitting,
// malformed line rejection, and disconnect detection.

import { CONFIG, SENSOR_COUNT } from '../config.js';

export interface RawSerialPacket {
  raw: number[];
  receiveTime: number; // performance.now() timestamp when line completed
  lineString: string;
  directGesture?: string;
  directBits?: [number, number, number];
}

export type ConnectionStatus = 'disconnected' | 'connecting' | 'connected' | 'error';

// Ambient types for Web Serial API in browsers
/* eslint-disable @typescript-eslint/no-explicit-any */
type SerialPortType = any;

class SerialService {
  private port: SerialPortType | null = null;
  private reader: any = null;
  private keepReading: boolean = false;
  private status: ConnectionStatus = 'disconnected';
  private statusListeners: Set<(status: ConnectionStatus, message?: string) => void> = new Set();
  private packetListeners: Set<(packet: RawSerialPacket) => void> = new Set();
  private baudRate: number = CONFIG.SERIAL_BAUD_RATE;

  constructor() {
    if (typeof window !== 'undefined' && 'serial' in navigator) {
      (navigator as any).serial.addEventListener('disconnect', (event: any) => {
        if (this.port && event.target === this.port) {
          this.handleDisconnect('USB Device disconnected');
        }
      });
    }
  }

  public isSupported(): boolean {
    return typeof window !== 'undefined' && 'serial' in navigator;
  }

  public getStatus(): ConnectionStatus {
    return this.status;
  }

  public onStatusChange(callback: (status: ConnectionStatus, message?: string) => void): () => void {
    this.statusListeners.add(callback);
    return () => this.statusListeners.delete(callback);
  }

  public onPacket(callback: (packet: RawSerialPacket) => void): () => void {
    this.packetListeners.add(callback);
    return () => this.packetListeners.delete(callback);
  }

  private setStatus(status: ConnectionStatus, message?: string): void {
    this.status = status;
    this.statusListeners.forEach(cb => cb(status, message));
  }

  /**
   * Request user to select USB Serial Port and begin 50Hz read loop
   */
  public async connect(): Promise<boolean> {
    if (!this.isSupported()) {
      this.setStatus('error', 'Web Serial API is not supported in this browser. Please use Chrome or Edge.');
      return false;
    }

    try {
      this.setStatus('connecting', 'Selecting serial port...');
      const navSerial = (navigator as any).serial;

      // Prompt user to pick Seeed XIAO / Arduino Uno USB Port
      this.port = await navSerial.requestPort();

      await this.port.open({
        baudRate: this.baudRate,
        dataBits: 8,
        stopBits: 1,
        parity: 'none',
        bufferSize: 4096,
      });

      this.setStatus('connected', `Connected @ ${this.baudRate} baud`);
      this.startReading();
      return true;
    } catch (err: any) {
      if (err.name === 'NotFoundError') {
        this.setStatus('disconnected', 'Port selection cancelled.');
      } else {
        console.error('Serial connection error:', err);
        this.setStatus('error', err.message || 'Failed to open serial port.');
      }
      return false;
    }
  }

  /**
   * Continuous stream reader with chunk buffering and line parsing
   */
  private async startReading(): Promise<void> {
    if (!this.port || !this.port.readable) return;

    this.keepReading = true;
    const textDecoder = new TextDecoderStream();
    const readableStreamClosed = this.port.readable.pipeTo(textDecoder.writable);
    const reader = textDecoder.readable.getReader();
    this.reader = reader;

    let buffer = '';

    try {
      while (this.keepReading) {
        const { value, done } = await reader.read();
        if (done) break;

        if (value) {
          buffer += value;

          // Process all complete lines delimited by newline
          let newlineIndex: number;
          while ((newlineIndex = buffer.indexOf('\n')) >= 0) {
            const rawLine = buffer.slice(0, newlineIndex).trim();
            buffer = buffer.slice(newlineIndex + 1);

            if (rawLine.length > 0) {
              const receiveTime = performance.now();
              this.parseLine(rawLine, receiveTime);
            }
          }
        }
      }
    } catch (err: any) {
      if (this.keepReading) {
        console.warn('Serial read error:', err);
        this.handleDisconnect('Serial read terminated abruptly');
      }
    } finally {
      reader.releaseLock();
      await readableStreamClosed.catch(() => {});
    }
  }

  /**
   * Parse incoming serial/BLE lines with universal format support:
   * 1. Direct gesture names: "HELLO", "YES", "THREE", "OK", "NO", "ROCK", "ONE", "VICTORY"
   * 2. Direct binary patterns: "110", "000", "{1, 1, 0}", "[1, 1, 0]", "1, 1, 0"
   * 3. Comma-separated ADC sensor readings: "14200, 17746, 2829"
   * 4. Combined format: "THREE, 14200, 17746, 2829"
   */
  public parseLine(line: string, receiveTime: number = performance.now()): void {
    if (!line) return;
    const trimmed = line.trim();
    if (trimmed.length === 0) return;

    // Gesture Dictionary mapping
    const GESTURE_TO_BITS: Record<string, [number, number, number]> = {
      'HELLO': [0, 0, 0],
      'YES': [1, 1, 1],
      'ONE': [0, 1, 1],
      'VICTORY': [0, 0, 1],
      'OK': [1, 0, 0],
      'THREE': [1, 1, 0],
      'NO': [1, 0, 1],
      'ROCK': [0, 1, 0],
    };

    const BITS_TO_GESTURE: Record<string, string> = {
      '000': 'HELLO',
      '111': 'YES',
      '011': 'ONE',
      '001': 'VICTORY',
      '100': 'OK',
      '110': 'THREE',
      '101': 'NO',
      '010': 'ROCK',
    };

    const upper = trimmed.toUpperCase();

    // 1. Check if line contains or equals a direct gesture name
    for (const [gestureName, bits] of Object.entries(GESTURE_TO_BITS)) {
      const regex = new RegExp(`(^|[^A-Z0-9])${gestureName}([^A-Z0-9]|$)`, 'i');
      if (regex.test(upper)) {
        // Also check if line has numeric sensor values alongside gesture
        const numericParts = trimmed
          .replace(new RegExp(gestureName, 'gi'), '')
          .split(/[,:\s]+/)
          .map(p => parseFloat(p))
          .filter(n => !isNaN(n));

        const raw = numericParts.length >= 3
          ? numericParts.slice(0, 3)
          : bits.map(b => (b === 1 ? 800 : 250)); // Synthetic representative values for 3D hand

        const packet: RawSerialPacket = {
          raw,
          receiveTime,
          lineString: line,
          directGesture: gestureName as any,
          directBits: bits,
        };

        this.packetListeners.forEach(cb => cb(packet));
        return;
      }
    }

    // 2. Check if line is a direct 3-bit binary pattern: "110", "1,1,0", "{1, 1, 0}", "[1, 0, 1]"
    const cleanBits = trimmed.replace(/[\{\}\[\]\s]/g, '');
    const bitMatch = cleanBits.match(/^([01]),?([01]),?([01])$/);
    if (bitMatch) {
      const b0 = parseInt(bitMatch[1], 10);
      const b1 = parseInt(bitMatch[2], 10);
      const b2 = parseInt(bitMatch[3], 10);
      const bitStr = `${b0}${b1}${b2}`;
      const mappedGesture = BITS_TO_GESTURE[bitStr] || 'NONE';

      const packet: RawSerialPacket = {
        raw: [b0 === 1 ? 800 : 250, b1 === 1 ? 800 : 250, b2 === 1 ? 800 : 250],
        receiveTime,
        lineString: line,
        directGesture: mappedGesture as any,
        directBits: [b0, b1, b2],
      };

      this.packetListeners.forEach(cb => cb(packet));
      return;
    }

    // 3. Comma-separated ADC analog readings: "14200, 17746, 2829"
    const parts = trimmed.split(',').map(p => p.trim());
    if (parts.length >= SENSOR_COUNT) {
      const numericValues: number[] = [];
      for (let i = 0; i < SENSOR_COUNT; i++) {
        const val = parseFloat(parts[i]);
        if (isNaN(val)) return;
        numericValues.push(val);
      }

      // Check if they are just 0 or 1 bits: e.g. "1, 1, 0"
      if (numericValues.every(v => v === 0 || v === 1)) {
        const b0 = numericValues[0];
        const b1 = numericValues[1];
        const b2 = numericValues[2];
        const bitStr = `${b0}${b1}${b2}`;
        const mappedGesture = BITS_TO_GESTURE[bitStr] || 'NONE';

        const packet: RawSerialPacket = {
          raw: [b0 === 1 ? 800 : 250, b1 === 1 ? 800 : 250, b2 === 1 ? 800 : 250],
          receiveTime,
          lineString: line,
          directGesture: mappedGesture as any,
          directBits: [b0 as 0 | 1, b1 as 0 | 1, b2 as 0 | 1],
        };

        this.packetListeners.forEach(cb => cb(packet));
        return;
      }

      const packet: RawSerialPacket = {
        raw: numericValues,
        receiveTime,
        lineString: line,
      };

      this.packetListeners.forEach(cb => cb(packet));
    }
  }

  /**
   * Disconnect port cleanly
   */
  public async disconnect(): Promise<void> {
    this.keepReading = false;

    if (this.reader) {
      try {
        await this.reader.cancel();
      } catch {
        // Ignore
      }
      this.reader = null;
    }

    if (this.port) {
      try {
        await this.port.close();
      } catch {
        // Ignore
      }
      this.port = null;
    }

    this.setStatus('disconnected', 'Disconnected');
  }

  private handleDisconnect(reason: string): void {
    this.keepReading = false;
    this.port = null;
    this.reader = null;
    this.setStatus('disconnected', reason);
  }
}

export const serialService = new SerialService();
export default serialService;
