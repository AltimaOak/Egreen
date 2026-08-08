const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Upload an image buffer to Cloudinary.
 * Only the returned URL + public_id should be stored in the database.
 * @param {Buffer} buffer
 * @param {{ folder?: string }} [options]
 * @returns {Promise<{ url: string, publicId: string }>}
 */
const uploadImage = (buffer, { folder = 'laptop' } = {}) =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (error) return reject(error);
        resolve({ url: result.secure_url, publicId: result.public_id });
      }
    );
    stream.end(buffer);
  });

/**
 * Delete an image from Cloudinary by its public_id.
 * @param {string} publicId
 * @returns {Promise<object>}
 */
const deleteImage = (publicId) =>
  new Promise((resolve, reject) => {
    cloudinary.uploader.destroy(publicId, (error, result) => {
      if (error) return reject(error);
      resolve(result);
    });
  });

module.exports = { cloudinary, uploadImage, deleteImage };
