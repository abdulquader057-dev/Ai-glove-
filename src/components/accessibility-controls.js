import { $, on } from '../utils/dom.js';
import { eventBus } from '../utils/events.js';
import { storageService } from '../services/storage.service.js';
import { voiceService } from '../services/voice.service.js';

export function renderAccessibilityControls() {
  return `
    <div class="panel a11y-controls">
      <div class="card-header">
        <span class="icon">👁️</span> ACCESSIBILITY SETTINGS
      </div>
      <div class="card-body">
        <div class="controls-row">
          <div>
            <label>Larger Text</label>
            <p class="small text-muted">Increases base font size</p>
          </div>
          <label class="toggle-switch">
            <input type="checkbox" id="toggle-larger-text" />
            <span class="slider"></span>
          </label>
        </div>
        <div class="controls-row">
          <div>
            <label>High Contrast</label>
            <p class="small text-muted">Increases visual contrast</p>
          </div>
          <label class="toggle-switch">
            <input type="checkbox" id="toggle-high-contrast" />
            <span class="slider"></span>
          </label>
        </div>
        <div class="controls-row">
          <div>
            <label>Reduced Motion</label>
            <p class="small text-muted">Disables non-essential animations</p>
          </div>
          <label class="toggle-switch">
            <input type="checkbox" id="toggle-reduced-motion" />
            <span class="slider"></span>
          </label>
        </div>
        <div class="controls-row">
          <div>
            <label>Voice Output</label>
            <p class="small text-muted">Auto-speak detected gestures</p>
          </div>
          <label class="toggle-switch">
            <input type="checkbox" id="toggle-voice-output" />
            <span class="slider"></span>
          </label>
        </div>
      </div>
    </div>
  `;
}

export function initAccessibilityControls() {
  const toggleLargerText = $('#toggle-larger-text');
  const toggleHighContrast = $('#toggle-high-contrast');
  const toggleReducedMotion = $('#toggle-reduced-motion');
  const toggleVoiceOutput = $('#toggle-voice-output');

  const settings = storageService.get('a11y_settings') || {};
  
  if (toggleLargerText) toggleLargerText.checked = !!settings.largerText;
  if (toggleHighContrast) toggleHighContrast.checked = !!settings.highContrast;
  if (toggleReducedMotion) toggleReducedMotion.checked = !!settings.reducedMotion;
  
  const voiceSettings = voiceService.getSettings();
  if (toggleVoiceOutput) toggleVoiceOutput.checked = voiceSettings.autoSpeak;

  const saveAndApply = () => {
    const newSettings = {
      largerText: toggleLargerText ? toggleLargerText.checked : false,
      highContrast: toggleHighContrast ? toggleHighContrast.checked : false,
      reducedMotion: toggleReducedMotion ? toggleReducedMotion.checked : false
    };
    storageService.set('a11y_settings', newSettings);
    
    if (toggleVoiceOutput) {
      voiceService.setAutoSpeak(toggleVoiceOutput.checked);
    }
    
    applyAccessibilitySettings();
    eventBus.emit('settings-change', newSettings);
  };

  if (toggleLargerText) on(toggleLargerText, 'change', saveAndApply);
  if (toggleHighContrast) on(toggleHighContrast, 'change', saveAndApply);
  if (toggleReducedMotion) on(toggleReducedMotion, 'change', saveAndApply);
  if (toggleVoiceOutput) on(toggleVoiceOutput, 'change', saveAndApply);
}

export function applyAccessibilitySettings() {
  const settings = storageService.get('a11y_settings') || {};
  
  if (settings.largerText) document.documentElement.dataset.largerText = 'true';
  else delete document.documentElement.dataset.largerText;
  
  if (settings.highContrast) document.documentElement.dataset.highContrast = 'true';
  else delete document.documentElement.dataset.highContrast;
  
  if (settings.reducedMotion) document.documentElement.dataset.reducedMotion = 'true';
  else delete document.documentElement.dataset.reducedMotion;
}
