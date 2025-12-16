-- Migration: Intervention Multimedia Support
-- Adds support for videos, animations, and quizzes in interventions

-- Add multimedia fields to intervention_chapters
ALTER TABLE intervention_chapters
  ADD COLUMN IF NOT EXISTS video_url TEXT,
  ADD COLUMN IF NOT EXISTS video_provider TEXT CHECK (video_provider IN ('youtube', 'vimeo', 'cloudflare')),
  ADD COLUMN IF NOT EXISTS video_duration_seconds INTEGER,
  ADD COLUMN IF NOT EXISTS animation_url TEXT,
  ADD COLUMN IF NOT EXISTS animation_type TEXT CHECK (animation_type IN ('lottie', 'gif', 'video')),
  ADD COLUMN IF NOT EXISTS has_quiz BOOLEAN DEFAULT FALSE;

-- Create intervention quizzes table
CREATE TABLE IF NOT EXISTS intervention_quizzes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chapter_id UUID REFERENCES intervention_chapters(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  title_ms TEXT,
  questions JSONB NOT NULL, -- Array of quiz questions
  passing_score INTEGER DEFAULT 70,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create user quiz attempts table
CREATE TABLE IF NOT EXISTS user_quiz_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  quiz_id UUID REFERENCES intervention_quizzes(id) ON DELETE CASCADE,
  chapter_id UUID REFERENCES intervention_chapters(id),
  answers JSONB NOT NULL,
  score INTEGER NOT NULL,
  passed BOOLEAN NOT NULL,
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  time_taken_seconds INTEGER
);

-- Enable RLS
ALTER TABLE intervention_quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_quiz_attempts ENABLE ROW LEVEL SECURITY;

-- Quizzes are viewable by everyone
DROP POLICY IF EXISTS "Anyone can view quizzes" ON intervention_quizzes;
CREATE POLICY "Anyone can view quizzes"
  ON intervention_quizzes FOR SELECT
  USING (true);

-- Service role can manage quizzes
DROP POLICY IF EXISTS "Service role can manage quizzes" ON intervention_quizzes;
CREATE POLICY "Service role can manage quizzes"
  ON intervention_quizzes FOR ALL
  USING (auth.role() = 'service_role');

-- Users can view own quiz attempts
DROP POLICY IF EXISTS "Users can view own quiz attempts" ON user_quiz_attempts;
CREATE POLICY "Users can view own quiz attempts"
  ON user_quiz_attempts FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert own quiz attempts
DROP POLICY IF EXISTS "Users can insert own quiz attempts" ON user_quiz_attempts;
CREATE POLICY "Users can insert own quiz attempts"
  ON user_quiz_attempts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Service role can manage all quiz attempts
DROP POLICY IF EXISTS "Service role can manage quiz attempts" ON user_quiz_attempts;
CREATE POLICY "Service role can manage quiz attempts"
  ON user_quiz_attempts FOR ALL
  USING (auth.role() = 'service_role');

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_intervention_quizzes_chapter_id ON intervention_quizzes(chapter_id);
CREATE INDEX IF NOT EXISTS idx_user_quiz_attempts_user_id ON user_quiz_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_user_quiz_attempts_quiz_id ON user_quiz_attempts(quiz_id);
CREATE INDEX IF NOT EXISTS idx_user_quiz_attempts_chapter_id ON user_quiz_attempts(chapter_id);

-- Updated_at trigger for quizzes
CREATE TRIGGER update_intervention_quizzes_updated_at
  BEFORE UPDATE ON intervention_quizzes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
