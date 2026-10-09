// Calibrate View (View 3 of 3)
// Team Syntropy - SIGNOVA
// Guided 2-step calibration wizard: Straighten Hand -> Bend Fingers.
// Calculates midpoint threshold per finger: (straight + bent) / 2 and persists to localStorage.

'use client';

import React, { useState } from 'react';
import { RotateCcw, CheckCircle2, Sliders, ArrowRight } from 'lucide-react';
import { useSignovaStore } from '../../store/signovaStore';

export const CalibrateView: React.FC = () => {
  const {
    rawSensors,
    calibration,
    setStraightCalibration,
    setBentCalibration,
    resetCalibration,
    setActiveView,
  } = useSignovaStore();

  const [activeStep, setActiveStep] = useState<1 | 2>(1);
  const [straightCaptured, setStraightCaptured] = useState<boolean>(false);
  const [bentCaptured, setBentCaptured] = useState<boolean>(false);

  const fingerNames = ['Index Finger (CH1)', 'Middle Finger (CH2)', 'Ring Finger (CH3)'];

  const handleCaptureStraight = () => {
    setStraightCalibration([...rawSensors]);
    setStraightCaptured(true);
    setActiveStep(2);
  };

  const handleCaptureBent = () => {
    setBentCalibration([...rawSensors]);
    setBentCaptured(true);
  };

  const handleReset = () => {
    resetCalibration();
    setStraightCaptured(false);
    setBentCaptured(false);
    setActiveStep(1);
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-8 px-4 flex flex-col gap-6 font-mono">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#14181D] border border-[#1F242A] rounded-full text-xs text-[#2EE6A6]">
          <Sliders className="w-3.5 h-3.5 text-[#2EE6A6]" />
          <span>HARDWARE SENSOR CALIBRATION</span>
        </div>
        <h1 className="text-3xl font-black font-sans tracking-tight text-white">
          FLEX SENSOR THRESHOLD TUNER
        </h1>
        <p className="text-sm text-[#9CA3AF] max-w-lg mx-auto font-sans">
          Calibrate individual flex sensor ranges for your hand. Midpoint thresholds are calculated automatically and saved to localStorage.
        </p>
      </div>

      {/* Guided 2-Step Workflow */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Step 1: Straight Hand */}
        <div
          className={`p-6 rounded-sm border transition-colors flex flex-col justify-between gap-4 ${
            activeStep === 1
              ? 'bg-[#0E1C15] border-[#2EE6A6]'
              : 'bg-[#0A0D10] border-[#1F242A]'
          }`}
        >
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-[#2EE6A6]">STEP 01</span>
              {straightCaptured && (
                <span className="text-[#2EE6A6] flex items-center gap-1 text-[11px]">
                  <CheckCircle2 className="w-3.5 h-3.5" /> CAPTURED
                </span>
              )}
            </div>
            <h3 className="text-lg font-bold font-sans text-white">STRAIGHTEN HAND</h3>
            <p className="text-xs text-[#9CA3AF] font-sans">
              Extend your index, middle, and ring fingers fully straight and keep them steady.
            </p>

            {/* Current live readings */}
            <div className="mt-3 p-3 bg-[#080A0D] border border-[#161B22] rounded-xs space-y-1 text-xs">
              <div className="text-[#6B7280] text-[10px]">LIVE RAW READINGS:</div>
              <div className="flex justify-between text-white font-bold">
                <span>IDX: {rawSensors[0] ?? '---'}</span>
                <span>MID: {rawSensors[1] ?? '---'}</span>
                <span>RNG: {rawSensors[2] ?? '---'}</span>
              </div>
            </div>
          </div>

          <button
            onClick={handleCaptureStraight}
            className="w-full py-3 bg-[#14181D] hover:bg-[#1C2128] border border-[#2EE6A6]/60 text-[#2EE6A6] font-bold text-xs tracking-wider rounded-xs transition-colors"
          >
            CAPTURE STRAIGHT VALUES
          </button>
        </div>

        {/* Step 2: Bend Fingers */}
        <div
          className={`p-6 rounded-sm border transition-colors flex flex-col justify-between gap-4 ${
            activeStep === 2
              ? 'bg-[#0E1C15] border-[#2EE6A6]'
              : 'bg-[#0A0D10] border-[#1F242A]'
          }`}
        >
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-[#2EE6A6]">STEP 02</span>
              {bentCaptured && (
                <span className="text-[#2EE6A6] flex items-center gap-1 text-[11px]">
                  <CheckCircle2 className="w-3.5 h-3.5" /> CAPTURED
                </span>
              )}
            </div>
            <h3 className="text-lg font-bold font-sans text-white">BEND FINGERS</h3>
            <p className="text-xs text-[#9CA3AF] font-sans">
              Curl your index, middle, and ring fingers firmly into a closed bend pose and hold.
            </p>

            {/* Current live readings */}
            <div className="mt-3 p-3 bg-[#080A0D] border border-[#161B22] rounded-xs space-y-1 text-xs">
              <div className="text-[#6B7280] text-[10px]">LIVE RAW READINGS:</div>
              <div className="flex justify-between text-white font-bold">
                <span>IDX: {rawSensors[0] ?? '---'}</span>
                <span>MID: {rawSensors[1] ?? '---'}</span>
                <span>RNG: {rawSensors[2] ?? '---'}</span>
              </div>
            </div>
          </div>

          <button
            onClick={handleCaptureBent}
            className="w-full py-3 bg-[#2EE6A6] hover:bg-[#25C48D] text-[#08090A] font-bold text-xs tracking-wider rounded-xs transition-colors"
          >
            CAPTURE BENT VALUES
          </button>
        </div>
      </div>

      {/* Captured Calibration Matrix Table */}
      <div className="bg-[#0A0D10] border border-[#1F242A] p-6 rounded-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#1F242A]">
          <h2 className="text-sm font-bold text-white tracking-wider">
            CALIBRATION MATRIX &amp; MIDPOINT THRESHOLDS
          </h2>
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-1 bg-[#14181D] hover:bg-[#1D232A] border border-[#1F242A] text-xs text-[#9CA3AF] hover:text-white rounded-xs transition-colors"
          >
            <RotateCcw className="w-3 h-3 text-red-400" />
            <span>RESET TO DEFAULTS</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {fingerNames.map((name, i) => {
            const raw = rawSensors[i] ?? 0;
            const straight = calibration.straight[i] ?? 250;
            const bent = calibration.bent[i] ?? 780;
            const threshold = calibration.thresholds[i] ?? 515;

            return (
              <div
                key={name}
                className="p-4 bg-[#0E1216] border border-[#1F242A] rounded-xs space-y-3 text-xs"
              >
                <div className="font-bold text-[#2EE6A6]">{name}</div>

                <div className="space-y-1 text-[11px] text-[#9CA3AF]">
                  <div className="flex justify-between">
                    <span className="text-[#6B7280]">LIVE ADC</span>
                    <span className="text-white font-bold">{raw}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#6B7280]">STRAIGHT (0)</span>
                    <span>{straight}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#6B7280]">BENT (1)</span>
                    <span>{bent}</span>
                  </div>
                  <div className="flex justify-between pt-1 border-t border-[#1F242A] text-yellow-300 font-bold">
                    <span>MIDPOINT THRESHOLD</span>
                    <span>{threshold}</span>
                  </div>
                </div>

                {/* Visual position bar */}
                <div className="relative w-full h-2 bg-[#08090A] border border-[#1F242A] rounded-full overflow-hidden mt-2">
                  <div
                    className="absolute top-0 bottom-0 w-0.5 bg-yellow-400 z-10"
                    style={{
                      left: `${Math.round(((threshold - straight) / (bent - straight || 1)) * 100)}%`,
                    }}
                  />
                  <div
                    className="h-full bg-[#2EE6A6]"
                    style={{
                      width: `${Math.max(
                        0,
                        Math.min(100, Math.round(((raw - straight) / (bent - straight || 1)) * 100))
                      )}%`,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Done Button */}
        <div className="pt-3 border-t border-[#1F242A] flex justify-end">
          <button
            onClick={() => setActiveView('live')}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#2EE6A6] hover:bg-[#25C48D] text-[#08090A] font-bold text-xs tracking-wider rounded-xs transition-colors"
          >
            <span>APPLY &amp; RETURN TO LIVE VIEW</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CalibrateView;
