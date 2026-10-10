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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-[#111827] rounded-xl border border-[#E4E7EC] dark:border-[#1F2937] shadow-2xl w-full max-w-lg overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#F0F2F5] dark:border-[#1F2937]">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#E0F2FE] dark:bg-[#0E7490]/30 flex items-center justify-center text-[#0E7490] dark:text-[#38BDF8]">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
            </div>
            <div>
              <h2 className="text-sm font-bold text-[#101828] dark:text-[#F9FAFB]">
                Sensor Calibration Wizard
              </h2>
              <p className="text-[11px] text-[#667085] dark:text-[#9CA3AF]">
                Calibrate resistance limits for Index, Middle, and Ring fingers
              </p>
            </div>
          </div>
          <button
            onClick={() => setCalibrationOpen(false)}
            className="p-1 rounded-lg text-[#667085] hover:bg-[#F2F4F7] dark:hover:bg-[#1F2937]"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Live Sensor Monitor */}
        <div className="p-4 bg-[#F8F9FA] dark:bg-[#1A2230] border-b border-[#F0F2F5] dark:border-[#1F2937]">
          <div className="text-[11px] font-semibold text-[#475467] dark:text-[#9CA3AF] uppercase mb-2">
            Live ADC Feed (50 Hz)
          </div>
          <div className="grid grid-cols-3 gap-2">
            {SENSOR_NAMES.map((name, i) => (
              <div
                key={name}
                className="bg-white dark:bg-[#111827] p-2 rounded-lg border border-[#E4E7EC] dark:border-[#374151] text-center"
              >
                <div className="text-[10px] text-[#667085] dark:text-[#9CA3AF] font-medium">{name}</div>
                <div className="font-mono text-base font-bold text-[#101828] dark:text-[#F9FAFB]">
                  {smoothedSensors[i] ?? 0}
                </div>
                <div className="text-[9px] text-[#98A2B3] font-mono">raw: {rawSensors[i] ?? 0}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Wizard Steps */}
        <div className="p-4 space-y-4">
          <div className="flex border-b border-[#E4E7EC] dark:border-[#1F2937] pb-2 text-xs font-medium">
            {(['straight', 'bent', 'manual'] as const).map((step, idx) => (
              <button
                key={step}
                onClick={() => setActiveStep(step)}
                className={`pb-1 px-3 border-b-2 transition-colors ${
                  activeStep === step
                    ? 'border-[#0E7490] text-[#0E7490] font-bold'
                    : 'border-transparent text-[#667085] hover:text-[#101828]'
                }`}
              >
                {idx + 1}. {step === 'straight' ? 'Flat / Straight' : step === 'bent' ? 'Fully Curled' : 'Fine-Tune'}
              </button>
            ))}
          </div>

          {activeStep === 'straight' && (
            <div className="space-y-3">
              <p className="text-xs text-[#475467] dark:text-[#9CA3AF]">
                Hold your hand completely flat with all fingers straight (unflexed).
              </p>
              <button
                onClick={handleCaptureStraight}
                className="w-full py-2.5 px-4 bg-[#0E7490] hover:bg-[#155E75] text-white text-xs font-semibold rounded-lg transition-colors"
              >
                Capture Straight Baseline
              </button>
            </div>
          )}

          {activeStep === 'bent' && (
            <div className="space-y-3">
              <p className="text-xs text-[#475467] dark:text-[#9CA3AF]">
                Curl fingers into a tight fist (maximum flex resistor deflection).
              </p>
              <button
                onClick={handleCaptureBent}
                className="w-full py-2.5 px-4 bg-[#F59E0B] hover:bg-[#D97706] text-white text-xs font-semibold rounded-lg transition-colors"
              >
                Capture Curled Limit
              </button>
            </div>
          )}

          {activeStep === 'manual' && (
            <div className="space-y-3">
              <div className="text-xs text-[#475467] dark:text-[#9CA3AF]">
                Calculated midpoint thresholds (saved to localStorage):
              </div>
              <div className="space-y-2 font-mono text-xs">
                {SENSOR_NAMES.map((name, i) => (
                  <div
                    key={name}
                    className="p-2 rounded bg-[#F8F9FA] dark:bg-[#1A2230] border border-[#E4E7EC] dark:border-[#374151] flex items-center justify-between"
                  >
                    <span className="font-semibold text-[#101828] dark:text-[#F9FAFB]">{name}</span>
                    <div className="flex gap-3 text-[11px] text-[#667085] dark:text-[#9CA3AF]">
                      <span>Straight: {calibration.straight[i]}</span>
                      <span className="font-bold text-[#0E7490]">Thresh: {calibration.thresholds[i]}</span>
                      <span>Bent: {calibration.bent[i]}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#F8F9FA] dark:bg-[#1A2230] border-t border-[#F0F2F5] dark:border-[#1F2937] flex items-center justify-between">
          <button
            onClick={resetCalibration}
            className="text-xs text-[#D92D20] hover:underline"
          >
            Reset Factory Defaults
          </button>
          <button
            onClick={() => setCalibrationOpen(false)}
            className="py-1.5 px-4 bg-[#101828] dark:bg-[#F9FAFB] text-white dark:text-[#101828] text-xs font-medium rounded-lg"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default CalibrationModal;
