// ATMOS High-DPI Full-Screen Canvas Engine
// Renders the 164-frame AI glove sequence with pristine sharpness, zero blur,
// and right-center viewport alignment.

'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';

const SUPABASE_BASE_URL =
  "https://jhifmcycizwilqwxwqvo.supabase.co/storage/v1/object/public/abdulquader057-dev%27s%20Org/img/";
const TOTAL_FRAMES = 164; // frame_000 to frame_163

export function getFrameUrl(index: number): string {
  const clamped = Math.max(0, Math.min(TOTAL_FRAMES - 1, Math.round(index)));
  const pad = String(clamped).padStart(3, '0');
  return `${SUPABASE_BASE_URL}frame_${pad}_delay-0.042s.webp`;
}

interface AtmosCanvasEngineProps {
  progress: number; // 0.0 to 1.0 from GSAP ScrollTrigger
  opacity?: number;
}

export const AtmosCanvasEngine: React.FC<AtmosCanvasEngineProps> = ({
  progress,
  opacity = 1,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imagesRef = useRef<(HTMLImageElement | null)[]>(new Array(TOTAL_FRAMES).fill(null));
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const lastDrawnFrameRef = useRef<number>(-1);

  // Draw target frame with high-DPI scaling and right-center contain fit
  const drawFrame = useCallback((frameIdx: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    // Retrieve requested frame or nearest loaded fallback
    let img = imagesRef.current[frameIdx];
    if (!img || !img.complete || img.naturalWidth === 0) {
      let closestDist = Infinity;
      let closestIdx = -1;
      for (let i = 0; i < TOTAL_FRAMES; i++) {
        const candidate = imagesRef.current[i];
        if (candidate && candidate.complete && candidate.naturalWidth > 0) {
          const dist = Math.abs(i - frameIdx);
          if (dist < closestDist) {
            closestDist = dist;
            closestIdx = i;
          }
        }
      }
      if (closestIdx !== -1) {
        img = imagesRef.current[closestIdx];
      }
    }

    if (!img || !img.complete || img.naturalWidth === 0) return;

    const W = window.innerWidth;
    const H = window.innerHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    // Clear full bitmap buffer
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.save();
    ctx.scale(dpr, dpr);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    const iw = img.naturalWidth || 800;
    const ih = img.naturalHeight || 450;

    // Full-screen cover scaling so the WebP animation fills 100% of the viewport edge-to-edge
    const scale = Math.max(W / iw, H / ih);
    const dw = iw * scale;
    const dh = ih * scale;
    const dx = (W - dw) / 2;
    const dy = (H - dh) / 2;

    ctx.drawImage(img, dx, dy, dw, dh);

    ctx.restore();
    lastDrawnFrameRef.current = frameIdx;
  }, []);

  // Preload all 164 frames sequentially into an image cache
  useEffect(() => {
    let active = true;

    const loadSingle = (idx: number): Promise<void> => {
      return new Promise((resolve) => {
        if (!active) return resolve();
        if (imagesRef.current[idx]) return resolve();

        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.src = getFrameUrl(idx);
        img.onload = () => {
          if (!active) return resolve();
          imagesRef.current[idx] = img;
          if (idx === 0) {
            setIsLoaded(true);
            drawFrame(0);
          }
          resolve();
        };
        img.onerror = () => resolve();
      });
    };

    async function loadSequence() {
      // Priority 1: Keyframe 0 for immediate paint
      await loadSingle(0);

      // Priority 2: Stride intervals (every 4th frame)
      const strides: number[] = [];
      for (let i = 1; i < TOTAL_FRAMES; i += 4) {
        strides.push(i);
      }
      await Promise.all(strides.map((idx) => loadSingle(idx)));

      // Priority 3: Complete all remaining frames
      const remaining: number[] = [];
      for (let i = 0; i < TOTAL_FRAMES; i++) {
        if (!imagesRef.current[i]) remaining.push(i);
      }

      const chunkSize = 6;
      for (let i = 0; i < remaining.length; i += chunkSize) {
        if (!active) break;
        const chunk = remaining.slice(i, i + chunkSize);
        await Promise.all(chunk.map((idx) => loadSingle(idx)));
      }
    }

    loadSequence();

    return () => {
      active = false;
    };
  }, [drawFrame]);

  // Handle Resize and Retina DPI buffer scaling
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(window.innerWidth * dpr);
      canvas.height = Math.round(window.innerHeight * dpr);

      const targetFrame = Math.max(0, Math.min(TOTAL_FRAMES - 1, Math.round(progress * (TOTAL_FRAMES - 1))));
      drawFrame(targetFrame);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [progress, drawFrame]);

  // Redraw when scroll progress updates
  useEffect(() => {
    const targetFrame = Math.max(0, Math.min(TOTAL_FRAMES - 1, Math.round(progress * (TOTAL_FRAMES - 1))));
    if (targetFrame !== lastDrawnFrameRef.current) {
      drawFrame(targetFrame);
    }
  }, [progress, drawFrame]);

  // Clean fadeout as progress enters 90%-100%
  const effectiveOpacity = progress >= 0.88 ? Math.max(0, 1 - (progress - 0.88) / 0.10) : opacity;

  return (
    <div
      style={{
        opacity: effectiveOpacity,
        transition: 'opacity 0.25s ease-out',
        visibility: effectiveOpacity <= 0.01 ? 'hidden' : 'visible',
      }}
      className="fixed top-0 left-0 w-screen h-screen z-10 pointer-events-none"
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full block pointer-events-none"
      />
    </div>
  );
};

export default AtmosCanvasEngine;
