// Image Upload & Management Service — uploads to Cloudinary via the backend.
// The upload endpoints require an authenticated admin, so include the token.
import { getAuthToken } from '../utils/api';

const UPLOAD_URL = '/api/upload';

function authHeaders(headers = {}) {
  const token = getAuthToken();
  return token ? { Authorization: `Bearer ${token}`, ...headers } : headers;
}

export const imageService = {
  /**
   * Upload an image file to Cloudinary through the backend.
   * Only the returned URL + public_id are stored on the product.
   * @param {File} file
   * @returns {Promise<{ url: string, publicId: string }>}
   */
  async uploadImage(file) {
    if (!file) {
      throw new Error('No file provided.');
    }

    const formData = new FormData();
    formData.append('image', file);

    const response = await fetch(UPLOAD_URL, {
      method: 'POST',
      headers: authHeaders(),
      body: formData,
    });
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(data.error || 'Image upload failed.');
    }

    return { url: data.url, publicId: data.publicId };
  },

  /**
   * Upload multiple image files (up to 5) concurrently.
   * @param {File[]} files - Array of image File objects
   * @returns {Promise<Array<{ url: string, publicId: string }>>}
   */
  async uploadImages(files) {
    if (!files || files.length === 0) return [];
    const limited = Array.from(files).slice(0, 5);
    return Promise.all(limited.map((file) => this.uploadImage(file)));
  },

  /**
   * Delete an image from Cloudinary by its public_id.
   * @param {string} publicId
   * @returns {Promise<boolean>}
   */
  async deleteImage(publicId) {
    if (!publicId) return true;

    const response = await fetch(`${UPLOAD_URL}/${encodeURIComponent(publicId)}`, {
      method: 'DELETE',
      headers: authHeaders(),
    });

    return response.ok;
  }
};
