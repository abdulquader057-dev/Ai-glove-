// Speech Synthesis Engine for SIGNOVA
// Team Syntropy
// Manages text-to-speech with cooldown on label changes, voice selector, rate control, and localStorage persistence.

import { CONFIG } from '../config.js';

export interface SpeechSettings {
  voiceURI: string;
  rate: number;
  pitch: number;
  muted: boolean;
}

const STORAGE_KEY = 'signova_speech_settings_v1';

class SpeechService {
  private synth: SpeechSynthesis | null = null;
  private voices: SpeechSynthesisVoice[] = [];
  private selectedVoice: SpeechSynthesisVoice | null = null;
  private lastSpokenLabel: string = 'NONE';
  private lastSpokenTimestamp: number = 0;
  private cooldownMs: number = CONFIG.TTS_COOLDOWN_MS;
  private rate: number = 1.0;
  private pitch: number = 1.0;
  private muted: boolean = false;
  private listeners: Set<(settings: SpeechSettings) => void> = new Set();
  private speakingListeners: Set<(isSpeaking: boolean) => void> = new Set();
  private isUnlocked: boolean = false;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
      this.loadSettings();
      this.loadVoices();

      if (this.synth.onvoiceschanged !== undefined) {
        this.synth.onvoiceschanged = () => this.loadVoices();
      }

      // Auto-unlock speech synthesis on first user interaction (browser audio policy)
      const unlockAudio = () => {
        if (!this.synth) return;
        try {
          if (!this.isUnlocked) {
            // Speak a 0-volume silent tick to lift autoplay restrictions
            const silent = new SpeechSynthesisUtterance('');
            silent.volume = 0;
            this.synth.speak(silent);
            this.isUnlocked = true;
          }
        } catch {
          // Ignore
        }
        window.removeEventListener('click', unlockAudio);
        window.removeEventListener('keydown', unlockAudio);
        window.removeEventListener('touchstart', unlockAudio);
      };

      window.addEventListener('click', unlockAudio, { once: true });
      window.addEventListener('keydown', unlockAudio, { once: true });
      window.addEventListener('touchstart', unlockAudio, { once: true });
    }
  }

  public onSpeakingChange(fn: (isSpeaking: boolean) => void): () => void {
    this.speakingListeners.add(fn);
    return () => this.speakingListeners.delete(fn);
  }

  private notifySpeaking(isSpeaking: boolean): void {
    this.speakingListeners.forEach(fn => fn(isSpeaking));
  }

  private loadSettings(): void {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed: Partial<SpeechSettings> = JSON.parse(saved);
          if (parsed.rate !== undefined) this.rate = parsed.rate;
          if (parsed.pitch !== undefined) this.pitch = parsed.pitch;
          if (parsed.muted !== undefined) this.muted = parsed.muted;
        }
      } catch {
        // Use defaults if parse fails
      }
    }
  }

  private saveSettings(): void {
    if (typeof window !== 'undefined') {
      try {
        const data: SpeechSettings = {
          voiceURI: this.selectedVoice?.voiceURI || '',
          rate: this.rate,
          pitch: this.pitch,
          muted: this.muted,
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        this.notifyListeners();
      } catch {
        // Storage unavailable
      }
    }
  }

  private loadVoices(): void {
    if (!this.synth) return;
    this.voices = this.synth.getVoices();

    // Check if previously saved voice exists
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed: Partial<SpeechSettings> = JSON.parse(saved);
        if (parsed.voiceURI) {
          const match = this.voices.find(v => v.voiceURI === parsed.voiceURI);
          if (match) {
            this.selectedVoice = match;
            return;
          }
        }
      }
    } catch {
      // Ignore
    }

    // Default to a clear English voice if available
    this.selectedVoice =
      this.voices.find(v => v.lang.startsWith('en') && v.name.toLowerCase().includes('google')) ||
      this.voices.find(v => v.lang.startsWith('en') && v.name.toLowerCase().includes('natural')) ||
      this.voices.find(v => v.lang.startsWith('en')) ||
      this.voices[0] ||
      null;
  }

  public isSupported(): boolean {
    return typeof window !== 'undefined' && 'speechSynthesis' in window;
  }

  public getVoices(): SpeechSynthesisVoice[] {
    if (this.voices.length === 0 && this.synth) {
      this.loadVoices();
    }
    return this.voices;
  }

  public getSettings(): SpeechSettings {
    return {
      voiceURI: this.selectedVoice?.voiceURI || '',
      rate: this.rate,
      pitch: this.pitch,
      muted: this.muted,
    };
  }

  public setVoice(voiceURI: string): void {
    const found = this.voices.find(v => v.voiceURI === voiceURI);
    if (found) {
      this.selectedVoice = found;
      this.saveSettings();
    }
  }

  public setRate(rate: number): void {
    this.rate = Math.max(0.5, Math.min(2.0, rate));
    this.saveSettings();
  }

  public setPitch(pitch: number): void {
    this.pitch = Math.max(0.5, Math.min(2.0, pitch));
    this.saveSettings();
  }

  public setMuted(muted: boolean): void {
    this.muted = muted;
    if (muted && this.synth) {
      this.synth.cancel();
      this.notifySpeaking(false);
    }
    this.saveSettings();
  }

  public toggleMute(): boolean {
    this.setMuted(!this.muted);
    return this.muted;
  }

  public subscribe(fn: (settings: SpeechSettings) => void): () => void {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }

  private notifyListeners(): void {
    const s = this.getSettings();
    this.listeners.forEach(fn => fn(s));
  }

  /**
   * Speak label only on label change, with cooldown
   * @param label - Gesture word to speak
   * @returns boolean - Whether the phrase was vocalized
   */
  public speakGesture(label: string): boolean {
    if (!this.synth || this.muted) return false;
    if (!label || label === 'NONE' || label === this.lastSpokenLabel) return false;

    const now = Date.now();
    if (now - this.lastSpokenTimestamp < this.cooldownMs) {
      return false; // Still within cooldown window
    }

    this.lastSpokenLabel = label;
    this.lastSpokenTimestamp = now;

    this.speakText(label);
    return true;
  }

  /**
   * Force speak text (e.g. for Test Voice button or gesture click)
   */
  public testVoice(sampleText: string = 'Signova Voice Ready'): void {
    if (!this.synth) return;
    this.speakText(sampleText);
  }

  private speakText(text: string): void {
    if (!this.synth) return;

    try {
      // Resume in case browser paused audio queue
      if (this.synth.paused) {
        this.synth.resume();
      }

      this.synth.cancel(); // Stop pending speech
      const utterance = new SpeechSynthesisUtterance(text);
      if (this.selectedVoice) {
        utterance.voice = this.selectedVoice;
      }
      utterance.rate = this.rate;
      utterance.pitch = this.pitch;
      utterance.volume = 1.0;
      utterance.lang = this.selectedVoice?.lang || 'en-US';

      utterance.onstart = () => this.notifySpeaking(true);
      utterance.onend = () => this.notifySpeaking(false);
      utterance.onerror = (e) => {
        console.warn('speechSynthesis error:', e);
        this.notifySpeaking(false);
      };

      this.synth.speak(utterance);
    } catch (err) {
      console.warn('speechSynthesis exception:', err);
      this.notifySpeaking(false);
    }
  }

  public getCooldownRemainingMs(): number {
    const elapsed = Date.now() - this.lastSpokenTimestamp;
    return Math.max(0, this.cooldownMs - elapsed);
  }
}

export const speechService = new SpeechService();
export default speechService;
