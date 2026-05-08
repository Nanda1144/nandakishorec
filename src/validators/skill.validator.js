'use strict';

const { body, query, param } = require('express-validator');
const { SKILL_LEVELS } = require('../constants');

/**
 * Validation rules for Skill management.
 */
const skillValidators = {
  create: [
    body('name')
      .trim()
      .notEmpty().withMessage('Skill name is required'),

    body('level')
      .optional()
      .isIn(Object.values(SKILL_LEVELS)).withMessage(`Invalid level. Must be one of: ${Object.values(SKILL_LEVELS).join(', ')}`),

    body('category')
      .trim()
      .notEmpty().withMessage('Category is required'),

    body('icon')
      .optional()
      .trim(),

    body('frontends')
      .isArray({ min: 1 }).withMessage('At least one frontend is required'),
  ],

  update: [
    param('id').isMongoId().withMessage('Invalid skill ID'),

    body('name')
      .optional()
      .trim(),

    body('level')
      .optional()
      .isIn(Object.values(SKILL_LEVELS)).withMessage('Invalid level'),

    body('category')
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
    query('category').optional().trim(),
  ],

  mongoId: [
    param('id').isMongoId().withMessage('Invalid ID format'),
  ],
};

module.exports = skillValidators;
