// Floating ATMOS-Style Telemetry Callout Pins with 1px SVG connector lines
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
        transition: 'opacity 0.2s ease-out',
      }}
      className="fixed inset-0 z-20 pointer-events-none select-none hidden lg:block"
    >
      {/* ── Pin 1: Flex Transducers (Top Right of Glove) ── */}
      <div className="absolute top-[26%] right-[14%] flex items-center">
        {/* SVG 1px Connector Line */}
        <svg width="120" height="40" className="overflow-visible">
          <circle cx="10" cy="30" r="3" fill="#00F2A6" className="animate-pulse" />
          <circle cx="10" cy="30" r="7" stroke="#00F2A6" strokeWidth="1" strokeOpacity="0.4" />
          <line x1="10" y1="30" x2="60" y2="10" stroke="#00F2A6" strokeWidth="1" strokeDasharray="3 3" />
          <line x1="60" y1="10" x2="120" y2="10" stroke="#00F2A6" strokeWidth="1" />
        </svg>

        {/* Callout Card */}
        <div className="p-3.5 rounded-xl backdrop-blur-xl bg-black/60 border border-[#00F2A6]/30 shadow-[0_0_30px_rgba(0,242,166,0.15)] font-mono text-left max-w-xs -ml-2">
          <div className="text-[10px] text-[#00F2A6] font-bold tracking-widest uppercase">
            [FLEX TRANSDUCERS]
          </div>
          <div className="text-xs font-bold text-[#F6F6F8] mt-0.5">
            5-Finger Biomechanical Ribbon Array
          </div>
          <div className="text-[10px] text-[#7E8B95] mt-1 font-sans">
            Continuous analog deflection tracking at 50Hz with auto-zeroing.
          </div>
        </div>
      </div>

      {/* ── Pin 2: Edge MCU (Middle of Palm / Controller) ── */}
      <div className="absolute top-[52%] right-[22%] flex items-center flex-row-reverse">
        {/* SVG 1px Connector Line */}
        <svg width="110" height="40" className="overflow-visible">
          <circle cx="100" cy="20" r="3" fill="#00D2FF" className="animate-pulse" />
          <circle cx="100" cy="20" r="7" stroke="#00D2FF" strokeWidth="1" strokeOpacity="0.4" />
          <line x1="100" y1="20" x2="50" y2="20" stroke="#00D2FF" strokeWidth="1" strokeDasharray="3 3" />
          <line x1="50" y1="20" x2="0" y2="20" stroke="#00D2FF" strokeWidth="1" />
        </svg>

        {/* Callout Card */}
        <div className="p-3.5 rounded-xl backdrop-blur-xl bg-black/60 border border-[#00D2FF]/30 shadow-[0_0_30px_rgba(0,210,255,0.15)] font-mono text-left max-w-xs -mr-2">
          <div className="text-[10px] text-[#00D2FF] font-bold tracking-widest uppercase">
            [EDGE MCU]
          </div>
          <div className="text-xs font-bold text-[#F6F6F8] mt-0.5">
            ESP32-S3 // Neural In-Sensor Inference
          </div>
          <div className="text-[10px] text-[#7E8B95] mt-1 font-sans">
            Deterministic sub-15ms classification & Nordic NUS BLE pipeline.
          </div>
        </div>
      </div>

      {/* ── Pin 3: Power Core (Wrist Battery Compartment) ── */}
      <div className="absolute top-[72%] right-[16%] flex items-center">
        {/* SVG 1px Connector Line */}
        <svg width="120" height="40" className="overflow-visible">
          <circle cx="10" cy="15" r="3" fill="#F59E0B" className="animate-pulse" />
          <circle cx="10" cy="15" r="7" stroke="#F59E0B" strokeWidth="1" strokeOpacity="0.4" />
          <line x1="10" y1="15" x2="60" y2="30" stroke="#F59E0B" strokeWidth="1" strokeDasharray="3 3" />
          <line x1="60" y1="30" x2="120" y2="30" stroke="#F59E0B" strokeWidth="1" />
        </svg>

        {/* Callout Card */}
        <div className="p-3.5 rounded-xl backdrop-blur-xl bg-black/60 border border-[#F59E0B]/30 shadow-[0_0_30px_rgba(245,158,11,0.15)] font-mono text-left max-w-xs -ml-2">
          <div className="text-[10px] text-[#F59E0B] font-bold tracking-widest uppercase">
            [POWER CORE]
          </div>
          <div className="text-xs font-bold text-[#F6F6F8] mt-0.5">
            3.7V LiPo // Continuous Telemetry Loop
          </div>
          <div className="text-[10px] text-[#7E8B95] mt-1 font-sans">
            500mAh cell powering 8+ hours uninterrupted live audio synthesis.
          </div>
        </div>
      </div>
    </div>
  );
};

export default AtmosTelemetryPins;
