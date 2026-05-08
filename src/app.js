'use strict';

// ── Load environment variables first ─────────────────────────────────────────
require('dotenv').config();

const express = require('express');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');

const config = require('./config/config');
const corsMiddleware = require('./middleware/corsMiddleware');
const rateLimiter = require('./middleware/rateLimiter');
const notFound = require('./middleware/notFound');
const errorHandler = require('./middleware/errorHandler');
const apiRoutes = require('./routes/index');
const logger = require('./utils/logger');
const xss = require('xss-clean');
const mongoSanitize = require('express-mongo-sanitize');
const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('./docs/swagger');

// ─────────────────────────────────────────────────────────────────────────────
const app = express();

// ── Security ──────────────────────────────────────────────────────────────────
app.use(helmet());            // Set secure HTTP headers
app.use(xss());               // Data sanitization against XSS
app.use(mongoSanitize());     // Data sanitization against NoSQL query injection
app.use(corsMiddleware);      // CORS with origin whitelist

// ── Performance ───────────────────────────────────────────────────────────────
app.use(compression());       // Gzip responses

// ── Request parsing ───────────────────────────────────────────────────────────
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// ── HTTP request logging ──────────────────────────────────────────────────────
if (config.env !== 'test') {
  // Stream Morgan logs through Winston
  app.use(
    morgan(config.env === 'production' ? 'combined' : 'dev', {
      stream: { write: (msg) => logger.http(msg.trim()) },
    }),
  );
}

// ── Rate limiting ─────────────────────────────────────────────────────────────
app.use('/api', rateLimiter);

// ── API Documentation ─────────────────────────────────────────────────────────
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

// ── API routes ────────────────────────────────────────────────────────────────
app.use('/api/v1', apiRoutes);

// ── Root ping ─────────────────────────────────────────────────────────────────
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: '🚀 API is running',
    version: '1.0.0',
    docs: '/api/v1/health',
  });
});

// ── 404 handler (must be after all routes) ────────────────────────────────────
app.use(notFound);

// ── Global error handler (must be last) ──────────────────────────────────────
app.use(errorHandler);

module.exports = app;
