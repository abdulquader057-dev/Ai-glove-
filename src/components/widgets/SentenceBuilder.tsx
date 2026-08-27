'use client';

import React, { useState } from 'react';
import { Volume2, RotateCcw, Trash2, Copy, Check, Sparkles } from 'lucide-react';
import { useGestureStore } from '@/store/gestureStore';
import { ttsService } from '@/services/ttsService';

export const SentenceBuilder: React.FC = () => {
  const { phraseTokens, undoPhraseToken, clearPhraseTokens, isSpeaking, setSpeaking } = useGestureStore();
  const [copied, setCopied] = useState(false);

  const fullSentence = phraseTokens.map(t => t.word).join(' ');

  const handleSpeakSentence = () => {
    if (!fullSentence) return;
    setSpeaking(true);
    ttsService.speak(fullSentence);
    setTimeout(() => setSpeaking(false), 2500);
  };

  const handleCopySentence = () => {
    if (!fullSentence) return;
    navigator.clipboard.writeText(fullSentence);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="glass-card p-6 border-[#00f0ff]/40 bg-gradient-to-r from-[#0a0f1e] via-[#030712] to-[#0a0f1e] space-y-4 shadow-[0_0_30px_rgba(0,240,255,0.15)]">
      
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#00f0ff] animate-pulse" />
          <h3 className="font-orbitron font-bold text-xs text-white uppercase tracking-wider">
            CURRENT SENTENCE PHRASE BUILDER
          </h3>
        </div>
        <span className="text-[10px] font-mono text-[#00f0ff]">
          {phraseTokens.length} WORD TOKENS
        </span>
      </div>

      {/* Floating Word Tokens Display Bar */}
      <div className="min-h-[64px] p-4 rounded-2xl bg-[#030712] border border-white/15 flex flex-wrap items-center gap-3">
        {phraseTokens.length === 0 ? (
          <span className="text-xs text-[#94a3b8] font-inter italic">
            Perform gestures to build floating sentence tokens here...
          </span>
        ) : (
          phraseTokens.map((token, idx) => (
            <div
              key={token.id}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#00f0ff]/20 to-[#8b5cf6]/20 border border-[#00f0ff]/60 text-white font-orbitron font-extrabold text-sm tracking-wider shadow-[0_0_15px_rgba(0,240,255,0.3)] animate-fadeIn"
            >
              <span>{token.word}</span>
              {idx < phraseTokens.length - 1 && (
                <span className="text-[#00f0ff] font-normal opacity-60 ml-1">•</span>
              )}
            </div>
          ))
        )}
      </div>

      {/* Sentence Controls Row */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
        <div className="flex items-center gap-2">
          <button
            onClick={undoPhraseToken}
            disabled={phraseTokens.length === 0}
            className="btn-outline !py-2 !px-3 text-xs font-rajdhani font-bold flex items-center gap-1.5 disabled:opacity-40"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>UNDO</span>
          </button>

          <button
            onClick={clearPhraseTokens}
            disabled={phraseTokens.length === 0}
            className="btn-danger !py-2 !px-3 text-xs font-rajdhani font-bold flex items-center gap-1.5 disabled:opacity-40"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>CLEAR</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopySentence}
            disabled={phraseTokens.length === 0}
            className="btn-outline !py-2 !px-3 text-xs font-rajdhani font-bold flex items-center gap-1.5 disabled:opacity-40"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-[#10b981]" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'COPIED' : 'COPY'}</span>
          </button>

          <button
            onClick={handleSpeakSentence}
            disabled={phraseTokens.length === 0}
            className="btn-primary !py-2 !px-5 text-xs font-rajdhani font-bold flex items-center gap-2 disabled:opacity-40"
          >
            <Volume2 className={`w-4 h-4 ${isSpeaking ? 'animate-bounce' : ''}`} />
            <span>{isSpeaking ? 'SPEAKING...' : 'SPEAK PHRASE'}</span>
          </button>
        </div>
      </div>

    </div>
  );
};
