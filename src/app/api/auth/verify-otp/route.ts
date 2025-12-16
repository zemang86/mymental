import { NextRequest, NextResponse } from 'next/server';
import { createClient, createAdminClient } from '@/lib/supabase/server';
import { verifyOTP } from '@/lib/auth/otp';

/**
 * POST /api/auth/verify-otp
 * Verify OTP code and create/login user
 */
export async function POST(request: NextRequest) {
  try {
    const { email, otp } = await request.json();

    if (!email || !otp) {
      return NextResponse.json(
        { error: 'Email and OTP are required' },
        { status: 400 }
      );
    }

    // Verify OTP code
    const result = await verifyOTP(email, otp);

    if (!result.success) {
      console.log('❌ OTP verification failed:', result.error);
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      );
    }

    console.log('✅ OTP verified successfully for:', email);

    // Use admin client for user creation
    const adminClient = await createAdminClient();

    // Use regular client for session management
    const supabase = await createClient();

    // Generate a temporary password for authentication
    const tempPassword = crypto.randomUUID();

    // Try to create new user with admin API
    const { data: userData, error: createError } = await adminClient.auth.admin.createUser({
      email: email,
      password: tempPassword,
      email_confirm: true, // Skip email confirmation since we verified OTP
      user_metadata: {
        created_via: 'checkout_otp',
        verified_at: new Date().toISOString(),
      },
    });

    // Handle if user already exists
    if (createError) {
      const isUserExists =
        createError.message.includes('already registered') ||
        createError.message.includes('already exists') ||
        (createError as any).code === 'email_exists' ||
        (createError as any).code === 'user_already_exists';

      if (isUserExists) {
        // Get existing user and update their password temporarily
        const { data: { users } } = await adminClient.auth.admin.listUsers();
        const existingUser = users.find(u => u.email?.toLowerCase() === email.toLowerCase());

        if (existingUser) {
          // Update password temporarily for sign-in
          await adminClient.auth.admin.updateUserById(existingUser.id, {
            password: tempPassword,
          });
        } else {
          return NextResponse.json(
            { error: 'User exists but could not be found' },
            { status: 500 }
          );
        }
      } else {
        console.error('Error creating user:', createError);
        return NextResponse.json(
          { error: 'Failed to create account' },
          { status: 500 }
        );
      }
    }

    // Sign in with the temporary password (this sets cookies for the session)
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password: tempPassword,
    });

    if (signInError || !signInData.user) {
      console.error('Error signing in after account creation:', signInError);
      return NextResponse.json(
        { error: 'Account created but failed to sign in' },
        { status: 500 }
      );
    }

    // Create or update user profile
    const { error: profileError } = await supabase
      .from('profiles')
      .upsert({
        id: signInData.user.id,
        email: signInData.user.email,
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'id',
      });

    if (profileError) {
      console.error('Error creating profile:', profileError);
      // Don't fail the request if profile creation fails
    }

    return NextResponse.json({
      success: true,
      user: signInData.user,
    });
  } catch (error) {
    console.error('Error in verify-otp:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
