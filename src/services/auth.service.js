'use strict';

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const Admin = require('../models/admin.model');
const ApiError = require('../utils/ApiError');
const config = require('../config/config');
const { HTTP_STATUS, MESSAGES } = require('../constants');

const MAX_FAILED_ATTEMPTS = 10;
const LOCK_DURATION_MS = 24 * 60 * 60 * 1000; // 24 hours

// ── Token helpers ─────────────────────────────────────────────────────────────

/**
 * Sign a short-lived JWT access token.
 * @param {string} adminId
 * @returns {string}
 */
const signAccessToken = (adminId) =>
  jwt.sign({ sub: adminId, type: 'access' }, config.jwt.secret, {
    expiresIn: config.jwt.accessExpiresIn,
  });

/**
 * Sign a long-lived JWT refresh token.
 * @param {string} adminId
 * @returns {string}
 */
const signRefreshToken = (adminId) =>
  jwt.sign({ sub: adminId, type: 'refresh' }, config.jwt.refreshSecret, {
    expiresIn: config.jwt.refreshExpiresIn,
  });

/**
 * SHA-256 hash of a refresh token for safe DB storage.
 * @param {string} token
 * @returns {string}
 */
const hashToken = (token) =>
  crypto.createHash('sha256').update(token).digest('hex');

// ── Auth Service ──────────────────────────────────────────────────────────────

class AuthService {
  /**
   * Authenticate admin and return access + refresh tokens.
   *
   * Flow:
   *   1. Look up admin by email (select password + security fields)
   *   2. Reject immediately if account is locked
   *   3. Verify password
   *   4. On failure: increment failedAttempts; lock if >= MAX_FAILED_ATTEMPTS
   *   5. On success: reset counters, issue tokens, store hashed refresh token
   *
   * @param {string} email
   * @param {string} password
   * @returns {{ accessToken: string, refreshToken: string, admin: object }}
   */
  async login(email, password) {
    // Always select the normally-hidden fields needed for auth checks
    const admin = await Admin.findOne({ email })
      .select('+password +refreshTokens +failedAttempts +lockUntil');

    if (!admin) {
      // Constant-time fake compare to prevent user enumeration
      await bcrypt.compare(password, '$2b$12$invalidsaltsothisnevermatchesXXX');
      throw new ApiError(HTTP_STATUS.UNAUTHORIZED, MESSAGES.INVALID_CREDENTIALS);
    }

    // ── Lockout check ────────────────────────────────────────────────────────
    if (admin.isLocked) {
      const remaining = Math.ceil((admin.lockUntil - Date.now()) / 1000 / 60);
      throw new ApiError(
        HTTP_STATUS.TOO_MANY_REQUESTS,
        `Account locked due to too many failed attempts. Try again in ${remaining} minutes.`,
      );
    }

    // ── Password verification ────────────────────────────────────────────────
    const isMatch = await admin.comparePassword(password);

    if (!isMatch) {
      admin.failedAttempts += 1;

      if (admin.failedAttempts >= MAX_FAILED_ATTEMPTS) {
        admin.lockUntil = new Date(Date.now() + LOCK_DURATION_MS);
        await admin.save();
        throw new ApiError(
          HTTP_STATUS.TOO_MANY_REQUESTS,
          `Too many failed attempts. Account locked for 24 hours.`,
        );
      }

      const attemptsLeft = MAX_FAILED_ATTEMPTS - admin.failedAttempts;
      await admin.save();
      throw new ApiError(
        HTTP_STATUS.UNAUTHORIZED,
        `${MESSAGES.INVALID_CREDENTIALS} — ${attemptsLeft} attempt${attemptsLeft !== 1 ? 's' : ''} remaining before lockout.`,
      );
    }

    // ── Success — reset lockout counters ─────────────────────────────────────
    admin.failedAttempts = 0;
    admin.lockUntil = null;

    // ── Issue tokens ─────────────────────────────────────────────────────────
    const accessToken = signAccessToken(admin._id.toString());
    const refreshToken = signRefreshToken(admin._id.toString());

    // Store hashed refresh token; purge stale ones first
    admin.purgeExpiredTokens();
    admin.refreshTokens.push({ tokenHash: hashToken(refreshToken) });

    await admin.save();

    return {
      accessToken,
      refreshToken,
      admin: {
        id: admin._id,
        email: admin.email,
        createdAt: admin.createdAt,
      },
    };
  }

  /**
   * Rotate refresh token: verify old one, issue new pair.
   *
   * @param {string} oldRefreshToken - raw token from httpOnly cookie
   * @returns {{ accessToken: string, refreshToken: string }}
   */
  async refresh(oldRefreshToken) {
    // 1. Verify JWT signature & expiry
    let payload;
    try {
      payload = jwt.verify(oldRefreshToken, config.jwt.refreshSecret);
    } catch {
      throw new ApiError(HTTP_STATUS.UNAUTHORIZED, 'Refresh token is invalid or expired.');
    }

    if (payload.type !== 'refresh') {
      throw new ApiError(HTTP_STATUS.UNAUTHORIZED, 'Invalid token type.');
    }

    // 2. Find admin and look for the matching token hash
    const admin = await Admin.findById(payload.sub).select('+refreshTokens');
    if (!admin) {
      throw new ApiError(HTTP_STATUS.UNAUTHORIZED, MESSAGES.UNAUTHORIZED);
    }

    const incomingHash = hashToken(oldRefreshToken);
    const tokenIndex = admin.refreshTokens.findIndex(
      (t) => t.tokenHash === incomingHash,
    );

    if (tokenIndex === -1) {
      // Token reuse detected — invalidate ALL sessions
      admin.refreshTokens = [];
      await admin.save();
      throw new ApiError(
        HTTP_STATUS.UNAUTHORIZED,
        'Refresh token reuse detected. All sessions have been invalidated.',
      );
    }

    // 3. Rotate: remove old, issue new
    admin.refreshTokens.splice(tokenIndex, 1);
    admin.purgeExpiredTokens();

    const newAccessToken = signAccessToken(admin._id.toString());
    const newRefreshToken = signRefreshToken(admin._id.toString());
    admin.refreshTokens.push({ tokenHash: hashToken(newRefreshToken) });

    await admin.save();

    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  }

  /**
   * Logout: invalidate a specific refresh token.
   *
   * @param {string} adminId
   * @param {string} refreshToken - raw token from cookie
   */
  async logout(adminId, refreshToken) {
    if (!refreshToken) return; // already logged out

    const admin = await Admin.findById(adminId).select('+refreshTokens');
    if (!admin) return;

    const hash = hashToken(refreshToken);
    admin.refreshTokens = admin.refreshTokens.filter((t) => t.tokenHash !== hash);
    await admin.save();
  }

  /**
   * Unlock account using the special admin passkey.
   * Resets failedAttempts and lockUntil.
   *
   * @param {string} email
   * @param {string} passkey
   */
  async unlock(email, passkey) {
    const admin = await Admin.findOne({ email })
      .select('+passkey +failedAttempts +lockUntil');

    if (!admin) {
      // Constant-time fake compare
      await bcrypt.compare(passkey, '$2b$12$invalidsaltsothisnevermatchesXXX');
      throw new ApiError(HTTP_STATUS.UNAUTHORIZED, 'Invalid email or passkey.');
    }

    const isMatch = await admin.comparePasskey(passkey);
    if (!isMatch) {
      throw new ApiError(HTTP_STATUS.UNAUTHORIZED, 'Invalid email or passkey.');
    }

    admin.failedAttempts = 0;
    admin.lockUntil = null;
    await admin.save();

    return { message: 'Account unlocked successfully.' };
  }

  /**
   * Return safe admin profile (no sensitive fields).
   * @param {string} adminId
   */
  async getProfile(adminId) {
    const admin = await Admin.findById(adminId);
    if (!admin) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Admin not found.');
    }
    return {
      id: admin._id,
      email: admin.email,
      failedAttempts: admin.failedAttempts,
      isLocked: admin.isLocked,
      lockUntil: admin.lockUntil,
      createdAt: admin.createdAt,
    };
  }
}

module.exports = new AuthService();
