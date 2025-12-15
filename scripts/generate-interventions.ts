/**
 * Generate Interventions from KB Articles Script
 * Uses Claude AI to analyze KB content and create structured intervention programs
 *
 * Usage: npx tsx scripts/generate-interventions.ts
 */

import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import Anthropic from '@anthropic-ai/sdk';

// Load environment variables
config({ path: '.env.local' });

// Initialize clients
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// Categories that have intervention content
const INTERVENTION_CATEGORIES = [
  'anxiety',
  'ptsd',
  'ocd',
  'insomnia',
  'suicidal',
  'marital-distress',
  'sexual-addiction',
  'depression',
];

interface KBArticle {
  id: string;
  title: string;
  content: string;
  category: string;
  language: string;
  file_path: string;
}

interface GeneratedIntervention {
  name: string;
  name_ms: string;
  description: string;
  description_ms: string;
  chapters: {
    title: string;
    title_ms: string;
    description: string;
    description_ms: string;
    kb_article_ids: string[];
    intervention_type: 'exercise' | 'worksheet' | 'reading' | 'technique';
    exercise_steps?: string[];
    estimated_duration_minutes: number;
  }[];
  estimated_duration_minutes: number;
}

/**
 * Get KB articles for a category
 */
async function getKBArticlesByCategory(category: string): Promise<KBArticle[]> {
  const { data, error } = await supabase
    .from('kb_articles')
    .select('id, title, content, category, language, file_path')
    .eq('category', category)
    .order('file_path');

  if (error) {
    console.error(`Error fetching KB articles for ${category}:`, error);
    return [];
  }

  return data || [];
}

/**
 * Use Claude to analyze KB content and generate intervention structure
 */
async function generateInterventionStructure(
  category: string,
  articles: KBArticle[]
): Promise<GeneratedIntervention | null> {
  // Combine article content for analysis (limit to avoid token limits)
  const combinedContent = articles
    .map((a, i) => `--- Article ${i + 1}: ${a.title} ---\n${a.content.slice(0, 3000)}`)
    .join('\n\n')
    .slice(0, 30000);

  const articleIds = articles.map(a => ({ id: a.id, title: a.title }));

  const prompt = `You are analyzing mental health intervention content in Bahasa Malaysia to create a structured intervention program.

Category: ${category}
Number of source articles: ${articles.length}

Source Content:
${combinedContent}

Available Article IDs:
${JSON.stringify(articleIds, null, 2)}

Based on this content, create a structured intervention program with chapters. Each chapter should be a logical module that users can complete.

Return a JSON object with this EXACT structure (no markdown, just pure JSON):
{
  "name": "English name for the intervention program",
  "name_ms": "Malay name for the intervention program",
  "description": "Brief English description (1-2 sentences)",
  "description_ms": "Brief Malay description (1-2 sentences)",
  "estimated_duration_minutes": <total estimated minutes for full program>,
  "chapters": [
    {
      "title": "English chapter title",
      "title_ms": "Malay chapter title",
      "description": "Brief English description of what this chapter covers",
      "description_ms": "Brief Malay description",
      "kb_article_ids": ["<id of relevant KB article(s)>"],
      "intervention_type": "exercise|worksheet|reading|technique",
      "exercise_steps": ["Step 1...", "Step 2..."],
      "estimated_duration_minutes": <minutes for this chapter>
    }
  ]
}

Guidelines:
- Create 4-8 chapters that form a logical progression
- Each chapter should map to 1-2 KB article IDs from the list provided
- intervention_type should match the content: "reading" for educational content, "exercise" for practical activities, "technique" for specific methods, "worksheet" for fill-in activities
- exercise_steps should have 3-6 clear steps if it's an exercise or technique
- Estimated duration: reading ~10-15min, exercises ~15-30min, techniques ~20-30min
- Keep descriptions concise but informative
- Make chapter progression logical (understanding → practice → mastery)

Return ONLY the JSON object, no other text.`;

  try {
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4000,
      messages: [{ role: 'user', content: prompt }],
    });

    const content = response.content[0];
    if (content.type !== 'text') {
      console.error('Unexpected response type');
      return null;
    }

    // Parse JSON response
    const jsonText = content.text.trim();
    const intervention = JSON.parse(jsonText) as GeneratedIntervention;

    return intervention;
  } catch (error) {
    console.error(`Error generating intervention for ${category}:`, error);
    return null;
  }
}

/**
 * Create slug from name
 */
function createSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

/**
 * Check if intervention already exists
 */
async function interventionExists(category: string): Promise<boolean> {
  const { data } = await supabase
    .from('interventions')
    .select('id')
    .eq('category', category)
    .single();

  return !!data;
}

/**
 * Save intervention to database
 */
async function saveIntervention(
  category: string,
  intervention: GeneratedIntervention
): Promise<string | null> {
  const slug = createSlug(intervention.name);

  // Insert intervention
  const { data: interventionData, error: interventionError } = await supabase
    .from('interventions')
    .insert({
      slug,
      name: intervention.name,
      name_ms: intervention.name_ms,
      description: intervention.description,
      description_ms: intervention.description_ms,
      category,
      is_premium: true,
      is_published: true,
      total_chapters: intervention.chapters.length,
      estimated_duration_minutes: intervention.estimated_duration_minutes,
    })
    .select('id')
    .single();

  if (interventionError) {
    console.error(`Error inserting intervention:`, interventionError);
    return null;
  }

  const interventionId = interventionData.id;

  // Insert chapters
  for (let i = 0; i < intervention.chapters.length; i++) {
    const chapter = intervention.chapters[i];
    const kbArticleId = chapter.kb_article_ids[0] || null;

    // Insert chapter
    const { error: chapterError } = await supabase
      .from('intervention_chapters')
      .insert({
        intervention_id: interventionId,
        kb_article_id: kbArticleId,
        chapter_order: i + 1,
        title: chapter.title,
        title_ms: chapter.title_ms,
        description: chapter.description,
        description_ms: chapter.description_ms,
        is_free_preview: i === 0, // First chapter is free preview
      });

    if (chapterError) {
      console.error(`Error inserting chapter ${i + 1}:`, chapterError);
    }

    // Update KB article with intervention metadata if we have a valid article ID
    if (kbArticleId) {
      await supabase
        .from('kb_articles')
        .update({
          intervention_type: chapter.intervention_type,
          exercise_steps: chapter.exercise_steps || [],
          estimated_duration_minutes: chapter.estimated_duration_minutes,
          order_index: i + 1,
          is_premium: i > 0, // First chapter content is free
        })
        .eq('id', kbArticleId);
    }
  }

  return interventionId;
}

/**
 * Main function
 */
async function main() {
  console.log('========================================');
  console.log('Generate Interventions from KB Content');
  console.log('========================================\n');

  // Check environment
  if (!process.env.ANTHROPIC_API_KEY) {
    console.error('Error: ANTHROPIC_API_KEY is not set');
    process.exit(1);
  }

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error('Error: Supabase credentials not set');
    process.exit(1);
  }

  let created = 0;
  let skipped = 0;
  let failed = 0;

  for (const category of INTERVENTION_CATEGORIES) {
    console.log(`\n📚 Processing category: ${category}`);
    console.log('-'.repeat(40));

    // Check if already exists
    if (await interventionExists(category)) {
      console.log(`  ⏭️  Intervention already exists, skipping`);
      skipped++;
      continue;
    }

    // Get KB articles
    const articles = await getKBArticlesByCategory(category);

    if (articles.length === 0) {
      console.log(`  ⚠️  No KB articles found for ${category}`);
      skipped++;
      continue;
    }

    console.log(`  📄 Found ${articles.length} KB articles`);

    // Generate intervention structure using AI
    console.log(`  🤖 Generating intervention structure with Claude...`);
    const intervention = await generateInterventionStructure(category, articles);

    if (!intervention) {
      console.log(`  ❌ Failed to generate intervention`);
      failed++;
      continue;
    }

    console.log(`  ✅ Generated: "${intervention.name}"`);
    console.log(`     Chapters: ${intervention.chapters.length}`);
    console.log(`     Duration: ${intervention.estimated_duration_minutes} minutes`);

    // Save to database
    console.log(`  💾 Saving to database...`);
    const interventionId = await saveIntervention(category, intervention);

    if (interventionId) {
      console.log(`  ✅ Saved with ID: ${interventionId}`);
      created++;
    } else {
      console.log(`  ❌ Failed to save`);
      failed++;
    }

    // Rate limiting
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  console.log('\n========================================');
  console.log('Generation Complete!');
  console.log('========================================');
  console.log(`  Created: ${created}`);
  console.log(`  Skipped: ${skipped}`);
  console.log(`  Failed: ${failed}`);
  console.log('========================================\n');
}

main().catch(console.error);
