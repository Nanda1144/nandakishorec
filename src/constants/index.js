'use strict';

/**
 * Application-wide string constants.
 * Avoids magic strings scattered across the codebase.
 */

const HTTP_STATUS = Object.freeze({
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
});

const MESSAGES = Object.freeze({
  // Generic
  SUCCESS: 'Operation successful',
  CREATED: 'Resource created successfully',
  UPDATED: 'Resource updated successfully',
  DELETED: 'Resource deleted successfully',
  NOT_FOUND: 'Resource not found',
  UNAUTHORIZED: 'You are not authorized to perform this action',
  FORBIDDEN: 'Access denied',
  VALIDATION_ERROR: 'Validation failed',
  INTERNAL_ERROR: 'Internal server error',
  TOO_MANY_REQUESTS: 'Too many requests, please try again later',

  // Auth
  INVALID_CREDENTIALS: 'Invalid email or password',
  TOKEN_MISSING: 'Authentication token is missing',
  TOKEN_INVALID: 'Authentication token is invalid or expired',
  LOGOUT_SUCCESS: 'Logged out successfully',
});

const PROJECT_STATUS = Object.freeze({
  ONGOING: 'ongoing',
  COMPLETED: 'completed',
  MAINTENANCE: 'maintenance',
});

const SKILL_LEVELS = Object.freeze({
  BEGINNER: 'Beginner',
  INTERMEDIATE: 'Intermediate',
  ADVANCED: 'Advanced',
});

const DB_COLLECTIONS = Object.freeze({
  USERS: 'users',
  // Add more collection name constants here
});

module.exports = { HTTP_STATUS, MESSAGES, PROJECT_STATUS, SKILL_LEVELS, DB_COLLECTIONS };
