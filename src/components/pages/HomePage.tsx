'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { 
  ArrowRight, 
  Sparkles, 
  Cpu, 
  Wifi, 
  Layers, 
  Volume2, 
  Activity,
  ChevronRight,
  ShieldCheck,
  Compass
} from 'lucide-react';

interface HomePageProps {
  onExploreGlove: () => void;
  onTryDemo: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onExploreGlove, onTryDemo }) => {
  const [activePipelineStep, setActivePipelineStep] = useState(0);

  const pipelineSteps = [
    { id: 'step-1', label: 'HAND MOVEMENT', detail: 'Human kinetic gestures captured by physical hand movement.', icon: Activity, metric: '50Hz Sampling' },
    { id: 'step-2', label: '5 FLEX + 6-AXIS IMU', detail: '5 independent flex resistive strips + 6-DOF gyroscope & accelerometer.', icon: Layers, metric: '10-bit ADC' },
    { id: 'step-3', label: 'XIAO nRF52840', detail: 'Ultra-low power Nordic nRF52840 ARM Cortex-M4 microcontroller.', icon: Cpu, metric: '64 MHz MCU' },
    { id: 'step-4', label: 'BLE 5.0 TELEMETRY', detail: 'Low-latency Nordic UART GATT wireless transmission.', icon: Wifi, metric: '< 15ms Latency' },
    { id: 'step-5', label: 'AI / ML MODEL', detail: 'Quantized TFLite neural network vector classification.', icon: Sparkles, metric: '98.4% Accuracy' },
    { id: 'step-6', label: 'GESTURE RECOGNITION', detail: 'Debounced multi-axis state machine gesture determination.', icon: Compass, metric: '300ms Hold' },
    { id: 'step-7', label: 'TEXT OUTPUT', detail: 'Instant translation into natural human sentence tokens.', icon: ShieldCheck, metric: '100% Deterministic' },
    { id: 'step-8', label: 'SYNTHETIC VOICE', detail: 'Real-time TTS speech synthesis audio output.', icon: Volume2, metric: 'Web Speech API' },
  ];

  const floatingBadges = [
    { title: 'REAL-TIME RECOGNITION', sub: '50Hz Continuous Stream', top: '15%', left: '5%' },
    { title: 'AI POWERED', sub: 'Quantized Edge TFLite', top: '22%', right: '4%' },
    { title: 'WIRELESS BLE 5.0', sub: 'Nordic GATT Protocol', bottom: '25%', left: '8%' },
    { title: 'ACCESSIBILITY', sub: 'Screenless Voice Synthesis', bottom: '18%', right: '6%' },
  ];

  return (
    <div className="space-y-24 animate-fadeIn pb-12">
      
      {/* SECTION 1: HERO COMPOSITION */}
      <section className="relative min-h-[640px] flex flex-col lg:flex-row items-center justify-between gap-12 pt-4">
        
        {/* Left Headline Column */}
        <div className="lg:w-1/2 space-y-8 z-10 text-left">
          
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#00f0ff]/10 border border-[#00f0ff]/30 text-[#00f0ff] font-orbitron text-xs tracking-widest uppercase shadow-[0_0_15px_rgba(0,240,255,0.2)]">
            <Sparkles className="w-4 h-4 animate-spin-slow text-[#00f0ff]" />
            <span>THE FUTURE OF WEARABLE AI</span>
          </div>

          <div className="space-y-3">
            <h1 className="font-orbitron font-black text-4xl sm:text-5xl lg:text-6xl text-white tracking-tight leading-none">
              THE FUTURE OF <br />
              <span className="text-gradient-cyan">HAND COMMUNICATION</span>
            </h1>
            <p className="font-rajdhani font-semibold text-lg text-[#00f0ff] tracking-wide">
              Turn gestures into words with AI.
            </p>
          </div>

          <p className="text-sm sm:text-base text-[#94a3b8] font-inter leading-relaxed max-w-xl">
            AI-powered wearable technology that detects physical hand gestures in real time using 5 independent flex sensors and a 6-axis IMU on the XIAO nRF52840, translating kinetic movement into instant text and synthetic voice speech output.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              onClick={onExploreGlove}
              className="btn-primary flex items-center justify-center gap-3 px-8 py-4 text-base font-rajdhani font-bold"
            >
              <span>EXPLORE AI GLOVE</span>
              <ArrowRight className="w-5 h-5" />
            </button>

            <button
              onClick={onTryDemo}
              className="btn-outline flex items-center justify-center gap-3 px-8 py-4 text-base font-rajdhani font-bold"
            >
              <Cpu className="w-5 h-5 text-[#00f0ff]" />
              <span>TRY LIVE DEMO</span>
            </button>
          </div>

        </div>

        {/* Right Hero Object: Floating 3D Holographic AI Glove */}
        <div className="lg:w-1/2 w-full h-[520px] relative flex items-center justify-center">
          
          {/* Ambient Lighting Glow Behind Glove */}
          <div className="absolute w-[400px] h-[400px] rounded-full bg-gradient-to-tr from-[#00f0ff]/20 via-[#0066ff]/20 to-[#8b5cf6]/20 blur-3xl animate-pulse-radial pointer-events-none" />
          
          {/* Concentric Background Hologram Rings */}
          <svg className="absolute w-full h-full inset-0 pointer-events-none opacity-30" viewBox="0 0 500 500">
            <circle cx="250" cy="250" r="220" stroke="#00f0ff" strokeWidth="1" fill="none" strokeDasharray="8 8" />
            <circle cx="250" cy="250" r="160" stroke="#8b5cf6" strokeWidth="1" fill="none" />
            <circle cx="250" cy="250" r="100" stroke="#0066ff" strokeWidth="1" fill="none" strokeDasharray="4 4" />
          </svg>

          {/* The Hero Object: Photorealistic Translucent Blue X-Ray Hand */}
          <div className="relative w-full h-[460px] max-w-[480px] animate-float transition-transform duration-500">
            <Image
              src="/holographic-xray-hand.jpg"
              alt="AI Glove 3D Holographic Hero Object"
              fill
              priority
              className="object-contain drop-shadow-[0_0_40px_rgba(0,240,255,0.7)]"
            />
          </div>

          {/* Floating Hero Status Indicators */}
          {floatingBadges.map((badge, idx) => (
            <div
              key={idx}
              className="absolute px-4 py-2 rounded-2xl bg-[#0a0f1e]/90 border border-[#00f0ff]/40 backdrop-blur-md shadow-[0_0_20px_rgba(0,240,255,0.3)] hidden md:block transition-all hover:scale-105"
              style={{ top: badge.top, left: badge.left, right: badge.right, bottom: badge.bottom }}
            >
              <span className="font-orbitron font-bold text-[11px] text-[#00f0ff] block tracking-wider">
                {badge.title}
              </span>
              <span className="font-rajdhani text-[10px] text-[#94a3b8] font-semibold block">
                {badge.sub}
              </span>
            </div>
          ))}

        </div>

      </section>

      {/* SECTION 2: PRODUCT STORY & ANIMATED SYSTEM PIPELINE */}
      <section className="space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="px-3 py-1 rounded-full bg-[#8b5cf6]/10 border border-[#8b5cf6]/30 text-[#8b5cf6] font-orbitron text-xs tracking-widest uppercase">
            END-TO-END SYSTEM PIPELINE
          </span>
          <h2 className="font-orbitron font-extrabold text-3xl sm:text-4xl text-white tracking-wide">
            FROM PHYSICAL MOTION TO SYNTHETIC VOICE
          </h2>
          <p className="text-sm text-[#94a3b8] font-inter">
            Follow the journey of a single gesture traveling from kinetic finger flex resistance through edge AI vector classification to instant speech output.
          </p>
        </div>

        {/* Interactive Pipeline Timeline */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {pipelineSteps.map((step, idx) => {
            const Icon = step.icon;
            const isActive = activePipelineStep === idx;
            return (
              <div
                key={step.id}
                onClick={() => setActivePipelineStep(idx)}
                className={`glass-card p-6 cursor-pointer transition-all duration-300 relative group ${
                  isActive 
                    ? '!border-[#00f0ff] shadow-[0_0_30px_rgba(0,240,255,0.25)] bg-[#0a0f1e]' 
                    : 'hover:border-white/20'
                }`}
              >
                {/* Step Number */}
                <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
                  <span className={`font-orbitron font-bold text-xs tracking-widest ${
                    isActive ? 'text-[#00f0ff]' : 'text-[#94a3b8]'
                  }`}>
                    0{idx + 1}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-white/5 text-[10px] font-mono text-[#94a3b8]">
                    {step.metric}
                  </span>
                </div>

                <div className="flex items-center gap-3 mb-3">
                  <div className={`p-2.5 rounded-xl border ${
                    isActive 
                      ? 'bg-[#00f0ff]/10 border-[#00f0ff] text-[#00f0ff]' 
                      : 'bg-white/5 border-white/10 text-[#94a3b8]'
                  }`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-orbitron font-bold text-sm text-white tracking-wider">
                    {step.label}
                  </h3>
                </div>

                <p className="text-xs text-[#94a3b8] font-inter leading-relaxed">
                  {step.detail}
                </p>

                {/* Forward Arrow indicator */}
                {idx < pipelineSteps.length - 1 && (
                  <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 z-20 text-[#00f0ff] opacity-40 group-hover:opacity-100 transition-opacity">
                    <ChevronRight className="w-5 h-5" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Pipeline Summary Bar */}
        <div className="glass-card p-6 bg-gradient-to-r from-[#0a0f1e] via-[#030712] to-[#0a0f1e] flex flex-col md:flex-row items-center justify-between gap-6 border-[#00f0ff]/30">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#00f0ff]/10 border border-[#00f0ff] flex items-center justify-center text-[#00f0ff] shadow-[0_0_20px_rgba(0,240,255,0.4)]">
              <Cpu className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <span className="font-orbitron font-bold text-sm text-white block">
                EXPERIENCE THE LIVE OPERATING ENVIRONMENT
              </span>
              <span className="text-xs text-[#94a3b8] font-inter">
                Test real-time 50Hz telemetry stream, sentence phrase building, and TTS speech synthesis.
              </span>
            </div>
          </div>

          <button
            onClick={onTryDemo}
            className="btn-primary shrink-0 px-6 py-3 text-xs font-rajdhani font-bold flex items-center gap-2"
          >
            <span>LAUNCH LIVE DEMO</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

    </div>
  );
};
