'use strict';

const { Router } = require('express');
const courseController = require('../controllers/course.controller');
const courseValidators = require('../validators/course.validator');
const validate = require('../middleware/validate');

const router = Router();

/**
 * Course management routes.
 */

router.route('/')
  .get(
    courseValidators.query,
    validate,
    courseController.getAllCourses
  )
  .post(
    courseValidators.create,
    validate,
    courseController.createCourse
  );

router.route('/:id')
  .get(
    courseValidators.mongoId,
    validate,
    courseController.getCourseById
  )
  .patch(
    courseValidators.update,
    validate,
    courseController.updateCourse
  )
  .delete(
    courseValidators.mongoId,
    validate,
    courseController.deleteCourse
  );

module.exports = router;
