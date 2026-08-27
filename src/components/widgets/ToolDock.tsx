'use client';

import React from 'react';
import { useGestureStore } from '@/store/gestureStore';
import { DockToolType } from '@/types';
import { BookOpen, History, Activity, Sliders, X } from 'lucide-react';
import { GestureLibraryGrid } from './GestureLibraryGrid';
import { SensorGraph } from './SensorGraph';
import { CalibrationWizard } from './CalibrationWizard';

export const ToolDock: React.FC = () => {
  const { activeDockTool, setActiveDockTool, history } = useGestureStore();

  const tools: { id: Exclude<DockToolType, null>; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'library', label: 'GESTURE LIBRARY', icon: BookOpen },
    { id: 'history', label: 'HISTORY LOG', icon: History },
    { id: 'graph', label: 'SENSOR GRAPH', icon: Activity },
    { id: 'calibration', label: 'CALIBRATION', icon: Sliders },
  ];

  return (
    <div className="space-y-6">
      
      {/* Sleek Tool Dock Bar */}
      <div className="glass-card p-3 border-[#00f0ff]/30 bg-[#0a0f1e]/90 flex items-center justify-around rounded-2xl shadow-[0_0_25px_rgba(0,240,255,0.15)]">
        {tools.map((t) => {
          const Icon = t.icon;
          const isActive = activeDockTool === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setActiveDockTool(t.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-orbitron font-bold text-xs tracking-wider transition-all duration-300 ${
                isActive
                  ? 'bg-[#00f0ff] text-[#030712] shadow-[0_0_15px_#00f0ff] scale-105'
                  : 'text-[#94a3b8] hover:text-[#00f0ff] hover:bg-white/5'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="hidden sm:inline">{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* Expanded Tool Panel Modal Container */}
      {activeDockTool && (
        <div className="glass-card p-6 border-[#00f0ff]/40 bg-[#030712]/95 backdrop-blur-2xl relative shadow-[0_0_40px_rgba(0,240,255,0.2)] animate-fadeIn">
          <button
            onClick={() => setActiveDockTool(null)}
            className="absolute top-4 right-4 p-2 rounded-lg text-[#94a3b8] hover:text-white bg-white/5 border border-white/10"
          >
            <X className="w-5 h-5" />
          </button>

          {activeDockTool === 'library' && <GestureLibraryGrid />}

          {activeDockTool === 'history' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h3 className="font-orbitron font-bold text-base text-white">GESTURE HISTORY LOG</h3>
                <span className="text-xs font-mono text-[#00f0ff]">{history.length} EVENTS RECORDED</span>
              </div>
              <div className="space-y-2 max-h-[350px] overflow-y-auto pr-2">
                {history.map((h) => (
                  <div key={h.id} className="p-3.5 rounded-xl bg-[#0a0f1e] border border-white/10 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{h.emoji}</span>
                      <div>
                        <span className="font-orbitron font-bold text-white block">{h.gestureName}</span>
                        <span className="text-[10px] font-mono text-[#94a3b8]">{h.time}</span>
                      </div>
                    </div>
                    <span className="font-orbitron font-bold text-[#10b981] bg-[#10b981]/10 px-2 py-0.5 rounded border border-[#10b981]/30">
                      {h.confidence}% MATCH
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeDockTool === 'graph' && <SensorGraph />}

          {activeDockTool === 'calibration' && <CalibrationWizard />}
        </div>
      )}

    </div>
  );
};
