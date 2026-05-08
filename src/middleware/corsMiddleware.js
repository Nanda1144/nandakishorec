'use strict';

const cors = require('cors');
const config = require('../config/config');
const ApiError = require('../utils/ApiError');
const { HTTP_STATUS } = require('../constants');

/**
 * CORS configuration.
 * In production, only requests from ALLOWED_ORIGINS are permitted.
 * In development, all origins are allowed for ease of use.
 */
const corsOptions = {
  origin: (origin, callback) => {
    // Allow non-browser requests (Postman, server-to-server) in dev
    if (config.env === 'development' && !origin) return callback(null, true);

    if (!origin || config.cors.allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(
      new ApiError(HTTP_STATUS.FORBIDDEN, `CORS policy: origin '${origin}' is not allowed.`),
    );
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 204,
};

module.exports = cors(corsOptions);
