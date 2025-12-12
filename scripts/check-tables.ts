/**
 * Quick script to check what tables exist in Supabase
 */

import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';

config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function checkTables() {
  console.log('Checking Supabase tables...\n');

  const tablesToCheck = [
    'profiles',
    'initial_screenings',
    'social_function_screenings',
    'assessments',
    'payments',
    'subscriptions',
    'kb_articles',
  ];

  for (const table of tablesToCheck) {
    const { data, error } = await supabase
      .from(table)
      .select('*')
      .limit(1);

    if (error) {
      console.log(`❌ ${table}: ${error.message}`);
    } else {
      console.log(`✓ ${table}: exists (columns visible in query)`);
    }
  }
}

checkTables().catch(console.error);
