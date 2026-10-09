// SIGNOVA - Assistive Gesture-to-Voice Device Interface
// Team Syntropy
// Medical Clinical Interface for Seeed XIAO nRF52840 Sense & Arduino Uno
// Hardware pipeline is frozen: 115200 baud, "f1,f2,f3\n" @ ~50Hz, 400ms debounce hold guard.

'use client';

import React, { useEffect } from 'react';
import { AppHeader } from '@/components/layout/AppHeader';
import { ConnectionPanel } from '@/components/hardware/ConnectionPanel';
import { ClinicalHandVisualization } from '@/components/hardware/ClinicalHandVisualization';
import { GestureCard } from '@/components/hardware/GestureCard';
import { SensorChannels } from '@/components/hardware/SensorChannels';
import { CalibrationModal } from '@/components/hardware/CalibrationModal';
import { SettingsModal } from '@/components/hardware/SettingsModal';
import { ToastContainer } from '@/components/hardware/ToastContainer';
import { simulationService } from '@/services/simulationService';

export default function Home() {
  // Initialize keyboard listeners for keys 1–8
  useEffect(() => {
    simulationService.initKeyboardListeners();
    return () => {
      simulationService.removeKeyboardListeners();
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#F6F7F9] dark:bg-[#0B0F17] text-[#101828] dark:text-[#F9FAFB] flex flex-col font-sans selection:bg-[#E0F2FE] selection:text-[#0C4A6E]">
      {/* 56px Clinical Header Bar */}
      <AppHeader />

      {/* Main 12-Column Clinical Device Dashboard */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 py-5">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* Left Column (3 cols): Hardware Connection & 8-Gesture Dictionary */}
          <div className="lg:col-span-3 w-full">
            <ConnectionPanel />
          </div>

          {/* Center Column (6 cols): Anatomical Hand Kinematics & Recognized Gesture Card */}
          <div className="lg:col-span-6 w-full flex flex-col gap-5">
            <ClinicalHandVisualization />
            <GestureCard />
          </div>

          {/* Right Column (3 cols): Live Flex Channels, Oscilloscope & Session Log */}
          <div className="lg:col-span-3 w-full">
            <SensorChannels />
          </div>
        </div>
      </main>

      {/* Clinical Telemetry Footer */}
      <footer className="w-full border-t border-[#E4E7EC] dark:border-[#1F2937] bg-white dark:bg-[#111827] py-3.5 px-4 sm:px-6 text-xs text-[#667085] dark:text-[#9CA3AF]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#101828] dark:text-[#F9FAFB]">SIGNOVA</span>
            <span>· Assistive Neural Glove</span>
            <span>—</span>
            <span>Team Syntropy</span>
          </div>

          <div className="flex items-center gap-3 font-mono text-[11px]">
            <span>Seeed XIAO / Uno</span>
            <span>•</span>
            <span>115200 Baud</span>
            <span>•</span>
            <span>3 Flex Channels</span>
            <span>•</span>
            <span>400ms Debounce</span>
          </div>
        </div>
      </footer>

      {/* Modals & Feedback Overlays */}
      <CalibrationModal />
      <SettingsModal />
      <ToastContainer />
    </div>
  );
}
