'use client';

import React, { useState } from 'react';
import { 
  Sparkles, 
  Cpu, 
  Activity, 
  Layers, 
  ShieldCheck, 
  Zap, 
  Sliders,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export const AIMLPage: React.FC = () => {
  const [activeStage, setActiveStage] = useState<number>(7); // Default Confirmed Stage

  const pipelineStages = [
    {
      step: 1,
      title: 'RAW SENSOR SIGNALS',
      visual: 'Chaotic 50Hz flex & IMU telemetry voltage streams',
      tech: 'Analog-to-Digital 10-bit conversion (0 - 1023 ADC counts)',
      status: 'INPUT ACTIVE',
    },
    {
      step: 2,
      title: 'NORMALIZATION',
      visual: 'Min-max scaling to continuous [0.0, 1.0] range',
      tech: 'Zero-mean unit variance calibration offset matrix',
      status: 'SCALED',
    },
    {
      step: 3,
      title: 'SIGNAL FILTERING',
      visual: 'Smoothed waveforms with high-frequency noise rejection',
      tech: '2nd-order Low-pass Butterworth digital filter (cutoff 15Hz)',
      status: 'FILTERED',
    },
    {
      step: 4,
      title: 'FEATURE EXTRACTION',
      visual: '11-dimensional feature vector (5 flex + 6 IMU)',
      tech: 'Spatial delta vectors, joint angular velocity, G-force magnitude',
      status: 'EXTRACTED',
    },
    {
      step: 5,
      title: 'ML MODEL INFERENCE',
      visual: 'Dense layer neural matrix activation',
      tech: 'Quantized TFLite micro model executed on-device / browser',
      status: 'COMPUTED',
    },
    {
      step: 6,
      title: 'PROBABILITY PREDICTION',
      visual: 'Softmax probability distribution across 12 gesture classes',
      tech: 'Argmax class selection with 0.85 minimum threshold',
      status: 'EVALUATED',
    },
    {
      step: 7,
      title: 'PREDICTION STABILIZATION',
      visual: 'Hold-time hysteresis debounce verification',
      tech: '300ms temporal smoothing window to eliminate jitter',
      status: 'STABLE',
    },
    {
      step: 8,
      title: 'CONFIRMED GESTURE',
      visual: 'Massive gesture prediction reveal & TTS trigger',
      tech: 'Event dispatch to UI sentence builder and speech synthesizer',
      status: 'CONFIRMED',
    },
  ];

  return (
    <div className="space-y-16 animate-fadeIn pb-12">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="px-3 py-1 rounded-full bg-[#8b5cf6]/10 border border-[#8b5cf6]/30 text-[#8b5cf6] font-orbitron text-xs tracking-widest uppercase">
          NEURAL SIGNAL ARCHITECTURE
        </span>
        <h1 className="font-orbitron font-extrabold text-3xl sm:text-5xl text-white tracking-tight">
          FROM SENSOR SIGNALS TO <span className="text-gradient-cyan">INTELLIGENCE</span>
        </h1>
        <p className="text-sm sm:text-base text-[#94a3b8] font-inter">
          An end-to-end visual walkthrough of the real-time machine learning pipeline that transforms raw electrical voltage into deterministic human language.
        </p>
      </div>

      {/* 8-STAGE INTERACTIVE PIPELINE */}
      <div className="space-y-8">
        
        {/* Stage Selector Progress Steps */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
          {pipelineStages.map((st, idx) => {
            const isActive = activeStage === idx;
            return (
              <button
                key={st.step}
                onClick={() => setActiveStage(idx)}
                className={`p-3 rounded-xl text-left border transition-all ${
                  isActive 
                    ? 'bg-[#00f0ff]/15 border-[#00f0ff] text-white shadow-[0_0_20px_rgba(0,240,255,0.3)]' 
                    : 'bg-[#0a0f1e] border-white/10 text-[#94a3b8] hover:text-white'
                }`}
              >
                <span className="font-orbitron font-bold text-[10px] text-[#00f0ff] block mb-1">
                  STAGE 0{st.step}
                </span>
                <span className="font-rajdhani font-bold text-xs uppercase block truncate">
                  {st.title.split(' ')[0]}
                </span>
              </button>
            );
          })}
        </div>

        {/* MAIN DISPLAY: SELECTED STAGE VISUAL TRANSFORMER */}
        <div className="glass-card p-8 border-[#00f0ff]/30 bg-gradient-to-br from-[#0a0f1e] via-[#030712] to-[#0a0f1e] relative overflow-hidden space-y-8">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#00f0ff]/10 border border-[#00f0ff] flex items-center justify-center text-[#00f0ff]">
                <Zap className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <span className="text-xs font-orbitron text-[#00f0ff] tracking-widest block">
                  STAGE 0{pipelineStages[activeStage].step} OF 08
                </span>
                <h2 className="font-orbitron font-extrabold text-2xl text-white">
                  {pipelineStages[activeStage].title}
                </h2>
              </div>
            </div>

            <span className="px-3 py-1 rounded-full bg-[#10b981]/10 border border-[#10b981]/30 text-[#10b981] font-orbitron text-xs font-bold tracking-wider">
              ● {pipelineStages[activeStage].status}
            </span>
          </div>

          {/* Visual Transformation Canvas Simulation */}
          <div className="relative w-full h-56 rounded-2xl bg-[#030712] border border-white/10 p-6 flex flex-col justify-between overflow-hidden">
            
            {/* Background Grid */}
            <div className="absolute inset-0 bg-grid-pattern opacity-30 pointer-events-none" />

            <div className="flex justify-between items-center z-10 text-xs font-mono text-[#94a3b8]">
              <span>SIGNAL TRANSFORM VISUALIZER</span>
              <span>LATENCY: 14ms TOTAL</span>
            </div>

            {/* Dynamic Visual Content per Stage */}
            <div className="z-10 text-center space-y-3">
              {activeStage === 0 && (
                <div className="flex justify-center items-center gap-2 h-20 text-[#00f0ff] font-mono text-xs">
                  <span className="animate-pulse">ADC_0: [120, 150, 130, 140, 110]</span>
                  <span>↔</span>
                  <span className="animate-pulse text-[#ec4899]">IMU: [0.02, 0.98, 0.15]</span>
                </div>
              )}

              {activeStage === 1 && (
                <div className="w-3/4 mx-auto space-y-2">
                  <div className="flex justify-between text-xs font-mono text-[#00f0ff]">
                    <span>0.0</span><span>NORMALIZED VECTOR</span><span>1.0</span>
                  </div>
                  <div className="h-4 rounded-full bg-white/5 border border-[#00f0ff]/40 p-0.5">
                    <div className="h-full rounded-full bg-gradient-to-r from-[#00f0ff] to-[#8b5cf6] w-4/5" />
                  </div>
                </div>
              )}

              {activeStage >= 2 && activeStage <= 6 && (
                <div className="flex items-center justify-center gap-4 py-4">
                  {[95, 88, 98, 92, 96].map((v, i) => (
                    <div key={i} className="text-center">
                      <div className="w-12 h-16 rounded-lg bg-[#00f0ff]/10 border border-[#00f0ff]/40 flex items-end justify-center p-1">
                        <div className="w-full rounded bg-[#00f0ff]" style={{ height: `${v}%` }} />
                      </div>
                      <span className="text-[10px] font-mono text-[#94a3b8] mt-1 block">F{i + 1}</span>
                    </div>
                  ))}
                </div>
              )}

              {activeStage === 7 && (
                <div className="space-y-1">
                  <span className="text-xs font-orbitron text-[#94a3b8] uppercase tracking-widest block">
                    CONFIRMED GESTURE RECOGNITION
                  </span>
                  <div className="font-orbitron font-black text-4xl sm:text-5xl text-gradient-cyan tracking-widest">
                    ☝️ HELP
                  </div>
                  <span className="inline-block px-3 py-1 rounded bg-[#10b981]/20 text-[#10b981] font-orbitron text-xs font-bold mt-2">
                    94.6% CONFIDENCE MATCH
                  </span>
                </div>
              )}
            </div>

            <div className="flex justify-between items-center z-10 text-xs font-rajdhani text-[#94a3b8]">
              <span>Visual Representation: {pipelineStages[activeStage].visual}</span>
              <span>Algorithm: {pipelineStages[activeStage].tech}</span>
            </div>
          </div>

        </div>

      </div>

      {/* MODEL PERFORMANCE METRICS & EMPTY STATES */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <div className="glass-card p-6 space-y-3 border-white/10">
          <div className="flex items-center justify-between">
            <span className="text-xs font-orbitron text-[#94a3b8] uppercase">ACCURACY</span>
            <AlertCircle className="w-4 h-4 text-amber-400" />
          </div>
          <div className="font-orbitron font-extrabold text-xl text-white">
            Awaiting Model Evaluation
          </div>
          <p className="text-xs text-[#94a3b8] font-inter">
            Validation dataset evaluation benchmark pending final cross-validation test split.
          </p>
        </div>

        <div className="glass-card p-6 space-y-3 border-white/10">
          <div className="flex items-center justify-between">
            <span className="text-xs font-orbitron text-[#94a3b8] uppercase">QUANTIZATION</span>
            <CheckCircle2 className="w-4 h-4 text-[#10b981]" />
          </div>
          <div className="font-orbitron font-extrabold text-xl text-[#00f0ff]">
            INT8 Quantized (14 KB)
          </div>
          <p className="text-xs text-[#94a3b8] font-inter">
            Full integer quantization enabling zero-copy MCU SRAM execution.
          </p>
        </div>

        <div className="glass-card p-6 space-y-3 border-white/10">
          <div className="flex items-center justify-between">
            <span className="text-xs font-orbitron text-[#94a3b8] uppercase">CLASSES</span>
            <Layers className="w-4 h-4 text-[#8b5cf6]" />
          </div>
          <div className="font-orbitron font-extrabold text-xl text-white">
            12 Gesture Classes
          </div>
          <p className="text-xs text-[#94a3b8] font-inter">
            Pre-seeded essential, emergency, and social gesture vocabulary dictionary.
          </p>
        </div>

      </div>

    </div>
  );
};
