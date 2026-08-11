import { eventBus } from '../utils/events.js';
import { BLE_CONFIG } from '../config/ble.config.js';
import { parseSensorPacket } from './sensor-parser.js';

class BLEService {
  constructor() {
    this.device = null;
    this.server = null;
    this.sensorChar = null;
    this.commandChar = null;
    
    this.connected = false;
    this.deviceName = null;
  }

  isSupported() {
    return navigator && navigator.bluetooth && typeof navigator.bluetooth.requestDevice === 'function';
  }

  isConfigured() {
    return BLE_CONFIG && BLE_CONFIG.SERVICE_UUID && BLE_CONFIG.SENSOR_CHARACTERISTIC_UUID;
  }

  async connect() {
    if (!this.isSupported()) {
      throw new Error('BLE is not supported in this browser.');
    }
    
    if (!this.isConfigured()) {
      throw new Error('BLE UUIDs are not configured.');
    }
    
    try {
      eventBus.emit('ble-status', { status: 'requesting' });
      
      this.device = await navigator.bluetooth.requestDevice({
        filters: [{ namePrefix: BLE_CONFIG.DEVICE_NAME_PREFIX || 'AIGlove' }],
        optionalServices: [BLE_CONFIG.SERVICE_UUID]
      });
      
      this.deviceName = this.device.name;
      
      this.device.addEventListener('gattserverdisconnected', this._handleDisconnect.bind(this));
      
      eventBus.emit('ble-status', { status: 'connecting' });
      
      this.server = await this.device.gatt.connect();
      
      eventBus.emit('ble-status', { status: 'discovering_services' });
      
      const service = await this.server.getPrimaryService(BLE_CONFIG.SERVICE_UUID);
      
      this.sensorChar = await service.getCharacteristic(BLE_CONFIG.SENSOR_CHARACTERISTIC_UUID);
      
      if (BLE_CONFIG.COMMAND_CHARACTERISTIC_UUID) {
        try {
          this.commandChar = await service.getCharacteristic(BLE_CONFIG.COMMAND_CHARACTERISTIC_UUID);
        } catch (e) {
          console.warn('Command characteristic not available:', e);
        }
      }
      
      await this.sensorChar.startNotifications();
      this.sensorChar.addEventListener('characteristicvaluechanged', this._handleSensorNotification.bind(this));
      
      this.connected = true;
      eventBus.emit('ble-status', { status: 'connected', deviceName: this.deviceName });
      
      return true;
    } catch (error) {
      console.error('BLE connection failed:', error);
      this._cleanup();
      eventBus.emit('ble-status', { status: 'error', error: error.message });
      throw error;
    }
  }

  async disconnect() {
    if (!this.device || !this.device.gatt.connected) {
      return;
    }
    
    try {
      if (this.sensorChar) {
        await this.sensorChar.stopNotifications();
        this.sensorChar.removeEventListener('characteristicvaluechanged', this._handleSensorNotification.bind(this));
      }
      this.device.gatt.disconnect();
    } catch (error) {
      console.error('Error during disconnect:', error);
    } finally {
      this._cleanup();
    }
  }

  async sendCommand(commandBytes) {
    if (!this.connected || !this.commandChar) {
      console.warn('Cannot send command: not connected or characteristic unavailable');
      return false;
    }
    
    try {
      const buffer = new Uint8Array(commandBytes);
      await this.commandChar.writeValue(buffer);
      return true;
    } catch (error) {
      console.error('Failed to send command:', error);
      return false;
    }
  }

  getStatus() {
    return {
      connected: this.connected,
      deviceName: this.deviceName,
      supported: this.isSupported(),
      configured: this.isConfigured()
    };
  }

  _handleSensorNotification(event) {
    const dataView = event.target.value;
    const sensorData = parseSensorPacket(dataView);
    
    if (sensorData) {
      eventBus.emit('sensor-update', sensorData);
    }
  }

  _handleDisconnect() {
    console.log('BLE device disconnected');
    this._cleanup();
    eventBus.emit('ble-status', { status: 'disconnected' });
    
    if (BLE_CONFIG.AUTO_RECONNECT) {
      // Implement backoff or simple auto-reconnect strategy here
      console.log('Auto-reconnect configured, but needs implementation.');
    }
  }

  _cleanup() {
    this.connected = false;
    if (this.device) {
      this.device.removeEventListener('gattserverdisconnected', this._handleDisconnect);
    }
    this.device = null;
    this.server = null;
    this.sensorChar = null;
    this.commandChar = null;
    this.deviceName = null;
  }
}

export const bleService = new BLEService();
