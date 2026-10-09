// Hardware Settings & Audio Preferences Panel
// Team Syntropy - SIGNOVA
// Controls speech synthesis voices, rate slider, test voice trigger,
// and classification engine toggle (Threshold vs Random Forest).

'use client';

import React, { useState, useEffect } from 'react';
import { Settings, Volume2, Cpu, X, Play } from 'lucide-react';
import { speechService, SpeechSettings } from '../../services/speechService';
import { useSignovaStore } from '../../store/signovaStore';
import { MODEL_IS_PLACEHOLDER } from '../../model/classifier';

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({ isOpen, onClose }) => {
  const { classifierSource, setClassifierSource } = useSignovaStore();
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [currentVoiceURI, setCurrentVoiceURI] = useState<string>('');
  const [rate, setRate] = useState<number>(1.0);

  useEffect(() => {
    const updateVoiceList = () => {
      const available = speechService.getVoices();
      setVoices(available);
      const s = speechService.getSettings();
      setCurrentVoiceURI(s.voiceURI);
      setRate(s.rate);
    };

    updateVoiceList();
    const unsub = speechService.subscribe((s: SpeechSettings) => {
      setCurrentVoiceURI(s.voiceURI);
      setRate(s.rate);
    });

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.onvoiceschanged = updateVoiceList;
    }

    return () => unsub();
  }, []);

  if (!isOpen) return null;

  const handleVoiceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const uri = e.target.value;
    setCurrentVoiceURI(uri);
    speechService.setVoice(uri);
  };

  const handleRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const r = parseFloat(e.target.value);
    setRate(r);
    speechService.setRate(r);
  };

  const handleTestVoice = () => {
    speechService.testVoice('Signova Voice Active');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 font-mono">
      <div className="w-full max-w-lg bg-[#0A0D10] border border-[#1F242A] rounded-sm p-6 space-y-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#1F242A]">
          <div className="flex items-center gap-2">
            <Settings className="w-4 h-4 text-[#2EE6A6]" />
            <h2 className="text-sm font-bold text-white tracking-wider">
              SYSTEM &amp; AUDIO SETTINGS
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-[#9CA3AF] hover:text-white hover:bg-[#1F242A]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 1. Speech Synthesis Controls */}
        <div className="space-y-4">
          <div className="text-xs font-bold text-[#9CA3AF] flex items-center gap-2">
            <Volume2 className="w-3.5 h-3.5 text-[#2EE6A6]" />
            <span>VOICE SYNTHESIS ENGINE (Web Speech API)</span>
          </div>

          {/* Voice Dropdown */}
          <div className="space-y-1.5">
            <label className="text-[11px] text-[#6B7280]">SELECTED SYSTEM VOICE</label>
            <select
              value={currentVoiceURI}
              onChange={handleVoiceChange}
              className="w-full bg-[#111418] border border-[#1F242A] rounded-xs px-3 py-2 text-xs text-white focus:outline-none focus:border-[#2EE6A6]"
            >
              {voices.length === 0 && <option value="">Default System Voice</option>}
              {voices.map((v) => (
                <option key={v.voiceURI} value={v.voiceURI}>
                  {v.name} ({v.lang})
                </option>
              ))}
            </select>
          </div>

          {/* Rate Slider */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-[11px]">
              <span className="text-[#6B7280]">SPEECH RATE: {rate.toFixed(1)}x</span>
              <span className="text-[#9CA3AF]">DEFAULT: 1.0x</span>
            </div>
            <input
              type="range"
              min="0.6"
              max="1.8"
              step="0.1"
              value={rate}
              onChange={handleRateChange}
              className="w-full accent-[#2EE6A6]"
            />
          </div>

          {/* Test Voice Button */}
          <div className="flex items-center justify-between pt-1">
            <button
              onClick={handleTestVoice}
              className="flex items-center gap-2 px-3 py-1.5 text-xs bg-[#14181D] hover:bg-[#1C2128] border border-[#1F242A] text-[#2EE6A6] rounded-xs transition-colors"
            >
              <Play className="w-3 h-3" />
              <span>TEST VOICE OUTPUT</span>
            </button>
            <span className="text-[10px] text-[#6B7280]">
              Cooldown: 1.5s between label changes
            </span>
          </div>
        </div>

        {/* 2. Classifier Engine Selector */}
        <div className="space-y-3 pt-4 border-t border-[#1F242A]">
          <div className="text-xs font-bold text-[#9CA3AF] flex items-center gap-2">
            <Cpu className="w-3.5 h-3.5 text-[#2EE6A6]" />
            <span>CLASSIFICATION ENGINE</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setClassifierSource('threshold')}
              className={`p-3 text-left border rounded-xs transition-colors ${
                classifierSource === 'threshold'
                  ? 'border-[#2EE6A6] bg-[#0E1C15]'
                  : 'border-[#1F242A] bg-[#0F1216] text-[#6B7280]'
              }`}
            >
              <div
                className={`text-xs font-bold ${
                  classifierSource === 'threshold' ? 'text-[#2EE6A6]' : 'text-white'
                }`}
              >
                THRESHOLD MIDPOINT
              </div>
              <div className="text-[10px] text-[#9CA3AF] mt-1">
                Deterministic binary map {`{0,1}`} based on calibrated straight/bent values.
              </div>
            </button>

            <button
              onClick={() => setClassifierSource('random_forest')}
              className={`p-3 text-left border rounded-xs transition-colors ${
                classifierSource === 'random_forest'
                  ? 'border-[#2EE6A6] bg-[#0E1C15]'
                  : 'border-[#1F242A] bg-[#0F1216] text-[#6B7280]'
              }`}
            >
              <div
                className={`text-xs font-bold ${
                  classifierSource === 'random_forest' ? 'text-[#2EE6A6]' : 'text-white'
                }`}
              >
                RANDOM FOREST (M2CGEN)
              </div>
              <div className="text-[10px] text-[#9CA3AF] mt-1">
                3-tree decision ensemble loaded from `src/model/rf_model.js`.
              </div>
            </button>
          </div>

          <div className="text-[10px] text-[#6B7280]">
            MODEL STATUS: {MODEL_IS_PLACEHOLDER ? 'BASELINE PLACEHOLDER' : 'PRODUCTION CALIBRATED'}
          </div>
        </div>

        {/* Close */}
        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs bg-[#2EE6A6] hover:bg-[#25C48D] text-[#08090A] font-bold rounded-xs transition-colors"
          >
            DONE
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;
