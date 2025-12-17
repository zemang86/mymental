/**
 * Script to seed edited content for all intervention chapters
 * Uses ACTUAL KB content from the database - just adds videos and formatting
 * Run with: npx tsx scripts/seed-edited-content.ts
 */

import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';

// Load .env.local
config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Videos by category - relevant educational videos
const videosByCategory: Record<string, { url: string; title: string; titleMs: string; duration: number }[]> = {
  anxiety: [
    { url: 'https://www.youtube.com/watch?v=BVJsLbhYKQQ', title: 'Understanding Anxiety', titleMs: 'Memahami Kebimbangan', duration: 312 },
    { url: 'https://www.youtube.com/watch?v=tEmt1Znux58', title: '4-7-8 Breathing Exercise', titleMs: 'Latihan Pernafasan 4-7-8', duration: 165 },
    { url: 'https://www.youtube.com/watch?v=O-6f5wQXSu8', title: 'Grounding Techniques', titleMs: 'Teknik Membumi', duration: 420 },
    { url: 'https://www.youtube.com/watch?v=WWloIAQpMcQ', title: 'Cognitive Restructuring', titleMs: 'Penstrukturan Kognitif', duration: 380 },
    { url: 'https://www.youtube.com/watch?v=30VMIEmA114', title: 'Managing Panic Attacks', titleMs: 'Menguruskan Serangan Panik', duration: 445 },
    { url: 'https://www.youtube.com/watch?v=MIr3RsUWrdo', title: 'Progressive Muscle Relaxation', titleMs: 'Relaksasi Otot Progresif', duration: 520 },
    { url: 'https://www.youtube.com/watch?v=odADwWzHR24', title: 'Mindfulness for Anxiety', titleMs: 'Kesedaran Penuh untuk Kebimbangan', duration: 600 },
  ],
  depression: [
    { url: 'https://www.youtube.com/watch?v=z-IR48Mb3W0', title: 'Understanding Depression', titleMs: 'Memahami Kemurungan', duration: 287 },
    { url: 'https://www.youtube.com/watch?v=XiCrniLQGYc', title: 'Behavioral Activation', titleMs: 'Pengaktifan Tingkah Laku', duration: 350 },
    { url: 'https://www.youtube.com/watch?v=SEfs5TJZ6Nk', title: 'Mindful Breathing', titleMs: 'Pernafasan Kesedaran Penuh', duration: 320 },
    { url: 'https://www.youtube.com/watch?v=WPPPFqsECz0', title: 'Challenging Negative Thoughts', titleMs: 'Mencabar Pemikiran Negatif', duration: 410 },
    { url: 'https://www.youtube.com/watch?v=d96akWDnx0w', title: 'Building Daily Routines', titleMs: 'Membina Rutin Harian', duration: 280 },
    { url: 'https://www.youtube.com/watch?v=NQcYZplTXnQ', title: 'Self-Compassion Practice', titleMs: 'Amalan Belas Kasihan Diri', duration: 390 },
    { url: 'https://www.youtube.com/watch?v=1Evwgu369Jw', title: 'Moving Forward', titleMs: 'Melangkah ke Hadapan', duration: 340 },
  ],
  insomnia: [
    { url: 'https://www.youtube.com/watch?v=t0kACis_dJE', title: 'Understanding Insomnia', titleMs: 'Memahami Insomnia', duration: 445 },
    { url: 'https://www.youtube.com/watch?v=nm1TxQj9IsQ', title: 'Sleep Hygiene Tips', titleMs: 'Tips Kebersihan Tidur', duration: 289 },
    { url: 'https://www.youtube.com/watch?v=LGtSLm5dJF4', title: 'Sleep Diary Guide', titleMs: 'Panduan Diari Tidur', duration: 320 },
    { url: 'https://www.youtube.com/watch?v=ihO02wUzgkc', title: 'Relaxation for Sleep', titleMs: 'Relaksasi untuk Tidur', duration: 612 },
    { url: 'https://www.youtube.com/watch?v=rvaqPPjtxng', title: 'Stimulus Control', titleMs: 'Kawalan Rangsangan', duration: 380 },
    { url: 'https://www.youtube.com/watch?v=aXItOY0sLRY', title: 'Cognitive Therapy for Sleep', titleMs: 'Terapi Kognitif untuk Tidur', duration: 420 },
    { url: 'https://www.youtube.com/watch?v=1ZYbU82GVz4', title: 'Sleep Maintenance', titleMs: 'Penyelenggaraan Tidur', duration: 360 },
  ],
  ocd: [
    { url: 'https://www.youtube.com/watch?v=I8Jofzx_8p4', title: 'Understanding OCD', titleMs: 'Memahami OCD', duration: 398 },
    { url: 'https://www.youtube.com/watch?v=epDVMBNXsXY', title: 'OCD Self-Assessment', titleMs: 'Penilaian Kendiri OCD', duration: 320 },
    { url: 'https://www.youtube.com/watch?v=CFQ8Ub_5SEC', title: 'The OCD Cycle', titleMs: 'Kitaran OCD', duration: 380 },
    { url: 'https://www.youtube.com/watch?v=aMJkn27K5K4', title: 'Fear Hierarchy', titleMs: 'Hierarki Ketakutan', duration: 350 },
    { url: 'https://www.youtube.com/watch?v=1lTtgQx8Kag', title: 'ERP Introduction', titleMs: 'Pengenalan ERP', duration: 450 },
    { url: 'https://www.youtube.com/watch?v=jBqdEvD8VPw', title: 'ERP Practice', titleMs: 'Amalan ERP', duration: 410 },
  ],
  ptsd: [
    { url: 'https://www.youtube.com/watch?v=b_n9qegR7C4', title: 'Understanding PTSD', titleMs: 'Memahami PTSD', duration: 356 },
    { url: 'https://www.youtube.com/watch?v=OadokY8fcAA', title: 'PTSD Assessment', titleMs: 'Penilaian PTSD', duration: 320 },
    { url: 'https://www.youtube.com/watch?v=Uvli7NBUfY4', title: 'Deep Breathing', titleMs: 'Pernafasan Dalam', duration: 280 },
    { url: 'https://www.youtube.com/watch?v=hFkCTUPPqKA', title: 'Progressive Muscle Relaxation', titleMs: 'Relaksasi Otot Progresif', duration: 450 },
    { url: 'https://www.youtube.com/watch?v=ZidGozDhOjg', title: 'Mindfulness Practice', titleMs: 'Amalan Kesedaran Penuh', duration: 380 },
    { url: 'https://www.youtube.com/watch?v=nmJDkzDMllc', title: 'Cognitive Approach', titleMs: 'Pendekatan Kognitif', duration: 410 },
    { url: 'https://www.youtube.com/watch?v=G7zAseaIyFA', title: 'Behavioral Modification', titleMs: 'Pengubahsuaian Tingkah Laku', duration: 390 },
    { url: 'https://www.youtube.com/watch?v=ITTxTCz4Ums', title: 'Recovery Planning', titleMs: 'Perancangan Pemulihan', duration: 340 },
  ],
  'marital-distress': [
    { url: 'https://www.youtube.com/watch?v=AKTyPgwfPgg', title: 'Understanding Marital Stress', titleMs: 'Memahami Tekanan Perkahwinan', duration: 380 },
    { url: 'https://www.youtube.com/watch?v=YFWGnsc_vrc', title: 'Communication Skills', titleMs: 'Kemahiran Komunikasi', duration: 420 },
    { url: 'https://www.youtube.com/watch?v=1o30Ps-_8is', title: 'Emotion Management', titleMs: 'Pengurusan Emosi', duration: 350 },
    { url: 'https://www.youtube.com/watch?v=PrvtOWEXDIQ', title: 'Conflict Resolution', titleMs: 'Penyelesaian Konflik', duration: 450 },
    { url: 'https://www.youtube.com/watch?v=ghVdzAeX0bg', title: 'Quality Time Together', titleMs: 'Masa Berkualiti Bersama', duration: 320 },
    { url: 'https://www.youtube.com/watch?v=Cprp3Ky5A3o', title: 'Moving Forward', titleMs: 'Melangkah ke Hadapan', duration: 380 },
  ],
  'sexual-addiction': [
    { url: 'https://www.youtube.com/watch?v=wSF82AwSDiU', title: 'Understanding Addiction', titleMs: 'Memahami Ketagihan', duration: 420 },
    { url: 'https://www.youtube.com/watch?v=FMJgZ4s2E3w', title: 'Identifying Behaviors', titleMs: 'Mengenal Pasti Tingkah Laku', duration: 350 },
    { url: 'https://www.youtube.com/watch?v=aS7sBlpj9-E', title: 'Warning Signs', titleMs: 'Tanda Amaran', duration: 320 },
    { url: 'https://www.youtube.com/watch?v=1Ya67aLaaCc', title: 'Causes and Effects', titleMs: 'Punca dan Kesan', duration: 390 },
    { url: 'https://www.youtube.com/watch?v=aSBIs0xL8Mc', title: 'Self-Assessment', titleMs: 'Penilaian Kendiri', duration: 280 },
    { url: 'https://www.youtube.com/watch?v=p5RIbh0THqM', title: 'Daily Monitoring', titleMs: 'Pemantauan Harian', duration: 340 },
    { url: 'https://www.youtube.com/watch?v=sQ5CYw--g90', title: 'Recovery Support', titleMs: 'Sokongan Pemulihan', duration: 410 },
  ],
  suicidal: [
    { url: 'https://www.youtube.com/watch?v=D1QoyTmeAYw', title: 'Crisis Resources', titleMs: 'Sumber Krisis', duration: 280 },
    { url: 'https://www.youtube.com/watch?v=VGu0WNPKI2k', title: 'Understanding Risk', titleMs: 'Memahami Risiko', duration: 350 },
    { url: 'https://www.youtube.com/watch?v=7CIq4mtiamY', title: 'Emotion Regulation', titleMs: 'Pengawalan Emosi', duration: 420 },
    { url: 'https://www.youtube.com/watch?v=tfDSLpLgQ0k', title: 'Challenging Thoughts', titleMs: 'Mencabar Pemikiran', duration: 380 },
    { url: 'https://www.youtube.com/watch?v=eQNw2FBnpPo', title: 'Alternative Behaviors', titleMs: 'Tingkah Laku Alternatif', duration: 340 },
    { url: 'https://www.youtube.com/watch?v=WcSUs9iZv-g', title: 'Coping Skills', titleMs: 'Kemahiran Daya Tindak', duration: 390 },
    { url: 'https://www.youtube.com/watch?v=z_JZPteNxQY', title: 'Community Support', titleMs: 'Sokongan Komuniti', duration: 320 },
  ],
};

// Generate summary from content (first ~150 chars of meaningful text)
function generateSummary(content: string | null, title: string): string {
  if (!content) return `Learn about ${title.toLowerCase()}.`;

  // Remove markdown headers and get first paragraph
  const cleaned = content
    .replace(/^#+\s+.*$/gm, '') // Remove headers
    .replace(/\*\*/g, '')       // Remove bold
    .replace(/\n+/g, ' ')       // Single line
    .trim();

  if (cleaned.length <= 150) return cleaned;

  // Cut at word boundary
  const truncated = cleaned.substring(0, 150);
  const lastSpace = truncated.lastIndexOf(' ');
  return truncated.substring(0, lastSpace) + '...';
}

async function main() {
  console.log('🚀 Starting edited content seed (using actual KB content)...\n');

  // Fetch all chapters WITH their KB article content
  const { data: chapters, error } = await supabase
    .from('intervention_chapters')
    .select(`
      id,
      title,
      title_ms,
      chapter_order,
      intervention_id,
      kb_article_id,
      interventions!inner (
        id,
        category,
        name
      ),
      kb_articles (
        id,
        content
      )
    `)
    .order('intervention_id')
    .order('chapter_order');

  if (error) {
    console.error('Error fetching chapters:', error);
    return;
  }

  console.log(`📚 Found ${chapters?.length || 0} chapters to process\n`);

  let totalInserted = 0;
  let totalErrors = 0;
  let currentCategory = '';

  for (const ch of chapters || []) {
    const intervention = (ch as any).interventions;
    const kbArticle = (ch as any).kb_articles;
    const category = intervention?.category || 'general';

    // Log category header
    if (category !== currentCategory) {
      currentCategory = category;
      const categoryChapters = chapters?.filter((c: any) => c.interventions?.category === category) || [];
      console.log(`\n📁 Processing ${category} (${categoryChapters.length} chapters)...`);
    }

    // Get video for this chapter
    const videos = videosByCategory[category] || [];
    const video = videos[(ch.chapter_order - 1) % videos.length] || videos[0];

    // Use actual KB content (no MS version in KB, will use EN for both)
    const contentEn = kbArticle?.content || null;
    const contentMs = contentEn; // Use same content for MS (KB only has EN)

    // Generate summary from actual content
    const summaryEn = generateSummary(contentEn, ch.title);
    const summaryMs = generateSummary(contentMs, ch.title_ms || ch.title);

    const { error: insertError } = await supabase
      .from('intervention_content_edited')
      .upsert({
        chapter_id: ch.id,
        title_en: ch.title,
        title_ms: ch.title_ms || ch.title,
        content_en: contentEn,  // Use actual KB content
        content_ms: contentMs,  // Use actual KB content
        summary_en: summaryEn,
        summary_ms: summaryMs,
        video_url: video?.url || null,
        video_provider: video ? 'youtube' : null,
        video_title: video?.title || null,
        video_title_ms: video?.titleMs || null,
        video_duration_seconds: video?.duration || null,
        is_published: true,
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'chapter_id',
      });

    if (insertError) {
      console.error(`  ❌ Error for chapter ${ch.id}:`, insertError.message);
      totalErrors++;
    } else {
      const hasContent = contentEn ? '✓' : '✗';
      console.log(`  ✅ ${ch.chapter_order}. ${ch.title} [KB: ${hasContent}]`);
      totalInserted++;
    }
  }

  console.log(`\n${'='.repeat(50)}`);
  console.log(`✨ Seeding complete!`);
  console.log(`   ✅ Inserted/Updated: ${totalInserted}`);
  console.log(`   ❌ Errors: ${totalErrors}`);
  console.log(`${'='.repeat(50)}\n`);
}

main().catch(console.error);
