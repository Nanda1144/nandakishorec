'use strict';

const { Router } = require('express');
const authController = require('../controllers/auth.controller');
const authValidators = require('../validators/auth.validator');
const validate = require('../middleware/validate');
const { protect } = require('../middleware/authMiddleware');

const router = Router();

/**
 * @route   POST /api/v1/auth/login
 * @desc    Authenticate admin → returns access token + sets refresh cookie
 * @access  Public
 */
router.post(
  '/login',
  [...authValidators.login, validate],
  authController.login,
);

/**
 * @route   POST /api/v1/auth/refresh
 * @desc    Issue new access token using the refresh token cookie
 * @access  Public (cookie-based)
 */
router.post('/refresh', authController.refresh);

/**
 * @route   POST /api/v1/auth/logout
 * @desc    Invalidate the current refresh token and clear the cookie
 * @access  Protected
 */
router.post('/logout', protect, authController.logout);

/**
 * @route   POST /api/v1/auth/unlock
 * @desc    Unlock a locked admin account via email + passkey
 * @access  Public (passkey-guarded)
 */
router.post(
  '/unlock',
  [...authValidators.unlock, validate],
  authController.unlock,
);

/**
 * @route   GET /api/v1/auth/me
 * @desc    Return the current authenticated admin's profile
 * @access  Protected
 */
router.get('/me', protect, authController.getMe);

module.exports = router;
