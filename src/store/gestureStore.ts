import { create } from 'zustand';
import { GestureItem } from '@/types';

export const DEFAULT_GESTURES: GestureItem[] = [
  {
    id: 'open-palm',
    name: 'OPEN PALM',
    emoji: '✋',
    mappedPhrase: 'Hello, welcome to Sensasign AI.',
    flexThresholds: { min: [50, 50, 50, 50, 50], max: [280, 280, 280, 280, 280] },
    confidence: 0.98,
  },
  {
    id: 'closed-fist',
    name: 'CLOSED FIST',
    emoji: '✊',
    mappedPhrase: 'Emergency stop requested.',
    flexThresholds: { min: [750, 750, 750, 750, 750], max: [1023, 1023, 1023, 1023, 1023] },
    confidence: 0.96,
  },
  {
    id: 'thumbs-up',
    name: 'THUMBS UP',
    emoji: '👍',
    mappedPhrase: 'Yes, I agree completely.',
    flexThresholds: { min: [100, 700, 700, 700, 700], max: [300, 1023, 1023, 1023, 1023] },
    confidence: 0.95,
  },
  {
    id: 'thumbs-down',
    name: 'THUMBS DOWN',
    emoji: '👎',
    mappedPhrase: 'No, I disagree.',
    flexThresholds: { min: [100, 750, 750, 750, 750], max: [350, 1023, 1023, 1023, 1023] },
    confidence: 0.94,
  },
  {
    id: 'peace',
    name: 'PEACE SIGN',
    emoji: '✌️',
    mappedPhrase: 'Peace and goodbye!',
    flexThresholds: { min: [700, 100, 100, 700, 700], max: [1000, 300, 300, 1000, 1000] },
    confidence: 0.97,
  },
  {
    id: 'point-up',
    name: 'POINT UP',
    emoji: '☝️',
    mappedPhrase: 'Attention required, I need assistance.',
    flexThresholds: { min: [700, 100, 700, 700, 700], max: [1000, 300, 1000, 1000, 1000] },
    confidence: 0.93,
  },
  {
    id: 'rock-on',
    name: 'ROCK ON',
    emoji: '🤘',
    mappedPhrase: 'Thank you very much!',
    flexThresholds: { min: [700, 100, 700, 700, 100], max: [1000, 300, 1000, 1000, 300] },
    confidence: 0.92,
  },
  {
    id: 'call-me',
    name: 'CALL ME',
    emoji: '🤙',
    mappedPhrase: 'Please call me later.',
    flexThresholds: { min: [100, 700, 700, 700, 100], max: [300, 1000, 1000, 1000, 300] },
    confidence: 0.91,
  },
  {
    id: 'ok-sign',
    name: 'OK SIGN',
    emoji: '👌',
    mappedPhrase: 'Everything is perfect.',
    flexThresholds: { min: [400, 400, 100, 100, 100], max: [650, 650, 300, 300, 300] },
    confidence: 0.95,
  },
  {
    id: 'five-fingers',
    name: 'HIGH FIVE',
    emoji: '🖐️',
    mappedPhrase: 'High five! Great job.',
    flexThresholds: { min: [80, 80, 80, 80, 80], max: [250, 250, 250, 250, 250] },
    confidence: 0.99,
  },
  {
    id: 'pinch',
    name: 'PINCH',
    emoji: '🤏',
    mappedPhrase: 'Just a small amount.',
    flexThresholds: { min: [350, 350, 600, 600, 600], max: [550, 550, 950, 950, 950] },
    confidence: 0.89,
  },
  {
    id: 'wave',
    name: 'WAVE',
    emoji: '👋',
    mappedPhrase: 'Goodbye, see you soon!',
    flexThresholds: { min: [120, 120, 120, 120, 120], max: [320, 320, 320, 320, 320] },
    confidence: 0.94,
  },
];

interface GestureStore {
  gestures: GestureItem[];
  activeGesture: GestureItem | null;
  confidence: number;
  inferenceTimeMs: number;
  isSpeaking: boolean;
  searchQuery: string;

  setActiveGesture: (gesture: GestureItem | null, confidence?: number, inferenceMs?: number) => void;
  addGesture: (gesture: Omit<GestureItem, 'id'>) => void;
  deleteGesture: (id: string) => void;
  setSpeaking: (speaking: boolean) => void;
  setSearchQuery: (query: string) => void;
  loadSavedGesturesForGlove: (gloveSerial: string) => void;
}

export const useGestureStore = create<GestureStore>((set) => ({
  gestures: DEFAULT_GESTURES,
  activeGesture: DEFAULT_GESTURES[0], // default Open Palm
  confidence: 98,
  inferenceTimeMs: 14,
  isSpeaking: false,
  searchQuery: '',

  setActiveGesture: (activeGesture, confidence = 95, inferenceTimeMs = 12) => {
    set({
      activeGesture,
      confidence,
      inferenceTimeMs,
    });
  },

  addGesture: (newGesture) => {
    const item: GestureItem = {
      ...newGesture,
      id: 'custom-' + Date.now(),
      isCustom: true,
      lastUsed: 'Just now',
    };
    
    set((state) => {
      const updated = [item, ...state.gestures];
      if (typeof window !== 'undefined') {
        localStorage.setItem('sensasign_custom_gestures', JSON.stringify(updated.filter(g => g.isCustom)));
      }
      return { gestures: updated };
    });
  },

  deleteGesture: (id) => {
    set((state) => {
      const updated = state.gestures.filter((g) => g.id !== id);
      if (typeof window !== 'undefined') {
        localStorage.setItem('sensasign_custom_gestures', JSON.stringify(updated.filter(g => g.isCustom)));
      }
      return { gestures: updated };
    });
  },

  setSpeaking: (isSpeaking) => set({ isSpeaking }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),

  loadSavedGesturesForGlove: (gloveSerial) => {
    if (typeof window !== 'undefined') {
      const key = `sensasign_custom_gestures_${gloveSerial}`;
      const saved = localStorage.getItem(key) || localStorage.getItem('sensasign_custom_gestures');
      if (saved) {
        try {
          const customs: GestureItem[] = JSON.parse(saved);
          set({ gestures: [...customs, ...DEFAULT_GESTURES] });
        } catch {
          // ignore error
        }
      }
    }
  },
}));
