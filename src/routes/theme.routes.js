'use strict';

const { Router } = require('express');
const themeController = require('../controllers/theme.controller');
const { body, param } = require('express-validator');
const validate = require('../middleware/validate');

const router = Router();

/**
 * Theme management routes.
 */

router.route('/:frontendSlug')
  .get(
    param('frontendSlug').trim().notEmpty(),
    validate,
    themeController.getTheme
  )
  .patch(
    param('frontendSlug').trim().notEmpty(),
    body('colors').optional().isObject(),
    body('fonts').optional().isObject(),
    body('mode').optional().isIn(['light', 'dark', 'system']),
    validate,
    themeController.updateTheme
  );

router.post('/:frontendSlug/reset', 
  param('frontendSlug').trim().notEmpty(),
  validate,
  themeController.resetTheme
);

module.exports = router;
