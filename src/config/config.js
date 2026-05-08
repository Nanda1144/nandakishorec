'use strict';

/**
 * Environment & app configuration.
 * All env vars are centralised here — never read process.env directly elsewhere.
 */
const config = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT, 10) || 5000,

  mongo: {
    uri: process.env.MONGO_URI,
    options: {
      maxPoolSize: 10,
    },
  },

  cors: {
    allowedOrigins: process.env.ALLOWED_ORIGINS
      ? process.env.ALLOWED_ORIGINS.split(',').map((o) => o.trim())
      : ['http://localhost:3000'],
  },

  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) || 15 * 60 * 1000, // 15 min
    max: parseInt(process.env.RATE_LIMIT_MAX, 10) || 100,
  },

  jwt: {
    secret: process.env.JWT_SECRET || 'change_me_in_production',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'change_refresh_secret_in_production',
    accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  },

  log: {
    level: process.env.LOG_LEVEL || 'info',
  },
};

module.exports = config;
