'use client';

import React, { useState } from 'react';
import { 
  Eye, 
  RotateCw, 
  Palette, 
  Layers, 
  Sparkles,
  Maximize2,
  Minimize2,
  Sliders
} from 'lucide-react';

export const HolographicGloveView: React.FC = () => {
  const [rotationY, setRotationY] = useState(12);
  const [rotationX, setRotationX] = useState(8);
  const [theme, setTheme] = useState<'cyan' | 'purple' | 'pink'>('cyan');
  const [showSensors, setShowSensors] = useState(true);
  const [showNeuralMesh, setShowNeuralMesh] = useState(true);
  const [showAnatomyLines, setShowAnatomyLines] = useState(true);
  const [showChip, setShowChip] = useState(true);
  const [isExploded, setIsExploded] = useState(false);

  const themeColors = {
    cyan: { primary: '#00f0ff', secondary: '#0066ff', accent: '#ec4899', glow: 'rgba(0, 240, 255, 0.55)' },
    purple: { primary: '#8b5cf6', secondary: '#c084fc', accent: '#00f0ff', glow: 'rgba(139, 92, 246, 0.55)' },
    pink: { primary: '#ec4899', secondary: '#f472b6', accent: '#00f0ff', glow: 'rgba(236, 72, 153, 0.55)' },
  };

  const currentTheme = themeColors[theme];

  // Anatomical leader badges linked to precise human hand coordinates
  const badges = [
    { id: 'flex', label: 'DIGITAL FLEX SENSORS', x: 10, y: 12, targetX: 150, targetY: 70 },
    { id: 'voice', label: 'SYNTHETIC VOICE ENGINE', x: 70, y: 10, targetX: 225, targetY: 40 },
    { id: 'ai', label: 'EDGE ML QUANTIZED MODEL', x: 6, y: 42, targetX: 180, targetY: 290 },
    { id: 'imu', label: '6-AXIS IMU (G-FORCE / ROT)', x: 74, y: 44, targetX: 320, targetY: 330 },
    { id: 'chip', label: 'XIAO nRF52840 MCU', x: 8, y: 76, targetX: 225, targetY: 440 },
    { id: 'ble', label: 'BLE 5.0 NORDIC UART', x: 72, y: 78, targetX: 270, targetY: 510 },
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#00f0ff]/20 pb-5">
        <div>
          <span className="px-2.5 py-0.5 rounded bg-[#00f0ff]/20 text-[#00f0ff] font-orbitron text-[10px] tracking-widest uppercase">
            ANATOMICAL 3D TELEMETRY MATRIX
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

      {/* Main 3D Display & Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* CENTER DISPLAY: HYPER-REALISTIC ANATOMICAL HUMAN HAND (8 cols) */}
        <div className="lg:col-span-8 glass-card p-6 min-h-[560px] flex flex-col justify-between relative overflow-hidden bg-gradient-to-b from-[#0a0f1e] via-[#030712] to-[#0a0f1e]">
          
          {/* Top Status */}
          <div className="flex items-center justify-between text-xs font-orbitron z-10">
            <span className="text-[#00f0ff] flex items-center gap-2">
              <Eye className="w-4 h-4 animate-pulse" />
              BIOMECHANICAL HUMAN HAND MATRIX
            </span>
            <span className="text-[#94a3b8]">
              PERSPECTIVE: {rotationY}° Y / {rotationX}° X
            </span>
          </div>

          {/* 3D Perspective Stage Container */}
          <div 
            className="relative w-full h-[470px] flex items-center justify-center my-2"
            style={{
              perspective: '1200px',
              transformStyle: 'preserve-3d',
            }}
          >
            <div 
              className="relative w-full h-full max-w-[560px] flex items-center justify-center transition-transform duration-300 ease-out"
              style={{
                transform: `rotateY(${rotationY}deg) rotateX(${rotationX}deg)`,
                transformStyle: 'preserve-3d',
              }}
            >
              
              {/* SVG Hologram */}
              <svg 
                viewBox="0 0 450 560" 
                className={`w-full h-full max-h-[460px] transition-all duration-700 ${
                  isExploded ? 'translate-y-[-30px] scale-105' : ''
                }`}
                style={{ filter: `drop-shadow(0 0 30px ${currentTheme.glow})` }}
              >
                <defs>
                  {/* Organic Human Skin Translucency Shader */}
                  <linearGradient id="humanSkinGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#ec4899" stopOpacity="0.55" />
                    <stop offset="35%" stopColor="#8b5cf6" stopOpacity="0.45" />
                    <stop offset="70%" stopColor="#0066ff" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#00f0ff" stopOpacity="0.25" />
                  </linearGradient>

                  {/* Volumetric Sensor Cylinder Shading */}
                  <linearGradient id="sensorTubeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#0066ff" />
                    <stop offset="30%" stopColor="#00f0ff" />
                    <stop offset="70%" stopColor="#ffffff" />
                    <stop offset="100%" stopColor="#00f0ff" />
                  </linearGradient>

                  {/* Cybernetic Glow Filter */}
                  <filter id="handGlowFilter" x="-30%" y="-30%" width="160%" height="160%">
                    <feGaussianBlur stdDeviation="5" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>

                {/* 1. Concentric Radial Target Rings (Background Cyber Space) */}
                <g opacity="0.3">
                  <circle cx="225" cy="280" r="230" stroke="#00f0ff" strokeWidth="1" fill="none" strokeDasharray="6 6" />
                  <circle cx="225" cy="280" r="170" stroke="#8b5cf6" strokeWidth="1" fill="none" />
                  <circle cx="225" cy="280" r="110" stroke="#ec4899" strokeWidth="1" fill="none" strokeDasharray="4 4" />
                  <line x1="0" y1="280" x2="450" y2="280" stroke="#00f0ff" strokeWidth="0.5" strokeDasharray="2 4" />
                  <line x1="225" y1="0" x2="225" y2="560" stroke="#00f0ff" strokeWidth="0.5" strokeDasharray="2 4" />
                </g>

                {/* 2. ANATOMICALLY ACCURATE REAL HUMAN HAND CONTOUR & MUSCLE STRUCTURE */}
                <g>
                  {/* Organic Human Hand Silhouette Path */}
                  <path
                    d="
                      M 160 540 
                      C 150 510, 140 480, 130 440 
                      C 115 410, 90 350, 75 300 
                      C 60 250, 50 210, 55 175 
                      C 60 145, 80 140, 90 165 
                      C 102 195, 118 245, 135 290 
                      C 135 240, 138 170, 140 120 
                      C 142 80, 160 70, 168 105 
                      C 175 145, 185 235, 192 280 
                      C 196 230, 205 130, 215 80 
                      C 220 50, 238 50, 242 80 
                      C 246 130, 252 230, 255 285 
                      C 260 235, 272 135, 282 100 
                      C 288 75, 306 75, 310 105 
                      C 314 150, 310 240, 305 295 
                      C 315 260, 335 190, 350 155 
                      C 360 135, 378 145, 372 175 
                      C 362 220, 342 290, 335 345 
                      C 328 395, 320 440, 290 500 
                      C 275 525, 245 545, 210 545 
                      Z
                    "
                    fill="url(#humanSkinGrad)"
                    stroke={currentTheme.primary}
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                  {/* Anatomical Palm Lines & Creases (Life Line, Head Line, Heart Line) */}
                  {showAnatomyLines && (
                    <g opacity="0.75" stroke="#ec4899" strokeWidth="1.2" fill="none">
                      {/* Thenar Crease (Life Line) */}
                      <path d="M 130 290 C 120 340, 135 410, 175 465" strokeDasharray="4 2" />
                      {/* Head Line */}
                      <path d="M 115 315 C 170 330, 240 335, 300 310" strokeDasharray="3 3" />
                      {/* Heart Line */}
                      <path d="M 125 280 C 190 285, 260 270, 320 290" strokeDasharray="4 2" />
                      {/* Wrist Creases */}
                      <path d="M 165 510 C 200 520, 240 520, 275 510" stroke="#00f0ff" strokeWidth="1" />
                      <path d="M 170 525 C 200 533, 240 533, 270 525" stroke="#00f0ff" strokeWidth="1" />
                    </g>
                  )}

                  {/* Anatomical Fingernails Outlines */}
                  <g opacity="0.6" stroke="#00f0ff" strokeWidth="1" fill="none">
                    <path d="M 60 178 Q 72 168 82 173" />
                    <path d="M 144 112 Q 154 100 164 108" />
                    <path d="M 220 72 Q 228 60 238 72" />
                    <path d="M 288 95 Q 296 85 304 95" />
                    <path d="M 356 160 Q 364 150 370 162" />
                  </g>

                  {/* Cybernetic Organic Neural Mesh Overlay */}
                  {showNeuralMesh && (
                    <g opacity="0.5" stroke="#8b5cf6" strokeWidth="0.8" fill="none" strokeDasharray="2 3">
                      <path d="M 140 440 Q 210 470, 280 430" />
                      <path d="M 125 370 Q 210 390, 310 360" />
                      <path d="M 115 310 Q 210 320, 315 310" />
                      <path d="M 100 240 Q 150 250, 195 240" />
                      <path d="M 140 180 Q 210 185, 290 185" />
                    </g>
                  )}
                </g>

                {/* 3. GLOWING 3D FLEX SENSOR CHANNELS (Following organic bone curves) */}
                {showSensors && (
                  <g filter="url(#handGlowFilter)">
                    {/* Thumb Sensor Tube */}
                    <path d="M 125 400 L 95 280 L 70 175" stroke="url(#sensorTubeGrad)" strokeWidth="8" strokeLinecap="round" />
                    {/* Index Finger Sensor Tube */}
                    <path d="M 160 360 L 155 235 L 150 70" stroke="url(#sensorTubeGrad)" strokeWidth="8.5" strokeLinecap="round" />
                    {/* Middle Finger Sensor Tube */}
                    <path d="M 225 350 L 225 210 L 225 40" stroke="url(#sensorTubeGrad)" strokeWidth="9" strokeLinecap="round" />
                    {/* Ring Finger Sensor Tube */}
                    <path d="M 280 360 L 288 230 L 295 65" stroke="url(#sensorTubeGrad)" strokeWidth="8.5" strokeLinecap="round" />
                    {/* Pinky Sensor Tube */}
                    <path d="M 325 380 L 345 270 L 365 145" stroke="url(#sensorTubeGrad)" strokeWidth="7.5" strokeLinecap="round" />

                    {/* Inner Intense Core Highlight */}
                    <path d="M 125 400 L 95 280 L 70 175" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" />
                    <path d="M 160 360 L 155 235 L 150 70" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" />
                    <path d="M 225 350 L 225 210 L 225 40" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" />
                    <path d="M 280 360 L 288 230 L 295 65" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" />
                    <path d="M 325 380 L 345 270 L 365 145" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" />
                  </g>
                )}

                {/* 4. MICROCONTROLLER CHIP MOUNTED ON PALM */}
                {showChip && (
                  <g className={`transition-all duration-500 ${isExploded ? 'translate-y-[45px]' : ''}`}>
                    <rect x="190" y="420" width="70" height="50" rx="10" fill="#0a0f1e" stroke="#00f0ff" strokeWidth="2.5" />
                    <rect x="195" y="425" width="60" height="40" rx="6" fill="#00f0ff" fillOpacity="0.12" />
                    <text x="225" y="450" textAnchor="middle" fill="#00f0ff" fontSize="11" fontFamily="var(--font-orbitron)" fontWeight="bold">
                      XIAO
                    </text>
                  </g>
                )}

                {/* 5. ANATOMICAL KNUCKLE & JOINT GLOWING NODES (DIP, PIP, MCP) */}
                {[
                  // Fingertip Nodes (Distal Phalanges)
                  { cx: 70, cy: 175 },
                  { cx: 150, cy: 70 },
                  { cx: 225, cy: 40 },
                  { cx: 295, cy: 65 },
                  { cx: 365, cy: 145 },
                  // DIP Joints
                  { cx: 80, cy: 220 },
                  { cx: 153, cy: 140 },
                  { cx: 225, cy: 110 },
                  { cx: 292, cy: 135 },
                  { cx: 357, cy: 195 },
                  // PIP Joints
                  { cx: 95, cy: 280 },
                  { cx: 156, cy: 220 },
                  { cx: 225, cy: 195 },
                  { cx: 288, cy: 215 },
                  { cx: 345, cy: 260 },
                  // MCP Knuckles
                  { cx: 125, cy: 400 },
                  { cx: 160, cy: 360 },
                  { cx: 225, cy: 350 },
                  { cx: 280, cy: 360 },
                  { cx: 325, cy: 380 },
                ].map((node, i) => (
                  <g key={i}>
                    <circle cx={node.cx} cy={node.cy} r="9" fill="#00f0ff" fillOpacity="0.25" className="animate-ping" />
                    <circle cx={node.cx} cy={node.cy} r="6.5" fill="#00f0ff" stroke="#ffffff" strokeWidth="1.8" className="animate-node-pulse" />
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

          {/* Bottom Scanline Bar */}
          <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-[#00f0ff] via-[#0066ff] to-[#8b5cf6]" />
        </div>

        {/* RIGHT: CONTROLS PANEL (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="glass-card p-6 space-y-6">
            
            <div className="flex items-center gap-2 border-b border-white/10 pb-4">
              <Layers className="w-5 h-5 text-[#00f0ff]" />
              <h2 className="font-orbitron font-bold text-base text-white">CONTROLS PANEL</h2>
            </div>

            {/* 1. ROTATE VIEW SLIDERS (Y & X AXIS) */}
            <div className="space-y-4">
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs font-orbitron">
                  <span className="text-[#94a3b8] flex items-center gap-1.5">
                    <RotateCw className="w-3.5 h-3.5 text-[#00f0ff]" /> ROTATE Y-AXIS
                  </span>
                  <span className="text-[#00f0ff] font-mono">{rotationY}°</span>
                </div>
                <input
                  type="range"
                  min="-60"
                  max="60"
                  value={rotationY}
                  onChange={(e) => setRotationY(Number(e.target.value))}
                  className="w-full accent-[#00f0ff] bg-[#030712] cursor-pointer"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs font-orbitron">
                  <span className="text-[#94a3b8] flex items-center gap-1.5">
                    <Sliders className="w-3.5 h-3.5 text-[#8b5cf6]" /> TILT X-AXIS
                  </span>
                  <span className="text-[#8b5cf6] font-mono">{rotationX}°</span>
                </div>
                <input
                  type="range"
                  min="-30"
                  max="30"
                  value={rotationX}
                  onChange={(e) => setRotationX(Number(e.target.value))}
                  className="w-full accent-[#8b5cf6] bg-[#030712] cursor-pointer"
                />
              </div>
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

            {/* 3. ANATOMICAL LAYER TOGGLES */}
            <div className="space-y-3 pt-2">
              <span className="text-xs font-orbitron text-[#94a3b8] block">
                ANATOMICAL LAYERS
              </span>

              <div className="space-y-2 text-xs">
                <label className="p-3 rounded-xl bg-[#030712] border border-white/10 flex items-center justify-between cursor-pointer hover:border-[#00f0ff]/40">
                  <span className="font-rajdhani font-semibold text-white uppercase">FLEX SENSORS TUBES</span>
                  <input
                    type="checkbox"
                    checked={showSensors}
                    onChange={(e) => setShowSensors(e.target.checked)}
                    className="accent-[#00f0ff] w-4 h-4"
                  />
                </label>

                <label className="p-3 rounded-xl bg-[#030712] border border-white/10 flex items-center justify-between cursor-pointer hover:border-[#00f0ff]/40">
                  <span className="font-rajdhani font-semibold text-white uppercase font-bold">NEURAL MESH</span>
                  <input
                    type="checkbox"
                    checked={showNeuralMesh}
                    onChange={(e) => setShowNeuralMesh(e.target.checked)}
                    className="accent-[#8b5cf6] w-4 h-4"
                  />
                </label>

                <label className="p-3 rounded-xl bg-[#030712] border border-white/10 flex items-center justify-between cursor-pointer hover:border-[#00f0ff]/40">
                  <span className="font-rajdhani font-semibold text-white uppercase">PALM CREASES & LINE</span>
                  <input
                    type="checkbox"
                    checked={showAnatomyLines}
                    onChange={(e) => setShowAnatomyLines(e.target.checked)}
                    className="accent-[#ec4899] w-4 h-4"
                  />
                </label>

                <label className="p-3 rounded-xl bg-[#030712] border border-white/10 flex items-center justify-between cursor-pointer hover:border-[#00f0ff]/40">
                  <span className="font-rajdhani font-semibold text-white uppercase">XIAO MCU LAYER</span>
                  <input
                    type="checkbox"
                    checked={showChip}
                    onChange={(e) => setShowChip(e.target.checked)}
                    className="accent-[#00f0ff] w-4 h-4"
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
