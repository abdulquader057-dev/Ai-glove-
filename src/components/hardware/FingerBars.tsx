// Channel Finger Bars Component
// Team Syntropy - SIGNOVA
// Displays real ADC telemetry, calibrated thresholds, and normalized bend percentages for 3 flex sensors.

'use client';

import React from 'react';

interface FingerBarsProps {
  rawSensors: number[];
  smoothedSensors: number[];
  thresholds: number[];
  straight: number[];
  bent: number[];
  binaryBits: [number, number, number];
}

export const FingerBars: React.FC<FingerBarsProps> = ({
  rawSensors,
  smoothedSensors,
  thresholds,
  straight,
  bent,
  binaryBits,
}) => {
  const fingers = [
    { id: 'index', name: 'INDEX FINGER', channel: 0, color: '#2EE6A6' },
    { id: 'middle', name: 'MIDDLE FINGER', channel: 1, color: '#38BDF8' },
    { id: 'ring', name: 'RING FINGER', channel: 2, color: '#A78BFA' },
  ];

  return (
    <div className="w-full bg-[#0A0D10] border border-[#1F242A] p-4 rounded-sm flex flex-col gap-4 font-mono">
      <div className="flex items-center justify-between pb-2 border-b border-[#1F242A] text-xs">
        <span className="text-[#6B7280] font-semibold">CHANNEL SENSOR METERS</span>
        <span className="text-[11px] text-[#9CA3AF]">3 × ANALOG ADC CHANNELS</span>
      </div>

      <div className="space-y-4">
        {fingers.map((f, i) => {
          const raw = rawSensors[i] ?? 0;
          const smoothed = smoothedSensors[i] ?? 0;
          const th = thresholds[i] ?? 512;
          const sVal = straight[i] ?? 250;
          const bVal = bent[i] ?? 780;
          const isBent = binaryBits[i] === 1;

          // Normalized percentage between straight and bent
          const min = Math.min(sVal, bVal);
          const max = Math.max(sVal, bVal);
          const range = max - min || 1;
          let pct = Math.round(((smoothed - min) / range) * 100);
          if (bVal < sVal) pct = 100 - pct;
          pct = Math.max(0, Math.min(100, pct));

          // Threshold position as percentage of range (0-100%)
          const thPct = Math.round(((th - min) / range) * 100);

          return (
            <div key={f.id} className="space-y-1.5">
              {/* Channel Label & Values */}
              <div className="flex justify-between items-center text-xs">
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-block w-2 h-2 rounded-full ${
                      isBent ? 'bg-[#2EE6A6]' : 'bg-[#4B5563]'
                    }`}
                  />
                  <span className="text-[#E5E7EB] font-bold tracking-wider">
                    CH{f.channel + 1} {f.name}
                  </span>
                </div>

                <div className="flex items-center gap-3 text-[11px]">
                  <span className="text-[#6B7280]">
                    RAW: <span className="text-white font-semibold">{raw}</span>
                  </span>
                  <span className="text-[#6B7280]">
                    FLT: <span className="text-[#2EE6A6] font-semibold">{smoothed}</span>
                  </span>
                  <span
                    className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                      isBent
                        ? 'bg-[#2EE6A6]/20 text-[#2EE6A6] border border-[#2EE6A6]/50'
                        : 'bg-[#1F242A] text-[#9CA3AF] border border-[#374151]'
                    }`}
                  >
                    {isBent ? 'BIT 1 [BENT]' : 'BIT 0 [STR]'}
                  </span>
                </div>
              </div>

              {/* Progress Bar with Calibrated Threshold Marker */}
              <div className="relative w-full h-4 bg-[#111418] border border-[#1F242A] rounded-xs overflow-hidden">
                {/* Midpoint Threshold Tick Mark */}
                <div
                  className="absolute top-0 bottom-0 w-0.5 bg-yellow-400 z-10"
                  style={{ left: `${thPct}%` }}
                  title={`Calibrated Midpoint Threshold: ${th}`}
                />

                {/* Eased Dynamic Fill */}
                <div
                  className="h-full transition-all duration-150 ease-out"
                  style={{
                    width: `${pct}%`,
                    backgroundColor: isBent ? '#2EE6A6' : '#374151',
                  }}
                />
              </div>

              {/* Threshold info row */}
              <div className="flex justify-between text-[10px] text-[#6B7280]">
                <span>STR: {sVal}</span>
                <span className="text-yellow-400/80">TH: {th}</span>
                <span>BNT: {bVal}</span>
                <span className="text-[#9CA3AF] font-bold">{pct}% BEND</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FingerBars;
