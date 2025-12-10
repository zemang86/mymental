/**
 * Auth Callback Route
 * Handles OAuth redirects and email confirmation links from Supabase
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const next = requestUrl.searchParams.get('next') || '/my-assessments';

  if (code) {
    const supabase = await createClient();

    // Exchange the code for a session
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.error('Auth callback error:', error);
      // Redirect to login with error
      return NextResponse.redirect(
        new URL(`/login?error=${encodeURIComponent(error.message)}`, requestUrl.origin)
      );
    }
  }

  // Redirect to the next page (default: my-assessments)
  return NextResponse.redirect(new URL(next, requestUrl.origin));
}
