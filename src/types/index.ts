export type ConnectionState = 'disconnected' | 'scanning' | 'pairing' | 'connected' | 'error';

export interface FlexSensors {
  thumb: number;
  index: number;
  middle: number;
  ring: number;
  pinky: number;
}

export interface IMUData {
  accel: { x: number; y: number; z: number };
  gyro: { x: number; y: number; z: number };
}

export interface GestureItem {
  id: string;
  name: string;
  emoji: string;
  mappedPhrase: string;
  fingerFlex: FlexSensors; // 0-100% flexion for each finger
  description?: string;
  category?: 'essential' | 'emergency' | 'social' | 'custom';
}

export interface GloveProfile {
  serialId: string; // e.g. SSG-2050-X99
  ownerName: string;
  gloveModel: string;
  calibrationDate: string;
  savedGesturesCount: number;
}

export interface BleLogEntry {
  id: string;
  timestamp: string;
  hex: string;
  type: 'info' | 'warn' | 'error' | 'data';
}

export interface PhraseToken {
  id: string;
  word: string;
  timestamp: string;
  confidence: number;
}

export type DockToolType = 'library' | 'history' | 'graph' | 'calibration' | null;

export interface CalibrationStep {
  step: number;
  title: string;
  instruction: string;
  targetPose: 'open' | 'fist' | 'neutral';
}
