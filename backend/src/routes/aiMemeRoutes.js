const express = require('express');
const { generateMemeImage } = require('../controllers/aiMemeController'); // Will create this controller
const router = express.Router();

router.post('/api/generate-meme-image', generateMemeImage);

module.exports = router; 