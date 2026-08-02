// Image Upload & Management Service
import { storageService } from './storageService';

export const imageService = {
  /**
   * Process and upload file
   * Converts to base64 representing upload to local storage
   * @param {File} file 
   * @returns {Promise<string>}
   */
  async uploadImage(file) {
    await storageService.simulateDelay(1500); // 1.5s simulated upload delay
    
    return new Promise((resolve, reject) => {
      if (!file) {
        reject(new Error('No file provided.'));
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result); // Returns base64 representation
      };
      reader.onerror = () => {
        reject(new Error('Failed to read file contents.'));
      };
      reader.readAsDataURL(file);
    });
  },

  /**
   * Delete an image
   * @param {string} urlOrBase64 
   * @returns {Promise<boolean>}
   */
  async deleteImage(urlOrBase64) {
    await storageService.simulateDelay(500);
    // In local storage, there is nothing specific to delete from storage directly unless tracking it.
    // In production, this would make an API call to delete the asset from S3/Cloudinary.
    return true;
  }
};
