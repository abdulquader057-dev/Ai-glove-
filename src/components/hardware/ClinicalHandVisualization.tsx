// Clinical Hand Kinematics Visualization for SIGNOVA
// Assistive Device Medical Interface
// Renders responsive anatomical SVG hand whose fingers curl organic to live flex sensor values.
// Features active flex sensor traces, joint telemetry nodes, ghost target preview during 400ms debounce.

'use client';

import React, { useMemo } from 'react';
import { useSignovaStore } from '@/store/signovaStore';
import { GESTURE_MAP } from '@/config/signova.config';

interface JointPoint {
  x: number;
  y: number;
}

interface FingerKinematics {
  j0: JointPoint; // MCP base
  j1: JointPoint; // PIP joint
  j2: JointPoint; // DIP joint
  j3: JointPoint; // Fingertip
}

// Convert degrees to radians
const toRad = (deg: number) => (deg * Math.PI) / 180;

// Compute 2D joint positions with curling kinematics
function computeFingerJoints(
  baseX: number,
  baseY: number,
  baseAngleDeg: number,
  l1: number,
  l2: number,
  l3: number,
  bendNorm: number, // 0.0 straight -> 1.0 fully curled
  curlDirection: number = 1 // 1 bends towards palm right, -1 bends towards palm left
): FingerKinematics {
  // Clamped bend
  const b = Math.max(0, Math.min(1, bendNorm));

  // Angular curl distribution across joints
  const a1 = baseAngleDeg + b * 42 * curlDirection;
  const j1: JointPoint = {
    x: baseX + l1 * Math.cos(toRad(a1)),
    y: baseY + l1 * Math.sin(toRad(a1)),
  };

  const a2 = a1 + b * 56 * curlDirection;
  const j2: JointPoint = {
    x: j1.x + l2 * Math.cos(toRad(a2)),
    y: j1.y + l2 * Math.sin(toRad(a2)),
  };

  const a3 = a2 + b * 46 * curlDirection;
  const j3: JointPoint = {
    x: j2.x + l3 * Math.cos(toRad(a3)),
    y: j2.y + l3 * Math.sin(toRad(a3)),
  };

  return {
    j0: { x: baseX, y: baseY },
    j1,
    j2,
    j3,
  };
}

export const ClinicalHandVisualization: React.FC = () => {
  const {
    normalizedSensors,
    connectionStatus,
    candidateGesture,
    holdProgress,
  } = useSignovaStore();

  const isConnected = connectionStatus === 'connected';

  // Live normalized sensor values: [index, middle, ring]
  const [indexNorm, middleNorm, ringNorm] = isConnected
    ? normalizedSensors
    : [0.05, 0.05, 0.05];

  // Derive ghost target values if candidate gesture is being held
  const ghostNorms = useMemo<[number, number, number] | null>(() => {
    if (!isConnected || candidateGesture === 'NONE' || holdProgress === 0) return null;
    const match = Object.entries(GESTURE_MAP).find(([, g]) => g.label === candidateGesture);
    if (!match) return null;
    const [pattern] = match;
    return [
      pattern[0] === '1' ? 0.95 : 0.05,
      pattern[1] === '1' ? 0.95 : 0.05,
      pattern[2] === '1' ? 0.95 : 0.05,
    ];
  }, [isConnected, candidateGesture, holdProgress]);

  // Compute live finger kinematic chains
  // Thumb (opposing rest angle ~ -135°)
  const thumb = useMemo(() => {
    return computeFingerJoints(120, 360, -145, 34, 30, 24, 0.15, -0.6);
  }, []);

  // Index finger (Sensor 1)
  const indexFinger = useMemo(() => {
    return computeFingerJoints(152, 260, -96, 52, 38, 28, indexNorm, 1.15);
  }, [indexNorm]);

  // Middle finger (Sensor 2)
  const middleFinger = useMemo(() => {
    return computeFingerJoints(198, 242, -90, 60, 44, 32, middleNorm, 1.05);
  }, [middleNorm]);

  // Ring finger (Sensor 3)
  const ringFinger = useMemo(() => {
    return computeFingerJoints(242, 256, -84, 54, 38, 28, ringNorm, 0.95);
  }, [ringNorm]);

  // Pinky (uninstrumented, follows slight natural coupling)
  const pinkyCoupling = (ringNorm * 0.45);
  const pinkyFinger = useMemo(() => {
    return computeFingerJoints(282, 285, -78, 42, 28, 22, pinkyCoupling, 0.85);
  }, [pinkyCoupling]);

  // Ghost kinematics (if candidate gesture held)
  const ghostChains = useMemo(() => {
    if (!ghostNorms) return null;
    return {
      index: computeFingerJoints(152, 260, -96, 52, 38, 28, ghostNorms[0], 1.15),
      middle: computeFingerJoints(198, 242, -90, 60, 44, 32, ghostNorms[1], 1.05),
      ring: computeFingerJoints(242, 256, -84, 54, 38, 28, ghostNorms[2], 0.95),
    };
  }, [ghostNorms]);

  // SVG phalanx rendering helper
  const renderPhalanx = (
    p1: JointPoint,
    p2: JointPoint,
    width1: number,
    width2: number
  ) => {
    const angle = Math.atan2(p2.y - p1.y, p2.x - p1.x);
    const perpAngle = angle + Math.PI / 2;

    const dx1 = (width1 / 2) * Math.cos(perpAngle);
    const dy1 = (width1 / 2) * Math.sin(perpAngle);
    const dx2 = (width2 / 2) * Math.cos(perpAngle);
    const dy2 = (width2 / 2) * Math.sin(perpAngle);

    const pathData = `
      M ${p1.x - dx1} ${p1.y - dy1}
      L ${p1.x + dx1} ${p1.y + dy1}
      L ${p2.x + dx2} ${p2.y + dy2}
      A ${width2 / 2} ${width2 / 2} 0 0 1 ${p2.x - dx2} ${p2.y - dy2}
      Z
    `;

    return (
      <path
        d={pathData}
        className="transition-all duration-150 ease-out"
        fill={isConnected ? 'url(#fleshGradient)' : '#E4E7EC'}
        stroke={isConnected ? '#D0D5DD' : '#CBD5E1'}
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
    );
  };

  // Sensor flex trace line on dorsal side
  const renderSensorTrace = (
    chain: FingerKinematics,
    bentVal: number
  ) => {
    const isBent = bentVal > 0.5;
    const tracePath = `M ${chain.j0.x} ${chain.j0.y} L ${chain.j1.x} ${chain.j1.y} L ${chain.j2.x} ${chain.j2.y} L ${chain.j3.x} ${chain.j3.y}`;

    return (
      <g className="transition-all duration-150 ease-out">
        {/* Sensor ribbon backing */}
        <path
          d={tracePath}
          fill="none"
          stroke={isBent ? '#0E7490' : '#94A3B8'}
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity={isBent ? 0.35 : 0.2}
        />
        {/* Sensor active copper / polymer trace */}
        <path
          d={tracePath}
          fill="none"
          stroke={isBent ? '#0E7490' : '#64748B'}
          strokeWidth="2.5"
          strokeDasharray={isBent ? 'none' : '4 2'}
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* MCP Joint Node */}
        <circle
          cx={chain.j0.x}
          cy={chain.j0.y}
          r="4.5"
          fill={isBent ? '#0E7490' : '#FFFFFF'}
          stroke={isBent ? '#083344' : '#64748B'}
          strokeWidth="1.5"
        />

        {/* PIP Joint Node */}
        <circle
          cx={chain.j1.x}
          cy={chain.j1.y}
          r="4"
          fill={isBent ? '#0E7490' : '#FFFFFF'}
          stroke={isBent ? '#083344' : '#64748B'}
          strokeWidth="1.5"
        />

        {/* DIP Joint Node */}
        <circle
          cx={chain.j2.x}
          cy={chain.j2.y}
          r="3.5"
          fill={isBent ? '#0E7490' : '#FFFFFF'}
          stroke={isBent ? '#083344' : '#64748B'}
          strokeWidth="1.5"
        />

        {/* Tip Terminal */}
        <circle
          cx={chain.j3.x}
          cy={chain.j3.y}
          r="3"
          fill={isBent ? '#0E7490' : '#64748B'}
        />

        {/* Floating live indicator at fingertip */}
        <g transform={`translate(${chain.j3.x}, ${chain.j3.y - 12})`}>
          <rect
            x="-20"
            y="-14"
            width="40"
            height="14"
            rx="3"
            fill={isBent ? '#0E7490' : '#1E293B'}
            opacity="0.9"
          />
          <text
            x="0"
            y="-4"
            textAnchor="middle"
            fill="#FFFFFF"
            fontSize="8.5"
            fontFamily="monospace"
            fontWeight="bold"
          >
            {Math.round(bentVal * 100)}%
          </text>
        </g>
      </g>
    );
  };

  // Ghost line renderer
  const renderGhostChain = (chain: FingerKinematics) => (
    <path
      d={`M ${chain.j0.x} ${chain.j0.y} L ${chain.j1.x} ${chain.j1.y} L ${chain.j2.x} ${chain.j2.y} L ${chain.j3.x} ${chain.j3.y}`}
      fill="none"
      stroke="#F59E0B"
      strokeWidth="3.5"
      strokeDasharray="4 3"
      strokeLinecap="round"
      opacity="0.55"
    />
  );

  return (
    <div className="relative w-full h-full min-h-[460px] flex flex-col items-center justify-center p-3 sm:p-5 bg-white dark:bg-[#111827] rounded-xl border border-[#E4E7EC] dark:border-[#1F2937] shadow-card overflow-hidden">
      {/* Top Telemetry Header Inside Card */}
      <div className="w-full flex items-center justify-between mb-2 px-2 text-xs border-b border-[#F0F2F5] dark:border-[#1F2937] pb-2">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#0E7490] animate-pulse"></span>
          <span className="font-semibold text-[#101828] dark:text-[#F9FAFB] tracking-tight">
            Anatomical Kinematics
          </span>
          <span className="text-[10px] text-[#64748B] dark:text-[#9CA3AF] bg-[#F1F5F9] dark:bg-[#1F2937] px-1.5 py-0.5 rounded font-mono">
            3-Axis Flex
          </span>
        </div>
        <div className="flex items-center gap-3 font-mono text-[11px] text-[#64748B] dark:text-[#9CA3AF]">
          <span>Index {Math.round(indexNorm * 100)}%</span>
          <span>·</span>
          <span>Middle {Math.round(middleNorm * 100)}%</span>
          <span>·</span>
          <span>Ring {Math.round(ringNorm * 100)}%</span>
        </div>
      </div>

      {/* Main Hand SVG Workspace */}
      <div className="relative w-full max-w-[380px] aspect-[400/480] flex items-center justify-center">
        <svg
          viewBox="0 0 400 480"
          className={`w-full h-full select-none ${isConnected ? 'animate-breath' : 'opacity-40 grayscale'}`}
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Clinical Flesh Warm Tone Gradient */}
            <linearGradient id="fleshGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FBF7F5" />
              <stop offset="50%" stopColor="#F5ECE6" />
              <stop offset="100%" stopColor="#EFE1D8" />
            </linearGradient>

            {/* Palm Shadow Gradient */}
            <radialGradient id="palmContour" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#EDE0D4" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#DFCEBF" stopOpacity="0.1" />
            </radialGradient>

            {/* Ghost Glow Filter */}
            <filter id="ghostGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Wrist & Forearm Base */}
          <path
            d="M 148 480 L 155 425 C 160 415 175 410 200 410 C 225 410 240 415 245 425 L 252 480 Z"
            fill={isConnected ? 'url(#fleshGradient)' : '#F1F5F9'}
            stroke={isConnected ? '#D0D5DD' : '#CBD5E1'}
            strokeWidth="1.5"
          />

          {/* Palm Base Contour */}
          <path
            d="
              M 155 420
              C 120 405 110 375 118 340
              C 122 320 135 285 145 265
              C 152 250 162 255 175 258
              C 185 242 208 240 220 250
              C 232 248 252 258 260 268
              C 270 272 290 285 292 315
              C 295 350 288 385 272 405
              C 260 420 248 424 245 425
              Z
            "
            fill={isConnected ? 'url(#fleshGradient)' : '#F1F5F9'}
            stroke={isConnected ? '#CBD5E1' : '#94A3B8'}
            strokeWidth="1.5"
          />
          {/* Subtle palm crease lines for clinical anatomical realism */}
          <ellipse cx="205" cy="340" rx="45" ry="55" fill="url(#palmContour)" />
          <path
            d="M 145 320 Q 185 340 230 310"
            fill="none"
            stroke="#D6C4B4"
            strokeWidth="1.2"
            opacity="0.6"
          />
          <path
            d="M 160 350 Q 205 375 255 355"
            fill="none"
            stroke="#D6C4B4"
            strokeWidth="1.2"
            opacity="0.5"
          />

          {/* --- FINGERS RENDERING (Bottom to top layering) --- */}

          {/* 1. Pinky Finger (Uninstrumented) */}
          <g id="pinky-finger">
            {renderPhalanx(pinkyFinger.j0, pinkyFinger.j1, 14, 12)}
            {renderPhalanx(pinkyFinger.j1, pinkyFinger.j2, 12, 10)}
            {renderPhalanx(pinkyFinger.j2, pinkyFinger.j3, 10, 8)}
          </g>

          {/* 2. Thumb */}
          <g id="thumb-finger">
            {renderPhalanx(thumb.j0, thumb.j1, 18, 16)}
            {renderPhalanx(thumb.j1, thumb.j2, 16, 14)}
            {renderPhalanx(thumb.j2, thumb.j3, 14, 11)}
          </g>

          {/* 3. Ring Finger (Sensor 3) */}
          <g id="ring-finger">
            {renderPhalanx(ringFinger.j0, ringFinger.j1, 16, 14)}
            {renderPhalanx(ringFinger.j1, ringFinger.j2, 14, 12)}
            {renderPhalanx(ringFinger.j2, ringFinger.j3, 12, 10)}
            {renderSensorTrace(ringFinger, ringNorm)}
          </g>

          {/* 4. Middle Finger (Sensor 2) */}
          <g id="middle-finger">
            {renderPhalanx(middleFinger.j0, middleFinger.j1, 18, 15)}
            {renderPhalanx(middleFinger.j1, middleFinger.j2, 15, 13)}
            {renderPhalanx(middleFinger.j2, middleFinger.j3, 13, 10)}
            {renderSensorTrace(middleFinger, middleNorm)}
          </g>

          {/* 5. Index Finger (Sensor 1) */}
          <g id="index-finger">
            {renderPhalanx(indexFinger.j0, indexFinger.j1, 17, 15)}
            {renderPhalanx(indexFinger.j1, indexFinger.j2, 15, 13)}
            {renderPhalanx(indexFinger.j2, indexFinger.j3, 13, 10)}
            {renderSensorTrace(indexFinger, indexNorm)}
          </g>

          {/* Ghost Target Pose (During 400ms Debounce Hold) */}
          {ghostChains && (
            <g id="ghost-target-preview" filter="url(#ghostGlow)">
              {renderGhostChain(ghostChains.index)}
              {renderGhostChain(ghostChains.middle)}
              {renderGhostChain(ghostChains.ring)}
            </g>
          )}

          {/* Sensor Bus Ribbon Connector at Wrist */}
          <path
            d="M 180 435 L 180 465 M 200 435 L 200 465 M 220 435 L 220 465"
            stroke="#0E7490"
            strokeWidth="2"
            opacity="0.8"
          />
          <rect
            x="172"
            y="442"
            width="56"
            height="14"
            rx="2"
            fill="#0F172A"
            stroke="#334155"
            strokeWidth="1"
          />
          <text
            x="200"
            y="452"
            textAnchor="middle"
            fill="#38BDF8"
            fontSize="7"
            fontFamily="monospace"
            fontWeight="bold"
          >
            FLEX BUS 3CH
          </text>
        </svg>

        {/* Offline Overlay Watermark */}
        {!isConnected && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-white/70 dark:bg-[#111827]/80 backdrop-blur-xs rounded-xl">
            <div className="w-10 h-10 rounded-full bg-[#F1F5F9] dark:bg-[#1F2937] flex items-center justify-center text-[#64748B] mb-2 border border-[#E2E8F0] dark:border-[#374151]">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <p className="text-sm font-semibold text-[#1E293B] dark:text-[#F1F5F9]">
              Live Kinematics Offline
            </p>
            <p className="text-xs text-[#64748B] dark:text-[#94A3B8] max-w-xs mt-1">
              Connect glove via USB (115200 baud) or BLE, or press keys 1–8 to simulate gestures.
            </p>
          </div>
        )}
      </div>

      {/* Floating Ghost Badge During Debounce */}
      {ghostChains && holdProgress > 0 && (
        <div className="mt-2 flex items-center gap-2 px-3 py-1 bg-[#FEF3C7] dark:bg-[#78350F]/40 border border-[#F59E0B] rounded-full text-[11px] text-[#92400E] dark:text-[#FDE68A] animate-pulse">
          <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B]"></span>
          <span>Target Pose: <strong>{candidateGesture}</strong></span>
          <span className="font-mono">({holdProgress}%)</span>
        </div>
      )}
    </div>
  );
};
