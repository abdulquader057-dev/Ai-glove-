'use client';

import React from 'react';
import { useHardwareStore } from '@/store/hardwareStore';
import { Activity } from 'lucide-react';

export const SensorGraph: React.FC = () => {
  const { flexSensors } = useHardwareStore();

  const fingers = [
    { label: 'THUMB', val: flexSensors.thumb, color: '#00f0ff' },
    { label: 'INDEX', val: flexSensors.index, color: '#0066ff' },
    { label: 'MIDDLE', val: flexSensors.middle, color: '#8b5cf6' },
    { label: 'RING', val: flexSensors.ring, color: '#ec4899' },
    { label: 'PINKY', val: flexSensors.pinky, color: '#10b981' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-[#00f0ff] animate-pulse" />
          <h3 className="font-orbitron font-bold text-base text-white">REAL-TIME SENSOR WAVEFORMS (50Hz)</h3>
        </div>
        <span className="text-xs font-orbitron text-[#10b981]">● LIVE STREAM</span>
      </div>

      <div className="space-y-4">
        {fingers.map((f) => {
          const pct = Math.min(100, Math.round((f.val / 1023) * 100));
          return (
            <div key={f.label} className="space-y-1.5">
              <div className="flex justify-between items-center text-xs font-orbitron">
                <span className="text-[#94a3b8] font-bold">{f.label} SENSOR</span>
                <span className="font-mono" style={{ color: f.color }}>{f.val} / 1023 ({pct}%)</span>
              </div>
              <div className="w-full h-4 rounded-full bg-[#030712] border border-white/10 p-0.5 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-300 shadow-[0_0_10px_currentColor]"
                  style={{ width: `${pct}%`, backgroundColor: f.color }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
