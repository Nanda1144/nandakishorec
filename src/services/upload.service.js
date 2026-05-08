'use strict';

const cloudinary = require('../config/cloudinary');
const ApiError = require('../utils/ApiError');
const { HTTP_STATUS } = require('../constants');
const fs = require('fs');

/**
 * UploadService — handles file uploads to Cloudinary.
 */
class UploadService {
  /**
   * Uploads a file to Cloudinary.
   * @param {string} filePath - Local path to the file (temp storage)
   * @param {string} folder   - Cloudinary folder name
   * @param {string} type     - 'image' or 'raw' (for PDFs/docs)
   */
  async uploadFile(filePath, folder = 'portfolio', type = 'auto') {
    try {
      if (!filePath) return null;

      const result = await cloudinary.uploader.upload(filePath, {
        folder: `portfolio/${folder}`,
        resource_type: type,
        use_filename: true,
        unique_filename: true,
        overwrite: false,
      });

      // Remove file from local temp storage after upload
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }

      return result.secure_url;
    } catch (error) {
      // Cleanup on error
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
      throw new ApiError(HTTP_STATUS.INTERNAL_SERVER_ERROR, `Cloudinary Upload Error: ${error.message}`);
    }
  }

  /**
   * Upload multiple files.
   */
  async uploadMultiple(filePaths, folder = 'portfolio', type = 'auto') {
    const uploadPromises = filePaths.map((path) => this.uploadFile(path, folder, type));
    return await Promise.all(uploadPromises);
  }

  /**
   * Delete file from Cloudinary (optional but good for cleanup).
   */
  async deleteFile(url) {
    try {
      if (!url) return;
      // Extract public_id from URL
      const parts = url.split('/');
      const filename = parts.pop().split('.')[0];
      const folder = parts.slice(parts.indexOf('portfolio')).join('/');
      const publicId = `${folder}/${filename}`;
      
      await cloudinary.uploader.destroy(publicId);
    } catch (error) {
      console.error('Cloudinary Delete Error:', error);
    }
  }
}

module.exports = new UploadService();
