import { useContext, createContext, useState } from 'react';

/**
 * Language Context
 * Manages multilingual support globally
 */

const LanguageContext = createContext(null);

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('language') || 'en';
  });

  const switchLanguage = (lang) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
  };

  const translations = {
    en: {
      // Navigation
      'nav.home': 'Home',
      'nav.chat': 'Symptom Checker',
      'nav.history': 'History',
      'nav.profile': 'Profile',
      'nav.reports': 'Medical Reports',
      'nav.logout': 'Logout',
      'nav.admin': 'Admin Dashboard',

      // Auth
      'auth.login': 'Login',
      'auth.register': 'Register',
      'auth.email': 'Email',
      'auth.password': 'Password',
      'auth.firstName': 'First Name',
      'auth.lastName': 'Last Name',
      'auth.age': 'Age',
      'auth.gender': 'Gender',
      'auth.signInTitle': 'Healthcare Triage AI',
      'auth.signInSubtitle': 'Sign in to your account',
      'auth.signInButton': 'Sign In',
      'auth.signingIn': 'Signing in...',
      'auth.needAccountPrefix': "Don't have an account?",
      'auth.registerHere': 'Register here',
      'auth.registerTitle': 'Healthcare Triage AI',
      'auth.registerSubtitle': 'Create your account',
      'auth.createAccountButton': 'Create Account',
      'auth.creatingAccount': 'Creating account...',
      'auth.haveAccountPrefix': 'Already have an account?',
      'auth.loginHere': 'Login here',
      'auth.loginFailed': 'Login failed',
      'auth.registrationFailed': 'Registration failed',
      'auth.gender.male': 'Male',
      'auth.gender.female': 'Female',
      'auth.gender.other': 'Other',

      // Chat
      'chat.pageTitle': 'Healthcare Symptom Checker',
      'chat.pageDescription': 'Get AI-powered health assessments based on your symptoms',
      'chat.welcome': 'Welcome, {name}',
      'chat.symptoms': 'Describe Your Symptoms',
      'chat.symptomPlaceholder': 'Enter a symptom and click Add',
      'chat.add': 'Add',
      'chat.severity': 'Severity',
      'chat.severity.mild': 'Mild',
      'chat.severity.moderate': 'Moderate',
      'chat.severity.severe': 'Severe',
      'chat.duration': 'Duration',
      'chat.durationPlaceholder': 'e.g., 2 days, 1 week',
      'chat.description': 'Additional Details',
      'chat.descriptionPlaceholder': 'Additional details about your symptoms',
      'chat.onsetDate': 'Onset Date',
      'chat.submit': 'Analyze Symptoms',
      'chat.loading': 'Analyzing your symptoms...',
      'chat.disclaimer': '⚠️ This assistant is not a substitute for professional medical advice. Always consult with a healthcare professional.',

      // Home
      'home.title': 'Healthcare Triage AI Assistant',
      'home.subtitle': 'Get instant, AI-powered health assessments. Not a medical diagnosis – a smart starting point for your health journey.',
      'home.start': 'Start Health Check',
      'home.features': 'Our Features',
      'home.feature.symptomChecker': 'AI Symptom Checker',
      'home.feature.symptomCheckerDesc': 'Get instant health assessments based on your symptoms using advanced AI',
      'home.feature.guidance': 'Professional Guidance',
      'home.feature.guidanceDesc': 'Receive evidence-based recommendations and guidance from medical knowledge',
      'home.feature.riskAssessment': 'Risk Assessment',
      'home.feature.riskAssessmentDesc': 'Automatic classification of health risks: Low, Moderate, High, Emergency',
      'home.feature.multilingual': 'Multilingual Support',
      'home.feature.multilingualDesc': 'Available in English, Hindi, and Telugu for accessibility',
      'home.disclaimerTitle': '⚠️ Important Disclaimer',
      'home.disclaimerLine1': 'This Healthcare Triage Assistant is NOT a substitute for professional medical advice, diagnosis, or treatment.',
      'home.disclaimerBullet1': 'Provide general health information',
      'home.disclaimerBullet2': 'Help you understand potential next steps',
      'home.disclaimerBullet3': 'Facilitate communication with healthcare professionals',
      'home.disclaimerLine2': 'Always consult with a qualified healthcare professional before making any medical decisions.',
      'home.disclaimerEmergency': 'In case of emergency symptoms, call 911 or your local emergency number immediately.',

      // Validation
      'validation.symptoms': 'At least one symptom is required',
      'validation.duration': 'Duration is required',
      'validation.onsetDate': 'Onset date is required',

      // File Upload
      'upload.title': 'Upload Medical Report',
      'upload.description': 'Upload PDF, DOC, DOCX, JPG, PNG, WEBP, HEIC, or HEIF files (Max 5MB)',
      'upload.selectFile': 'Select File',
      'upload.button': 'Upload',
      'upload.file_required': 'No file provided',
      'upload.file_too_large': 'File size exceeds maximum limit',
      'upload.invalid_format': 'Invalid file format. Only PDF, DOC, DOCX, JPG, PNG, WEBP, HEIC, or HEIF are allowed',
      'upload.success': 'File uploaded successfully',
      'upload.error': 'Error uploading file',

      // Reports
      'reports.title': 'Your Medical Reports',
      'reports.empty': 'No reports uploaded yet',

      // Confirmation
      'confirm.delete': 'Are you sure you want to delete this report?',
      'risk.low': 'Low Risk',
      'risk.moderate': 'Moderate Risk',
      'risk.high': 'High Risk',
      'risk.emergency': 'Emergency',

      // Results
      'result.emergencyAlert': 'EMERGENCY ALERT',
      'result.emergencySymptoms': 'Emergency symptoms detected:',
      'result.callEmergency': 'CALL EMERGENCY SERVICES (911) OR GO TO NEAREST EMERGENCY ROOM IMMEDIATELY',
      'result.riskAssessment': 'Risk Assessment:',
      'result.aiResponse': 'AI Response',
      'result.recommendation': 'Recommendation:',
      'result.followUp': 'Follow-up:',
      'result.timeline': 'Timeline:',
      'result.confidence': 'Confidence',

      // General
      'common.loading': 'Loading...',
      'common.error': 'An error occurred',
      'common.success': 'Success'
    },
    hi: {
      // Navigation
      'nav.home': 'होम',
      'nav.chat': 'लक्षण जांच',
      'nav.history': 'इतिहास',
      'nav.profile': 'प्रोफाइल',
      'nav.reports': 'चिकित्सा रिपोर्टें',
      'nav.logout': 'लॉगआउट',
      'nav.admin': 'एडमिन डैशबोर्ड',

      // Auth
      'auth.login': 'लॉगिन',
      'auth.register': 'पंजीकरण',
      'auth.email': 'ईमेल',
      'auth.password': 'पासवर्ड',
      'auth.firstName': 'पहला नाम',
      'auth.lastName': 'अंतिम नाम',
      'auth.age': 'उम्र',
      'auth.gender': 'लिंग',
      'auth.signInTitle': 'हेल्थकेयर ट्रायज एआई',
      'auth.signInSubtitle': 'अपने खाते में साइन इन करें',
      'auth.signInButton': 'साइन इन करें',
      'auth.signingIn': 'साइन किया जा रहा है...',
      'auth.needAccountPrefix': 'खाता नहीं है?',
      'auth.registerHere': 'यहाँ पंजीकरण करें',
      'auth.registerTitle': 'हेल्थकेयर ट्रायज एआई',
      'auth.registerSubtitle': 'अपना खाता बनाएं',
      'auth.createAccountButton': 'खाता बनाएं',
      'auth.creatingAccount': 'खाता बनाया जा रहा है...',
      'auth.haveAccountPrefix': 'पहले से ही खाता है?',
      'auth.loginHere': 'यहाँ लॉगिन करें',
      'auth.loginFailed': 'लॉगिन विफल हुआ',
      'auth.registrationFailed': 'पंजीकरण विफल रहा',
      'auth.gender.male': 'पुरुष',
      'auth.gender.female': 'महिला',
      'auth.gender.other': 'अन्य',

      // Chat
      'chat.pageTitle': 'हेल्थकेयर सिम्प्टम चेकर',
      'chat.pageDescription': 'अपने लक्षणों के आधार पर एआई-समर्थित स्वास्थ्य मूल्यांकन प्राप्त करें',
      'chat.welcome': 'स्वागत है, {name}',
      'chat.symptoms': 'अपने लक्षणों का वर्णन करें',
      'chat.symptomPlaceholder': 'एक लक्षण दर्ज करें और जोड़ें पर क्लिक करें',
      'chat.add': 'जोड़ें',
      'chat.severity': 'गंभीरता',
      'chat.severity.mild': 'हल्का',
      'chat.severity.moderate': 'मध्यम',
      'chat.severity.severe': 'गंभीर',
      'chat.duration': 'अवधि',
      'chat.durationPlaceholder': 'उदा., 2 दिन, 1 सप्ताह',
      'chat.description': 'अतिरिक्त विवरण',
      'chat.descriptionPlaceholder': 'अपने लक्षणों के बारे में अतिरिक्त जानकारी',
      'chat.onsetDate': 'आरंभ तिथि',
      'chat.submit': 'लक्षण विश्लेषण करें',
      'chat.loading': 'आपके लक्षणों का विश्लेषण किया जा रहा है...',
      'chat.disclaimer': '⚠️ यह सहायक व्यावसायिक चिकित्सीय सलाह का विकल्प नहीं है। हमेशा एक स्वास्थ्य सेवा पेशेवर से परामर्श लें।',

      // Home
      'home.title': 'हेल्थकेयर ट्रायज एआई असिस्टेंट',
      'home.subtitle': 'त्वरित, एआई-सक्षम स्वास्थ्य मूल्यांकन प्राप्त करें। यह एक मेडिकल निदान नहीं है – आपके स्वास्थ्य यात्रा के लिए एक स्मार्ट शुरुआत।',
      'home.start': 'स्वास्थ्य जांच शुरू करें',
      'home.features': 'हमारी विशेषताएँ',
      'home.feature.symptomChecker': 'एआई लक्षण चेकर',
      'home.feature.symptomCheckerDesc': 'उन्नत एआई का उपयोग करके अपने लक्षणों के आधार पर त्वरित स्वास्थ्य मूल्यांकन प्राप्त करें',
      'home.feature.guidance': 'पेशेवर मार्गदर्शन',
      'home.feature.guidanceDesc': 'चिकित्सा ज्ञान से आधारित अनुशंसाएं और मार्गदर्शन प्राप्त करें',
      'home.feature.riskAssessment': 'जोखिम आकलन',
      'home.feature.riskAssessmentDesc': 'स्वास्थ्य जोखिमों का स्वचालित वर्गीकरण: कम, मध्यम, उच्च, आपातकाल',
      'home.feature.multilingual': 'बहुभाषी समर्थन',
      'home.feature.multilingualDesc': 'पहुंच के लिए अंग्रेजी, हिंदी, और तेलुगु में उपलब्ध',
      'home.disclaimerTitle': '⚠️ महत्वपूर्ण अस्वीकृति',
      'home.disclaimerLine1': 'यह हेल्थकेयर ट्रायज असिस्टेंट पेशेवर चिकित्सा सलाह, निदान या उपचार का विकल्प नहीं है।',
      'home.disclaimerBullet1': 'सामान्य स्वास्थ्य जानकारी प्रदान करना',
      'home.disclaimerBullet2': 'संभावित अगले कदमों को समझने में मदद करना',
      'home.disclaimerBullet3': 'चिकित्सा पेशेवरों के साथ संवाद को सुविधाजनक बनाना',
      'home.disclaimerLine2': 'किसी भी चिकित्सा निर्णय से पहले हमेशा एक योग्य स्वास्थ्य सेवा पेशेवर से परामर्श लें।',
      'home.disclaimerEmergency': 'आपात स्थिति के लक्षणों के मामले में, तुरंत 911 या अपने स्थानीय आपातकालीन नंबर पर कॉल करें।',

      // Validation
      'validation.symptoms': 'कम से कम एक लक्षण आवश्यक है',
      'validation.duration': 'अवधि आवश्यक है',
      'validation.onsetDate': 'आरंभ तिथि आवश्यक है',

      // File Upload
      'upload.title': 'चिकित्सा रिपोर्ट अपलोड करें',
      'upload.description': 'PDF, DOC, या DOCX फाइलें अपलोड करें (अधिकतम 5MB)',
      'upload.selectFile': 'फाइल चुनें',
      'upload.button': 'अपलोड करें',
      'upload.file_required': 'कोई फाइल प्रदान नहीं की गई',
      'upload.file_too_large': 'फाइल आकार अधिकतम सीमा से अधिक है',
      'upload.invalid_format': 'अमान्य फाइल प्रारूप। केवल PDF, DOC, DOCX की अनुमति है',
      'upload.success': 'फाइल सफलतापूर्वक अपलोड की गई',
      'upload.error': 'फाइल अपलोड करने में त्रुटि',

      // Reports
      'reports.title': 'आपकी चिकित्सा रिपोर्टें',
      'reports.empty': 'अभी तक कोई रिपोर्ट अपलोड नहीं की गई',

      // Confirmation
      'confirm.delete': 'क्या आप इस रिपोर्ट को हटाना चाहते हैं?',
      'risk.low': 'कम जोखिम',
      'risk.moderate': 'मध्यम जोखिम',
      'risk.high': 'उच्च जोखिम',
      'risk.emergency': 'आपातकाल',

      // Results
      'result.emergencyAlert': 'आपातकालीन चेतावनी',
      'result.emergencySymptoms': 'आपातकालीन संकेत पाए गए:',
      'result.callEmergency': 'तुरंत 911 या निकटतम इमरजेंसी रूम को कॉल करें',
      'result.riskAssessment': 'जोखिम आकलन:',
      'result.aiResponse': 'एआई प्रतिक्रिया',
      'result.recommendation': 'सिफारिश:',
      'result.followUp': 'अनुवर्ती:',
      'result.timeline': 'समय सीमा:',
      'result.confidence': 'विश्वास',

      // General
      'common.loading': 'लोड हो रहा है...',
      'common.error': 'एक त्रुटि हुई',
      'common.success': 'सफल'
    },
    te: {
      // Navigation
      'nav.home': 'హోమ్',
      'nav.chat': 'సిమ్‌టమ్ చెక్కర్',
      'nav.history': 'చరిత్ర',
      'nav.profile': 'ప్రొఫైల్',
      'nav.reports': 'వైద్య నివేదనలు',
      'nav.logout': 'లాగ్‌అవుట్',
      'nav.admin': 'నిర్వాహక డ్యాష్‌బోర్డ్',

      // Auth
      'auth.login': 'లాగిన్',
      'auth.register': 'రిజిస్టర్',
      'auth.email': 'ఇమెయిల్',
      'auth.password': 'పాస్‌వర్డ్',
      'auth.firstName': 'మొదటి పేరు',
      'auth.lastName': 'చివరి పేరు',
      'auth.age': 'వయస్సు',
      'auth.gender': 'లింగం',
      'auth.signInTitle': 'హెల్త్‌కేర్ ట్రయ్యాజ్ ఏఐ',
      'auth.signInSubtitle': 'మీ ఖాతాలో సైన్ ఇన్ చేయండి',
      'auth.signInButton': 'సైన్ ఇన్',
      'auth.signingIn': 'సైన్ ఇన్ అవుతోంది...',
      'auth.needAccountPrefix': 'ఖాతా లేదు?',
      'auth.registerHere': 'ఇక్కడ రిజిస్టర్ చేయండి',
      'auth.registerTitle': 'హెల్త్‌కేర్ ట్రయ్యాజ్ ఏఐ',
      'auth.registerSubtitle': 'మీ ఖాతాను సృష్టించండి',
      'auth.createAccountButton': 'ఖాతా సృష్టించండి',
      'auth.creatingAccount': 'ఖాతా సృష్టించబడుతోంది...',
      'auth.haveAccountPrefix': 'ఇప్పటికే ఖాతా ఉందా?',
      'auth.loginHere': 'ఇక్కడ లాగిన్ చేయండి',
      'auth.loginFailed': 'లాగిన్ విఫలమయ్యింది',
      'auth.registrationFailed': 'రిజిస్ట్రేషన్ విఫలమయ్యింది',
      'auth.gender.male': 'పురుషుడు',
      'auth.gender.female': 'ఆమె',
      'auth.gender.other': 'ఇతరులు',

      // Chat
      'chat.pageTitle': 'హెల్త్‌కేర్ సిమ్‌టమ్ చెకర్',
      'chat.pageDescription': 'మీ లక్షణాల ఆధారంగా AI-సహాయంతో ఆరోగ్య అంచనాలు పొందండి',
      'chat.welcome': 'స్వాగతం, {name}',
      'chat.symptoms': 'మీ లక్షణాలను వివరించండి',
      'chat.symptomPlaceholder': 'ఒక లక్షణాన్ని నమోదు చేసి జోడించు క్లిక్ చేయండి',
      'chat.add': 'జోడించు',
      'chat.severity': 'తీవ్రత',
      'chat.severity.mild': 'తేలిక',
      'chat.severity.moderate': 'సుమారు',
      'chat.severity.severe': 'గంభీరం',
      'chat.duration': 'వ్యవధి',
      'chat.durationPlaceholder': 'ఉదా., 2 రోజులు, 1 వారం',
      'chat.description': 'అదనపు వివరాలు',
      'chat.descriptionPlaceholder': 'మీ లక్షణాల గురించి అదనపు వివరాలు',
      'chat.onsetDate': 'ప్రారంభ తేదీ',
      'chat.submit': 'లక్షణాలను విశ్లేషించండి',
      'chat.loading': 'మీ లక్షణాలను విశ్లేషించుకుంటోంది...',
      'chat.disclaimer': '⚠️ ఇది ఒక ప్రొఫెషనల్ వైద్య సలహాకు ప్రత్యామ్నాయం కాదు. ఎప్పుడూ ఒక ఆరోగ్య నిర్వాహకుడిని సంప్రదించండి.',

      // Home
      'home.title': 'హెల్త్‌కేర్ ట్రయ్యాజ్ ఏఐ అసిస్టెంట్',
      'home.subtitle': 'క్షణిక, AI-ఆధారిత ఆరోగ్య అంచనాలు పొందండి. ఇది వైద్య నిర్ధారణ కాదు – మీ ఆరోగ్య ప్రయాణానికి ఒక తెలివైన ప్రారంభం.',
      'home.start': 'ఆరోగ్య తనిఖీ ప్రారంభించండి',
      'home.features': 'మా లక్షణాలు',
      'home.feature.symptomChecker': 'AI సిమ్‌టమ్ చెకర్',
      'home.feature.symptomCheckerDesc': 'మీ లక్షణాల ఆధారంగా అదనపు AI ఉపయోగించి తక్షణ ఆరోగ్య అంచనాలు పొందండి',
      'home.feature.guidance': 'వ్యవసాయ మార్గదర్శనం',
      'home.feature.guidanceDesc': 'చికిత్సా జ్ఞానంలోని ఆధారిత సిఫారసులు మరియు మార్గదర్శకత్వం పొందండి',
      'home.feature.riskAssessment': 'రిస్క్ అసెస్‌మెంట్',
      'home.feature.riskAssessmentDesc': 'ఆరోగ్య ప్రమాదాలను ఆటోమేటిక్‌గా వర్గీకరణ చేయండి: తక్కువ, మధ్యం, ఎక్కువ, అత్యవసర',
      'home.feature.multilingual': 'బహుభాషా మద్దతు',
      'home.feature.multilingualDesc': 'అభ్యాసం కోసం ఆంగ్లం, హిందీ, మరియు తెలుగు లో అందుబాటులో ఉంది',
      'home.disclaimerTitle': '⚠️ ముఖ్య అంశం',
      'home.disclaimerLine1': 'ఈ హెల్త్‌కేర్ ట్రయ్యాజ్ అసిస్టెంట్ ప్రొఫెషనల్ వైద్య సలహా, నిర్ధారణ లేదా చికిత్సకు ప్రత్యామ్నాయం కాదు.',
      'home.disclaimerBullet1': 'సాధారణ ఆరోగ్య సమాచారాన్ని అందించండి',
      'home.disclaimerBullet2': 'సాధ్యమైన తదుపరి చర్యలను అర్థం చేసుకోడానికి మీకు సహాయం చేయండి',
      'home.disclaimerBullet3': 'ఆరోగ్య సంరక్షణ నిపుణులతో సంభాషణను సులభతరం చేయండి',
      'home.disclaimerLine2': 'ఏ వైద్య నిర్ణయం తీసుకునే ముందు ఎప్పుడూ అర్హత గల ఆరోగ్య సేవా నిపుణుడిని సంప్రదించండి.',
      'home.disclaimerEmergency': 'అత్యవసర లక్షణాల సందర్భంలో, వెంటనే 911 లేదా మీ స్థానిక అత్యవసర నంబర్ కి కాల్ చేయండి.',

      // Validation
      'validation.symptoms': 'గనక ఒక లక్షణం అవసరం',
      'validation.duration': 'వ్యవధి అవసరం',
      'validation.onsetDate': 'ప్రారంభ తేదీ అవసరం',

      // File Upload
      'upload.title': 'వైద్య నివేదన అపలోడ్ చేయండి',
      'upload.description': 'PDF, DOC, లేదా DOCX ఫైల్‌లను అపలోడ్ చేయండి (గరిష్ట 5MB)',
      'upload.selectFile': 'ఫైల్ ఎంచుకోండి',
      'upload.button': 'అపలోడ్',
      'upload.file_required': 'ఫైల్ అందించబడలేదు',
      'upload.file_too_large': 'ఫైల్ సైజ్ గరిష్ట పరిమితిని మించిపోయింది',
      'upload.invalid_format': 'చెల్లని ఫైల్ ఫార్మాట్. PDF, DOC, DOCX మాత్రమే అనుమతించబడతాయి',
      'upload.success': 'ఫైల్ విజయవంతంగా అపలోడ్ చేయబడింది',
      'upload.error': 'ఫైల్ అపలోడ్‌లో ఎర్రర్',

      // Reports
      'reports.title': 'మీ వైద్య నివేదనలు',
      'reports.empty': 'ఇంకా ఎటువంటి నివేదనలు అపలోడ్ చేయబడలేదు',

      // Confirmation
      'confirm.delete': 'మీరు ఈ నివేదనను తొలగించాలనుకుంటున్నారా?',
      'risk.low': 'తక్కువ ప్రమాదం',
      'risk.moderate': 'మధ్యమ ప్రమాదం',
      'risk.high': 'అధిక ప్రమాదం',
      'risk.emergency': 'అత్యవసర',

      // Results
      'result.emergencyAlert': 'అత్యవసర హెచ్చరిక',
      'result.emergencySymptoms': 'అత్యవసర లక్షణాలు గుర్తించబడ్డాయి:',
      'result.callEmergency': 'త్వరగా 911 లేదా అత్యవసర గదికి కాల్ చేయండి',
      'result.riskAssessment': 'ప్రమాద మదింపు:',
      'result.aiResponse': 'AI ప్రతిస్పందన',
      'result.recommendation': 'సిఫార్సు:',
      'result.followUp': 'ఫాలో-అప్:',
      'result.timeline': 'సమయపట్టిక:',
      'result.confidence': 'నమ్మకం',

      // General
      'common.loading': 'లోడ్ అవుతోంది...',
      'common.error': 'లోపం ఉంది',
      'common.success': 'విజయం'
    }
  };

  const t = (key) => {
    return translations[language]?.[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, switchLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};
