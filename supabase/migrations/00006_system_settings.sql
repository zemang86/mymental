-- System Settings Table
-- Stores configurable platform settings

CREATE TABLE IF NOT EXISTS system_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  value JSONB NOT NULL DEFAULT '{}',
  category TEXT NOT NULL DEFAULT 'general',
  description TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  updated_by UUID REFERENCES profiles(id) ON DELETE SET NULL
);

-- Insert default settings
INSERT INTO system_settings (key, value, category, description) VALUES
  ('platform_name', '"MyMental"', 'general', 'Platform display name'),
  ('support_email', '"support@mymental.com"', 'general', 'Support contact email'),
  ('default_language', '"en"', 'general', 'Default platform language'),
  ('maintenance_mode', 'false', 'general', 'Enable maintenance mode'),
  ('notify_crisis_alerts', 'true', 'notifications', 'Notify admins on high-risk assessments'),
  ('notify_new_users', 'false', 'notifications', 'Notify admins on new registrations'),
  ('notify_payment_events', 'true', 'notifications', 'Notify admins on subscription changes'),
  ('notify_system_errors', 'true', 'notifications', 'Notify admins on critical errors'),
  ('session_timeout_minutes', '60', 'security', 'Admin session timeout in minutes'),
  ('crisis_hotlines', '{"befrienders": "03-7627 2929", "talian_kasih": "15999", "mercy": "03-9179 4422"}', 'crisis', 'Crisis hotline numbers')
ON CONFLICT (key) DO NOTHING;

-- Create index for category filtering
CREATE INDEX IF NOT EXISTS system_settings_category_idx ON system_settings(category);

-- RLS Policies
ALTER TABLE system_settings ENABLE ROW LEVEL SECURITY;

-- Only admins can read settings
DROP POLICY IF EXISTS "Admins can read settings" ON system_settings;
CREATE POLICY "Admins can read settings"
  ON system_settings FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'super_admin')
    )
  );

-- Only super_admins can modify settings
DROP POLICY IF EXISTS "Super admins can modify settings" ON system_settings;
CREATE POLICY "Super admins can modify settings"
  ON system_settings FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'super_admin'
    )
  );

-- Service role can always access
DROP POLICY IF EXISTS "Service role full access" ON system_settings;
CREATE POLICY "Service role full access"
  ON system_settings FOR ALL
  USING (auth.role() = 'service_role');

COMMENT ON TABLE system_settings IS 'Platform configuration settings manageable by admins';
