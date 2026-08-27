'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useHardwareStore } from '@/store/hardwareStore';
import { useGestureStore } from '@/store/gestureStore';
import { bleService } from '@/services/bleService';
import { ttsService } from '@/services/ttsService';
import { simulationEngine } from '@/services/simulationEngine';
import { SentenceBuilder } from '@/components/widgets/SentenceBuilder';
import { ToolDock } from '@/components/widgets/ToolDock';
import { 
  Wifi, 
  WifiOff, 
  Volume2, 
  Activity, 
  Terminal, 
  Cpu, 
  Layers, 
  Sparkles, 
  Eye,
  Sliders,
  RotateCw,
  Radio
} from 'lucide-react';

export const LiveDemoPage: React.FC = () => {
  const [initializing, setInitializing] = useState(true);
  const [rotationY, setRotationY] = useState(10);
  const [rotationX, setRotationX] = useState(5);

  const { 
    connectionState, 
    deviceName, 
    flexSensors, 
    imu, 
    isSimulation, 
    toggleSimulation,
    isBleSupported
  } = useHardwareStore();

  const { 
    activeGesture, 
    confidence, 
    inferenceTimeMs, 
    isSpeaking, 
    setSpeaking,
    addTokenToPhrase,
    autoSpeak
  } = useGestureStore();

  // Fast scanning entry sequence (1.5 seconds)
  useEffect(() => {
    const timer = setTimeout(() => {
      setInitializing(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  // Ensure simulation is running
  useEffect(() => {
    if (isSimulation) {
      simulationEngine.start();
    } else {
      simulationEngine.stop();
    }
    return () => simulationEngine.stop();
  }, [isSimulation]);

  const handleConnect = async () => {
    await bleService.connect();
  };

  const handleDisconnect = () => {
    bleService.disconnect();
  };

  const handleSpeakAgain = () => {
    if (activeGesture?.mappedPhrase) {
      setSpeaking(true);
      ttsService.speak(activeGesture.mappedPhrase);
      setTimeout(() => setSpeaking(false), 2000);
    }
  };

  const flexSensorsList = [
    { label: 'THUMB', val: flexSensors.thumb },
    { label: 'INDEX', val: flexSensors.index },
    { label: 'MIDDLE', val: flexSensors.middle },
    { label: 'RING', val: flexSensors.ring },
    { label: 'PINKY', val: flexSensors.pinky },
  ];

  if (initializing) {
    return (
      <div className="min-h-[500px] flex flex-col items-center justify-center space-y-6 text-center animate-fadeIn">
        <div className="relative w-20 h-20">
          <div className="w-full h-full border-4 border-[#00f0ff] border-t-transparent rounded-full animate-spin shadow-[0_0_30px_#00f0ff]" />
          <Cpu className="w-8 h-8 text-[#00f0ff] absolute inset-0 m-auto animate-pulse" />
        </div>
        <div className="space-y-2">
          <h2 className="font-orbitron font-extrabold text-xl text-white tracking-widest">
            INITIALIZING AI GLOVE
          </h2>
          <p className="text-xs text-[#00f0ff] font-mono animate-pulse">
            LOADING SENSOR INTERFACE... SIMULATION READY
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fadeIn pb-12">
      
      {/* TOP STATUS BAR */}
      <div className="glass-card p-4 bg-gradient-to-r from-[#0a0f1e] via-[#030712] to-[#0a0f1e] flex flex-col md:flex-row items-center justify-between gap-4 border-[#00f0ff]/30 shadow-[0_0_25px_rgba(0,240,255,0.15)]">
        
        {/* Title & Mode */}
        <div className="flex items-center gap-3">
          <div className="px-3 py-1 rounded-full bg-[#00f0ff]/15 border border-[#00f0ff]/40 text-[#00f0ff] font-orbitron text-xs font-bold flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#00f0ff] animate-ping" />
            <span>AI GLOVE LIVE ENVIRONMENT</span>
          </div>
        </div>

        {/* Mode Selector & Hardware Link */}
        <div className="flex items-center gap-4">
          
          {/* SIMULATION / HARDWARE MODE TOGGLE */}
          <div className="flex items-center gap-3 bg-[#030712] px-3.5 py-1.5 rounded-xl border border-white/10">
            <span className="text-xs font-orbitron text-white">
              {isSimulation ? '● SIMULATION MODE' : '● HARDWARE MODE'}
            </span>
            <button
              onClick={toggleSimulation}
              className={`w-10 h-5 rounded-full transition-all relative p-0.5 border ${
                isSimulation ? 'bg-[#00f0ff]/20 border-[#00f0ff]' : 'bg-white/10 border-white/20'
              }`}
            >
              <div className={`w-3.5 h-3.5 rounded-full transition-transform ${
                isSimulation ? 'translate-x-5 bg-[#00f0ff]' : 'translate-x-0 bg-white/40'
              }`} />
            </button>
          </div>

          {/* CONNECT BUTTON */}
          {connectionState === 'disconnected' ? (
            <button
              onClick={handleConnect}
              className="btn-primary !py-2 !px-4 text-xs font-rajdhani font-bold flex items-center gap-2"
            >
              <Wifi className="w-4 h-4" />
              <span>CONNECT GLOVE</span>
            </button>
          ) : (
            <button
              onClick={handleDisconnect}
              className="btn-danger !py-2 !px-4 text-xs font-rajdhani font-bold flex items-center gap-2"
            >
              <WifiOff className="w-4 h-4" />
              <span>DISCONNECT</span>
            </button>
          )}

        </div>

      </div>

      {/* 3-DIMENSIONAL MAIN COMPOSITION */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT: LIVE SENSOR INPUTS (3 cols) */}
        <div className="lg:col-span-3 space-y-6">
          <div className="glass-card p-5 space-y-5">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <span className="font-orbitron font-bold text-xs text-white uppercase tracking-wider">
                LIVE SENSOR INPUT
              </span>
              <span className="text-[10px] font-mono text-[#00f0ff]">50Hz</span>
            </div>

            {/* 5 FLEX SENSOR BARS */}
            <div className="space-y-3">
              {flexSensorsList.map((s, idx) => {
                const pct = Math.min(100, Math.round((s.val / 1023) * 100));
                return (
                  <div key={s.label} className="space-y-1">
                    <div className="flex justify-between items-center text-[11px] font-orbitron">
                      <span className="text-[#94a3b8] font-bold">{s.label}</span>
                      <span className="text-[#00f0ff] font-mono">{pct}%</span>
                    </div>
                    <div className="w-full h-2.5 bg-[#030712] rounded-full overflow-hidden border border-white/10 p-0.5">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-[#00f0ff] via-[#0066ff] to-[#8b5cf6] shadow-[0_0_10px_#00f0ff] transition-all duration-300"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* IMU GAUGES */}
            <div className="pt-3 border-t border-white/10 space-y-2">
              <span className="text-[10px] font-orbitron text-[#94a3b8] block uppercase">6-AXIS IMU READOUT</span>
              <div className="grid grid-cols-3 gap-1.5 text-center font-orbitron text-[10px]">
                <div className="p-1.5 rounded bg-[#030712] border border-white/10">
                  <span className="text-[#94a3b8] block">ACC X</span>
                  <span className="text-[#00f0ff] font-bold">{imu.accel.x}</span>
                </div>
                <div className="p-1.5 rounded bg-[#030712] border border-white/10">
                  <span className="text-[#94a3b8] block">ACC Y</span>
                  <span className="text-[#00f0ff] font-bold">{imu.accel.y}</span>
                </div>
                <div className="p-1.5 rounded bg-[#030712] border border-white/10">
                  <span className="text-[#94a3b8] block">ACC Z</span>
                  <span className="text-[#00f0ff] font-bold">{imu.accel.z}</span>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* CENTER: THE HERO INTERACTIVE AI HAND (6 cols) */}
        <div className="lg:col-span-6 glass-card p-6 min-h-[520px] flex flex-col justify-between relative overflow-hidden bg-gradient-to-b from-[#0a0f1e] via-[#030712] to-[#0a0f1e]">
          
          {/* Top Prediction Reveal Banner */}
          <div className="flex flex-col items-center justify-center space-y-1 z-10 pt-2">
            <span className="text-[10px] font-orbitron text-[#94a3b8] uppercase tracking-widest">
              CURRENT RECOGNIZED GESTURE
            </span>

            <div className="flex items-center gap-3 px-6 py-2 rounded-2xl bg-[#030712]/90 border-2 border-[#00f0ff] shadow-[0_0_30px_rgba(0,240,255,0.4)] animate-fadeIn">
              <span className="text-3xl animate-bounce">{activeGesture?.emoji || '✋'}</span>
              <div className="text-left">
                <h2 className="font-orbitron font-black text-xl sm:text-2xl text-gradient-cyan tracking-wider">
                  {activeGesture?.name || 'OPEN PALM'}
                </h2>
                <span className="text-[11px] font-orbitron text-[#10b981] font-bold block">
                  ● CONFIRMED ({confidence}% MATCH)
                </span>
              </div>
            </div>
          </div>

          {/* 3D Holographic Hand Stage */}
          <div 
            className="relative w-full h-[360px] flex items-center justify-center my-2"
            style={{ perspective: '1000px' }}
          >
            <div 
              className="relative w-full h-full max-w-[460px] flex items-center justify-center transition-transform duration-300 ease-out"
              style={{ transform: `rotateY(${rotationY}deg) rotateX(${rotationX}deg)` }}
            >
              <Image
                src="/holographic-xray-hand.jpg"
                alt="3D Interactive AI Hand"
                fill
                priority
                className="object-contain drop-shadow-[0_0_35px_rgba(0,240,255,0.7)]"
              />
            </div>
          </div>

          {/* Bottom Stage Rotation Controls */}
          <div className="flex items-center justify-between border-t border-white/10 pt-3 z-10 text-xs font-orbitron">
            <span className="text-[#94a3b8] flex items-center gap-1.5">
              <RotateCw className="w-3.5 h-3.5 text-[#00f0ff]" /> 3D PERSPECTIVE: {rotationY}° Y
            </span>
            <input
              type="range"
              min="-35"
              max="35"
              value={rotationY}
              onChange={(e) => setRotationY(Number(e.target.value))}
              className="w-36 accent-[#00f0ff] bg-[#030712] cursor-pointer"
            />
          </div>

        </div>

        {/* RIGHT: AI INFERENCE & VOICE CONTROLS (3 cols) */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* AI Metrics Card */}
          <div className="glass-card p-5 space-y-4">
            <span className="text-[10px] font-orbitron text-[#94a3b8] uppercase block">AI INFERENCE PERFORMANCE</span>
            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="p-3 rounded-xl bg-[#030712] border border-[#00f0ff]/30">
                <span className="font-orbitron font-extrabold text-lg text-white block">{confidence}%</span>
                <span className="text-[10px] font-orbitron text-[#94a3b8]">CONFIDENCE</span>
              </div>
              <div className="p-3 rounded-xl bg-[#030712] border border-[#8b5cf6]/30">
                <span className="font-orbitron font-extrabold text-lg text-[#8b5cf6] block">{inferenceTimeMs}ms</span>
                <span className="text-[10px] font-orbitron text-[#94a3b8]">LATENCY</span>
              </div>
            </div>
          </div>

          {/* Voice Speech Trigger Card */}
          <div className="glass-card p-5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-orbitron text-[#94a3b8] uppercase">VOICE OUTPUT</span>
              <Volume2 className={`w-4 h-4 ${isSpeaking ? 'text-[#00f0ff] animate-bounce' : 'text-[#94a3b8]'}`} />
            </div>

            <div className="p-3 rounded-xl bg-[#030712] border border-white/10 text-center space-y-1">
              <span className="text-xs font-orbitron text-white block">&quot;{activeGesture?.mappedPhrase}&quot;</span>
              <span className="text-[10px] text-[#00f0ff] font-rajdhani font-semibold">SYNTHETIC VOICE ENGINE</span>
            </div>

            <button
              onClick={handleSpeakAgain}
              className="btn-primary w-full py-3 text-xs font-rajdhani font-bold flex items-center justify-center gap-2"
            >
              <Volume2 className="w-4 h-4" />
              <span>SPEAK GESTURE</span>
            </button>
          </div>

        </div>

      </div>

      {/* CURRENT PHRASE SENTENCE BUILDER */}
      <SentenceBuilder />

      {/* SECONDARY TOOL DOCK */}
      <ToolDock />

    </div>
  );
};
