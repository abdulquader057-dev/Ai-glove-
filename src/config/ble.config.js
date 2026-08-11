// ──────────────────────────────────────────────
// AI GLOVE — BLE Configuration
// ──────────────────────────────────────────────
// 
// HARDWARE INTEGRATION GUIDE:
// 1. Set DEVICE_NAME to the actual BLE advertising name
// 2. Set SERVICE_UUID to the primary GATT service UUID
// 3. Set SENSOR_CHARACTERISTIC_UUID to the sensor data notification characteristic
// 4. Set COMMAND_CHARACTERISTIC_UUID to the write characteristic for calibration/commands
// 5. Update PACKET_FORMAT to match the actual BLE data packet structure
//
// Once configured, the website will attempt real BLE connections
// instead of simulated data.
// ──────────────────────────────────────────────

export const BLE_CONFIG = {
  // ── Device Identity ──
  DEVICE_NAME: 'AI_GLOVE',                    // Development name — update when finalized
  
  // ── GATT Service & Characteristics ──
  SERVICE_UUID: null,                          // TBD — Not configured
  SENSOR_CHARACTERISTIC_UUID: null,            // TBD — Not configured (NOTIFY)
  COMMAND_CHARACTERISTIC_UUID: null,           // TBD — Not configured (WRITE)
  
  // ── Configuration Status ──
  // Automatically determined from UUID availability
  get IS_CONFIGURED() {
    return !!(this.SERVICE_UUID && this.SENSOR_CHARACTERISTIC_UUID);
  },

  get STATUS() {
    if (this.IS_CONFIGURED) return 'CONFIGURED';
    return 'NOT_CONFIGURED';
  },

  // ── Connection Settings ──
  CONNECTION: {
    autoReconnect: true,
    reconnectDelayMs: 3000,
    maxReconnectAttempts: 5,
    connectionTimeoutMs: 10000,
  },

  // ── Packet Configuration ──
  // Update this when the BLE packet format is finalized
  PACKET_FORMAT: {
    type: 'TBD',  // 'binary' | 'json' | 'csv'
    description: 'Packet format not yet defined. Update when hardware team provides specification.',
    
    // Expected logical structure (for documentation):
    // {
    //   flex: { thumb, index, middle, ring, pinky },  // 5 values
    //   imu: { x, y, z },                              // 3 values (accel or gyro)
    //   timestamp                                       // optional
    // }
    
    // Total expected values per packet
    expectedValues: 8,  // 5 flex + 3 IMU
  },

  // ── Calibration Commands ──
  // Command bytes to send during calibration (TBD)
  CALIBRATION_COMMANDS: {
    START: null,            // TBD — e.g., new Uint8Array([0x01])
    OPEN_HAND: null,        // TBD
    CLOSED_FIST: null,      // TBD
    NEUTRAL: null,          // TBD
    FINISH: null,           // TBD
  },

  // ── Sampling ──
  SAMPLING_RATE: null,       // TBD — actual sampling rate in Hz

  // ── Firmware ──
  FIRMWARE_VERSION: 'TBD',   // TBD — update from device
};

// ── Web Bluetooth Support Check ──
export function isWebBluetoothSupported() {
  return typeof navigator !== 'undefined' && 'bluetooth' in navigator;
}

// ── BLE Error Messages ──
export const BLE_ERRORS = {
  NOT_SUPPORTED: 'Web Bluetooth is not available in this browser/device. Try Chrome or Edge on desktop.',
  NOT_CONFIGURED: 'BLE UUIDs are not configured. Update ble.config.js with the actual service and characteristic UUIDs.',
  DEVICE_NOT_FOUND: `${BLE_CONFIG.DEVICE_NAME} not found. Make sure the device is powered on and advertising.`,
  CONNECTION_FAILED: 'Failed to connect to the glove. Please try again.',
  CONNECTION_LOST: 'Connection to the glove was lost.',
  INVALID_PACKET: 'Invalid sensor packet received.',
  WRITE_FAILED: 'Failed to send command to the glove.',
};
