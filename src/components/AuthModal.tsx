'use client';

import React, { useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { ShieldCheck, Lock, Cpu, X, AlertCircle, KeyRound } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, closeAuthModal, login, error, clearError } = useAuthStore();
  const [gloveSerial, setGloveSerial] = useState('SSG-2050-X99');
  const [password, setPassword] = useState('sensasign2050');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setIsSubmitting(true);

    setTimeout(() => {
      const success = login(gloveSerial, password);
      setIsSubmitting(false);
      if (success) {
        closeAuthModal();
      }
    }, 400);
  };

  const handleSelectPreset = (serial: string) => {
    setGloveSerial(serial);
    setPassword('sensasign2050');
    clearError();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#030712]/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md bg-[#0a0f1e] border-2 border-[#00f0ff]/40 rounded-2xl p-6 sm:p-8 shadow-[0_0_50px_rgba(0,240,255,0.25)] overflow-hidden">
        
        {/* Neon Glow Header Bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#00f0ff] via-[#0066ff] to-[#8b5cf6]" />

        {/* Close Button */}
        <button
          onClick={closeAuthModal}
          className="absolute top-4 right-4 p-2 text-[#94a3b8] hover:text-white rounded-lg hover:bg-white/5 transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Icon & Title */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-[#00f0ff]/10 border border-[#00f0ff]/50 flex items-center justify-center shadow-[0_0_20px_rgba(0,240,255,0.3)] mb-3">
            <ShieldCheck className="w-8 h-8 text-[#00f0ff]" />
          </div>
          <h2 className="font-orbitron font-bold text-xl text-white tracking-[0.12em] uppercase">
            GLOVE HARDWARE AUTH
          </h2>
          <p className="text-xs text-[#94a3b8] mt-1 font-inter max-w-xs">
            Authenticate using your unique Sensasign Glove Serial ID (format: <code className="text-[#00f0ff]">SSG-XXXX-XXXX</code>).
          </p>
        </div>

        {/* Preset Quick Select */}
        <div className="mb-6 bg-[#030712] p-3 rounded-xl border border-white/10">
          <span className="text-[10px] font-orbitron text-[#94a3b8] uppercase tracking-wider block mb-2">
            PRE-CONFIGURED HARDWARE SERIALS (SELECT ONE):
          </span>
          <div className="flex flex-wrap gap-2">
            {['SSG-2050-X99', 'SSG-9842-A12', 'SSG-1029-B55'].map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => handleSelectPreset(s)}
                className={`text-[11px] font-orbitron px-2.5 py-1 rounded-md border transition-all ${
                  gloveSerial === s
                    ? 'border-[#00f0ff] bg-[#00f0ff]/20 text-[#00f0ff] shadow-[0_0_10px_rgba(0,240,255,0.2)]'
                    : 'border-white/10 bg-white/5 text-[#94a3b8] hover:text-white'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/40 text-red-400 text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-rajdhani font-semibold text-[#94a3b8] tracking-widest uppercase mb-1.5">
              GLOVE SERIAL ID
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#00f0ff]">
                <Cpu className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={gloveSerial}
                onChange={(e) => setGloveSerial(e.target.value.toUpperCase())}
                placeholder="SSG-2050-X99"
                required
                className="w-full bg-[#030712] border border-[#00f0ff]/30 focus:border-[#00f0ff] text-white pl-10 pr-4 py-3 rounded-xl font-orbitron text-sm tracking-wider outline-none focus:ring-1 focus:ring-[#00f0ff] transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-rajdhani font-semibold text-[#94a3b8] tracking-widest uppercase mb-1.5">
              PASSWORD
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#00f0ff]">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                required
                className="w-full bg-[#030712] border border-[#00f0ff]/30 focus:border-[#00f0ff] text-white pl-10 pr-4 py-3 rounded-xl font-inter text-sm outline-none focus:ring-1 focus:ring-[#00f0ff] transition-all"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary w-full text-center flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  <span>AUTHENTICATING...</span>
                </>
              ) : (
                <>
                  <KeyRound className="w-4 h-4" />
                  <span>AUTHENTICATE GLOVE</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Footer info */}
        <div className="mt-5 text-center text-[10px] text-[#94a3b8] font-inter border-t border-white/5 pt-4">
          🔒 Secure GATT credentials stored. Each physical glove maps to an encrypted hardware profile.
        </div>

      </div>
    </div>
  );
};
