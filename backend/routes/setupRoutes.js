const express = require('express');
const router = express.Router();
const { createAdmin } = require('../controllers/setupController');

// Create or update admin user
router.post('/create-admin', createAdmin);

module.exports = router;
