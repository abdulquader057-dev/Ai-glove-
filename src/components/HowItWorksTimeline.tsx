'use client';

import React from 'react';
import { Cpu, Wifi, Volume2, Activity, CheckCircle2 } from 'lucide-react';

export const HowItWorksTimeline: React.FC = () => {
  const steps = [
    {
      num: '01',
      title: 'SENSING LAYER',
      subtitle: 'Biomechanical Capture Engine',
      desc: 'Five ultra-sensitive resistive flex sensors measure finger flexion angles while a high-precision 6-axis IMU captures 3D wrist acceleration and rotational velocity at 50Hz sample rates.',
      icon: Activity,
      tech: ['5x Flex Sensors', '6-Axis IMU', '50Hz Telemetry'],
      color: '#00f0ff',
    },
    {
      num: '02',
      title: 'COMPUTE LAYER',
      subtitle: 'Micro TFLite Neural Network',
      desc: 'The integrated XIAO nRF52840 Sense microcontroller runs a quantized TensorFlow Lite Neural Network directly on micro-hardware, inferring complex spatial gesture matrices at the edge.',
      icon: Cpu,
      tech: ['nRF52840 ARM Cortex-M4', 'Quantized TFLite Engine', 'Sub-15ms Processing'],
      color: '#0066ff',
    },
    {
      num: '03',
      title: 'WIRELESS TRANSMISSION',
      subtitle: 'Ultra-Low Latency Telemetry',
      desc: 'Bluetooth 5.0 Low Energy (Nordic UART GATT Service) streams telemetry vectors to your local browser interface with sub-15ms latency over standard GATT characteristics.',
      icon: Wifi,
      tech: ['BLE 5.0 Protocol', 'Nordic UART Service', '30m Wireless Range'],
      color: '#8b5cf6',
    },
    {
      num: '04',
      title: 'REAL-TIME VOICE OUTPUT',
      subtitle: 'Web Speech API Synthesis',
      desc: 'Recognized gestures trigger instant text rendering and low-latency voice synthesis via the Web Speech API, enabling seamless natural vocal translation for non-verbal users.',
      icon: Volume2,
      tech: ['Web Speech API TTS', 'Adjustable Pitch & Speed', 'Custom Gesture Mapping'],
      color: '#ec4899',
    },
  ];

  return (
    <div className="space-y-12 animate-fadeIn max-w-5xl mx-auto py-4">
      
      {/* Header */}
      <div className="text-center space-y-3">
        <span className="px-3 py-1 rounded-full bg-[#00f0ff]/10 text-[#00f0ff] border border-[#00f0ff]/30 font-orbitron text-xs tracking-widest uppercase">
          SYSTEM ARCHITECTURE & FLOW
        </span>
        <h1 className="font-orbitron font-extrabold text-3xl sm:text-4xl text-gradient-cyan">
          HOW SENSASIGN AI WORKS
        </h1>
        <p className="text-[#94a3b8] text-sm sm:text-base max-w-2xl mx-auto font-inter">
          From micro-hardware sensors on your hand to instant acoustic speech output in your browser — built for 2050 response times.
        </p>
      </div>

      {/* Vertical Timeline */}
      <div className="relative border-l-2 border-[#00f0ff]/30 ml-4 sm:ml-32 space-y-12 py-4">
        
        {steps.map((step) => {
          const Icon = step.icon;
          return (
            <div key={step.num} className="relative pl-8 sm:pl-12 group">
              
              {/* Number Badge Box (Left Side) */}
              <div 
                className="absolute -left-[25px] top-0 w-12 h-12 rounded-xl bg-[#0a0f1e] border-2 flex items-center justify-center font-orbitron font-extrabold text-lg text-white shadow-lg transition-all group-hover:scale-110"
                style={{ borderColor: step.color, boxShadow: `0 0 20px ${step.color}50` }}
              >
                {step.num}
              </div>

              {/* Card Container */}
              <div className="glass-card p-6 sm:p-8 space-y-4 hover:border-[#00f0ff]/50 transition-all">
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
                  <div className="flex items-center gap-3">
                    <div 
                      className="p-2.5 rounded-xl bg-white/5 border"
                      style={{ borderColor: `${step.color}40`, color: step.color }}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-orbitron font-bold text-xl text-white tracking-wider">
                        {step.title}
                      </h3>
                      <span className="text-xs font-rajdhani text-[#94a3b8] tracking-widest uppercase">
                        {step.subtitle}
                      </span>
                    </div>
                  </div>
                </div>

                <p className="text-sm text-[#94a3b8] font-inter leading-relaxed">
                  {step.desc}
                </p>

                {/* Tech Chips */}
                <div className="flex flex-wrap gap-2 pt-2">
                  {step.tech.map((t) => (
                    <span 
                      key={t}
                      className="px-3 py-1 rounded-lg text-xs font-orbitron bg-[#030712] border border-white/10 text-white flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#10b981]" />
                      {t}
                    </span>
                  ))}
                </div>

              </div>

            </div>
          );
        })}

      </div>

    </div>
  );
};
