'use strict';

const ApiError = require('../utils/ApiError');
const { HTTP_STATUS } = require('../constants');

/**
 * Catch-all for requests to undefined routes.
 * Must be placed AFTER all route declarations but BEFORE errorHandler.
 */
const notFound = (req, res, next) => {
  next(
    new ApiError(
      HTTP_STATUS.NOT_FOUND,
      `Route not found: ${req.method} ${req.originalUrl}`,
    ),
  );
};

module.exports = notFound;
