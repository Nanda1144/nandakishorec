'use strict';

const Course = require('../models/course.model');
const ApiError = require('../utils/ApiError');
const { HTTP_STATUS, MESSAGES } = require('../constants');

/**
 * CourseService — business logic for Course operations.
 */
class CourseService {
  /**
   * Get all courses with filtering, search, and pagination.
   */
  async getAllCourses({
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

    const [courses, total] = await Promise.all([
      Course.find(filter)
        .sort(search ? { score: { $meta: 'textScore' } } : { completionDate: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Course.countDocuments(filter),
    ]);

    return {
      courses,
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    };
  }

  /**
   * Get single course by ID.
   */
  async getCourseById(id) {
    const course = await Course.findById(id).lean();
    if (!course) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Course not found');
    }
    return course;
  }

  /**
   * Create a new course.
   */
  async createCourse(payload) {
    return await Course.create(payload);
  }

  /**
   * Update course.
   */
  async updateCourse(id, payload) {
    const course = await Course.findByIdAndUpdate(id, payload, {
      new: true,
      runValidators: true,
    }).lean();
    if (!course) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Course not found');
    }
    return course;
  }

  /**
   * Delete course.
   */
  async deleteCourse(id) {
    const course = await Course.findByIdAndDelete(id);
    if (!course) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Course not found');
    }
    return { message: 'Course deleted successfully' };
  }
}

module.exports = new CourseService();
