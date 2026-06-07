const { generateRecommendation } = require('../services/recommendationService');
const User = require('../models/User');
const AuditLog = require('../models/AuditLog');

/**
 * Recommendation Controller
 * Handles recommendation generation based on risk classification
 */

/**
 * Generate recommendation
 */
exports.generateRecommendation = async (req, res) => {
  const startTime = Date.now();

  try {
    const { riskLevel, symptoms, severity, language } = req.body;
    const userId = req.user.userId;

    if (!riskLevel || !symptoms) {
      return res.status(400).json({
        success: false,
        message: 'Risk level and symptoms are required'
      });
    }

    if (!['low', 'moderate', 'high', 'emergency'].includes(riskLevel)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid risk level'
      });
    }

    // Get user info
    const user = await User.findById(userId);

    // Generate recommendation
    const recommendation = generateRecommendation(
      riskLevel,
      symptoms,
      severity || 'moderate',
      user.age,
      user.medicalHistory,
      language || 'en'
    );

    // Create audit log
    await AuditLog.create({
      userId,
      action: 'recommendation',
      userQuery: `${symptoms.join(', ')}`,
      riskClassification: riskLevel,
      recommendation: recommendation.type,
      responseTime: Date.now() - startTime
    });

    res.json({
      success: true,
      data: {
        type: recommendation.type,
        primary: recommendation.primary,
        actions: recommendation.actions,
        followUp: recommendation.followUp,
        timeframe: recommendation.timeframe,
        ...(recommendation.warning && { warning: recommendation.warning }),
        ...(recommendation.severity && { severity: recommendation.severity }),
        ...(recommendation.alternativeForElders && { alternativeForElders: recommendation.alternativeForElders })
      }
    });
  } catch (error) {
    console.error('Recommendation generation error:', error);
    res.status(500).json({
      success: false,
      message: 'Error generating recommendation'
    });
  }
};
