// Web Serial API Communication Service
// Team Syntropy - SIGNOVA Glove Interface
// Manages USB Serial streaming at 115200 baud, chunk buffering, newline splitting,
// malformed line rejection, and disconnect detection.

import { CONFIG, SENSOR_COUNT } from '../config.js';

export interface RawSerialPacket {
  raw: number[];
  receiveTime: number; // performance.now() timestamp when line completed
  lineString: string;
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
   * Parse "f1,f2,f3" format; ignore malformed lines
   */
  public parseLine(line: string, receiveTime: number = performance.now()): void {
    // Expected format: comma-separated numbers, e.g. "412,820,310"
    const parts = line.split(',').map(p => p.trim());

    if (parts.length !== SENSOR_COUNT) {
      // Malformed: wrong number of sensor readings
      return;
    }

    const numericValues: number[] = [];
    for (let i = 0; i < parts.length; i++) {
      const val = parseFloat(parts[i]);
      if (isNaN(val)) {
        // Malformed line containing non-numeric data
        return;
      }
      numericValues.push(val);
    }

    const packet: RawSerialPacket = {
      raw: numericValues,
      receiveTime,
      lineString: line,
    };

    this.packetListeners.forEach(cb => cb(packet));
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
