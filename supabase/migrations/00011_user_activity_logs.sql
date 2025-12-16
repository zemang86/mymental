-- User Activity Logs
-- Simple tracking for quick activities (trivia, check-in, etc.)

CREATE TABLE IF NOT EXISTS public.user_activity_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    activity_type TEXT NOT NULL, -- 'trivia', 'checkin', 'breathing', etc.
    completed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    metadata JSONB DEFAULT '{}'::jsonb, -- Optional extra data (score, mood, etc.)
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for querying user's activities
CREATE INDEX idx_user_activity_logs_user_id ON public.user_activity_logs(user_id);
CREATE INDEX idx_user_activity_logs_completed_at ON public.user_activity_logs(completed_at);
CREATE INDEX idx_user_activity_logs_type ON public.user_activity_logs(activity_type);

-- Enable RLS
ALTER TABLE public.user_activity_logs ENABLE ROW LEVEL SECURITY;

-- Users can only see their own activity logs
CREATE POLICY "Users can view own activity logs"
    ON public.user_activity_logs
    FOR SELECT
    USING (auth.uid() = user_id);

-- Users can insert their own activity logs
CREATE POLICY "Users can insert own activity logs"
    ON public.user_activity_logs
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Grant access
GRANT SELECT, INSERT ON public.user_activity_logs TO authenticated;
