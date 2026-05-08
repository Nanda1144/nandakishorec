'use strict';

const { Router } = require('express');
const internshipController = require('../controllers/internship.controller');
const internshipValidators = require('../validators/internship.validator');
const validate = require('../middleware/validate');
const upload = require('../middleware/upload');

const router = Router();

/**
 * Internship / Experience management routes.
 */

router.route('/')
  .get(
    internshipValidators.query,
    validate,
    internshipController.getAllInternships
  )
  .post(
    // Handle multiple fields for uploads if needed
    upload.fields([
      { name: 'offerLetter', maxCount: 1 },
      { name: 'completionCertificate', maxCount: 1 },
      { name: 'photos', maxCount: 5 },
    ]),
    internshipValidators.create,
    validate,
    internshipController.createInternship
  );

router.route('/:id')
  .get(
    internshipValidators.mongoId,
    validate,
    internshipController.getInternshipById
  )
  .patch(
    upload.fields([
      { name: 'offerLetter', maxCount: 1 },
      { name: 'completionCertificate', maxCount: 1 },
      { name: 'photos', maxCount: 5 },
    ]),
    internshipValidators.update,
    validate,
    internshipController.updateInternship
  )
  .delete(
    internshipValidators.mongoId,
    validate,
    internshipController.deleteInternship
  );

module.exports = router;
