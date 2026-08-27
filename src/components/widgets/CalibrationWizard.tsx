'use client';

import React, { useState, useEffect } from 'react';
import { CheckCircle2, RotateCw, Sparkles } from 'lucide-react';

export const CalibrationWizard: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [progress, setProgress] = useState(0);
  const [isCapturing, setIsCapturing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const steps = [
    { step: 1, title: 'OPEN HAND', pose: '✋', instruction: 'Extend all 5 fingers fully open and hold still.' },
    { step: 2, title: 'CLOSED FIST', pose: '✊', instruction: 'Curl all 5 fingers firmly into a fist.' },
    { step: 3, title: 'NEUTRAL POSE', pose: '🖐️', instruction: 'Relax hand in comfortable resting position.' },
  ];

  const activeStepObj = steps[currentStep - 1];

  const handleStartCapture = () => {
    setIsCapturing(true);
    setProgress(0);
  };

  useEffect(() => {
    if (!isCapturing) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsCapturing(false);
          if (currentStep < 3) {
            setCurrentStep((s) => s + 1);
          } else {
            setIsComplete(true);
          }
          return 100;
        }
        return prev + 10;
      });
    }, 200);

    return () => clearInterval(interval);
  }, [isCapturing, currentStep]);

  return (
    <div className="space-y-6 text-center max-w-xl mx-auto py-2">
      <div className="space-y-1">
        <span className="px-3 py-1 rounded-full bg-[#00f0ff]/10 border border-[#00f0ff]/30 text-[#00f0ff] font-orbitron text-xs tracking-widest uppercase">
          HARDWARE CALIBRATION WIZARD
        </span>
        <h3 className="font-orbitron font-bold text-xl text-white">3-STEP GESTURE CALIBRATION</h3>
      </div>

      {!isComplete ? (
        <div className="p-8 rounded-2xl bg-[#030712] border border-[#00f0ff]/30 space-y-6">
          <div className="flex justify-between items-center text-xs font-orbitron text-[#94a3b8]">
            <span>STEP 0{activeStepObj.step} OF 03</span>
            <span className="text-[#00f0ff]">{activeStepObj.title}</span>
          </div>

          {/* Pose Emoji & Progress Circle */}
          <div className="relative w-32 h-32 mx-auto flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="44" stroke="#0a0f1e" strokeWidth="8" fill="none" />
              <circle
                cx="50"
                cy="50"
                r="44"
                stroke="#00f0ff"
                strokeWidth="8"
                fill="none"
                strokeDasharray="276"
                strokeDashoffset={276 - (276 * progress) / 100}
                className="transition-all duration-200"
              />
            </svg>
            <div className="absolute text-5xl animate-bounce">{activeStepObj.pose}</div>
          </div>

          <div className="space-y-2">
            <h4 className="font-orbitron font-extrabold text-lg text-white">{activeStepObj.title}</h4>
            <p className="text-xs text-[#94a3b8] font-inter">{activeStepObj.instruction}</p>
          </div>

          <button
            onClick={handleStartCapture}
            disabled={isCapturing}
            className="btn-primary w-full py-4 text-xs font-rajdhani font-bold flex items-center justify-center gap-2"
          >
            {isCapturing ? <RotateCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            <span>{isCapturing ? `CAPTURING TELEMETRY (${progress}%)...` : 'START CAPTURE'}</span>
          </button>
        </div>
      ) : (
        <div className="p-8 rounded-2xl bg-[#10b981]/10 border border-[#10b981]/40 space-y-4 text-center">
          <CheckCircle2 className="w-12 h-12 text-[#10b981] mx-auto animate-bounce" />
          <h4 className="font-orbitron font-extrabold text-xl text-white">CALIBRATION COMPLETE</h4>
          <p className="text-xs text-[#94a3b8] font-inter">5-Flex &amp; 6-Axis IMU sensor thresholds successfully mapped to active profile.</p>
          <button
            onClick={() => {
              setIsComplete(false);
              setCurrentStep(1);
              setProgress(0);
            }}
            className="btn-outline text-xs"
          >
            RE-CALIBRATE GLOVE
          </button>
        </div>
      )}
    </div>
  );
};
