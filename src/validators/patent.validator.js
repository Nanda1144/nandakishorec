'use strict';

const { body, query, param } = require('express-validator');

/**
 * Validation rules for Patent management.
 */
const patentValidators = {
  create: [
    body('patentTitle').trim().notEmpty().withMessage('Patent title is required'),
    body('frontends').isArray({ min: 1 }).withMessage('At least one frontend is required'),
    body('driveLinks').optional().isArray(),
    body('isEnabled').optional().isBoolean(),
  ],
  update: [
    param('id').isMongoId().withMessage('Invalid patent ID'),
    body('frontends').optional().isArray({ min: 1 }),
  ],
  query: [
    query('page').optional().isInt({ min: 1 }).toInt(),
    query('limit').optional().isInt({ min: 1, max: 100 }).toInt(),
    query('frontend').optional().trim(),
    query('search').optional().trim(),
    query('all').optional().isBoolean().toBoolean(),
  ],
  mongoId: [
    param('id').isMongoId().withMessage('Invalid ID format'),
  ],
};

module.exports = patentValidators;
