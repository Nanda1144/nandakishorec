'use strict';

const logger = require('../utils/logger');
const ApiError = require('../utils/ApiError');
const config = require('../config/config');
const { HTTP_STATUS, MESSAGES } = require('../constants');

/**
 * Global error-handling middleware.
 * Must be registered LAST in app.js (after all routes).
 *
 * Handles:
 *  - Custom ApiError instances
 *  - Mongoose validation / cast / duplicate-key errors
 *  - JWT errors
 *  - Any unhandled errors (generic 500)
 */
const errorHandler = (err, req, res, next) => { // eslint-disable-line no-unused-vars
  let error = err;

  // ── Mongoose: CastError (invalid ObjectId) ──────────────────────────────────
  if (err.name === 'CastError') {
    error = new ApiError(HTTP_STATUS.BAD_REQUEST, `Invalid ${err.path}: ${err.value}`);
  }

  // ── Mongoose: ValidationError ───────────────────────────────────────────────
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((e) => e.message);
    error = new ApiError(HTTP_STATUS.UNPROCESSABLE_ENTITY, MESSAGES.VALIDATION_ERROR, messages);
  }

  // ── Mongoose: Duplicate key ─────────────────────────────────────────────────
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    error = new ApiError(
      HTTP_STATUS.CONFLICT,
      `Duplicate value for field: '${field}'. Please use a different value.`,
    );
  }

  // ── JWT ─────────────────────────────────────────────────────────────────────
  if (err.name === 'JsonWebTokenError') {
    error = new ApiError(HTTP_STATUS.UNAUTHORIZED, MESSAGES.TOKEN_INVALID);
  }

  if (err.name === 'TokenExpiredError') {
    error = new ApiError(HTTP_STATUS.UNAUTHORIZED, 'Token expired. Please log in again.');
  }

  // ── Default to ApiError shape ───────────────────────────────────────────────
  const statusCode = error.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR;
  const message = error.message || MESSAGES.INTERNAL_ERROR;

  // Log server errors
  if (statusCode >= 500) {
    logger.error({
      message: err.message,
      stack: err.stack,
      url: req.originalUrl,
      method: req.method,
    });
  }

  res.status(statusCode).json({
    success: false,
    message,
    errors: error.errors || [],
    ...(config.env === 'development' && { stack: err.stack }),
  });
};

module.exports = errorHandler;
