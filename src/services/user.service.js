'use strict';

const User = require('../models/user.model');
const ApiError = require('../utils/ApiError');
const { HTTP_STATUS, MESSAGES } = require('../constants');

/**
 * UserService — business logic layer for User operations.
 * Controllers call these methods; services interact with models.
 * This separation keeps controllers thin and logic testable.
 */
class UserService {
  /**
   * Returns all active users (paginated).
   * @param {object} options - { page, limit }
   */
  async getAllUsers({ page = 1, limit = 10 } = {}) {
    const skip = (page - 1) * limit;
    const [users, total] = await Promise.all([
      User.find({ isActive: true }).skip(skip).limit(limit).lean(),
      User.countDocuments({ isActive: true }),
    ]);
    return { users, total, page, limit, pages: Math.ceil(total / limit) };
  }

  /**
   * Returns a single user by ID.
   * @param {string} id - MongoDB ObjectId string
   */
  async getUserById(id) {
    const user = await User.findById(id).lean();
    if (!user) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, MESSAGES.NOT_FOUND);
    }
    return user;
  }

  /**
   * Creates a new user.
   * @param {object} payload - { name, email, password, role }
   */
  async createUser(payload) {
    const existing = await User.findOne({ email: payload.email });
    if (existing) {
      throw new ApiError(HTTP_STATUS.CONFLICT, 'A user with this email already exists.');
    }
    // In real auth, hash password here (e.g. bcrypt.hash)
    const user = await User.create(payload);
    return user.toSafeObject();
  }

  /**
   * Updates a user by ID.
   * @param {string} id      - MongoDB ObjectId
   * @param {object} payload - Fields to update
   */
  async updateUser(id, payload) {
    const user = await User.findByIdAndUpdate(id, payload, {
      new: true,
      runValidators: true,
    }).lean();
    if (!user) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, MESSAGES.NOT_FOUND);
    }
    return user;
  }

  /**
   * Soft-deletes a user by setting isActive = false.
   * @param {string} id - MongoDB ObjectId
   */
  async deleteUser(id) {
    const user = await User.findByIdAndUpdate(id, { isActive: false }, { new: true }).lean();
    if (!user) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, MESSAGES.NOT_FOUND);
    }
    return { message: MESSAGES.DELETED };
  }
}

module.exports = new UserService();
