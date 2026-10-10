// Web Bluetooth (BLE) Service for SIGNOVA Glove
// Team Syntropy - Seeed XIAO nRF52840 Sense
// Supports Nordic UART Service (NUS) wireless streaming of 3 flex sensors (Index, Middle, Ring)
// Seamlessly decodes both ASCII "f1,f2,f3\n" and binary uint16 packets.

/* eslint-disable @typescript-eslint/no-explicit-any */

import { serialService } from './serialService';

// Nordic UART Service UUIDs — MUST be lowercase for Web Bluetooth API
export const NORDIC_UART_SERVICE_UUID    = '6e400001-b5a3-f393-e0a9-e50e24dcca9e';
export const UART_TX_CHARACTERISTIC_UUID = '6e400003-b5a3-f393-e0a9-e50e24dcca9e'; // Device → Browser (Notify)
export const UART_RX_CHARACTERISTIC_UUID = '6e400002-b5a3-f393-e0a9-e50e24dcca9e'; // Browser → Device (Write)

// All BLE name variants the firmware might use (case-sensitive)
const BLE_NAME_VARIANTS = ['SIGNOVA', 'Signova', 'signova'];

type BLEServer     = any;
type BLECharacteristic = any;
type BLEDevice     = any;

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
   * Show the BLE device picker.
   *
   * Filter strategy (OR logic — device matches if it satisfies ANY filter):
   *   1. Device name is exactly "SIGNOVA" / "Signova" / "signova"
   *   2. Device advertises the Nordic UART Service UUID
   *
   * Either condition is enough. The optional service list tells Chrome to
   * give us access to the NUS service regardless of which filter matched.
   */
  public async connect(): Promise<boolean> {
    if (!this.isSupported()) {
      this.notifyStatus(false, 'Web Bluetooth is not supported. Use Chrome or Edge on desktop.');
      return false;
    }

    try {
      this.notifyStatus(false, 'Scanning for SIGNOVA BLE glove...');
      const navBluetooth = (navigator as any).bluetooth;

      // Build OR-combined filter list:
      //   – one filter per name variant
      //   – one filter matching any NUS device (catches firmware that uses a different name)
      const nameFilters = BLE_NAME_VARIANTS.map((name) => ({ name }));
      const serviceFilter = { services: [NORDIC_UART_SERVICE_UUID] };

      this.device = await navBluetooth.requestDevice({
        filters: [...nameFilters, serviceFilter],
        optionalServices: [NORDIC_UART_SERVICE_UUID],
      });

      if (!this.device) throw new Error('Device selection cancelled');

      // Listen for hardware-side disconnection
      this.device.addEventListener('gattserverdisconnected', this.onDisconnected.bind(this));

      this.notifyStatus(false, `Connecting to ${this.device.name || 'SIGNOVA'}...`);
      this.gattServer = (await this.device.gatt?.connect()) || null;

      if (!this.gattServer) throw new Error('Failed to connect to GATT server');

      // Get Nordic UART Service
      let service: any;
      try {
        service = await this.gattServer.getPrimaryService(NORDIC_UART_SERVICE_UUID);
      } catch {
        throw new Error(
          `"${this.device.name || 'Device'}" connected but the Nordic UART Service was not found. ` +
          `Make sure your Arduino sketch calls BLE.setAdvertisedService(uartService) ` +
          `and includes the NUS UUID (${NORDIC_UART_SERVICE_UUID}).`
        );
      }

      // Subscribe to TX notifications (device → browser)
      this.txCharacteristic = await service.getCharacteristic(UART_TX_CHARACTERISTIC_UUID);
      await this.txCharacteristic.startNotifications();
      this.txCharacteristic.addEventListener(
        'characteristicvaluechanged',
        this.handleNotification.bind(this)
      );

      this.notifyStatus(true, `Connected to ${this.device.name || 'SIGNOVA'} via BLE ✓`);
      return true;

    } catch (err: any) {
      // User cancelled the picker — don't treat it as an error
      if (err.name === 'NotFoundError' || err.message?.toLowerCase().includes('cancel')) {
        this.notifyStatus(false, 'BLE picker closed. Click "Connect BLE Wireless" to try again.');
      } else {
        console.warn('[BLE] Connection error:', err);
        this.notifyStatus(false, err.message || 'BLE connection failed');
      }
      return false;
    }
  }

  /**
   * Handle incoming BLE notification chunk.
   * Supports:
   *   - Binary: exactly 6 bytes → 3 × uint16 little-endian → "idx,mid,rng"
   *   - ASCII:  UTF-8 text, potentially chunked, delimited by '\n'
   */
  private handleNotification(event: Event): void {
    const target = event.target as any;
    if (!target?.value) return;

    const dataView: DataView = target.value;
    const receiveTime = performance.now();

    // Binary packet: 3 × uint16 = exactly 6 bytes
    if (dataView.byteLength === 6) {
      const idx = dataView.getUint16(0, true);
      const mid = dataView.getUint16(2, true);
      const rng = dataView.getUint16(4, true);
      serialService.parseLine(`${idx},${mid},${rng}`, receiveTime);
      return;
    }

    // ASCII text — buffer until we have full lines
    const chunk = this.textDecoder.decode(dataView, { stream: true });
    this.textBuffer += chunk;

    let nl: number;
    while ((nl = this.textBuffer.indexOf('\n')) >= 0) {
      const line = this.textBuffer.slice(0, nl).trim();
      this.textBuffer = this.textBuffer.slice(nl + 1);
      if (line.length > 0) {
        serialService.parseLine(line, receiveTime);
      }
    }
  }

  public async disconnect(): Promise<void> {
    if (this.txCharacteristic) {
      try { await this.txCharacteristic.stopNotifications(); } catch { /* ignore */ }
      this.txCharacteristic = null;
    }
    if (this.gattServer?.connected) {
      try { this.gattServer.disconnect(); } catch { /* ignore */ }
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
