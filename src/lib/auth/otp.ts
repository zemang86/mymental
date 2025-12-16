/**
 * OTP (One-Time Password) system with database storage
 * Generates and stores 6-digit codes for email verification
 */

import { createClient } from '@supabase/supabase-js';

const OTP_LENGTH = 6;
const OTP_EXPIRY_MS = 10 * 60 * 1000; // 10 minutes
const MAX_ATTEMPTS = 5;

// Create a Supabase client with service role for OTP operations
function getSupabaseClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

/**
 * Generate a random 6-digit OTP code
 */
export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Store OTP for an email in database
 */
export async function storeOTP(email: string, code: string): Promise<void> {
  const supabase = getSupabaseClient();
  const normalizedEmail = email.toLowerCase();

  // Delete any existing OTP for this email
  await supabase
    .from('otp_codes')
    .delete()
    .eq('email', normalizedEmail);

  // Insert new OTP
  const expiresAt = new Date(Date.now() + OTP_EXPIRY_MS);
  await supabase
    .from('otp_codes')
    .insert({
      email: normalizedEmail,
      code,
      expires_at: expiresAt.toISOString(),
      attempts: 0,
    });

  // Clean up expired OTPs periodically
  await cleanupExpiredOTPs();
}

/**
 * Verify OTP code from database
 */
export async function verifyOTP(email: string, code: string): Promise<{ success: boolean; error?: string }> {
  const supabase = getSupabaseClient();
  const normalizedEmail = email.toLowerCase();

  // Get OTP record
  const { data: stored, error: fetchError } = await supabase
    .from('otp_codes')
    .select('*')
    .eq('email', normalizedEmail)
    .single();

  if (fetchError || !stored) {
    return { success: false, error: 'No OTP found. Please request a new code.' };
  }

  // Check if expired
  if (new Date(stored.expires_at) < new Date()) {
    await supabase.from('otp_codes').delete().eq('email', normalizedEmail);
    return { success: false, error: 'OTP expired. Please request a new code.' };
  }

  // Check max attempts
  if (stored.attempts >= MAX_ATTEMPTS) {
    await supabase.from('otp_codes').delete().eq('email', normalizedEmail);
    return { success: false, error: 'Too many attempts. Please request a new code.' };
  }

  // Verify code
  if (stored.code !== code) {
    // Increment attempts
    await supabase
      .from('otp_codes')
      .update({ attempts: stored.attempts + 1 })
      .eq('email', normalizedEmail);

    return { success: false, error: 'Invalid code. Please try again.' };
  }

  // Success - delete OTP
  await supabase.from('otp_codes').delete().eq('email', normalizedEmail);
  return { success: true };
}

/**
 * Clean up expired OTPs from database
 */
async function cleanupExpiredOTPs(): Promise<void> {
  const supabase = getSupabaseClient();
  await supabase
    .from('otp_codes')
    .delete()
    .lt('expires_at', new Date().toISOString());
}

/**
 * Get remaining time for OTP (for rate limiting)
 */
export async function getOTPRemainingTime(email: string): Promise<number> {
  const supabase = getSupabaseClient();
  const { data: stored } = await supabase
    .from('otp_codes')
    .select('expires_at')
    .eq('email', email.toLowerCase())
    .single();

  if (!stored) return 0;

  const remaining = new Date(stored.expires_at).getTime() - Date.now();
  return remaining > 0 ? remaining : 0;
}
