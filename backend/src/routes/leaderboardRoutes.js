const express = require('express');
const router = express.Router();
const leaderboardController = require('../controllers/leaderboardController');

router.get('/api/leaderboard', leaderboardController.getLeaderboardMemes);

module.exports = router; 