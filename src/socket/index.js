'use strict';

const { Server } = require('socket.io');
const logger = require('../utils/logger');

let io;

/**
 * Initialize Socket.io server.
 * @param {object} httpServer - The Node.js HTTP server instance.
 */
const init = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : '*',
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket) => {
    logger.info(`Socket connected: ${socket.id}`);

    // Join a room based on frontendSlug to enable targeted updates
    socket.on('join-frontend', (frontendSlug) => {
      socket.join(frontendSlug);
      logger.info(`Socket ${socket.id} joined room: ${frontendSlug}`);
    });

    socket.on('disconnect', () => {
      logger.info(`Socket disconnected: ${socket.id}`);
    });
  });

  return io;
};

/**
 * Get the initialized IO instance.
 */
const getIO = () => {
  if (!io) {
    throw new Error('Socket.io not initialized!');
  }
  return io;
};

module.exports = { init, getIO };
