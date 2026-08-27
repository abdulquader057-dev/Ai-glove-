'use client';

import React from 'react';
import { useGestureStore } from '@/store/gestureStore';
import { GestureItem } from '@/types';
import { Plus } from 'lucide-react';

export const GestureLibraryGrid: React.FC = () => {
  const { gestures, activeGesture, setActiveGesture, addTokenToPhrase } = useGestureStore();

  const handleSelectGesture = (g: GestureItem) => {
    setActiveGesture(g, 96.5, 12);
    addTokenToPhrase(g.mappedPhrase, 96.5);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div>
          <h3 className="font-orbitron font-bold text-lg text-white">GESTURE DICTIONARY LIBRARY</h3>
          <p className="text-xs text-[#94a3b8] font-inter">Click any gesture to trigger active recognition and append token to phrase.</p>
        </div>
        <span className="text-xs font-orbitron text-[#00f0ff]">{gestures.length} GESTURES ACTIVE</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 max-h-[420px] overflow-y-auto pr-2">
        {gestures.map((g) => {
          const isActive = activeGesture?.id === g.id;
          return (
            <div
              key={g.id}
              onClick={() => handleSelectGesture(g)}
              className={`p-4 rounded-2xl border cursor-pointer transition-all duration-300 space-y-3 group ${
                isActive
                  ? 'bg-[#00f0ff]/15 border-[#00f0ff] shadow-[0_0_20px_rgba(0,240,255,0.3)]'
                  : 'bg-[#030712] border-white/10 hover:border-[#00f0ff]/50'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-3xl group-hover:scale-110 transition-transform">{g.emoji}</span>
                <span className="text-[10px] font-orbitron text-[#00f0ff] uppercase bg-[#00f0ff]/10 px-2 py-0.5 rounded">
                  {g.category || 'essential'}
                </span>
              </div>

              <div>
                <h4 className="font-orbitron font-bold text-xs text-white uppercase tracking-wider">{g.name}</h4>
                <p className="text-xs text-[#00f0ff] font-rajdhani font-semibold mt-0.5">&quot;{g.mappedPhrase}&quot;</p>
              </div>

              <p className="text-[10px] text-[#94a3b8] font-inter line-clamp-2">{g.description}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
