export class StorageService {
  constructor() {
    this.prefix = 'aiglove_';
  }

  get(key) {
    try {
      const value = localStorage.getItem(this.prefix + key);
      return value ? JSON.parse(value) : null;
    } catch (e) {
      console.error('Error reading from localStorage:', e);
      return null;
    }
  }

  set(key, value) {
    try {
      localStorage.setItem(this.prefix + key, JSON.stringify(value));
    } catch (e) {
      console.error('Error writing to localStorage:', e);
    }
  }

  remove(key) {
    try {
      localStorage.removeItem(this.prefix + key);
    } catch (e) {
      console.error('Error removing from localStorage:', e);
    }
  }

  clear() {
    try {
      const keysToRemove = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(this.prefix)) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach(key => localStorage.removeItem(key));
    } catch (e) {
      console.error('Error clearing localStorage:', e);
    }
  }

  has(key) {
    try {
      return localStorage.getItem(this.prefix + key) !== null;
    } catch (e) {
      console.error('Error checking localStorage:', e);
      return false;
    }
  }
}

export const storageService = new StorageService();
