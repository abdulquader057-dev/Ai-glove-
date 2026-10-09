// Strongly-typed config wrapper for SIGNOVA
import { CONFIG, SENSOR_COUNT } from '../config.js';

export { SENSOR_COUNT, CONFIG };

export type GestureCode = '000' | '111' | '011' | '001' | '100' | '110' | '101' | '010';
export type GestureLabel = 'HELLO' | 'YES' | 'ONE' | 'VICTORY' | 'OK' | 'THREE' | 'NO' | 'ROCK' | 'NONE';

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
