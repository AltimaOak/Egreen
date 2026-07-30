// Activity Logging Service
import { storageService } from './storageService';

const ACTIVITIES_KEY = 'activities';
const MAX_ACTIVITIES = 20;

export const activityService = {
  /**
   * Get list of activities
   * @returns {Promise<Array>}
   */
  async getActivities() {
    // Return logs instantly (no simulated latency for dashboard statistics load)
    return storageService.load(ACTIVITIES_KEY, this.getDefaultActivities());
  },

  /**
   * Log a new admin action
   * @param {string} action 
   * @param {string} details 
   * @returns {Promise<void>}
   */
  async logActivity(action, details) {
    const list = storageService.load(ACTIVITIES_KEY, this.getDefaultActivities());
    
    const newActivity = {
      id: 'act_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      action,
      details,
      timestamp: new Date().toISOString()
    };

    list.unshift(newActivity);
    
    // Limit to MAX_ACTIVITIES (20)
    if (list.length > MAX_ACTIVITIES) {
      list.pop();
    }

    storageService.save(ACTIVITIES_KEY, list);
    
    // Add to pending changes counter
    const pendingChanges = storageService.load('pending_changes_count', 0);
    storageService.save('pending_changes_count', pendingChanges + 1);
    
    // Save last updated timestamp
    storageService.save('last_updated_time', new Date().toISOString());
  },

  /**
   * Reset pending changes counter
   */
  async clearPendingChanges() {
    storageService.save('pending_changes_count', 0);
  },

  /**
   * Get default activities to seed if empty
   */
  getDefaultActivities() {
    return [
      {
        id: 'act_init_1',
        action: 'System Initialized',
        details: 'Admin Panel storage systems initialized successfully.',
        timestamp: new Date(Date.now() - 3600000 * 2).toISOString() // 2 hours ago
      }
    ];
  }
};
