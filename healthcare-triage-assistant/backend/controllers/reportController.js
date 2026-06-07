const MedicalDocument = require('../models/MedicalDocument');
const User = require('../models/User');
const AuditLog = require('../models/AuditLog');
const ragService = require('../services/ragService');
const { t } = require('../utils/translations');
const { OpenAI } = require('openai');
const fs = require('fs');
const path = require('path');

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const allowedMimes = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/heic',
  'image/heif'
];

/**
 * Extract text content from uploaded file using GPT-4 Vision (images) or pdf-parse (PDFs)
 */
const extractFileContent = async (file) => {
  try {
    if (file.mimetype.startsWith('image/')) {
      // Use GPT-4 Vision to extract text from medical images
      const imageData = fs.readFileSync(file.path);
      const base64Image = imageData.toString('base64');

      const response = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: 'This is a medical report or document. Please extract and transcribe all text content from this image accurately. Include all medical details, diagnoses, medications, test results, and any other relevant information visible in the document.'
              },
              {
                type: 'image_url',
                image_url: {
                  url: `data:${file.mimetype};base64,${base64Image}`,
                  detail: 'high'
                }
              }
            ]
          }
        ],
        max_tokens: 2000
      });

      return response.choices[0].message.content;
    }

    if (file.mimetype === 'application/pdf') {
      try {
        const pdfParse = require('pdf-parse');
        const dataBuffer = fs.readFileSync(file.path);
        const pdfData = await pdfParse(dataBuffer);
        return pdfData.text || `[PDF: ${file.originalname}] - Content extraction failed`;
      } catch (pdfErr) {
        console.error('PDF parse error:', pdfErr.message);
        return `[PDF: ${file.originalname}]\nUploaded on ${new Date().toISOString()}`;
      }
    }

    // Fallback for DOC/DOCX
    return `[${file.originalname}]\nFile uploaded on ${new Date().toISOString()}\nFile type: ${file.mimetype}`;
  } catch (err) {
    console.error('Content extraction error:', err.message);
    return `[${file.originalname}]\nFile uploaded on ${new Date().toISOString()}\nFile type: ${file.mimetype}`;
  }
};

/**
 * Report Upload Controller
 * Handles medical report file uploads
 */

/**
 * Upload medical report file
 */
exports.uploadReport = async (req, res) => {
  try {
    const { title, category, language } = req.body;
    const userId = req.user.userId;
    const userLanguage = language || 'en';

    if (req.invalidFileType) {
      return res.status(400).json({
        success: false,
        message: t('upload.invalid_format', userLanguage)
      });
    }

    // Validate file
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: t('upload.file_required', userLanguage)
      });
    }

    // Validate file size (max 5MB)
    const maxFileSize = 5 * 1024 * 1024; // 5MB
    if (req.file.size > maxFileSize) {
      return res.status(400).json({
        success: false,
        message: t('upload.file_too_large', userLanguage)
      });
    }

    // Validate file type
    if (!allowedMimes.includes(req.file.mimetype)) {
      return res.status(400).json({
        success: false,
        message: t('upload.invalid_format', userLanguage)
      });
    }

    // Extract text content from file for RAG indexing
    let fileContent = await extractFileContent(req.file);
    
    // For now, store file metadata. In production, extract text from PDF/DOC/image reports.
    const doc = await MedicalDocument.create({
      title: title || req.file.originalname,
      category: category || 'general',
      content: fileContent,
      language: userLanguage,
      uploadedBy: userId,
      source: 'file-upload',
      tags: ['medical-report', 'user-uploaded', req.file.mimetype.startsWith('image/') ? 'image-report' : 'document-report'],
      fileName: req.file.originalname,
      filePath: req.file.path,
      fileSize: req.file.size,
      mimeType: req.file.mimetype
    });

    // Index in Pinecone
    try {
      await ragService.indexDocument(doc);
    } catch (indexError) {
      console.log('Pinecone indexing skipped:', indexError.message);
    }

    // Create audit log (non-critical — don't let failures block the response)
    try {
      await AuditLog.create({
        userId,
        action: 'report-upload',
        userQuery: `Uploaded report: ${title || req.file.originalname}`,
        recommendation: 'Report uploaded successfully',
        responseTime: 0
      });
    } catch (auditErr) {
      console.error('Audit log error (non-fatal):', auditErr.message);
    }

    res.status(201).json({
      success: true,
      message: t('upload.success', userLanguage),
      data: {
        reportId: doc._id,
        fileName: req.file.originalname,
        title: doc.title,
        uploadedAt: doc.createdAt
      }
    });
  } catch (error) {
    console.error('Upload report error:', error);
    const userLanguage = req.body.language || 'en';
    res.status(500).json({
      success: false,
      message: t('upload.error', userLanguage),
      ...(process.env.NODE_ENV === 'development' && { debug: error.message })
    });
  }
};

/**
 * Get user's uploaded reports
 */
exports.getUserReports = async (req, res) => {
  try {
    const userId = req.user.userId;
    const limit = parseInt(req.query.limit) || 10;
    const skip = parseInt(req.query.skip) || 0;
    const language = req.query.language || 'en';

    const reports = await MedicalDocument.find({
      uploadedBy: userId,
      source: 'file-upload'
    })
      .select('title category language createdAt fileName')
      .limit(limit)
      .skip(skip)
      .sort({ createdAt: -1 });

    const total = await MedicalDocument.countDocuments({
      uploadedBy: userId,
      source: 'file-upload'
    });

    res.json({
      success: true,
      message: t('documents.search_successful', language),
      data: {
        reports,
        pagination: {
          total,
          limit,
          skip,
          hasMore: skip + limit < total
        }
      }
    });
  } catch (error) {
    console.error('Get user reports error:', error);
    const userLanguage = req.query.language || 'en';
    res.status(500).json({
      success: false,
      message: t('error.server', userLanguage)
    });
  }
};

/**
 * Delete user's report
 */
exports.deleteReport = async (req, res) => {
  try {
    const { reportId } = req.params;
    const userId = req.user.userId;
    const language = req.query.language || 'en';

    const report = await MedicalDocument.findOne({
      _id: reportId,
      uploadedBy: userId,
      source: 'file-upload'
    });

    if (!report) {
      return res.status(404).json({
        success: false,
        message: t('documents.not_found', language)
      });
    }

    // Delete from Pinecone if indexed
    if (report.pineconeId) {
      const index = await require('../config/pinecone').getIndex();
      try {
        await index.deleteOne(report.pineconeId);
      } catch (err) {
        console.log('Pinecone deletion warning:', err.message);
      }
    }

    // Delete from database
    await MedicalDocument.findByIdAndDelete(reportId);

    // Create audit log
    await AuditLog.create({
      userId,
      action: 'report-delete',
      userQuery: `Deleted report: ${report.title}`,
      recommendation: 'Report deleted successfully'
    });

    res.json({
      success: true,
      message: t('documents.delete_successful', language)
    });
  } catch (error) {
    console.error('Delete report error:', error);
    const userLanguage = req.query.language || 'en';
    res.status(500).json({
      success: false,
      message: t('error.server', userLanguage)
    });
  }
};

module.exports = {
  uploadReport: exports.uploadReport,
  getUserReports: exports.getUserReports,
  deleteReport: exports.deleteReport
};
