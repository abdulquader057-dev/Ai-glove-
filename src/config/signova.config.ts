// Strongly-typed config wrapper for SIGNOVA
import { CONFIG, SENSOR_COUNT } from '../config.js';

export { SENSOR_COUNT, CONFIG };

export type GestureCode = '000' | '111' | '011' | '001' | '100' | '110' | '101' | '010';
export type GestureLabel = 'HELLO' | 'YES' | 'ONE' | 'VICTORY' | 'OK' | 'THREE' | 'NO' | 'ROCK' | 'NONE';

export const SENSOR_NAMES = ['Index Finger', 'Middle Finger', 'Ring Finger'];

export const GESTURE_MAP: Record<GestureCode, { label: GestureLabel; desc: string }> = {
  '000': { label: 'HELLO', desc: 'All Straight' },
  '111': { label: 'YES', desc: 'All Bent' },
  '011': { label: 'ONE', desc: 'Index Straight' },
  '001': { label: 'VICTORY', desc: 'Index & Mid Straight' },
  '100': { label: 'OK', desc: 'Mid & Ring Straight' },
  '110': { label: 'THREE', desc: 'Ring Straight' },
  '101': { label: 'NO', desc: 'Middle Straight' },
  '010': { label: 'ROCK', desc: 'Index & Ring Straight' },
};

export interface FingerConfig {
  id: string;
  name: string;
  channel: number;
  defaultStraight: number;
  defaultBent: number;
}

export interface CalibrationData {
  straight: number[]; // ADC values when hand is straight [index, middle, ring]
  bent: number[];     // ADC values when fingers are bent [index, middle, ring]
  thresholds: number[]; // Midpoints: (straight + bent) / 2
}

export interface TelemetryPacket {
  id: string;
  timestamp: number;
  timeString: string;
  raw: number[];
  smoothed: number[];
  binaryBits: [number, number, number];
  binaryString: string;
  label: GestureLabel;
  confidence: number;
  latencyMs: number;
  source: 'threshold' | 'random_forest';
  heldMs: number;
}
