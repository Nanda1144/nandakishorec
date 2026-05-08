'use strict';

const Gallery = require('../models/gallery.model');
const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const { HTTP_STATUS, MESSAGES } = require('../constants');

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

module.exports = { getAllImages };
