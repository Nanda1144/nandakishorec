'use strict';

const Hero = require('../models/hero.model');
const uploadService = require('../services/upload.service');
const socketService = require('../services/socket.service');
const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const { HTTP_STATUS, MESSAGES } = require('../constants');

/**
 * Hero Controller — Handles homepage Hero section configuration.
 */

const getHero = asyncHandler(async (req, res) => {
  const { frontendSlug } = req.params;
  let hero = await Hero.findOne({ frontendSlug }).lean();
  
  if (!hero) {
    hero = await Hero.create({ 
      frontendSlug, 
      title: 'Welcome to My Portfolio',
      ctaButtons: []
    });
  }
  
  return new ApiResponse(HTTP_STATUS.OK, hero, MESSAGES.SUCCESS).send(res);
});

const updateHero = asyncHandler(async (req, res) => {
  const { frontendSlug } = req.params;
  const payload = { ...req.body };

  // Handle image uploads if present
  if (req.files) {
    if (req.files.profileImage) {
      payload.profileImage = await uploadService.uploadFile(req.files.profileImage[0].path, 'hero/profile', 'image');
    }
    if (req.files.backgroundImages) {
      const paths = req.files.backgroundImages.map(f => f.path);
      payload.backgroundImages = await uploadService.uploadMultiple(paths, 'hero/backgrounds', 'image');
    }
  }

  const hero = await Hero.findOneAndUpdate(
    { frontendSlug },
    payload,
    { new: true, runValidators: true, upsert: true }
  ).lean();

  // Real-time broadcast
  socketService.emitUpdate(frontendSlug, 'hero', hero);

  return new ApiResponse(HTTP_STATUS.OK, hero, MESSAGES.UPDATED).send(res);
});

module.exports = {
  getHero,
  updateHero,
};
