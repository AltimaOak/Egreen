// Local Storage Wrapper with simulated network latency (Future API Ready)

const STORAGE_PREFIX = 'egreen_';

export const storageService = {
  /**
   * Save a value to localStorage
   * @param {string} key 
   * @param {any} value 
   */
  save(key, value) {
    try {
      localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value));
      return true;
    } catch (e) {
      console.error('Error saving to localStorage', e);
      return false;
    }
  },

  /**
   * Load a value from localStorage
   * @param {string} key 
   * @param {any} defaultValue 
   * @returns {any}
   */
  load(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(STORAGE_PREFIX + key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (e) {
      console.error('Error loading from localStorage', e);
      return defaultValue;
    }
  },

  /**
   * Remove a value from localStorage
   * @param {string} key 
   */
  remove(key) {
    localStorage.removeItem(STORAGE_PREFIX + key);
  },

  /**
   * Clear all items related to this app
   */
  clear() {
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith(STORAGE_PREFIX)) {
        localStorage.removeItem(key);
      }
    });
  },

  /**
   * Simulate API delay
   * @param {number} ms 
   * @returns {Promise<void>}
   */
  simulateDelay(ms = 2000) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
};
