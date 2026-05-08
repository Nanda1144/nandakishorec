'use strict';

const Achievement = require('../models/achievement.model');
const Gallery = require('../models/gallery.model');
const ApiError = require('../utils/ApiError');
const { HTTP_STATUS, MESSAGES } = require('../constants');

/**
 * AchievementService — business logic for Achievement operations.
 */
class AchievementService {
  /**
   * Syncs achievement photos to the Gallery collection.
   */
  async _syncToGallery(achievement) {
    // Remove old gallery entries for this achievement
    await Gallery.deleteMany({ refId: achievement._id, type: 'achievement' });

    // Create new gallery entries
    if (achievement.photos && achievement.photos.length > 0) {
      const galleryEntries = achievement.photos.map((url) => ({
        imageUrl: url,
        caption: achievement.title,
        type: 'achievement',
        refId: achievement._id,
        frontends: achievement.frontends,
      }));
      await Gallery.insertMany(galleryEntries);
    }
  }

  /**
   * Get all achievements.
   */
  async getAllAchievements({ page = 1, limit = 10, frontend, search } = {}) {
    const filter = {};
    if (frontend) filter.frontends = frontend;
    if (search) filter.$text = { $search: search };

    const skip = (page - 1) * limit;

    const [achievements, total] = await Promise.all([
      Achievement.find(filter)
        .sort(search ? { score: { $meta: 'textScore' } } : { achievementDate: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Achievement.countDocuments(filter),
    ]);

    return { achievements, total, page, limit, pages: Math.ceil(total / limit) };
  }

  /**
   * Get single achievement.
   */
  async getAchievementById(id) {
    const achievement = await Achievement.findById(id).lean();
    if (!achievement) throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Achievement not found');
    return achievement;
  }

  /**
   * Create achievement and sync gallery.
   */
  async createAchievement(payload) {
    const achievement = await Achievement.create(payload);
    await this._syncToGallery(achievement);
    return achievement;
  }

  /**
   * Update achievement and sync gallery.
   */
  async updateAchievement(id, payload) {
    const achievement = await Achievement.findByIdAndUpdate(id, payload, {
      new: true,
      runValidators: true,
    });
    if (!achievement) throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Achievement not found');
    await this._syncToGallery(achievement);
    return achievement;
  }

  /**
   * Delete achievement and clean up gallery.
   */
  async deleteAchievement(id) {
    const achievement = await Achievement.findByIdAndDelete(id);
    if (!achievement) throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Achievement not found');
    await Gallery.deleteMany({ refId: id, type: 'achievement' });
    return { message: 'Achievement and linked gallery images deleted' };
  }
}

module.exports = new AchievementService();
