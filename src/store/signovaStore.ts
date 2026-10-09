// Central Application Store for SIGNOVA
// Team Syntropy
// Manages sensor data streaming, 400ms gesture hold debounce, calibration,
// real latency tracking, history logging, and view navigation.

import { create } from 'zustand';
import { CONFIG, SENSOR_COUNT, GestureLabel, TelemetryPacket } from '../config/signova.config';
import { filterService } from '../services/filterService';
import { classify } from '../model/classifier';
import { speechService } from '../services/speechService';
import { serialService, RawSerialPacket } from '../services/serialService';
import { bleService } from '../services/bleService';
import { simulationService } from '../services/simulationService';

export interface CalibrationState {
  straight: number[];
  bent: number[];
  thresholds: number[];
}

const CALIBRATION_STORAGE_KEY = 'signova_calibration_v1';
const HISTORY_STORAGE_KEY = 'signova_history_v1';
const ENGINE_STORAGE_KEY = 'signova_engine_source_v1';

const DEFAULT_CALIBRATION: CalibrationState = {
  straight: [250, 260, 240],
  bent: [780, 790, 770],
  thresholds: [515, 525, 505], // Midpoints
};

function loadSavedCalibration(): CalibrationState {
  if (typeof window === 'undefined') return DEFAULT_CALIBRATION;
  try {
    const saved = localStorage.getItem(CALIBRATION_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed.straight) && Array.isArray(parsed.bent)) {
        const thresholds = parsed.straight.map((s: number, i: number) =>
          Math.round((s + (parsed.bent[i] ?? 780)) / 2)
        );
        return {
          straight: parsed.straight,
          bent: parsed.bent,
          thresholds,
        };
      }
    }
  } catch {
    // Fallback
  }
  return DEFAULT_CALIBRATION;
}

function loadSavedEngine(): 'threshold' | 'random_forest' {
  if (typeof window === 'undefined') return 'threshold';
  try {
    const saved = localStorage.getItem(ENGINE_STORAGE_KEY);
    if (saved === 'random_forest' || saved === 'threshold') {
      return saved;
    }
  } catch {
    // Fallback
  }
  return 'threshold';
}

function loadSavedHistory(): TelemetryPacket[] {
  if (typeof window === 'undefined') return [];
  try {
    const saved = localStorage.getItem(HISTORY_STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved).slice(0, 50);
    }
  } catch {
    // Fallback
  }
  return [];
}

interface SignovaStore {
  // Navigation (3 Views only)
  activeView: 'connect' | 'live' | 'calibrate';
  setActiveView: (view: 'connect' | 'live' | 'calibrate') => void;

  // Connection State
  connectionStatus: 'disconnected' | 'connecting' | 'connected' | 'error';
  connectionMedium: 'usb_serial' | 'ble' | 'simulation' | 'none';
  statusMessage: string;
  isSimulation: boolean;
  isReplaying: boolean;
  webSerialSupported: boolean;
  webBleSupported: boolean;

  // Sensor Telemetry
  rawSensors: number[];
  smoothedSensors: number[];
  normalizedSensors: number[]; // 0.0 to 1.0 (0 = straight, 1 = bent)
  binaryBits: [number, number, number];
  binaryString: string;

  // Classification & Hold Logic
  candidateGesture: GestureLabel;
  candidateStartTime: number;
  activeGesture: GestureLabel;
  activeConfidence: number;
  realLatencyMs: number;
  holdProgress: number; // 0 to 100%
  justConfirmed: boolean;
  classifierSource: 'threshold' | 'random_forest';

  // Calibration State
  calibration: CalibrationState;
  setStraightCalibration: (values: number[]) => void;
  setBentCalibration: (values: number[]) => void;
  resetCalibration: () => void;

  // History & Telemetry Log
  history: TelemetryPacket[];
  clearHistory: () => void;
  exportHistoryJSON: () => void;
  exportHistoryCSV: () => void;

  // Audio & Settings
  isMuted: boolean;
  toggleMute: () => void;
  setClassifierSource: (source: 'threshold' | 'random_forest') => void;

  // Actions
  connectSerial: () => Promise<boolean>;
  disconnectSerial: () => Promise<void>;
  connectBLE: () => Promise<boolean>;
  disconnectBLE: () => Promise<void>;
  startSimulation: () => void;
  stopSimulation: () => void;
  toggleReplay: () => void;
  processIncomingPacket: (packet: RawSerialPacket) => void;
}

export const useSignovaStore = create<SignovaStore>((set, get) => ({
  activeView: 'connect',
  setActiveView: (view) => set({ activeView: view }),

  connectionStatus: 'disconnected',
  connectionMedium: 'none',
  statusMessage: 'Ready for hardware connection (Serial 115200 baud or BLE)',
  isSimulation: false,
  isReplaying: false,
  webSerialSupported: typeof window !== 'undefined' && 'serial' in navigator,
  webBleSupported: typeof window !== 'undefined' && 'bluetooth' in navigator,

  rawSensors: [250, 260, 240],
  smoothedSensors: [250, 260, 240],
  normalizedSensors: [0, 0, 0],
  binaryBits: [0, 0, 0],
  binaryString: '000',

  candidateGesture: 'NONE',
  candidateStartTime: 0,
  activeGesture: 'NONE',
  activeConfidence: 0,
  realLatencyMs: 0.0,
  holdProgress: 0,
  justConfirmed: false,
  classifierSource: loadSavedEngine(),

  calibration: loadSavedCalibration(),

  setStraightCalibration: (straightValues) => {
    const { calibration } = get();
    const straight = [...straightValues];
    const bent = [...calibration.bent];
    const thresholds = straight.map((s, i) => Math.round((s + (bent[i] ?? 780)) / 2));
    const updated: CalibrationState = { straight, bent, thresholds };
    if (typeof window !== 'undefined') {
      localStorage.setItem(CALIBRATION_STORAGE_KEY, JSON.stringify(updated));
    }
    set({ calibration: updated });
  },

  setBentCalibration: (bentValues) => {
    const { calibration } = get();
    const straight = [...calibration.straight];
    const bent = [...bentValues];
    const thresholds = straight.map((s, i) => Math.round((s + (bent[i] ?? 780)) / 2));
    const updated: CalibrationState = { straight, bent, thresholds };
    if (typeof window !== 'undefined') {
      localStorage.setItem(CALIBRATION_STORAGE_KEY, JSON.stringify(updated));
    }
    set({ calibration: updated });
  },

  resetCalibration: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(CALIBRATION_STORAGE_KEY);
    }
    set({ calibration: DEFAULT_CALIBRATION });
  },

  history: loadSavedHistory(),

  clearHistory: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(HISTORY_STORAGE_KEY);
    }
    set({ history: [] });
  },

  exportHistoryJSON: () => {
    const { history } = get();
    const blob = new Blob([JSON.stringify(history, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `signova-session-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  },

  exportHistoryCSV: () => {
    const { history } = get();
    const headers = ['ID', 'Timestamp', 'TimeString', 'Label', 'BinaryPattern', 'ConfidencePct', 'LatencyMs', 'RawIndex', 'RawMiddle', 'RawRing', 'Source', 'HeldMs'];
    const rows = history.map(h => [
      h.id,
      h.timestamp,
      `"${h.timeString}"`,
      h.label,
      `"${h.binaryString}"`,
      h.confidence,
      h.latencyMs,
      h.raw[0] ?? 0,
      h.raw[1] ?? 0,
      h.raw[2] ?? 0,
      h.source,
      h.heldMs,
    ]);
    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `signova-session-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  },

  isMuted: speechService.getSettings().muted,

  toggleMute: () => {
    const next = speechService.toggleMute();
    set({ isMuted: next });
  },

  setClassifierSource: (source) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(ENGINE_STORAGE_KEY, source);
    }
    set({ classifierSource: source });
  },

  connectSerial: async () => {
    const success = await serialService.connect();
    if (success) {
      set({
        connectionStatus: 'connected',
        connectionMedium: 'usb_serial',
        statusMessage: `Streaming Seeed XIAO / Arduino Uno @ ${CONFIG.SERIAL_BAUD_RATE} baud`,
        activeView: 'live',
        isSimulation: false,
      });
    }
    return success;
  },

  disconnectSerial: async () => {
    await serialService.disconnect();
    set({
      connectionStatus: 'disconnected',
      connectionMedium: 'none',
      statusMessage: 'Serial port disconnected.',
    });
  },

  connectBLE: async () => {
    const success = await bleService.connect();
    if (success) {
      set({
        connectionStatus: 'connected',
        connectionMedium: 'ble',
        statusMessage: 'Streaming Seeed XIAO nRF52840 via Web Bluetooth (50Hz)',
        activeView: 'live',
        isSimulation: false,
      });
    }
    return success;
  },

  disconnectBLE: async () => {
    await bleService.disconnect();
    set({
      connectionStatus: 'disconnected',
      connectionMedium: 'none',
      statusMessage: 'Bluetooth disconnected.',
    });
  },

  startSimulation: () => {
    simulationService.startSimulation();
    set({
      connectionStatus: 'connected',
      connectionMedium: 'simulation',
      statusMessage: 'SIMULATION ACTIVE — Keys 1-8 trigger gestures',
      isSimulation: true,
      activeView: 'live',
    });
  },

  stopSimulation: () => {
    simulationService.stopSimulation();
    set({
      connectionStatus: 'disconnected',
      connectionMedium: 'none',
      statusMessage: 'Simulation stopped.',
      isSimulation: false,
      isReplaying: false,
    });
  },

  toggleReplay: () => {
    const isReplaying = simulationService.toggleReplayTrace();
    set({ isReplaying });
  },

  processIncomingPacket: (packet: RawSerialPacket) => {
    const state = get();
    const raw = packet.raw;
    const now = performance.now();

    // 1. Moving average smoothing (5 samples)
    const smoothed = filterService.filter(raw);

    // 2. Normalized values [0.0 to 1.0] using calibration
    const { calibration, classifierSource } = state;
    const normalized: number[] = [];
    for (let i = 0; i < SENSOR_COUNT; i++) {
      const sVal = calibration.straight[i] ?? 250;
      const bVal = calibration.bent[i] ?? 780;
      const minVal = Math.min(sVal, bVal);
      const maxVal = Math.max(sVal, bVal);
      const range = maxVal - minVal || 1;
      let norm = (smoothed[i] - minVal) / range;
      if (bVal < sVal) norm = 1.0 - norm;
      normalized.push(Math.max(0.0, Math.min(1.0, norm)));
    }

    // 3. Instantaneous classification
    const rawResult = classify(smoothed, {
      thresholds: calibration.thresholds,
      straight: calibration.straight,
      bent: calibration.bent,
      source: classifierSource,
    });

    const instantLabel = rawResult.label as GestureLabel;
    const instantConfidence = rawResult.confidence;
    const instantBits = rawResult.bits as [number, number, number];
    const instantBinaryString = rawResult.binaryString;

    // 4. 400ms Hold Debounce Logic
    // "A gesture must be held 400 ms before it fires; otherwise show NONE"
    const HOLD_TIME_MS = CONFIG.GESTURE_HOLD_DURATION_MS; // 400ms
    let nextCandidate = state.candidateGesture;
    let nextCandidateStart = state.candidateStartTime;
    let nextActiveGesture: GestureLabel = state.activeGesture;
    let nextHoldProgress = 0;
    const nextConfidence = instantConfidence;
    let triggeredFlash = false;

    if (instantLabel !== state.candidateGesture) {
      // Changed gesture pose -> reset hold timer
      nextCandidate = instantLabel;
      nextCandidateStart = now;
      nextHoldProgress = 0;
      // Do not confirm yet
      nextActiveGesture = 'NONE';
    } else {
      // Maintaining candidate pose
      const elapsedMs = now - nextCandidateStart;
      if (elapsedMs >= HOLD_TIME_MS) {
        // Hold threshold achieved!
        nextHoldProgress = 100;
        if (state.activeGesture !== instantLabel) {
          nextActiveGesture = instantLabel;
          triggeredFlash = true;

          // Vocalize label change with 1.5s cooldown guard
          if (nextActiveGesture !== 'NONE') {
            speechService.speakGesture(nextActiveGesture);
          }

          // Measure REAL latency: from packet.receiveTime to state update
          const measuredLatency = Math.round((performance.now() - packet.receiveTime) * 10) / 10;

          // Record new confirmed entry to history
          const newEntry: TelemetryPacket = {
            id: `pk_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
            timestamp: Date.now(),
            timeString: new Date().toLocaleTimeString('en-GB', { hour12: false }) + '.' + String(Date.now() % 1000).padStart(3, '0'),
            raw: [...raw],
            smoothed: [...smoothed],
            binaryBits: instantBits,
            binaryString: instantBinaryString,
            label: nextActiveGesture,
            confidence: nextConfidence,
            latencyMs: measuredLatency,
            source: classifierSource,
            heldMs: Math.round(elapsedMs),
          };

          const updatedHistory = [newEntry, ...state.history.slice(0, 49)];
          if (typeof window !== 'undefined') {
            try {
              localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updatedHistory));
            } catch {
              // Ignore
            }
          }

          set({
            history: updatedHistory,
            realLatencyMs: measuredLatency,
          });
        }
      } else {
        // Still warming up hold timer
        nextHoldProgress = Math.min(99, Math.round((elapsedMs / HOLD_TIME_MS) * 100));
        nextActiveGesture = 'NONE';
      }
    }

    // Measure live latency for this cycle
    const cycleLatency = Math.round((performance.now() - packet.receiveTime) * 10) / 10;

    set({
      rawSensors: raw,
      smoothedSensors: smoothed,
      normalizedSensors: normalized,
      binaryBits: instantBits,
      binaryString: instantBinaryString,
      candidateGesture: nextCandidate,
      candidateStartTime: nextCandidateStart,
      activeGesture: nextActiveGesture,
      activeConfidence: nextConfidence,
      holdProgress: nextHoldProgress,
      realLatencyMs: cycleLatency > 0 ? cycleLatency : state.realLatencyMs,
      justConfirmed: triggeredFlash,
    });

    if (triggeredFlash) {
      setTimeout(() => {
        set({ justConfirmed: false });
      }, 300);
    }
  },
}));

// Wire up global serial packet listener to store
if (typeof window !== 'undefined') {
  serialService.onPacket((packet) => {
    useSignovaStore.getState().processIncomingPacket(packet);
  });

  serialService.onStatusChange((status, message) => {
    useSignovaStore.setState({
      connectionStatus: status,
      statusMessage: message || status,
    });
  });

  bleService.onStatusChange((connected, message) => {
    if (connected) {
      useSignovaStore.setState({
        connectionStatus: 'connected',
        connectionMedium: 'ble',
        statusMessage: message || 'BLE Connected',
      });
    } else if (useSignovaStore.getState().connectionMedium === 'ble') {
      useSignovaStore.setState({
        connectionStatus: 'disconnected',
        connectionMedium: 'none',
        statusMessage: message || 'BLE Disconnected',
      });
    }
  });

  simulationService.onStateChange((isSimulating, isReplaying) => {
    useSignovaStore.setState({ isSimulation: isSimulating, isReplaying });
  });
}
