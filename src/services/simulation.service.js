import { eventBus } from '../utils/events.js';
import { APP_CONFIG } from '../config/app.config.js';
import { GESTURES } from '../config/gestures.config.js';

class SimulationService {
  constructor() {
    this.running = false;
    this.paused = false;
    this.sensorInterval = null;
    this.gestureCycleTimer = null;
    
    this.gestures = Object.keys(GESTURES);
    this.currentGesture = null;
    this.nextGesture = null;
    this.transitionStartTime = null;
    this.transitionDuration = 500; 
    
    this.config = {
      updateInterval: APP_CONFIG.simulationUpdateInterval || 100,
      gestureCycleDuration: APP_CONFIG.simulationGestureCycleDuration || 4000,
      noiseLevel: APP_CONFIG.simulationNoiseLevel || 0.05
    };
  }

  start() {
    if (this.running) return;
    
    this.running = true;
    this.paused = false;
    this.pickNextGesture();
    
    this.sensorInterval = setInterval(() => {
      if (!this.paused) {
        this.generateAndEmitSensors();
      }
    }, this.config.updateInterval);
    
    this.gestureCycleTimer = setInterval(() => {
      if (!this.paused) {
        this.pickNextGesture();
      }
    }, this.config.gestureCycleDuration);
  }

  stop() {
    this.running = false;
    this.paused = false;
    
    if (this.sensorInterval) {
      clearInterval(this.sensorInterval);
      this.sensorInterval = null;
    }
    
    if (this.gestureCycleTimer) {
      clearInterval(this.gestureCycleTimer);
      this.gestureCycleTimer = null;
    }
  }

  pause() {
    if (this.running) {
      this.paused = true;
    }
  }

  resume() {
    if (this.running) {
      this.paused = false;
    }
  }

  isRunning() {
    return this.running && !this.paused;
  }

  setGesture(gestureId) {
    if (GESTURES[gestureId]) {
      this.currentGesture = gestureId;
      this.nextGesture = null;
      this.transitionStartTime = null;
    }
  }

  getStatus() {
    return {
      running: this.running,
      paused: this.paused,
      currentGesture: this.currentGesture,
      mode: 'simulation'
    };
  }

  pickNextGesture() {
    if (this.gestures.length === 0) return;
    
    const availableGestures = this.gestures.filter(g => g !== this.currentGesture);
    if (availableGestures.length === 0) {
      this.nextGesture = this.currentGesture;
    } else {
      const idx = Math.floor(Math.random() * availableGestures.length);
      this.nextGesture = availableGestures[idx];
    }
    
    this.transitionStartTime = Date.now();
    
    // Simulate gesture detected event from ML
    eventBus.emit('gesture-detected', {
      gesture: this.nextGesture,
      confidence: 0.78 + (Math.random() * 0.2), // 0.78 - 0.98
      timestamp: Date.now(),
      source: 'simulation',
      model: 'simulation'
    });
  }

  generateAndEmitSensors() {
    if (!this.currentGesture && !this.nextGesture) return;
    
    let profile = null;
    
    if (this.nextGesture && this.transitionStartTime) {
      const progress = (Date.now() - this.transitionStartTime) / this.transitionDuration;
      if (progress >= 1.0) {
        this.currentGesture = this.nextGesture;
        this.nextGesture = null;
        this.transitionStartTime = null;
        profile = GESTURES[this.currentGesture].sensorProfile;
      } else {
        const fromProfile = this.currentGesture ? GESTURES[this.currentGesture].sensorProfile : GESTURES[this.nextGesture].sensorProfile;
        const toProfile = GESTURES[this.nextGesture].sensorProfile;
        profile = this.interpolateProfiles(fromProfile, toProfile, progress);
      }
    } else {
      profile = GESTURES[this.currentGesture].sensorProfile;
    }
    
    if (!profile) return;
    
    const noise = this.config.noiseLevel;
    const addNoise = (val) => {
      const n = (Math.random() * 2 - 1) * noise;
      return Math.max(0, Math.min(1, val + n));
    };
    
    const sensorData = {
      flex: {
        thumb: addNoise(profile.flex.thumb),
        index: addNoise(profile.flex.index),
        middle: addNoise(profile.flex.middle),
        ring: addNoise(profile.flex.ring),
        pinky: addNoise(profile.flex.pinky)
      },
      imu: {
        x: (profile.imu?.x || 0) + (Math.random() * 2 - 1) * noise,
        y: (profile.imu?.y || 0) + (Math.random() * 2 - 1) * noise,
        z: (profile.imu?.z || 0) + (Math.random() * 2 - 1) * noise
      },
      timestamp: Date.now()
    };
    
    eventBus.emit('sensor-update', sensorData);
  }
  
  interpolateProfiles(from, to, progress) {
    const ease = (t) => t < .5 ? 2 * t * t : -1 + (4 - 2 * t) * t; // easeInOutQuad
    const t = ease(progress);
    
    const interp = (a, b) => a + (b - a) * t;
    
    return {
      flex: {
        thumb: interp(from.flex.thumb, to.flex.thumb),
        index: interp(from.flex.index, to.flex.index),
        middle: interp(from.flex.middle, to.flex.middle),
        ring: interp(from.flex.ring, to.flex.ring),
        pinky: interp(from.flex.pinky, to.flex.pinky)
      },
      imu: {
        x: interp(from.imu?.x || 0, to.imu?.x || 0),
        y: interp(from.imu?.y || 0, to.imu?.y || 0),
        z: interp(from.imu?.z || 0, to.imu?.z || 0)
      }
    };
  }
}

export const simulationService = new SimulationService();
