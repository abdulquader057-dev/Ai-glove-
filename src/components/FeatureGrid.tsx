'use client';

import React from 'react';
import { Wifi, Zap, Volume2, Heart, Cpu, BatteryCharging } from 'lucide-react';

export const FeatureGrid: React.FC = () => {
  const features = [
    {
      icon: Wifi,
      title: 'WIRELESS BLE 5.0',
      subtitle: '30m Operational Range',
      description: 'Ultra-low latency Bluetooth 5.0 Nordic UART GATT protocol streams telemetry vectors at 50Hz without tethering cables.',
      accent: '#00f0ff',
    },
    {
      icon: Zap,
      title: 'REAL-TIME AI INFERENCE',
      subtitle: '<15ms Edge Latency',
      description: 'Quantized neural network execution on micro-hardware delivers instantaneous gesture identification with zero cloud roundtrip.',
      accent: '#0066ff',
    },
    {
      icon: Volume2,
      title: 'SYNTHETIC VOICE OUTPUT',
      subtitle: 'Web Speech API Integration',
      description: 'Synthesizes customizable acoustic voice output with dynamic pitch, rate, and multi-language acoustic modulation.',
      accent: '#8b5cf6',
    },
    {
      icon: Heart,
      title: 'ACCESSIBLE DESIGN',
      subtitle: 'Built for Non-Verbal Users',
      description: 'Empowers mute, paralyzed, or speech-impaired individuals to communicate naturally through simple hand motions.',
      accent: '#ec4899',
    },
    {
      icon: Cpu,
      title: 'EDGE ML ON XIAO',
      subtitle: 'nRF52840 Microcontroller',
      description: 'Compact 21x17mm ARM Cortex-M4 microcontroller running on-device gesture feature extraction and classification.',
      accent: '#00f0ff',
    },
    {
      icon: BatteryCharging,
      title: 'ALL-DAY BATTERY LIFE',
      subtitle: '12+ Hours Continuous',
      description: 'High-density LiPo power management with ultra-low power sleep states for all-day continuous wearable operation.',
      accent: '#10b981',
    },
  ];

  return (
    <div className="space-y-8 animate-fadeIn py-4 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="text-center space-y-3">
        <span className="px-3 py-1 rounded-full bg-[#00f0ff]/10 text-[#00f0ff] border border-[#00f0ff]/30 font-orbitron text-xs tracking-widest uppercase">
          HARDWARE & SOFTWARE CAPABILITIES
        </span>
        <h1 className="font-orbitron font-extrabold text-3xl sm:text-4xl text-gradient-cyan">
          ENTERPRISE FEATURE MATRIX
        </h1>
        <p className="text-[#94a3b8] text-sm sm:text-base max-w-xl mx-auto font-inter">
          Next-generation wearable artificial intelligence built for speed, accuracy, and maximum daily accessibility.
        </p>
      </div>

      {/* Grid of 6 Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
        {features.map((feat) => {
          const Icon = feat.icon;
          return (
            <div
              key={feat.title}
              className="glass-card p-6 sm:p-8 relative overflow-hidden group hover:-translate-y-1.5 transition-all duration-300 space-y-4"
            >
              {/* Cyan Top Border Glow on Hover */}
              <div 
                className="absolute top-0 left-0 right-0 h-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ background: `linear-gradient(90deg, transparent, ${feat.accent}, transparent)` }}
              />

              {/* Icon Box */}
              <div 
                className="w-12 h-12 rounded-xl bg-[#030712] border flex items-center justify-center transition-all group-hover:scale-110 shadow-lg"
                style={{ borderColor: `${feat.accent}50`, color: feat.accent, boxShadow: `0 0 20px ${feat.accent}30` }}
              >
                <Icon className="w-6 h-6" />
              </div>

              {/* Title & Subtitle */}
              <div className="space-y-1">
                <h3 className="font-orbitron font-bold text-lg text-white tracking-wider">
                  {feat.title}
                </h3>
                <span className="text-xs font-rajdhani font-semibold text-[#00f0ff] tracking-widest uppercase block">
                  {feat.subtitle}
                </span>
              </div>

              {/* Body */}
              <p className="text-xs sm:text-sm text-[#94a3b8] font-inter leading-relaxed">
                {feat.description}
              </p>
            </div>
          );
        })}
      </div>

    </div>
  );
};
