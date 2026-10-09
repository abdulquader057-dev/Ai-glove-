// High-Performance 50Hz Scrolling Oscilloscope Canvas
// Team Syntropy - SIGNOVA
// Renders rolling waveforms of the 3 flex sensor channels in real-time.

'use client';

import React, { useRef, useEffect } from 'react';

interface OscilloscopeCanvasProps {
  smoothedSensors: number[];
  height?: number;
}

export const OscilloscopeCanvas: React.FC<OscilloscopeCanvasProps> = ({
  smoothedSensors,
  height = 140,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  // Store rolling history: 200 samples (~4 seconds at 50Hz)
  const historyRef = useRef<number[][]>([]);
  const maxSamples = 180;

  useEffect(() => {
    if (smoothedSensors && smoothedSensors.length >= 3) {
      historyRef.current.push([...smoothedSensors]);
      if (historyRef.current.length > maxSamples) {
        historyRef.current.shift();
      }
    }
  }, [smoothedSensors]);

  useEffect(() => {
    let animId: number;

    const render = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const width = canvas.width;
      const h = canvas.height;

      // 1. Clear background
      ctx.fillStyle = '#0A0D10';
      ctx.fillRect(0, 0, width, h);

      // 2. Draw instrument grid lines
      ctx.lineWidth = 1;
      ctx.strokeStyle = '#161B22';

      // Horizontal reference lines (250, 500, 750 ADC marks)
      const adcMarks = [250, 500, 750];
      ctx.font = '9px monospace';
      ctx.fillStyle = '#4B5563';

      adcMarks.forEach((mark) => {
        const y = h - (mark / 1023) * h;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();

        ctx.fillText(`${mark}`, 6, y - 2);
      });

      // Vertical time grid lines (every 30px)
      for (let x = 0; x < width; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }

      const history = historyRef.current;
      if (history.length < 2) {
        animId = requestAnimationFrame(render);
        return;
      }

      // 3. Render 3 channel waveforms
      const colors = ['#2EE6A6', '#38BDF8', '#A78BFA'];
      const stepX = width / (maxSamples - 1);

      for (let ch = 0; ch < 3; ch++) {
        ctx.strokeStyle = colors[ch];
        ctx.lineWidth = 1.5;
        ctx.beginPath();

        const startIndex = maxSamples - history.length;

        for (let i = 0; i < history.length; i++) {
          const val = history[i][ch] ?? 0;
          // Clamp val between 0 and 1023
          const clamped = Math.max(0, Math.min(1023, val));
          const x = (startIndex + i) * stepX;
          const y = h - (clamped / 1023) * (h - 10) - 5;

          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }

        ctx.stroke();
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <div className="w-full bg-[#0A0D10] border border-[#1F242A] p-3 rounded-sm flex flex-col gap-2 font-mono">
      <div className="flex items-center justify-between text-xs pb-1 border-b border-[#1F242A]">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#2EE6A6] animate-pulse" />
          <span className="text-[#9CA3AF] font-bold">50Hz ROLLING OSCILLOSCOPE</span>
        </div>
        <div className="flex items-center gap-3 text-[10px]">
          <span className="text-[#2EE6A6] flex items-center gap-1">
            <span className="inline-block w-2 h-0.5 bg-[#2EE6A6]" /> CH1 INDEX
          </span>
          <span className="text-[#38BDF8] flex items-center gap-1">
            <span className="inline-block w-2 h-0.5 bg-[#38BDF8]" /> CH2 MIDDLE
          </span>
          <span className="text-[#A78BFA] flex items-center gap-1">
            <span className="inline-block w-2 h-0.5 bg-[#A78BFA]" /> CH3 RING
          </span>
        </div>
      </div>

      <div
        className="relative w-full bg-[#07090B] border border-[#161B22] rounded-xs overflow-hidden"
        style={{ height: `${height}px` }}
      >
        <canvas
          ref={canvasRef}
          width={600}
          height={height}
          className="w-full h-full block"
        />
        <div className="absolute right-2 bottom-1 text-[9px] text-[#4B5563]">
          WINDOW: ~3.6s @ 50Hz
        </div>
      </div>
    </div>
  );
};

export default OscilloscopeCanvas;
