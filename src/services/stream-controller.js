import { eventBus } from '../utils/events.js';
import { APP_CONFIG } from '../config/app.config.js';
import { simulationService } from './simulation.service.js';
import { bleService } from './ble.service.js';
import { extractFeatures } from './feature-extractor.js';
import { mlAdapter } from './ml-adapter.js';

class StreamController {
  constructor() {
    this.mode = APP_CONFIG.defaultMode || 'simulation';
    this.running = false;
    
    this.lastGesture = null;
    this.lastGestureTimestamp = 0;
    this.consecutiveSameGestureCount = 0;
    
    this.duplicateCooldownMs = 1000;
    this.gestureHoldThreshold = 3;
    
    this.onSensorUpdate = this.onSensorUpdate.bind(this);
    eventBus.on('sensor-update', this.onSensorUpdate);
  }

  setMode(newMode) {
    if (this.mode === newMode) return;
    
    const wasRunning = this.running;
    if (wasRunning) {
      this.stop();
    }
    
    this.mode = newMode;
    this.resetFilter();
    
    eventBus.emit('mode-change', { mode: this.mode });
    
    if (wasRunning) {
      this.start();
    }
  }

  getMode() {
    return this.mode;
  }

  start() {
    if (this.running) return;
    this.running = true;
    this.resetFilter();
    
    if (this.mode === 'simulation') {
      simulationService.start();
    } else if (this.mode === 'hardware') {
      if (!bleService.getStatus().connected) {
        console.warn('Hardware mode started but BLE not connected');
      }
      // Assuming BLE is handled separately
    }
  }

  stop() {
    if (!this.running) return;
    this.running = false;
    
    if (this.mode === 'simulation') {
      simulationService.stop();
    } else if (this.mode === 'hardware') {
      // Typically we don't disconnect BLE, just ignore the stream
    }
  }

  isRunning() {
    return this.running;
  }

  async onSensorUpdate(sensorData) {
    if (!this.running) return;
    
    // 1. Extract features
    const features = extractFeatures(sensorData);
    
    // 2. Predict using ML adapter
    const prediction = await mlAdapter.predict(features);
    
    // 3. Apply smart filtering
    this.applyFiltering(prediction);
  }

  applyFiltering(prediction) {
    const { gesture, confidence, timestamp } = prediction;
    
    // Simple hold detection logic
    if (gesture === this.lastGesture) {
      this.consecutiveSameGestureCount++;
    } else {
      this.lastGesture = gesture;
      this.consecutiveSameGestureCount = 1;
    }
    
    if (this.consecutiveSameGestureCount >= this.gestureHoldThreshold) {
      const timeSinceLastEmit = timestamp - this.lastGestureTimestamp;
      
      if (timeSinceLastEmit > this.duplicateCooldownMs) {
        // Emit valid gesture
        this.lastGestureTimestamp = timestamp;
        
        eventBus.emit('gesture-detected', {
          ...prediction,
          source: this.mode
        });
      }
    }
  }

  resetFilter() {
    this.lastGesture = null;
    this.lastGestureTimestamp = 0;
    this.consecutiveSameGestureCount = 0;
  }

  getStatus() {
    return {
      mode: this.mode,
      running: this.running,
      lastGesture: this.lastGesture,
      filterState: {
        consecutiveCount: this.consecutiveSameGestureCount,
        lastTimestamp: this.lastGestureTimestamp
      }
    };
  }
}

export const streamController = new StreamController();
