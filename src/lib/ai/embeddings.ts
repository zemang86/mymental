/**
 * Embeddings Service
 * Handles text embedding generation using OpenAI's text-embedding-3-small model
 */

import OpenAI from 'openai';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Lazy-loaded clients to avoid build-time errors
let openaiClient: OpenAI | null = null;
let supabaseAdminClient: SupabaseClient | null = null;

function getOpenAI(): OpenAI {
  if (!openaiClient) {
    openaiClient = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }
  return openaiClient;
}

function getSupabaseAdmin(): SupabaseClient {
  if (!supabaseAdminClient) {
    supabaseAdminClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
  }
  return supabaseAdminClient;
}

export interface EmbeddingResult {
  embedding: number[];
  tokens: number;
}

/**
 * Generate embeddings for a given text using OpenAI's text-embedding-3-small model
 */
export async function generateEmbedding(text: string): Promise<EmbeddingResult> {
  const response = await getOpenAI().embeddings.create({
    model: 'text-embedding-3-small',
    input: text,
  });

  return {
    embedding: response.data[0].embedding,
    tokens: response.usage.total_tokens,
  };
}

/**
 * Generate embeddings for multiple texts in batch
 */
export async function generateEmbeddings(texts: string[]): Promise<EmbeddingResult[]> {
  const response = await getOpenAI().embeddings.create({
    model: 'text-embedding-3-small',
    input: texts,
  });

  return response.data.map((item, index) => ({
    embedding: item.embedding,
    tokens: Math.floor(response.usage.total_tokens / texts.length),
  }));
}

/**
 * Search for similar documents using vector similarity
 */
export async function searchSimilarDocuments(
  queryEmbedding: number[],
  limit: number = 4,
  matchThreshold: number = 0.7
): Promise<KBArticle[]> {
  const { data, error } = await getSupabaseAdmin().rpc('match_kb_articles', {
    query_embedding: queryEmbedding,
    match_threshold: matchThreshold,
    match_count: limit,
  });

  if (error) {
    console.error('Error searching documents:', error);
    return [];
  }

  return data || [];
}

export interface KBArticle {
  id: string;
  title: string;
  content: string;
  category: string;
  language: string;
  similarity: number;
}

/**
 * Assessment type to KB category mapping
 * Maps assessment types to their relevant KB article categories
 */
export const ASSESSMENT_TO_KB_CATEGORY: Record<string, string[]> = {
  depression: ['depression', 'general'],
  anxiety: ['anxiety'],
  ocd: ['ocd'],
  ptsd: ['ptsd'],
  insomnia: ['insomnia'],
  suicidal: ['suicidal'],
  psychosis: ['psychosis'],
  sexual_addiction: ['sexual-addiction'],
  marital_distress: ['marital-distress'],
};

/**
 * Search for similar documents filtered by category
 * Uses the match_kb_articles_by_category RPC for condition-specific searches
 */
export async function searchSimilarDocumentsByCategory(
  queryEmbedding: number[],
  category: string,
  limit: number = 4,
  matchThreshold: number = 0.5
): Promise<KBArticle[]> {
  const { data, error } = await getSupabaseAdmin().rpc('match_kb_articles_by_category', {
    query_embedding: queryEmbedding,
    filter_category: category,
    match_threshold: matchThreshold,
    match_count: limit,
  });

  if (error) {
    console.error('Error searching documents by category:', error);
    return [];
  }

  return data || [];
}

/**
 * Search for similar documents across multiple categories
 * Useful for assessment types that map to multiple KB categories
 */
export async function searchSimilarDocumentsByCategories(
  queryEmbedding: number[],
  categories: string[],
  limitPerCategory: number = 2,
  matchThreshold: number = 0.5
): Promise<KBArticle[]> {
  const results: KBArticle[] = [];

  for (const category of categories) {
    const articles = await searchSimilarDocumentsByCategory(
      queryEmbedding,
      category,
      limitPerCategory,
      matchThreshold
    );
    results.push(...articles);
  }

  // Sort by similarity and remove duplicates
  const uniqueResults = results.reduce((acc, article) => {
    if (!acc.find(a => a.id === article.id)) {
      acc.push(article);
    }
    return acc;
  }, [] as KBArticle[]);

  return uniqueResults.sort((a, b) => b.similarity - a.similarity);
}

/**
 * Get KB categories for an assessment type
 */
export function getKBCategoriesForAssessment(assessmentType: string): string[] {
  return ASSESSMENT_TO_KB_CATEGORY[assessmentType] || ['general'];
}

/**
 * Store a knowledge base article with its embedding
 */
export async function storeArticle(
  title: string,
  content: string,
  condition: string,
  language: 'en' | 'ms',
  embedding: number[]
): Promise<{ success: boolean; id?: string; error?: string }> {
  const { data, error } = await getSupabaseAdmin()
    .from('kb_articles')
    .insert({
      title,
      content,
      condition,
      language,
      embedding,
    })
    .select('id')
    .single();

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, id: data.id };
}

/**
 * Update an existing article's embedding
 */
export async function updateArticleEmbedding(
  articleId: string,
  embedding: number[]
): Promise<{ success: boolean; error?: string }> {
  const { error } = await getSupabaseAdmin()
    .from('kb_articles')
    .update({ embedding, updated_at: new Date().toISOString() })
    .eq('id', articleId);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
}

/**
 * Chunk text into smaller pieces for embedding
 * Helps with long documents
 */
export function chunkText(
  text: string,
  maxChunkSize: number = 1000,
  overlap: number = 100
): string[] {
  const chunks: string[] = [];
  let start = 0;

  while (start < text.length) {
    let end = start + maxChunkSize;

    // Try to break at a sentence or paragraph boundary
    if (end < text.length) {
      const lastPeriod = text.lastIndexOf('.', end);
      const lastNewline = text.lastIndexOf('\n', end);
      const breakPoint = Math.max(lastPeriod, lastNewline);

      if (breakPoint > start) {
        end = breakPoint + 1;
      }
    }

    chunks.push(text.slice(start, end).trim());
    start = end - overlap;
  }

  return chunks.filter(chunk => chunk.length > 0);
}
