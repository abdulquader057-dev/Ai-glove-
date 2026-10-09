// Toast Notification System for SIGNOVA
// Assistive Device Medical Interface

'use client';

import React from 'react';
import { useSignovaStore } from '@/store/signovaStore';

export const ToastContainer: React.FC = () => {
  const { toast, clearToast } = useSignovaStore();

  if (!toast) return null;

  const bgStyles =
    toast.type === 'success'
      ? 'bg-[#ECFDF3] border-[#A6F4C5] text-[#027A48]'
      : toast.type === 'warn'
      ? 'bg-[#FEF3C7] border-[#FCD34D] text-[#B45309]'
      : toast.type === 'error'
      ? 'bg-[#FEE4E2] border-[#FDA29B] text-[#D92D20]'
      : 'bg-[#F0F2F5] border-[#E4E7EC] text-[#344054]';

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-scale-pop">
      <div
        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border shadow-card text-xs font-medium ${bgStyles}`}
      >
        <span>{toast.message}</span>
        <button
          onClick={clearToast}
          className="ml-2 text-current opacity-60 hover:opacity-100"
        >
          ✕
        </button>
      </div>
    </div>
  );
};
