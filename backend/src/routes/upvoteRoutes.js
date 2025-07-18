const express = require('express');
const router = express.Router();
const upvoteController = require('../controllers/upvoteController');

router.post('/api/vote', upvoteController.voteMeme);
// router.get('/api/upvotes/count/:memeId', upvoteController.countUpvotes);
// router.get('/api/upvotes/user/:userId', upvoteController.getUpvotedMemesByUser);
// router.delete('/api/upvotes', upvoteController.removeUpvote);

module.exports = router; 