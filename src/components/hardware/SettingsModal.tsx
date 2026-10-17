// Hardware, Engine & Speech Settings Modal for SIGNOVA
// Assistive Device Medical Interface
// Manages Text-To-Speech voice selection, rate, pitch, engine selection, and trace replay.

'use client';

import React, { useEffect, useState } from 'react';
import { useSignovaStore } from '@/store/signovaStore';
import { speechService, SpeechSettings } from '@/services/speechService';

export const SettingsModal: React.FC = () => {
  const {
    isSettingsOpen,
    setSettingsOpen,
    classifierSource,
    setClassifierSource,
    isReplaying,
    toggleReplay,
  } = useSignovaStore();

  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [settings, setSettings] = useState<SpeechSettings>(speechService.getSettings());

  useEffect(() => {
    if (!isSettingsOpen) return;
    setVoices(speechService.getVoices());
    setSettings(speechService.getSettings());

    const unsub = speechService.subscribe((s) => {
      setSettings(s);
    });
    return () => unsub();
  }, [isSettingsOpen]);

  if (!isSettingsOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm font-mono">
      <div className="bg-[#0E1218] rounded-xl border border-[#1F2733] shadow-2xl w-full max-w-lg overflow-hidden animate-scale-pop">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#1F2733]">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#2EE6A6]/10 border border-[#2EE6A6]/30 flex items-center justify-center text-[#2EE6A6]">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div>
              <h2 className="text-sm font-bold text-white tracking-wide">
                Device &amp; Engine Settings
              </h2>
              <p className="text-[11px] text-[#9CA3AF]">
                Configure speech synthesis, classification model, and trace replay
              </p>
            </div>
          </div>
          <button
            onClick={() => setSettingsOpen(false)}
            className="p-1 rounded-lg text-[#9CA3AF] hover:bg-[#141922] hover:text-white"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 space-y-4 max-h-[70vh] overflow-y-auto">
          {/* Section 1: Speech Synthesis */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#2EE6A6]">
              Voice Synthesis (TTS Engine)
            </h3>

            {/* Voice Dropdown */}
            <div className="space-y-1">
              <label className="text-[11px] text-[#9CA3AF]">Synthesizer Voice</label>
              <select
                value={settings.voiceURI}
                onChange={(e) => speechService.setVoice(e.target.value)}
                className="w-full text-xs p-2.5 rounded-lg bg-[#141922] border border-[#1F2733] text-white focus:outline-none focus:border-[#2EE6A6]"
              >
                {voices.map((v) => (
                  <option key={v.voiceURI} value={v.voiceURI} className="bg-[#141922] text-white">
                    {v.name} ({v.lang})
                  </option>
                ))}
              </select>
            </div>

            {/* Rate & Pitch */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] text-[#9CA3AF]">
                  <span>Speaking Rate</span>
                  <span className="font-mono text-white font-bold">{settings.rate.toFixed(1)}x</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="2.0"
                  step="0.1"
                  value={settings.rate}
                  onChange={(e) => speechService.setRate(parseFloat(e.target.value))}
                  className="w-full accent-[#2EE6A6]"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-[11px] text-[#9CA3AF]">
                  <span>Voice Pitch</span>
                  <span className="font-mono text-white font-bold">{settings.pitch.toFixed(1)}</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="2.0"
                  step="0.1"
                  value={settings.pitch}
                  onChange={(e) => speechService.setPitch(parseFloat(e.target.value))}
                  className="w-full accent-[#2EE6A6]"
                />
              </div>
            </div>

            {/* Test Voice Button */}
            <button
              onClick={() => speechService.testVoice('Signova Speech Engine Ready')}
              className="py-2 px-3 bg-[#141922] hover:bg-[#1E2533] border border-[#2EE6A6]/40 text-xs font-bold rounded-lg text-[#2EE6A6] transition-colors flex items-center gap-2 cursor-pointer"
            >
              <svg className="w-3.5 h-3.5 text-[#2EE6A6]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
              </svg>
              <span>Test Audio Vocalization</span>
            </button>
          </div>

          {/* Section 2: Classifier Engine */}
          <div className="pt-3 border-t border-[#1F2733] space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#38BDF8]">
              Classification Architecture
            </h3>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setClassifierSource('threshold')}
                className={`p-3 rounded-lg border text-left transition-colors cursor-pointer ${
                  classifierSource === 'threshold'
                    ? 'bg-[#2EE6A6]/10 border-[#2EE6A6] text-[#2EE6A6] shadow-[0_0_12px_rgba(46,230,166,0.2)]'
                    : 'bg-[#141922] border-[#1F2733] text-[#9CA3AF] hover:border-[#1F2733]/80'
                }`}
              >
                <div className="text-xs font-bold text-white">Threshold Matrix</div>
                <div className="text-[10px] text-[#9CA3AF] mt-0.5">
                  Calibrated midpoints (Default)
                </div>
              </button>

              <button
                onClick={() => setClassifierSource('random_forest')}
                className={`p-3 rounded-lg border text-left transition-colors cursor-pointer ${
                  classifierSource === 'random_forest'
                    ? 'bg-[#2EE6A6]/10 border-[#2EE6A6] text-[#2EE6A6] shadow-[0_0_12px_rgba(46,230,166,0.2)]'
                    : 'bg-[#141922] border-[#1F2733] text-[#9CA3AF] hover:border-[#1F2733]/80'
                }`}
              >
                <div className="text-xs font-bold text-white">Random Forest</div>
                <div className="text-[10px] text-[#9CA3AF] mt-0.5">
                  m2cgen Ensemble Trees
                </div>
              </button>
            </div>
          </div>

          {/* Section 3: Trace Replay */}
          <div className="pt-3 border-t border-[#1F2733] space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs font-semibold text-white">
                  Sample Sensor Replay
                </div>
                <div className="text-[11px] text-[#9CA3AF]">
                  Cycle pre-recorded telemetry stream at 50Hz for testing
                </div>
              </div>
              <button
                onClick={toggleReplay}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
                  isReplaying
                    ? 'bg-[#F59E0B] text-[#07090D] border-[#F59E0B]'
                    : 'bg-[#141922] border-[#1F2733] text-[#D1D5DB] hover:text-white'
                }`}
              >
                {isReplaying ? 'Stop Replay' : 'Start Replay'}
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#07090D] border-t border-[#1F2733] flex justify-end">
          <button
            onClick={() => setSettingsOpen(false)}
            className="py-1.5 px-4 bg-[#2EE6A6] hover:bg-[#22C58B] text-[#07090D] text-xs font-black rounded-lg cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
