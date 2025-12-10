-- Migration: Payments and Subscriptions
-- Adds tables for payment processing and subscription management

-- Subscription tiers enum
DO $$ BEGIN
    CREATE TYPE subscription_tier AS ENUM ('free', 'basic', 'premium');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Payment status enum
DO $$ BEGIN
    CREATE TYPE payment_status AS ENUM ('pending', 'completed', 'failed', 'refunded');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Payment provider enum
DO $$ BEGIN
    CREATE TYPE payment_provider AS ENUM ('stripe', 'fpx', 'billplz', 'simulation');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Subscription status enum
DO $$ BEGIN
    CREATE TYPE subscription_status AS ENUM ('active', 'cancelled', 'expired');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    tier subscription_tier NOT NULL DEFAULT 'free',
    plan_id TEXT NOT NULL,
    status subscription_status NOT NULL DEFAULT 'active',
    current_period_start TIMESTAMPTZ NOT NULL DEFAULT now(),
    current_period_end TIMESTAMPTZ NOT NULL,
    provider_subscription_id TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    CONSTRAINT subscriptions_user_id_unique UNIQUE (user_id)
);

-- Payments table
CREATE TABLE IF NOT EXISTS payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    plan_id TEXT,
    assessment_type TEXT,
    amount INTEGER NOT NULL, -- in cents (MYR)
    currency TEXT NOT NULL DEFAULT 'MYR',
    provider payment_provider NOT NULL,
    status payment_status NOT NULL DEFAULT 'pending',
    provider_payment_id TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Assessment access table (for one-time purchases)
CREATE TABLE IF NOT EXISTS assessment_access (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    assessment_type TEXT NOT NULL,
    granted_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    expires_at TIMESTAMPTZ, -- NULL = never expires
    payment_id TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    CONSTRAINT assessment_access_unique UNIQUE (user_id, assessment_type)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_payments_user_id ON payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
CREATE INDEX IF NOT EXISTS idx_assessment_access_user_id ON assessment_access(user_id);

-- Row Level Security
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment_access ENABLE ROW LEVEL SECURITY;

-- Subscriptions policies
DROP POLICY IF EXISTS "Users can view own subscription" ON subscriptions;
CREATE POLICY "Users can view own subscription"
    ON subscriptions FOR SELECT
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "System can manage subscriptions" ON subscriptions;
CREATE POLICY "System can manage subscriptions"
    ON subscriptions FOR ALL
    USING (auth.role() = 'service_role');

-- Payments policies
DROP POLICY IF EXISTS "Users can view own payments" ON payments;
CREATE POLICY "Users can view own payments"
    ON payments FOR SELECT
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "System can manage payments" ON payments;
CREATE POLICY "System can manage payments"
    ON payments FOR ALL
    USING (auth.role() = 'service_role');

-- Assessment access policies
DROP POLICY IF EXISTS "Users can view own assessment access" ON assessment_access;
CREATE POLICY "Users can view own assessment access"
    ON assessment_access FOR SELECT
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "System can manage assessment access" ON assessment_access;
CREATE POLICY "System can manage assessment access"
    ON assessment_access FOR ALL
    USING (auth.role() = 'service_role');

-- Function to check if user has premium access
CREATE OR REPLACE FUNCTION has_premium_access(user_uuid UUID)
RETURNS BOOLEAN AS $$
DECLARE
    has_access BOOLEAN;
BEGIN
    SELECT EXISTS (
        SELECT 1 FROM subscriptions
        WHERE user_id = user_uuid
        AND status = 'active'
        AND tier IN ('basic', 'premium')
        AND current_period_end > now()
    ) INTO has_access;

    RETURN has_access;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user has access to specific assessment
CREATE OR REPLACE FUNCTION has_assessment_access(user_uuid UUID, assessment TEXT)
RETURNS BOOLEAN AS $$
DECLARE
    has_access BOOLEAN;
BEGIN
    -- Check if user has premium subscription
    IF has_premium_access(user_uuid) THEN
        RETURN TRUE;
    END IF;

    -- Check for one-time purchase
    SELECT EXISTS (
        SELECT 1 FROM assessment_access
        WHERE user_id = user_uuid
        AND assessment_type = assessment
        AND (expires_at IS NULL OR expires_at > now())
    ) INTO has_access;

    RETURN has_access;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_subscriptions_updated_at
    BEFORE UPDATE ON subscriptions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payments_updated_at
    BEFORE UPDATE ON payments
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
