/**
 * Send Crisis Resources Email
 * Sends emergency resources and hotlines to high-risk users
 */

import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase/admin-client';
import { sendEmail } from '@/lib/email';

interface UserProfile {
  email: string;
  full_name: string;
  preferred_language: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, riskLevel, referralId } = body;

    if (!userId || !riskLevel) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const admin = getSupabaseAdmin();

    // Get user profile for email
    const { data: profile, error: profileError } = await admin
      .from('profiles')
      .select('email, full_name, preferred_language')
      .eq('id', userId)
      .single<UserProfile>();

    if (profileError || !profile || !profile.email) {
      return NextResponse.json(
        { error: 'User email not found' },
        { status: 404 }
      );
    }

    const locale = profile.preferred_language || 'en';
    const isUrgent = riskLevel === 'imminent';

    // Crisis hotlines for Malaysia
    const crisisHotlines = {
      en: [
        {
          name: 'Befrienders KL',
          phone: '03-7627 2929',
          hours: '24/7',
          description: 'Emotional support and suicide prevention helpline',
        },
        {
          name: 'Talian Kasih (Women & Children)',
          phone: '15999',
          hours: '24/7',
          description: 'Crisis hotline for women, children, and families',
        },
        {
          name: 'MIASA Helpline',
          phone: '1800-820-066',
          hours: 'Mon-Fri 9AM-5PM',
          description: 'Mental Illness Awareness & Support Association',
        },
      ],
      ms: [
        {
          name: 'Befrienders KL',
          phone: '03-7627 2929',
          hours: '24 jam',
          description: 'Talian sokongan emosi dan pencegahan bunuh diri',
        },
        {
          name: 'Talian Kasih (Wanita & Kanak-kanak)',
          phone: '15999',
          hours: '24 jam',
          description: 'Talian kecemasan untuk wanita, kanak-kanak dan keluarga',
        },
        {
          name: 'Talian MIASA',
          phone: '1800-820-066',
          hours: 'Isnin-Jumaat 9AM-5PM',
          description: 'Persatuan Kesedaran & Sokongan Penyakit Mental',
        },
      ],
    };

    const hotlines = crisisHotlines[locale as 'en' | 'ms'];

    // Email content
    const subject = isUrgent
      ? locale === 'ms' ? 'Sumber Kecemasan - Serini' : 'Emergency Resources - Serini'
      : locale === 'ms' ? 'Sumber Sokongan Mental - Serini' : 'Mental Health Resources - Serini';

    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .urgent-banner { background-color: #dc2626; color: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
    .hotline { background-color: #f3f4f6; padding: 15px; margin-bottom: 15px; border-radius: 8px; }
    .hotline-name { font-weight: bold; font-size: 18px; color: #1f2937; }
    .hotline-phone { font-size: 24px; color: #059669; font-weight: bold; margin: 10px 0; }
    .hotline-hours { color: #6b7280; font-size: 14px; }
    .hotline-desc { color: #4b5563; margin-top: 8px; }
    .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 14px; }
  </style>
</head>
<body>
  <div class="container">
    ${isUrgent ? `
    <div class="urgent-banner">
      <h2 style="margin: 0 0 10px 0;">⚠️ ${locale === 'ms' ? 'Bantuan Kecemasan Tersedia' : 'Emergency Help Available'}</h2>
      <p style="margin: 0; font-size: 16px;">
        ${locale === 'ms' 
          ? 'Jika anda dalam krisis atau mempunyai fikiran untuk mencederakan diri, sila hubungi talian kecemasan ini SEKARANG.'
          : 'If you are in crisis or having thoughts of self-harm, please contact these emergency hotlines NOW.'}
      </p>
    </div>
    ` : ''}
    
    <h1>${locale === 'ms' ? 'Sumber Sokongan Kesihatan Mental' : 'Mental Health Support Resources'}</h1>
    
    <p>
      ${locale === 'ms'
        ? 'Kami menerima maklum balas anda dan ingin membantu. Berikut adalah sumber yang boleh anda hubungi untuk sokongan profesional:'
        : 'We have received your assessment and want to help. Here are resources you can contact for professional support:'}
    </p>

    <h2>${locale === 'ms' ? '📞 Talian Kecemasan 24/7' : '📞 24/7 Crisis Hotlines'}</h2>
    ${hotlines.map(hotline => `
      <div class="hotline">
        <div class="hotline-name">${hotline.name}</div>
        <div class="hotline-phone">${hotline.phone}</div>
        <div class="hotline-hours">${hotline.hours}</div>
        <div class="hotline-desc">${hotline.description}</div>
      </div>
    `).join('')}

    <h2>${locale === 'ms' ? '🏥 Langkah Seterusnya' : '🏥 Next Steps'}</h2>
    <p>
      ${locale === 'ms'
        ? 'Pasukan kami sedang mengkaji rujukan anda. Kami akan menghubungi anda dalam masa 24-48 jam untuk membantu anda berhubung dengan profesional kesihatan mental yang sesuai.'
        : 'Our team is reviewing your referral. We will contact you within 24-48 hours to help connect you with an appropriate mental health professional.'}
    </p>

    ${isUrgent ? `
    <div style="background-color: #fef3c7; padding: 15px; border-radius: 8px; margin-top: 20px;">
      <p style="margin: 0; color: #92400e; font-weight: bold;">
        ${locale === 'ms'
          ? '⚠️ Jika anda merasa dalam bahaya segera, sila hubungi 999 atau pergi ke jabatan kecemasan hospital terdekat.'
          : '⚠️ If you feel you are in immediate danger, please call 999 or go to your nearest hospital emergency department.'}
      </p>
    </div>
    ` : ''}

    <div class="footer">
      <p>
        ${locale === 'ms'
          ? 'Anda menerima emel ini kerana anda melengkapkan penilaian di Serini. Rujukan anda adalah sulit.'
          : 'You are receiving this email because you completed an assessment at Serini. Your referral is confidential.'}
      </p>
      <p>
        ${locale === 'ms' ? 'ID Rujukan' : 'Referral ID'}: ${referralId || 'N/A'}
      </p>
    </div>
  </div>
</body>
</html>
    `;

    // Send email
    await sendEmail({
      to: profile.email,
      subject,
      html: htmlContent,
    });

    return NextResponse.json({
      success: true,
      message: 'Crisis resources email sent',
    });
  } catch (error) {
    console.error('Error sending crisis resources email:', error);
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    );
  }
}
