import { create } from 'zustand';
import { GloveProfile } from '@/types';
import { 
  auth, 
  signInWithEmail, 
  signUpWithEmail, 
  signInWithGoogle, 
  signOutUser,
  onAuthStateChangedListener
} from '@/firebase';
import { User } from 'firebase/auth';

interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  activeGloveSerial: string | null;
  profile: GloveProfile | null;
  isAuthModalOpen: boolean;
  error: string | null;
  isLoading: boolean;

  loginWithEmail: (email: string, pass: string) => Promise<boolean>;
  registerWithEmail: (email: string, pass: string) => Promise<boolean>;
  loginWithGoogle: () => Promise<boolean>;
  guestBypass: () => void;
  logout: () => Promise<void>;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  clearError: () => void;
  initAuthListener: () => () => void;
}

export const useAuthStore = create<AuthStore>((set, get) => {
  const initialSerial = typeof window !== 'undefined' ? localStorage.getItem('sensasign_glove_serial') : null;

  const createProfileObj = (userOrSerial: string, name?: string): GloveProfile => ({
    serialId: userOrSerial.startsWith('SSG-') ? userOrSerial : 'SSG-2050-X99',
    ownerName: name || 'Operator Syntropy',
    gloveModel: 'AI GLOVE v2.4 (XIAO nRF52840)',
    calibrationDate: '2026-10-17',
    savedGesturesCount: 8,
  });

  return {
    user: null,
    isAuthenticated: !!initialSerial,
    activeGloveSerial: initialSerial || 'SSG-2050-X99',
    profile: createProfileObj(initialSerial || 'SSG-2050-X99'),
    isAuthModalOpen: false,
    error: null,
    isLoading: false,

    initAuthListener: () => {
      const unsubscribe = onAuthStateChangedListener((user: User | null) => {
        if (user) {
          set({
            user,
            isAuthenticated: true,
            activeGloveSerial: user.email || 'SSG-2050-X99',
            profile: createProfileObj(user.email || 'SSG-2050-X99', user.displayName || user.email?.split('@')[0] || 'Operator'),
            error: null,
          });
        }
      });
      return unsubscribe;
    },

    loginWithEmail: async (email, pass) => {
      set({ isLoading: true, error: null });
      try {
        const cred = await signInWithEmail(email, pass);
        set({
          user: cred.user,
          isAuthenticated: true,
          activeGloveSerial: cred.user.email || 'SSG-2050-X99',
          profile: createProfileObj(cred.user.email || 'SSG-2050-X99', cred.user.displayName || cred.user.email?.split('@')[0]),
          isAuthModalOpen: false,
          isLoading: false,
          error: null,
        });
        if (typeof window !== 'undefined') {
          localStorage.setItem('sensasign_glove_serial', cred.user.email || 'SSG-2050-X99');
        }
        return true;
      } catch (err: any) {
        set({
          isLoading: false,
          error: err?.message || 'Authentication failed. Please check your credentials.',
        });
        return false;
      }
    },

    registerWithEmail: async (email, pass) => {
      set({ isLoading: true, error: null });
      try {
        const cred = await signUpWithEmail(email, pass);
        set({
          user: cred.user,
          isAuthenticated: true,
          activeGloveSerial: cred.user.email || 'SSG-2050-X99',
          profile: createProfileObj(cred.user.email || 'SSG-2050-X99', cred.user.displayName || cred.user.email?.split('@')[0]),
          isAuthModalOpen: false,
          isLoading: false,
          error: null,
        });
        if (typeof window !== 'undefined') {
          localStorage.setItem('sensasign_glove_serial', cred.user.email || 'SSG-2050-X99');
        }
        return true;
      } catch (err: any) {
        set({
          isLoading: false,
          error: err?.message || 'Registration failed. Password should be at least 6 characters.',
        });
        return false;
      }
    },

    loginWithGoogle: async () => {
      set({ isLoading: true, error: null });
      try {
        const cred = await signInWithGoogle();
        set({
          user: cred.user,
          isAuthenticated: true,
          activeGloveSerial: cred.user.email || 'SSG-2050-X99',
          profile: createProfileObj(cred.user.email || 'SSG-2050-X99', cred.user.displayName || 'Syntropy Operator'),
          isAuthModalOpen: false,
          isLoading: false,
          error: null,
        });
        if (typeof window !== 'undefined') {
          localStorage.setItem('sensasign_glove_serial', cred.user.email || 'SSG-2050-X99');
        }
        return true;
      } catch (err: any) {
        set({
          isLoading: false,
          error: err?.message || 'Google sign-in was aborted or failed.',
        });
        return false;
      }
    },

    guestBypass: () => {
      const serial = 'SSG-2050-X99';
      set({
        isAuthenticated: true,
        activeGloveSerial: serial,
        profile: createProfileObj(serial, 'Guest Researcher'),
        isAuthModalOpen: false,
        error: null,
      });
      if (typeof window !== 'undefined') {
        localStorage.setItem('sensasign_glove_serial', serial);
      }
    },

    logout: async () => {
      try {
        await signOutUser();
      } catch {
        // ignore
      }
      if (typeof window !== 'undefined') {
        localStorage.removeItem('sensasign_glove_serial');
      }
      set({
        user: null,
        isAuthenticated: false,
        activeGloveSerial: null,
        profile: null,
      });
    },

    openAuthModal: () => set({ isAuthModalOpen: true }),
    closeAuthModal: () => set({ isAuthModalOpen: false, error: null }),
    clearError: () => set({ error: null }),
  };
});
