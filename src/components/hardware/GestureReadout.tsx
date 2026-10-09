// Gesture Readout & Telemetry Display
// Team Syntropy - SIGNOVA
// Displays large gesture word, 3-bit binary pattern indicators, real confidence,
// real latency measurement, and hold debounce stability bar.

'use client';

import React from 'react';
import { Volume2, VolumeX, Activity, Clock } from 'lucide-react';
import { CONFIG } from '../../config.js';
import { GestureLabel } from '../../config/signova.config';

interface GestureReadoutProps {
  activeGesture: GestureLabel;
  candidateGesture: GestureLabel;
  confidence: number;
  realLatencyMs: number;
  binaryBits: [number, number, number];
  binaryString?: string;
  holdProgress: number; // 0 - 100%
  justConfirmed: boolean;
  isMuted: boolean;
  onToggleMute: () => void;
  classifierSource: 'threshold' | 'random_forest';
}

export const GestureReadout: React.FC<GestureReadoutProps> = ({
  activeGesture,
  candidateGesture,
  confidence,
  realLatencyMs,
  binaryBits,
  holdProgress,
  justConfirmed,
  isMuted,
  onToggleMute,
  classifierSource,
}) => {
  const isListening = activeGesture === 'NONE';
  const gestureDescription =
    activeGesture !== 'NONE'
      ? (CONFIG.GESTURE_DESCRIPTIONS as Record<string, string>)[activeGesture] || 'Recognized gesture'
      : 'Holding pose for 400ms...';

  return (
    <div
      className={`relative w-full bg-[#0A0D10] border rounded-sm p-6 flex flex-col justify-between font-mono transition-colors duration-150 ${
        justConfirmed
          ? 'border-[#2EE6A6] bg-[#0D1914]'
          : 'border-[#1F242A]'
      }`}
    >
      {/* Top Meta Bar */}
      <div className="flex items-center justify-between pb-4 border-b border-[#1F242A] text-xs">
        <div className="flex items-center gap-2">
          {/* Quiet pulse while listening */}
          <span
            className={`w-2.5 h-2.5 rounded-full ${
              isListening ? 'bg-[#374151] animate-pulse' : 'bg-[#2EE6A6]'
            }`}
          />
          <span className="text-[#9CA3AF] font-bold tracking-wider">
            {isListening ? 'LISTENING / STABILIZING' : 'CONFIRMED GESTURE'}
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* Classification Engine Badge */}
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#14181D] border border-[#262D36] text-[#9CA3AF]">
            SRC: {classifierSource === 'random_forest' ? 'RANDOM FOREST (M2CGEN)' : 'THRESHOLD MIDPOINT'}
          </span>

          {/* Mute Toggle Button */}
          <button
            onClick={onToggleMute}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs transition-colors border ${
              isMuted
                ? 'bg-[#1F242A] border-[#374151] text-[#9CA3AF] hover:text-white'
                : 'bg-[#2EE6A6]/10 border-[#2EE6A6]/40 text-[#2EE6A6] hover:bg-[#2EE6A6]/20'
            }`}
            title={isMuted ? 'Voice output muted' : 'Voice output active'}
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
            <span>{isMuted ? 'MUTED' : 'SPEECH ACTIVE'}</span>
          </button>
        </div>
      </div>

      {/* Main Gesture Display */}
      <div className="py-8 flex flex-col items-center justify-center text-center">
        {/* Subtitle / Pattern code */}
        <div className="text-xs text-[#6B7280] tracking-widest uppercase mb-1">
          {isListening ? `CANDIDATE: ${candidateGesture}` : `PATTERN: {${binaryBits.join(', ')}}`}
        </div>

        {/* Large Gesture Word (Snaps in) */}
        <div
          className={`font-sans font-black text-5xl sm:text-6xl md:text-7xl tracking-tight transition-all duration-100 transform ${
            justConfirmed ? 'scale-105 text-[#2EE6A6]' : isListening ? 'text-[#374151]' : 'text-white'
          }`}
        >
          {activeGesture}
        </div>

        {/* Real description */}
        <div className="mt-2 text-sm text-[#9CA3AF] font-sans">
          {gestureDescription}
        </div>

        {/* 400ms Hold Debounce Bar */}
        <div className="w-full max-w-xs mt-4 space-y-1">
          <div className="flex justify-between text-[10px] text-[#6B7280]">
            <span>STABILITY HOLD (400ms)</span>
            <span className={holdProgress >= 100 ? 'text-[#2EE6A6]' : 'text-[#9CA3AF]'}>
              {holdProgress >= 100 ? 'LOCKED' : `${holdProgress}%`}
            </span>
          </div>
          <div className="w-full h-1.5 bg-[#14181D] border border-[#1F242A] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#2EE6A6] transition-all duration-75"
              style={{ width: `${holdProgress}%` }}
            />
          </div>
        </div>
      </div>

      {/* 3-Bit Pattern Indicators */}
      <div className="grid grid-cols-3 gap-2 py-3 border-t border-b border-[#1F242A]">
        {[
          { label: 'INDEX', bit: binaryBits[0] },
          { label: 'MIDDLE', bit: binaryBits[1] },
          { label: 'RING', bit: binaryBits[2] },
        ].map((ind) => (
          <div
            key={ind.label}
            className={`p-2 rounded-xs border text-center transition-colors ${
              ind.bit === 1
                ? 'border-[#2EE6A6] bg-[#0E1C15]'
                : 'border-[#1F242A] bg-[#0B0E11]'
            }`}
          >
            <div className="text-[10px] text-[#6B7280]">{ind.label}</div>
            <div
              className={`text-xl font-bold ${
                ind.bit === 1 ? 'text-[#2EE6A6]' : 'text-[#4B5563]'
              }`}
            >
              {ind.bit}
            </div>
            <div className="text-[9px] text-[#9CA3AF]">
              {ind.bit === 1 ? 'BENT' : 'STRAIGHT'}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Telemetry Metrics (Real Latency & Confidence) */}
      <div className="grid grid-cols-2 gap-4 pt-4 text-xs">
        {/* Measured Latency */}
        <div className="flex items-center gap-2.5 p-2 bg-[#0E1115] border border-[#1F242A] rounded-xs">
          <Clock className="w-4 h-4 text-[#2EE6A6]" />
          <div>
            <div className="text-[10px] text-[#6B7280]">MEASURED LATENCY</div>
            <div className="text-sm font-bold text-white">
              {realLatencyMs > 0 ? `${realLatencyMs} ms` : '< 1.0 ms'}
            </div>
          </div>
        </div>

        {/* Real Confidence */}
        <div className="flex items-center gap-2.5 p-2 bg-[#0E1115] border border-[#1F242A] rounded-xs">
          <Activity className="w-4 h-4 text-[#2EE6A6]" />
          <div>
            <div className="text-[10px] text-[#6B7280]">CONFIDENCE SCORE</div>
            <div className="text-sm font-bold text-white">
              {confidence > 0 ? `${confidence}%` : '---'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GestureReadout;
