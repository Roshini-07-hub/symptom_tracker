const { OpenAI } = require('openai');
const { getIndex } = require('../config/pinecone');
const MedicalDocument = require('../models/MedicalDocument');

/**
 * RAG (Retrieval-Augmented Generation) Service
 * Handles document embedding, retrieval, and context-aware generation
 */

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

/**
 * Generate embeddings for text using OpenAI
 */
const generateEmbedding = async (text) => {
  try {
    const response = await openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: text
    });

    return response.data[0].embedding;
  } catch (error) {
    console.error('Error generating embedding:', error);
    throw error;
  }
};

/**
 * Index a medical document in Pinecone
 */
const indexDocument = async (doc) => {
  try {
    const embedding = await generateEmbedding(doc.content);
    const index = await getIndex();

    const metadata = {
      title: doc.title,
      category: doc.category,
      source: doc.source,
      language: doc.language
    };

    const pineconeId = `doc-${doc._id.toString()}`;

    await index.upsert([
      {
        id: pineconeId,
        values: embedding,
        metadata
      }
    ]);

    // Update document with pinecone ID and embedding
    doc.pineconeId = pineconeId;
    doc.embedding = embedding;
    await doc.save();

    return { success: true, pineconeId };
  } catch (error) {
    console.error('Error indexing document:', error);
    throw error;
  }
};

/**
 * Search for relevant medical documents using vector similarity
 */
const searchDocuments = async (query, topK = 5, language = 'en') => {
  try {
    const queryEmbedding = await generateEmbedding(query);
    const index = await getIndex();

    const results = await index.query({
      vector: queryEmbedding,
      topK,
      includeMetadata: true,
      filter: { language: { $eq: language } }
    });

    // Fetch full documents from MongoDB
    const documents = await Promise.all(
      results.matches.map(async (match) => {
        const doc = await MedicalDocument.findById(
          match.id.replace('doc-', '')
        );
        return {
          id: match.id,
          title: doc?.title || match.metadata.title,
          content: doc?.content || '',
          category: match.metadata.category,
          relevanceScore: match.score
        };
      })
    );

    return documents;
  } catch (error) {
    console.error('Error searching documents:', error);
    throw error;
  }
};

/**
 * Generate AI response using retrieved context
 */
const generateContextAwareResponse = async (userQuery, retrievedDocuments, language = 'en') => {
  try {
    const contextText = retrievedDocuments
      .map(doc => `[${doc.category}] ${doc.title}:\n${doc.content}`)
      .join('\n\n---\n\n');

    const systemPrompt = getSystemPrompt(language);
    const disclaimer = getDisclaimer(language);

    const response = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4',
      messages: [
        {
          role: 'system',
          content: systemPrompt
        },
        {
          role: 'user',
          content: `Medical Context:\n${contextText}\n\nUser Query:\n${userQuery}\n\nProvide a helpful response based on the above context.`
        }
      ],
      temperature: 0.7,
      max_tokens: 500
    });

    const aiResponse = response.choices[0].message.content;
    
    return {
      response: aiResponse,
      disclaimer,
      usage: {
        promptTokens: response.usage.prompt_tokens,
        completionTokens: response.usage.completion_tokens
      }
    };
  } catch (error) {
    console.error('Error generating response:', error);
    throw error;
  }
};

/**
 * Get system prompt based on language
 */
const getSystemPrompt = (language = 'en') => {
  const prompts = {
    en: 'You are a healthcare triage assistant. Provide evidence-based medical information. Always remind users to consult healthcare professionals for diagnosis and treatment.',
    hi: 'आप एक स्वास्थ्य सेवा प्रशिक्षण सहायक हैं। सबूत-आधारित चिकित्सा जानकारी प्रदान करें। हमेशा उपयोगकर्ताओं को निदान और उपचार के लिए स्वास्थ्य सेवा पेशेवरों से परामर्श लेने की सलाह दें।',
    te: 'మీరు ఆరోగ్య సేవల నిర్వహణ సహాయకుడు. సాక్ష్యం ఆధారిత వైద్య సమాచారాన్ని అందించండి. ఎల్లప్పుడూ వినియోగదారులను నిర్ధారణ మరియు చికిత్సకు ఆరోగ్య సేవా నిపుణులను సంప్రదించమని సూచించండి.'
  };
  return prompts[language] || prompts['en'];
};

/**
 * Get medical disclaimer based on language
 */
const getDisclaimer = (language = 'en') => {
  const disclaimers = {
    en: '⚠️ DISCLAIMER: This assistant is not a substitute for professional medical advice, diagnosis, or treatment. Always consult with a qualified healthcare professional before making any medical decisions.',
    hi: '⚠️ अस्वीकरण: यह सहायक व्यावसायिक चिकित्सा सलाह, निदान, या उपचार का विकल्प नहीं है। किसी भी चिकित्सा निर्णय लेने से पहले हमेशा एक योग्य स्वास्थ्य सेवा पेशेवर से परामर्श लें।',
    te: '⚠️ నిరాకరణ: ఈ సహాయకుడు వృత్తిమత్తమైన వైద్య సలహా, నిర్ధారణ లేదా చికిత్సకు ప్రత్యామ్నాయం కాదు. ఎటువంటి వైద్య నిర్ణయాలు తీసుకోవడానికి ముందు ఎప్పుడూ నిపుణ ఆరోగ్య సేవా నిపుణుడిని సంప్రదించండి.'
  };
  return disclaimers[language] || disclaimers['en'];
};

module.exports = {
  generateEmbedding,
  indexDocument,
  searchDocuments,
  generateContextAwareResponse,
  getDisclaimer
};
