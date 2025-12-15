/**
 * Resource Embedding Script
 * Processes PDF and DOCX files from docs/resources and stores embeddings in Supabase
 *
 * Usage: npx tsx scripts/embed-resources.ts
 */

import fs from 'fs';
import path from 'path';
import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';
import mammoth from 'mammoth';
import { extractText } from 'unpdf';

// Load environment variables
config({ path: '.env.local' });

// Initialize clients
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const RESOURCES_DIR = path.join(process.cwd(), 'docs', 'resources', 'MyMental ');

interface DocumentChunk {
  title: string;
  content: string;
  category: string;
  language: 'en' | 'ms';
  sourceFile: string;
  chunkIndex: number;
  totalChunks: number;
  checksum: string;
}

/**
 * Calculate checksum for content
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
 * Detect language from content
 */
function detectLanguage(content: string): 'en' | 'ms' {
  const malayWords = ['yang', 'dan', 'untuk', 'adalah', 'dalam', 'dengan', 'anda', 'saya', 'ini', 'itu', 'kepada', 'boleh', 'akan', 'tidak', 'telah'];
  const lowerContent = content.toLowerCase();
  let malayCount = 0;

  for (const word of malayWords) {
    const regex = new RegExp(`\\b${word}\\b`, 'g');
    const matches = lowerContent.match(regex);
    if (matches) {
      malayCount += matches.length;
    }
  }

  // If significant Malay words found, consider it Malay
  return malayCount > 10 ? 'ms' : 'en';
}

/**
 * Determine category from filename
 */
function determineCategory(filename: string): string {
  const lowerName = filename.toLowerCase();

  if (lowerName.includes('ptsd')) return 'ptsd';
  if (lowerName.includes('ocd') || lowerName.includes('obsesif')) return 'ocd';
  if (lowerName.includes('anzieti') || lowerName.includes('anxiety')) return 'anxiety';
  if (lowerName.includes('insomnia')) return 'insomnia';
  if (lowerName.includes('bunuh diri') || lowerName.includes('suicide')) return 'suicidal';
  if (lowerName.includes('perkahwinan') || lowerName.includes('marital')) return 'marital-distress';
  if (lowerName.includes('seks') || lowerName.includes('sexual')) return 'sexual-addiction';
  if (lowerName.includes('psychosis') || lowerName.includes('psikosis')) return 'psychosis';
  if (lowerName.includes('depresi') || lowerName.includes('depression')) return 'depression';
  if (lowerName.includes('tekanan') || lowerName.includes('stress')) return 'stress';
  if (lowerName.includes('saringan') || lowerName.includes('screening')) return 'screening';
  if (lowerName.includes('demografi')) return 'demographics';

  return 'general';
}

/**
 * Clean extracted text
 */
function cleanText(text: string): string {
  return text
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/[ \t]+/g, ' ')
    .replace(/^\s+$/gm, '')
    .trim();
}

/**
 * Chunk text into smaller pieces with overlap
 */
function chunkText(
  text: string,
  maxChunkSize: number = 1500,
  overlap: number = 200
): string[] {
  const chunks: string[] = [];
  const paragraphs = text.split(/\n\n+/);
  let currentChunk = '';

  for (const paragraph of paragraphs) {
    const trimmedParagraph = paragraph.trim();
    if (!trimmedParagraph) continue;

    // If adding this paragraph would exceed max size, save current chunk
    if (currentChunk.length + trimmedParagraph.length > maxChunkSize && currentChunk.length > 0) {
      chunks.push(currentChunk.trim());

      // Start new chunk with overlap from previous
      const words = currentChunk.split(/\s+/);
      const overlapWords = words.slice(-Math.floor(overlap / 5)); // Approximate word count for overlap
      currentChunk = overlapWords.join(' ') + '\n\n' + trimmedParagraph;
    } else {
      currentChunk += (currentChunk ? '\n\n' : '') + trimmedParagraph;
    }
  }

  // Don't forget the last chunk
  if (currentChunk.trim()) {
    chunks.push(currentChunk.trim());
  }

  // Filter out very small chunks (less than 100 chars)
  return chunks.filter(chunk => chunk.length >= 100);
}

/**
 * Extract text from PDF file
 */
async function extractPdfText(filePath: string): Promise<string> {
  const dataBuffer = fs.readFileSync(filePath);
  const uint8Array = new Uint8Array(dataBuffer);
  const result = await extractText(uint8Array) as { totalPages: number; text: string[] };

  // unpdf returns { totalPages: number, text: string[] }
  let text: string;
  if (result && Array.isArray(result.text)) {
    text = result.text.join('\n\n');
  } else if (typeof result === 'string') {
    text = result;
  } else {
    console.log('  unpdf result type:', typeof result, 'keys:', result ? Object.keys(result) : 'null');
    text = String(result) || '';
  }

  return cleanText(text);
}

/**
 * Extract text from DOCX file
 */
async function extractDocxText(filePath: string): Promise<string> {
  const result = await mammoth.extractRawText({ path: filePath });
  return cleanText(result.value);
}

/**
 * Get all document files recursively
 */
function getDocumentFiles(dir: string): string[] {
  const files: string[] = [];

  if (!fs.existsSync(dir)) {
    console.error(`Directory not found: ${dir}`);
    return files;
  }

  const items = fs.readdirSync(dir, { withFileTypes: true });

  for (const item of items) {
    const fullPath = path.join(dir, item.name);

    if (item.isDirectory()) {
      files.push(...getDocumentFiles(fullPath));
    } else if (item.isFile()) {
      const ext = path.extname(item.name).toLowerCase();
      if (ext === '.pdf' || ext === '.docx') {
        files.push(fullPath);
      }
    }
  }

  return files;
}

/**
 * Generate embedding for text
 */
async function generateEmbedding(text: string): Promise<number[]> {
  const response = await openai.embeddings.create({
    model: 'text-embedding-3-small',
    input: text.slice(0, 8000), // Stay within token limits
  });

  return response.data[0].embedding;
}

/**
 * Check if chunk already exists
 */
async function getExistingChunk(sourceFile: string, chunkIndex: number): Promise<{ id: string; checksum: string } | null> {
  const { data, error } = await supabase
    .from('kb_articles')
    .select('id, checksum')
    .eq('file_path', `${sourceFile}#chunk${chunkIndex}`)
    .single();

  if (error || !data) {
    return null;
  }

  return data;
}

/**
 * Store chunk in database
 */
async function upsertChunk(
  chunk: DocumentChunk,
  embedding: number[],
  existingId?: string
): Promise<void> {
  const chunkData = {
    title: `${chunk.title} (Part ${chunk.chunkIndex + 1}/${chunk.totalChunks})`,
    content: chunk.content,
    category: chunk.category,
    language: chunk.language,
    file_path: `${chunk.sourceFile}#chunk${chunk.chunkIndex}`,
    checksum: chunk.checksum,
    embedding,
    updated_at: new Date().toISOString(),
  };

  if (existingId) {
    const { error } = await supabase
      .from('kb_articles')
      .update(chunkData)
      .eq('id', existingId);

    if (error) {
      throw new Error(`Failed to update chunk: ${error.message}`);
    }
  } else {
    const { error } = await supabase
      .from('kb_articles')
      .insert(chunkData);

    if (error) {
      throw new Error(`Failed to insert chunk: ${error.message}`);
    }
  }
}

/**
 * Main processing function
 */
async function main() {
  console.log('========================================');
  console.log('Resource Embedding Script');
  console.log('========================================\n');

  // Check for required environment variables
  if (!process.env.OPENAI_API_KEY) {
    console.error('Error: OPENAI_API_KEY is not set');
    process.exit(1);
  }

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error('Error: Supabase credentials not set');
    process.exit(1);
  }

  // Get all document files
  console.log(`Scanning: ${RESOURCES_DIR}\n`);
  const files = getDocumentFiles(RESOURCES_DIR);
  console.log(`Found ${files.length} document files\n`);

  if (files.length === 0) {
    console.log('No PDF or DOCX files found.');
    return;
  }

  let totalChunks = 0;
  let created = 0;
  let updated = 0;
  let skipped = 0;
  let failed = 0;

  for (const filePath of files) {
    const filename = path.basename(filePath);
    const ext = path.extname(filename).toLowerCase();
    const relativePath = path.relative(process.cwd(), filePath);

    console.log(`\nProcessing: ${relativePath}`);
    console.log('-'.repeat(50));

    try {
      // Extract text
      let text: string;
      if (ext === '.pdf') {
        console.log('  Extracting text from PDF...');
        text = await extractPdfText(filePath);
      } else {
        console.log('  Extracting text from DOCX...');
        text = await extractDocxText(filePath);
      }

      if (text.length < 100) {
        console.log('  -> Skipped (too little text extracted)\n');
        skipped++;
        continue;
      }

      console.log(`  Extracted ${text.length} characters`);

      // Chunk the text
      const chunks = chunkText(text);
      console.log(`  Split into ${chunks.length} chunks`);

      // Determine metadata
      const title = filename.replace(ext, '');
      const category = determineCategory(filename);
      const language = detectLanguage(text);

      console.log(`  Category: ${category}, Language: ${language}`);

      // Process each chunk
      for (let i = 0; i < chunks.length; i++) {
        const chunkContent = chunks[i];
        const checksum = calculateChecksum(chunkContent);

        // Check if chunk exists and hasn't changed
        const existing = await getExistingChunk(relativePath, i);

        if (existing && existing.checksum === checksum) {
          skipped++;
          continue;
        }

        // Generate embedding
        const embedding = await generateEmbedding(chunkContent);

        // Create chunk data
        const chunkData: DocumentChunk = {
          title,
          content: chunkContent,
          category,
          language,
          sourceFile: relativePath,
          chunkIndex: i,
          totalChunks: chunks.length,
          checksum,
        };

        // Store in database
        await upsertChunk(chunkData, embedding, existing?.id);

        if (existing) {
          updated++;
        } else {
          created++;
        }

        totalChunks++;

        // Rate limiting
        await new Promise(resolve => setTimeout(resolve, 200));
      }

      console.log(`  -> Processed ${chunks.length} chunks`);

    } catch (error) {
      console.error(`  -> Failed: ${error}`);
      failed++;
    }
  }

  console.log('\n========================================');
  console.log('Embedding Complete!');
  console.log('========================================');
  console.log(`  Files processed: ${files.length}`);
  console.log(`  Total chunks: ${totalChunks}`);
  console.log(`  Created: ${created}`);
  console.log(`  Updated: ${updated}`);
  console.log(`  Skipped: ${skipped}`);
  console.log(`  Failed: ${failed}`);
  console.log('========================================\n');
}

main().catch(console.error);
