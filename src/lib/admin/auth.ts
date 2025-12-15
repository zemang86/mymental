/**
 * Admin Authentication Utilities
 * Handles admin role verification and session management
 */

import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { redirect } from 'next/navigation';

export type AdminRole = 'user' | 'moderator' | 'admin' | 'super_admin';

export interface AdminUser {
  id: string;
  email: string;
  role: AdminRole;
  fullName?: string;
  avatarUrl?: string;
}

/**
 * Check if user has admin access (server-side)
 */
export async function checkAdminAccess(): Promise<AdminUser | null> {
  const supabase = await createClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();

  console.log('[Admin Auth] User check:', { userId: user?.id, authError: authError?.message });

  if (authError || !user) {
    console.log('[Admin Auth] No user found');
    return null;
  }

  const adminClient = createAdminClient();
  const { data: profile, error: profileError } = await adminClient
    .from('profiles')
    .select('id, role, full_name')
    .eq('id', user.id)
    .single();

  console.log('[Admin Auth] Profile check:', { profile, profileError: profileError?.message });

  if (profileError || !profile) {
    console.log('[Admin Auth] Profile not found');
    return null;
  }

  const role = profile.role as AdminRole;

  // Check if user has admin or higher role
  if (!['moderator', 'admin', 'super_admin'].includes(role)) {
    console.log('[Admin Auth] User role not admin:', role);
    return null;
  }

  console.log('[Admin Auth] Access granted for:', user.email, 'role:', role);

  return {
    id: user.id,
    email: user.email!,
    role,
    fullName: profile.full_name,
  };
}

/**
 * Require admin access - redirects to login if not authorized
 */
export async function requireAdmin(): Promise<AdminUser> {
  const admin = await checkAdminAccess();

  if (!admin) {
    redirect('/admin/login');
  }

  return admin;
}

/**
 * Require super admin access
 */
export async function requireSuperAdmin(): Promise<AdminUser> {
  const admin = await requireAdmin();

  if (admin.role !== 'super_admin') {
    redirect('/admin?error=insufficient_permissions');
  }

  return admin;
}

/**
 * Check if role has permission for action
 */
export function hasPermission(role: AdminRole, action: string): boolean {
  const permissions: Record<AdminRole, string[]> = {
    user: [],
    moderator: [
      'view_users',
      'view_assessments',
      'view_alerts',
      'resolve_alerts',
    ],
    admin: [
      'view_users',
      'edit_users',
      'suspend_users',
      'view_assessments',
      'view_alerts',
      'resolve_alerts',
      'view_audit_logs',
      'manage_content',
      'export_data',
    ],
    super_admin: [
      'view_users',
      'edit_users',
      'delete_users',
      'suspend_users',
      'manage_roles',
      'view_assessments',
      'delete_assessments',
      'view_alerts',
      'resolve_alerts',
      'view_audit_logs',
      'manage_content',
      'export_data',
      'manage_subscriptions',
      'system_settings',
      'backup_data',
    ],
  };

  return permissions[role]?.includes(action) ?? false;
}

/**
 * Log admin action to audit log
 */
export async function logAdminAction(
  adminId: string,
  action: string,
  entityType: string,
  entityId?: string,
  oldValues?: Record<string, unknown>,
  newValues?: Record<string, unknown>,
  metadata?: Record<string, unknown>
): Promise<void> {
  const adminClient = createAdminClient();

  await adminClient.from('audit_logs').insert({
    admin_id: adminId,
    action,
    entity_type: entityType,
    entity_id: entityId,
    old_values: oldValues,
    new_values: newValues,
    metadata,
  });
}

/**
 * Log access event (login/logout)
 */
export async function logAccessEvent(
  userId: string | null,
  email: string,
  action: 'login' | 'logout' | 'failed_login' | 'password_reset',
  success: boolean,
  metadata?: Record<string, unknown>
): Promise<void> {
  const adminClient = createAdminClient();

  await adminClient.from('access_logs').insert({
    user_id: userId,
    email,
    action,
    success,
    metadata,
  });
}
