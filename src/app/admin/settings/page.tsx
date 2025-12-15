import { requireAdmin } from '@/lib/admin/auth';
import { SettingsPanel } from '@/components/admin/settings/settings-panel';

export default async function SettingsPage() {
  // Allow admins to view, but only super_admin can modify
  const admin = await requireAdmin();
  const isSuperAdmin = admin.role === 'super_admin';

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="text-neutral-400">Configure system settings and preferences</p>
      </div>

      <SettingsPanel adminEmail={admin.email} isSuperAdmin={isSuperAdmin} />
    </div>
  );
}
