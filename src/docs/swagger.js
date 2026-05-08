'use strict';

const swaggerJsdoc = require('swagger-jsdoc');
const config = require('../config/config');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Full Stack Portfolio API',
      version: '1.0.0',
      description: 'Production-ready backend for managing multiple portfolio frontends.',
      contact: {
        name: 'Nandakishore',
      },
    },
    servers: [
      {
        url: `http://localhost:${config.port}/api/v1`,
        description: 'Development server',
      },
      {
        url: 'https://fullstack-portfolio-backend.onrender.com/api/v1',
        description: 'Production server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: ['./src/routes/*.js', './src/models/*.js'], // Path to the API docs
};

const specs = swaggerJsdoc(options);

module.exports = specs;
