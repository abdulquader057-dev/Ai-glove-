'use client';

import React, { useState } from 'react';
import { useGestureStore } from '@/store/gestureStore';
import { useHardwareStore } from '@/store/hardwareStore';
import { ttsService } from '@/services/ttsService';
import { 
  Plus, 
  Volume2, 
  Trash2, 
  Sparkles, 
  X, 
  Check, 
  Search,
  Radio
} from 'lucide-react';

export const SavedGesturesManager: React.FC = () => {
  const { gestures, addGesture, deleteGesture, searchQuery, setSearchQuery } = useGestureStore();
  const { flexSensors } = useHardwareStore();

  const [isTrainModalOpen, setIsTrainModalOpen] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [capturedFlex, setCapturedFlex] = useState<[number, number, number, number, number] | null>(null);

  const [name, setName] = useState('');
  const [emoji, setEmoji] = useState('🤌');
  const [mappedPhrase, setMappedPhrase] = useState('');

  const filteredGestures = gestures.filter((g) =>
    g.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    g.mappedPhrase.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleStartTraining = () => {
    setIsRecording(true);
    setCountdown(3);

    let current = 3;
    const interval = setInterval(() => {
      current -= 1;
      setCountdown(current);
      if (current === 0) {
        clearInterval(interval);
        setIsRecording(false);

        // Capture snapshot of current flex sensor readings
        setCapturedFlex([
          flexSensors.thumb,
          flexSensors.index,
          flexSensors.middle,
          flexSensors.ring,
          flexSensors.pinky,
        ]);
      }
    }, 1000);
  };

  const handleSaveGesture = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !mappedPhrase || !capturedFlex) return;

    addGesture({
      name: name.toUpperCase(),
      emoji: emoji || '✨',
      mappedPhrase,
      fingerFlex: {
        thumb: Math.round((capturedFlex[0] / 1023) * 100),
        index: Math.round((capturedFlex[1] / 1023) * 100),
        middle: Math.round((capturedFlex[2] / 1023) * 100),
        ring: Math.round((capturedFlex[3] / 1023) * 100),
        pinky: Math.round((capturedFlex[4] / 1023) * 100),
      },
      description: `Custom recorded gesture mapped to "${mappedPhrase}"`,
      category: 'custom',
    });

    // Reset form
    setName('');
    setEmoji('🤌');
    setMappedPhrase('');
    setCapturedFlex(null);
    setIsTrainModalOpen(false);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#00f0ff]/20 pb-5">
        <div>
          <span className="px-2.5 py-0.5 rounded bg-[#00f0ff]/20 text-[#00f0ff] font-orbitron text-[10px] tracking-widest uppercase">
            TRAINED HARDWARE PROFILES
          </span>
          <h1 className="font-orbitron font-extrabold text-2xl sm:text-3xl text-gradient-cyan mt-1">
            SAVED GESTURE LIBRARY
          </h1>
        </div>

        <button
          onClick={() => setIsTrainModalOpen(true)}
          className="btn-primary flex items-center justify-center gap-2"
        >
          <Plus className="w-5 h-5" />
          <span>TRAIN NEW GESTURE</span>
        </button>
      </div>

      {/* Search Filter */}
      <div className="glass-card p-4 flex items-center gap-3">
        <Search className="w-5 h-5 text-[#00f0ff]" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Filter saved gestures by name or mapped phrase..."
          className="w-full bg-transparent text-white font-inter text-sm outline-none placeholder:text-[#94a3b8]"
        />
      </div>

      {/* Gesture List Table / Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredGestures.map((gesture) => (
          <div key={gesture.id} className="glass-card p-5 space-y-4 flex flex-col justify-between group">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-[#00f0ff]/10 border border-[#00f0ff]/40 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                  {gesture.emoji}
                </div>
                <div>
                  <h3 className="font-orbitron font-bold text-base text-white tracking-wider">
                    {gesture.name}
                  </h3>
                  <span className="text-[10px] font-orbitron text-[#00f0ff] uppercase">
                    {gesture.category || 'essential'}
                  </span>
                </div>
              </div>

              <button
                onClick={() => deleteGesture(gesture.id)}
                title="Delete Gesture"
                className="text-[#94a3b8] hover:text-red-400 p-1.5 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3 rounded-xl bg-[#030712] border border-white/10 space-y-1">
              <span className="text-[10px] text-[#94a3b8] font-orbitron uppercase block">MAPPED VOICE PHRASE</span>
              <p className="text-xs text-white font-inter italic">&quot;{gesture.mappedPhrase}&quot;</p>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-white/10 text-xs">
              <button
                onClick={() => ttsService.speak(gesture.mappedPhrase)}
                className="btn-outline !py-1.5 !px-3 text-xs flex items-center gap-1.5"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>LISTEN VOICE</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* TRAIN NEW GESTURE MODAL */}
      {isTrainModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fadeIn">
          <div className="glass-card max-w-lg w-full p-6 space-y-6 relative border-[#00f0ff]/50 bg-[#0a0f1e]/95 shadow-[0_0_50px_rgba(0,240,255,0.3)]">
            <button
              onClick={() => setIsTrainModalOpen(false)}
              className="absolute top-4 right-4 text-[#94a3b8] hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <span className="text-[10px] font-orbitron text-[#00f0ff] uppercase tracking-widest">
                LIVE HARDWARE RECORDING
              </span>
              <h2 className="font-orbitron font-extrabold text-xl text-white">
                TRAIN CUSTOM HAND GESTURE
              </h2>
            </div>

            {/* Countdown / Capture Step */}
            {!capturedFlex ? (
              <div className="p-6 rounded-2xl bg-[#030712] border border-white/10 text-center space-y-4">
                {isRecording ? (
                  <div className="space-y-2">
                    <div className="font-orbitron font-black text-5xl text-[#00f0ff] animate-ping">
                      {countdown}
                    </div>
                    <p className="text-xs text-[#94a3b8] font-orbitron uppercase">
                      HOLD HAND GESTURE STILL...
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <Radio className="w-8 h-8 text-[#00f0ff] mx-auto animate-pulse" />
                    <p className="text-xs text-[#94a3b8] font-inter">
                      Form your hand into the desired gesture and click below to record a 3-second live sensor snapshot.
                    </p>
                    <button
                      onClick={handleStartTraining}
                      className="btn-primary w-full py-3 text-xs font-rajdhani font-bold flex items-center justify-center gap-2"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>START 3-SECOND RECORDING</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <form onSubmit={handleSaveGesture} className="space-y-4">
                <div className="p-3 rounded-xl bg-[#10b981]/10 border border-[#10b981]/40 flex items-center gap-2 text-[#10b981] text-xs font-orbitron">
                  <Check className="w-4 h-4" />
                  <span>5-FLEX SENSORS SNAPSHOT CAPTURED!</span>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-orbitron text-[#94a3b8]">GESTURE NAME</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. PEACE SIGN, EMERGENCY STOP..."
                    className="w-full px-4 py-2.5 rounded-xl bg-[#030712] border border-white/20 text-xs text-white outline-none focus:border-[#00f0ff]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-orbitron text-[#94a3b8]">EMOJI SYMBOL</label>
                  <input
                    type="text"
                    required
                    value={emoji}
                    onChange={(e) => setEmoji(e.target.value)}
                    placeholder="e.g. ✌️, ✊, ✋..."
                    className="w-full px-4 py-2.5 rounded-xl bg-[#030712] border border-white/20 text-xs text-white outline-none focus:border-[#00f0ff]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-orbitron text-[#94a3b8]">MAPPED VOICE PHRASE</label>
                  <input
                    type="text"
                    required
                    value={mappedPhrase}
                    onChange={(e) => setMappedPhrase(e.target.value)}
                    placeholder="e.g. Hello, I need help immediately."
                    className="w-full px-4 py-2.5 rounded-xl bg-[#030712] border border-white/20 text-xs text-white outline-none focus:border-[#00f0ff]"
                  />
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setCapturedFlex(null)}
                    className="btn-outline w-1/2 py-2.5 text-xs font-rajdhani font-bold"
                  >
                    RE-RECORD
                  </button>
                  <button
                    type="submit"
                    className="btn-primary w-1/2 py-2.5 text-xs font-rajdhani font-bold"
                  >
                    SAVE GESTURE
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>
      )}

    </div>
  );
};
