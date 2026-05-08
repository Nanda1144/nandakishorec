'use strict';

const Internship = require('../models/internship.model');
const ApiError = require('../utils/ApiError');
const { HTTP_STATUS, MESSAGES } = require('../constants');

/**
 * InternshipService — business logic for Internship/Experience operations.
 */
class InternshipService {
  /**
   * Get all internships with filtering, search, and pagination.
   */
  async getAllInternships({
    page = 1,
    limit = 10,
    frontend,
    search,
  } = {}) {
    const filter = {};

    if (frontend) {
      filter.frontends = frontend;
    }

    if (search) {
      filter.$text = { $search: search };
    }

    const skip = (page - 1) * limit;

    const [internships, total] = await Promise.all([
      Internship.find(filter)
        .sort(search ? { score: { $meta: 'textScore' } } : { startDate: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Internship.countDocuments(filter),
    ]);

    return {
      internships,
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    };
  }

  /**
   * Get single internship by ID.
   */
  async getInternshipById(id) {
    const internship = await Internship.findById(id).lean();
    if (!internship) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Internship not found');
    }
    return internship;
  }

  /**
   * Create a new internship.
   */
  async createInternship(payload) {
    return await Internship.create(payload);
  }

  /**
   * Update internship.
   */
  async updateInternship(id, payload) {
    const internship = await Internship.findByIdAndUpdate(id, payload, {
      new: true,
      runValidators: true,
    }).lean();
    if (!internship) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Internship not found');
    }
    return internship;
  }

  /**
   * Delete internship.
   */
  async deleteInternship(id) {
    const internship = await Internship.findByIdAndDelete(id);
    if (!internship) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Internship not found');
    }
    return { message: 'Internship deleted successfully' };
  }
}

module.exports = new InternshipService();
