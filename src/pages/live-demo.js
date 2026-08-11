import { renderHolographicHand, initHolographicHand } from '../components/holographic-hand.js';
import { renderConnectionPanel, initConnectionPanel } from '../components/connection-panel.js';
import { renderSensorDisplay, initSensorDisplay } from '../components/sensor-display.js';
import { renderDeviceStatus, initDeviceStatus } from '../components/device-status.js';
import { renderPredictionPanel, initPredictionPanel } from '../components/prediction-panel.js';
import { renderVoicePanel, initVoicePanel } from '../components/voice-panel.js';
import { renderSentenceSandbox, initSentenceSandbox } from '../components/sentence-sandbox.js';
import { renderHistoryPanel, initHistoryPanel } from '../components/history-panel.js';
import { renderSensorGraph, initSensorGraph, destroySensorGraph } from '../components/sensor-graph.js';
import { renderGestureLibrary, initGestureLibrary } from '../components/gesture-library.js';
import { renderCalibrationPanel, initCalibrationPanel } from '../components/calibration-panel.js';
import { openModal } from '../components/modal.js';
import { initTooltips } from '../components/tooltip.js';
import { streamController } from '../services/stream-controller.js';
import { historyService } from '../services/history.service.js';
import { voiceService } from '../services/voice.service.js';
import { eventBus } from '../utils/events.js';
import { $, $$, on, off, show, hide } from '../utils/dom.js';

export function render() {
  return `
    <div class="page page-live-demo h-full flex flex-col">
      <!-- DEMO HEADER -->
      <header class="demo-header p-4 border-b flex justify-between items-center bg-surface z-10">
        <h1 class="text-xl font-bold">LIVE FEASIBILITY DEMO</h1>
        <div class="mode-toggle-group flex bg-background p-1 border-radius-lg">
          <button id="mode-sim" class="btn btn-sm btn-active flex-1">● SIMULATION</button>
          <button id="mode-live" class="btn btn-sm btn-ghost flex-1">○ LIVE HARDWARE</button>
        </div>
        <div id="demo-mode-label" class="text-sm text-secondary">
          SIMULATION MODE — Using generated sensor data
        </div>
      </header>

      <!-- MAIN LAYOUT -->
      <div class="demo-layout grid grid-cols-12 flex-1 overflow-hidden">
        
        <!-- LEFT SIDEBAR -->
        <aside class="demo-sidebar-left col-span-3 p-4 flex flex-col gap-4 overflow-y-auto border-r">
          ${renderConnectionPanel()}
          <div id="demo-sensors-container" class="flex-1 bg-surface border-radius p-4">
            <h3 class="mb-2">Sensor Data</h3>
            ${renderSensorDisplay('demo-sensors')}
          </div>
          ${renderDeviceStatus()}
        </aside>

        <!-- CENTER: HOLOGRAPHIC HAND -->
        <main class="demo-center col-span-6 relative flex items-center justify-center bg-black overflow-hidden">
          <div class="scanlines absolute inset-0 pointer-events-none opacity-20"></div>
          ${renderHolographicHand({ size: 'large', interactive: true, showGesture: true, id: 'demo-hand' })}
        </main>

        <!-- RIGHT SIDEBAR -->
        <aside class="demo-sidebar-right col-span-3 p-4 flex flex-col gap-4 overflow-y-auto border-l">
          ${renderPredictionPanel()}
          ${renderVoicePanel()}
          <div class="flex flex-col gap-2 mt-auto">
            <button id="btn-gesture-library" class="btn btn-secondary w-full">GESTURE LIBRARY</button>
            <button id="btn-calibration" class="btn btn-secondary w-full">CALIBRATION</button>
          </div>
        </aside>
      </div>

      <!-- BOTTOM AREA -->
      <div class="demo-bottom grid grid-cols-12 gap-4 p-4 border-t bg-surface z-10 max-h-64">
        <div class="col-span-8 flex flex-col h-full">
          ${renderSentenceSandbox()}
        </div>
        <div class="col-span-4 h-full overflow-hidden">
          ${renderHistoryPanel({ collapsible: false })}
        </div>
      </div>

      <!-- BOTTOM FOOTER -->
      <footer class="demo-footer border-t bg-background h-32">
        ${renderSensorGraph('demo-graph')}
      </footer>
    </div>
  `;
}

// Handlers for eventBus
const handleSensorUpdate = (data) => {
  // Handled inside components mostly via events, we can just ensure they're emitted
};

const handleGestureDetected = (data) => {
  historyService.addEntry(data.gesture);
  // Auto speak logic is typically inside prediction/voice panels or handled here
  if (window.autoSpeakEnabled) {
    voiceService.speak(data.gesture);
  }
};

const handleModeChange = (mode) => {
  const modeSim = $('#mode-sim');
  const modeLive = $('#mode-live');
  const label = $('#demo-mode-label');
  const indicator = document.getElementById('demo-mode-indicator');

  if (mode === 'simulation') {
    modeSim.classList.replace('btn-ghost', 'btn-active');
    modeSim.textContent = '● SIMULATION';
    modeLive.classList.replace('btn-active', 'btn-ghost');
    modeLive.textContent = '○ LIVE HARDWARE';
    if(label) label.textContent = 'SIMULATION MODE — Using generated sensor data';
    if(indicator) {
      indicator.textContent = 'SIMULATION';
      indicator.classList.remove('hidden');
    }
  } else {
    modeLive.classList.replace('btn-ghost', 'btn-active');
    modeLive.textContent = '● LIVE HARDWARE';
    modeSim.classList.replace('btn-active', 'btn-ghost');
    modeSim.textContent = '○ SIMULATION';
    if(label) label.textContent = 'LIVE HARDWARE — Connected to AI_GLOVE';
    if(indicator) {
      indicator.textContent = 'LIVE HARDWARE';
      indicator.classList.remove('hidden');
    }
  }
};

export function init() {
  // Show global indicator
  const indicator = document.getElementById('demo-mode-indicator');
  if(indicator) indicator.classList.remove('hidden');

  // Init components
  initHolographicHand('demo-hand');
  initConnectionPanel();
  initSensorDisplay('demo-sensors');
  initDeviceStatus();
  initPredictionPanel();
  initVoicePanel();
  initSentenceSandbox();
  initHistoryPanel();
  initSensorGraph('demo-graph');
  initTooltips();

  // Mode Toggle
  on($('#mode-sim'), 'click', () => {
    streamController.setMode('simulation');
  });

  on($('#mode-live'), 'click', async () => {
    try {
      await streamController.setMode('hardware');
    } catch (e) {
      console.error('BLE connection failed', e);
      alert('Failed to connect to hardware. Falling back to simulation.');
      streamController.setMode('simulation');
    }
  });

  // Buttons
  on($('#btn-gesture-library'), 'click', () => {
    openModal({
      title: 'Gesture Library',
      content: renderGestureLibrary(),
      onOpen: initGestureLibrary
    });
  });

  on($('#btn-calibration'), 'click', () => {
    openModal({
      title: 'Sensor Calibration',
      content: renderCalibrationPanel(),
      onOpen: initCalibrationPanel
    });
  });

  // Events
  eventBus.on('sensor-update', handleSensorUpdate);
  eventBus.on('gesture-detected', handleGestureDetected);
  eventBus.on('mode-change', handleModeChange);
  
  // Start stream controller (starts simulation by default)
  streamController.start();
  
  // Trigger initial mode UI state
  handleModeChange(streamController.getMode());
}

export function cleanup() {
  streamController.stop();
  destroySensorGraph();
  
  eventBus.off('sensor-update', handleSensorUpdate);
  eventBus.off('gesture-detected', handleGestureDetected);
  eventBus.off('mode-change', handleModeChange);
  
  const indicator = document.getElementById('demo-mode-indicator');
  if(indicator) indicator.classList.add('hidden');
}
