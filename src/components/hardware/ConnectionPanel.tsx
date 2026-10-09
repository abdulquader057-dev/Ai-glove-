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
    <div className="flex flex-col gap-4">
      {/* 1. Hardware Connection Controller */}
      <div className="bg-white dark:bg-[#111827] rounded-xl border border-[#E4E7EC] dark:border-[#1F2937] p-4 shadow-card">
        <div className="flex items-center justify-between pb-3 border-b border-[#F0F2F5] dark:border-[#1F2937]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#0E7490]"></span>
            <h2 className="text-xs font-semibold uppercase tracking-wider text-[#344054] dark:text-[#E5E7EB]">
              Hardware Interface
            </h2>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#F0F2F5] dark:bg-[#1F2937] text-[#475467] dark:text-[#9CA3AF]">
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
                className="w-full py-2.5 px-3 bg-[#0E7490] hover:bg-[#155E75] disabled:bg-[#94A3B8] text-white text-xs font-semibold rounded-lg shadow-xs transition-colors flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>Connect USB Glove</span>
              </button>

              {/* Secondary Bluetooth LE Connect */}
              <button
                onClick={connectBLE}
                disabled={!webBleSupported}
                className="w-full py-2 px-3 bg-white dark:bg-[#1F2937] hover:bg-[#F8F9FA] dark:hover:bg-[#374151]/50 border border-[#D0D5DD] dark:border-[#374151] text-[#344054] dark:text-[#E5E7EB] text-xs font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4 text-[#0E7490] dark:text-[#14B8A6]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                <span>Connect Bluetooth LE</span>
              </button>
            </>
          ) : (
            <div className="space-y-2">
              <div className="p-2.5 rounded-lg bg-[#ECFDF3] dark:bg-[#064E3B]/30 border border-[#A6F4C5] dark:border-[#059669]/50 text-xs text-[#027A48] dark:text-[#A7F3D0] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#12B76A] animate-pulse"></span>
                  <span className="font-semibold">
                    {connectionMedium === 'usb_serial' ? 'USB Serial Active' : connectionMedium === 'ble' ? 'Bluetooth Active' : 'Simulation Active'}
                  </span>
                </div>
                <span className="text-[10px] font-mono">50 Hz</span>
              </div>

              <button
                onClick={connectionMedium === 'ble' ? disconnectBLE : disconnectSerial}
                className="w-full py-2 px-3 bg-white dark:bg-[#1F2937] hover:bg-[#FEE4E2] dark:hover:bg-[#7F1D1D]/30 border border-[#FDA29B] text-[#D92D20] text-xs font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
                <span>Disconnect Hardware</span>
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
        <div className="mt-3 pt-3 border-t border-[#F0F2F5] dark:border-[#1F2937] text-[11px] text-[#667085] dark:text-[#9CA3AF] space-y-1 font-mono">
          <div className="flex justify-between">
            <span className="text-[#98A2B3]">Microcontroller</span>
            <span className="text-[#344054] dark:text-[#E5E7EB]">Seeed XIAO nRF52840</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#98A2B3]">Analog Channels</span>
            <span className="text-[#344054] dark:text-[#E5E7EB]">3 Flex (Index, Mid, Ring)</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#98A2B3]">Packet Format</span>
            <span className="text-[#344054] dark:text-[#E5E7EB]">f1,f2,f3\n (~50 Hz)</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#98A2B3]">Hold Guard</span>
            <span className="text-[#344054] dark:text-[#E5E7EB]">400 ms Stable Lock</span>
          </div>
        </div>
      </div>

      {/* 2. 8-Gesture Dictionary Matrix */}
      <div className="bg-white dark:bg-[#111827] rounded-xl border border-[#E4E7EC] dark:border-[#1F2937] p-4 shadow-card">
        <div className="flex items-center justify-between pb-2.5 border-b border-[#F0F2F5] dark:border-[#1F2937]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#12B76A]"></span>
            <h2 className="text-xs font-semibold uppercase tracking-wider text-[#344054] dark:text-[#E5E7EB]">
              Gesture Dictionary
            </h2>
          </div>
          <span className="text-[10px] text-[#667085] dark:text-[#9CA3AF]">
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
                    ? 'bg-[#E0F2FE] dark:bg-[#0E7490]/30 border-[#0E7490] text-[#0C4A6E] dark:text-[#7DD3FC] font-semibold shadow-xs'
                    : isCandidate
                    ? 'bg-[#FEF3C7] dark:bg-[#78350F]/20 border-[#F59E0B] text-[#92400E] dark:text-[#FDE68A]'
                    : 'bg-[#F9FAFB] dark:bg-[#1A2230] border-[#F2F4F7] dark:border-[#242F42] text-[#344054] dark:text-[#D1D5DB] hover:border-[#D0D5DD]'
                }`}
                title={`Click to simulate ${gesture.label} (Key ${idx + 1})`}
              >
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-white dark:bg-[#111827] border border-[#E4E7EC] dark:border-[#374151] text-[#475467] dark:text-[#9CA3AF]">
                    {pattern}
                  </span>
                  <span className="font-medium">{gesture.label}</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-[#667085] dark:text-[#9CA3AF] hidden sm:inline">
                    {gesture.desc}
                  </span>
                  <kbd className="font-mono text-[9px] px-1 py-0.5 rounded bg-white dark:bg-[#111827] border border-[#D0D5DD] dark:border-[#374151] text-[#667085]">
                    {idx + 1}
                  </kbd>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-3 pt-2 text-center text-[10px] text-[#98A2B3] dark:text-[#64748B]">
          Press keyboard 1–8 anytime to test gestures instantly
        </div>
      </div>
    </div>
  );
};
