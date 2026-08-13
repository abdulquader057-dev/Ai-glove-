'use client';

import React, { useEffect, useState } from 'react';

export const BackgroundCanvas: React.FC = () => {
  const [particles, setParticles] = useState<Array<{ id: number; left: number; delay: number; duration: number; size: number }>>([]);

  useEffect(() => {
    // Generate 25 floating particle positions
    const arr = Array.from({ length: 25 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 8,
      duration: 10 + Math.random() * 14,
      size: 2 + Math.random() * 4,
    }));
    setParticles(arr);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-[#030712]">
      {/* 1. Animated Drifting Grid Lines */}
      <div 
        className="absolute inset-0 bg-grid-pattern opacity-100 animate-grid-drift"
        style={{
          maskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%)',
        }}
      />

      {/* 2. Large Centered Radial Cyan Glow (Pulsing 4s cycle) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] rounded-full bg-radial-glow animate-pulse-radial opacity-80 pointer-events-none blur-3xl" />

      {/* 3. Floating Cyan Particles (20-30 upward dots) */}
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full bg-[#00f0ff] animate-particle-float opacity-0 shadow-[0_0_8px_#00f0ff]"
          style={{
            left: `${p.left}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
          }}
        />
      ))}

      {/* Subtle top/bottom edge vignette */}
      <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[#030712] to-transparent pointer-events-none" />
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#030712] to-transparent pointer-events-none" />
    </div>
  );
};
