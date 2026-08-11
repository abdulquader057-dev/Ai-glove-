import { $, on, toggleClass, show, hide } from '../utils/dom.js';
import { eventBus } from '../utils/events.js';
import { voiceService } from '../services/voice.service.js';
import { storageService } from '../services/storage.service.js';

export function renderVoicePanel() {
  return `
    <div class="panel voice-panel">
      <div class="card-header">
        <span class="icon">🔊</span> VOICE OUTPUT
      </div>
      <div class="card-body">
        <div id="voice-last-text" class="last-spoken-text">---</div>
        <div id="voice-not-supported" class="badge badge-red" style="display: none;">Voice not supported</div>
        <div class="controls-row">
          <button id="btn-voice-speak" class="btn btn-primary">SPEAK</button>
          <button id="btn-voice-repeat" class="btn btn-secondary">REPEAT</button>
        </div>
        <div class="controls-row">
          <label>Auto Speak</label>
          <input type="checkbox" id="toggle-auto-speak" class="toggle-switch" />
        </div>
        <div class="controls-row">
          <label>Volume: <span id="volume-label">100%</span></label>
          <input type="range" id="slider-volume" class="slider" min="0" max="100" value="100" />
        </div>
        <div class="controls-row button-group">
          <button class="btn btn-sm speed-btn" data-speed="0.7">Slow</button>
          <button class="btn btn-sm speed-btn" data-speed="1.0">Normal</button>
          <button class="btn btn-sm speed-btn" data-speed="1.5">Fast</button>
        </div>
      </div>
    </div>
  `;
}

export function initVoicePanel() {
  const speakBtn = $('#btn-voice-speak');
  const repeatBtn = $('#btn-voice-repeat');
  const autoSpeakToggle = $('#toggle-auto-speak');
  const volumeSlider = $('#slider-volume');
  const volumeLabel = $('#volume-label');
  const speedBtns = document.querySelectorAll('.speed-btn');
  const lastTextEl = $('#voice-last-text');
  const notSupportedEl = $('#voice-not-supported');

  if (!voiceService.isSupported()) {
    show(notSupportedEl);
  }

  // Load settings
  const settings = voiceService.getSettings();
  if (autoSpeakToggle) autoSpeakToggle.checked = settings.autoSpeak;
  if (volumeSlider) {
    volumeSlider.value = settings.volume * 100;
    volumeLabel.textContent = `${volumeSlider.value}%`;
  }
  
  on(speakBtn, 'click', () => {
    const text = lastTextEl.textContent;
    if (text !== '---') voiceService.speak(text);
  });
  
  on(repeatBtn, 'click', () => {
    voiceService.repeat();
  });
  
  on(autoSpeakToggle, 'change', (e) => {
    voiceService.setAutoSpeak(e.target.checked);
  });
  
  on(volumeSlider, 'input', (e) => {
    const val = e.target.value;
    volumeLabel.textContent = `${val}%`;
    voiceService.setVolume(val / 100);
  });
  
  speedBtns.forEach(btn => {
    on(btn, 'click', (e) => {
      voiceService.setRate(parseFloat(e.target.dataset.speed));
    });
  });
  
  eventBus.on('gesture-detected', (data) => {
    const text = data.gesture;
    lastTextEl.textContent = text;
    if (voiceService.isAutoSpeak()) {
      voiceService.speak(text);
    }
  });

  eventBus.on('voice-speak', (data) => {
    lastTextEl.textContent = data.text;
  });
}
