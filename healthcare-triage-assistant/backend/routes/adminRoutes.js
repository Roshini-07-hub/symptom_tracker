const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authenticate, authorizeAdmin } = require('../middleware/auth');

/**
 * Admin Routes
 * All routes require authentication and admin privileges
 */

// Get all users (admin only)
router.get('/users', authenticate, authorizeAdmin, adminController.getAllUsers);

// Get dashboard statistics (admin only)
router.get('/dashboard', authenticate, authorizeAdmin, adminController.getDashboardStats);

// Get all audit logs (admin only)
router.get('/audit-logs', authenticate, authorizeAdmin, adminController.getAllAuditLogs);

// Promote user to admin (admin only)
router.patch('/users/:userId/promote', authenticate, authorizeAdmin, adminController.promoteToAdmin);

module.exports = router;
