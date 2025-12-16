import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY || 're_A8uJL9Dg_A7SPXhhVKeoUQCaA8q19tMbG');

const testCode = '123456';

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

    <div class="code">${testCode}</div>

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

async function testKitamenDomain() {
  try {
    console.log('📧 Testing kitamen.my domain with Resend...\n');

    const { data, error } = await resend.emails.send({
      from: 'MyMental <noreply@kitamen.my>',
      to: ['zemang86@gmail.com'],
      subject: `Your MyMental verification code: ${testCode}`,
      html: emailHtml,
    });

    if (error) {
      console.error('❌ Error:', error);
      process.exit(1);
    }

    console.log('✅ Test email sent successfully!');
    console.log('📧 Email ID:', data.id);
    console.log('📬 Check zemang86@gmail.com\n');
    console.log('From: MyMental <noreply@kitamen.my>');

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

testKitamenDomain();
