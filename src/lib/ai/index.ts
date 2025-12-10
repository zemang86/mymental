/**
 * AI Module Exports
 * Central export point for all AI-related functionality
 */

// Embeddings
export {
  generateEmbedding,
  generateEmbeddings,
  searchSimilarDocuments,
  storeArticle,
  updateArticleEmbedding,
  chunkText,
  type EmbeddingResult,
  type KBArticle,
} from './embeddings';

// RAG System
export {
  generateChatResponse,
  generateAssessmentResults,
  quickAnswer,
  detectCrisis,
  retrieveContext,
  type ChatMessage,
  type RAGResponse,
} from './rag';

// Prompts
export {
  SYSTEM_PROMPTS,
  buildChatPrompt,
  buildResultPrompt,
  CRISIS_RESPONSE,
} from './prompts';
