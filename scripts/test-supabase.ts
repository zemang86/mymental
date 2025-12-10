/**
 * Test Supabase Connection
 * Run with: npx tsx scripts/test-supabase.ts
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testConnection() {
  console.log('🔄 Testing Supabase connection...\n');
  console.log(`📍 URL: ${supabaseUrl}\n`);

  try {
    // Test 1: Basic connection
    console.log('1️⃣ Testing basic connection...');
    const { data: healthCheck, error: healthError } = await supabase
      .from('profiles')
      .select('count')
      .limit(1);

    if (healthError && healthError.code !== 'PGRST116') {
      // PGRST116 = table doesn't exist, which is fine for this test
      console.log(`   ⚠️  Health check: ${healthError.message}`);
    } else {
      console.log('   ✅ Connection successful!');
    }

    // Test 2: Check if tables exist
    console.log('\n2️⃣ Checking database tables...');

    const tables = [
      'profiles',
      'demographic_sessions',
      'initial_screenings',
      'social_function_screenings',
      'triage_events',
      'assessments',
    ];

    for (const table of tables) {
      const { error } = await supabase.from(table).select('count').limit(1);
      if (error) {
        if (error.code === 'PGRST116' || error.code === '42P01') {
          console.log(`   ❌ ${table} - Table not found`);
        } else if (error.code === '42501') {
          console.log(`   ✅ ${table} - Exists (RLS enabled)`);
        } else {
          console.log(`   ⚠️  ${table} - ${error.message}`);
        }
      } else {
        console.log(`   ✅ ${table} - Exists and accessible`);
      }
    }

    // Test 3: Auth status
    console.log('\n3️⃣ Checking auth configuration...');
    const { data: { session }, error: authError } = await supabase.auth.getSession();
    if (authError) {
      console.log(`   ⚠️  Auth error: ${authError.message}`);
    } else {
      console.log(`   ✅ Auth is configured (no active session)`);
    }

    console.log('\n✅ Supabase connection test complete!\n');

  } catch (error) {
    console.error('\n❌ Connection test failed:', error);
    process.exit(1);
  }
}

testConnection();
