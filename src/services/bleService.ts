// Web Bluetooth (BLE) Service for SIGNOVA Glove
// Team Syntropy - Seeed XIAO nRF52840 Sense
// Supports Nordic UART Service (NUS) wireless streaming of 3 flex sensors (Index, Middle, Ring)
// Seamlessly decodes both ASCII "f1,f2,f3\n" and binary uint16 packets.

/* eslint-disable @typescript-eslint/no-explicit-any */

import { serialService } from './serialService';

// Nordic UART Service & Characteristic UUIDs for XIAO nRF52840
export const NORDIC_UART_SERVICE_UUID = '6e400001-b5a3-f393-e0a9-e50e24dcca9e';
export const UART_TX_CHARACTERISTIC_UUID = '6e400003-b5a3-f393-e0a9-e50e24dcca9e';

type BLEServer = any;
type BLECharacteristic = any;
type BLEDevice = any;

class BLEService {
  private gattServer: BLEServer | null = null;
  private txCharacteristic: BLECharacteristic | null = null;
  private device: BLEDevice | null = null;
  private isConnected: boolean = false;
  private textBuffer: string = '';
  private textDecoder: TextDecoder = new TextDecoder();
  private statusListeners: Set<(connected: boolean, msg?: string) => void> = new Set();

  public isSupported(): boolean {
    return typeof window !== 'undefined' && 'bluetooth' in navigator;
  }

  public getIsConnected(): boolean {
    return this.isConnected;
  }

  public onStatusChange(callback: (connected: boolean, msg?: string) => void): () => void {
    this.statusListeners.add(callback);
    return () => this.statusListeners.delete(callback);
  }

  private notifyStatus(connected: boolean, msg?: string): void {
    this.isConnected = connected;
    this.statusListeners.forEach((cb) => cb(connected, msg));
  }

  /**
   * Request Bluetooth device advertising Nordic UART Service
   */
  public async connect(): Promise<boolean> {
    if (!this.isSupported()) {
      this.notifyStatus(false, 'Web Bluetooth API is not supported in this browser.');
      return false;
    }

    try {
      this.notifyStatus(false, 'Scanning for Seeed XIAO BLE / Signova Glove...');
      const navBluetooth = (navigator as any).bluetooth;

      this.device = await navBluetooth.requestDevice({
        filters: [
          { services: [NORDIC_UART_SERVICE_UUID] },
          { namePrefix: 'SIGNOVA' },
          { namePrefix: 'XIAO' },
          { namePrefix: 'Syntropy' },
          { namePrefix: 'Glove' },
        ],
        optionalServices: [NORDIC_UART_SERVICE_UUID, 'battery_service'],
      });

      if (!this.device) {
        throw new Error('Device selection cancelled');
      }

      this.device.addEventListener('gattserverdisconnected', this.onDisconnected.bind(this));

      this.notifyStatus(false, `Connecting to ${this.device.name || 'XIAO Glove'}...`);
      this.gattServer = (await this.device.gatt?.connect()) || null;

      if (!this.gattServer) {
        throw new Error('Failed to connect to GATT server');
      }

      // Look up Nordic UART Service
      const service = await this.gattServer.getPrimaryService(NORDIC_UART_SERVICE_UUID);
      this.txCharacteristic = await service.getCharacteristic(UART_TX_CHARACTERISTIC_UUID);

      // Subscribe to live packet notifications
      await this.txCharacteristic.startNotifications();
      this.txCharacteristic.addEventListener(
        'characteristicvaluechanged',
        this.handleNotification.bind(this)
      );

      this.notifyStatus(true, `Connected to ${this.device.name || 'Seeed XIAO'} via BLE`);
      return true;
    } catch (err: any) {
      if (err.name === 'NotFoundError') {
        this.notifyStatus(false, 'Bluetooth pairing cancelled by user');
      } else {
        console.warn('BLE connection error:', err);
        this.notifyStatus(false, err.message || 'BLE connection failed');
      }
      return false;
    }
  }

  /**
   * Process incoming BLE notification chunks
   */
  private handleNotification(event: Event): void {
    const target = event.target as any;
    if (!target || !target.value) return;

    const dataView: DataView = target.value;
    const receiveTime = performance.now();

    // Check if packet is binary 3 x uint16 (6 bytes: index, middle, ring ADC)
    if (dataView.byteLength === 6) {
      const idx = dataView.getUint16(0, true);
      const mid = dataView.getUint16(2, true);
      const rng = dataView.getUint16(4, true);
      serialService.parseLine(`${idx},${mid},${rng}`, receiveTime);
      return;
    }

    // Otherwise, decode as UTF-8 string chunk "f1,f2,f3\n"
    const textChunk = this.textDecoder.decode(dataView, { stream: true });
    this.textBuffer += textChunk;

    let newlineIndex: number;
    while ((newlineIndex = this.textBuffer.indexOf('\n')) >= 0) {
      const line = this.textBuffer.slice(0, newlineIndex).trim();
      this.textBuffer = this.textBuffer.slice(newlineIndex + 1);

      if (line.length > 0) {
        serialService.parseLine(line, receiveTime);
      }
    }
  }

  public async disconnect(): Promise<void> {
    if (this.txCharacteristic) {
      try {
        await this.txCharacteristic.stopNotifications();
      } catch {
        // Ignore
      }
      this.txCharacteristic = null;
    }

    if (this.gattServer && this.gattServer.connected) {
      try {
        this.gattServer.disconnect();
      } catch {
        // Ignore
      }
      this.gattServer = null;
    }

    this.notifyStatus(false, 'BLE Disconnected');
  }

  private onDisconnected(): void {
    this.isConnected = false;
    this.gattServer = null;
    this.txCharacteristic = null;
    this.notifyStatus(false, 'Bluetooth connection lost');
  }
}

export const bleService = new BLEService();
export default bleService;
