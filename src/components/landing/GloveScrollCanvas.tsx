// SIGNOVA - Apple/ATMOS-Style Pinned Scroll HTML5 Canvas
// Team Syntropy
// Preloads all 164 frames from Supabase Storage and binds scroll progress
// directly to high-DPR canvas draw commands with 60fps smoothing.

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

interface GloveScrollCanvasProps {
  progress: number; // 0.0 to 1.0 representing scroll percentage through container
  className?: string;
}

export const GloveScrollCanvas: React.FC<GloveScrollCanvasProps> = ({
  progress,
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imagesRef = useRef<(HTMLImageElement | null)[]>(new Array(TOTAL_FRAMES).fill(null));
  const [loadedCount, setLoadedCount] = useState<number>(0);
  const [isFirstLoaded, setIsFirstLoaded] = useState<boolean>(false);
  const lastDrawnFrameRef = useRef<number>(-1);

  // Render a specific frame index onto the canvas
  const drawFrame = useCallback((frameIdx: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    // Retrieve requested frame, or fallback to the closest available frame
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

    const cw = canvas.width;
    const ch = canvas.height;
    if (cw === 0 || ch === 0) return;

    const iw = img.naturalWidth;
    const ih = img.naturalHeight;

    // Contain scaling centered in canvas
    const scale = Math.min(cw / iw, ch / ih);
    const dw = iw * scale;
    const dh = ih * scale;
    const dx = (cw - dw) / 2;
    const dy = (ch - dh) / 2;

    ctx.clearRect(0, 0, cw, ch);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(img, dx, dy, dw, dh);

    lastDrawnFrameRef.current = frameIdx;
  }, []);

  // Preload frames in prioritized order
  useEffect(() => {
    let active = true;
    let count = 0;

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
          count++;
          setLoadedCount(count);
          if (idx === 0) {
            setIsFirstLoaded(true);
            drawFrame(0);
          }
          resolve();
        };
        img.onerror = () => resolve();
      });
    };

    async function loadAllFrames() {
      // Phase 1: Frame 0 for instant initial paint
      await loadSingle(0);

      // Phase 2: Key stride intervals (every 4th frame)
      const strides: number[] = [];
      for (let i = 1; i < TOTAL_FRAMES; i += 4) {
        strides.push(i);
      }
      await Promise.all(strides.map((idx) => loadSingle(idx)));

      // Phase 3: Fill in remaining frames smoothly
      const remaining: number[] = [];
      for (let i = 0; i < TOTAL_FRAMES; i++) {
        if (!imagesRef.current[i]) remaining.push(i);
      }

      const batchSize = 6;
      for (let i = 0; i < remaining.length; i += batchSize) {
        if (!active) break;
        const chunk = remaining.slice(i, i + batchSize);
        await Promise.all(chunk.map((idx) => loadSingle(idx)));
      }
    }

    loadAllFrames();

    return () => {
      active = false;
    };
  }, [drawFrame]);

  // Handle Resize & DPI Scaling
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const updateSize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      if (rect.width > 0 && rect.height > 0) {
        canvas.width = Math.round(rect.width * dpr);
        canvas.height = Math.round(rect.height * dpr);
        const targetFrame = Math.max(0, Math.min(TOTAL_FRAMES - 1, Math.round(progress * (TOTAL_FRAMES - 1))));
        drawFrame(targetFrame);
      }
    };

    updateSize();

    const resizeObserver = new ResizeObserver(() => {
      updateSize();
    });
    resizeObserver.observe(canvas);

    window.addEventListener('resize', updateSize);
    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', updateSize);
    };
  }, [progress, drawFrame]);

  // Draw active frame index when scroll progress updates
  useEffect(() => {
    const targetFrame = Math.max(0, Math.min(TOTAL_FRAMES - 1, Math.round(progress * (TOTAL_FRAMES - 1))));
    if (targetFrame !== lastDrawnFrameRef.current) {
      drawFrame(targetFrame);
    }
  }, [progress, drawFrame]);

  const loadPercent = Math.min(100, Math.round((loadedCount / TOTAL_FRAMES) * 100));

  return (
    <div className={`relative w-full h-full flex items-center justify-center ${className}`}>
      {/* HTML5 Scrollytelling Canvas */}
      <canvas
        ref={canvasRef}
        width={800}
        height={450}
        className="w-full h-full max-h-[85vh] block object-contain pointer-events-none drop-shadow-[0_0_80px_rgba(0,242,166,0.22)] select-none"
      />

      {/* Loading overlay if initial frame is loading */}
      {!isFirstLoaded && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#05070A]/95 z-20">
          <div className="w-12 h-12 rounded-full border-2 border-[#00F2A6]/20 border-t-[#00F2A6] animate-spin mb-4" />
          <span className="font-mono text-xs text-[#00F2A6] tracking-widest font-bold">
            INITIALIZING ATMOS SCROLL KINEMATICS ({loadPercent}%)
          </span>
        </div>
      )}
    </div>
  );
};

export default GloveScrollCanvas;
