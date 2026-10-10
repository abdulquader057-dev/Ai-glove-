// Detected Gesture Recognition Card for SIGNOVA
// Assistive Device Medical Interface
// Displays recognized word (36px scale-pop), 400ms debounce hold progress,
// live speaking waveform, measured packet latency, and confidence score.

'use client';

import React from 'react';
import { useSignovaStore } from '@/store/signovaStore';
import { speechService } from '@/services/speechService';

export const GestureCard: React.FC = () => {
  const {
    activeGesture,
    candidateGesture,
    activeConfidence,
    holdProgress,
    realLatencyMs,
    justConfirmed,
    isSpeaking,
    isMuted,
    toggleMute,
    binaryString,
    classifierSource,
    connectionStatus,
  } = useSignovaStore();

  const isConnected = connectionStatus === 'connected';

  // Format binary pattern nicely: "0 1 0"
  const formattedBits = binaryString.split('').join(' ');

  return (
    <div
      className={`relative w-full p-4 sm:p-5 rounded-xl border transition-all duration-200 bg-white dark:bg-[#111827] shadow-card ${
        isSpeaking
          ? 'border-[#F59E0B] shadow-[0_0_0_2px_rgba(245,158,11,0.2)]'
          : justConfirmed
          ? 'border-[#0E7490] shadow-[0_0_0_2px_rgba(14,116,144,0.25)]'
          : 'border-[#E4E7EC] dark:border-[#1F2937]'
      }`}
    >
      {/* Top Header Row */}
      <div className="flex items-center justify-between pb-3 border-b border-[#F0F2F5] dark:border-[#1F2937]">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-[#475467] dark:text-[#9CA3AF]">
            Recognized Gesture
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#F0F2F5] dark:bg-[#1F2937] text-[#344054] dark:text-[#E5E7EB]">
            Bits: [{formattedBits}]
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Active Speaking Indicator */}
          {isSpeaking && (
            <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#FEF3C7] dark:bg-[#78350F]/50 text-[#B45309] dark:text-[#FDE68A] text-[11px] font-medium border border-[#FCD34D]/60 animate-pulse">
              <span className="flex items-end gap-[2px] h-3">
                <span className="w-[2px] bg-[#D97706] rounded-full wave-bar-1 inline-block"></span>
                <span className="w-[2px] bg-[#D97706] rounded-full wave-bar-2 inline-block"></span>
                <span className="w-[2px] bg-[#D97706] rounded-full wave-bar-3 inline-block"></span>
                <span className="w-[2px] bg-[#D97706] rounded-full wave-bar-4 inline-block"></span>
              </span>
              <span>Speaking</span>
            </div>
          )}

          {/* Mute Quick Toggle */}
          <button
            onClick={toggleMute}
            title={isMuted ? 'Unmute Speech Synthesis' : 'Mute Speech Synthesis'}
            className={`p-1.5 rounded-md border text-xs transition-colors ${
              isMuted
                ? 'bg-[#FEE4E2] dark:bg-[#7F1D1D]/30 border-[#FDA29B] text-[#D92D20]'
                : 'bg-[#F0F2F5] dark:bg-[#1F2937] border-[#E4E7EC] dark:border-[#374151] text-[#475467] dark:text-[#9CA3AF] hover:text-[#101828]'
            }`}
          >
            {isMuted ? (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Main Gesture Display Hero */}
      <div className="py-4 text-center">
        <div className="flex items-center justify-center gap-3">
          <div
            key={activeGesture}
            className={`text-4xl sm:text-5xl font-bold tracking-tight transition-transform duration-150 ${
              activeGesture !== 'NONE'
                ? 'text-[#101828] dark:text-[#F9FAFB] animate-scale-pop'
                : 'text-[#98A2B3] dark:text-[#6B7280]'
            }`}
          >
            {activeGesture}
          </div>
          {activeGesture !== 'NONE' && (
            <button
              onClick={() => speechService.testVoice(activeGesture)}
              title="Vocalize this gesture out loud"
              className="p-2 rounded-full bg-[#E0F2FE] dark:bg-[#0E7490]/30 hover:bg-[#BAE6FD] dark:hover:bg-[#0E7490]/50 text-[#0284C7] dark:text-[#38BDF8] transition-all hover:scale-105"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
              </svg>
            </button>
          )}
        </div>
        <div className="mt-1 text-xs text-[#475467] dark:text-[#9CA3AF] flex items-center justify-center gap-2">
          <span>Engine:</span>
          <span className="font-medium text-[#101828] dark:text-[#E5E7EB]">
            {classifierSource === 'random_forest' ? 'Random Forest (m2cgen)' : 'Threshold Matrix'}
          </span>
          <span>·</span>
          <span>400ms Debounce</span>
        </div>
      </div>

      {/* 400ms Hold Debounce Bar */}
      <div className="space-y-1.5 pt-1">
        <div className="flex items-center justify-between text-[11px]">
          <span className="text-[#475467] dark:text-[#9CA3AF] flex items-center gap-1.5">
            <span>Debounce Stability</span>
            {holdProgress > 0 && holdProgress < 100 && (
              <span className="text-[#B45309] font-medium animate-pulse">
                Holding {candidateGesture}…
              </span>
            )}
            {holdProgress === 100 && activeGesture !== 'NONE' && (
              <span className="text-[#12B76A] font-medium">Locked</span>
            )}
          </span>
          <span className="font-mono text-[10px] text-[#667085] dark:text-[#9CA3AF]">
            {holdProgress}% (400 ms)
          </span>
        </div>

        {/* Progress Bar Container */}
        <div className="relative w-full h-2 bg-[#F0F2F5] dark:bg-[#1F2937] rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-100 ease-out rounded-full ${
              holdProgress === 100
                ? 'bg-[#12B76A]'
                : holdProgress > 0
                ? 'bg-[#F59E0B]'
                : 'bg-transparent'
            }`}
            style={{ width: `${holdProgress}%` }}
          />
        </div>
      </div>

      {/* Telemetry Metrics Row (Confidence, Real Latency, Rate) */}
      <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-[#F0F2F5] dark:border-[#1F2937] text-center">
        <div className="bg-[#F8F9FA] dark:bg-[#1A2230] p-2 rounded-lg">
          <div className="text-[10px] uppercase font-semibold text-[#667085] dark:text-[#9CA3AF]">
            Confidence
          </div>
          <div className="font-mono text-sm font-bold text-[#101828] dark:text-[#F9FAFB] mt-0.5">
            {isConnected && activeGesture !== 'NONE' ? `${activeConfidence.toFixed(1)}%` : '—'}
          </div>
        </div>

        <div className="bg-[#F8F9FA] dark:bg-[#1A2230] p-2 rounded-lg">
          <div className="text-[10px] uppercase font-semibold text-[#667085] dark:text-[#9CA3AF]">
            Measured Latency
          </div>
          <div className="font-mono text-sm font-bold text-[#0E7490] dark:text-[#14B8A6] mt-0.5">
            {isConnected ? `${realLatencyMs.toFixed(1)} ms` : '—'}
          </div>
        </div>

        <div className="bg-[#F8F9FA] dark:bg-[#1A2230] p-2 rounded-lg">
          <div className="text-[10px] uppercase font-semibold text-[#667085] dark:text-[#9CA3AF]">
            TTS Cooldown
          </div>
          <div className="font-mono text-sm font-bold text-[#101828] dark:text-[#F9FAFB] mt-0.5">
            1.5 s Guard
          </div>
        </div>
      </div>
    </div>
  );
};
