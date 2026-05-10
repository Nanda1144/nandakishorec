'use strict';

const frontendService = require('../services/frontend.service');
const scraperService = require('../utils/scraper.service');
const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const { HTTP_STATUS, MESSAGES } = require('../constants');
const emailService = require('../services/email.service');

/**
 * Frontend Controller.
 */

const getAllFrontends = asyncHandler(async (req, res) => {
  const frontends = await frontendService.getAllFrontends(req.query);
  return new ApiResponse(HTTP_STATUS.OK, frontends, MESSAGES.SUCCESS).send(res);
});

const getFrontendById = asyncHandler(async (req, res) => {
  const frontend = await frontendService.getFrontendById(req.params.id);
  return new ApiResponse(HTTP_STATUS.OK, frontend, MESSAGES.SUCCESS).send(res);
});

const createFrontend = asyncHandler(async (req, res) => {
  const { autoImport, ...frontendData } = req.body;
  const frontend = await frontendService.createFrontend(frontendData);
  
  let importResults = null;
  if (autoImport && frontend.url) {
    try {
      importResults = await scraperService.analyzeAndImport(frontend.url, frontend.slug);
    } catch (err) {
      console.error('Import during creation failed:', err);
    }
  }

  return new ApiResponse(HTTP_STATUS.CREATED, { frontend, importResults }, MESSAGES.CREATED).send(res);
});

const importAI = asyncHandler(async (req, res) => {
  const { url, slug } = req.body;
  if (!url || !slug) {
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'URL and Slug are required for AI import');
  }
  const results = await scraperService.analyzeAndImport(url, slug);
  return new ApiResponse(HTTP_STATUS.OK, results, 'AI Analysis and Import completed!').send(res);
});

const updateFrontend = asyncHandler(async (req, res) => {
  const frontend = await frontendService.updateFrontend(req.params.id, req.body);
  
  // Send email response with updated content
  await emailService.sendFrontendUpdateAlert({ frontend });

  return new ApiResponse(HTTP_STATUS.OK, frontend, MESSAGES.UPDATED).send(res);
});

const deleteFrontend = asyncHandler(async (req, res) => {
  const result = await frontendService.deleteFrontend(req.params.id);
  return new ApiResponse(HTTP_STATUS.OK, result, MESSAGES.DELETED).send(res);
});

const toggleStatus = asyncHandler(async (req, res) => {
  const { isActive } = req.body;
  const frontend = await frontendService.toggleFrontendStatus(req.params.id, isActive);
  const message = isActive ? 'Frontend enabled successfully' : 'Frontend disabled successfully';
  return new ApiResponse(HTTP_STATUS.OK, frontend, message).send(res);
});

const publish = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  const { config } = req.body;
  
  const frontend = await require('../models/frontend.model').findOneAndUpdate(
    { slug },
    { 
      publishedConfig: config,
      $push: { revisions: { config, updatedAt: new Date() } }
    },
    { new: true }
  );
  
  if (!frontend) throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Frontend not found');
  
  return new ApiResponse(HTTP_STATUS.OK, frontend, 'Website published live successfully!').send(res);
});

module.exports = {
  getAllFrontends,
  getFrontendById,
  createFrontend,
  importAI,
  updateFrontend,
  deleteFrontend,
  toggleStatus,
  publish,
};
