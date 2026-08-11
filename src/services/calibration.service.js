import { eventBus } from '../utils/events.js';
import { storageService } from './storage.service.js';
import { BLE_CONFIG } from '../config/ble.config.js';
import { streamController } from './stream-controller.js';
import { bleService } from './ble.service.js';

class CalibrationService {
  constructor() {
    this.STEPS = [
      { id: 'open-hand', name: 'Open Hand', instruction: 'Extend all fingers fully', duration: 5000 },
      { id: 'closed-fist', name: 'Closed Fist', instruction: 'Close all fingers tightly', duration: 5000 },
      { id: 'neutral', name: 'Neutral Position', instruction: 'Relax your hand naturally', duration: 5000 }
    ];
    
    this.currentStepIndex = -1;
    this.calibrating = false;
    this.timer = null;
    this.stepStartTime = null;
    this.calibrationResults = {};
    this.calibrationKey = 'sensor_calibration';
  }

  getSteps() {
    return this.STEPS;
  }

  getCurrentStep() {
    if (this.currentStepIndex >= 0 && this.currentStepIndex < this.STEPS.length) {
      return { index: this.currentStepIndex, step: this.STEPS[this.currentStepIndex] };
    }
    return null;
  }

  getProgress() {
    if (!this.calibrating) return 0;
    const baseProgress = (this.currentStepIndex / this.STEPS.length) * 100;
    
    if (this.stepStartTime) {
      const stepInfo = this.STEPS[this.currentStepIndex];
      const elapsed = Date.now() - this.stepStartTime;
      const stepProgress = Math.min(1, elapsed / stepInfo.duration);
      return Math.min(100, baseProgress + (stepProgress * (100 / this.STEPS.length)));
    }
    return baseProgress;
  }

  isCalibrating() {
    return this.calibrating;
  }

  start() {
    if (this.calibrating) return;
    this.calibrating = true;
    this.currentStepIndex = 0;
    this.calibrationResults = {};
    
    this._startCurrentStep();
    eventBus.emit('calibration-update', { status: 'started', step: this.getCurrentStep() });
  }

  nextStep() {
    if (!this.calibrating) return;
    
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
    
    this._recordStepResult();
    
    this.currentStepIndex++;
    if (this.currentStepIndex >= this.STEPS.length) {
      this.finish();
    } else {
      this._startCurrentStep();
      eventBus.emit('calibration-update', { status: 'step-changed', step: this.getCurrentStep() });
    }
  }

  _startCurrentStep() {
    this.stepStartTime = Date.now();
    const stepDuration = this.STEPS[this.currentStepIndex].duration;
    
    // Simulate step timing
    this.timer = setInterval(() => {
      const elapsed = Date.now() - this.stepStartTime;
      if (elapsed >= stepDuration) {
        this.nextStep();
      } else {
        eventBus.emit('calibration-progress', { progress: this.getProgress() });
      }
    }, 100);
  }

  _recordStepResult() {
    const stepId = this.STEPS[this.currentStepIndex].id;
    
    // Collect data based on mode
    const mode = streamController.getMode();
    if (mode === 'simulation') {
      this.calibrationResults[stepId] = { mock: true, baseline: Math.random() };
    } else {
      // In hardware mode, attempt to send BLE command if configured
      if (BLE_CONFIG.CALIBRATION_COMMANDS && BLE_CONFIG.CALIBRATION_COMMANDS[stepId]) {
        bleService.sendCommand(BLE_CONFIG.CALIBRATION_COMMANDS[stepId]);
      } else {
        console.warn(`No hardware calibration command found for ${stepId}`);
      }
      this.calibrationResults[stepId] = { hardware: true, timestamp: Date.now() };
    }
  }

  finish() {
    this.calibrating = false;
    this._clearTimers();
    
    storageService.set(this.calibrationKey, this.calibrationResults);
    
    eventBus.emit('calibration-update', { status: 'finished', results: this.calibrationResults });
  }

  cancel() {
    this.calibrating = false;
    this._clearTimers();
    eventBus.emit('calibration-update', { status: 'cancelled' });
  }

  getCalibrationData() {
    return storageService.get(this.calibrationKey);
  }

  clearCalibration() {
    storageService.remove(this.calibrationKey);
    eventBus.emit('calibration-update', { status: 'cleared' });
  }

  _clearTimers() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
    this.stepStartTime = null;
  }
}

export const calibrationService = new CalibrationService();
