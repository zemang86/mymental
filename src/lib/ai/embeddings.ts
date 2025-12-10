/**
 * Embeddings Service
 * Handles text embedding generation using OpenAI's text-embedding-3-small model
 */

import OpenAI from 'openai';
import { createClient } from '@supabase/supabase-js';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export interface EmbeddingResult {
  embedding: number[];
  tokens: number;
}

/**
 * Generate embeddings for a given text using OpenAI's text-embedding-3-small model
 */
export async function generateEmbedding(text: string): Promise<EmbeddingResult> {
  const response = await openai.embeddings.create({
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
  const response = await openai.embeddings.create({
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
  const { data, error } = await supabaseAdmin.rpc('match_kb_articles', {
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
  condition: string;
  language: string;
  similarity: number;
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
  const { data, error } = await supabaseAdmin
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
  const { error } = await supabaseAdmin
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
