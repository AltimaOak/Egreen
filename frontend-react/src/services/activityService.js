// Activity Logging Service — no pre-seeded mock activities
import { storageService } from './storageService';

const ACTIVITIES_KEY = 'activities';
const MAX_ACTIVITIES = 30;

export const activityService = {
  async getActivities() {
    return storageService.load(ACTIVITIES_KEY, []);
  },

  async logActivity(action, details) {
    const list = storageService.load(ACTIVITIES_KEY, []);

    const newActivity = {
      id: 'act_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      action,
      details,
      timestamp: new Date().toISOString(),
    };

    list.unshift(newActivity);

    if (list.length > MAX_ACTIVITIES) {
      list.pop();
    }

    storageService.save(ACTIVITIES_KEY, list);

    // Increment pending-changes counter
    const pendingChanges = storageService.load('pending_changes_count', 0);
    storageService.save('pending_changes_count', pendingChanges + 1);

    // Save last-updated timestamp
    storageService.save('last_updated_time', new Date().toISOString());
  },

  async clearPendingChanges() {
    storageService.save('pending_changes_count', 0);
  },
};
