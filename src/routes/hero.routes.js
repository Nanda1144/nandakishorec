'use strict';

const { Router } = require('express');
const heroController = require('../controllers/hero.controller');
const upload = require('../middleware/upload');
const { param, body } = require('express-validator');
const validate = require('../middleware/validate');

const router = Router();

/**
 * Hero section management routes.
 */

router.route('/:frontendSlug')
  .get(
    param('frontendSlug').trim().notEmpty(),
    validate,
    heroController.getHero
  )
  .patch(
    upload.fields([
      { name: 'profileImage', maxCount: 1 },
      { name: 'backgroundImages', maxCount: 5 },
    ]),
    param('frontendSlug').trim().notEmpty(),
    validate,
    heroController.updateHero
  );

module.exports = router;
