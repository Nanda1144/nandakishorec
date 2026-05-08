'use strict';

/**
 * Custom API error class.
 * Throw this anywhere in the app to produce a structured JSON error response.
 *
 * @example
 *   throw new ApiError(404, 'Resource not found');
 *   throw new ApiError(400, 'Validation failed', ['field is required']);
 */
class ApiError extends Error {
  /**
   * @param {number} statusCode  - HTTP status code
   * @param {string} message     - Human-readable error message
   * @param {Array}  [errors=[]] - Optional array of detailed error objects
   * @param {string} [stack='']  - Optional existing stack trace
   */
  constructor(statusCode, message, errors = [], stack = '') {
    super(message);
    this.statusCode = statusCode;
    this.data = null;
    this.message = message;
    this.success = false;
    this.errors = errors;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

module.exports = ApiError;
