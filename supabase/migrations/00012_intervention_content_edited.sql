-- Migration: Post-Edited Intervention Content
-- Creates a layer for manually edited, well-formatted content that overrides KB raw text

-- Create intervention_content_edited table
CREATE TABLE IF NOT EXISTS intervention_content_edited (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chapter_id UUID NOT NULL REFERENCES intervention_chapters(id) ON DELETE CASCADE,

  -- Edited content (clean markdown)
  title_en TEXT,
  title_ms TEXT,
  content_en TEXT,  -- Clean, well-formatted markdown
  content_ms TEXT,
  summary_en TEXT,  -- Brief chapter overview
  summary_ms TEXT,

  -- Video support (can override chapter video)
  video_url TEXT,
  video_provider TEXT CHECK (video_provider IN ('youtube', 'vimeo', 'cloudflare')),
  video_title TEXT,
  video_title_ms TEXT,
  video_duration_seconds INTEGER,

  -- Metadata
  is_published BOOLEAN DEFAULT FALSE,
  edited_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- One edited version per chapter
  UNIQUE(chapter_id)
);

-- Enable RLS
ALTER TABLE intervention_content_edited ENABLE ROW LEVEL SECURITY;

-- Anyone can view published edited content
DROP POLICY IF EXISTS "Anyone can view published edited content" ON intervention_content_edited;
CREATE POLICY "Anyone can view published edited content"
  ON intervention_content_edited FOR SELECT
  USING (is_published = TRUE);

-- Service role can manage all edited content
DROP POLICY IF EXISTS "Service role can manage edited content" ON intervention_content_edited;
CREATE POLICY "Service role can manage edited content"
  ON intervention_content_edited FOR ALL
  USING (auth.role() = 'service_role');

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_intervention_content_edited_chapter_id
  ON intervention_content_edited(chapter_id);
CREATE INDEX IF NOT EXISTS idx_intervention_content_edited_published
  ON intervention_content_edited(is_published) WHERE is_published = TRUE;

-- Updated_at trigger
CREATE TRIGGER update_intervention_content_edited_updated_at
  BEFORE UPDATE ON intervention_content_edited
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function to get chapter content with fallback
-- Returns edited content if published, otherwise falls back to KB article content
CREATE OR REPLACE FUNCTION get_chapter_content(
  p_chapter_id UUID,
  p_locale TEXT DEFAULT 'en'
)
RETURNS TABLE (
  chapter_id UUID,
  title TEXT,
  content TEXT,
  summary TEXT,
  video_url TEXT,
  video_provider TEXT,
  video_title TEXT,
  video_duration_seconds INTEGER,
  is_edited BOOLEAN
)
LANGUAGE plpgsql
AS $$
BEGIN
  -- First try to get published edited content
  RETURN QUERY
  SELECT
    ic.id AS chapter_id,
    CASE WHEN p_locale = 'ms' THEN COALESCE(ice.title_ms, ice.title_en, ic.title_ms, ic.title)
         ELSE COALESCE(ice.title_en, ic.title) END AS title,
    CASE WHEN p_locale = 'ms' THEN COALESCE(ice.content_ms, ice.content_en, kb.content_ms, kb.content)
         ELSE COALESCE(ice.content_en, kb.content) END AS content,
    CASE WHEN p_locale = 'ms' THEN COALESCE(ice.summary_ms, ice.summary_en)
         ELSE ice.summary_en END AS summary,
    COALESCE(ice.video_url, ic.video_url) AS video_url,
    COALESCE(ice.video_provider, ic.video_provider) AS video_provider,
    CASE WHEN p_locale = 'ms' THEN COALESCE(ice.video_title_ms, ice.video_title)
         ELSE ice.video_title END AS video_title,
    COALESCE(ice.video_duration_seconds, ic.video_duration_seconds) AS video_duration_seconds,
    (ice.id IS NOT NULL AND ice.is_published = TRUE) AS is_edited
  FROM intervention_chapters ic
  LEFT JOIN intervention_content_edited ice ON ice.chapter_id = ic.id AND ice.is_published = TRUE
  LEFT JOIN kb_articles kb ON kb.id = ic.kb_article_id
  WHERE ic.id = p_chapter_id;
END;
$$;

-- Comments for documentation
COMMENT ON TABLE intervention_content_edited IS 'Post-edited intervention content with clean formatting, overrides KB raw text';
COMMENT ON COLUMN intervention_content_edited.content_en IS 'Well-formatted markdown content in English';
COMMENT ON COLUMN intervention_content_edited.content_ms IS 'Well-formatted markdown content in Bahasa Malaysia';
COMMENT ON COLUMN intervention_content_edited.is_published IS 'Only published content overrides KB content';
