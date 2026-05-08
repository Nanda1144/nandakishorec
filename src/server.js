'use strict';

// ── Environment variables ─────────────────────────────────────────────────────
require('dotenv').config();

const app = require('./app');
const connectDB = require('./config/db');
const config = require('./config/config');
const logger = require('./utils/logger');
const socket = require('./socket');
const seedAdmin = require('./utils/seedAdmin');

// ─────────────────────────────────────────────────────────────────────────────
let server;

const startServer = async () => {
  // 1. Connect to MongoDB
  await connectDB();

  // 2. Seed Admin (if not exists)
  await seedAdmin();

  // 3. Start Express
  server = app.listen(config.port, () => {
    logger.info(`🚀 Server running in ${config.env} mode on port ${config.port}`);
    logger.info(`📡 API base: http://localhost:${config.port}/api/v1`);
    logger.info(`❤️  Health:  http://localhost:${config.port}/api/v1/health`);
  });

  // 3. Initialize Socket.io
  socket.init(server);
  logger.info('🔌 Socket.io initialized');

  // 4. Handle server errors (e.g. EADDRINUSE)
  server.on('error', (err) => {
    logger.error(`Server error: ${err.message}`);
    process.exit(1);
  });
};

// ── Graceful shutdown ─────────────────────────────────────────────────────────
const shutdown = (signal) => {
  logger.info(`${signal} received. Shutting down gracefully...`);
  if (server) {
    server.close(() => {
      logger.info('HTTP server closed.');
      process.exit(0);
    });

    // Force shutdown after 10 seconds
    setTimeout(() => {
      logger.error('Forced shutdown after timeout.');
      process.exit(1);
    }, 10_000);
  } else {
    process.exit(0);
  }
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

// ── Unhandled rejections & exceptions ─────────────────────────────────────────
process.on('unhandledRejection', (reason, promise) => {
  logger.error({ message: 'Unhandled Promise Rejection', reason, promise });
  shutdown('unhandledRejection');
});

process.on('uncaughtException', (err) => {
  logger.error({ message: 'Uncaught Exception', error: err.message, stack: err.stack });
  shutdown('uncaughtException');
});

// ─────────────────────────────────────────────────────────────────────────────
startServer();
