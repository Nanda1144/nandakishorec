'use strict';

const { body, param } = require('express-validator');

/**
 * Validation rule sets for User routes.
 * Import and spread into route handlers.
 *
 * @example
 *   router.post('/', [...userValidators.create, validate], controller.create);
 */
const userValidators = {
  create: [
    body('name')
      .trim()
      .notEmpty().withMessage('Name is required')
      .isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters'),

    body('email')
      .trim()
      .notEmpty().withMessage('Email is required')
      .isEmail().withMessage('Please provide a valid email address')
      .normalizeEmail(),

    body('password')
      .notEmpty().withMessage('Password is required')
      .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
      .matches(/\d/).withMessage('Password must contain at least one number'),

    body('role')
      .optional()
      .isIn(['user', 'admin']).withMessage('Role must be either user or admin'),
  ],

  update: [
    param('id').isMongoId().withMessage('Invalid user ID'),

    body('name')
      .optional()
      .trim()
      .isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters'),

    body('email')
      .optional()
      .trim()
      .isEmail().withMessage('Please provide a valid email address')
      .normalizeEmail(),
  ],

  mongoId: [
    param('id').isMongoId().withMessage('Invalid ID format'),
  ],
};

module.exports = userValidators;
