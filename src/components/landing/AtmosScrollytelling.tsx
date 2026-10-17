// ATMOS Asymmetric Editorial Scrollytelling (Beats 1 to 3)
// Typography positioned strictly on the left grid (w-full lg:w-5/12), keeping the 3D WebGL model unobstructed

'use client';

import React from 'react';
import { ArrowUpRight, ChevronDown, Activity, Cpu, Sparkles, Zap } from 'lucide-react';

interface AtmosScrollytellingProps {
  progress: number;
  onLaunchStudio: () => void;
  onExploreSchematics: () => void;
}

export const AtmosScrollytelling: React.FC<AtmosScrollytellingProps> = ({
  progress,
  onLaunchStudio,
  onExploreSchematics,
}) => {
  // Beat 1: Scroll 0% - 25% (Hero Genesis)
  const b1Opacity = progress <= 0.25 
    ? Math.max(0, 1 - progress / 0.22) 
    : 0;
  const b1Y = progress * -40;

  // Beat 2: Scroll 30% - 60% (Hardware Dissection & Telemetry)
  const b2Opacity = progress >= 0.28 && progress <= 0.62
    ? Math.min(
        (progress - 0.28) / 0.06,
        (0.62 - progress) / 0.06,
        1
      )
    : 0;
  const b2Y = (progress - 0.45) * -30;

  // Beat 3: Scroll 65% - 85% (Performance Readouts)
  const b3Opacity = progress >= 0.64 && progress <= 0.88
    ? Math.min(
        (progress - 0.64) / 0.06,
        (0.88 - progress) / 0.06,
        1
      )
    : 0;
  const b3Y = (progress - 0.76) * -30;

  return (
    <div className="relative w-full h-full flex items-center justify-between px-6 sm:px-12 lg:px-20 pointer-events-none select-none z-20">
      
      {/* ── BEAT 1 (0% - 25% SCROLL): HERO GENESIS ──────────────────── */}
      <div
        style={{
          opacity: b1Opacity,
          transform: `translateY(${b1Y}px)`,
          visibility: b1Opacity <= 0.01 ? 'hidden' : 'visible',
          transition: 'opacity 0.2s ease-out',
        }}
        className="w-full lg:w-5/12 flex flex-col justify-center items-start text-left pointer-events-auto"
      >
        {/* Kicker Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.03] border border-white/10 text-[#00F2A6] text-xs font-mono font-bold tracking-widest uppercase mb-6 shadow-[0_0_20px_rgba(0,242,166,0.15)]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#00F2A6] animate-pulse" />
          <span>// 2026 DECENTRALIZED ASSISTIVE OS</span>
        </div>

        {/* Clean, High-Contrast Editorial Headline */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-space font-black tracking-tight text-[#F6F6F8] uppercase leading-[1.05]">
          TURNING GESTURES{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00F2A6] via-[#00D2FF] to-[#00F2A6] drop-shadow-[0_0_35px_rgba(0,242,166,0.25)]">
            INTO A VOICE.
          </span>
        </h1>

        {/* Editorial Subhead */}
        <p className="text-base sm:text-lg text-[#7E8B95] font-sans mt-6 leading-relaxed">
          A high-precision kinetic smart glove translating physical sign trajectories into audible expression via sub-15ms edge inference.
        </p>

        {/* Minimalist Bone-White Pill Button: [ LAUNCH CLINICAL STUDIO ↗ ] */}
        <div className="flex flex-wrap items-center gap-4 mt-8">
          <button
            onClick={onLaunchStudio}
            className="px-7 py-3.5 rounded-full bg-[#F6F6F8] hover:bg-white text-[#050608] font-mono font-bold text-xs tracking-wider transition-all transform hover:scale-105 hover:shadow-[0_0_30px_rgba(246,246,248,0.35)] flex items-center gap-2 cursor-pointer shadow-xl"
          >
            <span>LAUNCH CLINICAL STUDIO</span>
            <span className="text-sm font-bold">↗</span>
          </button>

          <button
            onClick={onExploreSchematics}
            className="px-6 py-3.5 rounded-full bg-transparent hover:bg-white/5 border border-white/15 text-[#F6F6F8] font-mono font-bold text-xs tracking-wider transition-all flex items-center gap-2 cursor-pointer"
          >
            <span>EXPLORE SCHEMATICS</span>
            <ChevronDown className="w-3.5 h-3.5 text-[#00F2A6] animate-bounce" />
          </button>
        </div>

        {/* Coordinates Strip */}
        <div className="mt-14 pt-6 border-t border-white/5 flex items-center gap-6 font-mono text-[11px] text-[#7E8B95]">
          <div>
            <span className="text-[#00F2A6] font-bold">LATENCY</span>
            <span className="text-white ml-2">&lt; 15ms</span>
          </div>
          <span className="text-white/10">|</span>
          <div>
            <span className="text-[#00D2FF] font-bold">MODEL</span>
            <span className="text-white ml-2">XIAO / ESP32-S3</span>
          </div>
          <span className="text-white/10">|</span>
          <div>
            <span className="text-white font-bold">ACCURACY</span>
            <span className="text-[#00F2A6] ml-2">99.2%</span>
          </div>
        </div>
      </div>

      {/* ── BEAT 2 (30% - 60% SCROLL): HARDWARE DISSECTION ──────────── */}
      <div
        style={{
          opacity: b2Opacity,
          transform: `translateY(${b2Y}px)`,
          visibility: b2Opacity <= 0.01 ? 'hidden' : 'visible',
          transition: 'opacity 0.2s ease-out',
        }}
        className="w-full lg:w-5/12 flex flex-col justify-center items-start text-left pointer-events-auto"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00F2A6]/10 border border-[#00F2A6]/30 text-[#00F2A6] text-xs font-mono font-bold tracking-widest uppercase mb-4 shadow-[0_0_15px_rgba(0,242,166,0.15)]">
          <Activity className="w-3.5 h-3.5" />
          <span>PHASE 02 // HARDWARE DISSECTION</span>
        </div>

        <h2 className="text-3xl sm:text-5xl font-space font-black tracking-tight text-[#F6F6F8] uppercase leading-[1.1]">
          INTERNAL CHASSIS ARCHITECTURE.
        </h2>

        <p className="text-sm sm:text-base text-[#7E8B95] font-sans mt-4 leading-relaxed">
          The 3D model rotates 180° to expose the embedded microcontroller, power bus, and flex transducers. Hover over the 3D annotation pins to view subsystem telemetry.
        </p>

        {/* Technical Callout Specifications Strip */}
        <div className="grid grid-cols-2 gap-4 mt-8 w-full font-mono">
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
            <div className="text-[10px] text-[#7E8B95] uppercase tracking-wider">PWR-3.7V CORE</div>
            <div className="text-lg font-bold text-[#F6F6F8] mt-1">500mAh LiPo</div>
            <div className="text-[10px] text-[#F59E0B] mt-0.5">8h Continuous Loop</div>
          </div>

          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
            <div className="text-[10px] text-[#7E8B95] uppercase tracking-wider">ESP32-S3 ENGINE</div>
            <div className="text-lg font-bold text-[#F6F6F8] mt-1">Sub-15ms ML</div>
            <div className="text-[10px] text-[#00D2FF] mt-0.5">Neural In-Sensor</div>
          </div>
        </div>
      </div>

      {/* ── BEAT 3 (65% - 85% SCROLL): ML BENCHMARKS ────────────────── */}
      <div
        style={{
          opacity: b3Opacity,
          transform: `translateY(${b3Y}px)`,
          visibility: b3Opacity <= 0.01 ? 'hidden' : 'visible',
          transition: 'opacity 0.2s ease-out',
        }}
        className="w-full lg:w-5/12 flex flex-col justify-center items-start text-left pointer-events-auto"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00D2FF]/10 border border-[#00D2FF]/30 text-[#00D2FF] text-xs font-mono font-bold tracking-widest uppercase mb-4 shadow-[0_0_15px_rgba(0,210,255,0.15)]">
          <Cpu className="w-3.5 h-3.5" />
          <span>PHASE 03 // BENCHMARK VERIFICATION</span>
        </div>

        <h2 className="text-3xl sm:text-5xl font-space font-black tracking-tight text-[#F6F6F8] uppercase leading-[1.1]">
          CLINICALLY VERIFIED KINEMATICS.
        </h2>

        {/* Large Stat Readout matching Beat 3 requirements */}
        <div className="space-y-4 mt-8 w-full font-mono">
          <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 flex items-center justify-between">
            <div>
              <div className="text-3xl sm:text-4xl font-space font-black text-[#00F2A6]">
                &lt; 15ms
              </div>
              <div className="text-xs text-[#7E8B95] mt-1 font-sans">
                Inference Latency
              </div>
            </div>
            <span className="text-[10px] px-2.5 py-1 rounded-md bg-[#00F2A6]/10 text-[#00F2A6] font-bold">
              EDGE REAL-TIME
            </span>
          </div>

          <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 flex items-center justify-between">
            <div>
              <div className="text-3xl sm:text-4xl font-space font-black text-[#00D2FF]">
                99.2%
              </div>
              <div className="text-xs text-[#7E8B95] mt-1 font-sans">
                Gesture Accuracy
              </div>
            </div>
            <span className="text-[10px] px-2.5 py-1 rounded-md bg-[#00D2FF]/10 text-[#00D2FF] font-bold">
              BENCHMARK
            </span>
          </div>

          <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 flex items-center justify-between">
            <div>
              <div className="text-3xl sm:text-4xl font-space font-black text-[#F6F6F8]">
                0.00ms
              </div>
              <div className="text-xs text-[#7E8B95] mt-1 font-sans">
                Zero-Buffer WebSockets / NUS BLE
              </div>
            </div>
            <span className="text-[10px] px-2.5 py-1 rounded-md bg-white/10 text-white font-bold">
              LOSSLESS
            </span>
          </div>
        </div>
      </div>

    </div>
  );
};

export default AtmosScrollytelling;
