'use client';

import React, { useState } from 'react';
import { Volume2, RotateCcw, Trash2, Copy, Check, Sparkles, Bot, Loader2 } from 'lucide-react';
import { useGestureStore } from '@/store/gestureStore';
import { ttsService } from '@/services/ttsService';
import { geminiService } from '@/services/geminiService';

export const SentenceBuilder: React.FC = () => {
  const { phraseTokens, undoPhraseToken, clearPhraseTokens, isSpeaking, setSpeaking } = useGestureStore();
  const [copied, setCopied] = useState(false);
  const [isAiRefining, setIsAiRefining] = useState(false);
  const [refinedText, setRefinedText] = useState<string | null>(null);

  const rawSentence = phraseTokens.map(t => t.word).join(' ');
  const displaySentence = refinedText || rawSentence;

  const handleSpeakSentence = () => {
    if (!displaySentence) return;
    setSpeaking(true);
    ttsService.speak(displaySentence);
    setTimeout(() => setSpeaking(false), 2500);
  };

  const handleCopySentence = () => {
    if (!displaySentence) return;
    navigator.clipboard.writeText(displaySentence);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleGeminiRefine = async () => {
    if (phraseTokens.length === 0) return;
    setIsAiRefining(true);
    try {
      const words = phraseTokens.map(t => t.word);
      const refined = await geminiService.refineSentence(words);
      setRefinedText(refined);
      setSpeaking(true);
      ttsService.speak(refined);
      setTimeout(() => setSpeaking(false), 3000);
    } catch {
      // fallback
    } finally {
      setIsAiRefining(false);
    }
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
        <div className="flex items-center gap-2 text-[10px] font-mono text-[#00f0ff]">
          <span className="px-2 py-0.5 rounded bg-[#00f0ff]/10 border border-[#00f0ff]/30 text-[#00f0ff]">
            GOOGLE AI STUDIO GEMINI 1.5 ACTIVE
          </span>
          <span>{phraseTokens.length} TOKENS</span>
        </div>
      </div>

      {/* Floating Word Tokens Display Bar */}
      <div className="min-h-[64px] p-4 rounded-2xl bg-[#030712] border border-white/15 space-y-3">
        <div className="flex flex-wrap items-center gap-3">
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

        {/* Refined Sentence Output Box if AI refined */}
        {refinedText && (
          <div className="p-3 rounded-xl bg-[#00f0ff]/10 border border-[#00f0ff]/40 flex items-center justify-between text-xs text-[#00f0ff] font-inter animate-fadeIn">
            <span className="flex items-center gap-2">
              <Bot className="w-4 h-4 text-[#00f0ff]" />
              <strong>Gemini AI Refined Sentence:</strong> &quot;{refinedText}&quot;
            </span>
            <button
              onClick={() => setRefinedText(null)}
              className="text-[10px] font-orbitron text-[#94a3b8] hover:text-white underline uppercase"
            >
              Reset
            </button>
          </div>
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
            onClick={() => {
              clearPhraseTokens();
              setRefinedText(null);
            }}
            disabled={phraseTokens.length === 0}
            className="btn-danger !py-2 !px-3 text-xs font-rajdhani font-bold flex items-center gap-1.5 disabled:opacity-40"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>CLEAR</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          {/* GOOGLE AI STUDIO GEMINI REFINE BUTTON */}
          <button
            onClick={handleGeminiRefine}
            disabled={phraseTokens.length === 0 || isAiRefining}
            className="btn-outline !py-2 !px-4 text-xs font-rajdhani font-bold flex items-center gap-2 border-[#8b5cf6] text-[#8b5cf6] hover:bg-[#8b5cf6]/20 disabled:opacity-40 shadow-[0_0_15px_rgba(139,92,246,0.3)]"
          >
            {isAiRefining ? <Loader2 className="w-4 h-4 animate-spin text-[#8b5cf6]" /> : <Bot className="w-4 h-4 text-[#8b5cf6]" />}
            <span>{isAiRefining ? 'AI SYNTHESIZING...' : 'AI REFINE (GEMINI)'}</span>
          </button>

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
