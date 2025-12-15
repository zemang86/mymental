import { requireSuperAdmin } from '@/lib/admin/auth';
import { SettingsPanel } from '@/components/admin/settings/settings-panel';

export default async function SettingsPage() {
  const admin = await requireSuperAdmin();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="text-neutral-400">Configure system settings and preferences</p>
      </div>

      <SettingsPanel adminEmail={admin.email} />
    </div>
  );
}
