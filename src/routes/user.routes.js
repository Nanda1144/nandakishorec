'use strict';

const { Router } = require('express');
const userController = require('../controllers/user.controller');
const userValidators = require('../validators/user.validator');
const validate = require('../middleware/validate');

const router = Router();

/**
 * @route   GET /api/v1/users
 * @desc    Get all users (paginated)
 * @access  Public (protect with auth middleware in production)
 */
router.get('/', userController.getAllUsers);

/**
 * @route   POST /api/v1/users
 * @desc    Create a new user
 * @access  Public
 */
router.post('/', [...userValidators.create, validate], userController.createUser);

/**
 * @route   GET /api/v1/users/:id
 * @desc    Get a single user by ID
 * @access  Public
 */
router.get('/:id', [...userValidators.mongoId, validate], userController.getUserById);

/**
 * @route   PATCH /api/v1/users/:id
 * @desc    Update a user
 * @access  Public
 */
router.patch('/:id', [...userValidators.update, validate], userController.updateUser);

/**
 * @route   DELETE /api/v1/users/:id
 * @desc    Soft-delete a user
 * @access  Public
 */
router.delete('/:id', [...userValidators.mongoId, validate], userController.deleteUser);

module.exports = router;
