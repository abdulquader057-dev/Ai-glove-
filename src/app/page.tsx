// SIGNOVA - Gesture to Voice Web Application
// Team Syntropy
// Root Page mounting strictly 3 views: Connect, Live, Calibrate.

'use client';

import React from 'react';
import { HeaderNav } from '@/components/layout/HeaderNav';
import { ConnectView } from '@/components/views/ConnectView';
import { LiveView } from '@/components/views/LiveView';
import { CalibrateView } from '@/components/views/CalibrateView';
import { useSignovaStore } from '@/store/signovaStore';

export default function Home() {
  const { activeView } = useSignovaStore();

  return (
    <div className="min-h-screen bg-[#08090A] text-white flex flex-col font-mono selection:bg-[#2EE6A6] selection:text-[#08090A]">
      {/* Precision Instrument Navigation Bar */}
      <HeaderNav />

      {/* Main Content Area (Strictly 3 Views) */}
      <main className="flex-1 w-full pb-12">
        {activeView === 'connect' && <ConnectView />}
        {activeView === 'live' && <LiveView />}
        {activeView === 'calibrate' && <CalibrateView />}
      </main>

      {/* Hardware Telemetry Footer */}
      <footer className="w-full border-t border-[#1F242A] bg-[#0A0D10] py-4 px-4 text-[11px] text-[#6B7280]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            <span className="text-white font-bold">SIGNOVA</span> by Team Syntropy — Seeed XIAO nRF52840 Sense &amp; Arduino Uno
          </div>
          <div className="flex items-center gap-3">
            <span>Baud: 115200 bps</span>
            <span>•</span>
            <span>Channels: Index, Middle, Ring</span>
            <span>•</span>
            <span>Sampling: ~50 Hz</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
