'use strict';

const Research = require('../models/research.model');
const ApiError = require('../utils/ApiError');
const { HTTP_STATUS, MESSAGES } = require('../constants');

/**
 * ResearchService — business logic for Research operations.
 */
class ResearchService {
  /**
   * Get all research items.
   */
  async getAllResearch({ page = 1, limit = 10, frontend, search, all = false } = {}) {
    const filter = {};
    if (frontend) filter.frontends = frontend;
    if (search) filter.$text = { $search: search };
    
    // Only return enabled research items unless 'all' is requested (for admin)
    if (!all) {
      filter.isEnabled = true;
    }

    const skip = (page - 1) * limit;

    const [research, total] = await Promise.all([
      Research.find(filter)
        .sort(search ? { score: { $meta: 'textScore' } } : { publicationDate: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Research.countDocuments(filter),
    ]);

    return { research, total, page, limit, pages: Math.ceil(total / limit) };
  }

  /**
   * Get single research item.
   */
  async getResearchById(id) {
    const research = await Research.findById(id).lean();
    if (!research) throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Research item not found');
    return research;
  }

  /**
   * Create research item.
   */
  async createResearch(payload) {
    return await Research.create(payload);
  }

  /**
   * Update research item.
   */
  async updateResearch(id, payload) {
    const research = await Research.findByIdAndUpdate(id, payload, {
      new: true,
      runValidators: true,
    }).lean();
    if (!research) throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Research item not found');
    return research;
  }

  /**
   * Delete research item.
   */
  async deleteResearch(id) {
    const research = await Research.findByIdAndDelete(id);
    if (!research) throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Research item not found');
    return { message: 'Research item deleted successfully' };
  }
}

module.exports = new ResearchService();
