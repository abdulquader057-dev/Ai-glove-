// ATMOS Multi-Stage Scrollytelling Stage (Phases 1 to 4)
// Left-half editorial typography & benchmarks, right-half glove orchestration

'use client';

import React from 'react';
import { ArrowRight, ChevronDown, Terminal, ShieldCheck, Activity, Cpu } from 'lucide-react';
import { AtmosTelemetryPins } from './AtmosTelemetryPins';

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
        className="w-full lg:w-1/2 flex flex-col justify-center items-start text-left px-6 sm:px-12 lg:pl-16 z-20 pointer-events-auto"
      >
        {/* Kicker Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 text-[#00F2A6] text-xs font-mono font-bold tracking-widest uppercase mb-6 shadow-[0_0_20px_rgba(0,242,166,0.15)]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#00F2A6] animate-pulse" />
          <span>// DECENTRALIZED ASSISTIVE OS</span>
        </div>

        {/* Huge Headline in Space Grotesk / Architectural Bone-White */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-space font-black tracking-tight text-[#F6F6F8] uppercase leading-[1.05]">
          TURNING GESTURES{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00F2A6] via-[#00D2FF] to-[#00F2A6] drop-shadow-[0_0_35px_rgba(0,242,166,0.3)]">
            INTO A VOICE.
          </span>
        </h1>

        {/* Editorial Subhead */}
        <p className="text-base sm:text-lg text-[#7E8B95] font-sans mt-6 max-w-xl leading-relaxed">
          A high-precision kinetic glove bridging dynamic hand biomechanics with sub-15ms edge ML translation.
        </p>

        {/* Actions: Primary & Ghost */}
        <div className="flex flex-wrap items-center gap-4 mt-8">
          <button
            onClick={onLaunchStudio}
            className="px-7 py-3.5 rounded-full bg-[#F6F6F8] hover:bg-white text-[#050608] font-mono font-bold text-xs tracking-wider transition-all transform hover:scale-105 hover:shadow-[0_0_30px_rgba(246,246,248,0.35)] flex items-center gap-2 cursor-pointer shadow-lg"
          >
            <span>AUTHENTICATE & LAUNCH</span>
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

        {/* Bottom Coordinates & Frame Counter HUD */}
        <div className="mt-14 pt-6 border-t border-white/5 flex items-center gap-6 font-mono text-[11px] text-[#7E8B95]">
          <div>
            <span className="text-[#00F2A6] font-bold">LATENCY</span>
            <span className="text-white ml-2">&lt; 15ms</span>
          </div>
          <span className="text-white/10">|</span>
          <div>
            <span className="text-[#00D2FF] font-bold">SAMPLING</span>
            <span className="text-white ml-2">50Hz Tri-Axis</span>
          </div>
          <span className="text-white/10">|</span>
          <div>
            <span className="text-white font-bold">ACCURACY</span>
            <span className="text-[#00F2A6] ml-2">99.2%</span>
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
        className="w-full lg:w-1/2 flex flex-col justify-center items-start text-left px-6 sm:px-12 lg:pl-16 z-20 pointer-events-auto"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00F2A6]/10 border border-[#00F2A6]/30 text-[#00F2A6] text-xs font-mono font-bold tracking-widest uppercase mb-4 shadow-[0_0_15px_rgba(0,242,166,0.15)]">
          <Activity className="w-3.5 h-3.5" />
          <span>PHASE 02 // HARDWARE DISSECTION</span>
        </div>

        <h2 className="text-3xl sm:text-5xl font-space font-black tracking-tight text-[#F6F6F8] uppercase leading-[1.1]">
          BIOMECHANICAL TRANSDUCER ARRAY.
        </h2>

        <p className="text-sm sm:text-base text-[#7E8B95] font-sans mt-4 max-w-xl leading-relaxed">
          Precision polymer resistance flex strips capture continuous 0° to 90° articulation across Index, Middle, and Ring phalanges at 50Hz, powered by an internal LiPo telemetry loop.
        </p>

        {/* Technical Callout Specifications Strip */}
        <div className="grid grid-cols-2 gap-4 mt-8 w-full max-w-md font-mono">
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
            <div className="text-[10px] text-[#7E8B95] uppercase tracking-wider">CHANNELS</div>
            <div className="text-xl font-bold text-[#F6F6F8] mt-1">3 × 10-Bit ADC</div>
            <div className="text-[10px] text-[#00F2A6] mt-0.5">Continuous Deflection</div>
          </div>

          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
            <div className="text-[10px] text-[#7E8B95] uppercase tracking-wider">HOLD GUARD</div>
            <div className="text-xl font-bold text-[#F6F6F8] mt-1">400ms Debounce</div>
            <div className="text-[10px] text-[#00D2FF] mt-0.5">Zero False Triggers</div>
          </div>
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
        className="w-full lg:w-1/2 flex flex-col justify-center items-start text-left px-6 sm:px-12 lg:pl-16 z-20 pointer-events-auto"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00D2FF]/10 border border-[#00D2FF]/30 text-[#00D2FF] text-xs font-mono font-bold tracking-widest uppercase mb-4 shadow-[0_0_15px_rgba(0,210,255,0.15)]">
          <Cpu className="w-3.5 h-3.5" />
          <span>PHASE 03 // BENCHMARK VERIFICATION</span>
        </div>

        <h2 className="text-3xl sm:text-5xl font-space font-black tracking-tight text-[#F6F6F8] uppercase leading-[1.1]">
          DETERMINISTIC EDGE VOCALIZATION.
        </h2>

        {/* Large Stat Readout matching prompt requirements */}
        <div className="space-y-6 mt-8 w-full max-w-lg font-mono">
          <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 flex items-center justify-between">
            <div>
              <div className="text-3xl sm:text-4xl font-space font-black text-[#00F2A6]">
                &lt; 15ms
              </div>
              <div className="text-xs text-[#7E8B95] mt-1 font-sans">
                Deterministic Inference Latency
              </div>
            </div>
            <span className="text-[10px] px-2.5 py-1 rounded-md bg-[#00F2A6]/10 text-[#00F2A6] font-bold">
              SUB-FRAME
            </span>
          </div>

          <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 flex items-center justify-between">
            <div>
              <div className="text-3xl sm:text-4xl font-space font-black text-[#00D2FF]">
                99.2%
              </div>
              <div className="text-xs text-[#7E8B95] mt-1 font-sans">
                Dynamic Sign Classification Accuracy
              </div>
            </div>
            <span className="text-[10px] px-2.5 py-1 rounded-md bg-[#00D2FF]/10 text-[#00D2FF] font-bold">
              CLINICAL BENCHMARK
            </span>
          </div>

          <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 flex items-center justify-between">
            <div>
              <div className="text-3xl sm:text-4xl font-space font-black text-[#F6F6F8]">
                0.00ms
              </div>
              <div className="text-xs text-[#7E8B95] mt-1 font-sans">
                Web-Hardware Zero-Buffer Stream
              </div>
            </div>
            <span className="text-[10px] px-2.5 py-1 rounded-md bg-white/10 text-white font-bold">
              NUS BLE 5.0
            </span>
          </div>
        </div>
      </div>

    </div>
  );
};

export default AtmosScrollytelling;
