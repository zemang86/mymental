-- Knowledge Base Articles with pgvector for RAG
-- This migration adds the kb_articles table for storing psychoeducation content with embeddings

-- Enable pgvector extension (if not already enabled)
CREATE EXTENSION IF NOT EXISTS vector;

-- Create kb_articles table
CREATE TABLE IF NOT EXISTS kb_articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL,
  language TEXT NOT NULL DEFAULT 'en' CHECK (language IN ('en', 'ms')),
  file_path TEXT UNIQUE,
  checksum TEXT,
  embedding vector(1536), -- OpenAI ada-002 produces 1536-dimensional vectors
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for category filtering (renamed from condition to avoid confusion)
CREATE INDEX IF NOT EXISTS kb_articles_category_idx ON kb_articles(category);
CREATE INDEX IF NOT EXISTS kb_articles_language_idx ON kb_articles(language);

-- Create index for vector similarity search (only if table has rows to avoid empty index issues)
-- Note: ivfflat index needs data to work properly, so we use a simpler index approach
CREATE INDEX IF NOT EXISTS kb_articles_embedding_idx ON kb_articles USING hnsw (embedding vector_cosine_ops);

-- Function to match kb articles by embedding similarity
CREATE OR REPLACE FUNCTION match_kb_articles(
  query_embedding vector(1536),
  match_threshold float DEFAULT 0.7,
  match_count int DEFAULT 4
)
RETURNS TABLE (
  id UUID,
  title TEXT,
  content TEXT,
  category TEXT,
  language TEXT,
  similarity float
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    kb_articles.id,
    kb_articles.title,
    kb_articles.content,
    kb_articles.category,
    kb_articles.language,
    1 - (kb_articles.embedding <=> query_embedding) AS similarity
  FROM kb_articles
  WHERE 1 - (kb_articles.embedding <=> query_embedding) > match_threshold
  ORDER BY kb_articles.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;

-- Function to match kb articles filtered by category
CREATE OR REPLACE FUNCTION match_kb_articles_by_category(
  query_embedding vector(1536),
  filter_category TEXT,
  match_threshold float DEFAULT 0.7,
  match_count int DEFAULT 4
)
RETURNS TABLE (
  id UUID,
  title TEXT,
  content TEXT,
  category TEXT,
  language TEXT,
  similarity float
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    kb_articles.id,
    kb_articles.title,
    kb_articles.content,
    kb_articles.category,
    kb_articles.language,
    1 - (kb_articles.embedding <=> query_embedding) AS similarity
  FROM kb_articles
  WHERE kb_articles.category = filter_category
    AND 1 - (kb_articles.embedding <=> query_embedding) > match_threshold
  ORDER BY kb_articles.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;

-- Chat messages table for conversation history
CREATE TABLE IF NOT EXISTS chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id UUID NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for efficient chat history retrieval
CREATE INDEX IF NOT EXISTS chat_messages_session_idx ON chat_messages(session_id, created_at);
CREATE INDEX IF NOT EXISTS chat_messages_user_idx ON chat_messages(user_id, created_at);

-- RLS Policies for kb_articles (public read, admin write)
ALTER TABLE kb_articles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "KB articles are publicly readable" ON kb_articles;
CREATE POLICY "KB articles are publicly readable"
  ON kb_articles FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Only service role can modify kb_articles" ON kb_articles;
CREATE POLICY "Only service role can modify kb_articles"
  ON kb_articles FOR ALL
  USING (auth.role() = 'service_role');

-- RLS Policies for chat_messages (users can only see their own)
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can read their own chat messages" ON chat_messages;
CREATE POLICY "Users can read their own chat messages"
  ON chat_messages FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own chat messages" ON chat_messages;
CREATE POLICY "Users can insert their own chat messages"
  ON chat_messages FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Add comments for documentation
COMMENT ON TABLE kb_articles IS 'Knowledge base articles with embeddings for RAG-powered responses';
COMMENT ON COLUMN kb_articles.embedding IS 'OpenAI ada-002 embedding vector (1536 dimensions)';
COMMENT ON TABLE chat_messages IS 'Chat conversation history for AI assistant';
