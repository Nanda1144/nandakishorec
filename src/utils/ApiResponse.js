'use strict';

/**
 * Standard success response wrapper.
 * Every controller should use this to keep responses consistent.
 *
 * @example
 *   return new ApiResponse(200, data, 'Fetched successfully').send(res);
 */
class ApiResponse {
  /**
   * @param {number} statusCode - HTTP status code (2xx)
   * @param {*}      data       - Response payload
   * @param {string} message    - Human-readable status message
   */
  constructor(statusCode, data, message = 'Success') {
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
    this.success = statusCode < 400;
  }

  /**
   * Sends the response via Express res object.
   * @param {import('express').Response} res
   */
  send(res) {
    return res.status(this.statusCode).json({
      success: this.success,
      message: this.message,
      data: this.data,
    });
  }
}

module.exports = ApiResponse;
