// SIGNOVA Hardware & System Configuration
// Team Syntropy - Gesture-to-Voice Glove Interface

export const SENSOR_COUNT = 3;

export const CONFIG = {
  PROJECT_NAME: 'SIGNOVA',
  TEAM_NAME: 'Team Syntropy',
  TAGLINE: 'Turning Gestures Into a Voice',
  HARDWARE: 'Seeed XIAO nRF52840 Sense / Arduino Uno',
  SERIAL_BAUD_RATE: 115200,
  STREAM_RATE_HZ: 50,
  SMOOTHING_SAMPLES: 5,
  GESTURE_HOLD_DURATION_MS: 400, // Gesture must be held 400 ms before firing
  TTS_COOLDOWN_MS: 1500, // 1.5s speech cooldown on label change

  // Active finger channels in order
  FINGERS: [
    { id: 'index', name: 'Index Finger', channel: 0, defaultStraight: 250, defaultBent: 780 },
    { id: 'middle', name: 'Middle Finger', channel: 1, defaultStraight: 260, defaultBent: 790 },
    { id: 'ring', name: 'Ring Finger', channel: 2, defaultStraight: 240, defaultBent: 770 },
  ],

  // 3-bit binary pattern gesture dictionary (bent=1, straight=0, order: index, middle, ring)
  GESTURE_MAP: {
    '000': 'HELLO',
    '111': 'YES',
    '011': 'ONE',
    '001': 'VICTORY',
    '100': 'OK',
    '110': 'THREE',
    '101': 'NO',
    '010': 'ROCK',
  },

  GESTURE_DESCRIPTIONS: {
    'HELLO':   'All 3 fingers straight',
    'YES':     'All 3 fingers bent',
    'ONE':     'Index straight, middle & ring bent',
    'VICTORY': 'Index & middle straight, ring bent',
    'OK':      'Middle & ring straight, index bent',
    'THREE':   'Ring straight, index & middle bent',
    'NO':      'Middle straight, index & ring bent',
    'ROCK':    'Index & ring straight, middle bent',
  },

  // BLE UUIDs (Nordic UART Service) — MUST be lowercase for Web Bluetooth API
  BLE_SERVICE_UUID: '6e400001-b5a3-f393-e0a9-e50e24dcca9e',
  BLE_TX_CHAR_UUID: '6e400003-b5a3-f393-e0a9-e50e24dcca9e', // Notify: device → browser
  BLE_RX_CHAR_UUID: '6e400002-b5a3-f393-e0a9-e50e24dcca9e', // Write:  browser → device

  COLORS: {
    bg: '#08090A',
    surface: '#0E1114',
    surfaceElevated: '#14181D',
    border: '#1F242A',
    borderActive: '#2EE6A6',
    accent: '#2EE6A6',
    accentMuted: '#165B44',
    textPrimary: '#FFFFFF',
    textMuted: '#6B7280',
    textDim: '#404650',
    warning: '#F59E0B',
    error: '#EF4444',
  },
};

export default CONFIG;
