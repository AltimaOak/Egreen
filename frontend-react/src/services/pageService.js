// Page Content Management Service
import { storageService } from './storageService';
import { activityService } from './activityService';
import { 
  DEFAULT_HOMEPAGE_DATA, 
  DEFAULT_ABOUT_DATA, 
  DEFAULT_CONTACT_DATA 
} from '../config/adminConfig';

const KEYS = {
  HOMEPAGE: 'page_homepage',
  ABOUT: 'page_about',
  CONTACT: 'page_contact'
};

export const pageService = {
  /**
   * Get Homepage content
   * @returns {Promise<any>}
   */
  async getHomepage() {
    await storageService.simulateDelay(100);
    return storageService.load(KEYS.HOMEPAGE, DEFAULT_HOMEPAGE_DATA);
  },

  /**
   * Update Homepage content
   * @param {any} data 
   * @returns {Promise<any>}
   */
  async updateHomepage(data) {
    await storageService.simulateDelay(2000); // 2s simulated API delay
    storageService.save(KEYS.HOMEPAGE, data);
    await activityService.logActivity('Homepage Updated', 'Homepage section headings, CTA buttons and text elements were updated.');
    return data;
  },

  /**
   * Get About page content
   * @returns {Promise<any>}
   */
  async getAbout() {
    await storageService.simulateDelay(100);
    return storageService.load(KEYS.ABOUT, DEFAULT_ABOUT_DATA);
  },

  /**
   * Update About page content
   * @param {any} data 
   * @returns {Promise<any>}
   */
  async updateAbout(data) {
    await storageService.simulateDelay(2000); // 2s simulated API delay
    storageService.save(KEYS.ABOUT, data);
    await activityService.logActivity('About Page Updated', 'Mission, vision statements, achievements, or timeline items were updated.');
    return data;
  },

  /**
   * Get Contact page content
   * @returns {Promise<any>}
   */
  async getContact() {
    await storageService.simulateDelay(100);
    return storageService.load(KEYS.CONTACT, DEFAULT_CONTACT_DATA);
  },

  /**
   * Update Contact page content
   * @param {any} data 
   * @returns {Promise<any>}
   */
  async updateContact(data) {
    await storageService.simulateDelay(2000); // 2s simulated API delay
    storageService.save(KEYS.CONTACT, data);
    await activityService.logActivity('Contact Details Updated', 'Office address, phone numbers, working hours, and social media handles were updated.');
    return data;
  }
};
