// ATMOS Technical Architecture Cards Grid
// 3-column responsive grid with authentic 3D perspective tilt, mouse-following spotlight, and cybernetic HUD crosshairs

'use client';

import React from 'react';
import { Activity, Cpu, Cloud } from 'lucide-react';
import { Atmos3DCard } from './Atmos3DCard';

export const AtmosArchitectureGrid: React.FC = () => {
  return (
    <section id="architecture" className="relative z-30 py-36 px-6 sm:px-10 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="space-y-5 max-w-3xl mb-20 text-left">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/10 text-[#00F2A6] text-xs font-mono font-bold tracking-[0.2em] uppercase shadow-[0_0_20px_rgba(0,242,166,0.15)]">
          <span className="w-2 h-2 rounded-full bg-[#00F2A6] animate-pulse shadow-[0_0_8px_#00F2A6]" />
          <span>02 // ARCHITECTURAL SUBSYSTEMS</span>
        </div>
        <h2 className="text-4xl sm:text-6xl lg:text-7xl font-stencil font-black tracking-tight text-[#F8FAFC] uppercase leading-[0.9]">
          HIGH-PRECISION KINEMATICS ENGINE.
        </h2>
        <p className="text-sm sm:text-lg text-[#8A99A8] font-sans leading-relaxed max-w-2xl">
          Three decoupled hardware and neural pipelines synchronizing sub-millivolt phalangeal deflection with deterministic edge vocalization.
        </p>
      </div>

      {/* 3-Column 3D Tilt Card Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Card 1: Sensory Kinematics */}
        <Atmos3DCard accentColor="#00F2A6" className="p-8 flex flex-col justify-between min-h-[380px]">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="w-14 h-14 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-center text-[#00F2A6] group-hover:scale-110 group-hover:border-[#00F2A6]/50 transition-all shadow-[0_0_15px_rgba(0,242,166,0.15)]">
                <Activity className="w-7 h-7" />
              </div>
              <span className="font-mono text-xs text-[#7E8B95] tracking-[0.2em] font-bold">01 / 03</span>
            </div>

            <div>
              <h3 className="text-2xl font-space font-black text-[#F8FAFC] group-hover:text-[#00F2A6] transition-colors leading-tight">
                Sensory Kinematics
              </h3>
              <p className="text-sm text-[#8A99A8] font-sans mt-3.5 leading-relaxed">
                Real-time flex arrays & IMU motion streaming over high-baud serial/WebSockets. Continuous analog deflection tracking at 50Hz with auto-adaptive baseline calibration.
              </p>
            </div>
          </div>

          <div className="pt-6 mt-8 border-t border-white/10 flex items-center justify-between font-mono text-xs">
            <span className="text-[#00F2A6] tracking-wider uppercase font-bold">50Hz Dynamic Polling</span>
            <span className="text-[#7E8B95]">3 Analog Channels</span>
          </div>
        </Atmos3DCard>

        {/* Card 2: Edge Gesture Intelligence */}
        <Atmos3DCard accentColor="#00D2FF" className="p-8 flex flex-col justify-between min-h-[380px]">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="w-14 h-14 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-center text-[#00D2FF] group-hover:scale-110 group-hover:border-[#00D2FF]/50 transition-all shadow-[0_0_15px_rgba(0,210,255,0.15)]">
                <Cpu className="w-7 h-7" />
              </div>
              <span className="font-mono text-xs text-[#7E8B95] tracking-[0.2em] font-bold">02 / 03</span>
            </div>

            <div>
              <h3 className="text-2xl font-space font-black text-[#F8FAFC] group-hover:text-[#00D2FF] transition-colors leading-tight">
                Edge Gesture Intelligence
              </h3>
              <p className="text-sm text-[#8A99A8] font-sans mt-3.5 leading-relaxed">
                On-device neural network classifying ASL & gesture trajectories into audible speech. Integrated 400ms temporal hold debounce eliminates transitional false positives.
              </p>
            </div>
          </div>

          <div className="pt-6 mt-8 border-t border-white/10 flex items-center justify-between font-mono text-xs">
            <span className="text-[#00D2FF] tracking-wider uppercase font-bold">&lt; 15ms Latency</span>
            <span className="text-[#7E8B95]">400ms Guard Window</span>
          </div>
        </Atmos3DCard>

        {/* Card 3: Firebase Telemetry Sync */}
        <Atmos3DCard accentColor="#F59E0B" className="p-8 flex flex-col justify-between min-h-[380px]">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="w-14 h-14 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-center text-[#F59E0B] group-hover:scale-110 group-hover:border-[#F59E0B]/50 transition-all shadow-[0_0_15px_rgba(245,158,11,0.15)]">
                <Cloud className="w-7 h-7" />
              </div>
              <span className="font-mono text-xs text-[#7E8B95] tracking-[0.2em] font-bold">03 / 03</span>
            </div>

            <div>
              <h3 className="text-2xl font-space font-black text-[#F8FAFC] group-hover:text-[#F59E0B] transition-colors leading-tight">
                Firebase Telemetry Sync
              </h3>
              <p className="text-sm text-[#8A99A8] font-sans mt-3.5 leading-relaxed">
                Cloud profile synchronization, calibration data, and authentication state. Seamlessly binds individual operator anatomical profiles across multiple diagnostic nodes.
              </p>
            </div>
          </div>

          <div className="pt-6 mt-8 border-t border-white/10 flex items-center justify-between font-mono text-xs">
            <span className="text-[#F59E0B] tracking-wider uppercase font-bold">Cloud Profiles</span>
            <span className="text-[#7E8B95]">Real-time State</span>
          </div>
        </Atmos3DCard>

      </div>
    </section>
  );
};

export default AtmosArchitectureGrid;
