const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const { authenticate } = require('../middleware/auth');
const { validate, symptomIntakeSchema } = require('../utils/validation');

/**
 * Chat/Symptom Intake Routes
 */

// Intake symptoms (protected)
router.post('/symptoms', authenticate, validate(symptomIntakeSchema), chatController.intakeSymptoms);

// Get symptom history (protected)
router.get('/history', authenticate, chatController.getHistory);

// Get specific report (protected)
router.get('/report/:reportId', authenticate, chatController.getReport);

module.exports = router;
