'use strict';

const { Router } = require('express');
const galleryController = require('../controllers/gallery.controller');
const upload = require('../middleware/upload');

const router = Router();

router.get('/', galleryController.getAllImages);
router.post('/', upload.array('files', 10), galleryController.uploadMedia);
router.delete('/:id', galleryController.deleteImage);

module.exports = router;
