'use client';

import React, { useState } from 'react';
import Image from 'next/image';
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
  const [rotationY, setRotationY] = useState(8);
  const [rotationX, setRotationX] = useState(4);
  const [theme, setTheme] = useState<'cyan' | 'purple' | 'pink'>('cyan');
  const [showSensors, setShowSensors] = useState(true);
  const [showNeuralMesh, setShowNeuralMesh] = useState(true);
  const [showChip, setShowChip] = useState(true);
  const [isExploded, setIsExploded] = useState(false);

  const themeFilters = {
    cyan: 'hue-rotate(0deg) brightness(1.15)',
    purple: 'hue-rotate(60deg) brightness(1.2)',
    pink: 'hue-rotate(120deg) brightness(1.25)',
  };

  // Anatomical leader badges linked to dorsal x-ray human hand coordinates
  const badges = [
    { id: 'flex', label: 'CYAN FLEX SENSORS', x: 8, y: 14, targetX: '45%', targetY: '25%' },
    { id: 'voice', label: 'SYNTHETIC VOICE TTS', x: 72, y: 12, targetX: '58%', targetY: '18%' },
    { id: 'ai', label: 'EDGE ML QUANTIZED MODEL', x: 5, y: 46, targetX: '38%', targetY: '52%' },
    { id: 'imu', label: '6-AXIS IMU (G-FORCE/ROT)', x: 74, y: 48, targetX: '65%', targetY: '54%' },
    { id: 'chip', label: 'XIAO nRF52840 MCU', x: 8, y: 78, targetX: '50%', targetY: '76%' },
    { id: 'ble', label: 'BLE 5.0 NORDIC UART', x: 72, y: 80, targetX: '62%', targetY: '82%' },
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#00f0ff]/20 pb-5">
        <div>
          <span className="px-2.5 py-0.5 rounded bg-[#00f0ff]/20 text-[#00f0ff] font-orbitron text-[10px] tracking-widest uppercase">
            ANATOMICAL DORSAL X-RAY MATRIX
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
        
        {/* CENTER DISPLAY: EXACT 3D HOLOGRAPHIC X-RAY HUMAN HAND (8 cols) */}
        <div className="lg:col-span-8 glass-card p-6 min-h-[580px] flex flex-col justify-between relative overflow-hidden bg-gradient-to-b from-[#0a0f1e] via-[#030712] to-[#0a0f1e]">
          
          {/* Top Status */}
          <div className="flex items-center justify-between text-xs font-orbitron z-10">
            <span className="text-[#00f0ff] flex items-center gap-2">
              <Eye className="w-4 h-4 animate-pulse" />
              TRANSLUCENT BLUE X-RAY HAND HOLOGRAM
            </span>
            <span className="text-[#94a3b8]">
              PERSPECTIVE: {rotationY}° Y / {rotationX}° X
            </span>
          </div>

          {/* 3D Perspective Stage Container */}
          <div 
            className="relative w-full h-[480px] flex items-center justify-center my-2"
            style={{
              perspective: '1200px',
              transformStyle: 'preserve-3d',
            }}
          >
            <div 
              className="relative w-full h-full max-w-[580px] flex items-center justify-center transition-transform duration-300 ease-out"
              style={{
                transform: `rotateY(${rotationY}deg) rotateX(${rotationX}deg)`,
                transformStyle: 'preserve-3d',
                filter: themeFilters[theme],
              }}
            >
              
              {/* Exact 3D Holographic X-Ray Human Hand Render */}
              <div className={`relative w-full h-full flex items-center justify-center transition-all duration-700 ${
                isExploded ? 'scale-105 translate-y-[-20px]' : ''
              }`}>
                <Image
                  src="/holographic-xray-hand.jpg"
                  alt="3D Holographic X-Ray Human Hand Render"
                  fill
                  priority
                  className="object-contain drop-shadow-[0_0_35px_rgba(0,240,255,0.7)]"
                />

                {/* Interactive Exploded Micro-Chip Overlay */}
                {showChip && (
                  <div className={`absolute bottom-[18%] left-[48%] -translate-x-1/2 transition-all duration-500 ${
                    isExploded ? 'translate-y-[45px] scale-110' : ''
                  }`}>
                    <div className="px-3 py-1.5 rounded-lg bg-[#0a0f1e]/90 border-2 border-[#00f0ff] shadow-[0_0_20px_rgba(0,240,255,0.8)] text-[#00f0ff] font-orbitron font-bold text-xs tracking-wider flex items-center gap-1.5 animate-pulse">
                      <span className="w-2 h-2 rounded-full bg-[#00f0ff]" />
                      XIAO nRF52840 MCU
                    </div>
                  </div>
                )}
              </div>

              {/* Cyan Leader Badges Positioned Around Hand */}
              {badges.map((b) => (
                <div
                  key={b.id}
                  className="absolute px-3.5 py-1.5 rounded-full bg-[#0a0f1e]/95 border-2 border-[#00f0ff]/70 text-[#00f0ff] font-orbitron text-[10px] tracking-wider shadow-[0_0_20px_rgba(0,240,255,0.6)] hidden sm:flex items-center gap-2 transition-all hover:scale-110 cursor-pointer backdrop-blur-md z-20"
                  style={{ top: `${b.y}%`, left: `${b.x}%` }}
                >
                  <span className="w-2 h-2 rounded-full bg-[#00f0ff] animate-ping" />
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
                  min="-45"
                  max="45"
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
                  min="-25"
                  max="25"
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
                  <span className="font-rajdhani font-semibold text-white uppercase">FLEX SENSORS CHANNELS</span>
                  <input
                    type="checkbox"
                    checked={showSensors}
                    onChange={(e) => setShowSensors(e.target.checked)}
                    className="accent-[#00f0ff] w-4 h-4"
                  />
                </label>

                <label className="p-3 rounded-xl bg-[#030712] border border-white/10 flex items-center justify-between cursor-pointer hover:border-[#00f0ff]/40">
                  <span className="font-rajdhani font-semibold text-white uppercase font-bold">NEURAL MESH OVERLAY</span>
                  <input
                    type="checkbox"
                    checked={showNeuralMesh}
                    onChange={(e) => setShowNeuralMesh(e.target.checked)}
                    className="accent-[#8b5cf6] w-4 h-4"
                  />
                </label>

                <label className="p-3 rounded-xl bg-[#030712] border border-white/10 flex items-center justify-between cursor-pointer hover:border-[#00f0ff]/40">
                  <span className="font-rajdhani font-semibold text-white uppercase">XIAO MCU HARDWARE</span>
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
