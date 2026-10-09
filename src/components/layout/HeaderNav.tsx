// Header & Navigation Component
// Team Syntropy - SIGNOVA
// 3 Views Only: CONNECT, LIVE, CALIBRATE.

'use client';

import React from 'react';
import { Volume2, VolumeX, Cable, Activity, Sliders } from 'lucide-react';
import { useSignovaStore } from '../../store/signovaStore';

export const HeaderNav: React.FC = () => {
  const {
    activeView,
    setActiveView,
    connectionStatus,
    connectionMedium,
    isSimulation,
    isMuted,
    toggleMute,
    disconnectSerial,
    disconnectBLE,
  } = useSignovaStore();

  return (
    <header className="w-full bg-[#08090A] border-b border-[#1F242A] py-3 px-4 sm:px-6 sticky top-0 z-40 font-mono">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Brand & Project Identity */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xs border border-[#2EE6A6] bg-[#0E1B15] flex items-center justify-center font-bold text-[#2EE6A6] text-sm">
            S
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-sans font-black text-white text-base tracking-wider">
                SIGNOVA
              </span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#14181D] border border-[#1F242A] text-[#2EE6A6]">
                TEAM SYNTROPY
              </span>
            </div>
            <p className="text-[10px] text-[#6B7280] font-sans">
              Turning Gestures Into a Voice
            </p>
          </div>
        </div>

        {/* 3 Views Only Navigation Tabs */}
        <nav className="flex items-center gap-1 bg-[#0E1115] border border-[#1F242A] p-1 rounded-xs">
          <button
            onClick={() => setActiveView('connect')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-xs transition-colors ${
              activeView === 'connect'
                ? 'bg-[#2EE6A6] text-[#08090A] font-bold'
                : 'text-[#9CA3AF] hover:text-white'
            }`}
          >
            <Cable className="w-3.5 h-3.5" />
            <span>01 CONNECT</span>
          </button>

          <button
            onClick={() => setActiveView('live')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-xs transition-colors ${
              activeView === 'live'
                ? 'bg-[#2EE6A6] text-[#08090A] font-bold'
                : 'text-[#9CA3AF] hover:text-white'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>02 LIVE</span>
          </button>

          <button
            onClick={() => setActiveView('calibrate')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-xs transition-colors ${
              activeView === 'calibrate'
                ? 'bg-[#2EE6A6] text-[#08090A] font-bold'
                : 'text-[#9CA3AF] hover:text-white'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>03 CALIBRATE</span>
          </button>
        </nav>

        {/* Hardware Status & Quick Audio Toggle */}
        <div className="flex items-center gap-3">
          {/* Connection Status Pill */}
          <div className="flex items-center gap-2 px-2.5 py-1 bg-[#0E1115] border border-[#1F242A] rounded-xs text-[11px]">
            <span
              className={`w-2 h-2 rounded-full ${
                connectionStatus === 'connected'
                  ? isSimulation
                    ? 'bg-yellow-400'
                    : 'bg-[#2EE6A6] animate-pulse'
                  : 'bg-[#4B5563]'
              }`}
            />
            <span className="text-[#9CA3AF]">
              {connectionStatus === 'connected'
                ? isSimulation
                  ? 'SIMULATION'
                  : connectionMedium === 'ble'
                  ? 'BLE 50Hz'
                  : 'SERIAL 50Hz'
                : 'DISCONNECTED'}
            </span>
            {connectionStatus === 'connected' && !isSimulation && (
              <button
                onClick={() => (connectionMedium === 'ble' ? disconnectBLE() : disconnectSerial())}
                className="text-[10px] text-red-400 hover:text-red-300 transition-colors ml-1"
                title="Disconnect Hardware"
              >
                [DISCONNECT]
              </button>
            )}
          </div>

          {/* Quick Mute Toggle */}
          <button
            onClick={toggleMute}
            className={`p-1.5 rounded-xs border transition-colors ${
              isMuted
                ? 'bg-[#1F242A] border-[#374151] text-[#9CA3AF]'
                : 'bg-[#2EE6A6]/10 border-[#2EE6A6]/40 text-[#2EE6A6]'
            }`}
            title={isMuted ? 'Unmute voice' : 'Mute voice'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </header>
  );
};

export default HeaderNav;
