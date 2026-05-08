'use strict';

/**
 * Wraps an async route handler so you don't need try/catch in every controller.
 *
 * @param {Function} fn - Async express route handler
 * @returns {Function}  - Express middleware that catches rejections
 *
 * @example
 *   router.get('/', asyncHandler(async (req, res) => { ... }));
 */
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

module.exports = asyncHandler;
