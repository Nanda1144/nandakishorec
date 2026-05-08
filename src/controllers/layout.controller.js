'use strict';

const Header = require('../models/header.model');
const Footer = require('../models/footer.model');
const socketService = require('../services/socket.service');
const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const { HTTP_STATUS, MESSAGES } = require('../constants');

/**
 * Layout Controller — Handles Header and Footer configurations.
 */

// ── Header ───────────────────────────────────────────────────────────────────
const getHeader = asyncHandler(async (req, res) => {
  const { frontendSlug } = req.params;
  let header = await Header.findOne({ frontendSlug }).lean();
  if (!header) {
    header = await Header.create({ frontendSlug, navLinks: [] });
  }
  return new ApiResponse(HTTP_STATUS.OK, header, MESSAGES.SUCCESS).send(res);
});

const updateHeader = asyncHandler(async (req, res) => {
  const { frontendSlug } = req.params;
  const header = await Header.findOneAndUpdate(
    { frontendSlug },
    req.body,
    { new: true, runValidators: true, upsert: true }
  ).lean();

  // Real-time broadcast
  socketService.emitUpdate(frontendSlug, 'header', header);

  return new ApiResponse(HTTP_STATUS.OK, header, MESSAGES.UPDATED).send(res);
});

// ── Footer ───────────────────────────────────────────────────────────────────
const getFooter = asyncHandler(async (req, res) => {
  const { frontendSlug } = req.params;
  let footer = await Footer.findOne({ frontendSlug }).lean();
  if (!footer) {
    footer = await Footer.create({ frontendSlug, socialLinks: [] });
  }
  return new ApiResponse(HTTP_STATUS.OK, footer, MESSAGES.SUCCESS).send(res);
});

const updateFooter = asyncHandler(async (req, res) => {
  const { frontendSlug } = req.params;
  const footer = await Footer.findOneAndUpdate(
    { frontendSlug },
    req.body,
    { new: true, runValidators: true, upsert: true }
  ).lean();

  // Real-time broadcast
  socketService.emitUpdate(frontendSlug, 'footer', footer);

  return new ApiResponse(HTTP_STATUS.OK, footer, MESSAGES.UPDATED).send(res);
});

module.exports = {
  getHeader,
  updateHeader,
  getFooter,
  updateFooter,
};
