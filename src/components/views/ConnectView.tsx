// Connect View (View 1 of 3)
// Team Syntropy - SIGNOVA
// Features: One large connection action, live connection state,
// simulation fallback, Web Serial browser support warning, and hardware specs.

'use client';

import React from 'react';
import { Cable, Bluetooth, Play, AlertTriangle, ShieldCheck, Terminal } from 'lucide-react';
import { useSignovaStore } from '../../store/signovaStore';
import { CONFIG } from '../../config.js';

export const ConnectView: React.FC = () => {
  const {
    connectionStatus,
    statusMessage,
    webSerialSupported,
    webBleSupported,
    connectSerial,
    connectBLE,
    startSimulation,
  } = useSignovaStore();

  const handleConnectSerial = async () => {
    await connectSerial();
  };

  const handleConnectBLE = async () => {
    await connectBLE();
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-8 px-4 flex flex-col gap-8 font-mono">
      {/* 1. Hardware Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#14181D] border border-[#1F242A] rounded-full text-xs text-[#2EE6A6]">
          <span className="w-2 h-2 rounded-full bg-[#2EE6A6] animate-pulse" />
          <span>TEAM SYNTROPY — HARDWARE PORTAL</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black font-sans tracking-tight text-white">
          CONNECT SIGNOVA GLOVE
        </h1>
        <p className="text-sm text-[#9CA3AF] max-w-lg mx-auto font-sans">
          Stream real-time ADC readings from Seeed XIAO nRF52840 Sense / Arduino Uno over USB Serial (115200 baud) or Web Bluetooth (~50 Hz).
        </p>
      </div>

      {/* 2. Web Serial / BLE Browser Support Warning */}
      {!webSerialSupported && !webBleSupported && (
        <div className="w-full p-4 bg-[#1E170A] border border-yellow-600/40 rounded-sm flex items-start gap-3 text-xs text-yellow-200">
          <AlertTriangle className="w-5 h-5 text-yellow-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <div className="font-bold text-yellow-300">
              HARDWARE APIS NOT DETECTED IN THIS BROWSER
            </div>
            <p className="text-yellow-200/80 leading-relaxed font-sans text-xs">
              Direct USB serial streaming and Web Bluetooth require <strong>Google Chrome</strong>, <strong>Microsoft Edge</strong>, or <strong>Opera</strong> on desktop (Windows, macOS, Linux). Firefox, Safari, and iOS do not support Web Serial/Web Bluetooth.
            </p>
            <p className="text-yellow-400 font-bold mt-1">
              You can still click &quot;Start Simulation Mode&quot; below to test full gesture recognition using synthetic 50Hz data or keyboard keys 1–8.
            </p>
          </div>
        </div>
      )}

      {/* 3. Primary Connection Card with USB Serial and BLE Actions */}
      <div className="bg-[#0A0D10] border border-[#1F242A] p-8 rounded-sm flex flex-col items-center text-center gap-6 shadow-xl">
        {/* Status Pill */}
        <div className="flex items-center gap-2 text-xs">
          <span
            className={`w-2.5 h-2.5 rounded-full ${
              connectionStatus === 'connected'
                ? 'bg-[#2EE6A6]'
                : connectionStatus === 'connecting'
                ? 'bg-yellow-400 animate-pulse'
                : 'bg-[#4B5563]'
            }`}
          />
          <span className="text-[#9CA3AF] font-bold uppercase tracking-wider">
            STATUS: {connectionStatus}
          </span>
        </div>

        <div className="text-xs text-[#6B7280] max-w-md">
          {statusMessage}
        </div>

        {/* CONNECTION BUTTONS */}
        <div className="w-full max-w-md flex flex-col sm:flex-row items-center gap-3">
          {/* USB SERIAL ACTION */}
          <button
            onClick={handleConnectSerial}
            disabled={!webSerialSupported || connectionStatus === 'connecting'}
            className="flex-1 w-full py-4 px-4 bg-[#2EE6A6] hover:bg-[#25C48D] disabled:opacity-40 disabled:hover:bg-[#2EE6A6] text-[#08090A] font-black text-xs tracking-wider rounded-xs transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer"
          >
            <Cable className="w-4 h-4 text-[#08090A]" />
            <span>CONNECT USB SERIAL</span>
          </button>

          {/* BLUETOOTH BLE ACTION */}
          <button
            onClick={handleConnectBLE}
            disabled={!webBleSupported || connectionStatus === 'connecting'}
            className="flex-1 w-full py-4 px-4 bg-[#14181D] hover:bg-[#1E252D] border border-[#2EE6A6]/60 disabled:opacity-40 text-[#2EE6A6] font-black text-xs tracking-wider rounded-xs transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer"
          >
            <Bluetooth className="w-4 h-4 text-[#2EE6A6]" />
            <span>CONNECT BLE WIRELESS</span>
          </button>
        </div>

        {/* OR Divider */}
        <div className="w-full max-w-md flex items-center gap-4 text-xs text-[#4B5563]">
          <div className="flex-1 h-px bg-[#1F242A]" />
          <span>OR</span>
          <div className="flex-1 h-px bg-[#1F242A]" />
        </div>

        {/* SIMULATE FALLBACK ACTION */}
        <button
          onClick={startSimulation}
          className="w-full max-w-md py-3 px-6 bg-[#14181D] hover:bg-[#1C2128] border border-[#1F242A] hover:border-[#2EE6A6]/40 text-white font-bold text-xs tracking-wider rounded-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
        >
          <Play className="w-4 h-4 text-[#2EE6A6]" />
          <span>START SIMULATION MODE (KEYS 1–8)</span>
        </button>
      </div>

      {/* 4. Hardware Pinout & Gesture Map Reference */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        {/* Hardware Specs */}
        <div className="bg-[#0A0D10] border border-[#1F242A] p-4 rounded-sm space-y-3">
          <div className="text-[#9CA3AF] font-bold border-b border-[#1F242A] pb-2 flex items-center gap-2">
            <Terminal className="w-4 h-4 text-[#2EE6A6]" />
            <span>HARDWARE CONFIGURATION</span>
          </div>
          <div className="space-y-1.5 text-[11px] text-[#9CA3AF]">
            <div className="flex justify-between">
              <span className="text-[#6B7280]">MICROCONTROLLER</span>
              <span className="text-white">Seeed XIAO nRF52840 / Uno</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#6B7280]">ACTIVE SENSORS</span>
              <span className="text-white">3 Flex Sensors (Index, Middle, Ring)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#6B7280]">USB SERIAL BAUD</span>
              <span className="text-[#2EE6A6] font-bold">115200 bps</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#6B7280]">STREAM PACKET FORMAT</span>
              <span className="text-white">&quot;f1,f2,f3\n&quot; @ ~50 Hz</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#6B7280]">HOLD STABILITY GUARD</span>
              <span className="text-white">400 ms debounce before speech</span>
            </div>
          </div>
        </div>

        {/* 8-Gesture Dictionary Reference */}
        <div className="bg-[#0A0D10] border border-[#1F242A] p-4 rounded-sm space-y-3">
          <div className="text-[#9CA3AF] font-bold border-b border-[#1F242A] pb-2 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#2EE6A6]" />
            <span>GESTURE MAP (INDEX, MIDDLE, RING)</span>
          </div>
          <div className="grid grid-cols-2 gap-1.5 text-[10px]">
            {Object.entries(CONFIG.GESTURE_MAP).map(([pattern, label]) => (
              <div
                key={pattern}
                className="flex items-center justify-between p-1.5 bg-[#0E1216] border border-[#161B22] rounded-xs"
              >
                <span className="text-[#6B7280]">{`{${pattern.split('').join(', ')}}`}</span>
                <span className="text-[#2EE6A6] font-bold">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConnectView;
