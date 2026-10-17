'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import TeamSyntropyLogo from '@/components/brand/TeamSyntropyLogo';
import { useAuthStore } from '@/store/authStore';
import { useSignovaStore } from '@/store/signovaStore';
import { Sparkles, Terminal, ArrowUpRight } from 'lucide-react';

export const LandingNavbar: React.FC = () => {
  const router = useRouter();
  const { isAuthenticated, openAuthModal, user } = useAuthStore();
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
    <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-7xl">
      <div className="backdrop-blur-md bg-black/50 border border-white/10 rounded-2xl px-4 sm:px-6 py-2.5 shadow-[0_10px_35px_rgba(0,0,0,0.6)] flex items-center justify-between transition-all">
        
        {/* Left: Team Syntropy Logo & SIGNOVA OS Glowing Badge */}
        <div className="flex items-center gap-3 sm:gap-4 shrink-0">
          <a href="#overview" className="flex items-center group cursor-pointer">
            <TeamSyntropyLogo width={160} height={36} className="group-hover:opacity-90 transition-opacity" />
          </a>
          
          <div className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#00F2A6]/10 border border-[#00F2A6]/30 text-[#00F2A6] text-[10px] font-mono font-bold tracking-widest uppercase shadow-[0_0_15px_rgba(0,242,166,0.2)]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00F2A6] animate-pulse" />
            <span>SIGNOVA OS</span>
          </div>
        </div>

        {/* Center: Navigation Links */}
        <div className="hidden lg:flex items-center gap-8 font-mono text-xs text-[#9CA3AF]">
          <a 
            href="#overview" 
            className="hover:text-[#00F2A6] transition-colors tracking-wide hover:drop-shadow-[0_0_8px_rgba(0,242,166,0.5)]"
          >
            Overview
          </a>
          <a 
            href="#kinematics" 
            className="hover:text-[#00F2A6] transition-colors tracking-wide hover:drop-shadow-[0_0_8px_rgba(0,242,166,0.5)]"
          >
            Kinematics
          </a>
          <a 
            href="#architecture" 
            className="hover:text-[#00F2A6] transition-colors tracking-wide hover:drop-shadow-[0_0_8px_rgba(0,242,166,0.5)]"
          >
            Architecture
          </a>
          <a 
            href="#team" 
            className="hover:text-[#00F2A6] transition-colors tracking-wide hover:drop-shadow-[0_0_8px_rgba(0,242,166,0.5)]"
          >
            Team Syntropy
          </a>
        </div>

        {/* Right: Live Status Indicator & Auth Button */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Live Status Indicator */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-[#111622]/80 border border-white/5 font-mono text-[11px] text-[#9CA3AF]">
            <span
              className={`w-2 h-2 rounded-full ${
                isConnected
                  ? 'bg-[#00F2A6] shadow-[0_0_10px_#00F2A6]'
                  : 'bg-[#00F2A6] animate-pulse shadow-[0_0_8px_#00F2A6]'
              }`}
            />
            <span className="text-white font-medium">
              Hardware Bridge: <span className="text-[#00F2A6]">{isConnected ? 'Active' : 'Standby'}</span>
            </span>
          </div>

          {/* Firebase Authentication / Launch Studio Button */}
          <button
            onClick={handleLaunchStudio}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#00F2A6] to-[#00D2FF] text-[#05070A] font-mono font-bold text-xs tracking-wider transition-all transform hover:scale-105 hover:shadow-[0_0_25px_rgba(0,242,166,0.4)] flex items-center gap-1.5 cursor-pointer"
          >
            <span>{isAuthenticated ? 'LAUNCH STUDIO' : 'SIGN IN / LAUNCH STUDIO'}</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </nav>
  );
};

export default LandingNavbar;
