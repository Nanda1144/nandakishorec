'use strict';

const researchService = require('../services/research.service');
const uploadService = require('../services/upload.service');
const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const { HTTP_STATUS, MESSAGES } = require('../constants');

/**
 * Research Controller.
 */

const getAllResearch = asyncHandler(async (req, res) => {
  const { page, limit, frontend, search, all } = req.query;
  const result = await researchService.getAllResearch({ 
    page, 
    limit, 
    frontend, 
    search, 
    all: all === 'true' 
  });
  return new ApiResponse(HTTP_STATUS.OK, result, MESSAGES.SUCCESS).send(res);
});

const getResearchById = asyncHandler(async (req, res) => {
  const research = await researchService.getResearchById(req.params.id);
  return new ApiResponse(HTTP_STATUS.OK, research, MESSAGES.SUCCESS).send(res);
});

const createResearch = asyncHandler(async (req, res) => {
  const payload = { ...req.body };

  // Handle uploaded certificate if any
  if (req.file) {
    payload.certificate = await uploadService.uploadFile(req.file.path, 'research/certificates', 'raw');
  }

  const research = await researchService.createResearch(payload);
  return new ApiResponse(HTTP_STATUS.CREATED, research, MESSAGES.CREATED).send(res);
});

const updateResearch = asyncHandler(async (req, res) => {
  const payload = { ...req.body };

  if (req.file) {
    payload.certificate = await uploadService.uploadFile(req.file.path, 'research/certificates', 'raw');
  }

  const research = await researchService.updateResearch(req.params.id, payload);
  return new ApiResponse(HTTP_STATUS.OK, research, MESSAGES.UPDATED).send(res);
});

const deleteResearch = asyncHandler(async (req, res) => {
  const result = await researchService.deleteResearch(req.params.id);
  return new ApiResponse(HTTP_STATUS.OK, result, MESSAGES.DELETED).send(res);
});

module.exports = {
  getAllResearch,
  getResearchById,
  createResearch,
  updateResearch,
  deleteResearch,
};
