// SIGNOVA - Award-Winning Full-Screen Scrollytelling Landing Page
// Architecture & Visual Caliber inspired strictly by atmos-bits.com
// Tech Stack: Lenis Inertial Scrolling, GSAP ScrollTrigger, High-DPI Pinned Canvas Engine

'use client';

import React, { useRef, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { AtmosNavbar } from './AtmosNavbar';
import { AtmosCanvasEngine } from './AtmosCanvasEngine';
import { AtmosScrollytelling } from './AtmosScrollytelling';
import { AtmosArchitectureGrid } from './AtmosArchitectureGrid';
import { AtmosTeamDossier } from './AtmosTeamDossier';
import TeamSyntropyLogo from '@/components/brand/TeamSyntropyLogo';
import { useAuthStore } from '@/store/authStore';
import { ArrowRight, Sparkles } from 'lucide-react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export const LandingPage: React.FC = () => {
  const router = useRouter();
  const { isAuthenticated, openAuthModal } = useAuthStore();
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const [progress, setProgress] = useState<number>(0);

  // Initialize Lenis smooth inertial scrolling and sync with GSAP ScrollTrigger
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    lenis.on('scroll', ScrollTrigger.update);

    const tickerCallback = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(tickerCallback);
    gsap.ticker.lagSmoothing(0);

    // Choreograph the 500vh scrollytelling container
    let trigger: ScrollTrigger | null = null;
    if (scrollContainerRef.current) {
      trigger = ScrollTrigger.create({
        trigger: scrollContainerRef.current,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1.2,
        onUpdate: (self) => {
          setProgress(self.progress);
        },
      });
    }

    return () => {
      if (trigger) trigger.kill();
      gsap.ticker.remove(tickerCallback);
      lenis.destroy();
    };
  }, []);

  const handleLaunchStudio = () => {
    if (isAuthenticated) {
      router.push('/studio');
    } else {
      openAuthModal();
    }
  };

  const handleExploreSchematics = () => {
    const el = document.getElementById('architecture');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative w-full bg-[#050608] text-[#F6F6F8] font-sans selection:bg-[#00F2A6] selection:text-[#050608] overflow-x-clip">
      
      {/* ── ATMOS Ambient Radial Atmospheric Lighting ────────────────── */}
      <div 
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          background: 'radial-gradient(circle at 65% 50%, rgba(0, 242, 166, 0.08) 0%, transparent 60%)',
        }}
      />
      <div 
        className="fixed top-0 left-0 w-[500px] h-[500px] pointer-events-none z-0 opacity-40 blur-[140px]"
        style={{
          background: 'radial-gradient(circle, rgba(0, 210, 255, 0.06) 0%, transparent 70%)',
        }}
      />

      {/* ── ATMOS Reverse-Engineered Film Grain Overlay ────────────── */}
      <div className="atmos-grain" />

      {/* ── ATMOS Reverse-Engineered Celestial Concentric Vortex Rings ── */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[780px] h-[780px] pointer-events-none z-5 opacity-25 select-none hidden md:block">
        <svg viewBox="0 0 500 500" className="w-full h-full hero-vortex">
          <circle cx="250" cy="250" r="230" stroke="#00F2A6" strokeWidth="1" strokeDasharray="4 8" fill="none" opacity="0.4" />
          <circle cx="250" cy="250" r="200" stroke="#00D2FF" strokeWidth="0.8" strokeDasharray="2 12" fill="none" opacity="0.3" />
          <circle cx="250" cy="250" r="160" stroke="#FFFFFF" strokeWidth="0.5" strokeDasharray="1 16" fill="none" opacity="0.2" />
          {/* Outer Degree Markers */}
          <line x1="250" y1="12" x2="250" y2="28" stroke="#00F2A6" strokeWidth="1.5" />
          <line x1="250" y1="472" x2="250" y2="488" stroke="#00F2A6" strokeWidth="1.5" />
          <line x1="12" y1="250" x2="28" y2="250" stroke="#00D2FF" strokeWidth="1.5" />
          <line x1="472" y1="250" x2="488" y2="250" stroke="#00D2FF" strokeWidth="1.5" />
        </svg>
      </div>
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] pointer-events-none z-5 opacity-15 select-none hidden md:block">
        <svg viewBox="0 0 400 400" className="w-full h-full hero-vortex-reverse">
          <circle cx="200" cy="200" r="180" stroke="#00F2A6" strokeWidth="1" strokeDasharray="8 16" fill="none" opacity="0.5" />
          <circle cx="200" cy="200" r="140" stroke="#00D2FF" strokeWidth="0.8" strokeDasharray="4 8" fill="none" opacity="0.3" />
        </svg>
      </div>

      {/* ── Fixed High-DPI Full-Screen Canvas Engine (164 Frames) ─────── */}
      <AtmosCanvasEngine progress={progress} />

      {/* ── Floating Header Dock (ATMOS Minimalist Dock) ─────────────── */}
      <AtmosNavbar />

      {/* ── 500vh Scrollytelling Pinned Stage ────────────────────────── */}
      <div
        id="hero"
        ref={scrollContainerRef}
        className="relative w-full h-[500vh]"
      >
        {/* Sticky 100vh Viewport */}
        <div className="sticky top-0 w-full h-screen overflow-hidden flex items-center justify-between z-20">
          <AtmosScrollytelling
            progress={progress}
            onLaunchStudio={handleLaunchStudio}
            onExploreSchematics={handleExploreSchematics}
          />
        </div>
      </div>

      {/* ── 02 // TECHNICAL ARCHITECTURE CARDS GRID ───────────────────── */}
      <AtmosArchitectureGrid />

      {/* ── 03 // TEAM SYNTROPY EXECUTIVE ENGINEERING DOSSIER ─────────── */}
      <AtmosTeamDossier />

      {/* ── FINAL LAUNCH STUDIO BANNER ─────────────────────────────────── */}
      <section className="relative z-30 py-24 px-6 sm:px-10 max-w-7xl mx-auto">
        <div className="p-10 sm:p-16 rounded-3xl bg-[#0A0D12]/70 border border-white/10 backdrop-blur-xl flex flex-col md:flex-row items-center justify-between gap-8 text-left shadow-[0_12px_40px_rgba(0,0,0,0.6)]">
          <div className="space-y-4 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00F2A6]/10 text-[#00F2A6] font-mono text-xs font-bold uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5" />
              <span>HARDWARE BRIDGE DEPLOYMENT</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-space font-black tracking-tight text-[#F6F6F8] uppercase leading-[1.1]">
              CONNECT YOUR HARDWARE GLOVE OR SIMULATE LIVE.
            </h2>
            <p className="text-sm sm:text-base text-[#7E8B95] font-sans leading-relaxed">
              Experience real-time 50Hz sensor streams, rolling oscilloscopes, 3D anatomical hand kinematics, and sub-15ms speech vocalization.
            </p>
          </div>

          <button
            onClick={handleLaunchStudio}
            className="w-full sm:w-auto px-8 py-4 rounded-full bg-[#F6F6F8] hover:bg-white text-[#050608] font-mono font-bold text-xs tracking-wider transition-all transform hover:scale-105 hover:shadow-[0_0_35px_rgba(246,246,248,0.4)] flex items-center justify-center gap-2 cursor-pointer shadow-xl shrink-0"
          >
            <span>LAUNCH DIAGNOSTICS STUDIO</span>
            <span className="text-sm font-bold">↗</span>
          </button>
        </div>
      </section>

      {/* ── ATMOS MINIMALIST FOOTER ───────────────────────────────────── */}
      <footer className="relative z-30 w-full border-t border-white/5 bg-[#050608] py-12 px-6 sm:px-10 text-xs text-[#7E8B95] font-mono">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
            <TeamSyntropyLogo width={160} height={36} />
            <span className="hidden sm:inline text-white/10">|</span>
            <span>SIGNOVA OS // ASSISTIVE KINEMATICS LAB</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-[11px]">
            <span className="text-[#00F2A6]">Seeed Xiao Sense</span>
            <span>•</span>
            <span className="text-[#00D2FF]">115200 Baud</span>
            <span>•</span>
            <span className="text-[#F6F6F8]">Nordic NUS BLE</span>
            <span>•</span>
            <span className="text-[#F59E0B]">Firebase Cloud</span>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default LandingPage;
