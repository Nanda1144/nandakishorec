'use strict';

const { Router } = require('express');
const researchController = require('../controllers/research.controller');
const researchValidators = require('../validators/research.validator');
const validate = require('../middleware/validate');
const upload = require('../middleware/upload');

const router = Router();

/**
 * Research management routes.
 */

router.route('/')
  .get(
    researchValidators.query,
    validate,
    researchController.getAllResearch
  )
  .post(
    upload.single('certificate'),
    researchValidators.create,
    validate,
    researchController.createResearch
  );

router.route('/:id')
  .get(
    researchValidators.mongoId,
    validate,
    researchController.getResearchById
  )
  .patch(
    upload.single('certificate'),
    researchValidators.update,
    validate,
    researchController.updateResearch
  )
  .delete(
    researchValidators.mongoId,
    validate,
    researchController.deleteResearch
  );

module.exports = router;
