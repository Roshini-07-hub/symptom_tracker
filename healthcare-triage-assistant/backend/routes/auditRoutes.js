const express = require('express');
const router = express.Router();
const auditController = require('../controllers/auditController');
const { authenticate } = require('../middleware/auth');

/**
 * Audit Log Routes
 */

// Get user logs (protected)
router.get('/logs', authenticate, auditController.getUserLogs);

// Get statistics (protected)
router.get('/statistics', authenticate, auditController.getStatistics);

module.exports = router;
