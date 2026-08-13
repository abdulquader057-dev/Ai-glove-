export interface FlexSensors {
  thumb: number;
  index: number;
  middle: number;
  ring: number;
  pinky: number;
}

export interface Vector3D {
  x: number;
  y: number;
  z: number;
}

export interface IMUData {
  accel: Vector3D;
  gyro: Vector3D;
}

export interface GestureItem {
  id: string;
  name: string;
  emoji: string;
  mappedPhrase: string;
  flexThresholds: {
    min: [number, number, number, number, number];
    max: [number, number, number, number, number];
  };
  lastUsed?: string;
  confidence?: number;
  isCustom?: boolean;
}

export interface GloveProfile {
  gloveSerial: string;
  isFirstLogin: boolean;
  createdAt: string;
  lastLogin: string;
  voiceSpeed: number;
  voicePitch: number;
  selectedVoiceURI?: string;
}

export interface BLELogPacket {
  id: string;
  timestamp: string;
  hex: string;
  type: 'data' | 'info' | 'warn' | 'error';
}

export type ConnectionState = 'disconnected' | 'scanning' | 'pairing' | 'connected';
