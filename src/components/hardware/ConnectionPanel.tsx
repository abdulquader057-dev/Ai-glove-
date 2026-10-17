// Hardware Connection & Gesture Dictionary Panel for SIGNOVA
// Assistive Device Medical Interface
// Manages Web Serial (115200) and Web Bluetooth connection triggers,
// hardware spec diagnostics, and the 8-gesture dictionary with live match highlights.

'use client';

import React from 'react';
import { useSignovaStore } from '@/store/signovaStore';
import { GESTURE_MAP } from '@/config/signova.config';
import { simulationService } from '@/services/simulationService';

export const ConnectionPanel: React.FC = () => {
  const {
    connectionStatus,
    connectionMedium,
    webSerialSupported,
    webBleSupported,
    connectSerial,
    disconnectSerial,
    connectBLE,
    disconnectBLE,
    activeGesture,
    candidateGesture,
    holdProgress,
    isSimulation,
    startSimulation,
  } = useSignovaStore();

  const isConnected = connectionStatus === 'connected';

  // Handle gesture click for fast demonstration testing
  const handleGestureClick = (index: number) => {
    if (!isSimulation && !isConnected) {
      startSimulation();
    }
    simulationService.triggerGestureByIndex(index);
  };

  return (
    <div className="flex flex-col gap-4 font-mono">
      {/* 1. Hardware Connection Controller */}
      <div className="bg-[#0E1218] rounded-xl border border-[#1F2733] p-4 shadow-xl">
        <div className="flex items-center justify-between pb-3 border-b border-[#1F2733]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#2EE6A6] animate-pulse"></span>
            <h2 className="text-xs font-bold uppercase tracking-wider text-white">
              Hardware Interface
            </h2>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#161D27] border border-[#232E3E] text-[#2EE6A6] font-semibold">
            115200 bps
          </span>
        </div>

        {/* Action Buttons */}
        <div className="mt-3 space-y-2">
          {!isConnected ? (
            <>
              {/* Primary USB Serial Connect */}
              <button
                onClick={connectSerial}
                disabled={!webSerialSupported}
                className="w-full py-2.5 px-3 bg-[#2EE6A6] hover:bg-[#22C58B] disabled:opacity-40 text-[#07090D] text-xs font-black rounded-lg shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <svg className="w-4 h-4 text-[#07090D]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>CONNECT USB GLOVE</span>
              </button>

              {/* Secondary Bluetooth LE Connect */}
              <button
                onClick={connectBLE}
                disabled={!webBleSupported}
                className="w-full py-2 px-3 bg-[#141922] hover:bg-[#1E2533] border border-[#1F2733] hover:border-[#38BDF8]/60 text-[#38BDF8] text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <svg className="w-4 h-4 text-[#38BDF8]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                <span>CONNECT BLE WIRELESS</span>
              </button>
            </>
          ) : (
            <div className="space-y-2">
              <div className="p-2.5 rounded-lg bg-[#2EE6A6]/10 border border-[#2EE6A6]/40 text-xs text-[#2EE6A6] flex items-center justify-between shadow-[0_0_10px_rgba(46,230,166,0.15)]">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#2EE6A6] animate-pulse"></span>
                  <span className="font-bold">
                    {connectionMedium === 'usb_serial' ? 'USB Serial Active' : connectionMedium === 'ble' ? 'Bluetooth Active' : 'Simulation Active'}
                  </span>
                </div>
                <span className="text-[10px] font-mono">50 Hz</span>
              </div>

              <button
                onClick={connectionMedium === 'ble' ? disconnectBLE : disconnectSerial}
                className="w-full py-2 px-3 bg-[#141922] hover:bg-[#EF4444]/20 border border-[#EF4444]/50 text-[#EF4444] text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
                <span>DISCONNECT HARDWARE</span>
              </button>
            </div>
          )}
        </div>

        {/* Browser Support Warning if missing */}
        {(!webSerialSupported || !webBleSupported) && (
          <div className="mt-3 p-2 bg-[#FEF3C7] dark:bg-[#78350F]/30 border border-[#FCD34D] rounded-lg text-[11px] text-[#92400E] dark:text-[#FDE68A] flex items-start gap-1.5">
            <svg className="w-3.5 h-3.5 text-[#D97706] mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <div>
              Web Serial requires Chrome, Edge, or Opera desktop. Use simulation mode if testing on unsupported browsers.
            </div>
          </div>
        )}

        {/* Hardware Specs Sheet */}
        <div className="mt-3 pt-3 border-t border-[#1F2733] text-[11px] text-[#9CA3AF] space-y-1 font-mono">
          <div className="flex justify-between">
            <span className="text-[#6B7280]">Microcontroller</span>
            <span className="text-white font-semibold">Seeed XIAO nRF52840 / Uno</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#6B7280]">Analog Channels</span>
            <span className="text-[#2EE6A6] font-semibold">3 Flex (Index, Mid, Ring)</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#6B7280]">Packet Format</span>
            <span className="text-white">f1,f2,f3\n (~50 Hz)</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#6B7280]">Hold Guard</span>
            <span className="text-[#38BDF8] font-bold">400 ms Stable Lock</span>
          </div>
        </div>
      </div>

      {/* 2. 8-Gesture Dictionary Matrix */}
      <div className="bg-[#0E1218] rounded-xl border border-[#1F2733] p-4 shadow-xl">
        <div className="flex items-center justify-between pb-2.5 border-b border-[#1F2733]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#2EE6A6]"></span>
            <h2 className="text-xs font-bold uppercase tracking-wider text-white">
              Gesture Dictionary
            </h2>
          </div>
          <span className="text-[10px] text-[#9CA3AF]">
            8 Poses (Idx-Mid-Rng)
          </span>
        </div>

        {/* Gestures List */}
        <div className="mt-3 space-y-1.5">
          {Object.entries(GESTURE_MAP).map(([pattern, gesture], idx) => {
            const isConfirmed = activeGesture === gesture.label;
            const isCandidate = candidateGesture === gesture.label && holdProgress > 0 && !isConfirmed;

            return (
              <div
                key={pattern}
                onClick={() => handleGestureClick(idx)}
                className={`p-2 rounded-lg border text-xs flex items-center justify-between cursor-pointer transition-all ${
                  isConfirmed
                    ? 'bg-[#2EE6A6]/15 border-[#2EE6A6] text-[#2EE6A6] font-bold shadow-[0_0_12px_rgba(46,230,166,0.25)] scale-[1.02]'
                    : isCandidate
                    ? 'bg-[#F59E0B]/20 border-[#F59E0B] text-[#F59E0B] animate-pulse'
                    : 'bg-[#141922] border-[#1F2733] text-[#D1D5DB] hover:border-[#2EE6A6]/40 hover:bg-[#1A2230]'
                }`}
                title={`Click to simulate ${gesture.label} (Key ${idx + 1})`}
              >
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-[#07090D] border border-[#1F2733] text-[#9CA3AF]">
                    {pattern}
                  </span>
                  <span className="font-semibold">{gesture.label}</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-[#9CA3AF] hidden sm:inline">
                    {gesture.desc}
                  </span>
                  <kbd className="font-mono text-[9px] px-1.5 py-0.5 rounded bg-[#07090D] border border-[#1F2733] text-[#2EE6A6] font-bold">
                    {idx + 1}
                  </kbd>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-3 pt-2 text-center text-[10px] text-[#6B7280]">
          Press keyboard 1–8 anytime to test gestures instantly
        </div>
      </div>
    </div>
  );
};
