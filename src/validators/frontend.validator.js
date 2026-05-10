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

    body('url')
      .trim()
      .notEmpty().withMessage('Frontend URL is required')
      .isURL().withMessage('Please provide a valid URL'),

    body('frontendType')
      .optional()
      .isIn(['Personal', 'Business', 'Portfolio', 'Other']).withMessage('Invalid frontend type'),

    body('theme')
      .optional()
      .trim(),

    body('status')
      .optional()
      .isIn(['Active', 'Maintenance', 'Draft']).withMessage('Invalid status'),

    body('logo')
      .optional()
      .trim(),

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

    body('url')
      .optional()
      .trim()
      .isURL().withMessage('Please provide a valid URL'),

    body('frontendType')
      .optional()
      .isIn(['Personal', 'Business', 'Portfolio', 'Other']).withMessage('Invalid frontend type'),

    body('theme')
      .optional()
      .trim(),

    body('status')
      .optional()
      .isIn(['Active', 'Maintenance', 'Draft']).withMessage('Invalid status'),

    body('logo')
      .optional()
      .trim(),

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
