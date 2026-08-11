import { $, on, show, hide } from '../utils/dom.js';
import { eventBus } from '../utils/events.js';
import { calibrationService } from '../services/calibration.service.js';

export function renderCalibrationPanel() {
  return `
    <div class="panel calibration-panel">
      <div class="card-header">
        <span class="icon">⚙️</span> CALIBRATION
      </div>
      <div class="card-body">
        <div class="calibration-steps">
          <div class="step-indicator" id="cal-step-1">1</div>
          <div class="step-indicator" id="cal-step-2">2</div>
          <div class="step-indicator" id="cal-step-3">3</div>
        </div>
        
        <div class="calibration-info mt-3">
          <h3 id="cal-step-name">Not Calibrated</h3>
          <p id="cal-instruction">Click Start to begin calibration process.</p>
          <div id="cal-hint" class="hint-emoji" style="font-size:2rem; text-align:center;"></div>
        </div>
        
        <div class="progress-bar-container mt-3">
          <div id="cal-progress-bar" class="progress-bar" style="width: 0%;"></div>
        </div>
        
        <div id="cal-timer" class="timer-display mt-2" style="display:none; text-align:center; font-weight:bold;"></div>
        
        <div class="calibration-controls mt-3">
          <button id="btn-cal-start" class="btn btn-primary">START CALIBRATION</button>
          <button id="btn-cal-next" class="btn btn-secondary" style="display:none;">NEXT STEP</button>
          <button id="btn-cal-finish" class="btn btn-primary" style="display:none;">FINISH</button>
          <button id="btn-cal-cancel" class="btn btn-danger" style="display:none;">CANCEL</button>
        </div>
        
        <div class="status-line mt-2">Status: <span id="cal-status-text">Not calibrated</span></div>
      </div>
    </div>
  `;
}

export function initCalibrationPanel() {
  const btnStart = $('#btn-cal-start');
  const btnNext = $('#btn-cal-next');
  const btnFinish = $('#btn-cal-finish');
  const btnCancel = $('#btn-cal-cancel');
  
  const stepNameEl = $('#cal-step-name');
  const instructionEl = $('#cal-instruction');
  const hintEl = $('#cal-hint');
  const progressEl = $('#cal-progress-bar');
  const timerEl = $('#cal-timer');
  const statusEl = $('#cal-status-text');

  on(btnStart, 'click', () => calibrationService.start());
  on(btnNext, 'click', () => calibrationService.nextStep());
  on(btnFinish, 'click', () => calibrationService.finish());
  on(btnCancel, 'click', () => calibrationService.cancel());

  let timerInterval = null;

  eventBus.on('calibration-update', (state) => {
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }

    if (!state.isCalibrating) {
      if (state.completed) {
        statusEl.textContent = 'Calibrated';
        stepNameEl.textContent = 'Calibration Complete';
        instructionEl.textContent = 'Your glove is ready to use.';
        hintEl.textContent = '✅';
      } else {
        statusEl.textContent = 'Not calibrated';
        stepNameEl.textContent = 'Not Calibrated';
        instructionEl.textContent = 'Click Start to begin calibration process.';
        hintEl.textContent = '';
      }
      progressEl.style.width = '0%';
      hide(timerEl);
      show(btnStart);
      hide(btnNext);
      hide(btnFinish);
      hide(btnCancel);
      [1, 2, 3].forEach(i => $('#cal-step-' + i).className = 'step-indicator');
      return;
    }

    statusEl.textContent = 'Calibrating...';
    hide(btnStart);
    show(btnCancel);
    
    const step = state.step;
    progressEl.style.width = state.progress + '%';
    
    [1, 2, 3].forEach(i => {
      const el = $('#cal-step-' + i);
      if (i < state.stepIndex + 1) el.className = 'step-indicator complete';
      else if (i === state.stepIndex + 1) el.className = 'step-indicator active';
      else el.className = 'step-indicator';
    });

    if (step) {
      stepNameEl.textContent = step.name;
      instructionEl.textContent = step.instruction;
      if (step.id === 'open') hintEl.textContent = '✋';
      else if (step.id === 'fist') hintEl.textContent = '✊';
      else hintEl.textContent = '🤚';
      
      let timeLeft = step.duration / 1000;
      show(timerEl);
      timerEl.textContent = timeLeft + 's remaining';
      
      timerInterval = setInterval(() => {
        timeLeft -= 1;
        if (timeLeft >= 0) timerEl.textContent = timeLeft + 's remaining';
      }, 1000);
    }
    
    if (state.isLastStep) {
      hide(btnNext);
      show(btnFinish);
    } else {
      show(btnNext);
      hide(btnFinish);
    }
  });
}
