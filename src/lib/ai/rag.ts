/**
 * RAG (Retrieval-Augmented Generation) Service
 * Combines vector search with Claude for intelligent responses
 */

import Anthropic from '@anthropic-ai/sdk';
import { generateEmbedding, searchSimilarDocuments, type KBArticle } from './embeddings';
import { SYSTEM_PROMPTS, buildChatPrompt, buildResultPrompt, CRISIS_RESPONSE } from './prompts';
import type { AssessmentInsights } from '@/types/insights';

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

/**
 * Generate structured assessment insights
 * Returns a JSON object with parsed, actionable insights
 */
export async function generateStructuredInsights(
  assessmentType: string,
  score: number,
  maxScore: number,
  severity: string,
  riskLevel: string
): Promise<AssessmentInsights> {
  // Build search query based on assessment
  const searchQuery = `${assessmentType} ${severity} coping strategies treatment recommendations`;

  // Retrieve relevant context
  const articles = await retrieveContext(searchQuery, 4);
  const context = formatContext(articles);

  const systemPrompt = `You are a mental health assessment analyzer. Generate structured insights in JSON format.
Your response must be valid JSON matching the exact structure specified.
Be compassionate but factual. Focus on actionable, helpful information.
Provide both English and Bahasa Malaysia translations for all text fields.`;

  const userPrompt = `Based on this ${assessmentType} assessment with score ${score}/${maxScore} (${severity} severity, ${riskLevel} risk level), generate structured insights.

Context from knowledge base:
${context}

Return a JSON object with this EXACT structure:
{
  "summary": "Brief 1-2 sentence summary in English",
  "summaryMs": "Same summary in Bahasa Malaysia",
  "keyFindings": [
    {"text": "Finding in English", "textMs": "Finding in Malay", "type": "positive|concern|neutral"}
  ],
  "recommendations": [
    {"text": "Recommendation in English", "textMs": "Recommendation in Malay", "priority": "high|medium|low"}
  ],
  "copingStrategies": [
    {"title": "Strategy title", "titleMs": "Tajuk strategi", "description": "Description", "descriptionMs": "Penerangan"}
  ],
  "riskFactors": [
    {"text": "Risk factor", "textMs": "Faktor risiko", "level": "low|moderate|high"}
  ],
  "nextSteps": [
    {"action": "Action to take", "actionMs": "Tindakan", "urgency": "immediate|soon|when_ready"}
  ]
}

Guidelines:
- keyFindings: 3-4 items based on severity
- recommendations: 3 actionable items appropriate for severity level
- copingStrategies: 2-3 practical self-help strategies
- riskFactors: Only include if severity is moderate or above (empty array for minimal/mild)
- nextSteps: 2-3 concrete next steps

For ${severity} severity:
${severity.toLowerCase().includes('severe') ? '- Include urgent professional help in nextSteps\n- Include crisis hotline in recommendations' : ''}
${severity.toLowerCase().includes('moderate') ? '- Suggest considering professional consultation\n- Focus on self-monitoring and self-help' : ''}
${severity.toLowerCase().includes('mild') || severity.toLowerCase().includes('minimal') ? '- Focus on maintenance and prevention\n- Encourage continued self-care practices' : ''}

Return ONLY valid JSON, no markdown or explanation.`;

  try {
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2048,
      system: systemPrompt,
      messages: [{ role: 'user', content: userPrompt }],
    });

    const responseText = response.content[0].type === 'text'
      ? response.content[0].text
      : '';

    // Parse JSON response
    const parsed = JSON.parse(responseText);

    // Return with metadata
    return {
      ...parsed,
      generatedAt: new Date().toISOString(),
      assessmentType,
      severity,
      score,
    };
  } catch (error) {
    console.error('Error generating structured insights:', error);

    // Return fallback insights if AI fails
    return generateFallbackInsights(assessmentType, score, maxScore, severity, riskLevel);
  }
}

/**
 * Generate fallback insights when AI fails
 */
function generateFallbackInsights(
  assessmentType: string,
  score: number,
  maxScore: number,
  severity: string,
  riskLevel: string
): AssessmentInsights {
  const isSevere = severity.toLowerCase().includes('severe');
  const isModerate = severity.toLowerCase().includes('moderate');

  return {
    summary: `Your ${assessmentType} assessment indicates ${severity.toLowerCase()} symptoms. This screening provides a starting point for understanding your mental health.`,
    summaryMs: `Penilaian ${assessmentType} anda menunjukkan gejala ${severity.toLowerCase()}. Saringan ini memberikan titik permulaan untuk memahami kesihatan mental anda.`,
    keyFindings: [
      {
        text: `You scored ${score} out of ${maxScore} on the ${assessmentType} assessment`,
        textMs: `Anda mendapat skor ${score} daripada ${maxScore} dalam penilaian ${assessmentType}`,
        type: 'neutral',
      },
      {
        text: `This falls within the ${severity} range`,
        textMs: `Ini berada dalam julat ${severity}`,
        type: isSevere ? 'concern' : isModerate ? 'concern' : 'positive',
      },
    ],
    recommendations: isSevere ? [
      {
        text: 'Please consider speaking with a mental health professional',
        textMs: 'Sila pertimbangkan untuk bercakap dengan profesional kesihatan mental',
        priority: 'high',
      },
      {
        text: 'Reach out to trusted friends or family for support',
        textMs: 'Hubungi rakan atau keluarga yang dipercayai untuk sokongan',
        priority: 'high',
      },
      {
        text: 'Contact crisis helpline if needed: Talian Kasih 15999',
        textMs: 'Hubungi talian krisis jika perlu: Talian Kasih 15999',
        priority: 'high',
      },
    ] : [
      {
        text: 'Continue practicing self-care and healthy habits',
        textMs: 'Teruskan mengamalkan penjagaan diri dan tabiat sihat',
        priority: 'medium',
      },
      {
        text: 'Monitor your symptoms and retake assessment in 2-4 weeks',
        textMs: 'Pantau gejala anda dan ambil semula penilaian dalam 2-4 minggu',
        priority: 'medium',
      },
      {
        text: 'Consider talking to someone you trust about your feelings',
        textMs: 'Pertimbangkan untuk bercakap dengan seseorang yang anda percayai tentang perasaan anda',
        priority: 'low',
      },
    ],
    copingStrategies: [
      {
        title: 'Deep Breathing',
        titleMs: 'Pernafasan Dalam',
        description: 'Practice 4-7-8 breathing: inhale 4 seconds, hold 7, exhale 8',
        descriptionMs: 'Amalkan pernafasan 4-7-8: tarik nafas 4 saat, tahan 7, hembus 8',
      },
      {
        title: 'Physical Activity',
        titleMs: 'Aktiviti Fizikal',
        description: 'Even a 10-minute walk can help improve your mood',
        descriptionMs: 'Walaupun berjalan 10 minit boleh membantu memperbaiki mood anda',
      },
    ],
    riskFactors: isSevere || isModerate ? [
      {
        text: `${severity} symptoms may impact daily functioning`,
        textMs: `Gejala ${severity} mungkin memberi kesan kepada fungsi harian`,
        level: isSevere ? 'high' : 'moderate',
      },
    ] : [],
    nextSteps: isSevere ? [
      {
        action: 'Contact a mental health professional within the next few days',
        actionMs: 'Hubungi profesional kesihatan mental dalam beberapa hari akan datang',
        urgency: 'immediate',
      },
      {
        action: 'Share your results with someone you trust',
        actionMs: 'Kongsi keputusan anda dengan seseorang yang anda percayai',
        urgency: 'soon',
      },
    ] : [
      {
        action: 'Track your mood and symptoms over the next week',
        actionMs: 'Jejaki mood dan gejala anda sepanjang minggu depan',
        urgency: 'soon',
      },
      {
        action: 'Retake this assessment in 2-4 weeks to monitor changes',
        actionMs: 'Ambil semula penilaian ini dalam 2-4 minggu untuk memantau perubahan',
        urgency: 'when_ready',
      },
    ],
    generatedAt: new Date().toISOString(),
    assessmentType,
    severity,
    score,
  };
}
