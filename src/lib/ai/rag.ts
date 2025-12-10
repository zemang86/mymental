/**
 * RAG (Retrieval-Augmented Generation) Service
 * Combines vector search with Claude for intelligent responses
 */

import Anthropic from '@anthropic-ai/sdk';
import { generateEmbedding, searchSimilarDocuments, type KBArticle } from './embeddings';
import { SYSTEM_PROMPTS, buildChatPrompt, buildResultPrompt, CRISIS_RESPONSE } from './prompts';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface RAGResponse {
  response: string;
  sources: KBArticle[];
  isCrisis: boolean;
  crisisLevel: 'none' | 'low' | 'moderate' | 'high' | 'imminent';
}

/**
 * Detect if message contains crisis indicators
 */
export function detectCrisis(message: string): {
  isCrisis: boolean;
  level: 'none' | 'low' | 'moderate' | 'high' | 'imminent';
} {
  const lowerMessage = message.toLowerCase();

  // Imminent crisis keywords (Malay and English)
  const imminentKeywords = [
    'kill myself', 'bunuh diri', 'want to die', 'mahu mati', 'ingin mati',
    'end my life', 'tamatkan hidup', 'suicide plan', 'rancangan bunuh diri',
    'hurt myself', 'cederakan diri', 'self-harm', 'harm myself',
    'no reason to live', 'tiada sebab untuk hidup', 'better off dead',
    'goodbye forever', 'selamat tinggal selamanya'
  ];

  // High-risk keywords
  const highKeywords = [
    'suicidal', 'thoughts of death', 'fikiran kematian',
    'hopeless', 'putus asa', 'hearing voices', 'dengar suara',
    'seeing things', 'lihat benda', 'paranoid', 'want to disappear',
    'mahu hilang', 'worthless', 'tidak berguna'
  ];

  // Moderate-risk keywords
  const moderateKeywords = [
    'depressed', 'murung', 'anxious', 'cemas', 'panic attack',
    'serangan panik', 'cannot sleep', 'tidak boleh tidur',
    'cannot function', 'tidak dapat berfungsi', 'overwhelmed', 'terbeban'
  ];

  for (const keyword of imminentKeywords) {
    if (lowerMessage.includes(keyword)) {
      return { isCrisis: true, level: 'imminent' };
    }
  }

  for (const keyword of highKeywords) {
    if (lowerMessage.includes(keyword)) {
      return { isCrisis: true, level: 'high' };
    }
  }

  for (const keyword of moderateKeywords) {
    if (lowerMessage.includes(keyword)) {
      return { isCrisis: false, level: 'moderate' };
    }
  }

  return { isCrisis: false, level: 'none' };
}

/**
 * Retrieve relevant context from knowledge base
 */
export async function retrieveContext(query: string, limit: number = 4): Promise<KBArticle[]> {
  try {
    const { embedding } = await generateEmbedding(query);
    const articles = await searchSimilarDocuments(embedding, limit);
    return articles;
  } catch (error) {
    console.error('Error retrieving context:', error);
    return [];
  }
}

/**
 * Format retrieved articles into context string
 */
function formatContext(articles: KBArticle[]): string {
  if (articles.length === 0) {
    return 'No specific knowledge base articles found for this query.';
  }

  return articles
    .map((article, index) => {
      return `### ${index + 1}. ${article.title}
${article.content.slice(0, 1500)}${article.content.length > 1500 ? '...' : ''}`;
    })
    .join('\n\n');
}

/**
 * Generate a RAG-enhanced chat response
 */
export async function generateChatResponse(
  userMessage: string,
  conversationHistory: ChatMessage[] = [],
  userRiskLevel?: string
): Promise<RAGResponse> {
  // Check for crisis first
  const crisisCheck = detectCrisis(userMessage);

  // If user is already flagged as high risk, block chat
  if (userRiskLevel === 'imminent' || userRiskLevel === 'high') {
    const isEnglish = /[a-zA-Z]/.test(userMessage);
    return {
      response: isEnglish ? CRISIS_RESPONSE.en : CRISIS_RESPONSE.ms,
      sources: [],
      isCrisis: true,
      crisisLevel: 'imminent',
    };
  }

  // If imminent crisis detected in message
  if (crisisCheck.level === 'imminent') {
    const isEnglish = /[a-zA-Z]/.test(userMessage);
    return {
      response: isEnglish ? CRISIS_RESPONSE.en : CRISIS_RESPONSE.ms,
      sources: [],
      isCrisis: true,
      crisisLevel: 'imminent',
    };
  }

  // Retrieve relevant context
  const articles = await retrieveContext(userMessage);
  const context = formatContext(articles);

  // Build the prompt
  const userPrompt = buildChatPrompt(userMessage, context, conversationHistory);

  try {
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      system: SYSTEM_PROMPTS.chatAssistant,
      messages: [
        ...conversationHistory.map((msg) => ({
          role: msg.role as 'user' | 'assistant',
          content: msg.content,
        })),
        { role: 'user', content: userPrompt },
      ],
    });

    const assistantResponse = response.content[0].type === 'text'
      ? response.content[0].text
      : '';

    return {
      response: assistantResponse,
      sources: articles,
      isCrisis: crisisCheck.isCrisis,
      crisisLevel: crisisCheck.level,
    };
  } catch (error) {
    console.error('Error generating chat response:', error);
    throw new Error('Failed to generate response');
  }
}

/**
 * Generate assessment results with RAG enhancement
 */
export async function generateAssessmentResults(
  assessmentType: string,
  score: number,
  severity: string,
  riskLevel: string,
  detectedConditions: string[]
): Promise<{ results: string; sources: KBArticle[] }> {
  // Build search query based on assessment
  const searchQuery = `${assessmentType} ${severity} coping strategies treatment ${detectedConditions.join(' ')}`;

  // Retrieve relevant context
  const articles = await retrieveContext(searchQuery, 6);
  const context = formatContext(articles);

  // Build the prompt
  const userPrompt = buildResultPrompt(
    assessmentType,
    score,
    severity,
    riskLevel,
    detectedConditions,
    context
  );

  try {
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2048,
      system: SYSTEM_PROMPTS.resultGeneration,
      messages: [{ role: 'user', content: userPrompt }],
    });

    const results = response.content[0].type === 'text'
      ? response.content[0].text
      : '';

    return {
      results,
      sources: articles,
    };
  } catch (error) {
    console.error('Error generating assessment results:', error);
    throw new Error('Failed to generate results');
  }
}

/**
 * Simple question-answering without full RAG
 * For quick factual responses
 */
export async function quickAnswer(question: string): Promise<string> {
  const articles = await retrieveContext(question, 2);
  const context = formatContext(articles);

  try {
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 512,
      system: `You are a helpful mental health information assistant. Answer the question based on the provided context. Be concise and accurate. If you don't know, say so.`,
      messages: [
        {
          role: 'user',
          content: `Context:\n${context}\n\nQuestion: ${question}`,
        },
      ],
    });

    return response.content[0].type === 'text' ? response.content[0].text : '';
  } catch (error) {
    console.error('Error generating quick answer:', error);
    throw new Error('Failed to generate answer');
  }
}
