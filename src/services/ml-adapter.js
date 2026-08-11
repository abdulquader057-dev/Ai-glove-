import { ML_CONFIG } from '../config/ml.config.js';
import { GESTURES } from '../config/gestures.config.js';

class SimulationMLBackend {
  async predict(features) {
    let closestGesture = 'UNKNOWN';
    let minDistance = Infinity;
    
    for (const [id, gesture] of Object.entries(GESTURES)) {
      const profile = gesture.sensorProfile;
      const profileFeatures = [
        profile.flex.thumb, profile.flex.index, profile.flex.middle,
        profile.flex.ring, profile.flex.pinky,
        profile.imu?.x || 0, profile.imu?.y || 0, profile.imu?.z || 0
      ];
      
      let distanceSq = 0;
      for (let i = 0; i < features.length; i++) {
        distanceSq += Math.pow(features[i] - profileFeatures[i], 2);
      }
      
      const distance = Math.sqrt(distanceSq);
      if (distance < minDistance) {
        minDistance = distance;
        closestGesture = id;
      }
    }
    
    // Convert distance to confidence (arbitrary heuristic)
    const confidence = Math.max(0, Math.min(1, 1 - (minDistance / 2)));
    
    return {
      gesture: closestGesture,
      confidence: confidence,
      timestamp: Date.now(),
      model: 'Simulation Model'
    };
  }
}

class LocalPythonMLBackend {
  async predict(features) {
    if (!ML_CONFIG.PYTHON_API_URL) {
      throw new Error('Python API URL not configured.');
    }
    
    const response = await fetch(`${ML_CONFIG.PYTHON_API_URL}/predict`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ features })
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result = await response.json();
    return {
      gesture: result.gesture,
      confidence: result.confidence,
      timestamp: Date.now(),
      model: 'Local Python Model'
    };
  }
}

class ONNXMLBackend {
  async predict(features) {
    console.warn('ONNX model not loaded');
    throw new Error('ONNX model not configured. Please initialize ONNX runtime.');
  }
}

class TFJSMLBackend {
  async predict(features) {
    console.warn('TFJS model not loaded');
    throw new Error('TFJS model not configured. Please load a TFJS model first.');
  }
}

class MLAdapter {
  constructor() {
    this.backends = {
      'simulation': new SimulationMLBackend(),
      'python': new LocalPythonMLBackend(),
      'onnx': new ONNXMLBackend(),
      'tfjs': new TFJSMLBackend()
    };
    
    this.activeBackend = ML_CONFIG.DEFAULT_BACKEND || 'simulation';
  }

  setBackend(name) {
    if (this.backends[name]) {
      this.activeBackend = name;
    } else {
      console.error(`Unknown ML backend: ${name}`);
    }
  }

  async predict(featureVector) {
    try {
      const backend = this.backends[this.activeBackend];
      return await backend.predict(featureVector);
    } catch (error) {
      console.error('Prediction error:', error);
      return {
        gesture: 'ERROR',
        confidence: 0,
        timestamp: Date.now(),
        model: this.activeBackend,
        error: error.message
      };
    }
  }

  getStatus() {
    return {
      backend: this.activeBackend,
      model: 'Active Model',
      status: 'ready'
    };
  }
}

export const mlAdapter = new MLAdapter();
