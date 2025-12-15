/**
 * Admin Settings API
 * GET - Retrieve all settings
 * PUT - Update settings
 */

import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';

// Setting keys that can be managed
const ALLOWED_SETTINGS = [
  'platform_name',
  'support_email',
  'default_language',
  'maintenance_mode',
  'notify_crisis_alerts',
  'notify_new_users',
  'notify_payment_events',
  'notify_system_errors',
  'session_timeout_minutes',
  'crisis_hotlines',
];

/**
 * GET /api/admin/settings
 * Retrieve all settings
 */
export async function GET() {
  try {
    const supabase = await createClient();

    // Check auth
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Use admin client to check role and get settings
    const adminClient = createAdminClient();

    // Check if user is admin
    const { data: profile } = await adminClient
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (!profile || !['admin', 'super_admin'].includes(profile.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Get all settings
    const { data: settings, error: settingsError } = await adminClient
      .from('system_settings')
      .select('key, value, category, description, updated_at')
      .order('category');

    if (settingsError) {
      console.error('Error fetching settings:', settingsError);
      return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
    }

    // Transform to key-value object grouped by category
    const settingsByCategory: Record<string, Record<string, unknown>> = {};
    const settingsFlat: Record<string, unknown> = {};

    for (const setting of settings || []) {
      if (!settingsByCategory[setting.category]) {
        settingsByCategory[setting.category] = {};
      }
      settingsByCategory[setting.category][setting.key] = setting.value;
      settingsFlat[setting.key] = setting.value;
    }

    return NextResponse.json({
      settings: settingsFlat,
      byCategory: settingsByCategory,
      raw: settings,
    });
  } catch (error) {
    console.error('Error in GET /api/admin/settings:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * PUT /api/admin/settings
 * Update settings
 */
export async function PUT(request: Request) {
  try {
    const supabase = await createClient();

    // Check auth
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Use admin client to check role
    const adminClient = createAdminClient();

    // Check if user is super_admin (only super_admin can modify settings)
    const { data: profile } = await adminClient
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (!profile || profile.role !== 'super_admin') {
      return NextResponse.json(
        { error: 'Only super admins can modify settings' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { settings } = body as { settings: Record<string, unknown> };

    if (!settings || typeof settings !== 'object') {
      return NextResponse.json({ error: 'Invalid settings data' }, { status: 400 });
    }

    const updates: { key: string; success: boolean; error?: string }[] = [];

    // Update each setting
    for (const [key, value] of Object.entries(settings)) {
      // Validate setting key
      if (!ALLOWED_SETTINGS.includes(key)) {
        updates.push({ key, success: false, error: 'Setting not allowed' });
        continue;
      }

      const { error: updateError } = await adminClient
        .from('system_settings')
        .update({
          value: JSON.stringify(value),
          updated_at: new Date().toISOString(),
          updated_by: user.id,
        })
        .eq('key', key);

      if (updateError) {
        console.error(`Error updating setting ${key}:`, updateError);
        updates.push({ key, success: false, error: updateError.message });
      } else {
        updates.push({ key, success: true });
      }
    }

    // Log the action
    await adminClient.from('audit_logs').insert({
      admin_id: user.id,
      action: 'update_settings',
      entity_type: 'system_settings',
      new_values: settings,
      metadata: { updates },
    });

    const successCount = updates.filter(u => u.success).length;
    const failCount = updates.filter(u => !u.success).length;

    return NextResponse.json({
      message: `Updated ${successCount} setting(s)${failCount > 0 ? `, ${failCount} failed` : ''}`,
      updates,
    });
  } catch (error) {
    console.error('Error in PUT /api/admin/settings:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
