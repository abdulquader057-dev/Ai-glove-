// Live Telemetry View (View 2 of 3)
// Team Syntropy - SIGNOVA
// Features: Dynamic SVG hand schematic, 3 finger bars with calibrated thresholds,
// 50Hz oscilloscope canvas, large gesture readout, 3-bit pattern, history log, and simulation controls.

'use client';

import React, { useState } from 'react';
import { Settings, Square, Repeat } from 'lucide-react';
import { useSignovaStore } from '../../store/signovaStore';
import { HandSchematic } from '../hardware/HandSchematic';
import { FingerBars } from '../hardware/FingerBars';
import { OscilloscopeCanvas } from '../hardware/OscilloscopeCanvas';
import { GestureReadout } from '../hardware/GestureReadout';
import { HistoryTable } from '../hardware/HistoryTable';
import { SettingsPanel } from '../hardware/SettingsPanel';
import { simulationService, GESTURE_SIMULATION_PRESETS } from '../../services/simulationService';

export const LiveView: React.FC = () => {
  const {
    rawSensors,
    smoothedSensors,
    normalizedSensors,
    binaryBits,
    binaryString,
    activeGesture,
    candidateGesture,
    activeConfidence,
    realLatencyMs,
    holdProgress,
    justConfirmed,
    calibration,
    history,
    clearHistory,
    exportHistoryCSV,
    exportHistoryJSON,
    isMuted,
    toggleMute,
    classifierSource,
    isSimulation,
    isReplaying,
    toggleReplay,
    stopSimulation,
  } = useSignovaStore();

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <div className="w-full max-w-7xl mx-auto py-4 px-4 flex flex-col gap-6 font-mono">
      {/* 1. Simulation Alert & Shortcuts Bar (if simulation active) */}
      {isSimulation && (
        <div className="w-full p-3 bg-[#0E1C15] border border-[#2EE6A6]/60 rounded-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#2EE6A6] animate-pulse" />
            <span className="font-bold text-[#2EE6A6] tracking-wider">
              SIMULATION MODE ACTIVE (KEYS 1–8)
            </span>
          </div>

          {/* Quick preset trigger buttons */}
          <div className="flex flex-wrap items-center gap-1.5 text-[10px]">
            {Object.entries(GESTURE_SIMULATION_PRESETS).map(([key, item]) => (
              <button
                key={key}
                onClick={() => simulationService.triggerPreset(key)}
                className="px-2 py-1 bg-[#14181D] hover:bg-[#1F262F] border border-[#1F242A] text-white rounded-xs transition-colors"
                title={`Press key '${key}' or click`}
              >
                [{key}] {item.name}
              </button>
            ))}
          </div>

          {/* Replay Trace Toggle & Stop Button */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleReplay}
              className={`flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-xs border transition-colors ${
                isReplaying
                  ? 'bg-[#2EE6A6] text-[#08090A] border-[#2EE6A6] font-bold'
                  : 'bg-[#14181D] text-[#9CA3AF] border-[#1F242A] hover:text-white'
              }`}
            >
              <Repeat className={`w-3 h-3 ${isReplaying ? 'animate-spin' : ''}`} />
              <span>{isReplaying ? 'REPLAYING TRACE' : 'REPLAY SAMPLE TRACE'}</span>
            </button>

            <button
              onClick={stopSimulation}
              className="flex items-center gap-1 px-2.5 py-1 text-xs bg-[#1F242A] hover:bg-red-950/40 hover:text-red-400 border border-[#374151] text-[#9CA3AF] rounded-xs transition-colors"
            >
              <Square className="w-3 h-3" />
              <span>STOP</span>
            </button>
          </div>
        </div>
      )}

      {/* 2. Top Status & Settings Row */}
      <div className="flex items-center justify-between text-xs pb-1 border-b border-[#1F242A]">
        <div className="flex items-center gap-3">
          <span className="text-[#6B7280]">INSTRUMENT PANEL:</span>
          <span className="text-white font-bold">SEEED XIAO / ARDUINO UNO TELEMETRY</span>
          <span className="hidden sm:inline-block text-[#374151]">|</span>
          <span className="hidden sm:inline-block text-[#9CA3AF]">3 CHANNELS @ 50Hz</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#14181D] hover:bg-[#1D232A] border border-[#1F242A] text-white rounded-xs transition-colors"
          >
            <Settings className="w-3.5 h-3.5 text-[#2EE6A6]" />
            <span>SETTINGS &amp; AUDIO</span>
          </button>
        </div>
      </div>

      {/* 3. Main Asymmetric Instrument Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Hand Schematic & Channel Meters (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          {/* Dynamic SVG Hand Schematic */}
          <HandSchematic
            normalizedFingers={normalizedSensors}
            binaryBits={binaryBits}
            rawSensors={rawSensors}
          />

          {/* 3 Finger Bars */}
          <FingerBars
            rawSensors={rawSensors}
            smoothedSensors={smoothedSensors}
            thresholds={calibration.thresholds}
            straight={calibration.straight}
            bent={calibration.bent}
            binaryBits={binaryBits}
          />
        </div>

        {/* Right Column: Gesture Readout & Oscilloscope (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          {/* Gesture Readout Panel */}
          <GestureReadout
            activeGesture={activeGesture}
            candidateGesture={candidateGesture}
            confidence={activeConfidence}
            realLatencyMs={realLatencyMs}
            binaryBits={binaryBits}
            binaryString={binaryString}
            holdProgress={holdProgress}
            justConfirmed={justConfirmed}
            isMuted={isMuted}
            onToggleMute={toggleMute}
            classifierSource={classifierSource}
          />

          {/* Scrolling Oscilloscope Canvas */}
          <OscilloscopeCanvas smoothedSensors={smoothedSensors} />

          {/* Telemetry History Table with CSV / JSON Disk Export */}
          <HistoryTable
            history={history}
            onClear={clearHistory}
            onExportCSV={exportHistoryCSV}
            onExportJSON={exportHistoryJSON}
          />
        </div>
      </div>

      {/* Settings Modal */}
      <SettingsPanel
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </div>
  );
};

export default LiveView;
