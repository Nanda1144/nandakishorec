'use strict';

const Project = require('../models/project.model');
const ApiError = require('../utils/ApiError');
const { HTTP_STATUS, MESSAGES } = require('../constants');

/**
 * ProjectService — business logic for Project operations.
 */
class ProjectService {
  /**
   * Get all projects with filtering, search, and pagination.
   */
  async getAllProjects({
    page = 1,
    limit = 10,
    frontend,
    search,
    category,
    featured,
  } = {}) {
    const filter = {};

    // Filter by frontend (slug)
    if (frontend) {
      filter.frontends = frontend; // Mongoose handles $in automatically for arrays if passed a single value
    }

    // Filter by category
    if (category) {
      filter.category = category;
    }

    // Filter by featured
    if (typeof featured === 'boolean') {
      filter.featured = featured;
    }

    // Search by projectName or description using text index
    if (search) {
      filter.$text = { $search: search };
    }

    const skip = (page - 1) * limit;

    const [projects, total] = await Promise.all([
      Project.find(filter)
        .sort(search ? { score: { $meta: 'textScore' } } : { createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Project.countDocuments(filter),
    ]);

    return {
      projects,
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    };
  }

  /**
   * Get single project by ID.
   */
  async getProjectById(id) {
    const project = await Project.findById(id).lean();
    if (!project) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Project not found');
    }
    return project;
  }

  /**
   * Create a new project.
   */
  async createProject(payload) {
    return await Project.create(payload);
  }

  /**
   * Update project details.
   */
  async updateProject(id, payload) {
    const project = await Project.findByIdAndUpdate(id, payload, {
      new: true,
      runValidators: true,
    }).lean();
    if (!project) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Project not found');
    }
    return project;
  }

  /**
   * Delete project.
   */
  async deleteProject(id) {
    const project = await Project.findByIdAndDelete(id);
    if (!project) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Project not found');
    }
    return { message: 'Project deleted successfully' };
  }
}

module.exports = new ProjectService();
