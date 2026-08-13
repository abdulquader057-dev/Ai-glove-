import { useGestureStore } from '@/store/gestureStore';

class TTSService {
  private synth: SpeechSynthesis | null = null;
  private voices: SpeechSynthesisVoice[] = [];
  private selectedVoice: SpeechSynthesisVoice | null = null;
  private rate: number = 1.0;
  private pitch: number = 1.0;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
      this.loadVoices();
      if (this.synth.onvoiceschanged !== undefined) {
        this.synth.onvoiceschanged = () => this.loadVoices();
      }
    }
  }

  private loadVoices() {
    if (!this.synth) return;
    this.voices = this.synth.getVoices();
    // Default to an English voice if available
    this.selectedVoice = 
      this.voices.find((v) => v.lang.includes('en') && v.name.toLowerCase().includes('google')) ||
      this.voices.find((v) => v.lang.includes('en')) ||
      this.voices[0] || null;
  }

  public getVoices(): SpeechSynthesisVoice[] {
    if (this.voices.length === 0 && this.synth) {
      this.loadVoices();
    }
    return this.voices;
  }

  public setVoice(voiceURI: string) {
    const v = this.voices.find((voice) => voice.voiceURI === voiceURI);
    if (v) this.selectedVoice = v;
  }

  public setRate(rate: number) {
    this.rate = Math.max(0.5, Math.min(2.0, rate));
  }

  public setPitch(pitch: number) {
    this.pitch = Math.max(0.5, Math.min(2.0, pitch));
  }

  public speak(text: string, onEndCallback?: () => void) {
    if (!this.synth) {
      console.warn('Web Speech API is not supported in this browser environment.');
      return;
    }

    // Cancel ongoing speech to avoid backlog
    this.synth.cancel();

    if (!text || text.trim().length === 0) return;

    const utterance = new SpeechSynthesisUtterance(text);
    if (this.selectedVoice) utterance.voice = this.selectedVoice;
    utterance.rate = this.rate;
    utterance.pitch = this.pitch;

    useGestureStore.getState().setSpeaking(true);

    utterance.onend = () => {
      useGestureStore.getState().setSpeaking(false);
      if (onEndCallback) onEndCallback();
    };

    utterance.onerror = (e) => {
      console.error('TTS Utterance Error:', e);
      useGestureStore.getState().setSpeaking(false);
    };

    this.synth.speak(utterance);
  }

  public cancel() {
    if (this.synth) {
      this.synth.cancel();
      useGestureStore.getState().setSpeaking(false);
    }
  }
}

export const ttsService = new TTSService();
