-- Migration: Payment Gateway Updates
-- Adds support for 6-month subscription intervals and dual payment gateways

-- Add interval column to subscriptions table for easier querying
DO $$ BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'subscriptions' AND column_name = 'interval'
    ) THEN
        ALTER TABLE subscriptions
        ADD COLUMN interval TEXT CHECK (interval IN ('one_time', 'monthly', '6_months', 'yearly'));
    END IF;
END $$;

-- Add payment_gateway column to track which gateway was used
DO $$ BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'payments' AND column_name = 'payment_gateway'
    ) THEN
        ALTER TABLE payments
        ADD COLUMN payment_gateway TEXT CHECK (payment_gateway IN ('stripe', 'billplz'));
    END IF;
END $$;

-- Add webhook_event_id to prevent duplicate webhook processing
DO $$ BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'payments' AND column_name = 'webhook_event_id'
    ) THEN
        ALTER TABLE payments
        ADD COLUMN webhook_event_id TEXT UNIQUE;
    END IF;
END $$;

-- Create webhook events log table
CREATE TABLE IF NOT EXISTS webhook_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id TEXT UNIQUE NOT NULL,
    provider TEXT NOT NULL CHECK (provider IN ('stripe', 'billplz')),
    event_type TEXT NOT NULL,
    payload JSONB NOT NULL,
    processed BOOLEAN DEFAULT FALSE,
    error TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    processed_at TIMESTAMPTZ
);

-- Enable RLS on webhook_events
ALTER TABLE webhook_events ENABLE ROW LEVEL SECURITY;

-- Only service role can manage webhook events
DROP POLICY IF EXISTS "System can manage webhook events" ON webhook_events;
CREATE POLICY "System can manage webhook events"
    ON webhook_events FOR ALL
    USING (auth.role() = 'service_role');

-- Index for webhook event lookups
CREATE INDEX IF NOT EXISTS idx_webhook_events_event_id ON webhook_events(event_id);
CREATE INDEX IF NOT EXISTS idx_webhook_events_provider ON webhook_events(provider);
CREATE INDEX IF NOT EXISTS idx_webhook_events_processed ON webhook_events(processed);

-- Function to calculate subscription end date based on interval
CREATE OR REPLACE FUNCTION calculate_period_end(start_date TIMESTAMPTZ, plan_interval TEXT)
RETURNS TIMESTAMPTZ AS $$
BEGIN
    CASE plan_interval
        WHEN 'monthly' THEN
            RETURN start_date + INTERVAL '1 month';
        WHEN '6_months' THEN
            RETURN start_date + INTERVAL '6 months';
        WHEN 'yearly' THEN
            RETURN start_date + INTERVAL '1 year';
        ELSE
            RETURN start_date + INTERVAL '1 month'; -- Default to monthly
    END CASE;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Updated function to check premium access
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

-- Function to check if user has completed payment for results
CREATE OR REPLACE FUNCTION has_results_access(user_uuid UUID)
RETURNS BOOLEAN AS $$
DECLARE
    has_access BOOLEAN;
BEGIN
    -- Check if user has active subscription
    IF has_premium_access(user_uuid) THEN
        RETURN TRUE;
    END IF;

    -- Check for completed payment for results
    SELECT EXISTS (
        SELECT 1 FROM payments
        WHERE user_id = user_uuid
        AND status = 'completed'
        AND (plan_id LIKE '%6months%' OR plan_id LIKE '%yearly%' OR plan_id LIKE '%monthly%')
        AND created_at > now() - INTERVAL '1 year' -- Valid for 1 year
    ) INTO has_access;

    RETURN has_access;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
