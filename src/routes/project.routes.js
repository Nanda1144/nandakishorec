'use strict';

const { Router } = require('express');
const projectController = require('../controllers/project.controller');
const projectValidators = require('../validators/project.validator');
const validate = require('../middleware/validate');

const router = Router();

/**
 * Project management routes.
 */

router.route('/')
  .get(
    projectValidators.query,
    validate,
    projectController.getAllProjects
  )
  .post(
    projectValidators.create,
    validate,
    projectController.createProject
  );

router.route('/:id')
  .get(
    projectValidators.mongoId,
    validate,
    projectController.getProjectById
  )
  .patch(
    projectValidators.update,
    validate,
    projectController.updateProject
  )
  .delete(
    projectValidators.mongoId,
    validate,
    projectController.deleteProject
  );

module.exports = router;
