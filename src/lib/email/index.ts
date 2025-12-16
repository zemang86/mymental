import { Resend } from 'resend';
import { render } from '@react-email/components';
import AssessmentResultsEmail from '@/emails/assessment-results';

// Initialize Resend client
const resend = new Resend(process.env.RESEND_API_KEY);

export interface SendAssessmentResultsParams {
  to: string;
  userName?: string;
  detectedConditions: string[];
  riskLevel: string;
  functionalLevel: string;
  socialFunctionScore: number;
}

/**
 * Send assessment results email to user
 */
export async function sendAssessmentResults({
  to,
  userName,
  detectedConditions,
  riskLevel,
  functionalLevel,
  socialFunctionScore,
}: SendAssessmentResultsParams) {
  try {
    const emailHtml = render(
      AssessmentResultsEmail({
        userName,
        detectedConditions,
        riskLevel,
        functionalLevel,
        socialFunctionScore,
      })
    );

    // Use Resend onboarding domain for testing, or custom domain for production
    const fromEmail = process.env.NEXT_PUBLIC_FROM_EMAIL || 'onboarding@resend.dev';
    const fromName = fromEmail.includes('onboarding') ? 'MyMental (Test)' : 'MyMental';

    const { data, error } = await resend.emails.send({
      from: `${fromName} <${fromEmail}>`,
      to: [to],
      subject: 'Your MyMental Assessment Results',
      html: emailHtml,
    });

    if (error) {
      console.error('Error sending email:', error);
      throw new Error('Failed to send email');
    }

    return { success: true, id: data?.id };
  } catch (error) {
    console.error('Email sending error:', error);
    throw error;
  }
}

/**
 * Check if email service is configured
 */
export function isEmailConfigured(): boolean {
  return !!(process.env.RESEND_API_KEY && process.env.NEXT_PUBLIC_FROM_EMAIL);
}
