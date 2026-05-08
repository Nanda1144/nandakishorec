'use strict';

const { createLogger, format, transports } = require('winston');
const config = require('../config/config');

const { combine, timestamp, errors, json, colorize, printf } = format;

// Pretty format for development console
const devFormat = printf(({ level, message, timestamp: ts, stack }) => {
  return `${ts} [${level}]: ${stack || message}`;
});

const logger = createLogger({
  level: config.log.level,
  format: combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    errors({ stack: true }),
  ),
  transports: [
    // Always log to stdout so Render captures it
    new transports.Console({
      format:
        config.env === 'production'
          ? combine(timestamp(), errors({ stack: true }), json())
          : combine(colorize(), timestamp({ format: 'HH:mm:ss' }), devFormat),
    }),
  ],
});

module.exports = logger;
