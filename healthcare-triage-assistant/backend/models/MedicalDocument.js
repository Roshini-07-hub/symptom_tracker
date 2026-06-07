const mongoose = require('mongoose');

/**
 * Medical Document Schema
 * Stores medical knowledge base documents used for RAG
 */
const medicalDocumentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    index: true
  },
  content: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['condition', 'symptom', 'treatment', 'prevention', 'diagnosis', 'general']
  },
  source: {
    type: String,
    default: 'uploaded'
  },
  tags: {
    type: [String],
    default: [],
    index: true
  },
  pineconeId: {
    type: String,
    unique: true,
    sparse: true
  },
  embedding: {
    type: [Number],
    default: []
  },
  language: {
    type: String,
    enum: ['en', 'hi', 'te'],
    default: 'en'
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  // File upload fields
  fileName: {
    type: String,
    default: null
  },
  filePath: {
    type: String,
    default: null
  },
  fileSize: {
    type: Number,
    default: null
  },
  mimeType: {
    type: String,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// Indexes for search optimization
medicalDocumentSchema.index({ title: 'text', content: 'text' });
medicalDocumentSchema.index({ tags: 1 });

module.exports = mongoose.model('MedicalDocument', medicalDocumentSchema);
