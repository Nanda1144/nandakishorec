'use strict';

const { body, query, param } = require('express-validator');

/**
 * Validation rules for Research management.
 */
const researchValidators = {
  create: [
    body('researchTitle').trim().notEmpty().withMessage('Research title is required'),
    body('publicationDate').notEmpty().withMessage('Publication date is required').isISO8601(),
    body('authors').isArray().withMessage('Authors must be an array'),
    body('frontends').isArray({ min: 1 }).withMessage('At least one frontend is required'),
    body('isEnabled').optional().isBoolean().withMessage('isEnabled must be a boolean'),
  ],
  update: [
    param('id').isMongoId().withMessage('Invalid research ID'),
    body('authors').optional().isArray(),
    body('frontends').optional().isArray({ min: 1 }),
  ],
  query: [
    query('page').optional().isInt({ min: 1 }).toInt(),
    query('limit').optional().isInt({ min: 1, max: 100 }).toInt(),
    query('frontend').optional().trim(),
    query('search').optional().trim(),
    query('all').optional().isBoolean().toBoolean(), // If true, include disabled items (for admin)
  ],
  mongoId: [
    param('id').isMongoId().withMessage('Invalid ID format'),
  ],
};

module.exports = researchValidators;
