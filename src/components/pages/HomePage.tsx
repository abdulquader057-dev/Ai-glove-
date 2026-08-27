'use client';

import React from 'react';
import Image from 'next/image';
import { 
  ArrowRight, 
  Sparkles, 
  Cpu, 
  Layers, 
  Volume2, 
  Activity,
  Hand,
  MessageSquare,
  Zap,
  Fingerprint,
  Radio,
  Shield,
  Wind,
  Feather,
  Smartphone,
  Laptop,
  Apple
} from 'lucide-react';

interface HomePageProps {
  onExploreGlove: () => void;
  onTryDemo: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onExploreGlove, onTryDemo }) => {
  const smartFeatures = [
    {
      icon: Hand,
      title: 'GESTURE RECOGNITION',
      desc: 'Real-time detection and continuous classification of kinetic hand gestures.',
    },
    {
      icon: MessageSquare,
      title: 'VOICE & TEXT OUTPUT',
      desc: 'Instant translation of recognized gestures into natural speech or text.',
    },
    {
      icon: Zap,
      title: 'REAL-TIME TRANSLATION',
      desc: 'Seamless human communication made effortless with sub-15ms latency.',
    },
  ];

  const sensorTech = [
    {
      icon: Layers,
      title: 'FLEX SENSORS',
      desc: 'Track finger bending with high precision across all 5 phalangeal joints.',
    },
    {
      icon: Activity,
      title: 'MOTION SENSOR (IMU)',
      desc: '6-axis IMU for accurate 3D rotation and acceleration movement tracking.',
    },
    {
      icon: Fingerprint,
      title: 'PRESSURE SENSORS',
      desc: 'Detect tactile pressure and grip intensity across palm contact points.',
    },
    {
      icon: Radio,
      title: 'HAPTIC FEEDBACK',
      desc: 'Provides tactile vibration response for real-time gesture alerts.',
    },
    {
      icon: Cpu,
      title: 'AI ENGINE',
      desc: 'Onboard AI chip processes data instantly for accurate predictions.',
    },
  ];

  const technologyFlow = [
    { step: '01', title: 'HAND MOVEMENT', icon: Hand },
    { step: '02', title: 'SENSORS', icon: Layers },
    { step: '03', title: 'AI PROCESSING', icon: Cpu },
    { step: '04', title: 'VOICE OUTPUT', icon: Volume2 },
  ];

  return (
    <div className="space-y-24 animate-fadeIn pb-12">
      
      {/* SECTION 1: HERO COMPOSITION */}
      <section className="relative min-h-[680px] flex flex-col lg:flex-row items-center justify-between gap-12 pt-4">
        
        {/* Left Headline Column */}
        <div className="lg:w-5/12 space-y-8 z-10 text-left">
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#00f0ff]/10 border border-[#00f0ff]/30 text-[#00f0ff] font-orbitron text-xs tracking-widest uppercase shadow-[0_0_20px_rgba(0,240,255,0.25)]">
            <Sparkles className="w-4 h-4 text-[#00f0ff] animate-pulse" />
            <span>EMPOWERING HUMAN POTENTIAL</span>
          </div>

          <div className="space-y-3">
            <h1 className="font-orbitron font-black text-4xl sm:text-5xl lg:text-6xl text-white tracking-tight leading-none">
              AI <span className="text-gradient-cyan">GLOVE</span>
            </h1>
            <p className="font-orbitron font-bold text-base sm:text-lg text-[#00f0ff] tracking-widest uppercase">
              EMPOWERING HUMAN POTENTIAL
            </p>
          </div>

          <p className="text-sm sm:text-base text-[#94a3b8] font-inter leading-relaxed max-w-xl">
            An advanced AI-powered wearable that translates hand movements into actions, words, and real-world control using onboard neural processing, 5 flex sensors, and 6-axis spatial IMU tracking.
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

          {/* Platform Compatibility Icons */}
          <div className="pt-4 border-t border-white/10 flex items-center gap-6">
            <span className="text-[10px] font-orbitron text-[#94a3b8] uppercase tracking-wider">
              COMPATIBLE WITH
            </span>
            <div className="flex items-center gap-4 text-xs font-orbitron text-white">
              <span className="flex items-center gap-1.5"><Laptop className="w-4 h-4 text-[#00f0ff]" /> Windows</span>
              <span className="flex items-center gap-1.5"><Smartphone className="w-4 h-4 text-[#10b981]" /> Android</span>
              <span className="flex items-center gap-1.5"><Apple className="w-4 h-4 text-white" /> iOS</span>
            </div>
          </div>

        </div>

        {/* Right Hero Object: High-Definition AI Glove Render */}
        <div className="lg:w-7/12 w-full h-[580px] relative flex items-center justify-center">
          
          {/* Ambient Radial Lighting Glow */}
          <div className="absolute w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-[#00f0ff]/25 via-[#0066ff]/20 to-[#8b5cf6]/20 blur-3xl animate-pulse-radial pointer-events-none" />

          {/* AI Glove Render Frame */}
          <div className="relative w-full h-full max-w-[620px] rounded-3xl overflow-hidden border border-[#00f0ff]/40 shadow-[0_0_50px_rgba(0,240,255,0.3)] bg-[#030712] transition-transform duration-500 hover:scale-[1.01]">
            <Image
              src="/ai-glove-hero.jpg"
              alt="AI Glove Empowering Human Potential Design Render"
              fill
              priority
              className="object-contain"
            />
          </div>

        </div>

      </section>

      {/* SECTION 2: SMART FEATURES & SENSOR TECHNOLOGY GRID */}
      <section className="space-y-12">
        
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="px-3 py-1 rounded-full bg-[#00f0ff]/10 border border-[#00f0ff]/30 text-[#00f0ff] font-orbitron text-xs tracking-widest uppercase">
            INTELLIGENT WEARABLE SPECIFICATION
          </span>
          <h2 className="font-orbitron font-extrabold text-3xl sm:text-4xl text-white tracking-wide">
            ADVANCED HARDWARE &amp; SENSOR ARCHITECTURE
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left: Smart Features (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <h3 className="font-orbitron font-bold text-base text-[#00f0ff] tracking-wider uppercase border-b border-white/10 pb-3">
              SMART FEATURES
            </h3>

            <div className="space-y-4">
              {smartFeatures.map((f, i) => {
                const Icon = f.icon;
                return (
                  <div key={i} className="glass-card p-5 space-y-2 border-white/10 hover:border-[#00f0ff]/50 transition-all">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-[#00f0ff]/10 border border-[#00f0ff]/40 text-[#00f0ff]">
                        <Icon className="w-5 h-5" />
                      </div>
                      <h4 className="font-orbitron font-bold text-sm text-white uppercase">{f.title}</h4>
                    </div>
                    <p className="text-xs text-[#94a3b8] font-inter pl-11">{f.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: Sensor Technology (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <h3 className="font-orbitron font-bold text-base text-[#8b5cf6] tracking-wider uppercase border-b border-white/10 pb-3">
              SENSOR TECHNOLOGY &amp; ONBOARD AI
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {sensorTech.map((s, i) => {
                const Icon = s.icon;
                return (
                  <div key={i} className="glass-card p-5 space-y-2 border-white/10 hover:border-[#8b5cf6]/50 transition-all">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-[#8b5cf6]/10 border border-[#8b5cf6]/40 text-[#8b5cf6]">
                        <Icon className="w-5 h-5" />
                      </div>
                      <h4 className="font-orbitron font-bold text-xs text-white uppercase">{s.title}</h4>
                    </div>
                    <p className="text-xs text-[#94a3b8] font-inter">{s.desc}</p>
                  </div>
                );
              })}
            </div>

          </div>

        </div>

        {/* ERGONOMIC & PHYSICAL BADGES */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4">
          {[
            { label: 'LIGHTWEIGHT', sub: 'Ultra-thin fabric', icon: Feather },
            { label: 'DURABLE', sub: '100k bend cycles', icon: Shield },
            { label: 'BREATHABLE', sub: 'Active mesh weave', icon: Wind },
            { label: 'FLEXIBLE', sub: 'Ergonomic 3D fit', icon: Zap },
          ].map((b, i) => {
            const Icon = b.icon;
            return (
              <div key={i} className="glass-card p-4 text-center space-y-2 border-white/10 bg-[#0a0f1e]">
                <Icon className="w-6 h-6 text-[#00f0ff] mx-auto" />
                <h4 className="font-orbitron font-bold text-xs text-white uppercase">{b.label}</h4>
                <span className="text-[10px] text-[#94a3b8] font-rajdhani block">{b.sub}</span>
              </div>
            );
          })}
        </div>

      </section>

      {/* SECTION 3: TECHNOLOGY FLOW */}
      <section className="glass-card p-8 bg-gradient-to-r from-[#0a0f1e] via-[#030712] to-[#0a0f1e] space-y-8 border-[#00f0ff]/30">
        
        <div className="text-center space-y-2">
          <span className="text-xs font-orbitron text-[#00f0ff] tracking-widest uppercase">
            CONNECTED SYSTEM PIPELINE
          </span>
          <h3 className="font-orbitron font-extrabold text-2xl text-white">
            TECHNOLOGY FLOW
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {technologyFlow.map((tf, i) => {
            const Icon = tf.icon;
            return (
              <div key={i} className="p-5 rounded-2xl bg-[#030712] border border-white/10 text-center space-y-3 relative group hover:border-[#00f0ff] transition-all">
                <span className="text-[10px] font-orbitron text-[#00f0ff] block">STEP {tf.step}</span>
                <div className="w-12 h-12 rounded-2xl bg-[#00f0ff]/10 border border-[#00f0ff]/40 flex items-center justify-center text-[#00f0ff] mx-auto group-hover:scale-110 transition-transform">
                  <Icon className="w-6 h-6" />
                </div>
                <h4 className="font-orbitron font-bold text-xs text-white uppercase">{tf.title}</h4>
              </div>
            );
          })}
        </div>

      </section>

    </div>
  );
};
