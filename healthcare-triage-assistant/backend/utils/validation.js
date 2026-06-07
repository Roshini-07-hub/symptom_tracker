const Joi = require('joi');

/**
 * Validation schemas for API inputs
 */

const registerSchema = Joi.object({
  firstName: Joi.string().required().min(2).max(50),
  lastName: Joi.string().required().min(2).max(50),
  email: Joi.string().email().required(),
  password: Joi.string().required().min(6).max(50),
  age: Joi.number().min(1).max(150),
  gender: Joi.string().valid('male', 'female', 'other'),
  medicalHistory: Joi.array().items(Joi.string()),
  allergies: Joi.array().items(Joi.string())
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

const symptomIntakeSchema = Joi.object({
  symptoms: Joi.array().items(Joi.string()).required().min(1),
  severity: Joi.string().valid('mild', 'moderate', 'severe').required(),
  duration: Joi.string().required(),
  onsetDate: Joi.date().required(),
  description: Joi.string().allow('')
});

const documentUploadSchema = Joi.object({
  title: Joi.string().required().min(3).max(200),
  category: Joi.string().valid('condition', 'symptom', 'treatment', 'prevention', 'diagnosis', 'general').required(),
  tags: Joi.array().items(Joi.string()),
  language: Joi.string().valid('en', 'hi', 'te').default('en')
});

/**
 * Validate request data
 */
const validate = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      const messages = error.details.map(d => d.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: messages
      });
    }

    req.validatedData = value;
    next();
  };
};

module.exports = {
  validate,
  registerSchema,
  loginSchema,
  symptomIntakeSchema,
  documentUploadSchema
};
