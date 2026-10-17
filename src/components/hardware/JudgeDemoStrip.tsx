// Judge & Quick Demonstration Banner for Ideathon Presentation
// Team Syntropy - SIGNOVA
// Gives instant 1-click test buttons for all 8 gestures, live hardware telemetry specs,
// and 1-click "Zero Flat Hand" auto-calibration for stage demos.

'use client';

import React from 'react';
import { useSignovaStore } from '@/store/signovaStore';
import { GESTURE_MAP, GestureLabel } from '@/config/signova.config';
import { simulationService } from '@/services/simulationService';
import { Zap, Activity, Clock, ShieldCheck, Sparkles, Volume2 } from 'lucide-react';

export const JudgeDemoStrip: React.FC = () => {
  const {
    activeGesture,
    candidateGesture,
    connectionStatus,
    connectionMedium,
    streamHz,
    realLatencyMs,
    classifierSource,
    autoCalibrateRestPose,
    isSimulation,
    startSimulation,
  } = useSignovaStore();

  const isConnected = connectionStatus === 'connected';

  const handleTriggerGesture = (idx: number) => {
    if (!isSimulation && !isConnected) {
      startSimulation();
    }
    simulationService.triggerGestureByIndex(idx);
  };

  return (
    <div className="w-full bg-gradient-to-r from-[#0C1017] via-[#0E1520] to-[#0C1017] border-y border-[#1F2733] px-4 sm:px-6 py-2.5 font-mono text-xs shadow-lg">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-3">
        {/* Left: Ideathon Pitch Live Metrics */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#2EE6A6]/10 border border-[#2EE6A6]/30 text-[#2EE6A6] text-[11px] font-bold">
            <Zap className="w-3.5 h-3.5 animate-pulse" />
            <span>IDEATHON LIVE DEMO</span>
          </div>

          {/* Metric 1: Stream Rate */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#141922] border border-[#1F2733] text-[#9CA3AF] text-[11px]">
            <Activity className="w-3 h-3 text-[#38BDF8]" />
            <span>Stream:</span>
            <span className="font-bold text-white">{isConnected ? `${streamHz || 50} Hz` : '50 Hz (Target)'}</span>
          </div>

          {/* Metric 2: Measured Latency */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#141922] border border-[#1F2733] text-[#9CA3AF] text-[11px]">
            <Clock className="w-3 h-3 text-[#2EE6A6]" />
            <span>Latency:</span>
            <span className="font-bold text-[#2EE6A6]">
              {isConnected && realLatencyMs > 0 ? `${realLatencyMs.toFixed(1)} ms` : '< 15 ms'}
            </span>
          </div>

          {/* Metric 3: Hold Guard */}
          <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#141922] border border-[#1F2733] text-[#9CA3AF] text-[11px]">
            <ShieldCheck className="w-3 h-3 text-[#F59E0B]" />
            <span>Hold Guard:</span>
            <span className="font-bold text-white">400 ms</span>
          </div>

          {/* Metric 4: Engine Type */}
          <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#141922] border border-[#1F2733] text-[#9CA3AF] text-[11px]">
            <span className="text-[#6B7280]">Engine:</span>
            <span className="font-bold text-[#38BDF8]">
              {classifierSource === 'random_forest' ? 'Random Forest (m2c)' : 'Deterministic Threshold'}
            </span>
          </div>
        </div>

        {/* Right: Quick Action Gestures & Zero Button */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 w-full lg:w-auto">
          <span className="text-[10px] text-[#6B7280] uppercase tracking-wider mr-1 hidden sm:inline">
            Quick Test:
          </span>

          {Object.entries(GESTURE_MAP).map(([pattern, item], idx) => {
            const isActive = activeGesture === item.label;
            const isPending = candidateGesture === item.label && !isActive;

            return (
              <button
                key={pattern}
                onClick={() => handleTriggerGesture(idx)}
                className={`px-2 py-1 rounded text-[11px] font-bold transition-all flex items-center gap-1 cursor-pointer ${
                  isActive
                    ? 'bg-[#2EE6A6] text-[#07090D] shadow-[0_0_12px_rgba(46,230,166,0.4)] scale-105'
                    : isPending
                    ? 'bg-[#F59E0B]/20 text-[#F59E0B] border border-[#F59E0B]/60 animate-pulse'
                    : 'bg-[#141922] hover:bg-[#1E2533] border border-[#1F2733] text-[#D1D5DB] hover:text-white'
                }`}
                title={`Trigger ${item.label} (${item.desc}) — Key ${idx + 1}`}
              >
                <span>{item.label}</span>
                <span className="text-[9px] opacity-60">[{idx + 1}]</span>
              </button>
            );
          })}

          {/* Stage Zero Baseline Button */}
          <button
            onClick={autoCalibrateRestPose}
            className="ml-2 px-2.5 py-1 rounded bg-[#38BDF8]/15 hover:bg-[#38BDF8]/25 border border-[#38BDF8]/50 text-[#38BDF8] text-[11px] font-bold flex items-center gap-1 transition-all hover:scale-105"
            title="Instant baseline re-zeroing for flat hand pose"
          >
            <Sparkles className="w-3 h-3" />
            <span>Zero Hand</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default JudgeDemoStrip;
