const express = require('express');
const router = express.Router();
const {
  getReferendums,
  getReferendum,
  getMyVote,
  castVote,
  getReferendumsWithVoteStatus
} = require('../controllers/referendumController');
const { authenticate } = require('../middleware/auth');

// Get all referendums with optional status filter
router.get('/', authenticate, getReferendums);

// Get referendums with user's vote status
router.get('/with-vote/list', authenticate, getReferendumsWithVoteStatus);

// Get single referendum
router.get('/:id', authenticate, getReferendum);

// Get user's vote for a referendum
router.get('/:id/my-vote', authenticate, getMyVote);

// Cast vote
router.post('/:id/vote', authenticate, castVote);

module.exports = router;
