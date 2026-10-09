// Hand Schematic Vector Component
// Team Syntropy - SIGNOVA
// Hand-crafted SVG diagram where the 3 active flex fingers (Index, Middle, Ring)
// bend and curl realistically according to live calibrated sensor values.
// Thumb and Pinky are rendered in stationary resting reference pose.

'use client';

import React from 'react';

interface HandSchematicProps {
  // Normalized bend ratios from 0.0 (fully straight) to 1.0 (fully curled)
  normalizedFingers: number[]; // [index, middle, ring]
  binaryBits: [number, number, number];
  rawSensors: number[];
}

export const HandSchematic: React.FC<HandSchematicProps> = ({
  normalizedFingers,
  binaryBits,
  rawSensors,
}) => {
  const normIndex = normalizedFingers[0] ?? 0;
  const normMiddle = normalizedFingers[1] ?? 0;
  const normRing = normalizedFingers[2] ?? 0;

  // Compute realistic finger flexion heights and joint bend angles:
  // When straight (norm=0): extended up to full length.
  // When bent (norm=1): finger curls downward towards the palm.
  const getFingerPath = (
    baseX: number,
    baseY: number,
    totalLength: number,
    bendRatio: number,
    spreadAngleDeg: number
  ) => {
    // 3 segments: proximal, intermediate, distal
    const segLen = totalLength / 3;
    // Each joint bends by an angle proportional to bendRatio (up to ~65 deg per joint)
    const maxCurlPerJoint = 60 * (Math.PI / 180);
    const curl = bendRatio * maxCurlPerJoint;
    const baseAngle = (spreadAngleDeg - 90) * (Math.PI / 180);

    // Joint 1: MCP to PIP
    const a1 = baseAngle + curl * 0.4;
    const x1 = baseX + Math.cos(a1) * segLen;
    const y1 = baseY + Math.sin(a1) * segLen;

    // Joint 2: PIP to DIP
    const a2 = a1 + curl * 0.8;
    const x2 = x1 + Math.cos(a2) * segLen;
    const y2 = y1 + Math.sin(a2) * segLen;

    // Joint 3: DIP to Fingertip
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
      tip: { x: x3, y: y3 },
    };
  };

  // Base knuckle positions on palm (W: 320, H: 380 coordinate space)
  const indexFinger = getFingerPath(128, 175, 95, normIndex, -4);
  const middleFinger = getFingerPath(164, 168, 108, normMiddle, 0);
  const ringFinger = getFingerPath(198, 175, 96, normRing, 4);

  return (
    <div className="relative w-full flex flex-col items-center justify-center p-4 bg-[#0A0D10] border border-[#1F242A] rounded-sm">
      {/* Top Telemetry Header */}
      <div className="w-full flex items-center justify-between pb-3 mb-2 border-b border-[#1F242A] text-[11px] font-mono tracking-wider">
        <span className="text-[#6B7280]">ANATOMICAL VECTOR SCHEMATIC</span>
        <span className="text-[#2EE6A6] flex items-center gap-1.5">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#2EE6A6]" />
          3 ACTIVE FLEX CHANNELS
        </span>
      </div>

      <div className="relative w-full max-w-[320px] aspect-[320/380] select-none">
        <svg
          viewBox="0 0 320 380"
          className="w-full h-full overflow-visible"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Sensor flex gradient */}
            <linearGradient id="sensorActiveGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#2EE6A6" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#165B44" stopOpacity="0.4" />
            </linearGradient>
            <linearGradient id="sensorRestGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#374151" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#1F2937" stopOpacity="0.4" />
            </linearGradient>
          </defs>

          {/* 1. PALM OUTLINE & WRIST */}
          {/* Wrist Base */}
          <path
            d="M 120 340 L 200 340 L 210 370 L 110 370 Z"
            fill="#0E1216"
            stroke="#1F242A"
            strokeWidth="1.5"
          />
          {/* Wrist Hardware Connector Plate */}
          <rect
            x="126"
            y="346"
            width="68"
            height="18"
            fill="#14181D"
            stroke="#2EE6A6"
            strokeWidth="1"
            strokeDasharray="2 2"
          />
          <text
            x="160"
            y="358"
            textAnchor="middle"
            fill="#2EE6A6"
            fontSize="7"
            fontFamily="monospace"
            letterSpacing="0.1em"
          >
            XIAO / 50Hz
          </text>

          {/* Palm Surface */}
          <path
            d="M 90 270 C 85 220, 100 180, 115 175 C 130 170, 195 170, 215 178 C 235 185, 240 240, 230 275 C 220 310, 210 340, 200 340 L 120 340 C 110 330, 95 305, 90 270 Z"
            fill="#0D1014"
            stroke="#262D36"
            strokeWidth="1.5"
          />

          {/* Palm Contour Lines (Anatomical Creases) */}
          <path
            d="M 115 220 Q 155 240, 190 220"
            fill="none"
            stroke="#1A2027"
            strokeWidth="1"
          />
          <path
            d="M 125 250 Q 165 270, 205 245"
            fill="none"
            stroke="#1A2027"
            strokeWidth="1"
          />

          {/* 2. STATIONARY REFERENCE FINGERS (Thumb & Pinky) */}
          {/* Stationary Thumb (Left side) */}
          <g opacity="0.35">
            <path
              d="M 95 245 C 70 230, 50 205, 52 185 C 54 172, 70 178, 85 200 C 95 215, 102 235, 102 245 Z"
              fill="#0F1318"
              stroke="#2B333E"
              strokeWidth="1.2"
            />
            <text x="50" y="172" fill="#4B5563" fontSize="8" fontFamily="monospace">
              THUMB (REF)
            </text>
          </g>

          {/* Stationary Pinky (Right side) */}
          <g opacity="0.35">
            <path
              d="M 220 190 C 232 180, 248 135, 245 125 C 242 118, 235 120, 226 135 C 218 150, 214 180, 214 190 Z"
              fill="#0F1318"
              stroke="#2B333E"
              strokeWidth="1.2"
            />
            <text x="250" y="125" fill="#4B5563" fontSize="8" fontFamily="monospace">
              PINKY (REF)
            </text>
          </g>

          {/* 3. ACTIVE FLEX SENSORS & DYNAMIC ARTICULATING FINGERS */}

          {/* A. INDEX FINGER (F1) */}
          <g className="transition-all duration-75">
            {/* Underlying Bone / Structure */}
            <path
              d={indexFinger.pathString}
              fill="none"
              stroke={binaryBits[0] === 1 ? '#2EE6A6' : '#2D3748'}
              strokeWidth="12"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeOpacity="0.15"
            />
            {/* Flex Strip Sensor Overlay */}
            <path
              d={indexFinger.pathString}
              fill="none"
              stroke={binaryBits[0] === 1 ? '#2EE6A6' : '#4B5563'}
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Knuckle and Joint Rivets */}
            {indexFinger.points.map((pt, idx) => (
              <circle
                key={`idx-pt-${idx}`}
                cx={pt.x}
                cy={pt.y}
                r={idx === 3 ? 3.5 : 2.5}
                fill={idx === 3 ? (binaryBits[0] === 1 ? '#2EE6A6' : '#6B7280') : '#08090A'}
                stroke={binaryBits[0] === 1 ? '#2EE6A6' : '#4B5563'}
                strokeWidth="1.5"
              />
            ))}
          </g>

          {/* B. MIDDLE FINGER (F2) */}
          <g className="transition-all duration-75">
            <path
              d={middleFinger.pathString}
              fill="none"
              stroke={binaryBits[1] === 1 ? '#2EE6A6' : '#2D3748'}
              strokeWidth="12"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeOpacity="0.15"
            />
            <path
              d={middleFinger.pathString}
              fill="none"
              stroke={binaryBits[1] === 1 ? '#2EE6A6' : '#4B5563'}
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {middleFinger.points.map((pt, idx) => (
              <circle
                key={`mid-pt-${idx}`}
                cx={pt.x}
                cy={pt.y}
                r={idx === 3 ? 3.5 : 2.5}
                fill={idx === 3 ? (binaryBits[1] === 1 ? '#2EE6A6' : '#6B7280') : '#08090A'}
                stroke={binaryBits[1] === 1 ? '#2EE6A6' : '#4B5563'}
                strokeWidth="1.5"
              />
            ))}
          </g>

          {/* C. RING FINGER (F3) */}
          <g className="transition-all duration-75">
            <path
              d={ringFinger.pathString}
              fill="none"
              stroke={binaryBits[2] === 1 ? '#2EE6A6' : '#2D3748'}
              strokeWidth="12"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeOpacity="0.15"
            />
            <path
              d={ringFinger.pathString}
              fill="none"
              stroke={binaryBits[2] === 1 ? '#2EE6A6' : '#4B5563'}
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {ringFinger.points.map((pt, idx) => (
              <circle
                key={`rng-pt-${idx}`}
                cx={pt.x}
                cy={pt.y}
                r={idx === 3 ? 3.5 : 2.5}
                fill={idx === 3 ? (binaryBits[2] === 1 ? '#2EE6A6' : '#6B7280') : '#08090A'}
                stroke={binaryBits[2] === 1 ? '#2EE6A6' : '#4B5563'}
                strokeWidth="1.5"
              />
            ))}
          </g>
        </svg>
      </div>

      {/* Sensor Calibration & Flex Status Badges */}
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
            } flex flex-col text-[10px] font-mono`}
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
