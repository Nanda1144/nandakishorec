'use strict';

const skillService = require('../services/skill.service');
const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const { HTTP_STATUS, MESSAGES } = require('../constants');

/**
 * Skill Controller.
 */

const getAllSkills = asyncHandler(async (req, res) => {
  const { page, limit, frontend, search, category } = req.query;
  
  const result = await skillService.getAllSkills({
    page: page ? parseInt(page, 10) : 1,
    limit: limit ? parseInt(limit, 10) : 100,
    frontend,
    search,
    category,
  });

  return new ApiResponse(HTTP_STATUS.OK, result, MESSAGES.SUCCESS).send(res);
});

const getSkillById = asyncHandler(async (req, res) => {
  const skill = await skillService.getSkillById(req.params.id);
  return new ApiResponse(HTTP_STATUS.OK, skill, MESSAGES.SUCCESS).send(res);
});

const createSkill = asyncHandler(async (req, res) => {
  const skill = await skillService.createSkill(req.body);
  return new ApiResponse(HTTP_STATUS.CREATED, skill, MESSAGES.CREATED).send(res);
});

const updateSkill = asyncHandler(async (req, res) => {
  const skill = await skillService.updateSkill(req.params.id, req.body);
  return new ApiResponse(HTTP_STATUS.OK, skill, MESSAGES.UPDATED).send(res);
});

const deleteSkill = asyncHandler(async (req, res) => {
  const result = await skillService.deleteSkill(req.params.id);
  return new ApiResponse(HTTP_STATUS.OK, result, MESSAGES.DELETED).send(res);
});

module.exports = {
  getAllSkills,
  getSkillById,
  createSkill,
  updateSkill,
  deleteSkill,
};
