// Web Bluetooth (BLE) Service for SIGNOVA Glove
// Team Syntropy - Seeed XIAO nRF52840 Sense
// Supports Nordic UART Service (NUS) wireless streaming of 3 flex sensors (Index, Middle, Ring)
// Seamlessly decodes both ASCII "f1,f2,f3\n" and binary uint16 packets.

/* eslint-disable @typescript-eslint/no-explicit-any */

import { serialService } from './serialService';

// Nordic UART Service UUIDs — MUST be lowercase for Web Bluetooth API
export const NORDIC_UART_SERVICE_UUID   = '6e400001-b5a3-f393-e0a9-e50e24dcca9e';
export const UART_TX_CHARACTERISTIC_UUID = '6e400003-b5a3-f393-e0a9-e50e24dcca9e'; // Device → Browser (Notify)
export const UART_RX_CHARACTERISTIC_UUID = '6e400002-b5a3-f393-e0a9-e50e24dcca9e'; // Browser → Device (Write)

type BLEServer = any;
type BLECharacteristic = any;
type BLEDevice = any;

class BLEService {
  private gattServer: BLEServer | null = null;
  private txCharacteristic: BLECharacteristic | null = null;
  private device: BLEDevice | null = null;
  private isConnected: boolean = false;
  private textBuffer: string = '';
  private textDecoder: TextDecoder = new TextDecoder('utf-8');
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
   * Request Bluetooth device advertising Nordic UART Service.
   *
   * Strategy: ask the browser to show ALL BLE devices that advertise
   * the Nordic UART Service UUID. The user picks their glove from the list.
   * We also accept devices with common name prefixes as an optional hint.
   */
  public async connect(): Promise<boolean> {
    if (!this.isSupported()) {
      this.notifyStatus(false, 'Web Bluetooth API is not supported in this browser. Use Chrome or Edge on desktop.');
      return false;
    }

    try {
      this.notifyStatus(false, 'Opening BLE device picker — select your SIGNOVA glove...');
      const navBluetooth = (navigator as any).bluetooth;

      // Use acceptAllDevices + optionalServices so ANY BLE device that
      // actually provides the Nordic UART service can be picked.
      // This avoids the strict-filter "no matching devices" error when
      // the firmware advertises the service UUID but a different name.
      this.device = await navBluetooth.requestDevice({
        acceptAllDevices: true,
        optionalServices: [NORDIC_UART_SERVICE_UUID],
      });

      if (!this.device) {
        throw new Error('Device selection cancelled');
      }

      // Listen for hardware-side disconnection
      this.device.addEventListener('gattserverdisconnected', this.onDisconnected.bind(this));

      this.notifyStatus(false, `Connecting to ${this.device.name || 'BLE device'}...`);
      this.gattServer = (await this.device.gatt?.connect()) || null;

      if (!this.gattServer) {
        throw new Error('Failed to connect to GATT server');
      }

      // Look up Nordic UART Service
      let service: any;
      try {
        service = await this.gattServer.getPrimaryService(NORDIC_UART_SERVICE_UUID);
      } catch {
        throw new Error(
          `Device "${this.device.name || 'unknown'}" does not expose the Nordic UART Service. ` +
          `Make sure your Arduino sketch #includes BLEUartService and advertises service UUID ${NORDIC_UART_SERVICE_UUID}.`
        );
      }

      // Subscribe to TX characteristic notifications (device → browser)
      this.txCharacteristic = await service.getCharacteristic(UART_TX_CHARACTERISTIC_UUID);
      await this.txCharacteristic.startNotifications();
      this.txCharacteristic.addEventListener(
        'characteristicvaluechanged',
        this.handleNotification.bind(this)
      );

      this.notifyStatus(true, `Connected to ${this.device.name || 'SIGNOVA Glove'} via BLE`);
      return true;
    } catch (err: any) {
      if (err.name === 'NotFoundError' || err.message?.includes('cancelled')) {
        this.notifyStatus(false, 'BLE pairing cancelled by user');
      } else {
        console.warn('[BLE] Connection error:', err);
        this.notifyStatus(false, err.message || 'BLE connection failed');
      }
      return false;
    }
  }

  /**
   * Process incoming BLE notification chunks.
   * Handles both:
   *  - Binary packets: 3 × uint16 little-endian (6 bytes) → "idx,mid,rng"
   *  - ASCII packets:  UTF-8 text, possibly chunked, with \n line endings
   */
  private handleNotification(event: Event): void {
    const target = event.target as any;
    if (!target || !target.value) return;

    const dataView: DataView = target.value;
    const receiveTime = performance.now();

    // Detect binary packet: exactly 6 bytes = 3 × uint16
    if (dataView.byteLength === 6) {
      const idx = dataView.getUint16(0, true);
      const mid = dataView.getUint16(2, true);
      const rng = dataView.getUint16(4, true);
      console.debug('[BLE] Binary packet:', idx, mid, rng);
      serialService.parseLine(`${idx},${mid},${rng}`, receiveTime);
      return;
    }

    // ASCII text chunk — buffer until we have a full line
    const textChunk = this.textDecoder.decode(dataView, { stream: true });
    this.textBuffer += textChunk;

    let newlineIndex: number;
    while ((newlineIndex = this.textBuffer.indexOf('\n')) >= 0) {
      const line = this.textBuffer.slice(0, newlineIndex).trim();
      this.textBuffer = this.textBuffer.slice(newlineIndex + 1);

      if (line.length > 0) {
        console.debug('[BLE] ASCII line:', line);
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

    this.textBuffer = '';
    this.notifyStatus(false, 'BLE Disconnected');
  }

  private onDisconnected(): void {
    this.isConnected = false;
    this.gattServer = null;
    this.txCharacteristic = null;
    this.textBuffer = '';
    this.notifyStatus(false, 'Bluetooth connection lost — click "Connect BLE Wireless" to reconnect');
  }
}

export const bleService = new BLEService();
export default bleService;
