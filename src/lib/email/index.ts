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
    const emailHtml = await render(
      AssessmentResultsEmail({
        userName,
        detectedConditions,
        riskLevel,
        functionalLevel,
        socialFunctionScore,
      })
    );

    // Use verified kitamen.my domain
    const fromEmail = process.env.NEXT_PUBLIC_FROM_EMAIL || 'noreply@kitamen.my';
    const fromName = 'MyMental';

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
 * Send a generic email with HTML content
 */
export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  try {
    const fromEmail = process.env.NEXT_PUBLIC_FROM_EMAIL || 'noreply@kitamen.my';
    const fromName = 'MyMental';

    const { data, error } = await resend.emails.send({
      from: `${fromName} <${fromEmail}>`,
      to: [to],
      subject,
      html,
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
