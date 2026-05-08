'use strict';

const authService = require('../services/auth.service');
const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const { HTTP_STATUS } = require('../constants');

// ── Cookie config ─────────────────────────────────────────────────────────────
const REFRESH_COOKIE = 'refreshToken';

const cookieOptions = {
  httpOnly: true,                                    // Not accessible via JS
  secure: process.env.NODE_ENV === 'production',     // HTTPS only in prod
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000,                 // 7 days in ms
  path: '/',
};

const clearCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  path: '/',
};

// ─────────────────────────────────────────────────────────────────────────────

/**
 * POST /api/v1/auth/login
 * Body: { email, password }
 *
 * Returns: { accessToken, admin }  +  httpOnly refreshToken cookie
 */
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const { accessToken, refreshToken, admin } = await authService.login(email, password);

  res.cookie(REFRESH_COOKIE, refreshToken, cookieOptions);

  return new ApiResponse(HTTP_STATUS.OK, { accessToken, admin }, 'Login successful').send(res);
});

/**
 * POST /api/v1/auth/refresh
 * Reads refreshToken from httpOnly cookie.
 *
 * Returns: { accessToken }  +  new refreshToken cookie (rotation)
 */
const refresh = asyncHandler(async (req, res) => {
  const oldRefreshToken = req.cookies?.[REFRESH_COOKIE];

  if (!oldRefreshToken) {
    return res.status(HTTP_STATUS.UNAUTHORIZED).json({
      success: false,
      message: 'No refresh token provided.',
    });
  }

  const { accessToken, refreshToken } = await authService.refresh(oldRefreshToken);

  res.cookie(REFRESH_COOKIE, refreshToken, cookieOptions);

  return new ApiResponse(HTTP_STATUS.OK, { accessToken }, 'Token refreshed').send(res);
});

/**
 * POST /api/v1/auth/logout
 * Protected — requires valid access token.
 * Invalidates the current refresh token from DB.
 */
const logout = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies?.[REFRESH_COOKIE];

  await authService.logout(req.admin._id.toString(), refreshToken);

  res.clearCookie(REFRESH_COOKIE, clearCookieOptions);

  return new ApiResponse(HTTP_STATUS.OK, null, 'Logged out successfully').send(res);
});

/**
 * POST /api/v1/auth/unlock
 * Body: { email, passkey }
 * Public — allows recovery without needing an access token.
 */
const unlock = asyncHandler(async (req, res) => {
  const { email, passkey } = req.body;

  const result = await authService.unlock(email, passkey);

  return new ApiResponse(HTTP_STATUS.OK, result, result.message).send(res);
});

/**
 * GET /api/v1/auth/me
 * Protected — returns current admin profile.
 */
const getMe = asyncHandler(async (req, res) => {
  const profile = await authService.getProfile(req.admin._id.toString());

  return new ApiResponse(HTTP_STATUS.OK, profile, 'Profile retrieved').send(res);
});

module.exports = { login, refresh, logout, unlock, getMe };
