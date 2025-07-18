const express = require('express');
const router = express.Router();
const bidController = require('../controllers/bidController');

router.post('/api/bid', bidController.placeBid);
// router.get('/api/bids/meme/:memeId', bidController.getBidsForMeme);
// router.get('/api/bids/user/:userId', bidController.getBidsByUser);

module.exports = router; 