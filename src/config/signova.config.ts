// Strongly-typed config wrapper for SIGNOVA
import { CONFIG, SENSOR_COUNT } from '../config.js';

export { SENSOR_COUNT, CONFIG };

export type GestureCode = '000' | '111' | '011' | '001' | '100' | '110' | '101' | '010';
export type GestureLabel = 'HELLO' | 'YES' | 'ONE' | 'VICTORY' | 'OK' | 'THREE' | 'NO' | 'ROCK' | 'NONE';

export const SENSOR_NAMES = ['Index Finger', 'Middle Finger', 'Ring Finger'];

// Exact Gesture Mapping matching user hardware setup:
// 1. All 3 Straight: {0, 0, 0} -> HELLO
// 2. All 3 Bent: {1, 1, 1} -> YES
// 3. Index Straight, Middle & Ring Bent: {0, 1, 1} -> ONE
// 4. Index & Middle Straight, Ring Bent: {0, 0, 1} -> VICTORY
// 5. Middle & Ring Straight, Index Bent: {1, 0, 0} -> OK
// 6. Ring Straight, Index & Middle Bent: {1, 1, 0} -> THREE
// 7. Middle Straight, Index & Ring Bent: {1, 0, 1} -> NO
// 8. Index & Ring Straight, Middle Bent: {0, 1, 0} -> ROCK
export const GESTURE_MAP: Record<GestureCode, { label: GestureLabel; desc: string }> = {
  '000': { label: 'HELLO', desc: 'All 3 Straight' },
  '111': { label: 'YES', desc: 'All 3 Bent' },
  '011': { label: 'ONE', desc: 'Index Straight, Middle & Ring Bent' },
  '001': { label: 'VICTORY', desc: 'Index & Middle Straight, Ring Bent' },
  '100': { label: 'OK', desc: 'Middle & Ring Straight, Index Bent' },
  '110': { label: 'THREE', desc: 'Ring Straight, Index & Middle Bent' },
  '101': { label: 'NO', desc: 'Middle Straight, Index & Ring Bent' },
  '010': { label: 'ROCK', desc: 'Index & Ring Straight, Middle Bent' },
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
