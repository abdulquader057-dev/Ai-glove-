// 3D Rigged Hand Visualizer & Telemetry Panel
// Team Syntropy - SIGNOVA
// Replaces the vector schematic with Elena FF's Rigged 3D Hand model from Sketchfab
// with enhanced fair skin tone color grading, real-time sensor overlays, and tone tuner.

'use client';

import React, { useState } from 'react';
import { ExternalLink, Sparkles, Sliders, Eye } from 'lucide-react';

interface HandSchematicProps {
  normalizedFingers: number[]; // [index, middle, ring]
  binaryBits: [number, number, number];
  rawSensors: number[];
}

type TonePreset = 'fair_lifelike' | 'fair_porcelain' | 'natural_warm' | 'raw';

export const HandSchematic: React.FC<HandSchematicProps> = ({
  normalizedFingers,
  binaryBits,
  rawSensors,
}) => {
  const normIndex = normalizedFingers[0] ?? 0;
  const normMiddle = normalizedFingers[1] ?? 0;
  const normRing = normalizedFingers[2] ?? 0;

  // Color & Fair skin enhancement controls
  const [tonePreset, setTonePreset] = useState<TonePreset>('fair_lifelike');
  const [customBrightness, setCustomBrightness] = useState<number>(122);
  const [customWarmth, setCustomWarmth] = useState<number>(115);
  const [showToneControls, setShowToneControls] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'3d_model' | 'kinetic_schematic'>('3d_model');

  // Compute CSS filter based on selected preset and sliders
  const getFilterStyle = (): string => {
    if (tonePreset === 'raw') return 'none';
    if (tonePreset === 'fair_porcelain') {
      return 'brightness(1.32) contrast(1.06) saturate(1.1) sepia(0.04)';
    }
    if (tonePreset === 'natural_warm') {
      return 'brightness(1.16) contrast(1.12) saturate(1.28) sepia(0.12)';
    }
    // fair_lifelike (default) uses dynamic sliders
    const b = customBrightness / 100;
    const w = customWarmth / 100;
    return `brightness(${b.toFixed(2)}) contrast(1.08) saturate(${w.toFixed(2)}) sepia(0.06)`;
  };

  // Kinetic schematic calculation for vector mode fallback
  const getFingerPath = (
    baseX: number,
    baseY: number,
    totalLength: number,
    bendRatio: number,
    spreadAngleDeg: number
  ) => {
    const segLen = totalLength / 3;
    const maxCurlPerJoint = 60 * (Math.PI / 180);
    const curl = bendRatio * maxCurlPerJoint;
    const baseAngle = (spreadAngleDeg - 90) * (Math.PI / 180);

    const a1 = baseAngle + curl * 0.4;
    const x1 = baseX + Math.cos(a1) * segLen;
    const y1 = baseY + Math.sin(a1) * segLen;

    const a2 = a1 + curl * 0.8;
    const x2 = x1 + Math.cos(a2) * segLen;
    const y2 = y1 + Math.sin(a2) * segLen;

    const a3 = a2 + curl * 0.9;
    const x3 = x2 + Math.cos(a3) * (segLen * 0.85);
    const y3 = y2 + Math.sin(a3) * (segLen * 0.85);

    return {
      points: [
        { x: baseX, y: baseY },
        { x: x1, y: y1 },
        { x: x2, y: y2 },
        { x: x3, y: y3 },
      ],
      pathString: `M ${baseX} ${baseY} L ${x1.toFixed(1)} ${y1.toFixed(1)} L ${x2.toFixed(1)} ${y2.toFixed(1)} L ${x3.toFixed(1)} ${y3.toFixed(1)}`,
    };
  };

  const indexFinger = getFingerPath(128, 175, 95, normIndex, -4);
  const middleFinger = getFingerPath(164, 168, 108, normMiddle, 0);
  const ringFinger = getFingerPath(198, 175, 96, normRing, 4);

  return (
    <div className="relative w-full flex flex-col items-center justify-center p-4 bg-[#0A0D10] border border-[#1F242A] rounded-sm font-mono">
      {/* Top Header */}
      <div className="w-full flex items-center justify-between pb-3 mb-2 border-b border-[#1F242A] text-[11px] tracking-wider">
        <div className="flex items-center gap-2">
          <span className="text-white font-bold tracking-widest">
            {viewMode === '3d_model' ? '3D RIGGED HAND VISUALIZER' : 'KINETIC SENSOR SCHEMATIC'}
          </span>
          <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#14181D] border border-[#1F242A] text-[#2EE6A6]">
            ELENA FF RIG
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Tone Enhancer Toggle Button */}
          {viewMode === '3d_model' && (
            <button
              onClick={() => setShowToneControls(!showToneControls)}
              className={`flex items-center gap-1 px-2 py-0.5 text-[10px] rounded-xs border transition-colors ${
                showToneControls
                  ? 'bg-[#2EE6A6] text-[#08090A] border-[#2EE6A6] font-bold'
                  : 'bg-[#14181D] text-[#9CA3AF] border-[#1F242A] hover:text-white'
              }`}
              title="Tune skin tone fairness & warmth"
            >
              <Sliders className="w-3 h-3" />
              <span>SKIN TONE TUNER</span>
            </button>
          )}

          {/* View mode toggle */}
          <button
            onClick={() => setViewMode(viewMode === '3d_model' ? 'kinetic_schematic' : '3d_model')}
            className="flex items-center gap-1 px-2 py-0.5 text-[10px] bg-[#14181D] hover:bg-[#1E242B] border border-[#1F242A] text-[#2EE6A6] rounded-xs transition-colors"
            title="Toggle between 3D Rigged Model and Kinetic Schematic"
          >
            <Eye className="w-3 h-3" />
            <span>{viewMode === '3d_model' ? 'SCHEMATIC VIEW' : '3D RIG VIEW'}</span>
          </button>
        </div>
      </div>

      {/* Tone Enhancer Controls Drawer */}
      {viewMode === '3d_model' && showToneControls && (
        <div className="w-full mb-3 p-3 bg-[#0E1216] border border-[#1F242A] rounded-xs space-y-3 text-xs">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-white font-bold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#2EE6A6]" />
              SKIN TONE &amp; FAIRNESS ENHANCER
            </span>
            <span className="text-[10px] text-[#2EE6A6]">ACTIVE FILTER APPLIED</span>
          </div>

          {/* Presets */}
          <div className="grid grid-cols-4 gap-1.5 text-[10px]">
            {[
              { id: 'fair_lifelike', label: 'FAIR & LIFELIKE' },
              { id: 'fair_porcelain', label: 'PORCELAIN FAIR' },
              { id: 'natural_warm', label: 'NATURAL WARM' },
              { id: 'raw', label: 'ORIGINAL' },
            ].map((p) => (
              <button
                key={p.id}
                onClick={() => setTonePreset(p.id as TonePreset)}
                className={`py-1 px-1.5 text-center rounded-xs border transition-colors ${
                  tonePreset === p.id
                    ? 'border-[#2EE6A6] bg-[#0E1F18] text-[#2EE6A6] font-bold'
                    : 'border-[#1F242A] bg-[#13171D] text-[#9CA3AF] hover:text-white'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Sliders when custom preset active */}
          {tonePreset === 'fair_lifelike' && (
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] text-[#6B7280]">
                  <span>BRIGHTNESS / FAIRNESS</span>
                  <span className="text-white">{customBrightness}%</span>
                </div>
                <input
                  type="range"
                  min="90"
                  max="150"
                  value={customBrightness}
                  onChange={(e) => setCustomBrightness(parseInt(e.target.value))}
                  className="w-full accent-[#2EE6A6]"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-[10px] text-[#6B7280]">
                  <span>WARMTH &amp; SATURATION</span>
                  <span className="text-white">{customWarmth}%</span>
                </div>
                <input
                  type="range"
                  min="90"
                  max="150"
                  value={customWarmth}
                  onChange={(e) => setCustomWarmth(parseInt(e.target.value))}
                  className="w-full accent-[#2EE6A6]"
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Main 3D Display Container */}
      <div className="relative w-full aspect-[4/3] sm:aspect-[16/11] max-h-[420px] bg-[#050709] border border-[#161B22] rounded-xs overflow-hidden select-none">
        {viewMode === '3d_model' ? (
          <>
            {/* Sketchfab 3D Embed with Fair Tone Color Filter */}
            <iframe
              title="Rigged Hand - Elena FF"
              className="w-full h-full block border-0 transition-all duration-300"
              style={{
                filter: getFilterStyle(),
              }}
              src="https://sketchfab.com/models/eae97cc2a742413cb5338ab942b12c1e/embed?autostart=1&camera=0&preload=1&ui_theme=dark&ui_infos=0&ui_watermark=0"
              allow="autoplay; fullscreen; xr-spatial-tracking"
              allowFullScreen
            />

            {/* Credit overlay badge */}
            <div className="absolute left-2 top-2 z-10 flex items-center gap-1.5 px-2 py-1 bg-[#08090A]/90 border border-[#1F242A] rounded-xs text-[10px] text-[#9CA3AF] pointer-events-auto backdrop-blur-sm">
              <span>RIGGED HAND 3D</span>
              <a
                href="https://sketchfab.com/3d-models/rigged-hand-eae97cc2a742413cb5338ab942b12c1e"
                target="_blank"
                rel="noreferrer"
                className="text-[#2EE6A6] hover:underline flex items-center gap-0.5 ml-1"
              >
                <span>Elena FF</span>
                <ExternalLink className="w-2.5 h-2.5" />
              </a>
            </div>

            {/* 3D Interaction Hint */}
            <div className="absolute right-2 top-2 z-10 px-2 py-1 bg-[#08090A]/90 border border-[#1F242A] rounded-xs text-[9px] text-[#6B7280] pointer-events-none backdrop-blur-sm">
              CLICK &amp; DRAG TO ORBIT / ZOOM
            </div>
          </>
        ) : (
          /* Kinetic Schematic SVG Mode */
          <div className="w-full h-full flex items-center justify-center p-2 bg-[#0A0D10]">
            <svg
              viewBox="0 0 320 380"
              className="w-full h-full max-h-[360px] overflow-visible"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient id="fairSkinGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#F5D0B5" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#DEAA8A" stopOpacity="0.5" />
                </linearGradient>
              </defs>

              {/* Wrist Base */}
              <path
                d="M 120 340 L 200 340 L 210 370 L 110 370 Z"
                fill="#12161C"
                stroke="#1F242A"
                strokeWidth="1.5"
              />

              {/* Palm Surface with Fair Tone Fill */}
              <path
                d="M 90 270 C 85 220, 100 180, 115 175 C 130 170, 195 170, 215 178 C 235 185, 240 240, 230 275 C 220 310, 210 340, 200 340 L 120 340 C 110 330, 95 305, 90 270 Z"
                fill="url(#fairSkinGrad)"
                stroke="#CFA285"
                strokeWidth="1.5"
              />

              {/* Stationary Thumb */}
              <g opacity="0.45">
                <path
                  d="M 95 245 C 70 230, 50 205, 52 185 C 54 172, 70 178, 85 200 C 95 215, 102 245, 102 245 Z"
                  fill="#E6BC9E"
                  stroke="#CFA285"
                  strokeWidth="1.2"
                />
                <text x="50" y="172" fill="#6B7280" fontSize="8" fontFamily="monospace">
                  THUMB (REF)
                </text>
              </g>

              {/* Stationary Pinky */}
              <g opacity="0.45">
                <path
                  d="M 220 190 C 232 180, 248 135, 245 125 C 242 118, 235 120, 226 135 C 218 150, 214 180, 214 190 Z"
                  fill="#E6BC9E"
                  stroke="#CFA285"
                  strokeWidth="1.2"
                />
                <text x="250" y="125" fill="#6B7280" fontSize="8" fontFamily="monospace">
                  PINKY (REF)
                </text>
              </g>

              {/* F1 Index Finger */}
              <g>
                <path
                  d={indexFinger.pathString}
                  fill="none"
                  stroke={binaryBits[0] === 1 ? '#2EE6A6' : '#E0B596'}
                  strokeWidth="10"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                {indexFinger.points.map((pt, idx) => (
                  <circle
                    key={`idx-pt-${idx}`}
                    cx={pt.x}
                    cy={pt.y}
                    r={idx === 3 ? 3.5 : 2.5}
                    fill={idx === 3 ? (binaryBits[0] === 1 ? '#2EE6A6' : '#CFA285') : '#08090A'}
                    stroke={binaryBits[0] === 1 ? '#2EE6A6' : '#E0B596'}
                    strokeWidth="1.5"
                  />
                ))}
              </g>

              {/* F2 Middle Finger */}
              <g>
                <path
                  d={middleFinger.pathString}
                  fill="none"
                  stroke={binaryBits[1] === 1 ? '#2EE6A6' : '#E0B596'}
                  strokeWidth="10"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                {middleFinger.points.map((pt, idx) => (
                  <circle
                    key={`mid-pt-${idx}`}
                    cx={pt.x}
                    cy={pt.y}
                    r={idx === 3 ? 3.5 : 2.5}
                    fill={idx === 3 ? (binaryBits[1] === 1 ? '#2EE6A6' : '#CFA285') : '#08090A'}
                    stroke={binaryBits[1] === 1 ? '#2EE6A6' : '#E0B596'}
                    strokeWidth="1.5"
                  />
                ))}
              </g>

              {/* F3 Ring Finger */}
              <g>
                <path
                  d={ringFinger.pathString}
                  fill="none"
                  stroke={binaryBits[2] === 1 ? '#2EE6A6' : '#E0B596'}
                  strokeWidth="10"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                {ringFinger.points.map((pt, idx) => (
                  <circle
                    key={`rng-pt-${idx}`}
                    cx={pt.x}
                    cy={pt.y}
                    r={idx === 3 ? 3.5 : 2.5}
                    fill={idx === 3 ? (binaryBits[2] === 1 ? '#2EE6A6' : '#CFA285') : '#08090A'}
                    stroke={binaryBits[2] === 1 ? '#2EE6A6' : '#E0B596'}
                    strokeWidth="1.5"
                  />
                ))}
              </g>
            </svg>
          </div>
        )}
      </div>

      {/* Sensor Calibration & Flex Status Badges (Matches live hardware) */}
      <div className="w-full grid grid-cols-3 gap-2 pt-3 mt-1 border-t border-[#1F242A]">
        {[
          { label: 'F1 INDEX', bit: binaryBits[0], norm: normIndex, raw: rawSensors[0] },
          { label: 'F2 MIDDLE', bit: binaryBits[1], norm: normMiddle, raw: rawSensors[1] },
          { label: 'F3 RING', bit: binaryBits[2], norm: normRing, raw: rawSensors[2] },
        ].map((f) => (
          <div
            key={f.label}
            className={`p-2 rounded-sm border ${
              f.bit === 1
                ? 'border-[#2EE6A6] bg-[#0E1B15]'
                : 'border-[#1F242A] bg-[#0C0E11]'
            } flex flex-col text-[10px]`}
          >
            <div className="flex justify-between items-center text-[#9CA3AF]">
              <span>{f.label}</span>
              <span
                className={`px-1 py-0.2 rounded font-bold ${
                  f.bit === 1 ? 'text-[#08090A] bg-[#2EE6A6]' : 'text-[#6B7280] bg-[#1F242A]'
                }`}
              >
                {f.bit === 1 ? 'BENT (1)' : 'STRAIGHT (0)'}
              </span>
            </div>
            <div className="mt-1 flex justify-between items-center text-[#D1D5DB]">
              <span>ADC: {f.raw ?? '---'}</span>
              <span className="text-[#2EE6A6]">{Math.round(f.norm * 100)}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HandSchematic;
