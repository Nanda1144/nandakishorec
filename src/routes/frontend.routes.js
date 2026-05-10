'use strict';

const { Router } = require('express');
const frontendController = require('../controllers/frontend.controller');
const frontendValidators = require('../validators/frontend.validator');
const validate = require('../middleware/validate');
// const { authenticate, authorize } = require('../middleware/authMiddleware'); // Optional: add if needed

const router = Router();

/**
 * Frontend management routes.
 */

router.route('/')
  .get(frontendController.getAllFrontends)
  .post(
    frontendValidators.create,
    validate,
    frontendController.createFrontend
  );

router.post('/import-ai', frontendController.importAI);

router.route('/:id')
  .get(
    frontendValidators.mongoId,
    validate,
    frontendController.getFrontendById
  )
  .patch(
    frontendValidators.update,
    validate,
    frontendController.updateFrontend
  )
  .delete(
    frontendValidators.mongoId,
    validate,
    frontendController.deleteFrontend
  );

router.patch(
  '/:id/status',
  frontendValidators.toggleActive,
  validate,
  frontendController.toggleStatus
);

module.exports = router;
