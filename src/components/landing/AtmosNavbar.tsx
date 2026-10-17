// ATMOS Minimalist Floating Header Dock
// Positioned fixed top, frosted glass, pill dock matching atmos-bits.com architecture

'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { useSignovaStore } from '@/store/signovaStore';

export const AtmosNavbar: React.FC = () => {
  const router = useRouter();
  const { isAuthenticated, openAuthModal } = useAuthStore();
  const { connectionStatus } = useSignovaStore();

  const handleLaunchStudio = () => {
    if (isAuthenticated) {
      router.push('/studio');
    } else {
      openAuthModal();
    }
  };

  const isConnected = connectionStatus === 'connected';

  return (
    <header className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-3rem)] max-w-7xl pointer-events-auto">
      <div className="backdrop-blur-xl bg-black/40 border border-white/10 rounded-full px-6 py-3.5 shadow-[0_12px_40px_rgba(0,0,0,0.6)] flex items-center justify-between transition-all">
        
        {/* Left: Syntropy kinetic icon with "SYNTROPY" text and version tag */}
        <div className="flex items-center gap-4 shrink-0">
          <a href="#hero" className="flex items-center gap-3 group cursor-pointer">
            {/* Inline SVG Kinetic Logo Icon */}
            <svg
              width="34"
              height="34"
              viewBox="0 0 100 100"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="group-hover:scale-105 transition-transform drop-shadow-[0_0_12px_rgba(0,242,166,0.35)]"
            >
              <defs>
                <linearGradient id="navTeal" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#00F2A6" />
                  <stop offset="100%" stopColor="#00D2FF" />
                </linearGradient>
              </defs>
              <path
                d="M 20 70 C 20 40, 45 20, 60 50 C 75 80, 100 60, 100 30"
                stroke="url(#navTeal)"
                strokeWidth="5"
                strokeLinecap="round"
                fill="none"
              />
              <path
                d="M 35 85 C 35 60, 55 40, 70 65 C 85 90, 110 70, 110 45"
                stroke="#00D2FF"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeOpacity="0.75"
                fill="none"
              />
              <circle cx="60" cy="50" r="5" fill="#00F2A6" />
              <circle cx="70" cy="65" r="4" fill="#00D2FF" />
              <circle cx="100" cy="30" r="4.5" fill="#00F2A6" />
            </svg>

            <div className="flex items-center gap-2.5">
              <span className="font-space font-extrabold text-lg tracking-[0.18em] text-[#F6F6F8] group-hover:text-[#00F2A6] transition-colors">
                SYNTROPY
              </span>
              <span className="hidden md:inline-block font-mono text-[10px] tracking-widest text-[#7E8B95] px-2 py-0.5 rounded-full border border-white/5 bg-white/[0.02]">
                [v1.0 · ASSISTIVE KINEMATICS]
              </span>
            </div>
          </a>
        </div>

        {/* Center: Navigation Links */}
        <nav className="hidden lg:flex items-center gap-8 font-mono text-xs tracking-widest text-[#7E8B95]">
          <a
            href="#kinematics"
            className="hover:text-[#F6F6F8] transition-colors hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]"
          >
            01 // KINEMATICS
          </a>
          <a
            href="#architecture"
            className="hover:text-[#F6F6F8] transition-colors hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]"
          >
            02 // ARCHITECTURE
          </a>
          <a
            href="#team"
            className="hover:text-[#F6F6F8] transition-colors hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]"
          >
            03 // TEAM SYNTROPY
          </a>
        </nav>

        {/* Right: Hardware Bridge Status & Solid Bone-White CTA Button */}
        <div className="flex items-center gap-4 shrink-0">
          {/* Hardware Bridge Status */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/5 font-mono text-[11px] text-[#7E8B95]">
            <span
              className={`w-2 h-2 rounded-full ${
                isConnected
                  ? 'bg-[#00F2A6] shadow-[0_0_8px_#00F2A6]'
                  : 'bg-[#00F2A6] animate-pulse shadow-[0_0_8px_#00F2A6]'
              }`}
            />
            <span className="tracking-wider uppercase text-[10px]">
              BRIDGE: <span className="text-[#00F2A6] font-bold">{isConnected ? 'CONNECTED' : 'ONLINE'}</span>
            </span>
          </div>

          {/* Solid Bone-White CTA Button: LAUNCH STUDIO ↗ */}
          <button
            onClick={handleLaunchStudio}
            className="px-5 py-2.5 rounded-full bg-[#F6F6F8] hover:bg-white text-[#050608] font-mono font-bold text-xs tracking-wider transition-all transform hover:scale-105 hover:shadow-[0_0_25px_rgba(246,246,248,0.35)] flex items-center gap-1.5 cursor-pointer"
          >
            <span>LAUNCH STUDIO</span>
            <span className="text-sm leading-none">↗</span>
          </button>
        </div>

      </div>
    </header>
  );
};

export default AtmosNavbar;
