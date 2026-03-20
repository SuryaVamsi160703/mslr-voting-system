const express = require('express');
const router = express.Router();
const {
  getOpenDataReferendums,
  getOpenDataReferendum
} = require('../controllers/openDataController');

// Get referendums by status
router.get('/referendums', getOpenDataReferendums);

// Get single referendum
router.get('/referendum/:id', getOpenDataReferendum);

module.exports = router;
