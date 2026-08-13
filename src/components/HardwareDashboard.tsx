'use client';

import React, { useEffect } from 'react';
import Image from 'next/image';
import { useHardwareStore } from '@/store/hardwareStore';
import { useGestureStore } from '@/store/gestureStore';
import { bleService } from '@/services/bleService';
import { ttsService } from '@/services/ttsService';
import { simulationEngine } from '@/services/simulationEngine';
import { 
  Wifi, 
  WifiOff, 
  BatteryCharging, 
  Volume2, 
  Activity, 
  Terminal, 
  AlertTriangle,
  Cpu,
  Layers,
  Radio,
  Eye
} from 'lucide-react';

interface HardwareDashboardProps {
  onNavigateTo3D?: () => void;
}

export const HardwareDashboard: React.FC<HardwareDashboardProps> = ({ onNavigateTo3D }) => {
  const { 
    connectionState, 
    deviceName, 
    rssi, 
    batteryLevel, 
    flexSensors, 
    imu, 
    isSimulation, 
    logs, 
    toggleSimulation,
    isBleSupported
  } = useHardwareStore();

  const { activeGesture, confidence, inferenceTimeMs, isSpeaking } = useGestureStore();

  useEffect(() => {
    if (isSimulation) {
      simulationEngine.start();
    } else {
      simulationEngine.stop();
    }
    return () => simulationEngine.stop();
  }, [isSimulation]);

  const handleConnect = async () => {
    await bleService.connect();
  };

  const handleDisconnect = () => {
    bleService.disconnect();
  };

  const handleSpeakAgain = () => {
    if (activeGesture?.mappedPhrase) {
      ttsService.speak(activeGesture.mappedPhrase);
    }
  };

  const flexSensorsList = [
    { label: 'THUMB', val: flexSensors.thumb, max: 1023 },
    { label: 'INDEX', val: flexSensors.index, max: 1023 },
    { label: 'MIDDLE', val: flexSensors.middle, max: 1023 },
    { label: 'RING', val: flexSensors.ring, max: 1023 },
    { label: 'PINKY', val: flexSensors.pinky, max: 1023 },
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#00f0ff]/20 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded bg-[#00f0ff]/20 text-[#00f0ff] font-orbitron text-[10px] tracking-widest uppercase">
              HARDWARE TELEMETRY DASHBOARD
            </span>
            {isSimulation && (
              <span className="px-2.5 py-0.5 rounded bg-amber-500/20 text-amber-400 font-orbitron text-[10px] tracking-widest uppercase flex items-center gap-1 border border-amber-500/30">
                <AlertTriangle className="w-3 h-3" /> SIMULATION MODE ACTIVE
              </span>
            )}
          </div>
          <h1 className="font-orbitron font-extrabold text-2xl sm:text-3xl text-gradient-cyan mt-1">
            XIAO nRF52840 LIVE CONTROL
          </h1>
        </div>

        {/* SIMULATION TOGGLE */}
        <div className="flex items-center gap-3 bg-[#0a0f1e] px-4 py-2.5 rounded-xl border border-[#00f0ff]/30 shadow-[0_0_15px_rgba(0,240,255,0.1)]">
          <div className="flex flex-col">
            <span className="text-xs font-rajdhani font-bold text-white uppercase tracking-wider">
              SIMULATION MODE
            </span>
            <span className="text-[10px] text-[#94a3b8]">Synthetic 20Hz stream</span>
          </div>
          <button
            onClick={toggleSimulation}
            className={`w-12 h-6 rounded-full transition-all relative p-0.5 border ${
              isSimulation 
                ? 'bg-[#00f0ff]/20 border-[#00f0ff]' 
                : 'bg-[#030712] border-white/20'
            }`}
          >
            <div className={`w-4 h-4 rounded-full transition-transform ${
              isSimulation ? 'translate-x-6 bg-[#00f0ff] shadow-[0_0_8px_#00f0ff]' : 'translate-x-0 bg-white/40'
            }`} />
          </button>
        </div>
      </div>

      {/* Main Split Panel Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT PANEL: CONNECTION CONTROL & 3D HAND PREVIEW (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="glass-card p-6 relative overflow-hidden space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2">
                <Radio className="w-5 h-5 text-[#00f0ff]" />
                <h2 className="font-orbitron font-bold text-base text-white">HARDWARE LINK</h2>
              </div>
              <span className="text-xs font-orbitron text-[#94a3b8]">50Hz GATT</span>
            </div>

            {/* BLE Connection Button / Workflow */}
            {connectionState === 'disconnected' ? (
              <div className="space-y-4">
                <button
                  onClick={handleConnect}
                  className="btn-primary w-full text-center flex items-center justify-center gap-3 py-4 text-base"
                >
                  <Wifi className="w-5 h-5" />
                  <span>CONNECT GLOVE</span>
                </button>
                {!isBleSupported && (
                  <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs">
                    ⚠️ Web Bluetooth API not detected in this browser. Use Chrome/Edge over HTTPS or toggle Simulation Mode above.
                  </div>
                )}
              </div>
            ) : connectionState === 'scanning' || connectionState === 'pairing' ? (
              <div className="p-5 rounded-xl bg-[#030712] border border-[#00f0ff]/40 space-y-4 text-center">
                <div className="w-10 h-10 border-3 border-[#00f0ff] border-t-transparent rounded-full animate-spin mx-auto" />
                <div className="space-y-1">
                  <p className="font-orbitron text-xs text-[#00f0ff] uppercase tracking-wider">
                    {connectionState === 'scanning' ? 'Scanning for XIAO nRF52840...' : 'Pairing GATT Nordic UART...'}
                  </p>
                  <p className="text-[11px] text-[#94a3b8]">
                    UUID: 6e400001-b5a3-f393-e0a9-e50e24dcca9e
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <button
                  onClick={handleDisconnect}
                  className="btn-danger w-full text-center flex items-center justify-center gap-3 py-4 text-base"
                >
                  <WifiOff className="w-5 h-5" />
                  <span>DISCONNECT GLOVE</span>
                </button>
              </div>
            )}

            {/* Device Status Card */}
            <div className="space-y-3 pt-2">
              <span className="text-[10px] font-orbitron text-[#94a3b8] uppercase tracking-wider block">
                DEVICE TELEMETRY STATUS
              </span>

              <div className="grid grid-cols-1 gap-2.5 text-xs">
                <div className="p-3 rounded-xl bg-[#030712] border border-white/10 flex items-center justify-between">
                  <span className="text-[#94a3b8] font-rajdhani uppercase font-semibold">DEVICE NAME:</span>
                  <span className="font-orbitron text-[#00f0ff] font-medium text-right truncate max-w-[180px]">
                    {deviceName || 'NONE PAIRED'}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-[#030712] border border-white/10 flex items-center justify-between">
                  <span className="text-[#94a3b8] font-rajdhani uppercase font-semibold">BLE RSSI SIGNAL:</span>
                  <span className="font-orbitron text-white flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5 text-[#10b981]" />
                    {rssi ? `${rssi} dBm` : '-- dBm'}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-[#030712] border border-white/10 flex items-center justify-between">
                  <span className="text-[#94a3b8] font-rajdhani uppercase font-semibold">BATTERY LEVEL:</span>
                  <span className="font-orbitron text-[#10b981] flex items-center gap-1.5 font-bold">
                    <BatteryCharging className="w-4 h-4" />
                    {batteryLevel}%
                  </span>
                </div>
              </div>
            </div>

            {/* 3D PHOTOREALISTIC HUMAN HAND CALLOUT CARD */}
            <div 
              onClick={onNavigateTo3D}
              className="p-4 rounded-2xl bg-gradient-to-br from-[#00f0ff]/15 via-[#0a0f1e] to-[#8b5cf6]/20 border border-[#00f0ff]/40 shadow-[0_0_20px_rgba(0,240,255,0.2)] cursor-pointer group hover:border-[#00f0ff] transition-all space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-orbitron text-[#00f0ff] uppercase tracking-wider flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5 animate-pulse" /> 3D HOLOGRAPHIC VIEW
                </span>
                <span className="text-[10px] font-rajdhani text-white font-bold bg-[#00f0ff]/20 px-2 py-0.5 rounded uppercase">
                  OPEN LAB →
                </span>
              </div>

              <div className="relative w-full h-32 rounded-xl overflow-hidden border border-white/10 bg-[#030712] flex items-center justify-center">
                <Image
                  src="/photorealistic-3d-hand.jpg"
                  alt="3D Holographic Hand Preview"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              <p className="text-[11px] text-[#94a3b8] font-inter">
                Interactive 3D real human hand telemetry model with rotation controls &amp; exploded layers.
              </p>
            </div>

            {/* Architecture Badge */}
            <div className="p-3 rounded-xl bg-[#0066ff]/10 border border-[#0066ff]/30 text-xs space-y-1">
              <div className="flex items-center justify-between text-[#00f0ff] font-orbitron text-[11px]">
                <span className="flex items-center gap-1.5"><Cpu className="w-3.5 h-3.5" /> XIAO SENSE</span>
                <span>BLE 5.0</span>
              </div>
              <p className="text-[10px] text-[#94a3b8]">
                Quantized TFLite edge model streaming flex &amp; 6-axis IMU quaternions.
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL: LIVE I/O DASHBOARD (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* INPUT SECTION: FLEX SENSORS & IMU */}
          <div className="glass-card p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-[#00f0ff]" />
                <h2 className="font-orbitron font-bold text-base text-white">
                  REAL-TIME SENSOR INPUTS (50Hz)
                </h2>
              </div>
              <span className="text-xs font-orbitron text-[#00f0ff] animate-pulse">
                LIVE TELEMETRY
              </span>
            </div>

            {/* 5 FLEX SENSOR BARS */}
            <div className="space-y-3.5">
              {flexSensorsList.map((s, idx) => {
                const percentage = Math.min(100, Math.round((s.val / s.max) * 100));
                return (
                  <div key={s.label} className="space-y-1">
                    <div className="flex justify-between items-center text-xs font-orbitron">
                      <span className="text-[#94a3b8] font-bold">
                        FLEX SENSOR {idx + 1} ({s.label})
                      </span>
                      <span className="text-[#00f0ff] font-mono font-bold">
                        {s.val} / 1023 ({percentage}%)
                      </span>
                    </div>
                    <div className="w-full h-3 bg-[#030712] rounded-full overflow-hidden border border-white/10 p-0.5">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-[#00f0ff] via-[#0066ff] to-[#8b5cf6] shadow-[0_0_12px_#00f0ff] transition-all duration-300 ease-out"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* IMU ACCEL & GYRO READOUTS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {/* ACCEL */}
              <div className="p-4 rounded-xl bg-[#030712] border border-white/10 space-y-2">
                <span className="text-[11px] font-orbitron text-[#94a3b8] block uppercase tracking-wider">
                  IMU ACCELEROMETER (G-FORCE)
                </span>
                <div className="grid grid-cols-3 gap-2 text-center font-orbitron text-xs">
                  <div className="p-2 rounded bg-white/5 border border-white/5">
                    <span className="text-[10px] text-[#94a3b8] block">X-AXIS</span>
                    <span className="text-[#00f0ff] font-bold">{imu.accel.x}</span>
                  </div>
                  <div className="p-2 rounded bg-white/5 border border-white/5">
                    <span className="text-[10px] text-[#94a3b8] block">Y-AXIS</span>
                    <span className="text-[#00f0ff] font-bold">{imu.accel.y}</span>
                  </div>
                  <div className="p-2 rounded bg-white/5 border border-white/5">
                    <span className="text-[10px] text-[#94a3b8] block">Z-AXIS</span>
                    <span className="text-[#00f0ff] font-bold">{imu.accel.z}</span>
                  </div>
                </div>
              </div>

              {/* GYRO */}
              <div className="p-4 rounded-xl bg-[#030712] border border-white/10 space-y-2">
                <span className="text-[11px] font-orbitron text-[#94a3b8] block uppercase tracking-wider">
                  IMU GYROSCOPE (DEG/SEC)
                </span>
                <div className="grid grid-cols-3 gap-2 text-center font-orbitron text-xs">
                  <div className="p-2 rounded bg-white/5 border border-white/5">
                    <span className="text-[10px] text-[#94a3b8] block">X-ROT</span>
                    <span className="text-[#ec4899] font-bold">{imu.gyro.x}</span>
                  </div>
                  <div className="p-2 rounded bg-white/5 border border-white/5">
                    <span className="text-[10px] text-[#94a3b8] block">Y-ROT</span>
                    <span className="text-[#ec4899] font-bold">{imu.gyro.y}</span>
                  </div>
                  <div className="p-2 rounded bg-white/5 border border-white/5">
                    <span className="text-[10px] text-[#94a3b8] block">Z-ROT</span>
                    <span className="text-[#ec4899] font-bold">{imu.gyro.z}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* OUTPUT SECTION: RECOGNIZED GESTURE & TTS */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            
            {/* Gesture Output Box (7 cols) */}
            <div className="md:col-span-7 glass-card p-6 space-y-4 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs font-orbitron text-[#94a3b8] uppercase tracking-wider">
                  RECOGNIZED GESTURE
                </span>
                <span className="text-xs font-orbitron text-[#10b981] bg-[#10b981]/10 px-2 py-0.5 rounded border border-[#10b981]/30">
                  {confidence}% MATCH
                </span>
              </div>

              {/* Large Emoji + Name */}
              <div className="flex items-center gap-5 p-4 rounded-2xl bg-[#030712] border border-[#00f0ff]/30 shadow-[inset_0_0_20px_rgba(0,240,255,0.1)]">
                <div className="w-16 h-16 rounded-2xl bg-[#00f0ff]/10 border border-[#00f0ff]/50 flex items-center justify-center text-4xl shadow-[0_0_20px_rgba(0,240,255,0.3)] animate-pulse">
                  {activeGesture?.emoji || '✋'}
                </div>
                <div>
                  <h3 className="font-orbitron font-extrabold text-xl text-white tracking-widest">
                    {activeGesture?.name || 'OPEN PALM'}
                  </h3>
                  <p className="text-xs text-[#94a3b8] font-inter mt-0.5">
                    &quot;{activeGesture?.mappedPhrase || 'Hello, welcome to Sensasign AI.'}&quot;
                  </p>
                </div>
              </div>

              {/* Voice Output Row + Speak Button */}
              <div className="flex items-center justify-between pt-2 border-t border-white/10">
                <div className="flex items-center gap-2">
                  <Volume2 className={`w-5 h-5 ${isSpeaking ? 'text-[#00f0ff] animate-bounce' : 'text-[#94a3b8]'}`} />
                  <span className="text-xs font-rajdhani text-[#94a3b8]">
                    {isSpeaking ? 'SPEAKING AUDIO OUTPUT...' : 'VOICE OUTPUT READY'}
                  </span>
                </div>
                <button
                  onClick={handleSpeakAgain}
                  className="btn-outline !py-2 !px-4 !min-h-[36px] text-xs flex items-center gap-1.5"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>SPEAK</span>
                </button>
              </div>
            </div>

            {/* Inference & Confidence Metrics (5 cols) */}
            <div className="md:col-span-5 glass-card p-6 flex flex-col justify-between gap-4">
              <span className="text-xs font-orbitron text-[#94a3b8] uppercase tracking-wider">
                INFERENCE PERFORMANCE
              </span>

              {/* Circular Gauge / Counter */}
              <div className="flex items-center justify-around py-2">
                <div className="text-center">
                  <div className="w-20 h-20 rounded-full border-4 border-[#00f0ff] border-t-transparent animate-spin flex items-center justify-center mx-auto shadow-[0_0_20px_rgba(0,240,255,0.4)]">
                    <span className="font-orbitron font-bold text-sm text-white">{confidence}%</span>
                  </div>
                  <span className="text-[10px] font-orbitron text-[#94a3b8] mt-2 block">
                    CONFIDENCE
                  </span>
                </div>

                <div className="text-center">
                  <div className="w-20 h-20 rounded-full border-4 border-[#8b5cf6] flex items-center justify-center mx-auto bg-[#8b5cf6]/10 shadow-[0_0_20px_rgba(139,92,246,0.4)]">
                    <span className="font-orbitron font-bold text-sm text-[#8b5cf6]">{inferenceTimeMs}ms</span>
                  </div>
                  <span className="text-[10px] font-orbitron text-[#94a3b8] mt-2 block">
                    LATENCY
                  </span>
                </div>
              </div>
            </div>

          </div>

          {/* LIVE TERMINAL STREAM (RAW HEX BLE PACKETS) */}
          <div className="glass-card p-5 space-y-3">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-[#00f0ff]" />
                <h3 className="font-orbitron font-bold text-xs text-white">
                  RAW BLE TELEMETRY PACKET STREAM (ORBITRON HEX)
                </h3>
              </div>
              <span className="text-[10px] font-orbitron text-[#94a3b8]">
                {logs.length} PACKETS LOGGED
              </span>
            </div>

            {/* Scrollable Terminal Window */}
            <div className="terminal-stream h-36 p-3 overflow-y-auto space-y-1 text-[11px] rounded-lg">
              {logs.map((log) => (
                <div key={log.id} className="flex items-start gap-3">
                  <span className="text-[#94a3b8] shrink-0 font-mono">[{log.timestamp}]</span>
                  <span className={
                    log.type === 'error' ? 'text-red-400 font-mono' :
                    log.type === 'warn' ? 'text-amber-400 font-mono' :
                    log.type === 'info' ? 'text-purple-400 font-mono' :
                    'text-[#00f0ff] font-mono'
                  }>
                    {log.hex}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
