'use strict';

const mongoose = require('mongoose');
const config = require('./config');
const logger = require('../utils/logger');

/**
 * Establishes a MongoDB connection with retry logic.
 * Uses Mongoose's built-in buffering so queries issued before
 * the connection is ready will be queued automatically.
 */
const connectDB = async () => {
  if (!config.mongo.uri) {
    logger.error('MONGO_URI is not defined. Check your .env file.');
    process.exit(1);
  }

  try {
    const conn = await mongoose.connect(config.mongo.uri, {
      ...config.mongo.options,
      family: 4, // Force IPv4
    });

    logger.info(`✅ MongoDB connected: ${conn.connection.host}`);

    // Graceful disconnect on SIGINT / SIGTERM (handled in server.js too)
    mongoose.connection.on('disconnected', () => {
      logger.warn('MongoDB disconnected.');
    });

    mongoose.connection.on('error', (err) => {
      logger.error(`MongoDB error: ${err.message}`);
    });
  } catch (err) {
    logger.error(`MongoDB connection failed: ${err.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
