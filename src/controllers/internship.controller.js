'use strict';

const internshipService = require('../services/internship.service');
const uploadService = require('../services/upload.service');
const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const { HTTP_STATUS, MESSAGES } = require('../constants');

/**
 * Internship Controller.
 */

const getAllInternships = asyncHandler(async (req, res) => {
  const { page, limit, frontend, search } = req.query;
  
  const result = await internshipService.getAllInternships({
    page: page ? parseInt(page, 10) : 1,
    limit: limit ? parseInt(limit, 10) : 10,
    frontend,
    search,
  });

  return new ApiResponse(HTTP_STATUS.OK, result, MESSAGES.SUCCESS).send(res);
});

const getInternshipById = asyncHandler(async (req, res) => {
  const internship = await internshipService.getInternshipById(req.params.id);
  return new ApiResponse(HTTP_STATUS.OK, internship, MESSAGES.SUCCESS).send(res);
});

const createInternship = asyncHandler(async (req, res) => {
  const payload = { ...req.body };

  // Handle files with Cloudinary
  if (req.files) {
    if (req.files.offerLetter) {
      payload.offerLetter = await uploadService.uploadFile(req.files.offerLetter[0].path, 'internships/offers', 'raw');
    }
    if (req.files.completionCertificate) {
      payload.completionCertificate = await uploadService.uploadFile(req.files.completionCertificate[0].path, 'internships/certificates', 'raw');
    }
    if (req.files.photos) {
      const photoPaths = req.files.photos.map(file => file.path);
      payload.photos = await uploadService.uploadMultiple(photoPaths, 'internships/photos', 'image');
    }
  }

  const internship = await internshipService.createInternship(payload);
  return new ApiResponse(HTTP_STATUS.CREATED, internship, MESSAGES.CREATED).send(res);
});

const updateInternship = asyncHandler(async (req, res) => {
  const payload = { ...req.body };

  // Handle files with Cloudinary
  if (req.files) {
    if (req.files.offerLetter) {
      payload.offerLetter = await uploadService.uploadFile(req.files.offerLetter[0].path, 'internships/offers', 'raw');
    }
    if (req.files.completionCertificate) {
      payload.completionCertificate = await uploadService.uploadFile(req.files.completionCertificate[0].path, 'internships/certificates', 'raw');
    }
    if (req.files.photos) {
      const photoPaths = req.files.photos.map(file => file.path);
      payload.photos = await uploadService.uploadMultiple(photoPaths, 'internships/photos', 'image');
    }
  }

  const internship = await internshipService.updateInternship(req.params.id, payload);
  return new ApiResponse(HTTP_STATUS.OK, internship, MESSAGES.UPDATED).send(res);
});

const deleteInternship = asyncHandler(async (req, res) => {
  const result = await internshipService.deleteInternship(req.params.id);
  return new ApiResponse(HTTP_STATUS.OK, result, MESSAGES.DELETED).send(res);
});

module.exports = {
  getAllInternships,
  getInternshipById,
  createInternship,
  updateInternship,
  deleteInternship,
};
