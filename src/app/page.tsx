// SIGNOVA - Public Landing Page (Route: /)
// Cinematic dark cybernetic scrollytelling experience inspired by atmos-bits.com
// Team Syntropy - Assistive Kinematics Lab

'use client';

import React, { useEffect } from 'react';
import { LandingPage } from '@/components/landing/LandingPage';
import { AuthModal } from '@/components/AuthModal';
import { useAuthStore } from '@/store/authStore';

export default function Home() {
  const { initAuthListener } = useAuthStore();

  useEffect(() => {
    const unsubscribe = initAuthListener();
    return () => unsubscribe();
  }, [initAuthListener]);

  return (
    <main className="min-h-screen bg-[#05070A] text-[#F3F4F6] font-sans selection:bg-[#00F2A6] selection:text-[#05070A]">
      {/* Pinned Scrollytelling Experience */}
      <LandingPage />

      {/* Firebase Cloud Authentication Modal */}
      <AuthModal />
    </main>
  );
}
