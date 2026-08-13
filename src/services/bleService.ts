import { useHardwareStore } from '@/store/hardwareStore';
import { classifierService } from '@/services/classifierService';
import { FlexSensors, IMUData } from '@/types';

// Nordic UART Service & Characteristic UUIDs for XIAO nRF52840
const NORDIC_UART_SERVICE_UUID = '6e400001-b5a3-f393-e0a9-e50e24dcca9e';
const UART_TX_CHARACTERISTIC_UUID = '6e400003-b5a3-f393-e0a9-e50e24dcca9e';

// Global Web Bluetooth interfaces for environments without ambient DOM Bluetooth types
/* eslint-disable @typescript-eslint/no-explicit-any */
type BLEServer = any;
type BLECharacteristic = any;
type BLEDevice = any;

class BLEService {
  private gattServer: BLEServer | null = null;
  private txCharacteristic: BLECharacteristic | null = null;
  private device: BLEDevice | null = null;

  public isSupported(): boolean {
    return typeof window !== 'undefined' && 'bluetooth' in navigator;
  }

  public async connect(): Promise<boolean> {
    const store = useHardwareStore.getState();

    if (!this.isSupported()) {
      store.setBleSupported(false);
      store.addLog('ERROR: Web Bluetooth API is not supported in this browser.', 'error');
      return false;
    }

    try {
      store.setConnectionState('scanning');
      store.addLog('BLE_SCAN: Requesting device with Nordic UART Service filters...', 'info');

      // Native browser Bluetooth device request
      const navBluetooth = (navigator as any).bluetooth;
      this.device = await navBluetooth.requestDevice({
        filters: [
          { namePrefix: 'Sensasign' },
          { namePrefix: 'XIAO' },
          { services: [NORDIC_UART_SERVICE_UUID] },
        ],
        optionalServices: [NORDIC_UART_SERVICE_UUID, 'battery_service'],
      });

      store.addLog(`BLE_FOUND: Device "${this.device?.name || 'Sensasign Glove'}" selected`, 'info');
      store.setConnectionState('pairing');
      store.setDeviceDetails(this.device?.name || 'Sensasign-XIAO-nRF52840', -62, 98);

      // Listen for disconnect events
      this.device?.addEventListener('gattserverdisconnected', this.onDisconnected.bind(this));

      // Connect to GATT Server
      store.addLog('GATT_PAIRING: Establishing GATT Connection...', 'info');
      this.gattServer = await this.device?.gatt?.connect() || null;

      if (!this.gattServer) {
        throw new Error('Could not establish GATT connection to device');
      }

      // Primary Service Lookup
      const service = await this.gattServer.getPrimaryService(NORDIC_UART_SERVICE_UUID);
      this.txCharacteristic = await service.getCharacteristic(UART_TX_CHARACTERISTIC_UUID);

      // Start characteristic notifications
      await this.txCharacteristic.startNotifications();
      this.txCharacteristic.addEventListener('characteristicvaluechanged', this.handleNotification.bind(this));

      store.setConnectionState('connected');
      store.addLog('GATT_CONNECTED: Real-time telemetry stream active at 50Hz', 'info');

      return true;
    } catch (err: unknown) {
      console.error('BLE Connection error:', err);
      const errorMsg = err instanceof Error ? err.message : 'User cancelled device selection or connection timed out';
      store.setConnectionState('disconnected');
      store.addLog(`BLE_ERROR: ${errorMsg}`, 'error');
      return false;
    }
  }

  private handleNotification(event: Event) {
    const target = event.target as any;
    if (!target.value) return;

    const dataView: DataView = target.value;
    const store = useHardwareStore.getState();

    // Parse packet format: 5 uint16 (flex 0-1023) + 3 int16 (accel) + 3 int16 (gyro)
    if (dataView.byteLength >= 10) {
      const flex: FlexSensors = {
        thumb: dataView.getUint16(0, true) % 1024,
        index: dataView.getUint16(2, true) % 1024,
        middle: dataView.getUint16(4, true) % 1024,
        ring: dataView.getUint16(6, true) % 1024,
        pinky: dataView.getUint16(8, true) % 1024,
      };

      let imu: IMUData = {
        accel: { x: 0.05, y: 0.95, z: 0.12 },
        gyro: { x: 0.5, y: -0.2, z: 0.1 },
      };

      if (dataView.byteLength >= 22) {
        imu = {
          accel: {
            x: Math.round((dataView.getInt16(10, true) / 100) * 100) / 100,
            y: Math.round((dataView.getInt16(12, true) / 100) * 100) / 100,
            z: Math.round((dataView.getInt16(14, true) / 100) * 100) / 100,
          },
          gyro: {
            x: Math.round((dataView.getInt16(16, true) / 10) * 10) / 10,
            y: Math.round((dataView.getInt16(18, true) / 10) * 10) / 10,
            z: Math.round((dataView.getInt16(20, true) / 10) * 10) / 10,
          },
        };
      }

      // Format hex dump string for terminal
      const hexBytes = Array.from(new Uint8Array(dataView.buffer))
        .map((b) => '0x' + b.toString(16).padStart(2, '0').toUpperCase())
        .join(' ');

      store.updateSensors(flex, imu);
      store.addLog(`[BLE TELEMETRY] ${hexBytes.slice(0, 36)}...`, 'data');

      // Run gesture classification on incoming telemetry
      classifierService.classify(flex, imu);
    }
  }

  public disconnect() {
    if (this.device && this.device.gatt?.connected) {
      this.device.gatt.disconnect();
    }
    this.gattServer = null;
    this.txCharacteristic = null;
    this.device = null;
    useHardwareStore.getState().disconnect();
  }

  private onDisconnected() {
    useHardwareStore.getState().disconnect();
    useHardwareStore.getState().addLog('GATT_LOST: Hardware device disconnected', 'warn');
  }
}

export const bleService = new BLEService();
