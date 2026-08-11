import { eventBus } from '../utils/events.js';
import { storageService } from './storage.service.js';

class VoiceService {
  constructor() {
    this.supported = 'speechSynthesis' in window;
    this.voices = [];
    this.activeUtterances = new Set();
    this.lastSpokenText = '';
    
    this.settings = storageService.get('voice_settings') || {
      volume: 1.0,
      rate: 1.0,
      pitch: 1.0,
      voiceName: null,
      autoSpeak: true
    };
    
    if (this.supported) {
      this.initVoices();
      window.speechSynthesis.onvoiceschanged = () => this.initVoices();
    }
  }

  async initVoices() {
    if (!this.supported) return;
    
    // Getting voices is sometimes asynchronous in Chrome
    this.voices = window.speechSynthesis.getVoices();
    if (this.voices.length > 0) {
      eventBus.emit('voice-ready', { voices: this.voices });
    }
  }

  speak(text) {
    if (!this.supported || !text) return;
    
    this.stop();
    this.lastSpokenText = text;
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.volume = this.settings.volume;
    utterance.rate = this.settings.rate;
    utterance.pitch = this.settings.pitch;
    
    if (this.settings.voiceName) {
      const selectedVoice = this.voices.find(v => v.name === this.settings.voiceName);
      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }
    }
    
    // Prevent garbage collection bug in Chrome
    this.activeUtterances.add(utterance);
    
    utterance.onend = () => {
      this.activeUtterances.delete(utterance);
    };
    
    utterance.onerror = (e) => {
      console.error('Speech synthesis error:', e);
      this.activeUtterances.delete(utterance);
    };
    
    window.speechSynthesis.speak(utterance);
    eventBus.emit('voice-speak', { text });
  }

  stop() {
    if (this.supported) {
      window.speechSynthesis.cancel();
      this.activeUtterances.clear();
    }
  }

  repeat() {
    if (this.lastSpokenText) {
      this.speak(this.lastSpokenText);
    }
  }

  setVolume(v) {
    this.settings.volume = Math.max(0, Math.min(1, v));
    this._persistSettings();
  }

  setRate(r) {
    this.settings.rate = Math.max(0.5, Math.min(2, r));
    this._persistSettings();
  }

  setPitch(p) {
    this.settings.pitch = Math.max(0, Math.min(2, p));
    this._persistSettings();
  }

  setVoice(voiceName) {
    this.settings.voiceName = voiceName;
    this._persistSettings();
  }

  getVoices() {
    return this.voices;
  }

  getSettings() {
    return { ...this.settings };
  }

  isSupported() {
    return this.supported;
  }

  isAutoSpeak() {
    return this.settings.autoSpeak;
  }

  setAutoSpeak(bool) {
    this.settings.autoSpeak = !!bool;
    this._persistSettings();
  }

  _persistSettings() {
    storageService.set('voice_settings', this.settings);
  }
}

export const voiceService = new VoiceService();
