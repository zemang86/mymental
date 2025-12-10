/**
 * Chat API Endpoint
 * Handles AI chat with RAG-enhanced responses
 */

import { NextRequest, NextResponse } from 'next/server';
import { generateChatResponse, detectCrisis } from '@/lib/ai/rag';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, sessionId, userId, conversationHistory = [] } = body;

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID is required' },
        { status: 400 }
      );
    }

    // Check for user's risk level if userId provided
    let userRiskLevel: string | undefined;
    if (userId) {
      const { data: profile } = await supabaseAdmin
        .from('profiles')
        .select('risk_level')
        .eq('id', userId)
        .single();

      userRiskLevel = profile?.risk_level;

      // Block chat for high-risk users
      if (userRiskLevel === 'imminent' || userRiskLevel === 'high') {
        return NextResponse.json({
          response: `For your safety, the chat feature has been temporarily disabled.

Please reach out for immediate support:
- Talian Kasih: 15999 (24/7)
- Befrienders KL: 03-7956 8145 (24/7)

You are not alone. Help is available.`,
          blocked: true,
          crisisLevel: userRiskLevel,
        });
      }
    }

    // Quick crisis check before processing
    const crisisCheck = detectCrisis(message);
    if (crisisCheck.level === 'imminent') {
      // Log crisis event
      await supabaseAdmin.from('triage_events').insert({
        user_id: userId,
        session_id: sessionId,
        trigger_type: 'chat_message',
        trigger_question: 'chat_input',
        trigger_answer: message,
        risk_level: 'imminent',
        action_taken: 'chat_blocked',
        metadata: { source: 'chat_api' },
      });

      return NextResponse.json({
        response: `I'm very concerned about what you're sharing. Your safety is the most important thing right now.

Please reach out for immediate support:
- Talian Kasih: 15999 (24/7)
- Befrienders KL: 03-7956 8145 (24/7)
- Emergency Services: 999

You are not alone. These feelings can be overwhelming, but help is available right now.`,
        blocked: true,
        crisisLevel: 'imminent',
        crisisResources: true,
      });
    }

    // Store user message
    if (userId) {
      await supabaseAdmin.from('chat_messages').insert({
        user_id: userId,
        session_id: sessionId,
        role: 'user',
        content: message,
      });
    }

    // Generate RAG-enhanced response
    const result = await generateChatResponse(
      message,
      conversationHistory,
      userRiskLevel
    );

    // Store assistant response
    if (userId) {
      await supabaseAdmin.from('chat_messages').insert({
        user_id: userId,
        session_id: sessionId,
        role: 'assistant',
        content: result.response,
        metadata: {
          sources: result.sources.map(s => s.id),
          crisis_level: result.crisisLevel,
        },
      });
    }

    // If crisis detected during response generation, log it
    if (result.isCrisis) {
      await supabaseAdmin.from('triage_events').insert({
        user_id: userId,
        session_id: sessionId,
        trigger_type: 'chat_message',
        trigger_question: 'chat_input',
        trigger_answer: message,
        risk_level: result.crisisLevel,
        action_taken: result.crisisLevel === 'imminent' ? 'chat_blocked' : 'crisis_resources_shown',
        metadata: { source: 'chat_api' },
      });
    }

    return NextResponse.json({
      response: result.response,
      sources: result.sources.map(s => ({
        id: s.id,
        title: s.title,
        condition: s.condition,
      })),
      crisisLevel: result.crisisLevel,
      blocked: result.crisisLevel === 'imminent',
    });
  } catch (error) {
    console.error('Chat API error:', error);

    // Provide helpful error message
    return NextResponse.json(
      {
        error: 'Failed to generate response',
        fallbackResponse: `I apologize, but I'm having trouble responding right now.

If you need immediate support, please contact:
- Talian Kasih: 15999 (24/7)
- Befrienders KL: 03-7956 8145 (24/7)`,
      },
      { status: 500 }
    );
  }
}

// GET endpoint to retrieve chat history
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');
    const userId = searchParams.get('userId');

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID is required' },
        { status: 400 }
      );
    }

    let query = supabaseAdmin
      .from('chat_messages')
      .select('id, role, content, created_at')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: true });

    if (userId) {
      query = query.eq('user_id', userId);
    }

    const { data, error } = await query;

    if (error) {
      throw error;
    }

    return NextResponse.json({
      messages: data || [],
    });
  } catch (error) {
    console.error('Chat history error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve chat history' },
      { status: 500 }
    );
  }
}
