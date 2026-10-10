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

export interface ToastMessage {
  id: string;
  message: string;
  type: 'info' | 'success' | 'warn' | 'error';
}

const CALIBRATION_STORAGE_KEY = 'signova_calibration_v1';
const HISTORY_STORAGE_KEY = 'signova_history_v1';
const ENGINE_STORAGE_KEY = 'signova_engine_source_v1';

const DEFAULT_CALIBRATION: CalibrationState = {
  straight: [250, 260, 240],
  bent: [780, 790, 770],
  thresholds: [515, 525, 505],
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
        return { straight: parsed.straight, bent: parsed.bent, thresholds };
      }
    }
  } catch { /* Fallback */ }
  return DEFAULT_CALIBRATION;
}

function loadSavedEngine(): 'threshold' | 'random_forest' {
  if (typeof window === 'undefined') return 'threshold';
  try {
    const saved = localStorage.getItem(ENGINE_STORAGE_KEY);
    if (saved === 'random_forest' || saved === 'threshold') return saved;
  } catch { /* Fallback */ }
  return 'threshold';
}

function loadSavedHistory(): TelemetryPacket[] {
  if (typeof window === 'undefined') return [];
  try {
    const saved = localStorage.getItem(HISTORY_STORAGE_KEY);
    if (saved) return JSON.parse(saved).slice(0, 500);
  } catch { /* Fallback */ }
  return [];
}

interface SignovaStore {
  // Navigation
  activeView: 'connect' | 'live' | 'calibrate';
  setActiveView: (view: 'connect' | 'live' | 'calibrate') => void;

  // Calibration Modal
  isCalibrationOpen: boolean;
  setCalibrationOpen: (open: boolean) => void;

  // Settings Modal
  isSettingsOpen: boolean;
  setSettingsOpen: (open: boolean) => void;

  // Toast System
  toast: ToastMessage | null;
  showToast: (message: string, type?: 'info' | 'success' | 'warn' | 'error') => void;
  clearToast: () => void;

  // Stream Rate
  streamHz: number;
  lastPacketTime: number;

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
  normalizedSensors: number[];
  binaryBits: [number, number, number];
  binaryString: string;

  // Classification & Hold Logic
  candidateGesture: GestureLabel;
  candidateStartTime: number;
  activeGesture: GestureLabel;
  activeConfidence: number;
  realLatencyMs: number;
  holdProgress: number;
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
  isSpeaking: boolean;
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
  activeView: 'live',
  setActiveView: (view) => set({ activeView: view }),

  isCalibrationOpen: false,
  setCalibrationOpen: (open) => set({ isCalibrationOpen: open }),

  isSettingsOpen: false,
  setSettingsOpen: (open) => set({ isSettingsOpen: open }),

  toast: null,
  showToast: (message: string, type: 'info' | 'success' | 'warn' | 'error' = 'info') => {
    const id = `t_${Date.now()}`;
    set({ toast: { id, message, type } });
    setTimeout(() => {
      if (get().toast?.id === id) {
        set({ toast: null });
      }
    }, 3200);
  },
  clearToast: () => set({ toast: null }),

  streamHz: 0,
  lastPacketTime: 0,

  connectionStatus: 'disconnected',
  connectionMedium: 'none',
  statusMessage: 'Ready — connect via USB Serial (115200 baud) or BLE',
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
    get().showToast('Straight calibration saved', 'success');
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
    get().showToast('Bent calibration saved', 'success');
  },

  resetCalibration: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(CALIBRATION_STORAGE_KEY);
    }
    set({ calibration: DEFAULT_CALIBRATION });
    get().showToast('Calibration reset to defaults', 'warn');
  },

  history: loadSavedHistory(),

  clearHistory: () => {
    if (typeof window !== 'undefined') localStorage.removeItem(HISTORY_STORAGE_KEY);
    set({ history: [] });
    get().showToast('History log cleared', 'info');
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
    get().showToast('Session exported as JSON', 'success');
  },

  exportHistoryCSV: () => {
    const { history } = get();
    const headers = ['ID', 'Timestamp', 'TimeString', 'Label', 'BinaryPattern', 'ConfidencePct', 'LatencyMs', 'RawIndex', 'RawMiddle', 'RawRing', 'Source', 'HeldMs'];
    const rows = history.map(h => [
      h.id, h.timestamp, `"${h.timeString}"`, h.label, `"${h.binaryString}"`,
      h.confidence, h.latencyMs, h.raw[0] ?? 0, h.raw[1] ?? 0, h.raw[2] ?? 0, h.source, h.heldMs,
    ]);
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `signova-session-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    get().showToast('Session exported as CSV', 'success');
  },

  isMuted: speechService.getSettings().muted,
  isSpeaking: false,
  toggleMute: () => {
    const next = speechService.toggleMute();
    set({ isMuted: next });
    get().showToast(next ? 'Audio muted' : 'Voice synthesis active', 'info');
  },

  setClassifierSource: (source) => {
    if (typeof window !== 'undefined') localStorage.setItem(ENGINE_STORAGE_KEY, source);
    set({ classifierSource: source });
    get().showToast(`Classifier set to ${source === 'random_forest' ? 'Random Forest' : 'Thresholds'}`, 'info');
  },

  connectSerial: async () => {
    set({ connectionStatus: 'connecting', statusMessage: 'Selecting serial port...' });
    const success = await serialService.connect();
    if (success) {
      set({
        connectionStatus: 'connected', connectionMedium: 'usb_serial',
        statusMessage: `Streaming @ ${CONFIG.SERIAL_BAUD_RATE} baud`,
        activeView: 'live', isSimulation: false, streamHz: 50,
      });
      get().showToast('Connected via USB Serial (115200 baud)', 'success');
    } else {
      set({ connectionStatus: 'disconnected', statusMessage: 'Serial connection failed or cancelled.', streamHz: 0 });
    }
    return success;
  },

  disconnectSerial: async () => {
    await serialService.disconnect();
    set({ connectionStatus: 'disconnected', connectionMedium: 'none', statusMessage: 'Serial port disconnected.', streamHz: 0 });
    get().showToast('Serial port disconnected', 'info');
  },

  connectBLE: async () => {
    set({ connectionStatus: 'connecting', statusMessage: 'Opening BLE device picker...' });
    const success = await bleService.connect();
    if (success) {
      set({
        connectionStatus: 'connected', connectionMedium: 'ble',
        statusMessage: 'Streaming via Web Bluetooth (Nordic UART ~50 Hz)',
        activeView: 'live', isSimulation: false, streamHz: 50,
      });
      get().showToast('Connected via Bluetooth LE', 'success');
    } else {
      const current = useSignovaStore.getState();
      if (current.connectionStatus !== 'error') {
        set({ connectionStatus: 'disconnected', statusMessage: 'BLE connection failed or cancelled. Try again.', streamHz: 0 });
      }
    }
    return success;
  },

  disconnectBLE: async () => {
    await bleService.disconnect();
    set({ connectionStatus: 'disconnected', connectionMedium: 'none', statusMessage: 'Bluetooth disconnected.', streamHz: 0 });
    get().showToast('Bluetooth disconnected', 'info');
  },

  startSimulation: () => {
    simulationService.startSimulation();
    set({
      connectionStatus: 'connected', connectionMedium: 'simulation',
      statusMessage: 'SIMULATION ACTIVE — Keys 1-8 trigger gestures',
      isSimulation: true, activeView: 'live', streamHz: 50,
    });
    get().showToast('Simulation Mode Active (Keys 1–8)', 'info');
  },

  stopSimulation: () => {
    simulationService.stopSimulation();
    set({
      connectionStatus: 'disconnected', connectionMedium: 'none',
      statusMessage: 'Simulation stopped.', isSimulation: false,
      isReplaying: false, streamHz: 0,
    });
    get().showToast('Simulation stopped', 'info');
  },

  toggleReplay: () => {
    const isReplaying = simulationService.toggleReplayTrace();
    set({ isReplaying });
    get().showToast(isReplaying ? 'Replay started' : 'Replay stopped', 'info');
  },

  processIncomingPacket: (packet: RawSerialPacket) => {
    const state = get();
    const raw = packet.raw;
    const now = performance.now();

    // 1. Moving average smoothing (5 samples)
    const smoothed = filterService.filter(raw);

    // 2. Normalize [0.0–1.0] using calibration
    const { calibration, classifierSource } = state;
    const normalized: number[] = [];
    for (let i = 0; i < SENSOR_COUNT; i++) {
      let sVal = calibration.straight[i] ?? 250;
      let bVal = calibration.bent[i] ?? 780;
      
      // Auto-scale calibration if sensor returns 12-bit / 14-bit ADC values (> 1023)
      if (smoothed[i] > 1023 && Math.max(sVal, bVal) < 1000) {
        const scale = smoothed[i] > 4095 ? 16384 / 1024 : 4096 / 1024;
        sVal *= scale;
        bVal *= scale;
      }

      const minVal = Math.min(sVal, bVal);
      const maxVal = Math.max(sVal, bVal);
      const range = maxVal - minVal || 1;
      let norm = (smoothed[i] - minVal) / range;
      if (bVal < sVal) norm = 1.0 - norm;
      normalized.push(Math.max(0.0, Math.min(1.0, norm)));
    }

    // 3. Classify
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

    // 4. 400ms Hold Debounce
    const HOLD_TIME_MS = CONFIG.GESTURE_HOLD_DURATION_MS;
    let nextCandidate = state.candidateGesture;
    let nextCandidateStart = state.candidateStartTime;
    let nextActiveGesture: GestureLabel = state.activeGesture;
    let nextHoldProgress = 0;
    let triggeredFlash = false;

    if (instantLabel !== state.candidateGesture) {
      nextCandidate = instantLabel;
      nextCandidateStart = now;
      nextHoldProgress = 0;
      nextActiveGesture = 'NONE';
    } else {
      const elapsedMs = now - nextCandidateStart;
      if (elapsedMs >= HOLD_TIME_MS) {
        nextHoldProgress = 100;
        if (state.activeGesture !== instantLabel) {
          nextActiveGesture = instantLabel;
          triggeredFlash = true;

          if (nextActiveGesture !== 'NONE') speechService.speakGesture(nextActiveGesture);

          const measuredLatency = Math.round((performance.now() - packet.receiveTime) * 10) / 10;

          const newEntry: TelemetryPacket = {
            id: `pk_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
            timestamp: Date.now(),
            timeString: new Date().toLocaleTimeString('en-GB', { hour12: false }) + '.' + String(Date.now() % 1000).padStart(3, '0'),
            raw: [...raw],
            smoothed: [...smoothed],
            binaryBits: instantBits,
            binaryString: instantBinaryString,
            label: nextActiveGesture,
            confidence: instantConfidence,
            latencyMs: measuredLatency,
            source: classifierSource,
            heldMs: Math.round(elapsedMs),
          };

          const updatedHistory = [newEntry, ...state.history.slice(0, 499)];
          if (typeof window !== 'undefined') {
            try { localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updatedHistory)); } catch { /* ignore */ }
          }
          set({ history: updatedHistory, realLatencyMs: measuredLatency });
        }
      } else {
        nextHoldProgress = Math.min(99, Math.round((elapsedMs / HOLD_TIME_MS) * 100));
        nextActiveGesture = 'NONE';
      }
    }

    const cycleLatency = Math.round((performance.now() - packet.receiveTime) * 10) / 10;

    // Measure live stream Hz
    let currentHz = state.streamHz;
    if (state.lastPacketTime > 0) {
      const delta = now - state.lastPacketTime;
      if (delta > 0) {
        const instantHz = Math.round(1000 / delta);
        currentHz = Math.round(currentHz * 0.85 + instantHz * 0.15);
      }
    }

    set({
      rawSensors: raw, smoothedSensors: smoothed, normalizedSensors: normalized,
      binaryBits: instantBits, binaryString: instantBinaryString,
      candidateGesture: nextCandidate, candidateStartTime: nextCandidateStart,
      activeGesture: nextActiveGesture, activeConfidence: instantConfidence,
      holdProgress: nextHoldProgress,
      realLatencyMs: cycleLatency > 0 ? cycleLatency : state.realLatencyMs,
      justConfirmed: triggeredFlash,
      streamHz: currentHz,
      lastPacketTime: now,
    });

    if (triggeredFlash) setTimeout(() => set({ justConfirmed: false }), 300);
  },
}));

// ─────────────────────────────────────────────────────────────
// Wire global service listeners → store
// ─────────────────────────────────────────────────────────────
if (typeof window !== 'undefined') {
  serialService.onPacket((packet) => useSignovaStore.getState().processIncomingPacket(packet));

  serialService.onStatusChange((status, message) => {
    useSignovaStore.setState({
      connectionStatus: status,
      statusMessage: message || status,
      streamHz: status === 'connected' ? 50 : 0,
      ...(status === 'disconnected' || status === 'error'
        ? { connectionMedium: 'none' } : {}),
    });
  });

  bleService.onStatusChange((connected, message) => {
    if (connected) {
      useSignovaStore.setState({
        connectionStatus: 'connected', connectionMedium: 'ble',
        statusMessage: message || 'BLE Connected', activeView: 'live', streamHz: 50,
      });
    } else {
      const currentMedium = useSignovaStore.getState().connectionMedium;
      if (currentMedium === 'ble') {
        useSignovaStore.setState({
          connectionStatus: 'disconnected', connectionMedium: 'none',
          statusMessage: message || 'BLE Disconnected',
          activeGesture: 'NONE', candidateGesture: 'NONE', holdProgress: 0, streamHz: 0,
        });
      }
    }
  });

  simulationService.onStateChange((isSimulating, isReplaying) => {
    useSignovaStore.setState({ isSimulation: isSimulating, isReplaying, streamHz: isSimulating ? 50 : 0 });
  });

  speechService.onSpeakingChange((isSpeaking) => {
    useSignovaStore.setState({ isSpeaking });
  });
}
