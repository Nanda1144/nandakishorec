'use strict';

const { Router } = require('express');
const userRoutes = require('./user.routes');
const healthRoutes = require('./health.routes');

const router = Router();

/**
 * API v1 route index.
 * All feature routes are mounted here and re-exported to app.js.
 *
 * Pattern: /api/v1/<resource>
 */
router.use('/health', healthRoutes);
router.use('/users', userRoutes);
router.use('/frontends', require('./frontend.routes'));
router.use('/projects', require('./project.routes'));
router.use('/internships', require('./internship.routes'));
router.use('/skills', require('./skill.routes'));
router.use('/courses', require('./course.routes'));
router.use('/achievements', require('./achievement.routes'));
router.use('/gallery', require('./gallery.routes'));
router.use('/research', require('./research.routes'));
router.use('/patents', require('./patent.routes'));
router.use('/themes', require('./theme.routes'));
router.use('/layout', require('./layout.routes'));
router.use('/hero', require('./hero.routes'));

// ── Add future routes below ───────────────────────────────────────────────────
router.use('/auth', require('./auth.routes'));
// router.use('/projects', require('./project.routes'));
// router.use('/blog',     require('./blog.routes'));

module.exports = router;
