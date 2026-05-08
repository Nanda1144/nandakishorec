'use strict';

const { body } = require('express-validator');

/**
 * Validation rule sets for auth endpoints.
 */
const authValidators = {
  /**
   * POST /api/v1/auth/login
   */
  login: [
    body('email')
      .trim()
      .notEmpty().withMessage('Email is required')
      .isEmail().withMessage('Please provide a valid email address')
      .normalizeEmail({ gmail_remove_dots: false }),

    body('password')
      .notEmpty().withMessage('Password is required')
      .isString().withMessage('Password must be a string'),
  ],

  /**
   * POST /api/v1/auth/unlock
   */
  unlock: [
    body('email')
      .trim()
      .notEmpty().withMessage('Email is required')
      .isEmail().withMessage('Please provide a valid email address')
      .normalizeEmail({ gmail_remove_dots: false }),

    body('passkey')
      .notEmpty().withMessage('Passkey is required')
      .isString().withMessage('Passkey must be a string'),
  ],
};

module.exports = authValidators;
