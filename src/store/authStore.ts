import { create } from 'zustand';
import { GloveProfile } from '@/types';

interface AuthStore {
  isAuthenticated: boolean;
  activeGloveSerial: string | null;
  profile: GloveProfile | null;
  isAuthModalOpen: boolean;
  error: string | null;

  login: (gloveSerial: string, password: string) => boolean;
  registerGlove: (gloveSerial: string, password: string) => boolean;
  logout: () => void;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  clearError: () => void;
  updateProfileSettings: (speed: number, pitch: number, voiceURI?: string) => void;
}

const DEFAULT_ACCOUNTS: Record<string, string> = {
  'SSG-2050-X99': 'sensasign2050',
  'SSG-9842-A12': 'sensasign2050',
  'SSG-1029-B55': 'sensasign2050',
};

export const useAuthStore = create<AuthStore>((set, get) => {
  // Check client storage initial state safely
  const initialSerial = typeof window !== 'undefined' ? localStorage.getItem('sensasign_glove_serial') : null;
  const isAuth = !!initialSerial;

  return {
    isAuthenticated: isAuth,
    activeGloveSerial: initialSerial || 'SSG-2050-X99',
    profile: initialSerial ? {
      gloveSerial: initialSerial,
      isFirstLogin: false,
      createdAt: '2026-01-15',
      lastLogin: new Date().toISOString().split('T')[0],
      voiceSpeed: 1.0,
      voicePitch: 1.0,
    } : {
      gloveSerial: 'SSG-2050-X99',
      isFirstLogin: false,
      createdAt: '2026-01-15',
      lastLogin: new Date().toISOString().split('T')[0],
      voiceSpeed: 1.0,
      voicePitch: 1.0,
    },
    isAuthModalOpen: false,
    error: null,

    login: (gloveSerial, password) => {
      const cleanSerial = gloveSerial.trim().toUpperCase();
      
      // Basic validation for glove serial format (SSG-XXXX-XXXX)
      if (!cleanSerial.startsWith('SSG-')) {
        set({ error: 'Invalid Glove Serial ID format. Must start with SSG- (e.g. SSG-2050-X99)' });
        return false;
      }

      // Check stored custom accounts or default
      const customAccountsJson = typeof window !== 'undefined' ? localStorage.getItem('sensasign_accounts') : null;
      const customAccounts = customAccountsJson ? JSON.parse(customAccountsJson) : {};
      const allAccounts = { ...DEFAULT_ACCOUNTS, ...customAccounts };

      if (allAccounts[cleanSerial] && allAccounts[cleanSerial] !== password) {
        set({ error: 'Incorrect password for this Glove Serial ID' });
        return false;
      }

      // If new glove ID, auto register with provided password
      if (!allAccounts[cleanSerial]) {
        allAccounts[cleanSerial] = password;
        if (typeof window !== 'undefined') {
          localStorage.setItem('sensasign_accounts', JSON.stringify(allAccounts));
        }
      }

      if (typeof window !== 'undefined') {
        localStorage.setItem('sensasign_glove_serial', cleanSerial);
      }

      set({
        isAuthenticated: true,
        activeGloveSerial: cleanSerial,
        profile: {
          gloveSerial: cleanSerial,
          isFirstLogin: false,
          createdAt: new Date().toISOString().split('T')[0],
          lastLogin: new Date().toISOString().split('T')[0],
          voiceSpeed: 1.0,
          voicePitch: 1.0,
        },
        isAuthModalOpen: false,
        error: null,
      });

      return true;
    },

    registerGlove: (gloveSerial, password) => {
      return get().login(gloveSerial, password);
    },

    logout: () => {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('sensasign_glove_serial');
      }
      set({
        isAuthenticated: false,
        activeGloveSerial: null,
        profile: null,
        isAuthModalOpen: true,
      });
    },

    openAuthModal: () => set({ isAuthModalOpen: true }),
    closeAuthModal: () => set({ isAuthModalOpen: false }),
    clearError: () => set({ error: null }),

    updateProfileSettings: (voiceSpeed, voicePitch, selectedVoiceURI) => {
      set((state) => ({
        profile: state.profile ? {
          ...state.profile,
          voiceSpeed,
          voicePitch,
          selectedVoiceURI,
        } : null,
      }));
    },
  };
});
