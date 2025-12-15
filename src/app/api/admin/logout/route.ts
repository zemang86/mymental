import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { logAccessEvent } from '@/lib/admin/auth';

export async function POST() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      await logAccessEvent(user.id, user.email || '', 'logout', true);
    }

    await supabase.auth.signOut();

    return NextResponse.redirect(new URL('/admin/login', process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'));
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.redirect(new URL('/admin/login', process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'));
  }
}
