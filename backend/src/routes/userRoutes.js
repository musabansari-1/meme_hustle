const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { verifyUser } = require('../middlewares/verifyUser');

// Ensure user has a profile (creates one if not)
router.post('/api/users/ensure', verifyUser, userController.ensureUserProfile);

module.exports = router;
