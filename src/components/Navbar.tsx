'use client';

import React, { useState, useEffect } from 'react';
import { useHardwareStore } from '@/store/hardwareStore';
import { useAuthStore } from '@/store/authStore';
import { User, LogOut, ShieldCheck, Menu, X } from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { connectionState } = useHardwareStore();
  const { isAuthenticated, activeGloveSerial, openAuthModal, logout } = useAuthStore();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { id: 'hardware', label: 'HARDWARE' },
    { id: 'how-it-works', label: 'HOW IT WORKS' },
    { id: 'saved-gestures', label: 'SAVED GESTURES' },
    { id: 'features', label: 'FEATURES' },
    { id: '3d-view', label: '3D VIEW' },
    { id: 'manual', label: 'MANUAL' },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled 
        ? 'bg-[#0a0f1e]/85 backdrop-blur-xl border-b border-[#00f0ff]/20 shadow-[0_10px_30px_rgba(0,0,0,0.8)] py-3' 
        : 'bg-transparent py-5 border-b border-white/5'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        
        {/* LEFT LOGO */}
        <div 
          onClick={() => setActiveTab('hardware')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-lg border-2 border-[#00f0ff] bg-[#0a0f1e] flex items-center justify-center shadow-[0_0_15px_rgba(0,240,255,0.4)] group-hover:shadow-[0_0_25px_rgba(0,240,255,0.8)] transition-all">
            <span className="font-orbitron font-black text-xl text-[#00f0ff]">S</span>
          </div>
          <div className="flex flex-col">
            <span className="font-orbitron font-bold text-lg tracking-[0.15em] text-gradient-cyan">
              SENSASIGN AI
            </span>
            <span className="text-[10px] text-[#94a3b8] font-rajdhani font-medium tracking-widest -mt-1 hidden sm:block">
              WEARABLE INTELLIGENCE
            </span>
          </div>
        </div>

        {/* CENTER NAV LINKS */}
        <div className="hidden md:flex items-center gap-1 lg:gap-2">
          {navLinks.map((link) => {
            const isActive = activeTab === link.id;
            return (
              <button
                key={link.id}
                onClick={() => setActiveTab(link.id)}
                className={`relative px-3 py-2 font-rajdhani font-semibold text-sm tracking-[0.1em] uppercase transition-all rounded-md ${
                  isActive 
                    ? 'text-[#00f0ff] bg-[#00f0ff]/10 shadow-[0_0_15px_rgba(0,240,255,0.15)]' 
                    : 'text-[#94a3b8] hover:text-[#00f0ff] hover:bg-white/5'
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-[2px] bg-[#00f0ff] shadow-[0_0_8px_#00f0ff] transition-all duration-300" />
                )}
              </button>
            );
          })}
        </div>

        {/* RIGHT STATUS BADGE & AUTH */}
        <div className="hidden lg:flex items-center gap-4">
          {/* Connection Status Badge */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#0a0f1e] border border-[#00f0ff]/20 text-xs font-orbitron">
            <span className={`w-2.5 h-2.5 rounded-full animate-ping ${
              connectionState === 'connected' ? 'bg-[#10b981]' : 'bg-[#ef4444]'
            }`} />
            <span className={`w-2.5 h-2.5 rounded-full -ml-5 ${
              connectionState === 'connected' ? 'bg-[#10b981]' : 'bg-[#ef4444]'
            }`} />
            <span className={connectionState === 'connected' ? 'text-[#10b981]' : 'text-[#94a3b8]'}>
              {connectionState === 'connected' ? 'SYSTEM READY' : 'DISCONNECTED'}
            </span>
          </div>

          {/* Login / Profile Button */}
          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              <div className="px-3 py-1.5 rounded-lg bg-[#00f0ff]/10 border border-[#00f0ff]/40 text-[#00f0ff] text-xs font-orbitron flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{activeGloveSerial}</span>
              </div>
              <button
                onClick={logout}
                title="Sign out of Glove"
                className="p-2 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 transition-all"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={openAuthModal}
              className="btn-outline !py-2 !px-4 !min-h-[38px] text-xs font-rajdhani font-bold flex items-center gap-2"
            >
              <User className="w-3.5 h-3.5" />
              <span>GLOVE LOGIN</span>
            </button>
          )}
        </div>

        {/* MOBILE MENU TOGGLE */}
        <div className="md:hidden flex items-center gap-3">
          <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#0a0f1e] border border-[#00f0ff]/20 text-[10px] font-orbitron">
            <span className={`w-2 h-2 rounded-full ${connectionState === 'connected' ? 'bg-[#10b981]' : 'bg-[#ef4444]'}`} />
            <span className={connectionState === 'connected' ? 'text-[#10b981]' : 'text-[#94a3b8]'}>
              {connectionState === 'connected' ? 'ONLINE' : 'OFFLINE'}
            </span>
          </div>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-[#00f0ff] border border-[#00f0ff]/30 bg-[#0a0f1e]"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

      </div>

      {/* MOBILE MENU DROPDOWN */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0a0f1e]/95 backdrop-blur-2xl border-b border-[#00f0ff]/30 px-4 pt-4 pb-6 mt-3 flex flex-col gap-3">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => {
                setActiveTab(link.id);
                setMobileMenuOpen(false);
              }}
              className={`text-left px-4 py-3 font-rajdhani font-bold text-base tracking-wider rounded-lg transition-all ${
                activeTab === link.id
                  ? 'text-[#00f0ff] bg-[#00f0ff]/15 border-l-4 border-[#00f0ff]'
                  : 'text-[#94a3b8] hover:text-white'
              }`}
            >
              {link.label}
            </button>
          ))}
          <div className="pt-3 border-t border-white/10 flex justify-between items-center">
            {isAuthenticated ? (
              <div className="flex items-center justify-between w-full">
                <span className="text-xs font-orbitron text-[#00f0ff]">{activeGloveSerial}</span>
                <button onClick={logout} className="text-xs font-rajdhani text-red-400 font-bold uppercase">
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  openAuthModal();
                  setMobileMenuOpen(false);
                }}
                className="btn-outline w-full text-center text-xs"
              >
                GLOVE LOGIN
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
