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
  Radio,
  Sliders
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

    // Build min and max thresholds around captured values (+- 120 range)
    const min = capturedFlex.map((val) => Math.max(0, val - 120)) as [number, number, number, number, number];
    const max = capturedFlex.map((val) => Math.min(1023, val + 120)) as [number, number, number, number, number];

    addGesture({
      name: name.toUpperCase(),
      emoji: emoji || '✨',
      mappedPhrase,
      flexThresholds: { min, max },
      confidence: 0.96,
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
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#030712]/80 border-b border-white/10 text-[11px] font-orbitron text-[#94a3b8] uppercase tracking-wider">
                <th className="py-4 px-6">EMOJI / NAME</th>
                <th className="py-4 px-6">MAPPED VOICE PHRASE</th>
                <th className="py-4 px-6">FLEX THRESHOLDS</th>
                <th className="py-4 px-6 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-sm font-inter">
              {filteredGestures.map((gesture) => (
                <tr key={gesture.id} className="hover:bg-white/[0.02] transition-colors">
                  
                  {/* Emoji & Name */}
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#00f0ff]/10 border border-[#00f0ff]/30 flex items-center justify-center text-xl shadow-[0_0_10px_rgba(0,240,255,0.2)]">
                        {gesture.emoji}
                      </div>
                      <div>
                        <span className="font-orbitron font-bold text-white block">
                          {gesture.name}
                        </span>
                        {gesture.isCustom && (
                          <span className="text-[10px] font-orbitron text-[#ec4899] uppercase">
                            USER TRAINED
                          </span>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Mapped Phrase */}
                  <td className="py-4 px-6 text-[#94a3b8]">
                    &quot;{gesture.mappedPhrase}&quot;
                  </td>

                  {/* Sensor thresholds summary */}
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-1 text-[11px] font-mono text-[#00f0ff]">
                      <Sliders className="w-3.5 h-3.5 text-[#94a3b8]" />
                      <span>
                        [{gesture.flexThresholds.min[0]}-{gesture.flexThresholds.max[0]}] ...
                      </span>
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => ttsService.speak(gesture.mappedPhrase)}
                        title="Test Voice Output"
                        className="p-2.5 rounded-lg bg-[#00f0ff]/10 border border-[#00f0ff]/30 text-[#00f0ff] hover:bg-[#00f0ff]/20 transition-all flex items-center gap-1 text-xs font-rajdhani font-bold"
                      >
                        <Volume2 className="w-4 h-4" />
                        <span>TEST</span>
                      </button>

                      {gesture.isCustom && (
                        <button
                          onClick={() => deleteGesture(gesture.id)}
                          title="Delete Gesture"
                          className="p-2.5 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* TRAINING MODAL */}
      {isTrainModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#030712]/80 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-lg bg-[#0a0f1e] border-2 border-[#00f0ff]/40 rounded-2xl p-6 sm:p-8 shadow-[0_0_50px_rgba(0,240,255,0.3)] space-y-6">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#00f0ff]" />
                <h2 className="font-orbitron font-bold text-lg text-white">
                  TRAIN NEW HARDWARE GESTURE
                </h2>
              </div>
              <button
                onClick={() => setIsTrainModalOpen(false)}
                className="p-1 text-[#94a3b8] hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 3-Second Recording Box */}
            <div className="p-6 rounded-2xl bg-[#030712] border border-[#00f0ff]/30 text-center space-y-4">
              {isRecording ? (
                <div className="space-y-3">
                  <div className="w-16 h-16 rounded-full border-4 border-[#00f0ff] border-t-transparent animate-spin flex items-center justify-center mx-auto shadow-[0_0_20px_rgba(0,240,255,0.5)]">
                    <span className="font-orbitron font-extrabold text-2xl text-[#00f0ff]">{countdown}</span>
                  </div>
                  <p className="font-orbitron text-xs text-[#00f0ff] uppercase tracking-wider animate-pulse">
                    HOLD GESTURE STILL FOR 3 SECONDS...
                  </p>
                </div>
              ) : capturedFlex ? (
                <div className="space-y-2 text-center">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500 text-emerald-400 flex items-center justify-center mx-auto">
                    <Check className="w-6 h-6" />
                  </div>
                  <p className="font-orbitron text-xs text-emerald-400 uppercase tracking-wider">
                    5 SENSOR VECTORS CAPTURED!
                  </p>
                  <p className="text-[11px] font-mono text-[#94a3b8]">
                    Values: [{capturedFlex.join(', ')}]
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-xs text-[#94a3b8]">
                    Hold your physical hand in the target gesture, then click Record.
                  </p>
                  <button
                    type="button"
                    onClick={handleStartTraining}
                    className="btn-primary !py-2.5 !px-6 text-xs mx-auto"
                  >
                    <Radio className="w-4 h-4 animate-pulse" />
                    <span>START 3S RECORDING</span>
                  </button>
                </div>
              )}
            </div>

            {/* Assignment Form */}
            <form onSubmit={handleSaveGesture} className="space-y-4">
              <div className="grid grid-cols-4 gap-3">
                <div className="col-span-1">
                  <label className="block text-xs font-rajdhani font-semibold text-[#94a3b8] uppercase mb-1">
                    EMOJI
                  </label>
                  <input
                    type="text"
                    value={emoji}
                    onChange={(e) => setEmoji(e.target.value)}
                    maxLength={2}
                    className="w-full bg-[#030712] border border-[#00f0ff]/30 text-white text-center py-2.5 rounded-xl text-lg outline-none"
                  />
                </div>
                <div className="col-span-3">
                  <label className="block text-xs font-rajdhani font-semibold text-[#94a3b8] uppercase mb-1">
                    GESTURE NAME
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. TWO FINGER SWIPE"
                    required
                    className="w-full bg-[#030712] border border-[#00f0ff]/30 text-white px-3 py-2.5 rounded-xl font-orbitron text-xs outline-none focus:border-[#00f0ff]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-rajdhani font-semibold text-[#94a3b8] uppercase mb-1">
                  MAPPED VOICE PHRASE (TTS OUTPUT)
                </label>
                <input
                  type="text"
                  value={mappedPhrase}
                  onChange={(e) => setMappedPhrase(e.target.value)}
                  placeholder="e.g. Please open the main door."
                  required
                  className="w-full bg-[#030712] border border-[#00f0ff]/30 text-white px-3 py-2.5 rounded-xl font-inter text-sm outline-none focus:border-[#00f0ff]"
                />
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsTrainModalOpen(false)}
                  className="btn-outline flex-1 text-xs"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  disabled={!capturedFlex || !name || !mappedPhrase}
                  className="btn-primary flex-1 text-xs disabled:opacity-40"
                >
                  SAVE GESTURE
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};
