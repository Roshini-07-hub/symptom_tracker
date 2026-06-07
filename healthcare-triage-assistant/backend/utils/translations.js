/**
 * Translation Utility
 * Provides multilingual support for backend messages
 */

const translations = {
  en: {
    // Validation
    'validation.symptoms_required': 'Symptoms and severity are required',
    'validation.risk_level_invalid': 'Invalid risk level',
    'validation.symptoms_array_required': 'Symptoms are required',
    'validation.email_required': 'Email is required',
    'validation.password_required': 'Password is required',
    
    // Auth
    'auth.registration_successful': 'Registration successful',
    'auth.login_successful': 'Login successful',
    'auth.invalid_credentials': 'Invalid email or password',
    'auth.user_not_found': 'User not found',
    'auth.email_exists': 'Email already registered',
    'auth.token_invalid': 'Invalid or expired token',
    
    // File Upload
    'upload.file_required': 'No file provided',
    'upload.file_too_large': 'File size exceeds maximum limit',
    'upload.invalid_format': 'Invalid file format. Only PDF, DOC, DOCX, JPG, PNG, WEBP, HEIC, or HEIF are allowed',
    'upload.success': 'File uploaded successfully',
    'upload.error': 'Error uploading file',
    'upload.not_found': 'File not found',
    
    // Documents
    'documents.search_successful': 'Documents retrieved successfully',
    'documents.upload_successful': 'Document uploaded successfully',
    'documents.delete_successful': 'Document deleted successfully',
    'documents.not_found': 'Document not found',
    
    // Classification
    'classify.success': 'Symptoms classified successfully',
    'classify.emergency_detected': 'Emergency symptoms detected',
    
    // Recommendations
    'recommend.success': 'Recommendation generated successfully',
    
    // Errors
    'error.server': 'Internal server error',
    'error.unauthorized': 'Unauthorized access',
    'error.forbidden': 'Forbidden',
    'error.not_found': 'Resource not found'
  },
  
  hi: {
    // Validation
    'validation.symptoms_required': 'लक्षण और गंभीरता आवश्यक हैं',
    'validation.risk_level_invalid': 'अमान्य जोखिम स्तर',
    'validation.symptoms_array_required': 'लक्षण आवश्यक हैं',
    'validation.email_required': 'ईमेल आवश्यक है',
    'validation.password_required': 'पासवर्ड आवश्यक है',
    
    // Auth
    'auth.registration_successful': 'पंजीकरण सफल',
    'auth.login_successful': 'लॉगिन सफल',
    'auth.invalid_credentials': 'अमान्य ईमेल या पासवर्ड',
    'auth.user_not_found': 'उपयोगकर्ता नहीं मिला',
    'auth.email_exists': 'ईमेल पहले से पंजीकृत है',
    'auth.token_invalid': 'अमान्य या समाप्त टोकन',
    
    // File Upload
    'upload.file_required': 'कोई फाइल प्रदान नहीं की गई',
    'upload.file_too_large': 'फाइल आकार अधिकतम सीमा से अधिक है',
    'upload.invalid_format': 'अमान्य फाइल प्रारूप। केवल PDF, DOC, DOCX की अनुमति है',
    'upload.success': 'फाइल सफलतापूर्वक अपलोड की गई',
    'upload.error': 'फाइल अपलोड करने में त्रुटि',
    'upload.not_found': 'फाइल नहीं मिली',
    
    // Documents
    'documents.search_successful': 'दस्तावेज सफलतापूर्वक प्राप्त',
    'documents.upload_successful': 'दस्तावेज सफलतापूर्वक अपलोड',
    'documents.delete_successful': 'दस्तावेज सफलतापूर्वक हटाया गया',
    'documents.not_found': 'दस्तावेज नहीं मिला',
    
    // Classification
    'classify.success': 'लक्षण सफलतापूर्वक वर्गीकृत',
    'classify.emergency_detected': 'आपातकालीन लक्षण का पता चला',
    
    // Recommendations
    'recommend.success': 'सिफारिश सफलतापूर्वक उत्पन्न',
    
    // Errors
    'error.server': 'आंतरिक सर्वर त्रुटि',
    'error.unauthorized': 'अनुमति नहीं है',
    'error.forbidden': 'निषिद्ध',
    'error.not_found': 'संसाधन नहीं मिला'
  },
  
  te: {
    // Validation
    'validation.symptoms_required': 'లక్షణాలు మరియు తీవ్రత అవసరం',
    'validation.risk_level_invalid': 'చెల్లని ప్రమాద స్థాయి',
    'validation.symptoms_array_required': 'లక్షణాలు అవసరం',
    'validation.email_required': 'ఇమెయిల్ అవసరం',
    'validation.password_required': 'పాస్‌వర్డ్ అవసరం',
    
    // Auth
    'auth.registration_successful': 'నిబంధన విజయవంతం',
    'auth.login_successful': 'లాగిన్ విజయవంతం',
    'auth.invalid_credentials': 'చెల్లని ఇమెయిల్ లేదా పాస్‌వర్డ్',
    'auth.user_not_found': 'వినియోగదారు కనుగొనబడలేదు',
    'auth.email_exists': 'ఇమెయిల్ ఇప్పటికే నిబంధనం చేయబడింది',
    'auth.token_invalid': 'చెల్లని లేదా సమయం ముగిసిన టోకెన్',
    
    // File Upload
    'upload.file_required': 'ఫైల్ అందించబడలేదు',
    'upload.file_too_large': 'ఫైల్ సైజ్ గరిష్ట పరిమితిని మించిపోయింది',
    'upload.invalid_format': 'చెల్లని ఫైల్ ఫార్మాట్. PDF, DOC, DOCX మాత్రమే అనుమతించబడతాయి',
    'upload.success': 'ఫైల్ విజయవంతంగా అపలోడ్ చేయబడింది',
    'upload.error': 'ఫైల్ అపలోడ్‌లో ఎర్రర్',
    'upload.not_found': 'ఫైల్ కనుగొనబడలేదు',
    
    // Documents
    'documents.search_successful': 'డాక్యుమెంట్‌లు విజయవంతంగా పొందబడ్డాయి',
    'documents.upload_successful': 'డాక్యుమెంట్ విజయవంతంగా అపలోడ్ చేయబడింది',
    'documents.delete_successful': 'డాక్యుమెంట్ విజయవంతంగా తొలగించబడింది',
    'documents.not_found': 'డాక్యుమెంట్ కనుగొనబడలేదు',
    
    // Classification
    'classify.success': 'లక్షణాలు విజయవంతంగా వర్గీకరించబడ్డాయి',
    'classify.emergency_detected': 'అత్యవసర లక్షణాలు గుర్తించబడ్డాయి',
    
    // Recommendations
    'recommend.success': 'సిఫారిసు విజయవంతంగా ఉత్పత్తి చేయబడింది',
    
    // Errors
    'error.server': 'అంతర్గత సర్వర్ ఎర్రర్',
    'error.unauthorized': 'అనుమతి లేదు',
    'error.forbidden': 'నిషేధించబడింది',
    'error.not_found': 'సంస్థ కనుగొనబడలేదు'
  }
};

/**
 * Get translated message
 * @param {string} key - Translation key
 * @param {string} language - Language code (en, hi, te)
 * @returns {string} Translated message
 */
const t = (key, language = 'en') => {
  return translations[language]?.[key] || translations['en'][key] || key;
};

module.exports = {
  t,
  translations
};
