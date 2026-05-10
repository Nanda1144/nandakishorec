'use strict';

const { Router } = require('express');
const analyticsController = require('../controllers/analytics.controller');

const router = Router();

router.get('/', analyticsController.getDashboardAnalytics);

module.exports = router;
