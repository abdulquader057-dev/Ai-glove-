'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { 
  Layers, 
  Activity, 
  Cpu, 
  Wifi, 
  Sliders, 
  Sparkles,
  Eye,
  EyeOff
} from 'lucide-react';
import { FlexSensors } from '@/types';

export const ProductPage: React.FC = () => {
  const [selectedHotspot, setSelectedHotspot] = useState<string | null>('flex');
  const [selectedFinger, setSelectedFinger] = useState<keyof FlexSensors>('index');
  const [rotationY, setRotationY] = useState(12);
  const [showHotspotPins, setShowHotspotPins] = useState(true);

  const hotspots = [
    {
      id: 'flex',
      title: '5 DIGITAL FLEX SENSORS',
      subtitle: 'Resistive Flexion Detection',
      icon: Layers,
      x: '35%',
      y: '22%',
      details: 'Custom carbon-matrix resistive bend sensors positioned across all 5 phalangeal joints. Changes electrical resistance from 10kΩ (straight) to 40kΩ (90° flex).',
      spec: '10-bit ADC resolution, 100,000 bend cycles rating.',
    },
    {
      id: 'imu',
      title: '6-AXIS IMU SENSOR',
      subtitle: 'Spatial Motion & Orientation',
      icon: Activity,
      x: '68%',
      y: '48%',
      details: 'LSM6DS3 3-axis accelerometer (±16g) + 3-axis gyroscope (±2000 dps) tracking hand rotation, tilt speed, and spatial acceleration vectors in 3D space.',
      spec: '50Hz sampling rate, complementary quaternion filter.',
    },
    {
      id: 'mcu',
      title: 'XIAO nRF52840 MCU',
      subtitle: 'ARM Cortex-M4 Microcontroller',
      icon: Cpu,
      x: '48%',
      y: '72%',
      details: 'Seeed Studio XIAO nRF52840 processor running lightweight C++ embedded sensor reading, median noise filtering, and BLE GATT characteristic streaming.',
      spec: '64 MHz CPU, 1MB Flash, 256KB RAM, onboard charging.',
    },
    {
      id: 'ble',
      title: 'BLE 5.0 TRANSCEIVER',
      subtitle: 'Nordic UART Service Protocol',
      icon: Wifi,
      x: '62%',
      y: '80%',
      details: 'Bluetooth 5.0 Low Energy wireless protocol delivering sub-15ms telemetry latency directly to web browser Web Bluetooth GATT client.',
      spec: '2.4 GHz ISM band, 2Mbps PHY data rate, 10m range.',
    },
  ];

  const fingerSpecs: Record<keyof FlexSensors, { label: string; flexVal: number; desc: string }> = {
    thumb: { label: 'THUMB SENSOR', flexVal: 15, desc: 'Tracks thenar flex and opposable thumb pinch movements.' },
    index: { label: 'INDEX SENSOR', flexVal: 85, desc: 'Primary pointing & trigger finger flexion detector.' },
    middle: { label: 'MIDDLE SENSOR', flexVal: 90, desc: 'Longest digit sensor tracking central fist curvature.' },
    ring: { label: 'RING SENSOR', flexVal: 80, desc: 'Coordinates secondary grip and full fist closure.' },
    pinky: { label: 'PINKY SENSOR', flexVal: 75, desc: 'Detects pinky extension for specialized gestures.' },
  };

  const activeHotspotObj = hotspots.find(h => h.id === selectedHotspot) || hotspots[0];

  return (
    <div className="space-y-16 animate-fadeIn pb-12">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="px-3 py-1 rounded-full bg-[#00f0ff]/10 border border-[#00f0ff]/30 text-[#00f0ff] font-orbitron text-xs tracking-widest uppercase">
          HARDWARE EXPLORATION LAB
        </span>
        <h1 className="font-orbitron font-extrabold text-3xl sm:text-5xl text-white tracking-tight">
          MEET THE <span className="text-gradient-cyan">AI GLOVE</span>
        </h1>
        <p className="text-sm sm:text-base text-[#94a3b8] font-inter">
          A wearable interface that transforms physical hand movement into machine-readable information. Click hardware hotspots to inspect individual components.
        </p>
      </div>

      {/* Main Interactive 3D Stage & Hotspot Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* CENTER 3D GLOVE STAGE (7 cols) */}
        <div className="lg:col-span-7 glass-card p-6 min-h-[560px] flex flex-col justify-between relative overflow-hidden bg-gradient-to-b from-[#0a0f1e] via-[#030712] to-[#0a0f1e]">
          
          {/* Top Stage Bar */}
          <div className="flex items-center justify-between text-xs font-orbitron z-10">
            <span className="text-[#00f0ff] flex items-center gap-2">
              <Sparkles className="w-4 h-4 animate-pulse" />
              HARDWARE COMPONENT INSPECTOR
            </span>

            <button
              onClick={() => setShowHotspotPins(!showHotspotPins)}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#030712] border border-[#00f0ff]/30 text-[#00f0ff] text-[10px] font-orbitron hover:bg-[#00f0ff]/10 transition-all"
            >
              {showHotspotPins ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
              <span>{showHotspotPins ? 'HOTSPOT PINS ON' : 'HOTSPOT PINS OFF'}</span>
            </button>
          </div>

          {/* 3D Glove Container */}
          <div 
            className="relative w-full h-[460px] flex items-center justify-center my-2"
            style={{ perspective: '1000px' }}
          >
            <div 
              className="relative w-full h-full max-w-[520px] flex items-center justify-center transition-transform duration-300 ease-out"
              style={{ transform: `rotateY(${rotationY}deg)` }}
            >
              <Image
                src="/ai-glove-hero.jpg"
                alt="AI Glove Hardware Hotspots"
                fill
                priority
                className="object-contain drop-shadow-[0_0_35px_rgba(0,240,255,0.6)]"
              />

              {/* Sleek Interactive Hotspot Pins */}
              {showHotspotPins && hotspots.map((h) => {
                const isSelected = selectedHotspot === h.id;
                return (
                  <button
                    key={h.id}
                    onClick={() => setSelectedHotspot(h.id)}
                    title={`Inspect ${h.title}`}
                    className={`absolute w-7 h-7 rounded-full transition-all duration-300 flex items-center justify-center z-20 ${
                      isSelected 
                        ? 'bg-[#00f0ff] text-[#030712] scale-125 ring-4 ring-[#00f0ff]/40 shadow-[0_0_20px_#00f0ff]' 
                        : 'bg-[#0a0f1e]/90 border border-[#00f0ff] text-[#00f0ff] hover:scale-110 shadow-[0_0_12px_rgba(0,240,255,0.4)]'
                    }`}
                    style={{ top: h.y, left: h.x }}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-current" />
                  </button>
                );
              })}

            </div>
          </div>

          {/* Rotation Slider */}
          <div className="flex items-center justify-between gap-4 pt-4 border-t border-white/10 z-10">
            <span className="text-xs font-orbitron text-[#94a3b8] flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-[#00f0ff]" /> ROTATE STAGE
            </span>
            <input
              type="range"
              min="-40"
              max="40"
              value={rotationY}
              onChange={(e) => setRotationY(Number(e.target.value))}
              className="w-48 accent-[#00f0ff] bg-[#030712] cursor-pointer"
            />
          </div>

        </div>

        {/* RIGHT HOTSPOT INFORMATION PANEL (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Active Hotspot Technical Card */}
          <div className="glass-card p-6 space-y-6 border-[#00f0ff]/30 bg-gradient-to-br from-[#0a0f1e] to-[#030712]">
            
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-[#00f0ff]/10 border border-[#00f0ff] text-[#00f0ff]">
                  <activeHotspotObj.icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-orbitron font-bold text-base text-white">
                    {activeHotspotObj.title}
                  </h3>
                  <span className="text-xs font-rajdhani text-[#00f0ff] font-semibold">
                    {activeHotspotObj.subtitle}
                  </span>
                </div>
              </div>
            </div>

            <p className="text-xs text-[#94a3b8] font-inter leading-relaxed">
              {activeHotspotObj.details}
            </p>

            <div className="p-4 rounded-xl bg-[#030712] border border-white/10 space-y-1">
              <span className="text-[10px] font-orbitron text-[#94a3b8] uppercase tracking-wider block">
                ENGINEERING SPECIFICATION
              </span>
              <span className="text-xs font-orbitron text-[#00f0ff] font-bold">
                {activeHotspotObj.spec}
              </span>
            </div>

            {/* Hotspot Selector Switchers */}
            <div className="grid grid-cols-2 gap-2 pt-2">
              {hotspots.map((h) => (
                <button
                  key={h.id}
                  onClick={() => setSelectedHotspot(h.id)}
                  className={`p-3 rounded-xl text-left border text-xs font-orbitron transition-all ${
                    selectedHotspot === h.id 
                      ? 'bg-[#00f0ff]/15 border-[#00f0ff] text-white shadow-[0_0_15px_rgba(0,240,255,0.2)]' 
                      : 'bg-[#030712] border-white/10 text-[#94a3b8] hover:text-white'
                  }`}
                >
                  <span className="block text-[10px] text-[#00f0ff] mb-0.5">0{hotspots.indexOf(h) + 1}</span>
                  {h.title.split(' ')[0]} {h.title.split(' ')[1]}
                </button>
              ))}
            </div>

          </div>

          {/* INDIVIDUAL FINGER FLEX SENSOR INSPECTOR */}
          <div className="glass-card p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <span className="font-orbitron font-bold text-xs text-white uppercase tracking-wider">
                FINGER FLEX RESISTANCE INSPECTOR
              </span>
              <span className="text-xs text-[#00f0ff] font-mono">10-BIT ADC</span>
            </div>

            {/* Finger Selector Tabs */}
            <div className="grid grid-cols-5 gap-1.5">
              {(['thumb', 'index', 'middle', 'ring', 'pinky'] as (keyof FlexSensors)[]).map((f) => (
                <button
                  key={f}
                  onClick={() => setSelectedFinger(f)}
                  className={`py-2 rounded-lg text-[10px] font-orbitron uppercase border transition-all ${
                    selectedFinger === f 
                      ? 'bg-[#00f0ff] border-[#00f0ff] text-[#030712] font-bold shadow-[0_0_12px_#00f0ff]' 
                      : 'bg-[#030712] border-white/10 text-[#94a3b8] hover:text-white'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>

            {/* Selected Finger Detail */}
            <div className="p-4 rounded-xl bg-[#030712] border border-white/10 space-y-3">
              <div className="flex justify-between items-center text-xs font-orbitron">
                <span className="text-white font-bold">{fingerSpecs[selectedFinger].label}</span>
                <span className="text-[#00f0ff] font-mono">{fingerSpecs[selectedFinger].flexVal}% FLEXION</span>
              </div>

              <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden border border-white/10">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#00f0ff] to-[#8b5cf6] shadow-[0_0_10px_#00f0ff] transition-all duration-500"
                  style={{ width: `${fingerSpecs[selectedFinger].flexVal}%` }}
                />
              </div>

              <p className="text-[11px] text-[#94a3b8] font-inter">
                {fingerSpecs[selectedFinger].desc}
              </p>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
