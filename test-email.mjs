import { Resend } from 'resend';
import { render } from '@react-email/components';
import { createElement } from 'react';

const resend = new Resend('re_A8uJL9Dg_A7SPXhhVKeoUQCaA8q19tMbG');

// Simple test email HTML
const testEmailHtml = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; background-color: #f6f9fc; margin: 0; padding: 20px; }
    .container { max-width: 600px; margin: 0 auto; background: white; padding: 40px; border-radius: 8px; }
    h1 { color: #333; margin-bottom: 20px; }
    .badge { display: inline-block; background: #10b981; color: white; padding: 8px 16px; border-radius: 6px; font-weight: 600; }
    .info { background: #f3f4f6; padding: 16px; border-radius: 8px; margin: 20px 0; }
    .label { color: #6b7280; font-size: 14px; margin-bottom: 4px; }
    .value { color: #111827; font-size: 18px; font-weight: 600; }
  </style>
</head>
<body>
  <div class="container">
    <h1>🎉 MyMental Email Test Successful!</h1>

    <p>Congratulations! Your Resend integration is working perfectly.</p>

    <div class="info">
      <div class="label">Test Status:</div>
      <div class="value"><span class="badge">✓ SUCCESS</span></div>
    </div>

    <div class="info">
      <div class="label">Email Service:</div>
      <div class="value">Resend API</div>
    </div>

    <div class="info">
      <div class="label">From Address:</div>
      <div class="value">damauraapp@gmail.com</div>
    </div>

    <h2 style="margin-top: 30px;">✅ What's Working Now:</h2>
    <ul style="line-height: 1.8;">
      <li>Payment gate on 2nd screening</li>
      <li>Email results delivery system</li>
      <li>Video player (YouTube/Vimeo support)</li>
      <li>Professional referral system</li>
      <li>Database migrations completed</li>
    </ul>

    <p style="margin-top: 30px; color: #6b7280; font-size: 14px;">
      This is a test email from your MyMental mental health platform.
      Your assessment results will be sent in a similar format.
    </p>

    <hr style="border: none; border-top: 1px solid #e6ebf1; margin: 30px 0;">

    <p style="color: #8898aa; font-size: 12px; text-align: center;">
      MyMental - Your Mental Health Companion<br>
      © 2024 MyMental. All rights reserved.
    </p>
  </div>
</body>
</html>
`;

async function sendTestEmail() {
  try {
    console.log('🚀 Sending test email...\n');
    console.log('📝 Using Resend onboarding domain for testing\n');

    const { data, error } = await resend.emails.send({
      from: 'Acme <onboarding@resend.dev>',
      to: ['damauraapp@gmail.com'], // Your email to receive the test
      subject: '🎉 MyMental Email Test - SUCCESS!',
      html: testEmailHtml,
    });

    if (error) {
      console.error('❌ Error sending email:', error);
      process.exit(1);
    }

    console.log('✅ Email sent successfully!');
    console.log('📧 Email ID:', data.id);
    console.log('📬 Sent to: damauraapp@gmail.com');
    console.log('\n🎯 Check your inbox in a few seconds!\n');

  } catch (error) {
    console.error('❌ Unexpected error:', error);
    process.exit(1);
  }
}

sendTestEmail();
