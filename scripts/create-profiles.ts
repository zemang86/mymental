/**
 * Create profiles for existing auth users
 */

import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';

config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function createProfiles() {
  const { data: users } = await supabase.auth.admin.listUsers();

  if (!users?.users) {
    console.log('No users found');
    return;
  }

  for (const user of users.users) {
    console.log('Creating profile for:', user.id, user.email);

    const { error } = await supabase
      .from('profiles')
      .upsert({
        id: user.id,
        email: user.email,
        full_name: user.user_metadata?.full_name || user.user_metadata?.name || null,
        created_at: user.created_at,
        updated_at: new Date().toISOString(),
      });

    if (error) {
      console.log('Error:', error.message);
    } else {
      console.log('Profile created!');
    }
  }

  const { data: profiles } = await supabase.from('profiles').select('*');
  console.log('\nProfiles now:');
  console.log(JSON.stringify(profiles, null, 2));
}

createProfiles();
