'use strict';

const { Router } = require('express');
const layoutController = require('../controllers/layout.controller');
const { body, param } = require('express-validator');
const validate = require('../middleware/validate');

const router = Router();

/**
 * Layout (Header/Footer) management routes.
 */

// Header routes
router.route('/header/:frontendSlug')
  .get(
    param('frontendSlug').trim().notEmpty(),
    validate,
    layoutController.getHeader
  )
  .patch(
    param('frontendSlug').trim().notEmpty(),
    validate,
    layoutController.updateHeader
  );

// Footer routes
router.route('/footer/:frontendSlug')
  .get(
    param('frontendSlug').trim().notEmpty(),
    validate,
    layoutController.getFooter
  )
  .patch(
    param('frontendSlug').trim().notEmpty(),
    validate,
    layoutController.updateFooter
  );

module.exports = router;
