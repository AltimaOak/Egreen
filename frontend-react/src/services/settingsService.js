// Settings Management Service
import { storageService } from './storageService';
import { activityService } from './activityService';
import { DEFAULT_SETTINGS_DATA } from '../config/adminConfig';

const SETTINGS_KEY = 'settings';

export const settingsService = {
  /**
   * Get website setting configurations
   * @returns {Promise<any>}
   */
  async getSettings() {
    await storageService.simulateDelay(100);
    return storageService.load(SETTINGS_KEY, DEFAULT_SETTINGS_DATA);
  },

  /**
   * Update website setting configurations
   * @param {any} data 
   * @returns {Promise<any>}
   */
  async updateSettings(data) {
    await storageService.simulateDelay(2000); // 2s simulated API delay
    const current = storageService.load(SETTINGS_KEY, DEFAULT_SETTINGS_DATA);
    const updated = { ...current, ...data };
    storageService.save(SETTINGS_KEY, updated);

    // If theme colors changed, write message
    const themeChanged = current.primaryColor !== updated.primaryColor || current.secondaryColor !== updated.secondaryColor;
    const logDetails = themeChanged 
      ? `Website config updated. Theme colors changed (Primary: ${updated.primaryColor}, Secondary: ${updated.secondaryColor}).`
      : 'Website name, logo, or settings were modified.';
      
    await activityService.logActivity('Settings Modified', logDetails);
    
    // Custom dispatch event so components can listen to setting updates immediately
    window.dispatchEvent(new Event('egreen_settings_updated'));
    
    return updated;
  }
};
