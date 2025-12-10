/**
 * Knowledge Base Embedding Script
 * Processes markdown files and stores embeddings in Supabase pgvector
 *
 * Usage: npx tsx scripts/embed-kb.ts
 */

import fs from 'fs';
import path from 'path';
import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';

// Load environment variables from .env.local
config({ path: '.env.local' });

// Initialize clients
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const KB_DIR = path.join(process.cwd(), 'kb');

interface ArticleData {
  title: string;
  content: string;
  category: string;
  language: 'en' | 'ms';
  filePath: string;
  checksum: string;
}

/**
 * Calculate checksum for content change detection
 */
function calculateChecksum(content: string): string {
  let hash = 0;
  for (let i = 0; i < content.length; i++) {
    const char = content.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return hash.toString(16);
}

/**
 * Extract title from markdown content
 */
function extractTitle(content: string): string {
  const match = content.match(/^#\s+(.+)$/m);
  return match ? match[1].trim() : 'Untitled';
}

/**
 * Detect language from content
 */
function detectLanguage(content: string): 'en' | 'ms' {
  // Simple heuristic: check for Malay-specific words
  const malayWords = ['yang', 'dan', 'untuk', 'adalah', 'dalam', 'dengan', 'anda', 'saya', 'ini', 'itu'];
  const lowerContent = content.toLowerCase();
  let malayCount = 0;

  for (const word of malayWords) {
    if (lowerContent.includes(` ${word} `)) {
      malayCount++;
    }
  }

  // If more than 3 common Malay words found, consider it Malay
  // Since our articles are bilingual, we'll mark based on dominant language
  return malayCount > 5 ? 'ms' : 'en';
}

/**
 * Read all markdown files from KB directory
 */
function readKBArticles(): ArticleData[] {
  const articles: ArticleData[] = [];

  const conditions = fs.readdirSync(KB_DIR);

  for (const condition of conditions) {
    const conditionPath = path.join(KB_DIR, condition);

    if (!fs.statSync(conditionPath).isDirectory()) {
      continue;
    }

    const files = fs.readdirSync(conditionPath);

    for (const file of files) {
      if (!file.endsWith('.md')) {
        continue;
      }

      const filePath = path.join(conditionPath, file);
      const content = fs.readFileSync(filePath, 'utf-8');
      const title = extractTitle(content);
      const language = detectLanguage(content);
      const checksum = calculateChecksum(content);

      articles.push({
        title,
        content,
        category: condition,
        language,
        filePath,
        checksum,
      });
    }
  }

  return articles;
}

/**
 * Generate embedding for text
 */
async function generateEmbedding(text: string): Promise<number[]> {
  const response = await openai.embeddings.create({
    model: 'text-embedding-3-small',
    input: text.slice(0, 8000), // Limit to ~8000 chars to stay within token limits
  });

  return response.data[0].embedding;
}

/**
 * Check if article already exists in database
 */
async function getExistingArticle(filePath: string): Promise<{ id: string; checksum: string } | null> {
  const { data, error } = await supabase
    .from('kb_articles')
    .select('id, checksum')
    .eq('file_path', filePath)
    .single();

  if (error || !data) {
    return null;
  }

  return data;
}

/**
 * Insert or update article in database
 */
async function upsertArticle(
  article: ArticleData,
  embedding: number[],
  existingId?: string
): Promise<void> {
  const articleData = {
    title: article.title,
    content: article.content,
    category: article.category,
    language: article.language,
    file_path: article.filePath,
    checksum: article.checksum,
    embedding,
    updated_at: new Date().toISOString(),
  };

  if (existingId) {
    const { error } = await supabase
      .from('kb_articles')
      .update(articleData)
      .eq('id', existingId);

    if (error) {
      throw new Error(`Failed to update article: ${error.message}`);
    }
  } else {
    const { error } = await supabase
      .from('kb_articles')
      .insert(articleData);

    if (error) {
      throw new Error(`Failed to insert article: ${error.message}`);
    }
  }
}

/**
 * Main embedding process
 */
async function main() {
  console.log('Starting Knowledge Base embedding process...\n');

  // Check for required environment variables
  if (!process.env.OPENAI_API_KEY) {
    console.error('Error: OPENAI_API_KEY is not set');
    console.log('Note: OpenAI API key is required for generating embeddings.');
    console.log('You can set it in .env.local or skip this step if not using RAG features.\n');
    process.exit(1);
  }

  // Read all articles
  const articles = readKBArticles();
  console.log(`Found ${articles.length} articles in knowledge base\n`);

  let created = 0;
  let updated = 0;
  let skipped = 0;
  let failed = 0;

  for (const article of articles) {
    try {
      console.log(`Processing: ${article.category}/${path.basename(article.filePath)}`);

      // Check if article exists and has changed
      const existing = await getExistingArticle(article.filePath);

      if (existing && existing.checksum === article.checksum) {
        console.log('  -> Skipped (no changes)\n');
        skipped++;
        continue;
      }

      // Generate embedding
      console.log('  -> Generating embedding...');
      const embedding = await generateEmbedding(article.content);

      // Save to database
      console.log('  -> Saving to database...');
      await upsertArticle(article, embedding, existing?.id);

      if (existing) {
        console.log('  -> Updated!\n');
        updated++;
      } else {
        console.log('  -> Created!\n');
        created++;
      }

      // Rate limiting - wait 200ms between API calls
      await new Promise(resolve => setTimeout(resolve, 200));
    } catch (error) {
      console.error(`  -> Failed: ${error}\n`);
      failed++;
    }
  }

  console.log('\n========================================');
  console.log('Embedding process complete!');
  console.log(`  Created: ${created}`);
  console.log(`  Updated: ${updated}`);
  console.log(`  Skipped: ${skipped}`);
  console.log(`  Failed: ${failed}`);
  console.log('========================================\n');
}

main().catch(console.error);
