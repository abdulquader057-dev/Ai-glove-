/**
 * EventBus for decoupled service-UI communication
 * 
 * Key events:
 * - 'sensor-update' - { flex, imu, timestamp }
 * - 'gesture-detected' - { gesture, confidence, timestamp, source }
 * - 'mode-change' - { mode: 'simulation'|'hardware' }
 * - 'ble-status' - { status, device, error }
 * - 'voice-speak' - { text }
 * - 'calibration-update' - { step, progress, status }
 * - 'history-update' - { entries }
 * - 'phrase-update' - { words, sentence }
 * - 'settings-change' - { setting, value }
 */
class EventBus {
  constructor() {
    this.listeners = new Map();
  }

  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event).add(callback);

    // Return unsubscribe function
    return () => this.off(event, callback);
  }

  off(event, callback) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).delete(callback);
      if (this.listeners.get(event).size === 0) {
        this.listeners.delete(event);
      }
    }
  }

  emit(event, data) {
    if (this.listeners.has(event)) {
      for (const callback of this.listeners.get(event)) {
        try {
          callback(data);
        } catch (error) {
          console.error(`Error in event listener for ${event}:`, error);
        }
      }
    }
  }

  once(event, callback) {
    const unsubscribe = this.on(event, (data) => {
      unsubscribe();
      callback(data);
    });
    return unsubscribe;
  }

  clear(event) {
    if (this.listeners.has(event)) {
      this.listeners.delete(event);
    }
  }

  clearAll() {
    this.listeners.clear();
  }
}

export const eventBus = new EventBus();
