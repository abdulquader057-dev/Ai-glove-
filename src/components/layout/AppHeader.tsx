// Top Navigation Header for SIGNOVA
// Assistive Device Medical Interface
// Features clean 56px clinical bar, connection status ripple, simulation toggle,
// calibration & settings modal triggers.

'use client';

import React from 'react';
import { useSignovaStore } from '@/store/signovaStore';

import { useRouter } from 'next/navigation';

export const AppHeader: React.FC = () => {
  const router = useRouter();
  const {
    activeView,
    setActiveView,
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

  const handleOverviewClick = () => {
    setActiveView('landing');
    router.push('/');
  };

  const handleStudioClick = () => {
    setActiveView('live');
    router.push('/studio');
  };

  return (
    <header className="sticky top-0 z-40 w-full h-14 bg-[#0A0D12] border-b border-[#1F2733] px-4 sm:px-6 flex items-center justify-between shadow-md">
      {/* Brand & Subtitle + View Switcher */}
      <div className="flex items-center gap-4">
        <div 
          onClick={handleOverviewClick}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#2EE6A6] to-[#0E7490] flex items-center justify-center text-[#07090D] font-black text-sm shadow-[0_0_12px_rgba(46,230,166,0.35)] group-hover:scale-105 transition-transform">
            {/* Medical Assistive Glove Glyph */}
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V4.5a1.5 1.5 0 113 0v6.5m0-6.5a1.5 1.5 0 013 0V11" />
            </svg>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base tracking-tight text-white group-hover:text-[#2EE6A6] transition-colors">
                SIGNOVA
              </span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#161D27] border border-[#232E3E] text-[#2EE6A6]">
                ASSISTIVE OS
              </span>
            </div>
            <span className="text-[11px] text-[#9CA3AF] -mt-0.5 hidden lg:inline-block">
              Turning Gestures Into a Voice · Team Syntropy
            </span>
          </div>
        </div>

        {/* View Switcher Tabs (Landing vs Live Studio) */}
        <div className="flex items-center gap-1 bg-[#141922] p-1 rounded-lg border border-[#1F2733] font-mono text-xs">
          <button
            onClick={handleOverviewClick}
            className={`px-3 py-1 rounded-md transition-all font-bold cursor-pointer ${
              activeView === 'landing'
                ? 'bg-[#2EE6A6] text-[#07090D] shadow-[0_0_10px_rgba(46,230,166,0.3)]'
                : 'text-[#9CA3AF] hover:text-white'
            }`}
          >
            OVERVIEW
          </button>
          <button
            onClick={handleStudioClick}
            className={`px-3 py-1 rounded-md transition-all font-bold cursor-pointer ${
              activeView === 'live'
                ? 'bg-[#2EE6A6] text-[#07090D] shadow-[0_0_10px_rgba(46,230,166,0.3)]'
                : 'text-[#9CA3AF] hover:text-white'
            }`}
          >
            LIVE STUDIO
          </button>
        </div>
      </div>

      {/* Middle Status Pill */}
      <div className="flex items-center">
        {isConnected ? (
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#2EE6A6]/10 border border-[#2EE6A6]/40 text-[#2EE6A6] text-xs font-semibold shadow-[0_0_10px_rgba(46,230,166,0.2)]">
            <span className="w-2 h-2 rounded-full bg-[#2EE6A6] animate-pulse-ripple"></span>
            <span>
              {isSimulation
                ? 'Simulation (Keys 1-8)'
                : connectionMedium === 'ble'
                ? 'BLE Wireless Connected'
                : 'USB Serial 115200'}
            </span>
            <span className="font-mono text-[11px] opacity-80">· {streamHz || 50} Hz</span>
          </div>
        ) : (
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#141922] border border-[#1F2733] text-[#9CA3AF] text-xs font-medium">
            <span className="w-2 h-2 rounded-full bg-[#6B7280]"></span>
            <span>Hardware Standby</span>
          </div>
        )}
      </div>

      {/* Right Action Tools */}
      <div className="flex items-center gap-2">
        {/* Simulation Toggle */}
        <button
          onClick={isSimulation ? stopSimulation : startSimulation}
          className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-all flex items-center gap-1.5 cursor-pointer ${
            isSimulation
              ? 'bg-[#F59E0B]/20 border-[#F59E0B] text-[#F59E0B] shadow-[0_0_10px_rgba(245,158,11,0.25)]'
              : 'bg-[#141922] border-[#1F2733] text-[#D1D5DB] hover:text-white hover:border-[#2EE6A6]/40'
          }`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${isSimulation ? 'bg-[#F59E0B] animate-pulse' : 'bg-[#6B7280]'}`}></span>
          <span className="hidden sm:inline">{isSimulation ? 'Sim Active' : 'Simulate'}</span>
          <kbd className="hidden md:inline font-mono text-[10px] bg-[#0E1218] border border-[#1F2733] px-1 py-0.5 rounded text-[#9CA3AF]">
            1-8
          </kbd>
        </button>

        {/* Calibrate Trigger */}
        <button
          onClick={() => setCalibrationOpen(true)}
          className="px-2.5 py-1.5 rounded-lg text-xs font-medium bg-[#141922] border border-[#1F2733] text-[#D1D5DB] hover:text-white hover:border-[#2EE6A6]/40 transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          <svg className="w-3.5 h-3.5 text-[#2EE6A6]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
          </svg>
          <span className="hidden sm:inline">Calibrate</span>
        </button>

        {/* Settings Trigger */}
        <button
          onClick={() => setSettingsOpen(true)}
          className="p-1.5 rounded-lg text-xs font-medium bg-[#141922] border border-[#1F2733] text-[#D1D5DB] hover:text-white hover:border-[#2EE6A6]/40 transition-colors cursor-pointer"
          title="Hardware & Voice Settings"
        >
          <svg className="w-4 h-4 text-[#9CA3AF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>

        {/* Audio Mute Quick Toggle */}
        <button
          onClick={toggleMute}
          className={`p-1.5 rounded-lg border text-xs transition-colors cursor-pointer ${
            isMuted
              ? 'bg-[#EF4444]/20 border-[#EF4444]/60 text-[#EF4444]'
              : 'bg-[#141922] border-[#1F2733] text-[#2EE6A6] hover:border-[#2EE6A6]/50'
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
