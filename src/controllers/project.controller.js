'use strict';

const projectService = require('../services/project.service');
const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const { HTTP_STATUS, MESSAGES } = require('../constants');

/**
 * Project Controller.
 */

const getAllProjects = asyncHandler(async (req, res) => {
  const { page, limit, frontend, search, category, featured } = req.query;
  
  const result = await projectService.getAllProjects({
    page: page ? parseInt(page, 10) : 1,
    limit: limit ? parseInt(limit, 10) : 10,
    frontend,
    search,
    category,
    featured: featured !== undefined ? featured === 'true' : undefined,
  });

  return new ApiResponse(HTTP_STATUS.OK, result, MESSAGES.SUCCESS).send(res);
});

const getProjectById = asyncHandler(async (req, res) => {
  const project = await projectService.getProjectById(req.params.id);
  return new ApiResponse(HTTP_STATUS.OK, project, MESSAGES.SUCCESS).send(res);
});

const createProject = asyncHandler(async (req, res) => {
  const project = await projectService.createProject(req.body);
  return new ApiResponse(HTTP_STATUS.CREATED, project, MESSAGES.CREATED).send(res);
});

const updateProject = asyncHandler(async (req, res) => {
  const project = await projectService.updateProject(req.params.id, req.body);
  return new ApiResponse(HTTP_STATUS.OK, project, MESSAGES.UPDATED).send(res);
});

const deleteProject = asyncHandler(async (req, res) => {
  const result = await projectService.deleteProject(req.params.id);
  return new ApiResponse(HTTP_STATUS.OK, result, MESSAGES.DELETED).send(res);
});

module.exports = {
  getAllProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
};
