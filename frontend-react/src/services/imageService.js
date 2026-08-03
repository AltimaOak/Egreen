// Image Upload & Management Service — uploads to Cloudinary via the backend
const UPLOAD_URL = '/api/upload';

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

    const response = await fetch(UPLOAD_URL, { method: 'POST', body: formData });
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(data.error || 'Image upload failed.');
    }

    return { url: data.url, publicId: data.publicId };
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
    });

    return response.ok;
  }
};
