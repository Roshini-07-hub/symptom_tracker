const express = require('express');
const router = express.Router();
const ragController = require('../controllers/ragController');
const { authenticate } = require('../middleware/auth');
const { validate, documentUploadSchema } = require('../utils/validation');

/**
 * RAG (Retrieval-Augmented Generation) Routes
 */

// Upload medical document (protected)
router.post('/upload', authenticate, validate(documentUploadSchema), ragController.uploadDocument);

// Search documents (protected)
router.post('/search', authenticate, ragController.searchDocuments);

// Get all documents (protected)
router.get('/documents', authenticate, ragController.getAllDocuments);

// Get specific document (protected)
router.get('/documents/:documentId', authenticate, ragController.getDocument);

// Delete document (protected)
router.delete('/documents/:documentId', authenticate, ragController.deleteDocument);

module.exports = router;
