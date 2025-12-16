/**
 * Test the complete OTP flow:
 * 1. Send OTP to email
 * 2. Verify OTP code
 */

const TEST_EMAIL = 'damauraapp@gmail.com';
const BASE_URL = 'http://localhost:3000';

async function testOTPFlow() {
  console.log('🧪 Testing OTP Flow\n');
  console.log('=' .repeat(50));

  // Step 1: Send OTP
  console.log('\n📤 Step 1: Sending OTP to', TEST_EMAIL);
  const sendResponse = await fetch(`${BASE_URL}/api/auth/send-magic-link`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: TEST_EMAIL }),
  });

  const sendResult = await sendResponse.json();
  console.log('Response:', sendResult);

  if (!sendResponse.ok) {
    console.error('❌ Failed to send OTP');
    process.exit(1);
  }

  console.log('✅ OTP sent successfully!');
  console.log('📧 Check your email for the 6-digit code\n');

  // Wait for user to enter OTP
  console.log('🔢 Enter the OTP code you received:');

  // Read from stdin
  const readline = await import('readline');
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rl.question('OTP: ', async (otp) => {
    rl.close();

    // Step 2: Verify OTP
    console.log('\n🔐 Step 2: Verifying OTP code:', otp);
    const verifyResponse = await fetch(`${BASE_URL}/api/auth/verify-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: TEST_EMAIL, otp }),
    });

    const verifyResult = await verifyResponse.json();
    console.log('Response:', verifyResult);

    if (!verifyResponse.ok) {
      console.error('❌ OTP verification failed');
      process.exit(1);
    }

    console.log('\n✅ OTP verified successfully!');
    console.log('👤 User created:', verifyResult.user?.email);
    console.log('🎉 User is now authenticated and can proceed to payment\n');
  });
}

testOTPFlow();
