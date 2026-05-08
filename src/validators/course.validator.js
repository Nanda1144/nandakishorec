'use strict';

const { body, query, param } = require('express-validator');

/**
 * Validation rules for Course management.
 */
const courseValidators = {
  create: [
    body('courseName')
      .trim()
      .notEmpty().withMessage('Course name is required'),

    body('platformName')
      .trim()
      .notEmpty().withMessage('Platform name is required'),

    body('duration')
      .optional()
      .trim(),

    body('description')
      .optional()
      .trim(),

    body('certificate')
      .optional()
      .trim(),

    body('completionDate')
      .optional()
      .isISO8601().withMessage('Completion date must be a valid ISO8601 date'),

    body('frontends')
      .isArray({ min: 1 }).withMessage('At least one frontend is required'),
  ],

  update: [
    param('id').isMongoId().withMessage('Invalid course ID'),

    body('courseName')
      .optional()
      .trim(),

    body('frontends')
      .optional()
      .isArray({ min: 1 }).withMessage('At least one frontend is required'),
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

module.exports = courseValidators;
