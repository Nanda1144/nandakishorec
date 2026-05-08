'use strict';

const { body, param } = require('express-validator');

/**
 * Validation rules for Frontend management.
 */
const frontendValidators = {
  create: [
    body('name')
      .trim()
      .notEmpty().withMessage('Name is required')
      .isLength({ max: 100 }).withMessage('Name must not exceed 100 characters'),

    body('slug')
      .trim()
      .notEmpty().withMessage('Slug is required')
      .matches(/^[a-z0-9-]+$/).withMessage('Slug can only contain lowercase letters, numbers, and hyphens'),

    body('domainUrl')
      .trim()
      .notEmpty().withMessage('Domain URL is required')
      .isURL().withMessage('Please provide a valid domain URL'),

    body('logo')
      .optional()
      .trim()
      .isURL().withMessage('Logo must be a valid URL'),

    body('themeSettings')
      .optional()
      .isObject().withMessage('themeSettings must be an object'),

    body('isActive')
      .optional()
      .isBoolean().withMessage('isActive must be a boolean'),
  ],

  update: [
    param('id').isMongoId().withMessage('Invalid frontend ID'),

    body('name')
      .optional()
      .trim()
      .isLength({ max: 100 }).withMessage('Name must not exceed 100 characters'),

    body('slug')
      .optional()
      .trim()
      .matches(/^[a-z0-9-]+$/).withMessage('Slug can only contain lowercase letters, numbers, and hyphens'),

    body('domainUrl')
      .optional()
      .trim()
      .isURL().withMessage('Please provide a valid domain URL'),

    body('logo')
      .optional()
      .trim()
      .isURL().withMessage('Logo must be a valid URL'),

    body('themeSettings')
      .optional()
      .isObject().withMessage('themeSettings must be an object'),

    body('isActive')
      .optional()
      .isBoolean().withMessage('isActive must be a boolean'),
  ],

  mongoId: [
    param('id').isMongoId().withMessage('Invalid ID format'),
  ],

  toggleActive: [
    param('id').isMongoId().withMessage('Invalid ID format'),
    body('isActive')
      .notEmpty().withMessage('isActive status is required')
      .isBoolean().withMessage('isActive must be a boolean'),
  ],
};

module.exports = frontendValidators;
