'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { BackgroundCanvas } from '@/components/BackgroundCanvas';
import { AuthModal } from '@/components/AuthModal';
import { HomePage } from '@/components/pages/HomePage';
import { ProductPage } from '@/components/pages/ProductPage';
import { AIMLPage } from '@/components/pages/AIMLPage';
import { AccessibilityPage } from '@/components/pages/AccessibilityPage';
import { LiveDemoPage } from '@/components/pages/LiveDemoPage';
import { ImpactPage } from '@/components/pages/ImpactPage';
import { useAuthStore } from '@/store/authStore';

export default function Home() {
  const [activeTab, setActiveTab] = useState<string>('home');
  const { activeGloveSerial } = useAuthStore();

  return (
    <div className="relative min-h-screen flex flex-col justify-between overflow-x-hidden selection:bg-[#00f0ff] selection:text-[#030712] bg-[#030712]">
      
      {/* 1. MANDATORY ANIMATED BACKGROUND */}
      <BackgroundCanvas />

      {/* 2. AUTH MODAL */}
      <AuthModal />

      {/* 3. FIXED TOP NAVIGATION BAR */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* 4. MAIN CONTENT AREA WITH PAGE ROUTER */}
      <main id="main-content" className="relative z-10 pt-28 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex-1 w-full">
        {activeTab === 'home' && (
          <HomePage 
            onExploreGlove={() => setActiveTab('glove')}
            onTryDemo={() => setActiveTab('demo')}
          />
        )}
        {activeTab === 'glove' && <ProductPage />}
        {activeTab === 'aiml' && <AIMLPage />}
        {activeTab === 'accessibility' && <AccessibilityPage />}
        {activeTab === 'demo' && <LiveDemoPage />}
        {activeTab === 'impact' && <ImpactPage />}
      </main>

      {/* 5. CINEMATIC FUTURISTIC FOOTER */}
      <footer className="relative z-10 border-t border-[#00f0ff]/20 bg-[#030712]/90 backdrop-blur-md py-8 px-4 text-xs font-inter text-[#94a3b8]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg border border-[#00f0ff] bg-[#0a0f1e] flex items-center justify-center font-orbitron font-bold text-[#00f0ff]">
              S
            </div>
            <div>
              <span className="font-orbitron font-bold text-white tracking-widest block">
                AI GLOVE
              </span>
              <span className="text-[10px] text-[#94a3b8] font-rajdhani">
                Wearable Intelligence. Gesture to Voice.
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 font-rajdhani text-xs tracking-wider">
            <button onClick={() => setActiveTab('home')} className="hover:text-[#00f0ff]">01 HOME</button>
            <button onClick={() => setActiveTab('glove')} className="hover:text-[#00f0ff]">02 AI GLOVE</button>
            <button onClick={() => setActiveTab('aiml')} className="hover:text-[#00f0ff]">03 AI &amp; ML</button>
            <button onClick={() => setActiveTab('accessibility')} className="hover:text-[#00f0ff]">04 ACCESSIBILITY</button>
            <button onClick={() => setActiveTab('demo')} className="hover:text-[#00f0ff]">05 LIVE DEMO</button>
            <button onClick={() => setActiveTab('impact')} className="hover:text-[#00f0ff]">06 IMPACT &amp; FUTURE</button>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[10px] font-orbitron text-[#00f0ff] bg-[#00f0ff]/10 px-2.5 py-1 rounded border border-[#00f0ff]/30">
              SERIAL: {activeGloveSerial || 'SSG-2050-X99'}
            </span>
            <span>© 2026 AI Glove Inc.</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
