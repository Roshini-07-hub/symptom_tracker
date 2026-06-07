const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');
const { validate, registerSchema, loginSchema } = require('../utils/validation');

/**
 * Authentication Routes
 */

// Register
router.post('/register', validate(registerSchema), authController.register);

// Login
router.post('/login', validate(loginSchema), authController.login);

// Get profile (protected)
router.get('/profile', authenticate, authController.getProfile);

// Update profile (protected)
router.put('/profile', authenticate, authController.updateProfile);

module.exports = router;
