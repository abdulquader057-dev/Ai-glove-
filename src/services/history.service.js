import { eventBus } from '../utils/events.js';
import { storageService } from './storage.service.js';
import { APP_CONFIG } from '../config/app.config.js';

class HistoryService {
  constructor() {
    this.historyKey = 'gesture_history';
    this.maxEntries = APP_CONFIG.historyMaxEntries || 1000;
    this.entries = storageService.get(this.historyKey) || [];
  }

  addEntry({ gesture, confidence, timestamp, duration, source }) {
    const entry = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 5),
      gesture,
      confidence,
      timestamp,
      duration: duration || 0,
      source: source || 'unknown'
    };

    this.entries.unshift(entry);
    
    if (this.entries.length > this.maxEntries) {
      this.entries = this.entries.slice(0, this.maxEntries);
    }
    
    this._persist();
    eventBus.emit('history-update', { entries: this.entries, newEntry: entry });
  }

  getHistory() {
    return [...this.entries];
  }

  getEntryCount() {
    return this.entries.length;
  }

  clearHistory() {
    this.entries = [];
    this._persist();
    eventBus.emit('history-update', { entries: [] });
  }

  undoLast() {
    if (this.entries.length > 0) {
      const removed = this.entries.shift();
      this._persist();
      eventBus.emit('history-update', { entries: this.entries, removed });
      return removed;
    }
    return null;
  }

  exportCSV() {
    if (this.entries.length === 0) return;
    
    const headers = ['Timestamp', 'Gesture', 'Confidence', 'Duration', 'Source'];
    const rows = this.entries.map(e => [
      new Date(e.timestamp).toISOString(),
      e.gesture,
      e.confidence.toFixed(3),
      e.duration,
      e.source
    ]);
    
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    this._triggerDownload(blob, `aiglove_history_${Date.now()}.csv`);
  }

  exportJSON() {
    if (this.entries.length === 0) return;
    
    const jsonStr = JSON.stringify(this.entries, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    this._triggerDownload(blob, `aiglove_history_${Date.now()}.json`);
  }

  _triggerDownload(blob, filename) {
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  _persist() {
    storageService.set(this.historyKey, this.entries);
  }
}

export const historyService = new HistoryService();
