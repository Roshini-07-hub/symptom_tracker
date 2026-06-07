const classificationService = require('../services/classificationService');
const User = require('../models/User');
const AuditLog = require('../models/AuditLog');

/**
 * Classification Controller
 * Handles symptom classification and risk assessment
 */

/**
 * Classify symptoms
 */
exports.classifySymptoms = async (req, res) => {
  const startTime = Date.now();

  try {
    const { symptoms, severity, age, medicalHistory } = req.body;
    const userId = req.user.userId;

    if (!symptoms || !severity) {
      return res.status(400).json({
        success: false,
        message: 'Symptoms and severity are required'
      });
    }

    // Get user info if age not provided
    let userAge = age;
    let userHistory = medicalHistory;

    if (!age) {
      const user = await User.findById(userId);
      userAge = user.age;
      userHistory = user.medicalHistory;
    }

    // Classify symptoms
    const classification = classificationService.classifySymptoms(
      symptoms,
      severity,
      userAge,
      userHistory
    );

    // Get detailed rationale
    const rationale = classificationService.getClassificationRationale(
      classification.riskLevel,
      symptoms,
      severity
    );

    // Create audit log
    await AuditLog.create({
      userId,
      action: 'classification',
      userQuery: `${symptoms.join(', ')}`,
      riskClassification: classification.riskLevel,
      responseTime: Date.now() - startTime
    });

    res.json({
      success: true,
      data: {
        riskLevel: classification.riskLevel,
        score: classification.score,
        confidence: classification.confidence,
        reason: classification.reason,
        rationale,
        responseTime: Date.now() - startTime
      }
    });
  } catch (error) {
    console.error('Classification error:', error);
    res.status(500).json({
      success: false,
      message: 'Error classifying symptoms'
    });
  }
};

/**
 * Detect emergency symptoms
 */
exports.detectEmergency = async (req, res) => {
  try {
    const { symptoms, description } = req.body;
    const userId = req.user.userId;

    if (!symptoms || symptoms.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Symptoms are required'
      });
    }

    const emergencyFlags = classificationService.detectEmergency(
      symptoms,
      description || ''
    );

    if (emergencyFlags.length > 0) {
      await AuditLog.create({
        userId,
        action: 'classification',
        userQuery: `${symptoms.join(', ')}`,
        riskClassification: 'emergency',
        emergencyFlagsDetected: emergencyFlags
      });
    }

    res.json({
      success: true,
      data: {
        isEmergency: emergencyFlags.length > 0,
        emergencySymptoms: emergencyFlags,
        recommendation: emergencyFlags.length > 0 
          ? '🚨 SEEK IMMEDIATE EMERGENCY CARE - CALL 911 OR LOCAL EMERGENCY NUMBER'
          : 'No emergency symptoms detected'
      }
    });
  } catch (error) {
    console.error('Emergency detection error:', error);
    res.status(500).json({
      success: false,
      message: 'Error detecting emergency symptoms'
    });
  }
};
