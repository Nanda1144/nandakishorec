'use strict';

const userService = require('../services/user.service');
const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const { HTTP_STATUS, MESSAGES } = require('../constants');

/**
 * User Controller — thin layer that delegates to UserService.
 * No business logic or DB calls here.
 */

/**
 * GET /api/v1/users
 */
const getAllUsers = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const result = await userService.getAllUsers({
    page: parseInt(page, 10),
    limit: parseInt(limit, 10),
  });
  return new ApiResponse(HTTP_STATUS.OK, result, MESSAGES.SUCCESS).send(res);
});

/**
 * GET /api/v1/users/:id
 */
const getUserById = asyncHandler(async (req, res) => {
  const user = await userService.getUserById(req.params.id);
  return new ApiResponse(HTTP_STATUS.OK, user, MESSAGES.SUCCESS).send(res);
});

/**
 * POST /api/v1/users
 */
const createUser = asyncHandler(async (req, res) => {
  const user = await userService.createUser(req.body);
  return new ApiResponse(HTTP_STATUS.CREATED, user, MESSAGES.CREATED).send(res);
});

/**
 * PATCH /api/v1/users/:id
 */
const updateUser = asyncHandler(async (req, res) => {
  const user = await userService.updateUser(req.params.id, req.body);
  return new ApiResponse(HTTP_STATUS.OK, user, MESSAGES.UPDATED).send(res);
});

/**
 * DELETE /api/v1/users/:id
 */
const deleteUser = asyncHandler(async (req, res) => {
  const result = await userService.deleteUser(req.params.id);
  return new ApiResponse(HTTP_STATUS.OK, result, MESSAGES.DELETED).send(res);
});

module.exports = { getAllUsers, getUserById, createUser, updateUser, deleteUser };
