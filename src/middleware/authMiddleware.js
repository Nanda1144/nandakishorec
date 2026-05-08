'use strict';

const jwt = require('jsonwebtoken');
const Admin = require('../models/admin.model');
const ApiError = require('../utils/ApiError');
const config = require('../config/config');
const { HTTP_STATUS, MESSAGES } = require('../constants');

/**
 * JWT access-token verification middleware.
 *
 * Reads the Bearer token from the Authorization header:
 *   Authorization: Bearer <accessToken>
 *
 * On success: attaches the full Admin document to `req.admin` and calls next().
 * On failure: forwards an ApiError to the global error handler.
 *
 * @example
 *   router.get('/protected', protect, controller.handler);
 */
const protect = async (req, res, next) => {
  try {
    // ── Extract token ────────────────────────────────────────────────────────
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next(new ApiError(HTTP_STATUS.UNAUTHORIZED, MESSAGES.TOKEN_MISSING));
    }

    const token = authHeader.split(' ')[1];

    // ── Verify signature & expiry ────────────────────────────────────────────
    let payload;
    try {
      payload = jwt.verify(token, config.jwt.secret);
    } catch (err) {
      const message =
        err.name === 'TokenExpiredError'
          ? 'Access token expired. Please refresh.'
          : MESSAGES.TOKEN_INVALID;
      return next(new ApiError(HTTP_STATUS.UNAUTHORIZED, message));
    }

    // ── Guard against using a refresh token as an access token ───────────────
    if (payload.type !== 'access') {
      return next(new ApiError(HTTP_STATUS.UNAUTHORIZED, 'Invalid token type.'));
    }

    // ── Load admin from DB (ensures account still exists) ────────────────────
    const admin = await Admin.findById(payload.sub);

    if (!admin) {
      return next(new ApiError(HTTP_STATUS.UNAUTHORIZED, MESSAGES.UNAUTHORIZED));
    }

    // ── Block locked accounts from accessing protected routes ────────────────
    if (admin.isLocked) {
      return next(
        new ApiError(
          HTTP_STATUS.FORBIDDEN,
          'Your account is locked. Use the unlock endpoint to regain access.',
        ),
      );
    }

    // ── Attach admin to request object ───────────────────────────────────────
    req.admin = admin;
    return next();
  } catch (err) {
    return next(err);
  }
};

module.exports = { protect };
