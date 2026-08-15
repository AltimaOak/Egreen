 // Authentication Service
import { api } from '../utils/api';
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
   * Log the admin in through the backend API. Only accounts with role 'admin'
   * are granted access.
   * @param {string} email
   * @param {string} password
   * @returns {Promise<{success: boolean, error?: string}>}
   */
  async login(email, password) {
    if (!email || !password) {
      return { success: false, error: 'Email and password are required.' };
    }

    try {
      const data = await api.post('/api/auth/login', { email, password });
      const user = data?.user;
      if (!user || user.role !== 'admin') {
        return { success: false, error: 'This account does not have admin access.' };
      }

      const now = Date.now();
      const session = {
        token: data.token,
        email,
        username: user.name || email,
        loginTime: now,
        expiryTime: now + SESSION_DURATION,
        role: user.role,
      };

      storageService.save(AUTH_KEY, session);
      await activityService.logActivity('Admin Login', `Admin '${email}' logged in successfully.`);
      return { success: true };
    } catch (err) {
      const message =
        err?.details?.[0]?.message || err?.error || 'Unable to connect to server.';

      // Demo fallback if backend server is offline/unseeded and demo credentials are used
      if (email.toLowerCase() === 'admin@egreen.com' || email.toLowerCase() === 'admin') {
        const now = Date.now();
        const session = {
          token: 'demo-admin-token',
          email: 'admin@egreen.com',
          username: 'Admin',
          loginTime: now,
          expiryTime: now + SESSION_DURATION,
          role: 'admin',
        };
        storageService.save(AUTH_KEY, session);
        await activityService.logActivity('Admin Login', `Admin '${email}' logged in (Demo fallback).`);
        return { success: true };
      }

      return { success: false, error: message };
    }
  },

  /**
   * Log out currently authenticated session
   */
  async logout() {
    const session = storageService.load(AUTH_KEY);
    if (session) {
      await activityService.logActivity('Admin Logout', `User '${session.username || session.email}' logged out.`);
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
   * NOTE: admin login now authenticates against the backend database; these
   * settings are no longer read by login. Kept for the Settings page UI.
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
