-- Interventions and Progress Tracking Migration
-- Extends kb_articles for intervention content and adds user progress tracking

-- Add intervention-specific columns to kb_articles
ALTER TABLE kb_articles ADD COLUMN IF NOT EXISTS intervention_type TEXT
  CHECK (intervention_type IN ('exercise', 'worksheet', 'video_intro', 'reading', 'technique'));
ALTER TABLE kb_articles ADD COLUMN IF NOT EXISTS exercise_steps JSONB DEFAULT '[]';
ALTER TABLE kb_articles ADD COLUMN IF NOT EXISTS estimated_duration_minutes INTEGER;
ALTER TABLE kb_articles ADD COLUMN IF NOT EXISTS order_index INTEGER DEFAULT 0;
ALTER TABLE kb_articles ADD COLUMN IF NOT EXISTS is_premium BOOLEAN DEFAULT TRUE;

-- Create index for intervention queries
CREATE INDEX IF NOT EXISTS kb_articles_intervention_type_idx ON kb_articles(intervention_type);
CREATE INDEX IF NOT EXISTS kb_articles_category_order_idx ON kb_articles(category, order_index);

-- Interventions table (structured courses/modules)
CREATE TABLE IF NOT EXISTS interventions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  name_ms TEXT,
  description TEXT,
  description_ms TEXT,
  category TEXT NOT NULL,
  thumbnail_url TEXT,
  video_intro_url TEXT,
  is_premium BOOLEAN DEFAULT TRUE,
  is_published BOOLEAN DEFAULT TRUE,
  total_chapters INTEGER DEFAULT 0,
  estimated_duration_minutes INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Intervention chapters (links interventions to kb_articles)
CREATE TABLE IF NOT EXISTS intervention_chapters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  intervention_id UUID REFERENCES interventions(id) ON DELETE CASCADE,
  kb_article_id UUID REFERENCES kb_articles(id) ON DELETE SET NULL,
  chapter_order INTEGER NOT NULL,
  title TEXT NOT NULL,
  title_ms TEXT,
  description TEXT,
  description_ms TEXT,
  is_free_preview BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(intervention_id, chapter_order)
);

-- User exercise/chapter progress
CREATE TABLE IF NOT EXISTS user_exercise_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  kb_article_id UUID REFERENCES kb_articles(id) ON DELETE CASCADE,
  intervention_id UUID REFERENCES interventions(id) ON DELETE CASCADE,
  chapter_id UUID REFERENCES intervention_chapters(id) ON DELETE CASCADE,
  completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMPTZ,
  time_spent_seconds INTEGER DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, kb_article_id, intervention_id)
);

-- User intervention enrollment/progress summary
CREATE TABLE IF NOT EXISTS user_intervention_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  intervention_id UUID REFERENCES interventions(id) ON DELETE CASCADE,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  last_activity_at TIMESTAMPTZ DEFAULT NOW(),
  completed_chapters INTEGER DEFAULT 0,
  total_time_spent_seconds INTEGER DEFAULT 0,
  is_completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, intervention_id)
);

-- Create indexes for progress queries
CREATE INDEX IF NOT EXISTS user_exercise_progress_user_idx ON user_exercise_progress(user_id);
CREATE INDEX IF NOT EXISTS user_exercise_progress_intervention_idx ON user_exercise_progress(intervention_id);
CREATE INDEX IF NOT EXISTS user_intervention_progress_user_idx ON user_intervention_progress(user_id);

-- RLS Policies for interventions (public read)
ALTER TABLE interventions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Interventions are publicly readable" ON interventions;
CREATE POLICY "Interventions are publicly readable"
  ON interventions FOR SELECT
  USING (is_published = TRUE);

DROP POLICY IF EXISTS "Only service role can modify interventions" ON interventions;
CREATE POLICY "Only service role can modify interventions"
  ON interventions FOR ALL
  USING (auth.role() = 'service_role');

-- RLS Policies for intervention_chapters (public read)
ALTER TABLE intervention_chapters ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Chapters are publicly readable" ON intervention_chapters;
CREATE POLICY "Chapters are publicly readable"
  ON intervention_chapters FOR SELECT
  USING (TRUE);

-- RLS Policies for user_exercise_progress (users own data)
ALTER TABLE user_exercise_progress ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can read own exercise progress" ON user_exercise_progress;
CREATE POLICY "Users can read own exercise progress"
  ON user_exercise_progress FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own exercise progress" ON user_exercise_progress;
CREATE POLICY "Users can insert own exercise progress"
  ON user_exercise_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own exercise progress" ON user_exercise_progress;
CREATE POLICY "Users can update own exercise progress"
  ON user_exercise_progress FOR UPDATE
  USING (auth.uid() = user_id);

-- RLS Policies for user_intervention_progress
ALTER TABLE user_intervention_progress ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can read own intervention progress" ON user_intervention_progress;
CREATE POLICY "Users can read own intervention progress"
  ON user_intervention_progress FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own intervention progress" ON user_intervention_progress;
CREATE POLICY "Users can insert own intervention progress"
  ON user_intervention_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own intervention progress" ON user_intervention_progress;
CREATE POLICY "Users can update own intervention progress"
  ON user_intervention_progress FOR UPDATE
  USING (auth.uid() = user_id);

-- Function to get user's progress for an intervention
CREATE OR REPLACE FUNCTION get_intervention_progress(
  p_user_id UUID,
  p_intervention_id UUID
)
RETURNS TABLE (
  intervention_id UUID,
  total_chapters INTEGER,
  completed_chapters INTEGER,
  progress_percentage FLOAT,
  is_completed BOOLEAN,
  last_activity_at TIMESTAMPTZ
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    i.id AS intervention_id,
    i.total_chapters,
    COALESCE(uip.completed_chapters, 0) AS completed_chapters,
    CASE
      WHEN i.total_chapters > 0 THEN
        (COALESCE(uip.completed_chapters, 0)::FLOAT / i.total_chapters::FLOAT) * 100
      ELSE 0
    END AS progress_percentage,
    COALESCE(uip.is_completed, FALSE) AS is_completed,
    uip.last_activity_at
  FROM interventions i
  LEFT JOIN user_intervention_progress uip
    ON uip.intervention_id = i.id AND uip.user_id = p_user_id
  WHERE i.id = p_intervention_id;
END;
$$;

-- Comments for documentation
COMMENT ON TABLE interventions IS 'Structured intervention courses/modules';
COMMENT ON TABLE intervention_chapters IS 'Chapters within intervention modules, linked to KB articles';
COMMENT ON TABLE user_exercise_progress IS 'Tracks user completion of individual exercises/chapters';
COMMENT ON TABLE user_intervention_progress IS 'Summary of user progress through intervention modules';
