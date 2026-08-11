import { $, addClass, removeClass, animateElement } from '../utils/dom.js';
import { eventBus } from '../utils/events.js';
import { formatPercentage } from '../utils/format.js';

export function renderPredictionPanel() {
  return `
    <div class="panel prediction-panel">
      <div class="card-header">
        <span class="icon">🧠</span> DETECTED GESTURE
      </div>
      <div class="card-body">
        <div id="prediction-gesture-name" class="prediction-gesture">---</div>
        <div class="progress-bar-container">
          <div id="prediction-confidence-bar" class="progress-bar" style="width: 0%;"></div>
          <span id="prediction-confidence-text" class="confidence-text">0%</span>
        </div>
        <div class="model-info">Model: Simulation Model</div>
        <div id="prediction-status" class="badge badge-green">READY</div>
      </div>
    </div>
  `;
}

export function initPredictionPanel() {
  const gestureNameEl = $('#prediction-gesture-name');
  const confidenceBarEl = $('#prediction-confidence-bar');
  const confidenceTextEl = $('#prediction-confidence-text');
  
  let lastGesture = null;

  eventBus.on('gesture-detected', (data) => {
    updatePrediction(data.gesture, data.confidence, data.model);
    
    if (data.gesture !== lastGesture) {
      animateElement(gestureNameEl, 'scale-up');
      addClass(gestureNameEl, 'highlight');
      setTimeout(() => {
        removeClass(gestureNameEl, 'highlight');
      }, 500);
      lastGesture = data.gesture;
    }
  });
}

export function updatePrediction(gesture, confidence, model) {
  const gestureNameEl = $('#prediction-gesture-name');
  const confidenceBarEl = $('#prediction-confidence-bar');
  const confidenceTextEl = $('#prediction-confidence-text');
  
  if (gestureNameEl) gestureNameEl.textContent = gesture;
  if (confidenceBarEl) confidenceBarEl.style.width = `${confidence * 100}%`;
  if (confidenceTextEl) confidenceTextEl.textContent = formatPercentage(confidence);
}
