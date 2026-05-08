'use strict';

const themeService = require('../services/theme.service');
const socketService = require('../services/socket.service');
const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const { HTTP_STATUS, MESSAGES } = require('../constants');

/**
 * Theme Controller.
 */

const getTheme = asyncHandler(async (req, res) => {
  const { frontendSlug } = req.params;
  const theme = await themeService.getThemeByFrontend(frontendSlug);
  return new ApiResponse(HTTP_STATUS.OK, theme, MESSAGES.SUCCESS).send(res);
});

const updateTheme = asyncHandler(async (req, res) => {
  const { frontendSlug } = req.params;
  const theme = await themeService.updateTheme(frontendSlug, req.body);
  
  // Real-time broadcast
  socketService.emitUpdate(frontendSlug, 'theme', theme);
  
  return new ApiResponse(HTTP_STATUS.OK, theme, MESSAGES.UPDATED).send(res);
});

const resetTheme = asyncHandler(async (req, res) => {
  const { frontendSlug } = req.params;
  const theme = await themeService.resetTheme(frontendSlug);
  return new ApiResponse(HTTP_STATUS.OK, theme, 'Theme reset to defaults').send(res);
});

module.exports = {
  getTheme,
  updateTheme,
  resetTheme,
};
