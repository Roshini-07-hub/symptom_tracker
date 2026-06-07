/**
 * Recommendation Service
 * Generates health recommendations based on symptom classification
 */

/**
 * Generate recommendations based on risk level and symptoms
 */
const generateRecommendation = (riskLevel, symptoms, severity, age, medicalHistory = [], language = 'en') => {
  const recommendations = {
    low: generateLowRiskRecommendation(symptoms, language),
    moderate: generateModerateRiskRecommendation(symptoms, age, language),
    high: generateHighRiskRecommendation(symptoms, language),
    emergency: generateEmergencyRecommendation(language)
  };

  return recommendations[riskLevel] || recommendations['low'];
};

/**
 * Low risk recommendation
 */
const generateLowRiskRecommendation = (symptoms, language = 'en') => {
  const recommendations = {
    en: {
      type: 'self-care',
      primary: 'Self-care at home',
      actions: [
        'Rest and get adequate sleep',
        'Stay hydrated - drink plenty of water',
        'Monitor symptoms for any changes',
        'Use over-the-counter remedies if appropriate',
        'Consider dietary adjustments'
      ],
      followUp: 'Contact your doctor if symptoms persist beyond 7 days or worsen',
      timeframe: 'Review in 7 days'
    },
    hi: {
      type: 'self-care',
      primary: 'घर पर आत्म-देखभाल',
      actions: [
        'आराम करें और पर्याप्त नींद लें',
        'हाइड्रेटेड रहें - बहुत पानी पिएं',
        'लक्षणों में किसी भी परिवर्तन पर निगाह रखें',
        'यदि उपयुक्त हो तो ओवर-द-काउंटर उपचार का उपयोग करें',
        'आहार समायोजन पर विचार करें'
      ],
      followUp: 'यदि लक्षण 7 दिनों से अधिक बने रहते हैं या बिगड़ते हैं तो अपने डॉक्टर से संपर्क करें',
      timeframe: '7 दिनों में समीक्षा करें'
    },
    te: {
      type: 'self-care',
      primary: 'ఇంట్లో స్వీయ-సంరక్షణ',
      actions: [
        'విశ్రాంతి తీసుకోండి మరియు తగినంత నిద్ర పొందండి',
        'హైడ్రేటెడ్ ఉండండి - చాలా నీరు తాగండి',
        'లక్షణాల్లో ఏవైనా మార్పులను పర్యవేక్షించండి',
        'తగినట్లయితే ఓవర్-ది-కౌంటర్ నివారణలను ఉపయోగించండి',
        'ఆహారం సమన్వయాన్ని పరిగణించండి'
      ],
      followUp: 'లక్షణాలు 7 రోజులకు మించి ఉండితే లేదా తీవ్రమైతే మీ డాక్టర్‌ను సంప్రదించండి',
      timeframe: '7 రోజులలో సమీక్ష'
    }
  };

  return recommendations[language] || recommendations['en'];
};

/**
 * Moderate risk recommendation
 */
const generateModerateRiskRecommendation = (symptoms, age, language = 'en') => {
  const recommendations = {
    en: {
      type: 'doctor-consultation',
      primary: 'Schedule doctor consultation',
      actions: [
        'Contact your primary care doctor or clinic',
        'Prepare a list of symptoms and when they started',
        'Schedule an appointment within 24-48 hours',
        'Bring any relevant medical records',
        'List current medications and supplements'
      ],
      followUp: 'Get professional medical evaluation and diagnosis',
      timeframe: 'Within 24-48 hours',
      alternativeForElders: age > 65 ? 'Consider same-day appointment if possible' : null
    },
    hi: {
      type: 'doctor-consultation',
      primary: 'डॉक्टर परामर्श शेड्यूल करें',
      actions: [
        'अपने प्राथमिक देखभाल डॉक्टर या क्लिनिक से संपर्क करें',
        'लक्षणों की एक सूची तैयार करें और वे कब शुरू हुए',
        '24-48 घंटों के भीतर एक नियुक्ति शेड्यूल करें',
        'कोई भी प्रासंगिक चिकित्सा रिकॉर्ड लाएं',
        'वर्तमान दवाओं और सप्लीमेंट्स की सूची बनाएं'
      ],
      followUp: 'पेशेवर चिकित्सा मूल्यांकन और निदान प्राप्त करें',
      timeframe: '24-48 घंटों के भीतर',
      alternativeForElders: age > 65 ? 'यदि संभव हो तो सेम-डे अपॉइंटमेंट पर विचार करें' : null
    },
    te: {
      type: 'doctor-consultation',
      primary: 'డాక్టర్ సంప్రదింపు షెడ్యూల్ చేయండి',
      actions: [
        'మీ ప్రాధమిక సంరక్షణ డాక్టర్ లేదా క్లిनిక్‌ను సంప్రదించండి',
        'లక్షణాల జాబితా సిద్ధం చేయండి మరియు అవి ఎప్పుడు ప్రారంభమైనవి',
        '24-48 గంటల్లో నియామకాన్ని షెడ్యూల్ చేయండి',
        'ఏవైనా సంబంధిత వైద్య రికార్డులను తీసుకువెళ్లండి',
        'ప్రస్తుత ఔషధాలు మరియు సప్లిమెంట్ల జాబితా'
      ],
      followUp: 'వృత్తిమత్తమైన వైద్య మూల్యాంకనం మరియు నిర్ధారణ పొందండి',
      timeframe: '24-48 గంటల్లో',
      alternativeForElders: age > 65 ? 'సాధ్యమైతే సేమ్-డే నియామకాన్ని పరిగణించండి' : null
    }
  };

  return recommendations[language] || recommendations['en'];
};

/**
 * High risk recommendation
 */
const generateHighRiskRecommendation = (symptoms, language = 'en') => {
  const recommendations = {
    en: {
      type: 'specialist-consultation',
      primary: 'Urgent specialist consultation required',
      actions: [
        'Contact your doctor immediately',
        'Request urgent or same-day appointment',
        'Consider visiting urgent care clinic if doctor unavailable',
        'Bring all medical records and medication list',
        'Have someone accompany you to appointment'
      ],
      followUp: 'Seek immediate professional medical evaluation',
      timeframe: 'Same day or within hours',
      warning: 'Do not delay - your symptoms require urgent assessment'
    },
    hi: {
      type: 'specialist-consultation',
      primary: 'तत्काल विशेषज्ञ परामर्श आवश्यक',
      actions: [
        'तुरंत अपने डॉक्टर से संपर्क करें',
        'तत्काल या सेम-डे नियुक्ति का अनुरोध करें',
        'यदि डॉक्टर उपलब्ध नहीं है तो तत्काल देखभाल क्लिनिक जाने पर विचार करें',
        'सभी चिकित्सा रिकॉर्ड और दवा सूची लाएं',
        'नियुक्ति के लिए किसी को आपके साथ आना चाहिए'
      ],
      followUp: 'तत्काल पेशेवर चिकित्सा मूल्यांकन लें',
      timeframe: 'सेम-डे या कुछ घंटों के भीतर',
      warning: 'देरी न करें - आपके लक्षणों के लिए तत्काल मूल्यांकन आवश्यक है'
    },
    te: {
      type: 'specialist-consultation',
      primary: 'అత్యవసర నిపుణ సంప్రదింపు అవసరం',
      actions: [
        'తక్షణమే మీ డాక్టర్‌ను సంప్రదించండి',
        'అత్యవసర లేదా సేమ్-డే నియామకాన్ని అభ్యర్థించండి',
        'డాక్టర్ లేనితే అత్యవసర సంరక్షణ క్లినిక్‌ను సందర్శించండి',
        'సమస్త వైద్య రికార్డులు మరియు ఔషధ జాబితాను తీసుకువెళ్లండి',
        'నియామకానికి ఎవరైనా మీ సাথে వెళ్ళాలి'
      ],
      followUp: 'తక్షణ వృత్తిమత్తమైన వైద్య మూల్యాంకనం చేయించండి',
      timeframe: 'సేమ్-డే లేదా కొన్ని గంటల్లో',
      warning: 'ఆలస్యం చేయవద్దు - మీ లక్షణాలకు అత్యవసర మూల్యాంకనం అవసరం'
    }
  };

  return recommendations[language] || recommendations['en'];
};

/**
 * Emergency recommendation
 */
const generateEmergencyRecommendation = (language = 'en') => {
  const recommendations = {
    en: {
      type: 'emergency-room',
      primary: '🚨 SEEK IMMEDIATE EMERGENCY CARE',
      actions: [
        'CALL EMERGENCY SERVICES (911 in US) IMMEDIATELY',
        'Do not wait - go to nearest emergency room NOW',
        'Tell them your chief symptoms and medical history',
        'If unconscious, ensure someone calls for help',
        'Keep your medication list accessible'
      ],
      followUp: 'Emergency medical intervention required immediately',
      timeframe: 'NOW - Do not delay',
      severity: 'LIFE-THREATENING'
    },
    hi: {
      type: 'emergency-room',
      primary: '🚨 तत्काल आपातकालीन देखभाल लें',
      actions: [
        'तुरंत आपातकालीन सेवाओं को कॉल करें (भारत में 102 या 108)',
        'प्रतीक्षा न करें - अभी निकटतम आपातकालीन कक्ष में जाएं',
        'उन्हें अपने मुख्य लक्षण और चिकित्सा इतिहास बताएं',
        'यदि बेहोश हो तो सुनिश्चित करें कि कोई मदद के लिए बुलाता है',
        'अपनी दवा सूची सुलभ रखें'
      ],
      followUp: 'तत्काल आपातकालीन चिकित्सा हस्तक्षेप आवश्यक',
      timeframe: 'अभी - देरी न करें',
      severity: 'जीवन-खतरनाक'
    },
    te: {
      type: 'emergency-room',
      primary: '🚨 తక్షణ ఆపత్కాల సంరక్షణ కోసం వెళ్లండి',
      actions: [
        'తక్షణమే ఆపత్కాల సేవలకు కాల్ చేయండి (భారతదేశంలో 102 లేదా 108)',
        'ఎదురుచూడవద్దు - ఇప్పుడే సమీప ఆపత్కాల గదికి వెళ్లండి',
        'మీ ముఖ్య లక్షణాలు మరియు వైద్య చరిత్రను చెప్పండి',
        'అచేతనమైతే, ఎవరైనా సహాయ కోసం కాల్ చేస్తుందని నిশ్చితం చేయండి',
        'మీ ఔషధ జాబితాను ఆసక్తికరంగా ఉంచండి'
      ],
      followUp: 'తక్షణ ఆపత్కాల వైద్య జోక్యం అవసరం',
      timeframe: 'ఇప్పుడు - ఆలస్యం చేయవద్దు',
      severity: 'జీవిత-ఆపద'
    }
  };

  return recommendations[language] || recommendations['en'];
};

module.exports = {
  generateRecommendation
};
