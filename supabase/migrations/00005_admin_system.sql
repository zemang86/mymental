-- Admin System Migration
-- Adds role-based admin access, audit logging, and admin-specific tables

-- Add role column to profiles if not exists
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user'
  CHECK (role IN ('user', 'moderator', 'admin', 'super_admin'));

-- Create index for role queries
CREATE INDEX IF NOT EXISTS profiles_role_idx ON profiles(role);

-- Audit logs table for tracking all admin actions
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  admin_email TEXT,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL, -- 'user', 'assessment', 'subscription', 'kb_article', etc.
  entity_id TEXT,
  old_values JSONB,
  new_values JSONB,
  ip_address TEXT,
  user_agent TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for audit log queries
CREATE INDEX IF NOT EXISTS audit_logs_admin_idx ON audit_logs(admin_id);
CREATE INDEX IF NOT EXISTS audit_logs_action_idx ON audit_logs(action);
CREATE INDEX IF NOT EXISTS audit_logs_entity_idx ON audit_logs(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS audit_logs_created_idx ON audit_logs(created_at DESC);

-- Access logs table for login tracking
CREATE TABLE IF NOT EXISTS access_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  email TEXT,
  action TEXT NOT NULL, -- 'login', 'logout', 'failed_login', 'password_reset'
  success BOOLEAN DEFAULT TRUE,
  ip_address TEXT,
  user_agent TEXT,
  location TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for access log queries
CREATE INDEX IF NOT EXISTS access_logs_user_idx ON access_logs(user_id);
CREATE INDEX IF NOT EXISTS access_logs_email_idx ON access_logs(email);
CREATE INDEX IF NOT EXISTS access_logs_action_idx ON access_logs(action);
CREATE INDEX IF NOT EXISTS access_logs_created_idx ON access_logs(created_at DESC);

-- System alerts table
CREATE TABLE IF NOT EXISTS system_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  alert_type TEXT NOT NULL, -- 'error', 'warning', 'info', 'user_feedback', 'crisis'
  severity TEXT DEFAULT 'info' CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  title TEXT NOT NULL,
  message TEXT,
  source TEXT, -- 'system', 'user', 'api', 'cron'
  entity_type TEXT,
  entity_id TEXT,
  is_read BOOLEAN DEFAULT FALSE,
  is_resolved BOOLEAN DEFAULT FALSE,
  resolved_by UUID REFERENCES profiles(id),
  resolved_at TIMESTAMPTZ,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for alerts
CREATE INDEX IF NOT EXISTS system_alerts_type_idx ON system_alerts(alert_type);
CREATE INDEX IF NOT EXISTS system_alerts_severity_idx ON system_alerts(severity);
CREATE INDEX IF NOT EXISTS system_alerts_unread_idx ON system_alerts(is_read) WHERE is_read = FALSE;
CREATE INDEX IF NOT EXISTS system_alerts_created_idx ON system_alerts(created_at DESC);

-- Admin sessions table for tracking active admin sessions
CREATE TABLE IF NOT EXISTS admin_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  session_token TEXT UNIQUE NOT NULL,
  ip_address TEXT,
  user_agent TEXT,
  last_activity_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS admin_sessions_admin_idx ON admin_sessions(admin_id);
CREATE INDEX IF NOT EXISTS admin_sessions_token_idx ON admin_sessions(session_token);
CREATE INDEX IF NOT EXISTS admin_sessions_active_idx ON admin_sessions(is_active) WHERE is_active = TRUE;

-- RLS Policies

-- Audit logs: Only admins can read, only system can write
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can view audit logs" ON audit_logs;
CREATE POLICY "Admins can view audit logs"
  ON audit_logs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'super_admin')
    )
  );

DROP POLICY IF EXISTS "Service role can insert audit logs" ON audit_logs;
CREATE POLICY "Service role can insert audit logs"
  ON audit_logs FOR INSERT
  WITH CHECK (auth.role() = 'service_role');

-- Access logs: Similar to audit logs
ALTER TABLE access_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can view access logs" ON access_logs;
CREATE POLICY "Admins can view access logs"
  ON access_logs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'super_admin')
    )
  );

DROP POLICY IF EXISTS "Service role can manage access logs" ON access_logs;
CREATE POLICY "Service role can manage access logs"
  ON access_logs FOR ALL
  USING (auth.role() = 'service_role');

-- System alerts: Admins can read and update
ALTER TABLE system_alerts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can view alerts" ON system_alerts;
CREATE POLICY "Admins can view alerts"
  ON system_alerts FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'super_admin', 'moderator')
    )
  );

DROP POLICY IF EXISTS "Admins can update alerts" ON system_alerts;
CREATE POLICY "Admins can update alerts"
  ON system_alerts FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'super_admin')
    )
  );

DROP POLICY IF EXISTS "Service role can manage alerts" ON system_alerts;
CREATE POLICY "Service role can manage alerts"
  ON system_alerts FOR ALL
  USING (auth.role() = 'service_role');

-- Admin sessions
ALTER TABLE admin_sessions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can view own sessions" ON admin_sessions;
CREATE POLICY "Admins can view own sessions"
  ON admin_sessions FOR SELECT
  USING (admin_id = auth.uid());

DROP POLICY IF EXISTS "Service role can manage admin sessions" ON admin_sessions;
CREATE POLICY "Service role can manage admin sessions"
  ON admin_sessions FOR ALL
  USING (auth.role() = 'service_role');

-- Function to log admin actions
CREATE OR REPLACE FUNCTION log_admin_action(
  p_admin_id UUID,
  p_action TEXT,
  p_entity_type TEXT,
  p_entity_id TEXT DEFAULT NULL,
  p_old_values JSONB DEFAULT NULL,
  p_new_values JSONB DEFAULT NULL,
  p_metadata JSONB DEFAULT '{}'
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_admin_email TEXT;
  v_log_id UUID;
BEGIN
  -- Get admin email
  SELECT email INTO v_admin_email FROM auth.users WHERE id = p_admin_id;

  INSERT INTO audit_logs (
    admin_id, admin_email, action, entity_type, entity_id,
    old_values, new_values, metadata
  ) VALUES (
    p_admin_id, v_admin_email, p_action, p_entity_type, p_entity_id,
    p_old_values, p_new_values, p_metadata
  )
  RETURNING id INTO v_log_id;

  RETURN v_log_id;
END;
$$;

-- Function to get dashboard stats
CREATE OR REPLACE FUNCTION get_admin_dashboard_stats()
RETURNS TABLE (
  total_users BIGINT,
  active_users_today BIGINT,
  active_users_week BIGINT,
  total_assessments BIGINT,
  assessments_today BIGINT,
  total_subscriptions BIGINT,
  active_subscriptions BIGINT,
  revenue_this_month NUMERIC,
  high_risk_users BIGINT,
  unread_alerts BIGINT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT
    (SELECT COUNT(*) FROM profiles)::BIGINT AS total_users,
    (SELECT COUNT(*) FROM profiles WHERE updated_at > NOW() - INTERVAL '1 day')::BIGINT AS active_users_today,
    (SELECT COUNT(*) FROM profiles WHERE updated_at > NOW() - INTERVAL '7 days')::BIGINT AS active_users_week,
    (SELECT COUNT(*) FROM assessments)::BIGINT AS total_assessments,
    (SELECT COUNT(*) FROM assessments WHERE created_at > NOW() - INTERVAL '1 day')::BIGINT AS assessments_today,
    (SELECT COUNT(*) FROM subscriptions)::BIGINT AS total_subscriptions,
    (SELECT COUNT(*) FROM subscriptions WHERE status = 'active')::BIGINT AS active_subscriptions,
    COALESCE((SELECT SUM(amount) FROM payments WHERE created_at > DATE_TRUNC('month', NOW()) AND status = 'completed'), 0)::NUMERIC AS revenue_this_month,
    (SELECT COUNT(*) FROM profiles WHERE risk_level IN ('high', 'imminent'))::BIGINT AS high_risk_users,
    (SELECT COUNT(*) FROM system_alerts WHERE is_read = FALSE)::BIGINT AS unread_alerts;
END;
$$;

-- Comments
COMMENT ON TABLE audit_logs IS 'Tracks all administrative actions for security and compliance';
COMMENT ON TABLE access_logs IS 'Tracks user login/logout events and failed attempts';
COMMENT ON TABLE system_alerts IS 'System notifications, errors, and user feedback alerts';
COMMENT ON TABLE admin_sessions IS 'Active admin sessions for security monitoring';
