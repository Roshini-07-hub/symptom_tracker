const mongoose = require('mongoose');

/**
 * Symptom Report Schema
 * Stores user symptom intake and triage assessment
 */
const symptomReportSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  symptoms: {
    type: [String],
    required: true
  },
  severity: {
    type: String,
    enum: ['mild', 'moderate', 'severe'],
    required: true
  },
  duration: {
    type: String,
    required: true
  },
  onsetDate: {
    type: Date,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  riskLevel: {
    type: String,
    enum: ['low', 'moderate', 'high', 'emergency'],
    default: null
  },
  recommendation: {
    type: String,
    enum: ['self-care', 'doctor-consultation', 'specialist-consultation', 'emergency-room'],
    default: null
  },
  aiResponse: {
    type: String,
    default: ''
  },
  retrievedDocuments: {
    type: [{
      id: String,
      title: String,
      content: String,
      relevanceScore: Number
    }],
    default: []
  },
  emergencyFlags: {
    type: [String],
    default: []
  },
  followUpNeeded: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

module.exports = mongoose.model('SymptomReport', symptomReportSchema);
