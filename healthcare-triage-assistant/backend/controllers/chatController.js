const SymptomReport = require('../models/SymptomReport');
const AuditLog = require('../models/AuditLog');
const { detectEmergencySymptoms } = require('../utils/helpers');
const ragService = require('../services/ragService');
const classificationService = require('../services/classificationService');
const { generateRecommendation } = require('../services/recommendationService');
const User = require('../models/User');

/**
 * Chat/Symptom Intake Controller
 * Handles symptom intake and chat-based interactions
 */

/**
 * Process symptom intake
 */
exports.intakeSymptoms = async (req, res) => {
  const startTime = Date.now();

  try {
    const { symptoms, severity, duration, onsetDate, description } = req.validatedData;
    const userId = req.user.userId;
    const userLanguage = req.body.language || 'en';

    // Get user for medical history
    const user = await User.findById(userId);

    // Detect emergency symptoms
    const emergencyFlags = detectEmergencySymptoms(symptoms, description);

    // Classify symptoms
    const classification = classificationService.classifySymptoms(
      symptoms,
      severity,
      user.age,
      user.medicalHistory,
      emergencyFlags
    );

    // Search for relevant medical documents
    const symptomsQuery = symptoms.join(' ');
    let retrievedDocuments = [];
    try {
      retrievedDocuments = await ragService.searchDocuments(symptomsQuery, 5, userLanguage);
    } catch (err) {
      console.log('RAG search failed, continuing without context:', err.message);
    }

    // Generate AI response with context
    let aiResponse = '';
    let disclaimer = '';
    try {
      if (retrievedDocuments.length > 0) {
        const contextResponse = await ragService.generateContextAwareResponse(
          symptomsQuery,
          retrievedDocuments,
          userLanguage
        );
        aiResponse = contextResponse.response;
        disclaimer = contextResponse.disclaimer;
      } else {
        aiResponse = `Based on your symptoms: ${symptoms.join(', ')}. Please consult a healthcare professional for proper diagnosis.`;
        disclaimer = ragService.getDisclaimer(userLanguage);
      }
    } catch (err) {
      console.log('AI generation failed, using fallback:', err.message);
      aiResponse = `Your symptoms require medical evaluation. Please contact a healthcare professional.`;
      disclaimer = ragService.getDisclaimer(userLanguage);
    }

    // Get recommendation
    const recommendationData = generateRecommendation(
      classification.riskLevel,
      symptoms,
      severity,
      user.age,
      user.medicalHistory,
      userLanguage
    );

    // Create symptom report
    const report = await SymptomReport.create({
      userId,
      symptoms,
      severity,
      duration,
      onsetDate,
      description,
      riskLevel: classification.riskLevel,
      recommendation: recommendationData.type,
      aiResponse,
      retrievedDocuments,
      emergencyFlags
    });

    // Create audit log
    await AuditLog.create({
      userId,
      action: 'symptom-intake',
      userQuery: `${symptoms.join(', ')} - ${description}`,
      retrievedDocuments: retrievedDocuments.map(d => ({
        id: d.id,
        title: d.title,
        relevanceScore: d.relevanceScore
      })),
      aiResponse,
      riskClassification: classification.riskLevel,
      recommendation: recommendationData.type,
      emergencyFlagsDetected: emergencyFlags,
      responseTime: Date.now() - startTime,
      ipAddress: req.ip,
      userAgent: req.get('user-agent')
    });

    res.json({
      success: true,
      message: 'Symptoms processed successfully',
      data: {
        report: {
          id: report._id,
          riskLevel: classification.riskLevel,
          confidence: classification.confidence,
          reason: classification.reason
        },
        aiResponse,
        disclaimer,
        recommendation: recommendationData,
        emergencyAlert: emergencyFlags.length > 0,
        emergencySymptoms: emergencyFlags
      }
    });
  } catch (error) {
    console.error('Symptom intake error:', error);
    res.status(500).json({
      success: false,
      message: 'Error processing symptoms'
    });
  }
};

/**
 * Get user's symptom history
 */
exports.getHistory = async (req, res) => {
  try {
    const userId = req.user.userId;
    const limit = parseInt(req.query.limit) || 10;
    const skip = parseInt(req.query.skip) || 0;

    const reports = await SymptomReport.find({ userId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip);

    const total = await SymptomReport.countDocuments({ userId });

    res.json({
      success: true,
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
    console.error('Get history error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching symptom history'
    });
  }
};

/**
 * Get specific symptom report
 */
exports.getReport = async (req, res) => {
  try {
    const { reportId } = req.params;
    const userId = req.user.userId;

    const report = await SymptomReport.findOne({ _id: reportId, userId });

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found'
      });
    }

    res.json({
      success: true,
      data: report
    });
  } catch (error) {
    console.error('Get report error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching report'
    });
  }
};
