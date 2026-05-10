'use strict';

const Frontend = require('../models/frontend.model');
const ApiError = require('../utils/ApiError');
const { HTTP_STATUS, MESSAGES } = require('../constants');

/**
 * FrontendService — business logic for managing frontend instances.
 */
class FrontendService {
  /**
   * Get all frontends.
   * @param {object} options - query options
   */
  async getAllFrontends(query = {}) {
    // If we want to support filtering by isActive or other fields
    return await Frontend.find(query).sort({ createdAt: -1 }).lean();
  }

  /**
   * Get single frontend by ID.
   */
  async getFrontendById(id) {
    const frontend = await Frontend.findById(id).lean();
    if (!frontend) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Frontend not found');
    }
    return frontend;
  }

  /**
   * Create a new frontend.
   */
  async createFrontend(payload) {
    return await Frontend.create(payload);
  }

  /**
   * Update frontend.
   */
  async updateFrontend(id, payload) {
    const frontend = await Frontend.findByIdAndUpdate(id, payload, {
      new: true,
      runValidators: true,
    }).lean();
    if (!frontend) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Frontend not found');
    }
    return frontend;
  }

  /**
   * Delete frontend (Hard delete).
   */
  async deleteFrontend(id) {
    const frontend = await Frontend.findByIdAndDelete(id);
    if (!frontend) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Frontend not found');
    }
    return { message: 'Frontend deleted successfully' };
  }

  /**
   * Enable/Disable frontend.
   */
  async toggleFrontendStatus(id, isActive) {
    const frontend = await Frontend.findByIdAndUpdate(
      id,
      { isActive },
      { new: true, runValidators: true }
    ).lean();
    if (!frontend) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Frontend not found');
    }
    return frontend;
  }
}

module.exports = new FrontendService();
