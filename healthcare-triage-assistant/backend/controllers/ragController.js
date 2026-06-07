const MedicalDocument = require('../models/MedicalDocument');
const ragService = require('../services/ragService');
const AuditLog = require('../models/AuditLog');

/**
 * RAG (Retrieval-Augmented Generation) Controller
 * Handles document management and RAG search
 */

/**
 * Upload medical document
 */
exports.uploadDocument = async (req, res) => {
  try {
    const { title, category, tags, language, content } = req.validatedData;
    const userId = req.user.userId;

    // Create document
    const doc = await MedicalDocument.create({
      title,
      category,
      tags: tags || [],
      language: language || 'en',
      content,
      uploadedBy: userId,
      source: 'user-uploaded'
    });

    // Index in Pinecone
    try {
      const indexResult = await ragService.indexDocument(doc);
      
      // Log audit
      await AuditLog.create({
        userId,
        action: 'document-upload',
        userQuery: `Uploaded document: ${title}`,
        recommendation: 'Document indexed successfully'
      });

      res.status(201).json({
        success: true,
        message: 'Document uploaded and indexed successfully',
        data: {
          documentId: doc._id,
          pineconeId: indexResult.pineconeId
        }
      });
    } catch (indexError) {
      console.error('Indexing error:', indexError);
      res.status(201).json({
        success: true,
        message: 'Document created but indexing failed',
        warning: 'Document was saved but may not be searchable',
        data: { documentId: doc._id }
      });
    }
  } catch (error) {
    console.error('Upload document error:', error);
    res.status(500).json({
      success: false,
      message: 'Error uploading document'
    });
  }
};

/**
 * Search medical documents
 */
exports.searchDocuments = async (req, res) => {
  const startTime = Date.now();

  try {
    const { query, topK, language } = req.body;
    const userId = req.user.userId;

    if (!query) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      });
    }

    // Search documents using RAG
    const documents = await ragService.searchDocuments(
      query,
      topK || 5,
      language || 'en'
    );

    // Log audit
    await AuditLog.create({
      userId,
      action: 'rag-search',
      userQuery: query,
      retrievedDocuments: documents.map(d => ({
        id: d.id,
        title: d.title,
        relevanceScore: d.relevanceScore
      })),
      responseTime: Date.now() - startTime
    });

    res.json({
      success: true,
      data: {
        documents,
        count: documents.length,
        responseTime: Date.now() - startTime
      }
    });
  } catch (error) {
    console.error('Search documents error:', error);
    res.status(500).json({
      success: false,
      message: 'Error searching documents'
    });
  }
};

/**
 * Get all medical documents
 */
exports.getAllDocuments = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const skip = parseInt(req.query.skip) || 0;
    const category = req.query.category;
    const language = req.query.language || 'en';

    const filter = { language };
    if (category) filter.category = category;

    const documents = await MedicalDocument.find(filter)
      .select('title category tags language pineconeId createdAt')
      .limit(limit)
      .skip(skip)
      .sort({ createdAt: -1 });

    const total = await MedicalDocument.countDocuments(filter);

    res.json({
      success: true,
      data: {
        documents,
        pagination: {
          total,
          limit,
          skip,
          hasMore: skip + limit < total
        }
      }
    });
  } catch (error) {
    console.error('Get documents error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching documents'
    });
  }
};

/**
 * Get specific document
 */
exports.getDocument = async (req, res) => {
  try {
    const { documentId } = req.params;

    const document = await MedicalDocument.findById(documentId);

    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Document not found'
      });
    }

    res.json({
      success: true,
      data: document
    });
  } catch (error) {
    console.error('Get document error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching document'
    });
  }
};

/**
 * Delete document
 */
exports.deleteDocument = async (req, res) => {
  try {
    const { documentId } = req.params;
    const userId = req.user.userId;

    const document = await MedicalDocument.findById(documentId);

    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Document not found'
      });
    }

    // Check if user is admin or document owner
    if (!req.user.isAdmin && document.uploadedBy.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this document'
      });
    }

    await MedicalDocument.findByIdAndDelete(documentId);

    res.json({
      success: true,
      message: 'Document deleted successfully'
    });
  } catch (error) {
    console.error('Delete document error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting document'
    });
  }
};
