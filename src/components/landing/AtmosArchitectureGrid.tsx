// ATMOS Technical Architecture Cards Grid
// 3-column responsive grid with frosted glass backing, 1px gradient borders, and hover micro-animations

'use client';

import React from 'react';
import { Activity, Cpu, Cloud, ArrowUpRight, Sparkles } from 'lucide-react';

export const AtmosArchitectureGrid: React.FC = () => {
  return (
    <section id="architecture" className="relative z-30 py-32 px-6 sm:px-10 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="space-y-4 max-w-3xl mb-16 text-left">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.03] border border-white/10 text-[#00F2A6] text-xs font-mono font-bold tracking-widest uppercase">
          <span className="w-1.5 h-1.5 rounded-full bg-[#00F2A6] animate-pulse" />
          <span>02 // ARCHITECTURAL SUBSYSTEMS</span>
        </div>
        <h2 className="text-3xl sm:text-5xl lg:text-6xl font-space font-black tracking-tight text-[#F6F6F8] uppercase leading-[1.1]">
          HIGH-PRECISION KINEMATICS ENGINE.
        </h2>
        <p className="text-sm sm:text-base text-[#7E8B95] font-sans leading-relaxed max-w-2xl">
          Three decoupled hardware and neural pipelines synchronizing sub-millivolt phalangeal deflection with deterministic edge vocalization.
        </p>
      </div>

      {/* 3-Column Glass Card Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Card 1: Sensory Kinematics */}
        <div className="group relative p-8 rounded-3xl bg-[#0A0D12]/70 border border-white/10 hover:border-[#00F2A6]/50 transition-all duration-500 shadow-[0_12px_40px_rgba(0,0,0,0.6)] hover:shadow-[0_0_50px_rgba(0,242,166,0.15)] flex flex-col justify-between backdrop-blur-xl overflow-hidden">
          {/* Subtle Hover Gradient Glow */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-[#00F2A6]/5 rounded-full blur-3xl pointer-events-none group-hover:bg-[#00F2A6]/10 transition-colors" />

          <div className="space-y-6 relative z-10">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-center text-[#00F2A6] group-hover:scale-110 transition-transform">
                <Activity className="w-6 h-6" />
              </div>
              <span className="font-mono text-xs text-[#7E8B95] tracking-widest">01 / 03</span>
            </div>

            <div>
              <h3 className="text-xl sm:text-2xl font-space font-bold text-[#F6F6F8] group-hover:text-[#00F2A6] transition-colors">
                Sensory Kinematics
              </h3>
              <p className="text-xs sm:text-sm text-[#7E8B95] font-sans mt-3 leading-relaxed">
                Real-time flex arrays & IMU motion streaming over high-baud serial/WebSockets. Continuous analog deflection tracking at 50Hz with auto-adaptive baseline calibration.
              </p>
            </div>
          </div>

          <div className="pt-8 mt-8 border-t border-white/5 relative z-10 flex items-center justify-between font-mono text-[11px]">
            <span className="text-[#00F2A6] tracking-wider uppercase font-bold">50Hz Dynamic Polling</span>
            <span className="text-[#7E8B95]">3 Analog Channels</span>
          </div>
        </div>

        {/* Card 2: Edge Gesture Intelligence */}
        <div className="group relative p-8 rounded-3xl bg-[#0A0D12]/70 border border-white/10 hover:border-[#00D2FF]/50 transition-all duration-500 shadow-[0_12px_40px_rgba(0,0,0,0.6)] hover:shadow-[0_0_50px_rgba(0,210,255,0.15)] flex flex-col justify-between backdrop-blur-xl overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-[#00D2FF]/5 rounded-full blur-3xl pointer-events-none group-hover:bg-[#00D2FF]/10 transition-colors" />

          <div className="space-y-6 relative z-10">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-center text-[#00D2FF] group-hover:scale-110 transition-transform">
                <Cpu className="w-6 h-6" />
              </div>
              <span className="font-mono text-xs text-[#7E8B95] tracking-widest">02 / 03</span>
            </div>

            <div>
              <h3 className="text-xl sm:text-2xl font-space font-bold text-[#F6F6F8] group-hover:text-[#00D2FF] transition-colors">
                Edge Gesture Intelligence
              </h3>
              <p className="text-xs sm:text-sm text-[#7E8B95] font-sans mt-3 leading-relaxed">
                On-device neural network classifying ASL & gesture trajectories into audible speech. Integrated 400ms temporal hold debounce eliminates transitional false positives.
              </p>
            </div>
          </div>

          <div className="pt-8 mt-8 border-t border-white/5 relative z-10 flex items-center justify-between font-mono text-[11px]">
            <span className="text-[#00D2FF] tracking-wider uppercase font-bold">&lt; 15ms Latency</span>
            <span className="text-[#7E8B95]">400ms Guard Window</span>
          </div>
        </div>

        {/* Card 3: Firebase Telemetry Sync */}
        <div className="group relative p-8 rounded-3xl bg-[#0A0D12]/70 border border-white/10 hover:border-[#F59E0B]/50 transition-all duration-500 shadow-[0_12px_40px_rgba(0,0,0,0.6)] hover:shadow-[0_0_50px_rgba(245,158,11,0.15)] flex flex-col justify-between backdrop-blur-xl overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-[#F59E0B]/5 rounded-full blur-3xl pointer-events-none group-hover:bg-[#F59E0B]/10 transition-colors" />

          <div className="space-y-6 relative z-10">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-center text-[#F59E0B] group-hover:scale-110 transition-transform">
                <Cloud className="w-6 h-6" />
              </div>
              <span className="font-mono text-xs text-[#7E8B95] tracking-widest">03 / 03</span>
            </div>

            <div>
              <h3 className="text-xl sm:text-2xl font-space font-bold text-[#F6F6F8] group-hover:text-[#F59E0B] transition-colors">
                Firebase Telemetry Sync
              </h3>
              <p className="text-xs sm:text-sm text-[#7E8B95] font-sans mt-3 leading-relaxed">
                Cloud profile synchronization, calibration data, and authentication state. Seamlessly binds individual operator anatomical profiles across multiple diagnostic nodes.
              </p>
            </div>
          </div>

          <div className="pt-8 mt-8 border-t border-white/5 relative z-10 flex items-center justify-between font-mono text-[11px]">
            <span className="text-[#F59E0B] tracking-wider uppercase font-bold">Cloud Profiles</span>
            <span className="text-[#7E8B95]">Real-time State</span>
          </div>
        </div>

      </div>
    </section>
  );
};

export default AtmosArchitectureGrid;
