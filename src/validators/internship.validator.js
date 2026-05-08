'use strict';

const { body, query, param } = require('express-validator');

/**
 * Validation rules for Internship / Experience management.
 */
const internshipValidators = {
  create: [
    body('companyName')
      .trim()
      .notEmpty().withMessage('Company name is required'),

    body('domainName')
      .optional()
      .trim(),

    body('duration')
      .optional()
      .trim(),

    body('startDate')
      .notEmpty().withMessage('Start date is required')
      .isISO8601().withMessage('Start date must be a valid ISO8601 date'),

    body('endDate')
      .optional()
      .isISO8601().withMessage('End date must be a valid ISO8601 date'),

    body('description')
      .trim()
      .notEmpty().withMessage('Description is required'),

    body('technologiesUsed')
      .optional()
      .isArray().withMessage('technologiesUsed must be an array'),

    body('frontends')
      .isArray({ min: 1 }).withMessage('At least one frontend is required'),
  ],

  update: [
    param('id').isMongoId().withMessage('Invalid internship ID'),

    body('companyName')
      .optional()
      .trim(),

    body('startDate')
      .optional()
      .isISO8601().withMessage('Start date must be a valid ISO8601 date'),

    body('endDate')
      .optional()
      .isISO8601().withMessage('End date must be a valid ISO8601 date'),

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

module.exports = internshipValidators;
