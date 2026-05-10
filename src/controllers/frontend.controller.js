'use strict';

const frontendService = require('../services/frontend.service');
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
  const frontend = await frontendService.createFrontend(req.body);
  return new ApiResponse(HTTP_STATUS.CREATED, frontend, MESSAGES.CREATED).send(res);
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

module.exports = {
  getAllFrontends,
  getFrontendById,
  createFrontend,
  updateFrontend,
  deleteFrontend,
  toggleStatus,
};
