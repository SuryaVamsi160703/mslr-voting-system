const express = require('express');
const router = express.Router();
const { register, login, getProfile } = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');

// Register voter
router.post('/register', register);

// Login
router.post('/login', login);

// Get current user profile
router.get('/profile', authenticate, getProfile);

module.exports = router;
