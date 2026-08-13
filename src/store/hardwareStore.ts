import { create } from 'zustand';
import { ConnectionState, FlexSensors, IMUData, BLELogPacket } from '@/types';

interface HardwareStore {
  connectionState: ConnectionState;
  deviceName: string | null;
  rssi: number | null;
  batteryLevel: number;
  flexSensors: FlexSensors;
  imu: IMUData;
  isSimulation: boolean;
  logs: BLELogPacket[];
  isBleSupported: boolean;

  setConnectionState: (state: ConnectionState) => void;
  setDeviceDetails: (name: string | null, rssi?: number, battery?: number) => void;
  updateSensors: (flex: FlexSensors, imu: IMUData) => void;
  toggleSimulation: () => void;
  setSimulation: (value: boolean) => void;
  addLog: (hex: string, type?: BLELogPacket['type']) => void;
  clearLogs: () => void;
  setBleSupported: (supported: boolean) => void;
  disconnect: () => void;
}

export const useHardwareStore = create<HardwareStore>((set, get) => ({
  connectionState: 'disconnected',
  deviceName: null,
  rssi: null,
  batteryLevel: 98,
  flexSensors: { thumb: 120, index: 150, middle: 130, ring: 140, pinky: 110 },
  imu: {
    accel: { x: 0.02, y: 0.98, z: 0.15 },
    gyro: { x: 1.2, y: -0.8, z: 0.4 },
  },
  isSimulation: false,
  logs: [
    { id: '1', timestamp: new Date().toLocaleTimeString(), hex: 'SYS_INIT: BLE Stack Active', type: 'info' },
    { id: '2', timestamp: new Date().toLocaleTimeString(), hex: 'UART UUID: 6e400001-b5a3-f393-e0a9-e50e24dcca9e', type: 'info' },
  ],
  isBleSupported: true,

  setConnectionState: (connectionState) => set({ connectionState }),
  
  setDeviceDetails: (deviceName, rssi = -64, batteryLevel = 98) => 
    set({ deviceName, rssi, batteryLevel }),

  updateSensors: (flexSensors, imu) => set({ flexSensors, imu }),

  toggleSimulation: () => {
    const nextState = !get().isSimulation;
    set({ 
      isSimulation: nextState,
      connectionState: nextState ? 'connected' : 'disconnected',
      deviceName: nextState ? 'Sensasign-XIAO-nRF52840 (SIMULATED)' : null,
      rssi: nextState ? -58 : null,
    });
    get().addLog(
      nextState ? 'SIMULATION_MODE_ENABLED: Virtual telemetry stream started' : 'SIMULATION_MODE_DISABLED',
      'warn'
    );
  },

  setSimulation: (value) => set({ isSimulation: value }),

  addLog: (hex, type = 'data') => {
    const newLog: BLELogPacket = {
      id: Math.random().toString(36).substring(2, 9),
      timestamp: new Date().toLocaleTimeString(),
      hex,
      type,
    };
    set((state) => ({
      logs: [newLog, ...state.logs.slice(0, 49)],
    }));
  },

  clearLogs: () => set({ logs: [] }),

  setBleSupported: (isBleSupported) => set({ isBleSupported }),

  disconnect: () => {
    set({
      connectionState: 'disconnected',
      deviceName: null,
      rssi: null,
      isSimulation: false,
    });
    get().addLog('GATT_DISCONNECTED: Connection closed by user', 'warn');
  },
}));
