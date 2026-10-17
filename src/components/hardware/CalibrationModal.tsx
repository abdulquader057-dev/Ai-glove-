'use client';

// CalibrationModal — guided 3-step calibration wizard
// Team Syntropy - SIGNOVA
// Reads from store: isCalibrationOpen, setCalibrationOpen, calibration, setStraightCalibration, setBentCalibration, resetCalibration, rawSensors, smoothedSensors

import React, { useState } from 'react';
import { useSignovaStore } from '@/store/signovaStore';
import { SENSOR_NAMES } from '@/config/signova.config';

export const CalibrationModal: React.FC = () => {
  const {
    isCalibrationOpen,
    setCalibrationOpen,
    calibration,
    setStraightCalibration,
    setBentCalibration,
    resetCalibration,
    autoCalibrateRestPose,
    rawSensors,
    smoothedSensors,
  } = useSignovaStore();

  const [activeStep, setActiveStep] = useState<'straight' | 'bent' | 'manual'>('straight');

  if (!isCalibrationOpen) return null;

  const handleCaptureStraight = () => {
    setStraightCalibration([...smoothedSensors]);
    setActiveStep('bent');
  };

  const handleCaptureBent = () => {
    setBentCalibration([...smoothedSensors]);
    setActiveStep('manual');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm font-mono">
      <div className="bg-[#0E1218] rounded-xl border border-[#1F2733] shadow-2xl w-full max-w-lg overflow-hidden animate-scale-pop">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#1F2733]">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#2EE6A6]/10 border border-[#2EE6A6]/30 flex items-center justify-center text-[#2EE6A6]">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
            </div>
            <div>
              <h2 className="text-sm font-bold text-white tracking-wide">
                Sensor Calibration Wizard
              </h2>
              <p className="text-[11px] text-[#9CA3AF]">
                Calibrate resistance limits for Index, Middle, and Ring fingers
              </p>
            </div>
          </div>
          <button
            onClick={() => setCalibrationOpen(false)}
            className="p-1 rounded-lg text-[#9CA3AF] hover:bg-[#141922] hover:text-white"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Live Sensor Monitor */}
        <div className="p-4 bg-[#07090D] border-b border-[#1F2733]">
          <div className="text-[11px] font-bold text-[#9CA3AF] uppercase mb-2 flex items-center justify-between">
            <span>Live ADC Telemetry (50 Hz)</span>
            <span className="text-[#2EE6A6] text-[10px]">Active</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {SENSOR_NAMES.map((name, i) => (
              <div
                key={name}
                className="bg-[#0E1218] p-2.5 rounded-lg border border-[#1F2733] text-center"
              >
                <div className="text-[10px] text-[#9CA3AF] font-medium">{name}</div>
                <div className="font-mono text-lg font-extrabold text-[#2EE6A6] mt-0.5">
                  {smoothedSensors[i] ?? 0}
                </div>
                <div className="text-[9px] text-[#6B7280] font-mono">raw: {rawSensors[i] ?? 0}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Wizard Steps */}
        <div className="p-4 space-y-4">
          <div className="flex border-b border-[#1F2733] pb-2 text-xs font-semibold">
            {(['straight', 'bent', 'manual'] as const).map((step, idx) => (
              <button
                key={step}
                onClick={() => setActiveStep(step)}
                className={`pb-1 px-3 border-b-2 transition-colors cursor-pointer ${
                  activeStep === step
                    ? 'border-[#2EE6A6] text-[#2EE6A6] font-bold'
                    : 'border-transparent text-[#6B7280] hover:text-[#9CA3AF]'
                }`}
              >
                {idx + 1}. {step === 'straight' ? 'Flat / Straight' : step === 'bent' ? 'Fully Curled' : 'Fine-Tune'}
              </button>
            ))}
          </div>

          {activeStep === 'straight' && (
            <div className="space-y-3">
              <p className="text-xs text-[#9CA3AF]">
                Hold your hand completely flat with all fingers straight (unflexed).
              </p>
              <div className="flex gap-2">
                <button
                  onClick={handleCaptureStraight}
                  className="flex-1 py-2.5 px-3 bg-[#141922] hover:bg-[#1E2533] border border-[#2EE6A6]/50 text-[#2EE6A6] text-xs font-bold rounded-lg transition-colors cursor-pointer"
                >
                  Capture Straight (Step 1 of 2)
                </button>
                <button
                  onClick={() => {
                    autoCalibrateRestPose();
                    setActiveStep('manual');
                  }}
                  className="py-2.5 px-3 bg-[#2EE6A6] hover:bg-[#22C58B] text-[#07090D] text-xs font-black rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <span>⚡ 1-Click Auto Zero</span>
                </button>
              </div>
            </div>
          )}

          {activeStep === 'bent' && (
            <div className="space-y-3">
              <p className="text-xs text-[#9CA3AF]">
                Curl fingers into a tight fist (maximum flex resistor deflection).
              </p>
              <button
                onClick={handleCaptureBent}
                className="w-full py-2.5 px-4 bg-[#F59E0B] hover:bg-[#D97706] text-[#07090D] text-xs font-black rounded-lg transition-colors cursor-pointer"
              >
                Capture Curled Limit (Step 2 of 2)
              </button>
            </div>
          )}

          {activeStep === 'manual' && (
            <div className="space-y-3">
              <div className="text-xs text-[#9CA3AF]">
                Calculated midpoint thresholds (saved to localStorage):
              </div>
              <div className="space-y-2 font-mono text-xs">
                {SENSOR_NAMES.map((name, i) => (
                  <div
                    key={name}
                    className="p-2.5 rounded bg-[#07090D] border border-[#1F2733] flex items-center justify-between"
                  >
                    <span className="font-bold text-white">{name}</span>
                    <div className="flex gap-3 text-[11px] text-[#9CA3AF]">
                      <span>Straight: {calibration.straight[i]}</span>
                      <span className="font-bold text-[#2EE6A6]">Thresh: {calibration.thresholds[i]}</span>
                      <span>Bent: {calibration.bent[i]}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#07090D] border-t border-[#1F2733] flex items-center justify-between">
          <button
            onClick={resetCalibration}
            className="text-xs text-[#EF4444] hover:underline cursor-pointer"
          >
            Reset Factory Defaults
          </button>
          <button
            onClick={() => setCalibrationOpen(false)}
            className="py-1.5 px-4 bg-[#2EE6A6] hover:bg-[#22C58B] text-[#07090D] text-xs font-black rounded-lg cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default CalibrationModal;
