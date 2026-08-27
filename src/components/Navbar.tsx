'use client';

import React, { useState, useEffect } from 'react';
import { useHardwareStore } from '@/store/hardwareStore';
import { useAuthStore } from '@/store/authStore';
import { User, LogOut, ShieldCheck, Menu, X, Cpu } from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { connectionState, isSimulation } = useHardwareStore();
  const { isAuthenticated, activeGloveSerial, openAuthModal, logout } = useAuthStore();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { id: 'home', label: '01 HOME' },
    { id: 'glove', label: '02 AI GLOVE' },
    { id: 'aiml', label: '03 AI & ML' },
    { id: 'accessibility', label: '04 ACCESSIBILITY' },
    { id: 'demo', label: '05 LIVE DEMO' },
    { id: 'impact', label: '06 IMPACT & FUTURE' },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      scrolled 
        ? 'bg-[#030712]/90 backdrop-blur-xl border-b border-[#00f0ff]/20 shadow-[0_10px_35px_rgba(0,0,0,0.9)] py-3' 
        : 'bg-transparent py-5 border-b border-white/5'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        
        {/* LEFT LOGO */}
        <div 
          onClick={() => setActiveTab('home')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl border-2 border-[#00f0ff] bg-[#0a0f1e] flex items-center justify-center shadow-[0_0_20px_rgba(0,240,255,0.4)] group-hover:shadow-[0_0_30px_rgba(0,240,255,0.8)] transition-all">
            <span className="font-orbitron font-black text-xl text-[#00f0ff] group-hover:scale-110 transition-transform">S</span>
          </div>
          <div className="flex flex-col">
            <span className="font-orbitron font-bold text-lg tracking-[0.15em] text-gradient-cyan">
              AI GLOVE
            </span>
            <span className="text-[9px] text-[#94a3b8] font-rajdhani font-semibold tracking-widest -mt-1 hidden sm:block">
              WEARABLE INTELLIGENCE
            </span>
          </div>
        </div>

        {/* CENTER NAV LINKS (WITH TRAVELING ACTIVE INDICATOR) */}
        <div className="hidden md:flex items-center gap-1 lg:gap-2 relative">
          {navLinks.map((link) => {
            const isActive = activeTab === link.id;
            return (
              <button
                key={link.id}
                onClick={() => setActiveTab(link.id)}
                className={`relative px-3.5 py-2 font-rajdhani font-bold text-xs lg:text-sm tracking-[0.1em] uppercase transition-all rounded-lg ${
                  isActive 
                    ? 'text-[#00f0ff] bg-[#00f0ff]/10 shadow-[0_0_20px_rgba(0,240,255,0.15)]' 
                    : 'text-[#94a3b8] hover:text-[#00f0ff] hover:bg-white/5'
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4/5 h-[2.5px] bg-[#00f0ff] rounded-full shadow-[0_0_10px_#00f0ff] transition-all duration-300" />
                )}
              </button>
            );
          })}
        </div>

        {/* RIGHT STATUS BADGE & AUTH */}
        <div className="hidden lg:flex items-center gap-4">
          {/* Connection / Simulation Status */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#0a0f1e] border border-[#00f0ff]/30 text-xs font-orbitron shadow-[0_0_15px_rgba(0,240,255,0.1)]">
            <span className={`w-2.5 h-2.5 rounded-full animate-ping ${
              isSimulation ? 'bg-[#00f0ff]' : connectionState === 'connected' ? 'bg-[#10b981]' : 'bg-amber-400'
            }`} />
            <span className={`w-2.5 h-2.5 rounded-full -ml-4.5 ${
              isSimulation ? 'bg-[#00f0ff]' : connectionState === 'connected' ? 'bg-[#10b981]' : 'bg-amber-400'
            }`} />
            <span className="text-[#00f0ff] flex items-center gap-1 font-semibold">
              <Cpu className="w-3.5 h-3.5" />
              {isSimulation ? 'SIMULATION READY' : connectionState === 'connected' ? 'BLE ACTIVE' : 'STANDBY'}
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
              <span>GLOVE SERIAL</span>
            </button>
          )}
        </div>

        {/* MOBILE MENU TOGGLE */}
        <div className="md:hidden flex items-center gap-3">
          <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#0a0f1e] border border-[#00f0ff]/20 text-[10px] font-orbitron">
            <span className={`w-2 h-2 rounded-full ${isSimulation ? 'bg-[#00f0ff]' : 'bg-amber-400'}`} />
            <span className="text-[#00f0ff]">{isSimulation ? 'SIM READY' : 'STANDBY'}</span>
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
        <div className="md:hidden bg-[#030712]/95 backdrop-blur-2xl border-b border-[#00f0ff]/30 px-4 pt-4 pb-6 mt-3 flex flex-col gap-3">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => {
                setActiveTab(link.id);
                setMobileMenuOpen(false);
              }}
              className={`text-left px-4 py-3 font-rajdhani font-bold text-base tracking-wider rounded-xl transition-all ${
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
