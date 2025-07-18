const express = require('express');
const router = express.Router();
const memeController = require('../controllers/memeController');

router.post('/api/memes', memeController.uploadMeme);
router.get('/api/memes', memeController.getAllMemes);
router.get('/api/memes/:id', memeController.getSpecificMeme);
router.get('/api/memes/user/:userId', memeController.getMemesByUser);

module.exports = router; 