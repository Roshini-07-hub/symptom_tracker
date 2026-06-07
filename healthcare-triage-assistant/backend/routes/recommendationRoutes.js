const express = require('express');
const router = express.Router();
const recommendationController = require('../controllers/recommendationController');
const { authenticate } = require('../middleware/auth');

/**
 * Recommendation Routes
 */

// Generate recommendation (protected)
router.post('/generate', authenticate, recommendationController.generateRecommendation);

module.exports = router;
