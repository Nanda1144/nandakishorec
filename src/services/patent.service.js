'use strict';

const Patent = require('../models/patent.model');
const ApiError = require('../utils/ApiError');
const { HTTP_STATUS, MESSAGES } = require('../constants');

/**
 * PatentService — business logic for Patent operations.
 */
class PatentService {
  /**
   * Get all patents.
   */
  async getAllPatents({ page = 1, limit = 10, frontend, search, all = false } = {}) {
    const filter = {};
    if (frontend) filter.frontends = frontend;
    if (search) filter.$text = { $search: search };
    
    if (!all) {
      filter.isEnabled = true;
    }

    const skip = (page - 1) * limit;

    const [patents, total] = await Promise.all([
      Patent.find(filter)
        .sort(search ? { score: { $meta: 'textScore' } } : { createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Patent.countDocuments(filter),
    ]);

    return { patents, total, page, limit, pages: Math.ceil(total / limit) };
  }

  /**
   * Get single patent.
   */
  async getPatentById(id) {
    const patent = await Patent.findById(id).lean();
    if (!patent) throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Patent not found');
    return patent;
  }

  /**
   * Create patent.
   */
  async createPatent(payload) {
    return await Patent.create(payload);
  }

  /**
   * Update patent.
   */
  async updatePatent(id, payload) {
    const patent = await Patent.findByIdAndUpdate(id, payload, {
      new: true,
      runValidators: true,
    }).lean();
    if (!patent) throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Patent not found');
    return patent;
  }

  /**
   * Delete patent.
   */
  async deletePatent(id) {
    const patent = await Patent.findByIdAndDelete(id);
    if (!patent) throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Patent not found');
    return { message: 'Patent deleted successfully' };
  }
}

module.exports = new PatentService();
