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
    cyan: { primary: '#00f0ff', secondary: '#0066ff', glow: 'rgba(0, 240, 255, 0.4)' },
    purple: { primary: '#8b5cf6', secondary: '#c084fc', glow: 'rgba(139, 92, 246, 0.4)' },
    pink: { primary: '#ec4899', secondary: '#f472b6', glow: 'rgba(236, 72, 153, 0.4)' },
  };

  const currentTheme = themeColors[theme];

  const badges = [
    { label: 'FLEX SENSORS', x: 22, y: 18 },
    { label: '6-AXIS IMU', x: 78, y: 35 },
    { label: 'XIAO nRF52840', x: 20, y: 70 },
    { label: 'BLE 5.0 ANTENNA', x: 80, y: 75 },
    { label: 'EDGE AI MODEL', x: 18, y: 45 },
    { label: 'VOICE OUTPUT', x: 82, y: 20 },
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
        <div className="lg:col-span-8 glass-card p-6 min-h-[480px] flex flex-col justify-between relative overflow-hidden">
          
          {/* Top Status Indicators */}
          <div className="flex items-center justify-between text-xs font-orbitron z-10">
            <span className="text-[#00f0ff] flex items-center gap-2">
              <Eye className="w-4 h-4 animate-pulse" />
              HOLOGRAPHIC MATRIX ACTIVE
            </span>
            <span className="text-[#94a3b8]">
              PERSPECTIVE: {rotation}° Y-AXIS
            </span>
          </div>

          {/* Holographic Wireframe View Container with 3D Perspective */}
          <div 
            className="relative w-full h-[400px] flex items-center justify-center my-4 transition-transform duration-500 ease-out"
            style={{
              perspective: '1000px',
              transformStyle: 'preserve-3d',
            }}
          >
            <div 
              className="relative w-full h-full max-w-[500px] flex items-center justify-center transition-transform duration-300"
              style={{
                transform: `rotateY(${rotation}deg) rotateX(10deg)`,
                transformStyle: 'preserve-3d',
              }}
            >
              
              {/* Layer 1: Holographic Background Grid Disk */}
              <div 
                className="absolute inset-x-8 bottom-4 h-32 rounded-full border border-[#00f0ff]/30 bg-[#00f0ff]/5 animate-pulse blur-[1px]"
                style={{ transform: 'rotateX(80deg) translateZ(-60px)' }}
              />

              {/* Layer 2: Main SVG Hand Wireframe */}
              <svg 
                viewBox="0 0 500 600" 
                className={`w-full h-full max-h-[380px] transition-all duration-700 ${
                  isExploded ? 'translate-y-[-20px] scale-105' : ''
                }`}
                style={{ filter: `drop-shadow(0 0 15px ${currentTheme.glow})` }}
              >
                <defs>
                  <linearGradient id="gloveGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor={currentTheme.primary} stopOpacity="0.8" />
                    <stop offset="100%" stopColor={currentTheme.secondary} stopOpacity="0.4" />
                  </linearGradient>
                </defs>

                {/* Hand Palm Outline */}
                <path
                  d="M170,480 L140,360 L120,270 L100,190 C100,160 120,160 125,190 L150,290 L160,140 C160,110 180,110 185,140 L205,280 L220,110 C220,80 240,80 245,110 L260,285 L275,150 C275,120 295,120 298,150 L310,310 L330,220 C330,190 350,190 350,220 L330,360 L310,480 Z"
                  fill="url(#gloveGrad)"
                  stroke={currentTheme.primary}
                  strokeWidth="2"
                  strokeDasharray="6 3"
                  className="transition-all duration-500"
                />

                {/* Sensors Overlay Layer */}
                {showSensors && (
                  <g className="transition-opacity duration-300">
                    {/* 5 Flex Sensors Strips */}
                    <path d="M125,190 L150,290 L160,400" stroke="#00f0ff" strokeWidth="4" strokeLinecap="round" />
                    <path d="M185,140 L205,280 L210,410" stroke="#00f0ff" strokeWidth="4" strokeLinecap="round" />
                    <path d="M245,110 L260,285 L260,415" stroke="#00f0ff" strokeWidth="4" strokeLinecap="round" />
                    <path d="M298,150 L310,310 L295,420" stroke="#00f0ff" strokeWidth="4" strokeLinecap="round" />
                    <path d="M350,220 L330,360 L315,440" stroke="#00f0ff" strokeWidth="4" strokeLinecap="round" />
                  </g>
                )}

                {/* Circuit Traces Layer */}
                {showCircuits && (
                  <g className="transition-opacity duration-300">
                    <path d="M160,400 Q210,430 260,415" stroke="#8b5cf6" strokeWidth="2" strokeDasharray="4 2" />
                    <path d="M210,410 Q240,460 250,500" stroke="#ec4899" strokeWidth="2" strokeDasharray="3 3" />
                    <circle cx="210" cy="410" r="4" fill="#00f0ff" className="animate-pulse" />
                    <circle cx="260" cy="415" r="4" fill="#ec4899" className="animate-pulse" />
                  </g>
                )}

                {/* Microcontroller Chip Layer */}
                {showChip && (
                  <g className={`transition-all duration-500 ${isExploded ? 'translate-y-[40px]' : ''}`}>
                    <rect x="200" y="460" width="70" height="50" rx="8" fill="#0a0f1e" stroke="#00f0ff" strokeWidth="2" />
                    <text x="235" y="490" textAnchor="middle" fill="#00f0ff" fontSize="10" fontFamily="var(--font-orbitron)">XIAO</text>
                  </g>
                )}

                {/* Fingertip Glowing Nodes */}
                {[
                  { cx: 125, cy: 190 },
                  { cx: 185, cy: 140 },
                  { cx: 245, cy: 110 },
                  { cx: 298, cy: 150 },
                  { cx: 350, cy: 220 },
                ].map((node, i) => (
                  <circle
                    key={i}
                    cx={node.cx}
                    cy={node.cy}
                    r="7"
                    fill={currentTheme.primary}
                    className="animate-node-pulse"
                  />
                ))}
              </svg>

              {/* Holographic Cyan Leader Badges */}
              {badges.map((b) => (
                <div
                  key={b.label}
                  className="absolute px-2.5 py-1 rounded-full bg-[#0a0f1e]/90 border border-[#00f0ff]/40 text-[#00f0ff] font-orbitron text-[9px] tracking-wider shadow-[0_0_12px_rgba(0,240,255,0.3)] hidden sm:block pointer-events-none"
                  style={{ top: `${b.y}%`, left: `${b.x}%` }}
                >
                  {b.label}
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
