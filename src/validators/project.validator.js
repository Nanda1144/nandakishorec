'use strict';

const { body, query, param } = require('express-validator');
const { PROJECT_STATUS } = require('../constants');

/**
 * Validation rules for Project management.
 */
const projectValidators = {
  create: [
    body('projectName')
      .trim()
      .notEmpty().withMessage('Project name is required')
      .isLength({ max: 100 }).withMessage('Project name must not exceed 100 characters'),

    body('skillsUsed')
      .optional()
      .isArray().withMessage('skillsUsed must be an array'),

    body('description')
      .trim()
      .notEmpty().withMessage('Description is required'),

    body('projectLink')
      .optional()
      .trim()
      .isURL().withMessage('projectLink must be a valid URL'),

    body('githubLink')
      .optional()
      .trim()
      .isURL().withMessage('githubLink must be a valid URL'),

    body('projectLogo')
      .optional()
      .trim()
      .isURL().withMessage('projectLogo must be a valid URL'),

    body('screenshots')
      .optional()
      .isArray().withMessage('screenshots must be an array'),

    body('deploymentLink')
      .optional()
      .trim()
      .isURL().withMessage('deploymentLink must be a valid URL'),

    body('teamMembers')
      .optional()
      .isArray().withMessage('teamMembers must be an array'),

    body('featured')
      .optional()
      .isBoolean().withMessage('featured must be a boolean'),

    body('category')
      .optional()
      .trim(),

    body('projectStatus')
      .optional()
      .isIn(Object.values(PROJECT_STATUS)).withMessage(`Invalid status. Must be one of: ${Object.values(PROJECT_STATUS).join(', ')}`),

    body('frontends')
      .isArray({ min: 1 }).withMessage('At least one frontend is required')
      .custom((value) => {
        if (!value.every(v => typeof v === 'string')) {
          throw new Error('Frontends must be an array of strings');
        }
        return true;
      }),
  ],

  update: [
    param('id').isMongoId().withMessage('Invalid project ID'),

    body('projectName')
      .optional()
      .trim()
      .isLength({ max: 100 }).withMessage('Project name must not exceed 100 characters'),

    body('skillsUsed')
      .optional()
      .isArray().withMessage('skillsUsed must be an array'),

    body('description')
      .optional()
      .trim(),

    body('projectLink')
      .optional()
      .trim()
      .isURL().withMessage('projectLink must be a valid URL'),

    body('githubLink')
      .optional()
      .trim()
      .isURL().withMessage('githubLink must be a valid URL'),

    body('projectLogo')
      .optional()
      .trim()
      .isURL().withMessage('projectLogo must be a valid URL'),

    body('screenshots')
      .optional()
      .isArray().withMessage('screenshots must be an array'),

    body('deploymentLink')
      .optional()
      .trim()
      .isURL().withMessage('deploymentLink must be a valid URL'),

    body('teamMembers')
      .optional()
      .isArray().withMessage('teamMembers must be an array'),

    body('featured')
      .optional()
      .isBoolean().withMessage('featured must be a boolean'),

    body('category')
      .optional()
      .trim(),

    body('projectStatus')
      .optional()
      .isIn(Object.values(PROJECT_STATUS)).withMessage('Invalid project status'),

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
    query('featured').optional().isBoolean().toBoolean(),
  ],

  mongoId: [
    param('id').isMongoId().withMessage('Invalid ID format'),
  ],
};

module.exports = projectValidators;
