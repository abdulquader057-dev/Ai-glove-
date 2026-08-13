'use client';

import React, { useState } from 'react';
import { DEFAULT_GESTURES } from '@/store/gestureStore';
import { ttsService } from '@/services/ttsService';
import { Search, Volume2 } from 'lucide-react';

export const GestureManual: React.FC = () => {
  const [filter, setFilter] = useState('');

  const filtered = DEFAULT_GESTURES.filter((g) =>
    g.name.toLowerCase().includes(filter.toLowerCase()) ||
    g.mappedPhrase.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-fadeIn max-w-7xl mx-auto py-2">
      
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#00f0ff]/20 pb-5">
        <div>
          <span className="px-2.5 py-0.5 rounded bg-[#00f0ff]/20 text-[#00f0ff] font-orbitron text-[10px] tracking-widest uppercase">
            STANDARD DICTIONARY & REFERENCE
          </span>
          <h1 className="font-orbitron font-extrabold text-2xl sm:text-3xl text-gradient-cyan mt-1">
            GESTURE REFERENCE MANUAL
          </h1>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-80">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#00f0ff]">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Search gestures..."
            className="w-full bg-[#0a0f1e] border border-[#00f0ff]/30 focus:border-[#00f0ff] text-white pl-10 pr-4 py-2.5 rounded-xl font-inter text-sm outline-none shadow-sm transition-all"
          />
        </div>
      </div>

      {/* Grid of 12 Gesture Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filtered.map((gesture) => (
          <div
            key={gesture.id}
            onClick={() => ttsService.speak(gesture.mappedPhrase)}
            className="glass-card p-6 flex flex-col justify-between space-y-4 cursor-pointer group hover:-translate-y-1.5 transition-all duration-300 hover:border-[#00f0ff]/60"
          >
            {/* Top Row */}
            <div className="flex items-center justify-between">
              <div className="w-14 h-14 rounded-2xl bg-[#00f0ff]/10 border border-[#00f0ff]/30 flex items-center justify-center text-3xl group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(0,240,255,0.4)] transition-all">
                {gesture.emoji}
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  ttsService.speak(gesture.mappedPhrase);
                }}
                className="p-2 rounded-lg bg-white/5 border border-white/10 text-[#00f0ff] hover:bg-[#00f0ff]/20 transition-all"
                title="Listen to Voice Output"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>

            {/* Title & Description */}
            <div className="space-y-1">
              <h3 className="font-orbitron font-bold text-base text-white tracking-wider group-hover:text-[#00f0ff] transition-colors">
                {gesture.name}
              </h3>
              <p className="text-xs text-[#94a3b8] font-inter italic line-clamp-2">
                &quot;{gesture.mappedPhrase}&quot;
              </p>
            </div>

            {/* Threshold indicator */}
            <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[10px] font-orbitron text-[#94a3b8]">
              <span>QUANTIZED MAPPING</span>
              <span className="text-[#10b981] font-bold">READY</span>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
