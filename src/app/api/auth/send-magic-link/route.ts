import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { generateOTP, storeOTP } from '@/lib/auth/otp';

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * POST /api/auth/send-magic-link
 * Send 6-digit OTP code to email via Resend
 */
export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Generate 6-digit OTP
    const code = generateOTP();

    // Store OTP (expires in 10 minutes)
    await storeOTP(email, code);

    // Email HTML
    const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; background-color: #f6f9fc; margin: 0; padding: 20px; }
    .container { max-width: 600px; margin: 0 auto; background: white; padding: 40px; border-radius: 8px; text-align: center; }
    h1 { color: #333; margin-bottom: 10px; }
    .code { font-size: 48px; font-weight: bold; letter-spacing: 8px; color: #5046e5; background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 30px 0; font-family: monospace; }
    .info { color: #6b7280; font-size: 14px; margin-top: 20px; }
    .footer { color: #8898aa; font-size: 12px; margin-top: 30px; }
  </style>
</head>
<body>
  <div class="container">
    <h1>🔐 Your Verification Code</h1>
    <p style="color: #6b7280; font-size: 16px;">Enter this code to continue with your MyMental purchase:</p>

    <div class="code">${code}</div>

    <div class="info">
      <p><strong>This code expires in 10 minutes.</strong></p>
      <p>If you didn't request this code, you can safely ignore this email.</p>
    </div>

    <div class="footer">
      MyMental - Your Mental Health Companion
      <br>© ${new Date().getFullYear()} MyMental. All rights reserved.
    </div>
  </div>
</body>
</html>
    `;

    // Send OTP via Resend
    const { error } = await resend.emails.send({
      from: 'MyMental <noreply@kitamen.my>',
      to: [email],
      subject: `Your MyMental verification code: ${code}`,
      html: emailHtml,
    });

    if (error) {
      console.error('Error sending OTP email:', error);
      return NextResponse.json(
        { error: 'Failed to send OTP' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'OTP sent to your email',
    });
  } catch (error) {
    console.error('Error in send-magic-link:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
