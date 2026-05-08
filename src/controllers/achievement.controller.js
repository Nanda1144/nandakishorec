'use strict';

const achievementService = require('../services/achievement.service');
const uploadService = require('../services/upload.service');
const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const { HTTP_STATUS, MESSAGES } = require('../constants');

/**
 * Achievement Controller.
 */

const getAllAchievements = asyncHandler(async (req, res) => {
  const { page, limit, frontend, search } = req.query;
  const result = await achievementService.getAllAchievements({ page, limit, frontend, search });
  return new ApiResponse(HTTP_STATUS.OK, result, MESSAGES.SUCCESS).send(res);
});

const getAchievementById = asyncHandler(async (req, res) => {
  const achievement = await achievementService.getAchievementById(req.params.id);
  return new ApiResponse(HTTP_STATUS.OK, achievement, MESSAGES.SUCCESS).send(res);
});

const createAchievement = asyncHandler(async (req, res) => {
  const payload = { ...req.body };

  // Handle uploaded files with Cloudinary
  if (req.files) {
    if (req.files.photos) {
      const photoPaths = req.files.photos.map(file => file.path);
      payload.photos = await uploadService.uploadMultiple(photoPaths, 'achievements/photos', 'image');
    }
    if (req.files.certificate) {
      payload.certificate = await uploadService.uploadFile(req.files.certificate[0].path, 'achievements/certificates', 'raw');
    }
  }

  const achievement = await achievementService.createAchievement(payload);
  return new ApiResponse(HTTP_STATUS.CREATED, achievement, MESSAGES.CREATED).send(res);
});

const updateAchievement = asyncHandler(async (req, res) => {
  const payload = { ...req.body };

  // Handle uploaded files with Cloudinary
  if (req.files) {
    if (req.files.photos) {
      const photoPaths = req.files.photos.map(file => file.path);
      payload.photos = await uploadService.uploadMultiple(photoPaths, 'achievements/photos', 'image');
    }
    if (req.files.certificate) {
      payload.certificate = await uploadService.uploadFile(req.files.certificate[0].path, 'achievements/certificates', 'raw');
    }
  }

  const achievement = await achievementService.updateAchievement(req.params.id, payload);
  return new ApiResponse(HTTP_STATUS.OK, achievement, MESSAGES.UPDATED).send(res);
});

const deleteAchievement = asyncHandler(async (req, res) => {
  const result = await achievementService.deleteAchievement(req.params.id);
  return new ApiResponse(HTTP_STATUS.OK, result, MESSAGES.DELETED).send(res);
});

module.exports = {
  getAllAchievements,
  getAchievementById,
  createAchievement,
  updateAchievement,
  deleteAchievement,
};
