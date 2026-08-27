import { create } from 'zustand';
import { GestureItem, PhraseToken, DockToolType } from '@/types';

export const DEFAULT_GESTURES: GestureItem[] = [
  {
    id: 'open-palm',
    name: 'OPEN PALM',
    emoji: '✋',
    mappedPhrase: 'Hello',
    fingerFlex: { thumb: 10, index: 10, middle: 10, ring: 10, pinky: 10 },
    description: 'All 5 fingers extended open.',
    category: 'social',
  },
  {
    id: 'closed-fist',
    name: 'CLOSED FIST',
    emoji: '✊',
    mappedPhrase: 'Stop',
    fingerFlex: { thumb: 95, index: 95, middle: 95, ring: 95, pinky: 95 },
    description: 'All 5 fingers tightly curled into a fist.',
    category: 'emergency',
  },
  {
    id: 'thumbs-up',
    name: 'THUMBS UP',
    emoji: '👍',
    mappedPhrase: 'Yes',
    fingerFlex: { thumb: 5, index: 90, middle: 90, ring: 90, pinky: 90 },
    description: 'Thumb pointing upward, fingers curled.',
    category: 'essential',
  },
  {
    id: 'thumbs-down',
    name: 'THUMBS DOWN',
    emoji: '👎',
    mappedPhrase: 'No',
    fingerFlex: { thumb: 10, index: 85, middle: 85, ring: 85, pinky: 85 },
    description: 'Thumb inverted downward, fingers curled.',
    category: 'essential',
  },
  {
    id: 'point-up',
    name: 'POINT UP',
    emoji: '☝️',
    mappedPhrase: 'Help',
    fingerFlex: { thumb: 80, index: 5, middle: 85, ring: 85, pinky: 85 },
    description: 'Index finger pointing straight up.',
    category: 'emergency',
  },
  {
    id: 'peace',
    name: 'PEACE SIGN',
    emoji: '✌️',
    mappedPhrase: 'Peace',
    fingerFlex: { thumb: 85, index: 10, middle: 10, ring: 85, pinky: 85 },
    description: 'Index and middle fingers extended in a V.',
    category: 'social',
  },
  {
    id: 'rock-on',
    name: 'ROCK ON',
    emoji: '🤘',
    mappedPhrase: 'Thank You',
    fingerFlex: { thumb: 80, index: 10, middle: 85, ring: 85, pinky: 10 },
    description: 'Index and pinky fingers extended.',
    category: 'social',
  },
  {
    id: 'call-me',
    name: 'CALL ME',
    emoji: '🤙',
    mappedPhrase: 'Need',
    fingerFlex: { thumb: 5, index: 85, middle: 85, ring: 85, pinky: 5 },
    description: 'Thumb and pinky fingers extended.',
    category: 'essential',
  },
  {
    id: 'ok-sign',
    name: 'OK SIGN',
    emoji: '👌',
    mappedPhrase: 'I',
    fingerFlex: { thumb: 40, index: 40, middle: 10, ring: 10, pinky: 10 },
    description: 'Thumb and index tips touching in an O.',
    category: 'essential',
  },
  {
    id: 'high-five',
    name: 'HIGH FIVE',
    emoji: '🖐️',
    mappedPhrase: 'Welcome',
    fingerFlex: { thumb: 15, index: 15, middle: 15, ring: 15, pinky: 15 },
    description: 'Open hand spread wide.',
    category: 'social',
  },
  {
    id: 'pinch',
    name: 'PINCH',
    emoji: '🤏',
    mappedPhrase: 'Water',
    fingerFlex: { thumb: 30, index: 30, middle: 75, ring: 75, pinky: 75 },
    description: 'Precision pinch between thumb and index.',
    category: 'essential',
  },
  {
    id: 'wave',
    name: 'WAVE',
    emoji: '👋',
    mappedPhrase: 'Goodbye',
    fingerFlex: { thumb: 20, index: 20, middle: 20, ring: 20, pinky: 20 },
    description: 'Rhythmic side-to-side hand gesture.',
    category: 'social',
  },
];

export interface GestureHistoryEntry {
  id: string;
  time: string;
  gestureName: string;
  emoji: string;
  confidence: number;
}

interface GestureStore {
  gestures: GestureItem[];
  activeGesture: GestureItem | null;
  confidence: number;
  inferenceTimeMs: number;
  isSpeaking: boolean;
  searchQuery: string;

  // Sentence Building Tokens
  phraseTokens: PhraseToken[];
  addTokenToPhrase: (word: string, confidence?: number) => void;
  clearPhraseTokens: () => void;
  undoPhraseToken: () => void;

  // Dock & Tools
  activeDockTool: DockToolType;
  setActiveDockTool: (tool: DockToolType) => void;

  // History Log
  history: GestureHistoryEntry[];

  // Speech & Voice Controls
  speechVolume: number;
  speechRate: 'slow' | 'normal' | 'fast';
  autoSpeak: boolean;
  setSpeechVolume: (vol: number) => void;
  setSpeechRate: (rate: 'slow' | 'normal' | 'fast') => void;
  setAutoSpeak: (auto: boolean) => void;

  // Actions
  setActiveGesture: (gesture: GestureItem | null, confidence?: number, inferenceMs?: number) => void;
  addGesture: (gesture: Omit<GestureItem, 'id'>) => void;
  deleteGesture: (id: string) => void;
  setSpeaking: (speaking: boolean) => void;
  setSearchQuery: (query: string) => void;
  loadSavedGesturesForGlove: (gloveSerial: string) => void;
}

export const useGestureStore = create<GestureStore>((set, get) => ({
  gestures: DEFAULT_GESTURES,
  activeGesture: DEFAULT_GESTURES[4], // default POINT UP ("Help")
  confidence: 94.6,
  inferenceTimeMs: 14,
  isSpeaking: false,
  searchQuery: '',

  // Pre-seed sentence builder tokens: I * NEED * HELP
  phraseTokens: [
    { id: 'token-1', word: 'I', timestamp: '10:31:20', confidence: 96.2 },
    { id: 'token-2', word: 'NEED', timestamp: '10:31:25', confidence: 95.1 },
    { id: 'token-3', word: 'HELP', timestamp: '10:31:30', confidence: 94.6 },
  ],

  activeDockTool: null,

  history: [
    { id: 'hist-1', time: '10:31:30', gestureName: 'POINT UP (HELP)', emoji: '☝️', confidence: 94.6 },
    { id: 'hist-2', time: '10:31:25', gestureName: 'CALL ME (NEED)', emoji: '🤙', confidence: 95.1 },
    { id: 'hist-3', time: '10:31:20', gestureName: 'OK SIGN (I)', emoji: '👌', confidence: 96.2 },
    { id: 'hist-4', time: '10:30:50', gestureName: 'OPEN PALM (HELLO)', emoji: '✋', confidence: 98.4 },
  ],

  speechVolume: 85,
  speechRate: 'normal',
  autoSpeak: true,

  setSpeechVolume: (speechVolume) => set({ speechVolume }),
  setSpeechRate: (speechRate) => set({ speechRate }),
  setAutoSpeak: (autoSpeak) => set({ autoSpeak }),

  addTokenToPhrase: (word, confidence = 95.0) => {
    if (!word || word.trim() === '') return;
    const now = new Date();
    const timestamp = now.toTimeString().split(' ')[0];
    const newToken: PhraseToken = {
      id: 'tok-' + Date.now(),
      word: word.trim().toUpperCase(),
      timestamp,
      confidence,
    };
    set((state) => ({ phraseTokens: [...state.phraseTokens, newToken] }));
  },

  clearPhraseTokens: () => set({ phraseTokens: [] }),

  undoPhraseToken: () => {
    set((state) => ({ phraseTokens: state.phraseTokens.slice(0, -1) }));
  },

  setActiveDockTool: (tool) => {
    set((state) => ({ activeDockTool: state.activeDockTool === tool ? null : tool }));
  },

  setActiveGesture: (activeGesture, confidence = 95, inferenceTimeMs = 14) => {
    if (!activeGesture) return;
    const now = new Date();
    const timeStr = now.toTimeString().split(' ')[0];

    set((state) => {
      const newHistoryItem: GestureHistoryEntry = {
        id: 'h-' + Date.now(),
        time: timeStr,
        gestureName: `${activeGesture.name} (${activeGesture.mappedPhrase})`,
        emoji: activeGesture.emoji,
        confidence,
      };

      return {
        activeGesture,
        confidence,
        inferenceTimeMs,
        history: [newHistoryItem, ...state.history.slice(0, 19)],
      };
    });
  },

  addGesture: (newGesture) => {
    const item: GestureItem = {
      ...newGesture,
      id: 'custom-' + Date.now(),
    };
    set((state) => ({ gestures: [item, ...state.gestures] }));
  },

  deleteGesture: (id) => {
    set((state) => ({ gestures: state.gestures.filter((g) => g.id !== id) }));
  },

  setSpeaking: (isSpeaking) => set({ isSpeaking }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),

  loadSavedGesturesForGlove: (gloveSerial) => {
    if (typeof window !== 'undefined') {
      const key = `sensasign_custom_gestures_${gloveSerial}`;
      const saved = localStorage.getItem(key);
      if (saved) {
        try {
          const customs: GestureItem[] = JSON.parse(saved);
          set({ gestures: [...customs, ...DEFAULT_GESTURES] });
        } catch {
          // ignore
        }
      }
    }
  },
}));
