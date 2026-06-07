const mongoose = require('mongoose');

/**
 * Audit Log Schema
 * Tracks all user interactions and AI responses for compliance and analysis
 */
const auditLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  action: {
    type: String,
    enum: ['symptom-intake', 'rag-search', 'ai-response', 'classification', 'recommendation', 'document-upload', 'report-upload', 'report-delete'],
    required: true
  },
  userQuery: {
    type: String,
    default: ''
  },
  retrievedDocuments: {
    type: [{
      id: String,
      title: String,
      relevanceScore: Number
    }],
    default: []
  },
  aiResponse: {
    type: String,
    default: ''
  },
  riskClassification: {
    type: String,
    enum: ['low', 'moderate', 'high', 'emergency'],
    default: null
  },
  recommendation: {
    type: String,
    default: ''
  },
  emergencyFlagsDetected: {
    type: [String],
    default: []
  },
  responseTime: {
    type: Number, // in milliseconds
    default: 0
  },
  modelUsed: {
    type: String,
    default: 'gpt-4'
  },
  ipAddress: {
    type: String,
    default: ''
  },
  userAgent: {
    type: String,
    default: ''
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true
  }
}, { timestamps: false });

// Index for efficient querying
auditLogSchema.index({ userId: 1, timestamp: -1 });
auditLogSchema.index({ action: 1, timestamp: -1 });

module.exports = mongoose.model('AuditLog', auditLogSchema);
