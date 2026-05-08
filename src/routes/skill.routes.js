'use strict';

const { Router } = require('express');
const skillController = require('../controllers/skill.controller');
const skillValidators = require('../validators/skill.validator');
const validate = require('../middleware/validate');

const router = Router();

/**
 * Skill management routes.
 */

router.route('/')
  .get(
    skillValidators.query,
    validate,
    skillController.getAllSkills
  )
  .post(
    skillValidators.create,
    validate,
    skillController.createSkill
  );

router.route('/:id')
  .get(
    skillValidators.mongoId,
    validate,
    skillController.getSkillById
  )
  .patch(
    skillValidators.update,
    validate,
    skillController.updateSkill
  )
  .delete(
    skillValidators.mongoId,
    validate,
    skillController.deleteSkill
  );

module.exports = router;
