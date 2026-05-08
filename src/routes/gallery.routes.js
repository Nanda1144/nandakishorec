'use strict';

const { Router } = require('express');
const galleryController = require('../controllers/gallery.controller');

const router = Router();

router.get('/', galleryController.getAllImages);

module.exports = router;
