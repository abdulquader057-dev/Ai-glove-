'use client';

import React, { useState } from 'react';
import { 
  Eye, 
  RotateCw, 
  Palette, 
  Layers, 
  Sparkles,
  Maximize2,
  Minimize2
} from 'lucide-react';

export const HolographicGloveView: React.FC = () => {
  const [rotation, setRotation] = useState(15);
  const [theme, setTheme] = useState<'cyan' | 'purple' | 'pink'>('cyan');
  const [showSensors, setShowSensors] = useState(true);
  const [showCircuits, setShowCircuits] = useState(true);
  const [showChip, setShowChip] = useState(true);
  const [isExploded, setIsExploded] = useState(false);

  const themeColors = {
    cyan: { primary: '#00f0ff', secondary: '#0066ff', accent: '#ec4899', glow: 'rgba(0, 240, 255, 0.5)' },
    purple: { primary: '#8b5cf6', secondary: '#c084fc', accent: '#00f0ff', glow: 'rgba(139, 92, 246, 0.5)' },
    pink: { primary: '#ec4899', secondary: '#f472b6', accent: '#00f0ff', glow: 'rgba(236, 72, 153, 0.5)' },
  };

  const currentTheme = themeColors[theme];

  // Leader Badges positioned around the hand with target line coordinates
  const badges = [
    { id: 'flex', label: 'FLEX SENSORS', x: 12, y: 15, targetX: 185, targetY: 130 },
    { id: 'voice', label: 'VOICE OUTPUT', x: 74, y: 12, targetX: 300, targetY: 140 },
    { id: 'ai', label: 'EDGE AI MODEL', x: 8, y: 45, targetX: 235, targetY: 340 },
    { id: 'imu', label: '6-AXIS IMU', x: 76, y: 48, targetX: 310, targetY: 360 },
    { id: 'chip', label: 'XIAO nRF52840', x: 10, y: 76, targetX: 235, targetY: 480 },
    { id: 'ble', label: 'BLE 5.0 ANTENNA', x: 74, y: 78, targetX: 290, targetY: 510 },
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#00f0ff]/20 pb-5">
        <div>
          <span className="px-2.5 py-0.5 rounded bg-[#00f0ff]/20 text-[#00f0ff] font-orbitron text-[10px] tracking-widest uppercase">
            3D INTERACTIVE TELEMETRY LAB
          </span>
          <h1 className="font-orbitron font-extrabold text-2xl sm:text-3xl text-gradient-cyan mt-1">
            HOLOGRAPHIC GLOVE VIEWER
          </h1>
        </div>

        <button
          onClick={() => setIsExploded(!isExploded)}
          className={`btn-primary flex items-center justify-center gap-2 ${
            isExploded ? '!bg-gradient-to-r !from-[#ec4899] !to-[#8b5cf6] shadow-[0_0_30px_rgba(236,72,153,0.4)]' : ''
          }`}
        >
          <Sparkles className="w-5 h-5" />
          <span>{isExploded ? 'COLLAPSE VIEW' : 'EXPLODE VIEW'}</span>
        </button>
      </div>

      {/* Main 3D Canvas & Controls Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* CENTER: 3D HOLOGRAPHIC SVG HAND DISPLAY (8 cols) */}
        <div className="lg:col-span-8 glass-card p-6 min-h-[520px] flex flex-col justify-between relative overflow-hidden bg-gradient-to-b from-[#0a0f1e] via-[#030712] to-[#0a0f1e]">
          
          {/* Top Status Indicators */}
          <div className="flex items-center justify-between text-xs font-orbitron z-10">
            <span className="text-[#00f0ff] flex items-center gap-2">
              <Eye className="w-4 h-4 animate-pulse" />
              HOLOGRAPHIC NEURAL MESH ACTIVE
            </span>
            <span className="text-[#94a3b8]">
              PERSPECTIVE: {rotation}° Y-AXIS
            </span>
          </div>

          {/* Holographic Container with 3D Perspective */}
          <div 
            className="relative w-full h-[450px] flex items-center justify-center my-2"
            style={{
              perspective: '1000px',
              transformStyle: 'preserve-3d',
            }}
          >
            <div 
              className="relative w-full h-full max-w-[550px] flex items-center justify-center transition-transform duration-300"
              style={{
                transform: `rotateY(${rotation}deg) rotateX(10deg)`,
                transformStyle: 'preserve-3d',
              }}
            >
              
              {/* SVG Hologram */}
              <svg 
                viewBox="0 0 500 600" 
                className={`w-full h-full max-h-[440px] transition-all duration-700 ${
                  isExploded ? 'translate-y-[-25px] scale-105' : ''
                }`}
                style={{ filter: `drop-shadow(0 0 25px ${currentTheme.glow})` }}
              >
                <defs>
                  {/* Palm Gradient - Pink/Purple left, Cyan right */}
                  <linearGradient id="palmPinkCyan" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#ec4899" stopOpacity="0.45" />
                    <stop offset="40%" stopColor="#8b5cf6" stopOpacity="0.35" />
                    <stop offset="100%" stopColor="#00f0ff" stopOpacity="0.2" />
                  </linearGradient>

                  {/* Cyan Sensor Glow */}
                  <filter id="cyanGlowFilter" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="4" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>

                  {/* Sensor Gradient */}
                  <linearGradient id="sensorGrad" x1="0%" y1="100%" x2="0%" y2="0%">
                    <stop offset="0%" stopColor="#0066ff" />
                    <stop offset="50%" stopColor="#00f0ff" />
                    <stop offset="100%" stopColor="#ffffff" />
                  </linearGradient>
                </defs>

                {/* 1. Concentric Radial Target Rings (Background Grid) */}
                <g opacity="0.25">
                  <circle cx="250" cy="300" r="230" stroke="#00f0ff" strokeWidth="1" fill="none" strokeDasharray="6 6" />
                  <circle cx="250" cy="300" r="170" stroke="#00f0ff" strokeWidth="1" fill="none" />
                  <circle cx="250" cy="300" r="110" stroke="#8b5cf6" strokeWidth="1" fill="none" strokeDasharray="4 4" />
                  <line x1="20" y1="300" x2="480" y2="300" stroke="#00f0ff" strokeWidth="0.5" strokeDasharray="2 4" />
                  <line x1="250" y1="50" x2="250" y2="550" stroke="#00f0ff" strokeWidth="0.5" strokeDasharray="2 4" />
                </g>

                {/* 2. Main Hand Holographic Contour */}
                <g>
                  {/* Palm & Wrist Contour Fill */}
                  <path
                    d="M170,520 C140,510 130,470 120,400 C110,340 90,260 85,210 C80,175 105,160 115,190 C125,220 145,300 155,340 C155,300 155,180 155,120 C155,85 180,85 185,120 C190,160 195,290 198,340 C200,290 215,130 225,90 C230,65 255,65 258,95 C262,140 265,290 265,340 C270,290 285,150 295,115 C300,90 325,90 325,120 C325,165 320,300 315,350 C325,310 350,220 365,190 C375,170 395,185 385,215 C370,260 345,350 340,410 C335,460 315,520 270,530 Z"
                    fill="url(#palmPinkCyan)"
                    stroke={currentTheme.primary}
                    strokeWidth="2"
                    strokeDasharray="4 2"
                  />

                  {/* Wireframe Grid Texture Pattern Overlay */}
                  <path
                    d="M130,450 Q230,480 330,440 M140,380 Q230,400 335,370 M150,320 Q230,340 330,310 M160,260 Q230,280 310,250"
                    stroke="#ec4899"
                    strokeWidth="0.75"
                    strokeDasharray="2 4"
                    opacity="0.6"
                  />
                </g>

                {/* 3. Glowing Cyan Flex Sensors Channels (Running up 5 fingers) */}
                {showSensors && (
                  <g filter="url(#cyanGlowFilter)">
                    {/* Thumb Sensor Capsule */}
                    <path d="M120,400 L100,280 L92,205" stroke="url(#sensorGrad)" strokeWidth="7" strokeLinecap="round" />
                    {/* Index Sensor Capsule */}
                    <path d="M165,370 L170,240 L172,125" stroke="url(#sensorGrad)" strokeWidth="8" strokeLinecap="round" />
                    {/* Middle Sensor Capsule */}
                    <path d="M225,370 L235,220 L242,95" stroke="url(#sensorGrad)" strokeWidth="8" strokeLinecap="round" />
                    {/* Ring Sensor Capsule */}
                    <path d="M285,370 L292,240 L308,120" stroke="url(#sensorGrad)" strokeWidth="8" strokeLinecap="round" />
                    {/* Pinky Sensor Capsule */}
                    <path d="M330,390 L350,280 L372,200" stroke="url(#sensorGrad)" strokeWidth="7" strokeLinecap="round" />

                    {/* Inner Sensor Highlights */}
                    <path d="M120,400 L100,280 L92,205" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
                    <path d="M165,370 L170,240 L172,125" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
                    <path d="M225,370 L235,220 L242,95" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
                    <path d="M285,370 L292,240 L308,120" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
                    <path d="M330,390 L350,280 L372,200" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
                  </g>
                )}

                {/* 4. Circuit Traces & Joint Interconnects */}
                {showCircuits && (
                  <g>
                    <path d="M120,400 Q180,420 235,410 Q290,420 330,390" stroke="#00f0ff" strokeWidth="1.5" strokeDasharray="4 2" />
                    <path d="M235,410 L235,480" stroke="#ec4899" strokeWidth="2" strokeDasharray="3 3" />
                    <path d="M170,240 Q235,250 292,240" stroke="#8b5cf6" strokeWidth="1.5" strokeDasharray="3 3" />
                  </g>
                )}

                {/* 5. Microcontroller Chip Layer */}
                {showChip && (
                  <g className={`transition-all duration-500 ${isExploded ? 'translate-y-[45px]' : ''}`}>
                    <rect x="200" y="455" width="70" height="50" rx="10" fill="#0a0f1e" stroke="#00f0ff" strokeWidth="2.5" />
                    <rect x="205" y="460" width="60" height="40" rx="6" fill="#00f0ff" fillOpacity="0.1" />
                    <text x="235" y="485" textAnchor="middle" fill="#00f0ff" fontSize="11" fontFamily="var(--font-orbitron)" fontWeight="bold">
                      XIAO
                    </text>
                  </g>
                )}

                {/* 6. Glowing Joint Nodes (Knuckles, Phalanges, Fingertips) */}
                {[
                  // Fingertips
                  { cx: 92, cy: 205 },
                  { cx: 172, cy: 125 },
                  { cx: 242, cy: 95 },
                  { cx: 308, cy: 120 },
                  { cx: 372, cy: 200 },
                  // Joints PIP
                  { cx: 100, cy: 280 },
                  { cx: 170, cy: 240 },
                  { cx: 235, cy: 220 },
                  { cx: 292, cy: 240 },
                  { cx: 350, cy: 280 },
                  // Knuckles MCP
                  { cx: 120, cy: 400 },
                  { cx: 165, cy: 370 },
                  { cx: 225, cy: 370 },
                  { cx: 285, cy: 370 },
                  { cx: 330, cy: 390 },
                ].map((node, i) => (
                  <g key={i}>
                    <circle cx={node.cx} cy={node.cy} r="8" fill="#00f0ff" fillOpacity="0.3" className="animate-ping" />
                    <circle cx={node.cx} cy={node.cy} r="6" fill="#00f0ff" stroke="#ffffff" strokeWidth="1.5" className="animate-node-pulse" />
                  </g>
                ))}

                {/* 7. Connecting Leader Lines for Badges */}
                {badges.map((b) => (
                  <g key={b.id}>
                    <circle cx={b.targetX} cy={b.targetY} r="4" fill="#00f0ff" />
                  </g>
                ))}

              </svg>

              {/* Cyan Leader Badges Positioned Around Hand */}
              {badges.map((b) => (
                <div
                  key={b.id}
                  className="absolute px-3 py-1.5 rounded-full bg-[#0a0f1e]/90 border border-[#00f0ff]/50 text-[#00f0ff] font-orbitron text-[10px] tracking-wider shadow-[0_0_15px_rgba(0,240,255,0.4)] hidden sm:flex items-center gap-1.5 transition-all hover:scale-105"
                  style={{ top: `${b.y}%`, left: `${b.x}%` }}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00f0ff] animate-ping" />
                  <span>{b.label}</span>
                </div>
              ))}

            </div>
          </div>

          {/* Bottom Scanline effect */}
          <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-[#00f0ff] via-[#0066ff] to-[#8b5cf6]" />
        </div>

        {/* RIGHT: CONTROLS PANEL (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="glass-card p-6 space-y-6">
            
            <div className="flex items-center gap-2 border-b border-white/10 pb-4">
              <Layers className="w-5 h-5 text-[#00f0ff]" />
              <h2 className="font-orbitron font-bold text-base text-white">CONTROLS PANEL</h2>
            </div>

            {/* 1. ROTATE VIEW SLIDER */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-orbitron">
                <span className="text-[#94a3b8] flex items-center gap-1.5">
                  <RotateCw className="w-3.5 h-3.5 text-[#00f0ff]" /> ROTATE 3D VIEW
                </span>
                <span className="text-[#00f0ff] font-mono">{rotation}°</span>
              </div>
              <input
                type="range"
                min="-60"
                max="60"
                value={rotation}
                onChange={(e) => setRotation(Number(e.target.value))}
                className="w-full accent-[#00f0ff] bg-[#030712] cursor-pointer"
              />
            </div>

            {/* 2. COLOR THEME SELECTOR */}
            <div className="space-y-2">
              <span className="text-xs font-orbitron text-[#94a3b8] flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5 text-[#8b5cf6]" /> COLOR SCHEME
              </span>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'cyan' as const, label: 'CYAN', color: '#00f0ff' },
                  { id: 'purple' as const, label: 'PURPLE', color: '#8b5cf6' },
                  { id: 'pink' as const, label: 'PINK', color: '#ec4899' },
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setTheme(t.id)}
                    className={`py-2 rounded-xl text-xs font-orbitron border transition-all ${
                      theme === t.id
                        ? 'bg-white/10 border-[#00f0ff] text-white shadow-[0_0_15px_rgba(0,240,255,0.3)]'
                        : 'bg-[#030712] border-white/10 text-[#94a3b8] hover:text-white'
                    }`}
                  >
                    <span className="inline-block w-2 h-2 rounded-full mr-1.5" style={{ background: t.color }} />
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 3. LAYER TOGGLES */}
            <div className="space-y-3 pt-2">
              <span className="text-xs font-orbitron text-[#94a3b8] block">
                HOLOGRAPHIC LAYERS
              </span>

              <div className="space-y-2 text-xs">
                <label className="p-3 rounded-xl bg-[#030712] border border-white/10 flex items-center justify-between cursor-pointer hover:border-[#00f0ff]/40">
                  <span className="font-rajdhani font-semibold text-white uppercase">FLEX SENSORS</span>
                  <input
                    type="checkbox"
                    checked={showSensors}
                    onChange={(e) => setShowSensors(e.target.checked)}
                    className="accent-[#00f0ff] w-4 h-4"
                  />
                </label>

                <label className="p-3 rounded-xl bg-[#030712] border border-white/10 flex items-center justify-between cursor-pointer hover:border-[#00f0ff]/40">
                  <span className="font-rajdhani font-semibold text-white uppercase">CIRCUIT TRACES</span>
                  <input
                    type="checkbox"
                    checked={showCircuits}
                    onChange={(e) => setShowCircuits(e.target.checked)}
                    className="accent-[#8b5cf6] w-4 h-4"
                  />
                </label>

                <label className="p-3 rounded-xl bg-[#030712] border border-white/10 flex items-center justify-between cursor-pointer hover:border-[#00f0ff]/40">
                  <span className="font-rajdhani font-semibold text-white uppercase">XIAO CHIP LAYER</span>
                  <input
                    type="checkbox"
                    checked={showChip}
                    onChange={(e) => setShowChip(e.target.checked)}
                    className="accent-[#ec4899] w-4 h-4"
                  />
                </label>
              </div>
            </div>

            {/* 4. EXPLODE VIEW BUTTON */}
            <button
              onClick={() => setIsExploded(!isExploded)}
              className="btn-outline w-full text-center flex items-center justify-center gap-2 py-3"
            >
              {isExploded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              <span>{isExploded ? 'COLLAPSE LAYERS' : 'EXPLODE LAYERS'}</span>
            </button>

          </div>
        </div>

      </div>

    </div>
  );
};
