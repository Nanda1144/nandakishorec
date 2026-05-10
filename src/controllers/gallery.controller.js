'use strict';

const Gallery = require('../models/gallery.model');
const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const { HTTP_STATUS, MESSAGES } = require('../constants');
const ApiError = require('../utils/ApiError');
const uploadService = require('../services/upload.service');

/**
 * Gallery Controller.
 */

const getAllImages = asyncHandler(async (req, res) => {
  const { frontend, type, page = 1, limit = 20 } = req.query;
  const filter = {};

  if (frontend) filter.frontends = frontend;
  if (type) filter.type = type;

  const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);

  const [images, total] = await Promise.all([
    Gallery.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit, 10))
      .lean(),
    Gallery.countDocuments(filter),
  ]);

  return new ApiResponse(HTTP_STATUS.OK, { images, total, page, limit, pages: Math.ceil(total / limit) }, MESSAGES.SUCCESS).send(res);
});

const deleteImage = asyncHandler(async (req, res) => {
  const image = await Gallery.findByIdAndDelete(req.params.id);
  if (!image) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Image not found in gallery');
  }
  return new ApiResponse(HTTP_STATUS.OK, null, 'Image deleted from gallery successfully').send(res);
});

const uploadMedia = asyncHandler(async (req, res) => {
  const { frontend, type = 'other' } = req.body;
  
  if (!req.files || req.files.length === 0) {
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'No files provided');
  }

  const uploadedImages = [];

  for (const file of req.files) {
    // Determine type for Cloudinary based on mimetype
    const resourceType = file.mimetype.startsWith('video/') ? 'video' : (file.mimetype.includes('pdf') ? 'raw' : 'image');
    
    const secureUrl = await uploadService.uploadFile(file.path, 'gallery', resourceType);
    
    if (secureUrl) {
      const newImage = await Gallery.create({
        imageUrl: secureUrl,
        caption: file.originalname,
        type,
        frontends: frontend ? [frontend] : ['global']
      });
      uploadedImages.push(newImage);
    }
  }

  return new ApiResponse(HTTP_STATUS.CREATED, uploadedImages, 'Media uploaded successfully').send(res);
});

module.exports = { getAllImages, deleteImage, uploadMedia };
