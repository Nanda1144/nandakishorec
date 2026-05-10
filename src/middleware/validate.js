'use strict';

const { validationResult } = require('express-validator');
const ApiError = require('../utils/ApiError');
const { HTTP_STATUS, MESSAGES } = require('../constants');

/**
 * Runs express-validator's validationResult and short-circuits
 * the request with a 422 if any rules fail.
 *
 * Place this after your validation rule arrays in the route definition.
 *
 * @example
 *   router.post('/', [body('email').isEmail(), validate], handler);
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const extractedErrors = errors.array().map((err) => ({
      field: err.path,
      message: err.msg,
    }));
    
    console.error('❌ Validation Failed:', JSON.stringify(extractedErrors, null, 2));
    
    return next(
      new ApiError(HTTP_STATUS.UNPROCESSABLE_ENTITY, MESSAGES.VALIDATION_ERROR, extractedErrors),
    );
  }
  return next();
};

module.exports = validate;
