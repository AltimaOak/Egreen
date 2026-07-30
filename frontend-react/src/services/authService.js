 // Authentication Service
import { ADMIN_CREDENTIALS } from '../config/adminConfig';
import { storageService } from './storageService';
import { activityService } from './activityService';

const AUTH_KEY = 'auth_session';
const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

/**
 * Hash a string to SHA-256 hex representation
 * @param {string} string 
 * @returns {Promise<string>}
 */
async function hashSHA256(string) {
  const utf8 = new TextEncoder().encode(string);
  const hashBuffer = await crypto.subtle.digest('SHA-256', utf8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export const authService = {
  /**
   * Log in user by validating credentials
   * @param {string} username 
   * @param {string} password 
   * @returns {Promise<{success: boolean, error?: string}>}
   */
  async login(username, password) {
    await storageService.simulateDelay(1000); // 1s login response simulation
    
    if (!username || !password) {
      return { success: false, error: 'Username and password are required.' };
    }

    const inputHash = await hashSHA256(password);
    
    // Check credentials (from config or settings)
    const storedSettings = storageService.load('settings', null);
    const expectedUsername = storedSettings?.adminUsername || ADMIN_CREDENTIALS.username;
    const expectedHash = storedSettings?.adminPasswordHash || ADMIN_CREDENTIALS.passwordHash;

    if (username.toLowerCase() === expectedUsername.toLowerCase() && inputHash === expectedHash) {
      const now = Date.now();
      const session = {
        token: 'mock-jwt-token-' + Math.random().toString(36).substring(2),
        username: expectedUsername,
        loginTime: now,
        expiryTime: now + SESSION_DURATION
      };
      
      storageService.save(AUTH_KEY, session);
      
      // Log activity
      await activityService.logActivity('Admin Login', `User '${expectedUsername}' logged in successfully.`);
      
      return { success: true };
    }

    return { success: false, error: 'Invalid username or password.' };
  },

  /**
   * Log out currently authenticated session
   */
  async logout() {
    const session = storageService.load(AUTH_KEY);
    if (session) {
      await activityService.logActivity('Admin Logout', `User '${session.username}' logged out.`);
    }
    storageService.remove(AUTH_KEY);
  },

  /**
   * Verify if current session is active and valid
   * @returns {boolean}
   */
  isAuthenticated() {
    const session = storageService.load(AUTH_KEY, null);
    if (!session) return false;

    const now = Date.now();
    if (now > session.expiryTime) {
      this.logout(); // expired, clear session
      return false;
    }
    return true;
  },

  /**
   * Get current session info
   * @returns {any}
   */
  getCurrentUser() {
    return storageService.load(AUTH_KEY, null);
  },

  /**
   * Update admin credentials stored in settings
   * @param {string} newUsername 
   * @param {string} newPassword 
   */
  async updateCredentials(newUsername, newPassword) {
    const storedSettings = storageService.load('settings', {});
    storedSettings.adminUsername = newUsername;
    if (newPassword) {
      storedSettings.adminPasswordHash = await hashSHA256(newPassword);
    }
    storageService.save('settings', storedSettings);
    await activityService.logActivity('Credentials Updated', 'Admin login credentials updated.');
    return true;
  }
};
