const jwt = require('jsonwebtoken');

/**
 * Generate JWT Token
 */
const generateToken = (userId, isAdmin = false) => {
  return jwt.sign(
    { userId, isAdmin },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  );
};

/**
 * Validate email format
 */
const isValidEmail = (email) => {
  const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
  return emailRegex.test(email);
};

/**
 * Emergency keywords that should trigger immediate warning
 */
const EMERGENCY_KEYWORDS = [
  'chest pain',
  'difficulty breathing',
  'unable to breathe',
  'shortness of breath',
  'stroke',
  'severe bleeding',
  'loss of consciousness',
  'sudden weakness',
  'slurred speech',
  'facial drooping',
  'severe headache',
  'sudden vision loss',
  'severe dizziness',
  'choking',
  'poisoning',
  'overdose',
  'anaphylaxis',
  'severe allergic',
  'unconscious',
  'heart attack'
];

/**
 * Detect emergency symptoms
 */
const detectEmergencySymptoms = (symptoms, description) => {
  const text = `${symptoms.join(' ')} ${description}`.toLowerCase();
  const detected = [];

  EMERGENCY_KEYWORDS.forEach(keyword => {
    if (text.includes(keyword)) {
      detected.push(keyword);
    }
  });

  return detected;
};

/**
 * Calculate risk level based on symptoms and metadata
 */
const calculateRiskLevel = (symptoms, severity, emergencyFlags) => {
  if (emergencyFlags.length > 0) {
    return 'emergency';
  }

  const severeSymptoms = symbols.filter(s => 
    ['pneumonia', 'meningitis', 'sepsis', 'severe', 'critical'].some(word => 
      s.toLowerCase().includes(word)
    )
  ).length;

  if (severity === 'severe' && severeSymptoms > 0) {
    return 'high';
  }
  if (severity === 'severe' || severeSymptoms > 2) {
    return 'moderate';
  }
  return 'low';
};

module.exports = {
  generateToken,
  isValidEmail,
  detectEmergencySymptoms,
  calculateRiskLevel,
  EMERGENCY_KEYWORDS
};
