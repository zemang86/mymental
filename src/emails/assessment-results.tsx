import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Heading,
  Text,
  Hr,
  Button,
} from '@react-email/components';

interface AssessmentResultsEmailProps {
  userName?: string;
  detectedConditions: string[];
  riskLevel: string;
  functionalLevel: string;
  socialFunctionScore: number;
}

export default function AssessmentResultsEmail({
  userName = 'User',
  detectedConditions = [],
  riskLevel = 'low',
  functionalLevel = 'moderate',
  socialFunctionScore = 0,
}: AssessmentResultsEmailProps) {
  const conditionNames: Record<string, string> = {
    depression: 'Depression',
    anxiety: 'Anxiety',
    ocd: 'Obsessive Compulsive Disorder (OCD)',
    ptsd: 'PTSD',
    insomnia: 'Insomnia',
    suicidal: 'Suicidal Ideation',
    psychosis: 'Psychosis',
    sexual_addiction: 'Sexual Addiction',
    marital_distress: 'Marital Distress',
  };

  return (
    <Html>
      <Head />
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Your MyMental Assessment Results</Heading>

          <Text style={text}>Dear {userName},</Text>

          <Text style={text}>
            Thank you for completing your mental health assessment with MyMental.
            Below is a summary of your results.
          </Text>

          <Hr style={hr} />

          <Section style={section}>
            <Heading style={h2}>Assessment Summary</Heading>

            <div style={resultBox}>
              <Text style={label}>Risk Level:</Text>
              <Text style={value}>{riskLevel.toUpperCase()}</Text>
            </div>

            <div style={resultBox}>
              <Text style={label}>Functional Level:</Text>
              <Text style={value}>{functionalLevel}</Text>
            </div>

            <div style={resultBox}>
              <Text style={label}>Social Function Score:</Text>
              <Text style={value}>{socialFunctionScore}/32</Text>
            </div>
          </Section>

          {detectedConditions.length > 0 && (
            <>
              <Hr style={hr} />
              <Section style={section}>
                <Heading style={h2}>Detected Concerns</Heading>
                <Text style={text}>
                  Your responses suggest you may be experiencing symptoms related to:
                </Text>
                <ul style={list}>
                  {detectedConditions.map((condition) => (
                    <li key={condition} style={listItem}>
                      {conditionNames[condition] || condition}
                    </li>
                  ))}
                </ul>
              </Section>
            </>
          )}

          <Hr style={hr} />

          <Section style={section}>
            <Heading style={h2}>Next Steps</Heading>
            <Text style={text}>
              We recommend taking detailed assessments for each detected concern to get
              a more comprehensive evaluation and personalized recommendations.
            </Text>

            <Button
              href={`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard`}
              style={button}
            >
              View Full Results in Dashboard
            </Button>
          </Section>

          <Hr style={hr} />

          <Text style={disclaimer}>
            <strong>Important Disclaimer:</strong> This is a screening tool and not a
            diagnostic instrument. If you are experiencing a mental health crisis or
            emergency, please contact emergency services immediately or call a crisis
            hotline.
          </Text>

          <Text style={footer}>
            MyMental - Your Mental Health Companion
            <br />
            © {new Date().getFullYear()} MyMental. All rights reserved.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

// Styles
const main = {
  backgroundColor: '#f6f9fc',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
  maxWidth: '600px',
};

const h1 = {
  color: '#333',
  fontSize: '28px',
  fontWeight: '700',
  margin: '40px 0',
  padding: '0 40px',
  textAlign: 'center' as const,
};

const h2 = {
  color: '#333',
  fontSize: '20px',
  fontWeight: '600',
  margin: '20px 0 10px',
};

const text = {
  color: '#333',
  fontSize: '16px',
  lineHeight: '26px',
  margin: '10px 0',
};

const section = {
  padding: '0 40px',
};

const resultBox = {
  backgroundColor: '#f3f4f6',
  borderRadius: '8px',
  padding: '16px',
  marginBottom: '12px',
};

const label = {
  color: '#6b7280',
  fontSize: '14px',
  margin: '0 0 4px',
};

const value = {
  color: '#111827',
  fontSize: '18px',
  fontWeight: '600',
  margin: '0',
  textTransform: 'capitalize' as const,
};

const list = {
  margin: '16px 0',
  paddingLeft: '20px',
};

const listItem = {
  color: '#333',
  fontSize: '16px',
  lineHeight: '24px',
  marginBottom: '8px',
};

const button = {
  backgroundColor: '#5046e5',
  borderRadius: '8px',
  color: '#fff',
  fontSize: '16px',
  fontWeight: '600',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'block',
  padding: '14px 20px',
  margin: '20px 0',
};

const hr = {
  borderColor: '#e6ebf1',
  margin: '20px 0',
};

const disclaimer = {
  color: '#8898aa',
  fontSize: '13px',
  lineHeight: '20px',
  padding: '0 40px',
  margin: '20px 0',
};

const footer = {
  color: '#8898aa',
  fontSize: '12px',
  lineHeight: '16px',
  textAlign: 'center' as const,
  padding: '0 40px',
  margin: '30px 0 0',
};
