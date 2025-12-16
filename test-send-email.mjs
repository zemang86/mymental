import { Resend } from 'resend';
import { render } from '@react-email/components';
import { createElement } from 'react';

const resend = new Resend('re_A8uJL9Dg_A7SPXhhVKeoUQCaA8q19tMbG');

// Assessment results email HTML (simplified version of the template)
const assessmentEmailHtml = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; background-color: #f6f9fc; margin: 0; padding: 20px; }
    .container { max-width: 600px; margin: 0 auto; background: white; padding: 40px; border-radius: 8px; }
    h1 { color: #333; margin-bottom: 20px; }
    h2 { color: #333; font-size: 20px; margin-top: 30px; }
    .result-box { background: #f3f4f6; border-radius: 8px; padding: 16px; margin: 12px 0; }
    .label { color: #6b7280; font-size: 14px; margin-bottom: 4px; }
    .value { color: #111827; font-size: 18px; font-weight: 600; text-transform: capitalize; }
    .condition-list { margin: 16px 0; padding-left: 20px; }
    .condition-item { color: #333; font-size: 16px; line-height: 24px; margin-bottom: 8px; }
    .button { display: inline-block; background: #5046e5; color: white; padding: 14px 20px; text-decoration: none; border-radius: 8px; margin: 20px 0; font-weight: 600; }
    .disclaimer { color: #8898aa; font-size: 13px; line-height: 20px; margin: 20px 0; background: #fff3cd; padding: 16px; border-radius: 8px; border-left: 4px solid #ffc107; }
    hr { border: none; border-top: 1px solid #e6ebf1; margin: 20px 0; }
    .footer { color: #8898aa; font-size: 12px; text-align: center; margin-top: 30px; }
  </style>
</head>
<body>
  <div class="container">
    <h1>Your MyMental Assessment Results</h1>

    <p>Dear User,</p>

    <p>Thank you for completing your mental health assessment with MyMental. Below is a summary of your results.</p>

    <hr>

    <h2>Assessment Summary</h2>

    <div class="result-box">
      <div class="label">Risk Level:</div>
      <div class="value">MODERATE</div>
    </div>

    <div class="result-box">
      <div class="label">Functional Level:</div>
      <div class="value">moderate</div>
    </div>

    <div class="result-box">
      <div class="label">Social Function Score:</div>
      <div class="value">18/32</div>
    </div>

    <hr>

    <h2>Detected Concerns</h2>
    <p>Your responses suggest you may be experiencing symptoms related to:</p>
    <ul class="condition-list">
      <li class="condition-item">Depression (Kemurungan)</li>
      <li class="condition-item">Anxiety (Kebimbangan)</li>
    </ul>

    <hr>

    <h2>Next Steps</h2>
    <p>We recommend taking detailed assessments for each detected concern to get a more comprehensive evaluation and personalized recommendations.</p>

    <a href="http://localhost:3000/dashboard" class="button">
      View Full Results in Dashboard
    </a>

    <hr>

    <div class="disclaimer">
      <strong>⚠️ Important Disclaimer:</strong> This is a screening tool and not a diagnostic instrument. If you are experiencing a mental health crisis or emergency, please contact emergency services immediately or call a crisis hotline.
      <br><br>
      <strong>Malaysia Crisis Hotlines:</strong>
      <br>• Befrienders: 03-7627 2929
      <br>• Talian Kasih: 15999
    </div>

    <div class="footer">
      MyMental - Your Mental Health Companion
      <br>
      © 2024 MyMental. All rights reserved.
    </div>
  </div>
</body>
</html>
`;

async function sendTestAssessmentEmail() {
  try {
    console.log('📧 Sending assessment results email...\n');

    const { data, error } = await resend.emails.send({
      from: 'MyMental (Test) <onboarding@resend.dev>',
      to: ['damauraapp@gmail.com'],
      subject: '📊 Your MyMental Assessment Results',
      html: assessmentEmailHtml,
    });

    if (error) {
      console.error('❌ Error:', error);
      process.exit(1);
    }

    console.log('✅ Assessment results email sent!');
    console.log('📧 Email ID:', data.id);
    console.log('📬 Check damauraapp@gmail.com\n');

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

sendTestAssessmentEmail();
