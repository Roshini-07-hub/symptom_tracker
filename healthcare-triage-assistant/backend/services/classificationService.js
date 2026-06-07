const { detectEmergencySymptoms, EMERGENCY_KEYWORDS } = require('../utils/helpers');

/**
 * Classification Service
 * Classifies symptoms into risk levels (Low, Moderate, High, Emergency)
 */

/**
 * Classify user symptoms into risk levels
 */
const classifySymptoms = (symptoms, severity, age, medicalHistory = [], emergencyFlags = []) => {
  // Emergency detection takes highest priority
  if (emergencyFlags.length > 0) {
    return {
      riskLevel: 'emergency',
      confidence: 0.95,
      reason: 'Emergency symptoms detected'
    };
  }

  let score = 0;

  // Severity scoring
  const severityScores = { mild: 1, moderate: 2, severe: 3 };
  score += severityScores[severity] || 0;

  // Age-related risk (very young or elderly)
  if (age < 5 || age > 75) {
    score += 1;
  }

  // Check for high-risk symptom combinations
  const symptomText = symptoms.join(' ').toLowerCase();
  const highRiskPatterns = [
    /chest|heart|cardiac/,
    /breathing|respiratory|lung/,
    /neurological|seizure|stroke/,
    /fever.*severe|high.*fever/
  ];

  const matchingPatterns = highRiskPatterns.filter(pattern => 
    pattern.test(symptomText)
  ).length;

  score += matchingPatterns;

  // Medical history risk
  const riskyConditions = ['diabetes', 'heart', 'cancer', 'immunocompromised'];
  const riskyHistoryCount = medicalHistory.filter(condition =>
    riskyConditions.some(risk => condition.toLowerCase().includes(risk))
  ).length;

  score += riskyHistoryCount * 0.5;

  // Determine risk level
  let riskLevel = 'low';
  let reason = 'Symptoms appear manageable with self-care';

  if (score >= 5) {
    riskLevel = 'high';
    reason = 'Symptoms warrant immediate medical consultation';
  } else if (score >= 3) {
    riskLevel = 'moderate';
    reason = 'Symptoms suggest need for medical evaluation';
  }

  return {
    riskLevel,
    score,
    confidence: Math.min(score / 5, 1),
    reason
  };
};

/**
 * Detect emergency symptoms
 */
const detectEmergency = (symptoms, description) => {
  return detectEmergencySymptoms(symptoms, description);
};

/**
 * Get detailed classification rationale
 */
const getClassificationRationale = (classification, symptoms, severity) => {
  const rationales = {
    emergency: `EMERGENCY ALERT: Severe symptoms detected - ${symptoms.join(', ')}. Seek immediate emergency services.`,
    high: `High Risk: Multiple concerning symptoms detected. Recommend immediate doctor consultation or specialist referral.`,
    moderate: `Moderate Risk: Symptoms warrant medical evaluation. Schedule doctor appointment within 24-48 hours.`,
    low: `Low Risk: Symptoms appear manageable. Continue self-care and monitor. Consult doctor if symptoms worsen.`
  };

  return rationales[classification] || rationales['low'];
};

module.exports = {
  classifySymptoms,
  detectEmergency,
  getClassificationRationale
};
