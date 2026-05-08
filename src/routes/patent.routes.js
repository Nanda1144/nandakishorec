'use strict';

const { Router } = require('express');
const patentController = require('../controllers/patent.controller');
const patentValidators = require('../validators/patent.validator');
const validate = require('../middleware/validate');
const upload = require('../middleware/upload');

const router = Router();

/**
 * Patent management routes.
 */

router.route('/')
  .get(
    patentValidators.query,
    validate,
    patentController.getAllPatents
  )
  .post(
    upload.single('certificate'),
    patentValidators.create,
    validate,
    patentController.createPatent
  );

router.route('/:id')
  .get(
    patentValidators.mongoId,
    validate,
    patentController.getPatentById
  )
  .patch(
    upload.single('certificate'),
    patentValidators.update,
    validate,
    patentController.updatePatent
  )
  .delete(
    patentValidators.mongoId,
    validate,
    patentController.deletePatent
  );

module.exports = router;
