// ATMOS Multi-Stage Scrollytelling Stage (Phases 1 to 4)
// Left-half editorial typography & benchmarks, right-half glove orchestration

'use client';

import React from 'react';
import { ArrowRight, ChevronDown, Terminal, ShieldCheck, Activity, Cpu } from 'lucide-react';
import { AtmosTelemetryPins } from './AtmosTelemetryPins';
import { Atmos3DCard } from './Atmos3DCard';

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
  // Phase 1: Scroll 0% - 25% (Hero Genesis)
  const p1Opacity = progress <= 0.22 
    ? Math.max(0, 1 - progress / 0.20) 
    : 0;
  const p1Y = progress * -60;

  // Phase 2: Scroll 30% - 60% (Hardware Dissection & Telemetry)
  const p2Opacity = progress >= 0.26 && progress <= 0.62
    ? Math.min(
        (progress - 0.26) / 0.08,
        (0.62 - progress) / 0.08,
        1
      )
    : 0;
  const p2Y = (progress - 0.44) * -40;

  // Phase 3: Scroll 65% - 85% (Machine Learning Benchmark)
  const p3Opacity = progress >= 0.64 && progress <= 0.88
    ? Math.min(
        (progress - 0.64) / 0.08,
        (0.88 - progress) / 0.08,
        1
      )
    : 0;
  const p3Y = (progress - 0.76) * -40;

  return (
    <div className="relative w-full h-full flex items-center justify-between pointer-events-none select-none">
      {/* Subtle cinematic gradient scrim for crystal-clear typography legibility */}
      <div className="absolute inset-y-0 left-0 w-full lg:w-3/5 bg-gradient-to-r from-[#050608]/90 via-[#050608]/45 to-transparent pointer-events-none z-10" />
      
      {/* ── PHASE 1: HERO GENESIS (0% - 25%) ──────────────────────── */}
      <div
        style={{
          opacity: p1Opacity,
          transform: `translateY(${p1Y}px)`,
          visibility: p1Opacity <= 0.01 ? 'hidden' : 'visible',
          transition: 'opacity 0.15s ease-out',
        }}
        className="w-full lg:w-3/5 flex flex-col justify-center items-start text-left px-6 sm:px-12 lg:pl-16 z-20 pointer-events-auto"
      >
        {/* Kicker Badge with Cybernetic Pulse */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/10 text-[#00F2A6] text-xs font-mono font-bold tracking-[0.2em] uppercase mb-6 shadow-[0_0_20px_rgba(0,242,166,0.2)]">
          <span className="w-2 h-2 rounded-full bg-[#00F2A6] animate-pulse shadow-[0_0_8px_#00F2A6]" />
          <span>// DECENTRALIZED ASSISTIVE OS · REV.2026</span>
        </div>

        {/* Huge Headline in Stencil Display / Architectural Bone-White */}
        <h1 className="text-5xl sm:text-7xl lg:text-8xl xl:text-9xl font-stencil font-black tracking-tight text-[#F8FAFC] uppercase leading-[0.88] drop-shadow-[0_10px_35px_rgba(0,0,0,0.8)]">
          TURNING GESTURES{' '}
          <span
            className="glitch-text text-transparent bg-clip-text bg-gradient-to-r from-[#00F2A6] via-[#00D2FF] to-[#00F2A6] drop-shadow-[0_0_40px_rgba(0,242,166,0.4)]"
            data-text="INTO A VOICE."
          >
            INTO A VOICE.
          </span>
        </h1>

        {/* Editorial Subhead */}
        <p className="text-base sm:text-xl text-[#8A99A8] font-sans mt-8 max-w-xl leading-relaxed tracking-wide">
          A high-precision kinetic glove bridging dynamic hand biomechanics with sub-15ms deterministic edge ML vocalization.
        </p>

        {/* Cybernetic Actions: Primary & Ghost */}
        <div className="flex flex-wrap items-center gap-5 mt-10">
          <button
            onClick={onLaunchStudio}
            className="atmos-btn-primary px-8 py-4 text-xs tracking-[0.2em] flex items-center gap-2.5 cursor-pointer"
          >
            <span className="text-[#00F2A6] text-[10px] font-mono">[</span>
            <span>AUTHENTICATE & LAUNCH</span>
            <span className="text-[#00F2A6] text-[10px] font-mono">]</span>
            <span className="text-sm font-bold leading-none">↗</span>
          </button>

          <button
            onClick={onExploreSchematics}
            className="atmos-btn-ghost px-7 py-4 text-xs tracking-[0.2em] flex items-center gap-2.5 cursor-pointer"
          >
            <span className="text-[#7E8B95] text-[10px] font-mono">[</span>
            <span>01 // EXPLORE SCHEMATICS</span>
            <span className="text-[#7E8B95] text-[10px] font-mono">]</span>
            <ChevronDown className="w-3.5 h-3.5 text-[#00F2A6] animate-bounce" />
          </button>
        </div>

        {/* Bottom Coordinates & Frame Counter HUD */}
        <div className="mt-14 pt-6 border-t border-white/10 flex flex-wrap items-center gap-8 font-mono text-[11px] text-[#7E8B95]">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00F2A6]" />
            <span className="text-[#00F2A6] font-bold tracking-wider">LATENCY:</span>
            <span className="text-white font-bold">&lt; 15ms</span>
          </div>
          <span className="text-white/15">|</span>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00D2FF]" />
            <span className="text-[#00D2FF] font-bold tracking-wider">SAMPLING:</span>
            <span className="text-white font-bold">50Hz TRI-AXIS</span>
          </div>
          <span className="text-white/15">|</span>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#A855F7]" />
            <span className="text-[#A855F7] font-bold tracking-wider">ACCURACY:</span>
            <span className="text-[#00F2A6] font-bold">99.2% CLASSIFICATION</span>
          </div>
        </div>
      </div>

      {/* ── PHASE 2: HARDWARE DISSECTION (30% - 60%) ──────────────── */}
      <div
        style={{
          opacity: p2Opacity,
          transform: `translateY(${p2Y}px)`,
          visibility: p2Opacity <= 0.01 ? 'hidden' : 'visible',
          transition: 'opacity 0.15s ease-out',
        }}
        className="w-full lg:w-3/5 flex flex-col justify-center items-start text-left px-6 sm:px-12 lg:pl-16 z-20 pointer-events-auto"
      >
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#00F2A6]/10 border border-[#00F2A6]/30 text-[#00F2A6] text-xs font-mono font-bold tracking-[0.2em] uppercase mb-4 shadow-[0_0_20px_rgba(0,242,166,0.2)]">
          <Activity className="w-3.5 h-3.5" />
          <span>PHASE 02 // HARDWARE DISSECTION · TELEMETRY</span>
        </div>

        <h2 className="text-4xl sm:text-6xl font-space font-black tracking-tight text-[#F8FAFC] uppercase leading-[0.95]">
          BIOMECHANICAL TRANSDUCER ARRAY.
        </h2>

        <p className="text-sm sm:text-base text-[#8A99A8] font-sans mt-4 max-w-xl leading-relaxed">
          Precision polymer resistance flex strips capture continuous 0° to 90° articulation across Index, Middle, and Ring phalanges at 50Hz, powered by an internal LiPo telemetry loop.
        </p>

        {/* Technical Callout Specifications Strip with 3D Tilt Cards */}
        <div className="grid grid-cols-2 gap-5 mt-8 w-full max-w-lg font-mono">
          <Atmos3DCard accentColor="#00F2A6" className="p-5">
            <div className="text-[10px] text-[#7E8B95] uppercase tracking-widest font-bold">CHANNELS</div>
            <div className="text-2xl sm:text-3xl font-space font-black text-[#F8FAFC] mt-1.5">3 × 10-BIT ADC</div>
            <div className="text-[11px] text-[#00F2A6] font-semibold mt-1">Continuous Deflection</div>
          </Atmos3DCard>

          <Atmos3DCard accentColor="#00D2FF" className="p-5">
            <div className="text-[10px] text-[#7E8B95] uppercase tracking-widest font-bold">HOLD GUARD</div>
            <div className="text-2xl sm:text-3xl font-space font-black text-[#F8FAFC] mt-1.5">400MS DEBOUNCE</div>
            <div className="text-[11px] text-[#00D2FF] font-semibold mt-1">Zero False Triggers</div>
          </Atmos3DCard>
        </div>
      </div>

      {/* Floating 1px SVG Connector Telemetry Pins for Phase 2 */}
      <AtmosTelemetryPins progress={progress} />

      {/* ── PHASE 3: ML BENCHMARK READOUTS (65% - 85%) ────────────── */}
      <div
        style={{
          opacity: p3Opacity,
          transform: `translateY(${p3Y}px)`,
          visibility: p3Opacity <= 0.01 ? 'hidden' : 'visible',
          transition: 'opacity 0.15s ease-out',
        }}
        className="w-full lg:w-3/5 flex flex-col justify-center items-start text-left px-6 sm:px-12 lg:pl-16 z-20 pointer-events-auto"
      >
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#00D2FF]/10 border border-[#00D2FF]/30 text-[#00D2FF] text-xs font-mono font-bold tracking-[0.2em] uppercase mb-4 shadow-[0_0_20px_rgba(0,210,255,0.2)]">
          <Cpu className="w-3.5 h-3.5" />
          <span>PHASE 03 // BENCHMARK VERIFICATION</span>
        </div>

        <h2 className="text-4xl sm:text-6xl font-space font-black tracking-tight text-[#F8FAFC] uppercase leading-[0.95]">
          DETERMINISTIC EDGE VOCALIZATION.
        </h2>

        {/* Large Stat Readout matching ATMOS cards with 3D Tilt */}
        <div className="space-y-4 mt-8 w-full max-w-lg font-mono">
          <Atmos3DCard accentColor="#00F2A6" className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-4xl sm:text-5xl font-space font-black text-[#00F2A6] tracking-tight">
                  &lt; 15ms
                </div>
                <div className="text-xs text-[#8A99A8] mt-1 font-sans">
                  Deterministic Inference Latency
                </div>
              </div>
              <span className="text-[10px] px-3 py-1.5 rounded-full bg-[#00F2A6]/10 border border-[#00F2A6]/30 text-[#00F2A6] font-bold tracking-wider uppercase">
                SUB-FRAME
              </span>
            </div>
          </Atmos3DCard>

          <Atmos3DCard accentColor="#00D2FF" className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-4xl sm:text-5xl font-space font-black text-[#00D2FF] tracking-tight">
                  99.2%
                </div>
                <div className="text-xs text-[#8A99A8] mt-1 font-sans">
                  Dynamic Sign Classification Accuracy
                </div>
              </div>
              <span className="text-[10px] px-3 py-1.5 rounded-full bg-[#00D2FF]/10 border border-[#00D2FF]/30 text-[#00D2FF] font-bold tracking-wider uppercase">
                CLINICAL BENCHMARK
              </span>
            </div>
          </Atmos3DCard>

          <Atmos3DCard accentColor="#F8FAFC" className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-4xl sm:text-5xl font-space font-black text-[#F8FAFC] tracking-tight">
                  0.00ms
                </div>
                <div className="text-xs text-[#8A99A8] mt-1 font-sans">
                  Web-Hardware Zero-Buffer Stream
                </div>
              </div>
              <span className="text-[10px] px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-white font-bold tracking-wider uppercase">
                NUS BLE 5.0
              </span>
            </div>
          </Atmos3DCard>
        </div>
      </div>

    </div>
  );
};

export default AtmosScrollytelling;
