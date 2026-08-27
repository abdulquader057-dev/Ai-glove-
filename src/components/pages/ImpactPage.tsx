'use client';

import React from 'react';
import { 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  Radio, 
  Cpu, 
  Smartphone, 
  Cloud, 
  Box
} from 'lucide-react';

export const ImpactPage: React.FC = () => {
  const roadmapPhases = [
    {
      phase: '01',
      title: 'PROTOTYPE',
      desc: 'Physical 5-flex + IMU sensor glove hardware assembly & initial ADC reading validation.',
      status: 'completed',
      icon: Cpu,
    },
    {
      phase: '02',
      title: 'REAL BLE INTEGRATION',
      desc: 'XIAO nRF52840 Nordic UART Service (NUS) GATT characteristic notification streaming.',
      status: 'completed',
      icon: Radio,
    },
    {
      phase: '03',
      title: 'FINAL ML MODEL',
      desc: '12-class TFLite quantized neural network trained on multi-user kinetic gesture datasets.',
      status: 'completed',
      icon: Sparkles,
    },
    {
      phase: '04',
      title: 'ON-DEVICE INFERENCE EVALUATION',
      desc: 'SRAM memory profiling and real-time execution benchmark on ARM Cortex-M4.',
      status: 'in-progress',
      icon: CheckCircle2,
    },
    {
      phase: '05',
      title: 'EXPANDED GESTURE VOCABULARY',
      desc: 'Dynamic custom gesture recording dictionary supporting 50+ sentence phrase tokens.',
      status: 'future',
      icon: Clock,
    },
    {
      phase: '06',
      title: 'MOBILE APPLICATION',
      desc: 'Native iOS / Android Bluetooth companion app with offline speech synthesizer.',
      status: 'future',
      icon: Smartphone,
    },
    {
      phase: '07',
      title: 'OPTIONAL CLOUD ANALYTICS',
      desc: 'Encrypted cloud sync for user profile calibration data and usage metrics.',
      status: 'future',
      icon: Cloud,
    },
    {
      phase: '08',
      title: 'PRODUCTIZATION',
      desc: 'Custom PCB design, breathable textile integration, and consumer hardware manufacturing.',
      status: 'future',
      icon: Box,
    },
  ];

  return (
    <div className="space-y-16 animate-fadeIn pb-12">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="px-3 py-1 rounded-full bg-[#00f0ff]/10 border border-[#00f0ff]/30 text-[#00f0ff] font-orbitron text-xs tracking-widest uppercase">
          FUTURE PRODUCT ROADMAP
        </span>
        <h1 className="font-orbitron font-extrabold text-3xl sm:text-5xl text-white tracking-tight">
          FROM PROTOTYPE TO <span className="text-gradient-cyan">POSSIBILITY</span>
        </h1>
        <p className="text-sm sm:text-base text-[#94a3b8] font-inter">
          A clear, transparent timeline tracing our engineering progression from bench top prototype to commercial wearable productization.
        </p>
      </div>

      {/* ANIMATED ROADMAP PATH */}
      <div className="relative border-l-2 border-[#00f0ff]/30 ml-4 sm:ml-8 pl-6 sm:pl-10 space-y-8">
        {roadmapPhases.map((ph) => {
          const Icon = ph.icon;
          const isCompleted = ph.status === 'completed';
          const isInProgress = ph.status === 'in-progress';
          return (
            <div key={ph.phase} className="relative group">
              {/* Timeline Node Ring */}
              <div className={`absolute -left-[35px] sm:-left-[51px] top-1.5 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                isCompleted 
                  ? 'bg-[#10b981] border-white text-[#030712] shadow-[0_0_15px_#10b981]' 
                  : isInProgress 
                  ? 'bg-[#00f0ff] border-white text-[#030712] animate-pulse shadow-[0_0_20px_#00f0ff]' 
                  : 'bg-[#0a0f1e] border-white/20 text-[#94a3b8]'
              }`}>
                <span className="w-2 h-2 rounded-full bg-current" />
              </div>

              {/* Phase Card */}
              <div className={`glass-card p-6 space-y-3 transition-all duration-300 ${
                isCompleted ? 'border-[#10b981]/30' : isInProgress ? 'border-[#00f0ff] shadow-[0_0_25px_rgba(0,240,255,0.2)]' : 'border-white/10 opacity-75'
              }`}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-white/5 border border-white/10 text-[#00f0ff]">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="font-orbitron font-bold text-xs text-[#00f0ff] tracking-widest">
                      PHASE {ph.phase}
                    </span>
                    <h3 className="font-orbitron font-bold text-base text-white">{ph.title}</h3>
                  </div>

                  <span className={`self-start sm:self-auto px-2.5 py-0.5 rounded text-[10px] font-orbitron uppercase font-bold tracking-wider ${
                    isCompleted ? 'bg-[#10b981]/20 text-[#10b981] border border-[#10b981]/40' : isInProgress ? 'bg-[#00f0ff]/20 text-[#00f0ff] border border-[#00f0ff]/40' : 'bg-white/5 text-[#94a3b8]'
                  }`}>
                    {ph.status}
                  </span>
                </div>

                <p className="text-xs text-[#94a3b8] font-inter leading-relaxed">
                  {ph.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
