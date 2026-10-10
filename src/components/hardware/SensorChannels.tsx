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
    <div className="flex flex-col gap-4">
      {/* 1. Flex Sensor Channels */}
      <div className="bg-white dark:bg-[#111827] rounded-xl border border-[#E4E7EC] dark:border-[#1F2937] p-4 shadow-card">
        <div className="flex items-center justify-between pb-2.5 border-b border-[#F0F2F5] dark:border-[#1F2937]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#0E7490]"></span>
            <h2 className="text-xs font-semibold uppercase tracking-wider text-[#344054] dark:text-[#E5E7EB]">
              Flex Channels
            </h2>
          </div>
          <span className="text-[10px] font-mono text-[#0E7490] dark:text-[#38BDF8] font-semibold">
            Auto-Adaptive
          </span>
        </div>

        {/* Quick Zero Flat Hand Action */}
        <div className="mt-2.5 pb-2.5 border-b border-[#F0F2F5] dark:border-[#1F2937] flex items-center justify-between">
          <span className="text-[10px] text-[#667085] dark:text-[#9CA3AF]">
            Current Hand Pose:
          </span>
          <button
            onClick={autoCalibrateRestPose}
            title="Set current hand posture as Straight (0) baseline"
            className="px-2.5 py-1 rounded bg-[#E0F2FE] hover:bg-[#BAE6FD] dark:bg-[#0E7490]/30 dark:hover:bg-[#0E7490]/50 text-[#0E7490] dark:text-[#38BDF8] text-[10px] font-bold flex items-center gap-1 transition-all hover:scale-105"
          >
            <span>⚡ Zero Flat Hand</span>
          </button>
        </div>

        {/* 3 Finger Channel Meters */}
        <div className="mt-2.5 space-y-2.5">
          {SENSOR_NAMES.map((name, idx) => {
            const raw = rawSensors[idx] ?? 0;
            const norm = normalizedSensors[idx] ?? 0;
            const isBent = binaryBits[idx] === 1;
            const thresh = calibration.thresholds[idx] ?? 512;
            const channelColor = idx === 0 ? '#0E7490' : idx === 1 ? '#2563EB' : '#7C3AED';

            return (
              <div key={name} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5">
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: channelColor }}
                    />
                    <span className="font-medium text-[#101828] dark:text-[#F9FAFB]">{name}</span>
                  </div>
                  <div className="flex items-center gap-2 font-mono text-[11px]">
                    <span className="text-[#667085] dark:text-[#9CA3AF]">
                      {isConnected ? raw : '—'}
                    </span>
                    <span
                      className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                        isBent
                          ? 'bg-[#FEF3C7] dark:bg-[#78350F]/50 text-[#B45309] dark:text-[#FDE68A]'
                          : 'bg-[#F0F2F5] dark:bg-[#1F2937] text-[#475467] dark:text-[#9CA3AF]'
                      }`}
                    >
                      {isBent ? 'BENT (1)' : 'STR (0)'}
                    </span>
                  </div>
                </div>

                {/* Meter Bar with Midpoint Threshold Marker */}
                <div className="relative w-full h-2.5 bg-[#F0F2F5] dark:bg-[#1F2937] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-100 ease-out"
                    style={{
                      width: `${Math.round(norm * 100)}%`,
                      backgroundColor: channelColor,
                    }}
                  />
                  {/* Midpoint marker at 50% */}
                  <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-[#98A2B3] opacity-40" />
                </div>

                <div className="flex justify-between text-[10px] text-[#98A2B3] dark:text-[#64748B] font-mono px-0.5">
                  <span>Str: {calibration.straight[idx]}</span>
                  <span>Thresh: {thresh}</span>
                  <span>Bnt: {calibration.bent[idx]}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Rolling Oscilloscope Strip */}
      <div className="bg-white dark:bg-[#111827] rounded-xl border border-[#E4E7EC] dark:border-[#1F2937] p-4 shadow-card">
        <div className="flex items-center justify-between pb-2 border-b border-[#F0F2F5] dark:border-[#1F2937]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#2563EB]"></span>
            <h2 className="text-xs font-semibold uppercase tracking-wider text-[#344054] dark:text-[#E5E7EB]">
              Signal Stream
            </h2>
          </div>
          <div className="flex items-center gap-2 text-[10px] font-mono text-[#667085] dark:text-[#9CA3AF]">
            <span className="text-[#0E7490]">● F1</span>
            <span className="text-[#2563EB]">● F2</span>
            <span className="text-[#7C3AED]">● F3</span>
          </div>
        </div>

        <div className="mt-2 w-full h-24 bg-[#F8F9FA] dark:bg-[#141C2B] rounded-lg overflow-hidden border border-[#E4E7EC] dark:border-[#1F2937] relative">
          <canvas
            ref={canvasRef}
            width={320}
            height={96}
            className="w-full h-full block"
          />
          {!isConnected && (
            <div className="absolute inset-0 flex items-center justify-center text-[11px] text-[#98A2B3]">
              Waiting for stream…
            </div>
          )}
        </div>
      </div>

      {/* 3. Session Vocalization History Log */}
      <div className="bg-white dark:bg-[#111827] rounded-xl border border-[#E4E7EC] dark:border-[#1F2937] p-4 shadow-card">
        <div className="flex items-center justify-between pb-2.5 border-b border-[#F0F2F5] dark:border-[#1F2937]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#12B76A]"></span>
            <h2 className="text-xs font-semibold uppercase tracking-wider text-[#344054] dark:text-[#E5E7EB]">
              Vocalization Log
            </h2>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={exportHistoryCSV}
              disabled={history.length === 0}
              className="text-[10px] px-2 py-0.5 rounded border border-[#D0D5DD] dark:border-[#374151] hover:bg-[#F2F4F7] dark:hover:bg-[#1F2937] disabled:opacity-40 text-[#344054] dark:text-[#E5E7EB]"
              title="Export as CSV"
            >
              CSV
            </button>
            <button
              onClick={exportHistoryJSON}
              disabled={history.length === 0}
              className="text-[10px] px-2 py-0.5 rounded border border-[#D0D5DD] dark:border-[#374151] hover:bg-[#F2F4F7] dark:hover:bg-[#1F2937] disabled:opacity-40 text-[#344054] dark:text-[#E5E7EB]"
              title="Export as JSON"
            >
              JSON
            </button>
            <button
              onClick={clearHistory}
              disabled={history.length === 0}
              className="text-[10px] px-1.5 py-0.5 rounded text-[#D92D20] hover:bg-[#FEE4E2] dark:hover:bg-[#7F1D1D]/30 disabled:opacity-40"
              title="Clear Log"
            >
              Clear
            </button>
          </div>
        </div>

        {/* History Item List */}
        <div className="mt-2 space-y-1.5 max-h-56 overflow-y-auto pr-1">
          {history.length === 0 ? (
            <div className="py-6 text-center text-xs text-[#98A2B3] dark:text-[#64748B]">
              No gestures vocalized yet this session.
            </div>
          ) : (
            history.map((item) => (
              <div
                key={item.id}
                className="p-2 rounded-lg bg-[#F9FAFB] dark:bg-[#1A2230] border border-[#F2F4F7] dark:border-[#242F42] flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-2">
                  <span className="font-bold text-[#101828] dark:text-[#F9FAFB]">
                    {item.label}
                  </span>
                  <span className="font-mono text-[10px] text-[#667085] dark:text-[#9CA3AF]">
                    [{item.binaryString}]
                  </span>
                </div>

                <div className="flex items-center gap-2 font-mono text-[10px] text-[#667085] dark:text-[#9CA3AF]">
                  <span className="text-[#0E7490] dark:text-[#14B8A6] font-semibold">
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
