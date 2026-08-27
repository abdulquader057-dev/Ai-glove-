'use client';

import React, { useState } from 'react';
import { 
  Volume2, 
  VolumeX, 
  Sparkles, 
  Mic, 
  Sliders, 
  Check, 
  Radio,
  HeartHandshake
} from 'lucide-react';
import { useGestureStore } from '@/store/gestureStore';
import { ttsService } from '@/services/ttsService';

export const AccessibilityPage: React.FC = () => {
  const { 
    speechVolume, 
    speechRate, 
    autoSpeak, 
    setSpeechVolume, 
    setSpeechRate, 
    setAutoSpeak,
    isSpeaking,
    setSpeaking
  } = useGestureStore();

  const [testPhrase, setTestPhrase] = useState('I need help immediately.');

  const handleTestSpeak = () => {
    setSpeaking(true);
    ttsService.speak(testPhrase);
    setTimeout(() => setSpeaking(false), 2000);
  };

  return (
    <div className="space-y-16 animate-fadeIn pb-12">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="px-3 py-1 rounded-full bg-[#ec4899]/10 border border-[#ec4899]/30 text-[#ec4899] font-orbitron text-xs tracking-widest uppercase">
          HUMAN-CENTERED ACCESSIBILITY
        </span>
        <h1 className="font-orbitron font-extrabold text-3xl sm:text-5xl text-white tracking-tight">
          COMMUNICATION WITHOUT <br />
          <span className="text-gradient-cyan">DEPENDING ON THE SCREEN</span>
        </h1>
        <p className="text-sm sm:text-base text-[#94a3b8] font-inter">
          Bridging the barrier for non-verbal individuals by transforming subtle physical hand gestures directly into clear, natural synthetic voice speech.
        </p>
      </div>

      {/* WORD-TO-SOUNDWAVE ANIMATED TRANSFORMATION */}
      <div className="glass-card p-8 border-[#00f0ff]/30 bg-gradient-to-br from-[#0a0f1e] via-[#030712] to-[#0a0f1e] relative overflow-hidden space-y-8">
        
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-2">
            <HeartHandshake className="w-5 h-5 text-[#ec4899]" />
            <h2 className="font-orbitron font-bold text-base text-white">
              KINETIC GESTURE TO ACOUSTIC SOUNDWAVE
            </h2>
          </div>
          <span className="text-xs font-orbitron text-[#00f0ff]">SYNTHETIC VOICE ENGINE</span>
        </div>

        {/* Transformation Stage */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center text-center">
          
          {/* Step 1: Gesture */}
          <div className="p-6 rounded-2xl bg-[#030712] border border-white/10 space-y-2">
            <span className="text-[10px] font-orbitron text-[#94a3b8] uppercase block">STEP 01</span>
            <div className="text-4xl py-2">☝️</div>
            <h3 className="font-orbitron font-bold text-sm text-white">PHYSICAL GESTURE</h3>
            <span className="text-xs text-[#94a3b8] font-inter">Point Up Pose</span>
          </div>

          {/* Step 2: Recognized Word */}
          <div className="p-6 rounded-2xl bg-[#00f0ff]/10 border border-[#00f0ff]/40 space-y-2 relative">
            <span className="text-[10px] font-orbitron text-[#00f0ff] uppercase block">STEP 02</span>
            <div className="font-orbitron font-black text-3xl text-gradient-cyan py-2">HELP</div>
            <h3 className="font-orbitron font-bold text-sm text-white">PARTICLE TOKEN</h3>
            <span className="text-xs text-[#00f0ff] font-inter">Instant Word Signal</span>
          </div>

          {/* Step 3: Soundwave Emission */}
          <div className="p-6 rounded-2xl bg-[#8b5cf6]/10 border border-[#8b5cf6]/40 space-y-2">
            <span className="text-[10px] font-orbitron text-[#8b5cf6] uppercase block">STEP 03</span>
            <div className="flex items-center justify-center gap-1.5 h-12 py-2">
              {[40, 70, 100, 60, 90, 50, 80].map((h, i) => (
                <div
                  key={i}
                  className="w-1.5 rounded-full bg-[#8b5cf6] animate-pulse"
                  style={{ height: `${h}%`, animationDelay: `${i * 150}ms` }}
                />
              ))}
            </div>
            <h3 className="font-orbitron font-bold text-sm text-white">ACOUSTIC SPEECH</h3>
            <span className="text-xs text-[#8b5cf6] font-inter">Speech Synthesis</span>
          </div>

        </div>

      </div>

      {/* TACTILE VOICE CONTROLS PANEL */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Controls Container (7 cols) */}
        <div className="lg:col-span-7 glass-card p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center gap-2">
              <Sliders className="w-5 h-5 text-[#00f0ff]" />
              <h2 className="font-orbitron font-bold text-base text-white">TACTILE VOICE CONTROLS</h2>
            </div>
            <span className="text-xs font-orbitron text-[#94a3b8]">WEB SPEECH API</span>
          </div>

          {/* 1. PHYSICAL VOLUME SLIDER */}
          <div className="space-y-3">
            <div className="flex justify-between items-center text-xs font-orbitron">
              <span className="text-[#94a3b8] flex items-center gap-2">
                {speechVolume === 0 ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-[#00f0ff]" />}
                SPEECH VOLUME LEVEL
              </span>
              <span className="text-[#00f0ff] font-mono font-bold">{speechVolume}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={speechVolume}
              onChange={(e) => setSpeechVolume(Number(e.target.value))}
              className="w-full accent-[#00f0ff] bg-[#030712] cursor-pointer h-2.5 rounded-lg"
            />
          </div>

          {/* 2. SPEECH SPEED SEGMENTED CONTROL */}
          <div className="space-y-3">
            <span className="text-xs font-orbitron text-[#94a3b8] block">
              SPEECH RATE SPEED
            </span>
            <div className="grid grid-cols-3 gap-3">
              {(['slow', 'normal', 'fast'] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => setSpeechRate(r)}
                  className={`py-3 rounded-xl text-xs font-orbitron uppercase border transition-all ${
                    speechRate === r
                      ? 'bg-[#00f0ff]/20 border-[#00f0ff] text-white shadow-[0_0_15px_rgba(0,240,255,0.3)] font-bold'
                      : 'bg-[#030712] border-white/10 text-[#94a3b8] hover:text-white'
                  }`}
                >
                  {r} RATE
                </button>
              ))}
            </div>
          </div>

          {/* 3. AUTO-SPEAK ENERGY TOGGLE */}
          <div className="p-4 rounded-xl bg-[#030712] border border-white/10 flex items-center justify-between">
            <div>
              <span className="font-orbitron font-bold text-xs text-white block">
                AUTOMATIC GESTURE SPEAKING
              </span>
              <span className="text-[11px] text-[#94a3b8] font-inter">
                Automatically speak phrases upon 90%+ gesture confirmation.
              </span>
            </div>

            <button
              onClick={() => setAutoSpeak(!autoSpeak)}
              className={`w-12 h-6 rounded-full transition-all relative p-0.5 border ${
                autoSpeak ? 'bg-[#00f0ff]/20 border-[#00f0ff]' : 'bg-[#030712] border-white/20'
              }`}
            >
              <div className={`w-4 h-4 rounded-full transition-transform ${
                autoSpeak ? 'translate-x-6 bg-[#00f0ff] shadow-[0_0_8px_#00f0ff]' : 'translate-x-0 bg-white/40'
              }`} />
            </button>
          </div>

        </div>

        {/* Test Audio Synthesizer (5 cols) */}
        <div className="lg:col-span-5 glass-card p-6 flex flex-col justify-between space-y-6">
          <div className="flex items-center gap-2 border-b border-white/10 pb-4">
            <Mic className="w-5 h-5 text-[#8b5cf6]" />
            <h2 className="font-orbitron font-bold text-base text-white">TEST SYNTHESIZER</h2>
          </div>

          <div className="space-y-3">
            <span className="text-xs font-orbitron text-[#94a3b8] block">TEST SENTENCE PROMPT</span>
            <input
              type="text"
              value={testPhrase}
              onChange={(e) => setTestPhrase(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-[#030712] border border-white/20 text-sm text-white font-inter focus:border-[#00f0ff] focus:outline-none"
            />
          </div>

          <button
            onClick={handleTestSpeak}
            className="btn-primary w-full py-4 text-sm font-rajdhani font-bold flex items-center justify-center gap-2"
          >
            <Volume2 className={`w-5 h-5 ${isSpeaking ? 'animate-bounce' : ''}`} />
            <span>{isSpeaking ? 'SPEAKING PHRASE...' : 'TEST VOICE SYNTHESIS'}</span>
          </button>
        </div>

      </div>

    </div>
  );
};
