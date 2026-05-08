'use strict';

const { Router } = require('express');
const achievementController = require('../controllers/achievement.controller');
const achievementValidators = require('../validators/achievement.validator');
const validate = require('../middleware/validate');
const upload = require('../middleware/upload');

const router = Router();

/**
 * Achievement management routes.
 */

router.route('/')
  .get(
    achievementValidators.query,
    validate,
    achievementController.getAllAchievements
  )
  .post(
    upload.fields([
      { name: 'photos', maxCount: 10 },
      { name: 'certificate', maxCount: 1 },
    ]),
    achievementValidators.create,
    validate,
    achievementController.createAchievement
  );

router.route('/:id')
  .get(
    achievementValidators.mongoId,
    validate,
    achievementController.getAchievementById
  )
  .patch(
    upload.fields([
      { name: 'photos', maxCount: 10 },
      { name: 'certificate', maxCount: 1 },
    ]),
    achievementValidators.update,
    validate,
    achievementController.updateAchievement
  )
  .delete(
    achievementValidators.mongoId,
    validate,
    achievementController.deleteAchievement
  );

module.exports = router;
