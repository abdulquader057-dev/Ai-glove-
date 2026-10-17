// Live Sensor Channels, Rolling Oscilloscope & Session History for SIGNOVA
// Assistive Device Medical Interface
// Displays 3 live ADC channels, 50Hz canvas oscilloscope strip,
// and chronological gesture vocalization log with CSV/JSON export.

'use client';

import React, { useEffect, useRef } from 'react';
import { useSignovaStore } from '@/store/signovaStore';
import { SENSOR_NAMES } from '@/config/signova.config';

export const SensorChannels: React.FC = () => {
  const {
    rawSensors,
    normalizedSensors,
    binaryBits,
    calibration,
    connectionStatus,
    autoCalibrateRestPose,
    history,
    clearHistory,
    exportHistoryCSV,
    exportHistoryJSON,
  } = useSignovaStore();

  const isConnected = connectionStatus === 'connected';

  // Rolling Oscilloscope Canvas
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const bufferRef = useRef<{ c0: number[]; c1: number[]; c2: number[] }>({
    c0: new Array(120).fill(50),
    c1: new Array(120).fill(50),
    c2: new Array(120).fill(50),
  });

  // Push new normalized points into rolling buffer on update
  useEffect(() => {
    const buf = bufferRef.current;
    buf.c0.push(normalizedSensors[0] ?? 0);
    buf.c1.push(normalizedSensors[1] ?? 0);
    buf.c2.push(normalizedSensors[2] ?? 0);
    if (buf.c0.length > 120) buf.c0.shift();
    if (buf.c1.length > 120) buf.c1.shift();
    if (buf.c2.length > 120) buf.c2.shift();

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;

    // Clear canvas
    ctx.clearRect(0, 0, w, h);

    // Draw clinical hairline grid
    ctx.strokeStyle = 'rgba(228, 231, 236, 0.6)';
    ctx.lineWidth = 1;

    // Horizontal threshold mid-line
    ctx.beginPath();
    ctx.moveTo(0, h / 2);
    ctx.lineTo(w, h / 2);
    ctx.stroke();

    // Top and bottom margin guides
    ctx.strokeStyle = 'rgba(228, 231, 236, 0.3)';
    ctx.beginPath();
    ctx.moveTo(0, h * 0.15);
    ctx.lineTo(w, h * 0.15);
    ctx.moveTo(0, h * 0.85);
    ctx.lineTo(w, h * 0.85);
    ctx.stroke();

    const len = buf.c0.length;
    const step = w / (len - 1);

    const drawChannel = (arr: number[], color: string) => {
      ctx.strokeStyle = color;
      ctx.lineWidth = 1.75;
      ctx.beginPath();
      arr.forEach((val, i) => {
        // val is 0.0 (straight) to 1.0 (bent)
        // Invert Y so 1.0 is top (high bend)
        const y = h - (val * (h - 16) + 8);
        const x = i * step;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.stroke();
    };

    drawChannel(buf.c0, '#0E7490'); // Teal - Index
    drawChannel(buf.c1, '#2563EB'); // Blue - Middle
    drawChannel(buf.c2, '#7C3AED'); // Violet - Ring
  }, [normalizedSensors]);

  return (
    <div className="flex flex-col gap-4 font-mono">
      {/* 1. Flex Sensor Channels */}
      <div className="bg-[#0E1218] rounded-xl border border-[#1F2733] p-4 shadow-xl">
        <div className="flex items-center justify-between pb-2.5 border-b border-[#1F2733]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#2EE6A6]"></span>
            <h2 className="text-xs font-bold uppercase tracking-wider text-white">
              Flex Channels
            </h2>
          </div>
          <span className="text-[10px] font-mono text-[#2EE6A6] font-bold">
            Auto-Adaptive
          </span>
        </div>

        {/* Quick Zero Flat Hand Action */}
        <div className="mt-2.5 pb-2.5 border-b border-[#1F2733] flex items-center justify-between">
          <span className="text-[10px] text-[#9CA3AF]">
            Current Hand Pose:
          </span>
          <button
            onClick={autoCalibrateRestPose}
            title="Set current hand posture as Straight (0) baseline"
            className="px-2.5 py-1 rounded bg-[#2EE6A6]/15 hover:bg-[#2EE6A6]/30 border border-[#2EE6A6]/40 text-[#2EE6A6] text-[10px] font-bold flex items-center gap-1 transition-all hover:scale-105 cursor-pointer"
          >
            <span>⚡ Zero Flat Hand</span>
          </button>
        </div>

        {/* 3 Finger Channel Meters */}
        <div className="mt-2.5 space-y-3">
          {SENSOR_NAMES.map((name, idx) => {
            const raw = rawSensors[idx] ?? 0;
            const norm = normalizedSensors[idx] ?? 0;
            const isBent = binaryBits[idx] === 1;
            const thresh = calibration.thresholds[idx] ?? 512;
            const channelColor = idx === 0 ? '#2EE6A6' : idx === 1 ? '#38BDF8' : '#A78BFA';

            return (
              <div key={name} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5">
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: channelColor }}
                    />
                    <span className="font-semibold text-white">{name}</span>
                  </div>
                  <div className="flex items-center gap-2 font-mono text-[11px]">
                    <span className="text-[#9CA3AF]">
                      {isConnected ? raw : '—'}
                    </span>
                    <span
                      className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                        isBent
                          ? 'bg-[#F59E0B]/20 text-[#F59E0B] border border-[#F59E0B]/50'
                          : 'bg-[#141922] text-[#9CA3AF] border border-[#1F2733]'
                      }`}
                    >
                      {isBent ? 'BENT (1)' : 'STR (0)'}
                    </span>
                  </div>
                </div>

                {/* Meter Bar with Midpoint Threshold Marker */}
                <div className="relative w-full h-3 bg-[#141922] border border-[#1F2733] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-100 ease-out"
                    style={{
                      width: `${Math.round(norm * 100)}%`,
                      backgroundColor: channelColor,
                      boxShadow: isBent ? `0 0 10px ${channelColor}` : 'none',
                    }}
                  />
                  {/* Midpoint marker at 50% */}
                  <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-yellow-400 opacity-60" />
                </div>

                <div className="flex justify-between text-[10px] text-[#6B7280] font-mono px-0.5">
                  <span>Str: {calibration.straight[idx]}</span>
                  <span className="text-yellow-400/80">Thresh: {thresh}</span>
                  <span>Bnt: {calibration.bent[idx]}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Rolling Oscilloscope Strip */}
      <div className="bg-[#0E1218] rounded-xl border border-[#1F2733] p-4 shadow-xl">
        <div className="flex items-center justify-between pb-2 border-b border-[#1F2733]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#38BDF8]"></span>
            <h2 className="text-xs font-bold uppercase tracking-wider text-white">
              Signal Stream
            </h2>
          </div>
          <div className="flex items-center gap-2 text-[10px] font-mono">
            <span className="text-[#2EE6A6]">● F1</span>
            <span className="text-[#38BDF8]">● F2</span>
            <span className="text-[#A78BFA]">● F3</span>
          </div>
        </div>

        <div className="mt-2 w-full h-24 bg-[#07090D] rounded-lg overflow-hidden border border-[#1F2733] relative">
          <canvas
            ref={canvasRef}
            width={320}
            height={96}
            className="w-full h-full block"
          />
          {!isConnected && (
            <div className="absolute inset-0 flex items-center justify-center text-[11px] text-[#6B7280]">
              Waiting for stream…
            </div>
          )}
        </div>
      </div>

      {/* 3. Session Vocalization History Log */}
      <div className="bg-[#0E1218] rounded-xl border border-[#1F2733] p-4 shadow-xl">
        <div className="flex items-center justify-between pb-2.5 border-b border-[#1F2733]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#2EE6A6]"></span>
            <h2 className="text-xs font-bold uppercase tracking-wider text-white">
              Vocalization Log
            </h2>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={exportHistoryCSV}
              disabled={history.length === 0}
              className="text-[10px] px-2 py-0.5 rounded border border-[#1F2733] bg-[#141922] hover:bg-[#1E2533] disabled:opacity-40 text-[#D1D5DB] cursor-pointer"
              title="Export as CSV"
            >
              CSV
            </button>
            <button
              onClick={exportHistoryJSON}
              disabled={history.length === 0}
              className="text-[10px] px-2 py-0.5 rounded border border-[#1F2733] bg-[#141922] hover:bg-[#1E2533] disabled:opacity-40 text-[#D1D5DB] cursor-pointer"
              title="Export as JSON"
            >
              JSON
            </button>
            <button
              onClick={clearHistory}
              disabled={history.length === 0}
              className="text-[10px] px-1.5 py-0.5 rounded text-[#EF4444] hover:bg-[#EF4444]/20 disabled:opacity-40 cursor-pointer"
              title="Clear Log"
            >
              Clear
            </button>
          </div>
        </div>

        {/* History Item List */}
        <div className="mt-2 space-y-1.5 max-h-56 overflow-y-auto pr-1">
          {history.length === 0 ? (
            <div className="py-6 text-center text-xs text-[#6B7280]">
              No gestures vocalized yet this session.
            </div>
          ) : (
            history.map((item) => (
              <div
                key={item.id}
                className="p-2 rounded-lg bg-[#141922] border border-[#1F2733] flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-2">
                  <span className="font-bold text-[#2EE6A6]">
                    {item.label}
                  </span>
                  <span className="font-mono text-[10px] text-[#9CA3AF]">
                    [{item.binaryString}]
                  </span>
                </div>

                <div className="flex items-center gap-2 font-mono text-[10px] text-[#9CA3AF]">
                  <span className="text-[#38BDF8] font-bold">
                    {item.latencyMs}ms
                  </span>
                  <span>·</span>
                  <span>{item.timeString.split('.')[0]}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
