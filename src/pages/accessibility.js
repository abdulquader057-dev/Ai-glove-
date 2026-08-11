import { renderPipeline, initPipeline } from '../components/pipeline-flow.js';
import { renderAccessibilityControls, initAccessibilityControls } from '../components/accessibility-controls.js';
import { initTooltips } from '../components/tooltip.js';
import { voiceService } from '../services/voice.service.js';
import { GESTURES } from '../config/gestures.config.js';
import { $, $$, on, off } from '../utils/dom.js';

export function render() {
  const pipelineSteps = [
    { title: 'Gesture', description: 'User performs a gesture', icon: `<svg><rect width="24" height="24" fill="none"/></svg>` },
    { title: 'Recognition', description: 'AI recognizes gesture', icon: `<svg><rect width="24" height="24" fill="none"/></svg>` },
    { title: 'Text', description: 'Screen shows text', icon: `<svg><rect width="24" height="24" fill="none"/></svg>` },
    { title: 'Speech', description: 'Speaker outputs speech', icon: `<svg><rect width="24" height="24" fill="none"/></svg>` }
  ];

  return `
    <div class="page page-accessibility">
      <!-- HERO -->
      <section class="section section-padding text-center">
        <h1 class="animate-fade-in-up">COMMUNICATION WITHOUT DEPENDING ON THE SCREEN</h1>
        <p class="animate-fade-in-up stagger-1">Recognized gestures produce both visual text and audible speech output.</p>
        <p class="animate-fade-in-up stagger-2">Our dual-output concept ensures that the AI Glove is an inclusive device for all.</p>
      </section>

      <!-- ACCESSIBILITY PIPELINE -->
      <section class="section section-padding">
        <div class="container">
          <h2 class="text-center mb-4">Accessibility Pipeline</h2>
          ${renderPipeline(pipelineSteps)}
          <div class="pipeline-example text-center mt-4">
            <p>Example: User performs <strong>HELP</strong> ⬇️ AI recognizes: <strong>HELP</strong> ⬇️ Screen displays: <strong>HELP</strong> ⬇️ Speaker: 🔊 <strong>"HELP"</strong></p>
          </div>
        </div>
      </section>

      <!-- VOICE DEMO -->
      <section class="section section-padding bg-surface">
        <div class="container">
          <h2 class="text-center mb-4">Voice Demo</h2>
          <div class="voice-demo-container">
            ${!voiceService.isSupported() ? '<div class="alert alert-warning">Speech synthesis not supported in this browser.</div>' : ''}
            
            <div class="gesture-grid grid grid-3 mb-4">
              ${GESTURES.map(g => `<button class="btn btn-outline demo-gesture-btn" data-gesture="${g.name}">${g.name}</button>`).join('')}
            </div>
            
            <div class="demo-display text-center p-4 bg-background border-radius mb-4">
              <h3 class="text-primary text-large" id="demo-detected-gesture">Detected: NONE</h3>
            </div>
            
            <div class="demo-controls flex justify-center gap-2 mb-4">
              <button class="btn btn-primary" id="demo-speak-btn">SPEAK</button>
              <button class="btn btn-secondary" id="demo-speak-again-btn">SPEAK AGAIN</button>
            </div>
            
            <div class="demo-settings grid grid-2 gap-4 max-w-md mx-auto">
              <div class="setting-item">
                <label>Volume: <span id="demo-volume-val">100%</span></label>
                <input type="range" id="demo-volume" min="0" max="1" step="0.1" value="1" class="w-full">
              </div>
              <div class="setting-item">
                <label>Speed</label>
                <select id="demo-speed" class="w-full p-2 border-radius">
                  <option value="0.7">Slow</option>
                  <option value="1" selected>Normal</option>
                  <option value="1.5">Fast</option>
                </select>
              </div>
              <div class="setting-item col-span-2 flex justify-between items-center">
                <label>Auto Speak</label>
                <label class="switch">
                  <input type="checkbox" id="demo-auto-speak" checked>
                  <span class="slider round"></span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- VOICE SETTINGS -->
      <section class="section section-padding">
        <div class="container">
          <h2 class="text-center mb-4">Voice Settings</h2>
          <div class="voice-settings-panel max-w-md mx-auto p-4 bg-surface border-radius">
            <div class="setting-group mb-4">
              <label>Voice Selection</label>
              <select id="voice-select" class="w-full p-2 border-radius mt-2">
                <option value="">Default Voice</option>
              </select>
            </div>
            <div class="setting-group flex justify-between items-center">
              <label>Repeat Gesture</label>
              <label class="switch">
                <input type="checkbox" id="repeat-gesture-toggle">
                <span class="slider round"></span>
              </label>
            </div>
          </div>
        </div>
      </section>

      <!-- ACCESSIBILITY CONTROLS -->
      <section class="section section-padding bg-surface">
        <div class="container text-center">
          <h2 class="mb-4">Accessibility Controls</h2>
          ${renderAccessibilityControls()}
        </div>
      </section>
    </div>
  `;
}

export function init() {
  initPipeline();
  initAccessibilityControls();
  initTooltips();

  const detectedDisplay = $('#demo-detected-gesture');
  let currentGesture = '';

  // Setup Voice Settings
  const populateVoices = () => {
    const select = $('#voice-select');
    if (!select) return;
    const voices = voiceService.getVoices();
    select.innerHTML = voices.map((v, i) => `<option value="${i}">${v.name} (${v.lang})</option>`).join('');
  };
  
  if (voiceService.getVoices().length) {
    populateVoices();
  } else {
    // Wait for voices to be loaded
    speechSynthesis.onvoiceschanged = populateVoices;
  }

  // Demo Grid Click
  $$('.demo-gesture-btn').forEach(btn => {
    on(btn, 'click', (e) => {
      currentGesture = e.target.dataset.gesture;
      if(detectedDisplay) detectedDisplay.textContent = `Detected: ${currentGesture}`;
      
      const autoSpeak = $('#demo-auto-speak')?.checked;
      if (autoSpeak) {
        voiceService.speak(currentGesture);
      }
    });
  });

  // Speak Buttons
  const speakBtn = $('#demo-speak-btn');
  const speakAgainBtn = $('#demo-speak-again-btn');
  
  if (speakBtn) {
    on(speakBtn, 'click', () => {
      if (currentGesture) voiceService.speak(currentGesture);
    });
  }
  
  if (speakAgainBtn) {
    on(speakAgainBtn, 'click', () => {
      if (currentGesture) voiceService.speak(currentGesture);
    });
  }

  // Volume
  const volumeSlider = $('#demo-volume');
  const volumeVal = $('#demo-volume-val');
  if (volumeSlider) {
    on(volumeSlider, 'input', (e) => {
      const vol = parseFloat(e.target.value);
      if(volumeVal) volumeVal.textContent = `${Math.round(vol * 100)}%`;
      voiceService.setVolume(vol);
    });
  }

  // Speed
  const speedSelect = $('#demo-speed');
  if (speedSelect) {
    on(speedSelect, 'change', (e) => {
      const rate = parseFloat(e.target.value);
      voiceService.setRate(rate);
    });
  }
}

export function cleanup() {
  // Clear listeners by recreating nodes if necessary or using named functions
  // Since our framework removes listeners automatically or we rely on page re-render, we do minimal manual cleanup.
  speechSynthesis.onvoiceschanged = null;
}
