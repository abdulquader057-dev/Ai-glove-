'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { ShieldCheck, Lock, Mail, X, AlertCircle, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import TeamSyntropyLogo from './brand/TeamSyntropyLogo';

export const AuthModal: React.FC = () => {
  const router = useRouter();
  const { 
    isAuthModalOpen, 
    closeAuthModal, 
    loginWithEmail, 
    registerWithEmail, 
    loginWithGoogle, 
    guestBypass,
    error, 
    clearError,
    isLoading 
  } = useAuthStore();

  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('demo@syntropy.lab');
  const [password, setPassword] = useState('syntropy2026');

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    let success = false;
    if (mode === 'signin') {
      success = await loginWithEmail(email, password);
    } else {
      success = await registerWithEmail(email, password);
    }

    if (success) {
      closeAuthModal();
      router.push('/studio');
    }
  };

  const handleGoogleSignIn = async () => {
    clearError();
    const success = await loginWithGoogle();
    if (success) {
      closeAuthModal();
      router.push('/studio');
    }
  };

  const handleGuestAccess = () => {
    guestBypass();
    closeAuthModal();
    router.push('/studio');
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-fadeIn">
      <div className="relative w-full max-w-md bg-[#0A0D12] border border-[#2EE6A6]/30 rounded-2xl p-6 sm:p-8 shadow-[0_0_60px_rgba(46,230,166,0.18)] overflow-hidden">
        
        {/* Neon Gradient Header Stripe */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#2EE6A6] via-[#38BDF8] to-[#2EE6A6]" />

        {/* Close Button */}
        <button
          onClick={closeAuthModal}
          className="absolute top-4 right-4 p-2 text-[#9CA3AF] hover:text-white rounded-lg hover:bg-white/5 transition-all cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand & Heading */}
        <div className="flex flex-col items-center text-center mb-6 pt-1">
          <TeamSyntropyLogo width={180} height={42} className="mb-3" />
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#2EE6A6]/10 border border-[#2EE6A6]/30 text-[#2EE6A6] text-[10px] font-mono font-bold tracking-wider uppercase mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>FIREBASE CLOUD TELEMETRY AUTH</span>
          </div>
          <h2 className="text-xl font-black text-white tracking-tight">
            {mode === 'signin' ? 'ACCESS DIAGNOSTICS STUDIO' : 'CREATE OPERATOR PROFILE'}
          </h2>
          <p className="text-xs text-[#9CA3AF] mt-1 font-mono">
            Secure biometric & hardware pipeline node verification.
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/40 text-red-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Google Sign-In Quick Trigger */}
        <button
          onClick={handleGoogleSignIn}
          disabled={isLoading}
          className="w-full py-2.5 px-4 rounded-xl bg-white text-[#0A0D12] hover:bg-gray-100 font-bold text-xs font-mono transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer mb-3"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span>CONTINUE WITH GOOGLE</span>
        </button>

        <div className="flex items-center gap-3 my-3">
          <div className="flex-1 h-px bg-[#1F2733]" />
          <span className="text-[10px] font-mono text-[#6B7280]">OR EMAIL AUTH</span>
          <div className="flex-1 h-px bg-[#1F2733]" />
        </div>

        {/* Email & Password Form */}
        <form onSubmit={handleSubmit} className="space-y-3 font-mono">
          <div>
            <label className="text-[11px] text-[#9CA3AF] block mb-1">OPERATOR EMAIL</label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-[#141922] border border-[#1F2733] focus:border-[#2EE6A6] text-white px-3.5 py-2 pl-9 rounded-xl text-xs outline-none transition-colors"
                placeholder="operator@syntropy.lab"
              />
              <Mail className="w-4 h-4 text-[#6B7280] absolute left-3 top-2.5" />
            </div>
          </div>

          <div>
            <label className="text-[11px] text-[#9CA3AF] block mb-1">SECURITY KEY / PASSWORD</label>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-[#141922] border border-[#1F2733] focus:border-[#2EE6A6] text-white px-3.5 py-2 pl-9 rounded-xl text-xs outline-none transition-colors"
                placeholder="••••••••"
              />
              <Lock className="w-4 h-4 text-[#6B7280] absolute left-3 top-2.5" />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 px-4 bg-[#2EE6A6] hover:bg-[#22C58B] text-[#07090D] font-bold text-xs tracking-wider rounded-xl transition-all shadow-[0_0_20px_rgba(46,230,166,0.35)] flex items-center justify-center gap-2 cursor-pointer mt-2"
          >
            {isLoading ? (
              <span>AUTHENTICATING NODE...</span>
            ) : (
              <>
                <span>{mode === 'signin' ? 'ENTER DIAGNOSTICS STUDIO' : 'REGISTER PROFILE'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Toggle sign in / sign up */}
        <div className="mt-4 flex items-center justify-between text-[11px] font-mono text-[#9CA3AF]">
          <button
            type="button"
            onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
            className="hover:text-[#2EE6A6] transition-colors cursor-pointer"
          >
            {mode === 'signin' ? 'New hardware operator? Register' : 'Existing operator? Sign In'}
          </button>

          <button
            type="button"
            onClick={handleGuestAccess}
            className="text-[#38BDF8] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <Sparkles className="w-3 h-3" />
            <span>Guest Bypass</span>
          </button>
        </div>

      </div>
    </div>
  );
};

export default AuthModal;
