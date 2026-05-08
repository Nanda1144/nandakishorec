'use strict';

const { body, query, param } = require('express-validator');

/**
 * Validation rules for Achievement management.
 */
const achievementValidators = {
  create: [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('achievementDate').notEmpty().withMessage('Achievement date is required').isISO8601(),
    body('frontends').isArray({ min: 1 }).withMessage('At least one frontend is required'),
  ],
  update: [
    param('id').isMongoId().withMessage('Invalid achievement ID'),
    body('frontends').optional().isArray({ min: 1 }),
  ],
  query: [
    query('page').optional().isInt({ min: 1 }).toInt(),
    query('limit').optional().isInt({ min: 1, max: 100 }).toInt(),
    query('frontend').optional().trim(),
    query('search').optional().trim(),
  ],
  mongoId: [
    param('id').isMongoId().withMessage('Invalid ID format'),
  ],
};

module.exports = achievementValidators;
