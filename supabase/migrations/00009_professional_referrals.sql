-- Migration: Professional Referral System
-- Adds tables for mental health professional directory and user referrals

-- Create mental health professionals directory table
CREATE TABLE IF NOT EXISTS mental_health_professionals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  credentials TEXT, -- e.g., "Clinical Psychologist, MPsi"
  specializations TEXT[], -- ['anxiety', 'depression', 'trauma']
  contact_type TEXT[] NOT NULL, -- ['in_person', 'phone', 'video']
  phone TEXT,
  email TEXT,
  location TEXT, -- City/State
  address TEXT,
  languages TEXT[], -- ['English', 'Malay', 'Mandarin']
  accepting_patients BOOLEAN DEFAULT TRUE,
  session_fee_range TEXT, -- "RM150-250"
  availability TEXT, -- "Mon-Fri 9AM-5PM"
  bio TEXT,
  bio_ms TEXT,
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create user referrals table
CREATE TABLE IF NOT EXISTS user_referrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  professional_id UUID REFERENCES mental_health_professionals(id),
  risk_level TEXT NOT NULL CHECK (risk_level IN ('low', 'moderate', 'high', 'imminent')),
  detected_conditions TEXT[],
  referral_reason TEXT,
  status TEXT DEFAULT 'pending'
    CHECK (status IN ('pending', 'contacted', 'scheduled', 'completed', 'declined')),
  contact_preference TEXT[], -- ['phone', 'in_person', 'video']
  preferred_languages TEXT[],
  notes TEXT,
  scheduled_date TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create referral alerts for admin table
CREATE TABLE IF NOT EXISTS referral_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  referral_id UUID REFERENCES user_referrals(id) ON DELETE CASCADE,
  alert_type TEXT NOT NULL CHECK (alert_type IN ('high_risk', 'imminent_risk')),
  is_read BOOLEAN DEFAULT FALSE,
  is_actioned BOOLEAN DEFAULT FALSE,
  actioned_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  actioned_at TIMESTAMPTZ
);

-- Enable RLS
ALTER TABLE mental_health_professionals ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE referral_alerts ENABLE ROW LEVEL SECURITY;

-- Mental health professionals policies
DROP POLICY IF EXISTS "Anyone can view verified professionals" ON mental_health_professionals;
CREATE POLICY "Anyone can view verified professionals"
  ON mental_health_professionals FOR SELECT
  USING (is_verified = true);

DROP POLICY IF EXISTS "Service role can manage professionals" ON mental_health_professionals;
CREATE POLICY "Service role can manage professionals"
  ON mental_health_professionals FOR ALL
  USING (auth.role() = 'service_role');

-- User referrals policies
DROP POLICY IF EXISTS "Users can view own referrals" ON user_referrals;
CREATE POLICY "Users can view own referrals"
  ON user_referrals FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create own referrals" ON user_referrals;
CREATE POLICY "Users can create own referrals"
  ON user_referrals FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Service role can manage referrals" ON user_referrals;
CREATE POLICY "Service role can manage referrals"
  ON user_referrals FOR ALL
  USING (auth.role() = 'service_role');

-- Referral alerts policies (admin only)
DROP POLICY IF EXISTS "Service role can manage alerts" ON referral_alerts;
CREATE POLICY "Service role can manage alerts"
  ON referral_alerts FOR ALL
  USING (auth.role() = 'service_role');

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_professionals_location ON mental_health_professionals(location);
CREATE INDEX IF NOT EXISTS idx_professionals_verified ON mental_health_professionals(is_verified);
CREATE INDEX IF NOT EXISTS idx_professionals_accepting ON mental_health_professionals(accepting_patients);
CREATE INDEX IF NOT EXISTS idx_user_referrals_user_id ON user_referrals(user_id);
CREATE INDEX IF NOT EXISTS idx_user_referrals_status ON user_referrals(status);
CREATE INDEX IF NOT EXISTS idx_user_referrals_risk_level ON user_referrals(risk_level);
CREATE INDEX IF NOT EXISTS idx_referral_alerts_user_id ON referral_alerts(user_id);
CREATE INDEX IF NOT EXISTS idx_referral_alerts_is_read ON referral_alerts(is_read);
CREATE INDEX IF NOT EXISTS idx_referral_alerts_alert_type ON referral_alerts(alert_type);

-- Updated_at triggers
CREATE TRIGGER update_mental_health_professionals_updated_at
  BEFORE UPDATE ON mental_health_professionals
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_referrals_updated_at
  BEFORE UPDATE ON user_referrals
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
