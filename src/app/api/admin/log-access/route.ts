import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { logAccessEvent } from '@/lib/admin/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, action, success } = body;

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    await logAccessEvent(
      user?.id || null,
      email || user?.email || 'unknown',
      action,
      success
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to log access event:', error);
    // Don't fail the request if logging fails
    return NextResponse.json({ success: false });
  }
}
