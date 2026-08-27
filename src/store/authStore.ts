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
}

const DEFAULT_ACCOUNTS: Record<string, string> = {
  'SSG-2050-X99': 'sensasign2050',
  'SSG-9842-A12': 'sensasign2050',
  'SSG-1029-B55': 'sensasign2050',
};

export const useAuthStore = create<AuthStore>((set, get) => {
  const initialSerial = typeof window !== 'undefined' ? localStorage.getItem('sensasign_glove_serial') : null;
  const isAuth = !!initialSerial;

  const createProfileObj = (serial: string): GloveProfile => ({
    serialId: serial,
    ownerName: 'Primary Operator',
    gloveModel: 'AI GLOVE v2.4 (XIAO nRF52840)',
    calibrationDate: '2026-08-15',
    savedGesturesCount: 12,
  });

  return {
    isAuthenticated: isAuth,
    activeGloveSerial: initialSerial || 'SSG-2050-X99',
    profile: createProfileObj(initialSerial || 'SSG-2050-X99'),
    isAuthModalOpen: false,
    error: null,

    login: (gloveSerial, password) => {
      const cleanSerial = gloveSerial.trim().toUpperCase();
      
      if (!cleanSerial.startsWith('SSG-')) {
        set({ error: 'Invalid Glove Serial ID format. Must start with SSG- (e.g. SSG-2050-X99)' });
        return false;
      }

      const customAccountsJson = typeof window !== 'undefined' ? localStorage.getItem('sensasign_accounts') : null;
      const customAccounts = customAccountsJson ? JSON.parse(customAccountsJson) : {};
      const allAccounts = { ...DEFAULT_ACCOUNTS, ...customAccounts };

      if (allAccounts[cleanSerial] && allAccounts[cleanSerial] !== password) {
        set({ error: 'Incorrect password for this Glove Serial ID' });
        return false;
      }

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
        profile: createProfileObj(cleanSerial),
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
  };
});
