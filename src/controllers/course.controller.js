'use strict';

const courseService = require('../services/course.service');
const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const { HTTP_STATUS, MESSAGES } = require('../constants');

/**
 * Course Controller.
 */

const getAllCourses = asyncHandler(async (req, res) => {
  const { page, limit, frontend, search } = req.query;
  
  const result = await courseService.getAllCourses({
    page: page ? parseInt(page, 10) : 1,
    limit: limit ? parseInt(limit, 10) : 10,
    frontend,
    search,
  });

  return new ApiResponse(HTTP_STATUS.OK, result, MESSAGES.SUCCESS).send(res);
});

const getCourseById = asyncHandler(async (req, res) => {
  const course = await courseService.getCourseById(req.params.id);
  return new ApiResponse(HTTP_STATUS.OK, course, MESSAGES.SUCCESS).send(res);
});

const createCourse = asyncHandler(async (req, res) => {
  const course = await courseService.createCourse(req.body);
  return new ApiResponse(HTTP_STATUS.CREATED, course, MESSAGES.CREATED).send(res);
});

const updateCourse = asyncHandler(async (req, res) => {
  const course = await courseService.updateCourse(req.params.id, req.body);
  return new ApiResponse(HTTP_STATUS.OK, course, MESSAGES.UPDATED).send(res);
});

const deleteCourse = asyncHandler(async (req, res) => {
  const result = await courseService.deleteCourse(req.params.id);
  return new ApiResponse(HTTP_STATUS.OK, result, MESSAGES.DELETED).send(res);
});

module.exports = {
  getAllCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
};
