// SIGNOVA Clinical Diagnostics Studio & Telemetry Workspace
// Route: /studio
// Internal diagnostics workspace for hardware operators, live BLE/Serial connection,
// 3D anatomical hand kinematics, 50Hz oscilloscope, and gesture classification.

'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AppHeader } from '@/components/layout/AppHeader';
import { ConnectionPanel } from '@/components/hardware/ConnectionPanel';
import { ClinicalHandVisualization } from '@/components/hardware/ClinicalHandVisualization';
import { GestureCard } from '@/components/hardware/GestureCard';
import { SensorChannels } from '@/components/hardware/SensorChannels';
import { CalibrationModal } from '@/components/hardware/CalibrationModal';
import { SettingsModal } from '@/components/hardware/SettingsModal';
import { ToastContainer } from '@/components/hardware/ToastContainer';
import { JudgeDemoStrip } from '@/components/hardware/JudgeDemoStrip';
import { AuthModal } from '@/components/AuthModal';
import { simulationService } from '@/services/simulationService';
import { useAuthStore } from '@/store/authStore';

export default function StudioPage() {
  const router = useRouter();
  const { isAuthenticated, openAuthModal, initAuthListener } = useAuthStore();

  useEffect(() => {
    const unsub = initAuthListener();
    return () => unsub();
  }, [initAuthListener]);

  // Initialize keyboard listeners for keys 1–8 simulation
  useEffect(() => {
    simulationService.initKeyboardListeners();
    return () => {
      simulationService.removeKeyboardListeners();
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#07090D] text-[#F3F4F6] flex flex-col font-sans selection:bg-[#00F2A6] selection:text-[#07090D]">
      {/* 56px Clinical Header Bar */}
      <AppHeader />

      {/* Live Ideathon Judge Metric & Quick-Trigger Strip */}
      <JudgeDemoStrip />

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
      <footer className="w-full border-t border-[#1F2733] bg-[#0A0D12] py-3 px-4 sm:px-6 text-xs text-[#9CA3AF]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white">SIGNOVA</span>
            <span>· Assistive Gesture-to-Speech Neural Glove</span>
            <span>—</span>
            <span className="text-[#00F2A6] font-semibold">Team Syntropy</span>
          </div>

          <div className="flex items-center gap-3 font-mono text-[11px] text-[#6B7280]">
            <span>Seeed XIAO / Uno</span>
            <span>•</span>
            <span className="text-[#9CA3AF]">115200 Baud</span>
            <span>•</span>
            <span className="text-[#00F2A6]">3 Flex Channels</span>
            <span>•</span>
            <span className="text-[#00D2FF]">400ms Debounce</span>
          </div>
        </div>
      </footer>

      {/* Modals & Feedback Overlays */}
      <CalibrationModal />
      <SettingsModal />
      <ToastContainer />
      <AuthModal />
    </div>
  );
}
