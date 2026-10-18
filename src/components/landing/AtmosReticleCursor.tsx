// ATMOS Interactive 3D Cybernetic Reticle Cursor
// Replicates the precision HUD target lens from atmos-bits.com with spring-damped tracking,
// dynamic magnetic hover expansion, crosshairs, and rotation ticks.

'use client';

import React, { useEffect, useState, useRef } from 'react';

export const AtmosReticleCursor: React.FC = () => {
  const [enabled, setEnabled] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [hoveredType, setHoveredType] = useState<'button' | 'card' | 'link' | null>(null);
  
  const mousePos = useRef({ x: -100, y: -100 });
  const reticlePos = useRef({ x: -100, y: -100 });
  const dotRef = useRef<HTMLDivElement | null>(null);
  const ringRef = useRef<HTMLDivElement | null>(null);
  const animFrameRef = useRef<number | null>(null);

  useEffect(() => {
    // Only enable on desktop pointer devices
    if (typeof window === 'undefined') return;
    const isFinePointer = window.matchMedia('(pointer: fine)').matches;
    if (!isFinePointer) return;

    setEnabled(true);
    document.documentElement.classList.add('has-reticle');

    const onMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };

      // Update immediate center laser dot
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      }

      // Check if hovering over interactive elements
      const target = e.target as HTMLElement | null;
      if (target) {
        const interactive = target.closest('button, a, [role="button"], input, .atmos-tilt-card, .interactive-hover');
        if (interactive) {
          setHovered(true);
          if (interactive.tagName === 'BUTTON' || interactive.getAttribute('role') === 'button') {
            setHoveredType('button');
          } else if (interactive.classList.contains('atmos-tilt-card')) {
            setHoveredType('card');
          } else {
            setHoveredType('link');
          }
        } else {
          setHovered(false);
          setHoveredType(null);
        }
      }
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });

    // Smooth lerp loop for the trailing outer reticle ring
    const render = () => {
      const target = mousePos.current;
      const current = reticlePos.current;

      current.x += (target.x - current.x) * 0.18;
      current.y += (target.y - current.y) * 0.18;

      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${current.x}px, ${current.y}px, 0)`;
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      document.documentElement.classList.remove('has-reticle');
      window.removeEventListener('mousemove', onMouseMove);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  if (!enabled) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
      {/* 1. Laser Center Dot (Zero Lag) */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 w-2 h-2 -ml-1 -mt-1 rounded-full bg-[#00F2A6] pointer-events-none shadow-[0_0_10px_#00F2A6] transition-transform duration-75 ease-out"
        style={{ willChange: 'transform' }}
      />

      {/* 2. Trailing Outer Reticle Ring with Crosshairs & Brackets */}
      <div
        ref={ringRef}
        className={`fixed top-0 left-0 pointer-events-none transition-all duration-200 ease-out flex items-center justify-center ${
          hovered
            ? hoveredType === 'button'
              ? 'w-14 h-14 -ml-7 -mt-7'
              : 'w-16 h-16 -ml-8 -mt-8'
            : 'w-8 h-8 -ml-4 -mt-4'
        }`}
        style={{ willChange: 'transform' }}
      >
        {/* Outer Ring */}
        <div
          className={`w-full h-full rounded-full border transition-all duration-300 ${
            hovered
              ? 'border-[#00F2A6] bg-[#00F2A6]/[0.08] shadow-[0_0_20px_rgba(0,242,166,0.5)] scale-110'
              : 'border-white/30 border-dashed animate-spin-slow'
          }`}
        />

        {/* 4 Cardinal Crosshair Ticks */}
        {!hovered && (
          <>
            <div className="absolute top-0 w-[1px] h-1.5 bg-[#00F2A6]" />
            <div className="absolute bottom-0 w-[1px] h-1.5 bg-[#00F2A6]" />
            <div className="absolute left-0 h-[1px] w-1.5 bg-[#00F2A6]" />
            <div className="absolute right-0 h-[1px] w-1.5 bg-[#00F2A6]" />
          </>
        )}

        {/* Dynamic Targeting Brackets on Hover */}
        {hovered && (
          <>
            <span className="absolute -top-1 -left-1 text-[10px] text-[#00F2A6] font-mono leading-none font-bold">┌</span>
            <span className="absolute -top-1 -right-1 text-[10px] text-[#00F2A6] font-mono leading-none font-bold">┐</span>
            <span className="absolute -bottom-1 -left-1 text-[10px] text-[#00F2A6] font-mono leading-none font-bold">└</span>
            <span className="absolute -bottom-1 -right-1 text-[10px] text-[#00F2A6] font-mono leading-none font-bold">┘</span>
          </>
        )}
      </div>
    </div>
  );
};

export default AtmosReticleCursor;
