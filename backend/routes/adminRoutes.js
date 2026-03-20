const express = require('express');
const router = express.Router();
const {
  createReferendum,
  updateReferendum,
  openReferendum,
  closeReferendum,
  getReferendumResults,
  getDashboardStats,
  getAllReferendumsWithResults
} = require('../controllers/adminController');
const { authenticate, isAdmin } = require('../middleware/auth');

// All admin routes require authentication and admin role
router.use(authenticate);
router.use(isAdmin);

// Create referendum
router.post('/referendums', createReferendum);

// Update referendum
router.put('/referendums/:id', updateReferendum);

// Open referendum
router.patch('/referendums/:id/open', openReferendum);

// Close referendum
router.patch('/referendums/:id/close', closeReferendum);

// Get referendum results
router.get('/referendums/:id/results', getReferendumResults);

// Get all referendums with results
router.get('/referendums', getAllReferendumsWithResults);

// Get dashboard statistics
router.get('/dashboard/stats', getDashboardStats);

module.exports = router;
