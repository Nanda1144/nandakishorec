'use strict';

const { Router } = require('express');
const mongoose = require('mongoose');
const ApiResponse = require('../utils/ApiResponse');
const { HTTP_STATUS } = require('../constants');

const router = Router();

/**
 * @route   GET /api/v1/health
 * @desc    Health check — used by Render / uptime monitors
 * @access  Public
 */
router.get('/', (req, res) => {
  const dbState = mongoose.connection.readyState;

  // 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
  const dbStatus =
    dbState === 1 ? 'connected' : dbState === 2 ? 'connecting' : 'disconnected';

  const payload = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: `${Math.floor(process.uptime())}s`,
    environment: process.env.NODE_ENV || 'development',
    database: dbStatus,
    memory: {
      heapUsed: `${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)} MB`,
      rss: `${Math.round(process.memoryUsage().rss / 1024 / 1024)} MB`,
    },
  };

  const statusCode =
    dbStatus === 'connected' ? HTTP_STATUS.OK : HTTP_STATUS.INTERNAL_SERVER_ERROR;

  return new ApiResponse(statusCode, payload, 'Health check').send(res);
});

module.exports = router;
