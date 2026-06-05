const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// POST register a new user
router.post('/register', userController.register);

// POST login
router.post('/login', userController.login);

// GET user profile
router.get('/:id', userController.getProfile);

module.exports = router;
