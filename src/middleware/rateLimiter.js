'use strict';

const rateLimit = require('express-rate-limit');
const config = require('../config/config');
const { HTTP_STATUS, MESSAGES } = require('../constants');

/**
 * Global rate limiter applied to all API routes.
 * Stricter limiters for sensitive routes (auth, etc.) should be
 * defined per-router and applied on top of this one.
 */
const rateLimiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.max,
  standardHeaders: true,  // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false,   // Disable the `X-RateLimit-*` headers
  message: {
    success: false,
    statusCode: HTTP_STATUS.TOO_MANY_REQUESTS,
    message: MESSAGES.TOO_MANY_REQUESTS,
  },
  skip: (req) => req.method === 'OPTIONS', // Never limit preflight requests
});

module.exports = rateLimiter;
