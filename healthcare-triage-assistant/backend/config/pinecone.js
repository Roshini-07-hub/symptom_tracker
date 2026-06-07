const { Pinecone } = require('@pinecone-database/pinecone');

/**
 * Pinecone Vector Database Configuration
 * Handles initialization and management of vector embeddings
 */

let pineconeInstance = null;

const initializePinecone = async () => {
  try {
    pineconeInstance = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY,
      environment: process.env.PINECONE_ENV
    });

    console.log('✅ Pinecone initialized successfully');
    return pineconeInstance;
  } catch (error) {
    console.error('Error initializing Pinecone:', error);
    throw error;
  }
};

const getPineconeClient = async () => {
  if (!pineconeInstance) {
    await initializePinecone();
  }
  return pineconeInstance;
};

const getIndex = async (indexName = process.env.PINECONE_INDEX) => {
  const client = await getPineconeClient();
  return client.index(indexName);
};

module.exports = {
  initializePinecone,
  getPineconeClient,
  getIndex
};
