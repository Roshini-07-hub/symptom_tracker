const express = require('express');
const router = express.Router();
const classifyController = require('../controllers/classifyController');
const { authenticate } = require('../middleware/auth');

/**
 * Classification Routes
 */

// Classify symptoms (protected)
router.post('/symptoms', authenticate, classifyController.classifySymptoms);

// Detect emergency (protected)
router.post('/emergency', authenticate, classifyController.detectEmergency);

module.exports = router;
