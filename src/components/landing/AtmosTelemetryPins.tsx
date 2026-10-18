// Floating ATMOS-Style Telemetry Callout Pins with Reverse-Engineered Optical Pulse Lines
// Active during Phase 2 (Scroll 30% - 60%)

'use client';

import React from 'react';

interface AtmosTelemetryPinsProps {
  progress: number;
}

export const AtmosTelemetryPins: React.FC<AtmosTelemetryPinsProps> = ({ progress }) => {
  // Active window: 30% - 60%
  const isVisible = progress >= 0.28 && progress <= 0.62;
  const pinOpacity = isVisible
    ? Math.min(
        (progress - 0.28) / 0.06,
        (0.62 - progress) / 0.06,
        1
      )
    : 0;

  if (pinOpacity <= 0.01) return null;

  return (
    <div
      style={{
        opacity: pinOpacity,
        transition: 'opacity 0.25s ease-out',
      }}
      className="fixed inset-0 z-20 pointer-events-none select-none hidden lg:block"
    >
      {/* ── Pin 1: Flex Transducers (Fingers / Phalanx Array) ── */}
      <div className="absolute top-[24%] right-[16%] flex items-center">
        {/* SVG Connector with Optical Pulse */}
        <svg width="130" height="44" className="overflow-visible">
          {/* Target anchor ring with pulse */}
          <circle cx="10" cy="30" r="3" fill="#00F2A6" />
          <circle cx="10" cy="30" r="8" stroke="#00F2A6" strokeWidth="1" strokeOpacity="0.4" className="animate-ping" />
          
          {/* Base dashed line */}
          <path d="M 10 30 L 60 12 L 130 12" stroke="#00F2A6" strokeWidth="1" strokeOpacity="0.3" strokeDasharray="3 3" fill="none" />
          
          {/* Optical traveling light pulse */}
          <path d="M 10 30 L 60 12 L 130 12" stroke="#00F2A6" strokeWidth="1.5" fill="none" className="hero-trace-pulse" />
        </svg>

        {/* Frosted Glass Callout Card */}
        <div className="p-4 rounded-2xl backdrop-blur-xl bg-black/60 border border-[#00F2A6]/40 shadow-[0_10px_35px_rgba(0,0,0,0.7),0_0_25px_rgba(0,242,166,0.2)] font-mono text-left max-w-xs -ml-2">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00F2A6] animate-pulse" />
            <span className="text-[10px] text-[#00F2A6] font-bold tracking-widest uppercase">
              [FLEX TRANSDUCERS]
            </span>
          </div>
          <div className="text-xs font-bold text-[#F6F6F8] mt-1 font-space">
            5-Finger Biomechanical Ribbon Array
          </div>
          <div className="text-[10px] text-[#7E8B95] mt-1 font-sans leading-relaxed">
            Continuous analog deflection tracking at 50Hz with auto-zeroing.
          </div>
        </div>
      </div>

      {/* ── Pin 2: Edge MCU (Palm / Neural Controller) ── */}
      <div className="absolute top-[48%] right-[22%] flex items-center flex-row-reverse">
        {/* SVG Connector with Optical Pulse */}
        <svg width="120" height="44" className="overflow-visible">
          <circle cx="110" cy="22" r="3" fill="#00D2FF" />
          <circle cx="110" cy="22" r="8" stroke="#00D2FF" strokeWidth="1" strokeOpacity="0.4" className="animate-ping" />
          
          <path d="M 110 22 L 60 22 L 0 22" stroke="#00D2FF" strokeWidth="1" strokeOpacity="0.3" strokeDasharray="3 3" fill="none" />
          <path d="M 110 22 L 60 22 L 0 22" stroke="#00D2FF" strokeWidth="1.5" fill="none" className="hero-trace-pulse" />
        </svg>

        {/* Frosted Glass Callout Card */}
        <div className="p-4 rounded-2xl backdrop-blur-xl bg-black/60 border border-[#00D2FF]/40 shadow-[0_10px_35px_rgba(0,0,0,0.7),0_0_25px_rgba(0,210,255,0.2)] font-mono text-left max-w-xs -mr-2">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00D2FF] animate-pulse" />
            <span className="text-[10px] text-[#00D2FF] font-bold tracking-widest uppercase">
              [EDGE MCU]
            </span>
          </div>
          <div className="text-xs font-bold text-[#F6F6F8] mt-1 font-space">
            ESP32-S3 // Neural In-Sensor Inference
          </div>
          <div className="text-[10px] text-[#7E8B95] mt-1 font-sans leading-relaxed">
            Deterministic sub-15ms classification & Nordic NUS BLE pipeline.
          </div>
        </div>
      </div>

      {/* ── Pin 3: Power Core (Wrist / Battery Compartment) ── */}
      <div className="absolute top-[70%] right-[16%] flex items-center">
        {/* SVG Connector with Optical Pulse */}
        <svg width="130" height="44" className="overflow-visible">
          <circle cx="10" cy="18" r="3" fill="#F59E0B" />
          <circle cx="10" cy="18" r="8" stroke="#F59E0B" strokeWidth="1" strokeOpacity="0.4" className="animate-ping" />
          
          <path d="M 10 18 L 60 30 L 130 30" stroke="#F59E0B" strokeWidth="1" strokeOpacity="0.3" strokeDasharray="3 3" fill="none" />
          <path d="M 10 18 L 60 30 L 130 30" stroke="#F59E0B" strokeWidth="1.5" fill="none" className="hero-trace-pulse" />
        </svg>

        {/* Frosted Glass Callout Card */}
        <div className="p-4 rounded-2xl backdrop-blur-xl bg-black/60 border border-[#F59E0B]/40 shadow-[0_10px_35px_rgba(0,0,0,0.7),0_0_25px_rgba(245,158,11,0.2)] font-mono text-left max-w-xs -ml-2">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B] animate-pulse" />
            <span className="text-[10px] text-[#F59E0B] font-bold tracking-widest uppercase">
              [POWER CORE]
            </span>
          </div>
          <div className="text-xs font-bold text-[#F6F6F8] mt-1 font-space">
            3.7V LiPo // Continuous Telemetry Loop
          </div>
          <div className="text-[10px] text-[#7E8B95] mt-1 font-sans leading-relaxed">
            500mAh cell powering 8+ hours uninterrupted live audio synthesis.
          </div>
        </div>
      </div>
    </div>
  );
};

export default AtmosTelemetryPins;
