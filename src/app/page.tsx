'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { BackgroundCanvas } from '@/components/BackgroundCanvas';
import { AuthModal } from '@/components/AuthModal';
import { HardwareDashboard } from '@/components/HardwareDashboard';
import { HowItWorksTimeline } from '@/components/HowItWorksTimeline';
import { SavedGesturesManager } from '@/components/SavedGesturesManager';
import { FeatureGrid } from '@/components/FeatureGrid';
import { HolographicGloveView } from '@/components/HolographicGloveView';
import { GestureManual } from '@/components/GestureManual';
import { useAuthStore } from '@/store/authStore';

export default function Home() {
  const [activeTab, setActiveTab] = useState<string>('hardware');
  const { activeGloveSerial } = useAuthStore();

  return (
    <div className="relative min-h-screen flex flex-col justify-between overflow-x-hidden selection:bg-[#00f0ff] selection:text-[#030712]">
      
      {/* 1. MANDATORY ANIMATED BACKGROUND */}
      <BackgroundCanvas />

      {/* 2. AUTH MODAL */}
      <AuthModal />

      {/* 3. FIXED TOP NAVIGATION BAR */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* 4. MAIN CONTENT AREA */}
      <main id="main-content" className="relative z-10 pt-28 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex-1 w-full">
        {activeTab === 'hardware' && (
          <HardwareDashboard onNavigateTo3D={() => setActiveTab('3d-view')} />
        )}
        {activeTab === 'how-it-works' && <HowItWorksTimeline />}
        {activeTab === 'saved-gestures' && <SavedGesturesManager />}
        {activeTab === 'features' && <FeatureGrid />}
        {activeTab === '3d-view' && <HolographicGloveView />}
        {activeTab === 'manual' && <GestureManual />}
      </main>

      {/* 5. FUTURISTIC FOOTER */}
      <footer className="relative z-10 border-t border-[#00f0ff]/20 bg-[#030712]/90 backdrop-blur-md py-8 px-4 text-xs font-inter text-[#94a3b8]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded border border-[#00f0ff] bg-[#0a0f1e] flex items-center justify-center font-orbitron font-bold text-[#00f0ff]">
              S
            </div>
            <div>
              <span className="font-orbitron font-bold text-white tracking-widest block">
                SENSASIGN AI
              </span>
              <span className="text-[10px] text-[#94a3b8] font-rajdhani">
                Wearable Intelligence. Gesture to Voice.
              </span>
            </div>
          </div>

          <div className="flex items-center gap-6 font-rajdhani text-xs tracking-wider">
            <button onClick={() => setActiveTab('hardware')} className="hover:text-[#00f0ff]">HARDWARE</button>
            <button onClick={() => setActiveTab('how-it-works')} className="hover:text-[#00f0ff]">HOW IT WORKS</button>
            <button onClick={() => setActiveTab('3d-view')} className="hover:text-[#00f0ff]">3D VIEW</button>
            <button onClick={() => setActiveTab('manual')} className="hover:text-[#00f0ff]">MANUAL</button>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[10px] font-orbitron text-[#00f0ff] bg-[#00f0ff]/10 px-2.5 py-1 rounded border border-[#00f0ff]/30">
              SERIAL: {activeGloveSerial || 'SSG-2050-X99'}
            </span>
            <span>© 2026 Sensasign AI Inc.</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
