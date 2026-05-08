'use strict';

const Skill = require('../models/skill.model');
const ApiError = require('../utils/ApiError');
const { HTTP_STATUS, MESSAGES } = require('../constants');

/**
 * SkillService — business logic for Skill operations.
 */
class SkillService {
  /**
   * Get all skills with filtering, search, and pagination.
   */
  async getAllSkills({
    page = 1,
    limit = 100, // Default to higher limit for skills
    frontend,
    search,
    category,
  } = {}) {
    const filter = {};

    if (frontend) {
      filter.frontends = frontend;
    }

    if (category) {
      filter.category = category;
    }

    if (search) {
      filter.$text = { $search: search };
    }

    const skip = (page - 1) * limit;

    const [skills, total] = await Promise.all([
      Skill.find(filter)
        .sort(search ? { score: { $meta: 'textScore' } } : { category: 1, name: 1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Skill.countDocuments(filter),
    ]);

    return {
      skills,
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    };
  }

  /**
   * Get single skill by ID.
   */
  async getSkillById(id) {
    const skill = await Skill.findById(id).lean();
    if (!skill) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Skill not found');
    }
    return skill;
  }

  /**
   * Create a new skill.
   */
  async createSkill(payload) {
    const existing = await Skill.findOne({ name: payload.name });
    if (existing) {
      throw new ApiError(HTTP_STATUS.CONFLICT, 'Skill already exists');
    }
    return await Skill.create(payload);
  }

  /**
   * Update skill.
   */
  async updateSkill(id, payload) {
    const skill = await Skill.findByIdAndUpdate(id, payload, {
      new: true,
      runValidators: true,
    }).lean();
    if (!skill) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Skill not found');
    }
    return skill;
  }

  /**
   * Delete skill.
   */
  async deleteSkill(id) {
    const skill = await Skill.findByIdAndDelete(id);
    if (!skill) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Skill not found');
    }
    return { message: 'Skill deleted successfully' };
  }
}

module.exports = new SkillService();
