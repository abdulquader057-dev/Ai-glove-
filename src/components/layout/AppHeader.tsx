// Top Navigation Header for SIGNOVA
// Assistive Device Medical Interface
// Features clean 56px clinical bar, connection status ripple, simulation toggle,
// calibration & settings modal triggers.

'use client';

import React from 'react';
import { useSignovaStore } from '@/store/signovaStore';

export const AppHeader: React.FC = () => {
  const {
    connectionStatus,
    connectionMedium,
    isSimulation,
    streamHz,
    startSimulation,
    stopSimulation,
    setCalibrationOpen,
    setSettingsOpen,
    isMuted,
    toggleMute,
  } = useSignovaStore();

  const isConnected = connectionStatus === 'connected';

  return (
    <header className="sticky top-0 z-40 w-full h-14 bg-white dark:bg-[#111827] border-b border-[#E4E7EC] dark:border-[#1F2937] px-4 sm:px-6 flex items-center justify-between shadow-xs">
      {/* Brand & Subtitle */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-[#0E7490] flex items-center justify-center text-white shadow-xs">
          {/* Medical Assistive Glove Glyph */}
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V4.5a1.5 1.5 0 113 0v6.5m0-6.5a1.5 1.5 0 013 0V11" />
          </svg>
        </div>
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="font-bold text-base tracking-tight text-[#101828] dark:text-[#F9FAFB]">
              SIGNOVA
            </span>
            <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-[#F0F2F5] dark:bg-[#1F2937] text-[#475467] dark:text-[#9CA3AF] hidden sm:inline-block">
              Assistive OS
            </span>
          </div>
          <span className="text-[11px] text-[#667085] dark:text-[#9CA3AF] -mt-0.5 hidden md:inline-block">
            Turning Gestures Into a Voice · Team Syntropy
          </span>
        </div>
      </div>

      {/* Middle Status Pill */}
      <div className="flex items-center">
        {isConnected ? (
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#ECFDF3] dark:bg-[#064E3B]/40 border border-[#A6F4C5] dark:border-[#059669]/60 text-[#027A48] dark:text-[#6EE7B7] text-xs font-medium">
            <span className="w-2 h-2 rounded-full bg-[#12B76A] animate-pulse-ripple"></span>
            <span>
              {isSimulation
                ? 'Simulation (Keys 1-8)'
                : connectionMedium === 'ble'
                ? 'BLE Connected'
                : 'Serial 115200'}
            </span>
            <span className="font-mono text-[11px] opacity-75">· {streamHz || 50} Hz</span>
          </div>
        ) : (
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#F2F4F7] dark:bg-[#1F2937] border border-[#E4E7EC] dark:border-[#374151] text-[#667085] dark:text-[#9CA3AF] text-xs font-medium">
            <span className="w-2 h-2 rounded-full bg-[#98A2B3]"></span>
            <span>Hardware Offline</span>
          </div>
        )}
      </div>

      {/* Right Action Tools */}
      <div className="flex items-center gap-2">
        {/* Simulation Toggle */}
        <button
          onClick={isSimulation ? stopSimulation : startSimulation}
          className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors flex items-center gap-1.5 ${
            isSimulation
              ? 'bg-[#FEF3C7] dark:bg-[#78350F]/40 border-[#F59E0B] text-[#92400E] dark:text-[#FDE68A]'
              : 'bg-white dark:bg-[#1F2937] border-[#D0D5DD] dark:border-[#374151] text-[#344054] dark:text-[#E5E7EB] hover:bg-[#F9FAFB]'
          }`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${isSimulation ? 'bg-[#D97706]' : 'bg-[#98A2B3]'}`}></span>
          <span className="hidden sm:inline">{isSimulation ? 'Sim Active' : 'Simulate'}</span>
          <kbd className="hidden md:inline font-mono text-[10px] bg-[#F2F4F7] dark:bg-[#111827] px-1 py-0.5 rounded text-[#475467] dark:text-[#9CA3AF]">
            1-8
          </kbd>
        </button>

        {/* Calibrate Trigger */}
        <button
          onClick={() => setCalibrationOpen(true)}
          className="px-2.5 py-1.5 rounded-lg text-xs font-medium bg-white dark:bg-[#1F2937] border border-[#D0D5DD] dark:border-[#374151] text-[#344054] dark:text-[#E5E7EB] hover:bg-[#F9FAFB] dark:hover:bg-[#374151]/50 transition-colors flex items-center gap-1.5"
        >
          <svg className="w-3.5 h-3.5 text-[#475467] dark:text-[#9CA3AF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
          </svg>
          <span className="hidden sm:inline">Calibrate</span>
        </button>

        {/* Settings Trigger */}
        <button
          onClick={() => setSettingsOpen(true)}
          className="p-1.5 rounded-lg text-xs font-medium bg-white dark:bg-[#1F2937] border border-[#D0D5DD] dark:border-[#374151] text-[#344054] dark:text-[#E5E7EB] hover:bg-[#F9FAFB] dark:hover:bg-[#374151]/50 transition-colors"
          title="Hardware & Voice Settings"
        >
          <svg className="w-4 h-4 text-[#475467] dark:text-[#9CA3AF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>

        {/* Audio Mute Quick Toggle */}
        <button
          onClick={toggleMute}
          className={`p-1.5 rounded-lg border text-xs transition-colors ${
            isMuted
              ? 'bg-[#FEE4E2] dark:bg-[#7F1D1D]/30 border-[#FDA29B] text-[#D92D20]'
              : 'bg-white dark:bg-[#1F2937] border-[#D0D5DD] dark:border-[#374151] text-[#344054] dark:text-[#E5E7EB] hover:bg-[#F9FAFB]'
          }`}
          title={isMuted ? 'Voice Muted' : 'Voice Active'}
        >
          {isMuted ? (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
            </svg>
          ) : (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
            </svg>
          )}
        </button>
      </div>
    </header>
  );
};
