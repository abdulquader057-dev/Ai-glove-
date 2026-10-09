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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="bg-white dark:bg-[#111827] rounded-xl border border-[#E4E7EC] dark:border-[#1F2937] shadow-modal w-full max-w-lg overflow-hidden animate-scale-pop">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#F0F2F5] dark:border-[#1F2937]">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#E0F2FE] dark:bg-[#0E7490]/30 flex items-center justify-center text-[#0E7490] dark:text-[#38BDF8]">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div>
              <h2 className="text-sm font-bold text-[#101828] dark:text-[#F9FAFB]">
                Device &amp; Engine Settings
              </h2>
              <p className="text-[11px] text-[#667085] dark:text-[#9CA3AF]">
                Configure speech synthesis, classification model, and trace replay
              </p>
            </div>
          </div>
          <button
            onClick={() => setSettingsOpen(false)}
            className="p-1 rounded-lg text-[#667085] hover:bg-[#F2F4F7] dark:hover:bg-[#1F2937]"
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
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#344054] dark:text-[#E5E7EB]">
              Voice Synthesis (TTS)
            </h3>

            {/* Voice Dropdown */}
            <div className="space-y-1">
              <label className="text-[11px] text-[#475467] dark:text-[#9CA3AF]">Vocal Synthesizer Voice</label>
              <select
                value={settings.voiceURI}
                onChange={(e) => speechService.setVoice(e.target.value)}
                className="w-full text-xs p-2 rounded-lg bg-[#F8F9FA] dark:bg-[#1F2937] border border-[#D0D5DD] dark:border-[#374151] text-[#101828] dark:text-[#F9FAFB]"
              >
                {voices.map((v) => (
                  <option key={v.voiceURI} value={v.voiceURI}>
                    {v.name} ({v.lang})
                  </option>
                ))}
              </select>
            </div>

            {/* Rate & Pitch */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] text-[#475467] dark:text-[#9CA3AF]">
                  <span>Speaking Rate</span>
                  <span className="font-mono">{settings.rate.toFixed(1)}x</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="2.0"
                  step="0.1"
                  value={settings.rate}
                  onChange={(e) => speechService.setRate(parseFloat(e.target.value))}
                  className="w-full accent-[#0E7490]"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-[11px] text-[#475467] dark:text-[#9CA3AF]">
                  <span>Voice Pitch</span>
                  <span className="font-mono">{settings.pitch.toFixed(1)}</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="2.0"
                  step="0.1"
                  value={settings.pitch}
                  onChange={(e) => speechService.setPitch(parseFloat(e.target.value))}
                  className="w-full accent-[#0E7490]"
                />
              </div>
            </div>

            {/* Test Voice Button */}
            <button
              onClick={() => speechService.testVoice('Signova Speech Engine Ready')}
              className="py-1.5 px-3 bg-[#F0F2F5] dark:bg-[#1F2937] hover:bg-[#E4E7EC] dark:hover:bg-[#374151] text-xs font-medium rounded-lg text-[#344054] dark:text-[#E5E7EB] transition-colors flex items-center gap-2"
            >
              <svg className="w-3.5 h-3.5 text-[#0E7490]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
              </svg>
              <span>Test Audio Synthesis</span>
            </button>
          </div>

          {/* Section 2: Classifier Engine */}
          <div className="pt-3 border-t border-[#F0F2F5] dark:border-[#1F2937] space-y-2">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#344054] dark:text-[#E5E7EB]">
              Classification Engine
            </h3>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setClassifierSource('threshold')}
                className={`p-2.5 rounded-lg border text-left transition-colors ${
                  classifierSource === 'threshold'
                    ? 'bg-[#E0F2FE] dark:bg-[#0E7490]/30 border-[#0E7490] text-[#0C4A6E] dark:text-[#7DD3FC]'
                    : 'bg-[#F8F9FA] dark:bg-[#1F2937] border-[#D0D5DD] dark:border-[#374151] text-[#344054] dark:text-[#E5E7EB]'
                }`}
              >
                <div className="text-xs font-bold">Threshold Matrix</div>
                <div className="text-[10px] text-[#667085] dark:text-[#9CA3AF] mt-0.5">
                  Calibrated midpoints (Default)
                </div>
              </button>

              <button
                onClick={() => setClassifierSource('random_forest')}
                className={`p-2.5 rounded-lg border text-left transition-colors ${
                  classifierSource === 'random_forest'
                    ? 'bg-[#E0F2FE] dark:bg-[#0E7490]/30 border-[#0E7490] text-[#0C4A6E] dark:text-[#7DD3FC]'
                    : 'bg-[#F8F9FA] dark:bg-[#1F2937] border-[#D0D5DD] dark:border-[#374151] text-[#344054] dark:text-[#E5E7EB]'
                }`}
              >
                <div className="text-xs font-bold">Random Forest</div>
                <div className="text-[10px] text-[#667085] dark:text-[#9CA3AF] mt-0.5">
                  m2cgen Ensemble Trees
                </div>
              </button>
            </div>
          </div>

          {/* Section 3: Trace Replay */}
          <div className="pt-3 border-t border-[#F0F2F5] dark:border-[#1F2937] space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs font-medium text-[#101828] dark:text-[#F9FAFB]">
                  Sample Hardware Replay
                </div>
                <div className="text-[11px] text-[#667085] dark:text-[#9CA3AF]">
                  Cycle pre-recorded sensor stream at 50Hz for testing
                </div>
              </div>
              <button
                onClick={toggleReplay}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                  isReplaying
                    ? 'bg-[#FEF3C7] border-[#F59E0B] text-[#92400E]'
                    : 'bg-white dark:bg-[#1F2937] border-[#D0D5DD] dark:border-[#374151] text-[#344054] dark:text-[#E5E7EB]'
                }`}
              >
                {isReplaying ? 'Stop Replay' : 'Start Replay'}
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#F8F9FA] dark:bg-[#1A2230] border-t border-[#F0F2F5] dark:border-[#1F2937] flex justify-end">
          <button
            onClick={() => setSettingsOpen(false)}
            className="py-1.5 px-4 bg-[#101828] dark:bg-[#F9FAFB] text-white dark:text-[#101828] text-xs font-medium rounded-lg"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
