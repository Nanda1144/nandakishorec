'use strict';

const patentService = require('../services/patent.service');
const uploadService = require('../services/upload.service');
const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const { HTTP_STATUS, MESSAGES } = require('../constants');

/**
 * Patent Controller.
 */

const getAllPatents = asyncHandler(async (req, res) => {
  const { page, limit, frontend, search, all } = req.query;
  const result = await patentService.getAllPatents({ page, limit, frontend, search, all: all === 'true' });
  return new ApiResponse(HTTP_STATUS.OK, result, MESSAGES.SUCCESS).send(res);
});

const getPatentById = asyncHandler(async (req, res) => {
  const patent = await patentService.getPatentById(req.params.id);
  return new ApiResponse(HTTP_STATUS.OK, patent, MESSAGES.SUCCESS).send(res);
});

const createPatent = asyncHandler(async (req, res) => {
  const payload = { ...req.body };

  if (req.file) {
    payload.certificate = await uploadService.uploadFile(req.file.path, 'patents/certificates', 'raw');
  }

  const patent = await patentService.createPatent(payload);
  return new ApiResponse(HTTP_STATUS.CREATED, patent, MESSAGES.CREATED).send(res);
});

const updatePatent = asyncHandler(async (req, res) => {
  const payload = { ...req.body };

  if (req.file) {
    payload.certificate = await uploadService.uploadFile(req.file.path, 'patents/certificates', 'raw');
  }

  const patent = await patentService.updatePatent(req.params.id, payload);
  return new ApiResponse(HTTP_STATUS.OK, patent, MESSAGES.UPDATED).send(res);
});

const deletePatent = asyncHandler(async (req, res) => {
  const result = await patentService.deletePatent(req.params.id);
  return new ApiResponse(HTTP_STATUS.OK, result, MESSAGES.DELETED).send(res);
});

module.exports = {
  getAllPatents,
  getPatentById,
  createPatent,
  updatePatent,
  deletePatent,
};
