-- Manual Premium Access Grant (for testing)
-- Replace 'USER_EMAIL_HERE' with the actual email address

-- Step 1: Get the user ID
SELECT id, email FROM auth.users WHERE email = 'USER_EMAIL_HERE';

-- Step 2: Insert a subscription record (grants premium access)
-- Replace 'USER_ID_HERE' with the ID from step 1
INSERT INTO public.subscriptions (
  id,
  user_id,
  tier,
  status,
  interval,
  amount,
  currency,
  payment_provider,
  provider_subscription_id,
  current_period_start,
  current_period_end,
  created_at,
  updated_at
) VALUES (
  gen_random_uuid(),
  'USER_ID_HERE', -- Replace with actual user ID
  'premium', -- or 'basic' for basic tier
  'active',
  'yearly', -- or 'monthly', '6_months'
  4500, -- RM45 for yearly, 2900 for 6 months
  'MYR',
  'manual', -- indicates manual grant
  'manual_' || gen_random_uuid()::text,
  NOW(),
  NOW() + INTERVAL '1 year', -- expires in 1 year (or '6 months', '1 month')
  NOW(),
  NOW()
);

-- Step 3: Verify the subscription was created
SELECT
  s.id,
  u.email,
  s.tier,
  s.status,
  s.interval,
  s.current_period_end
FROM subscriptions s
JOIN auth.users u ON s.user_id = u.id
WHERE u.email = 'USER_EMAIL_HERE';

-- =====================================
-- QUICK GRANTS (copy and customize)
-- =====================================

-- Grant PREMIUM YEARLY to a user
INSERT INTO subscriptions (id, user_id, tier, status, interval, amount, currency, payment_provider, provider_subscription_id, current_period_start, current_period_end)
SELECT gen_random_uuid(), id, 'premium', 'active', 'yearly', 4500, 'MYR', 'manual', 'manual_' || gen_random_uuid()::text, NOW(), NOW() + INTERVAL '1 year'
FROM auth.users WHERE email = 'tester@example.com';

-- Grant BASIC 6-MONTH to a user
INSERT INTO subscriptions (id, user_id, tier, status, interval, amount, currency, payment_provider, provider_subscription_id, current_period_start, current_period_end)
SELECT gen_random_uuid(), id, 'basic', 'active', '6_months', 2900, 'MYR', 'manual', 'manual_' || gen_random_uuid()::text, NOW(), NOW() + INTERVAL '6 months'
FROM auth.users WHERE email = 'tester@example.com';

-- =====================================
-- REVOKE ACCESS
-- =====================================

-- Cancel a user's subscription
UPDATE subscriptions
SET status = 'canceled', updated_at = NOW()
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'USER_EMAIL_HERE');

-- Or delete it entirely
DELETE FROM subscriptions
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'USER_EMAIL_HERE');

-- =====================================
-- BULK OPERATIONS
-- =====================================

-- Grant premium to multiple users at once
INSERT INTO subscriptions (id, user_id, tier, status, interval, amount, currency, payment_provider, provider_subscription_id, current_period_start, current_period_end)
SELECT
  gen_random_uuid(),
  id,
  'premium',
  'active',
  'yearly',
  4500,
  'MYR',
  'manual',
  'manual_' || gen_random_uuid()::text,
  NOW(),
  NOW() + INTERVAL '1 year'
FROM auth.users
WHERE email IN (
  'tester1@example.com',
  'tester2@example.com',
  'tester3@example.com'
);

-- =====================================
-- CHECK WHO HAS PREMIUM
-- =====================================

-- List all active premium users
SELECT
  u.email,
  s.tier,
  s.interval,
  s.status,
  s.current_period_end,
  s.payment_provider
FROM subscriptions s
JOIN auth.users u ON s.user_id = u.id
WHERE s.status = 'active'
ORDER BY s.created_at DESC;

-- Check if a specific user has access
SELECT
  u.email,
  CASE
    WHEN s.id IS NOT NULL AND s.status = 'active' AND s.current_period_end > NOW()
    THEN 'HAS ACCESS ✅'
    ELSE 'NO ACCESS ❌'
  END as access_status,
  s.tier,
  s.current_period_end
FROM auth.users u
LEFT JOIN subscriptions s ON u.id = s.user_id AND s.status = 'active'
WHERE u.email = 'USER_EMAIL_HERE';
