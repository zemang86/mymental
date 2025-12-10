-- ============================================
-- MyMental Database Schema
-- Version: 1.0
-- ============================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "vector";

-- ============================================
-- ENUMS
-- ============================================

CREATE TYPE risk_level AS ENUM ('low', 'moderate', 'high', 'imminent');

CREATE TYPE assessment_type AS ENUM (
  'depression',
  'anxiety',
  'ocd',
  'ptsd',
  'insomnia',
  'suicidal',
  'psychosis',
  'sexual_addiction',
  'marital_distress'
);

CREATE TYPE assessment_status AS ENUM ('in_progress', 'completed', 'abandoned');

CREATE TYPE payment_status AS ENUM ('pending', 'completed', 'failed', 'refunded');

CREATE TYPE subscription_tier AS ENUM ('free', 'basic', 'premium');

CREATE TYPE gender_type AS ENUM ('male', 'female', 'other', 'prefer_not_to_say');

CREATE TYPE marital_status_type AS ENUM ('single', 'married', 'divorced', 'widowed', 'separated');

-- ============================================
-- PROFILES (extends Supabase auth.users)
-- ============================================

CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  gender gender_type,
  age INTEGER CHECK (age >= 13 AND age <= 120),
  marital_status marital_status_type,
  nationality TEXT DEFAULT 'Malaysian',
  religion TEXT,
  language TEXT DEFAULT 'en' CHECK (language IN ('en', 'ms')),
  education TEXT,
  occupation TEXT,
  has_mental_illness_diagnosis BOOLEAN DEFAULT FALSE,
  mental_illness_details TEXT,

  -- Subscription
  subscription_tier subscription_tier DEFAULT 'free',
  subscription_expires_at TIMESTAMPTZ,
  stripe_customer_id TEXT,

  -- Flags
  is_chat_blocked BOOLEAN DEFAULT FALSE,
  chat_blocked_until TIMESTAMPTZ,
  chat_blocked_reason TEXT,

  -- Consent
  accepted_terms_at TIMESTAMPTZ,
  accepted_privacy_at TIMESTAMPTZ,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- DEMOGRAPHIC SESSIONS (pre-registration anonymous users)
-- ============================================

CREATE TABLE demographic_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_token TEXT UNIQUE NOT NULL,

  -- Demographics
  gender gender_type,
  age INTEGER CHECK (age >= 13 AND age <= 120),
  marital_status marital_status_type,
  nationality TEXT DEFAULT 'Malaysian',
  religion TEXT,
  language TEXT DEFAULT 'en' CHECK (language IN ('en', 'ms')),
  education TEXT,
  occupation TEXT,
  has_mental_illness_diagnosis BOOLEAN,

  -- Consent
  accepted_terms BOOLEAN DEFAULT FALSE,
  accepted_privacy BOOLEAN DEFAULT FALSE,

  -- Conversion tracking
  converted_to_user_id UUID REFERENCES profiles(id),
  converted_at TIMESTAMPTZ,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ DEFAULT NOW() + INTERVAL '24 hours'
);

-- ============================================
-- INITIAL SCREENINGS
-- ============================================

CREATE TABLE initial_screenings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID REFERENCES demographic_sessions(id),
  user_id UUID REFERENCES profiles(id),

  raw_answers JSONB NOT NULL DEFAULT '{}',
  detected_conditions assessment_type[] DEFAULT '{}',

  -- Risk flags
  has_suicidal_ideation BOOLEAN DEFAULT FALSE,
  has_psychosis_indicators BOOLEAN DEFAULT FALSE,
  overall_risk_level risk_level DEFAULT 'low',

  created_at TIMESTAMPTZ DEFAULT NOW(),

  CONSTRAINT screening_owner CHECK (session_id IS NOT NULL OR user_id IS NOT NULL)
);

-- ============================================
-- SOCIAL FUNCTION SCREENINGS
-- ============================================

CREATE TABLE social_function_screenings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID REFERENCES demographic_sessions(id),
  user_id UUID REFERENCES profiles(id),
  initial_screening_id UUID REFERENCES initial_screenings(id),

  raw_answers JSONB NOT NULL DEFAULT '{}',
  total_score INTEGER CHECK (total_score >= 0 AND total_score <= 32),
  functional_level TEXT CHECK (functional_level IN ('high', 'moderate', 'low', 'severe')),

  created_at TIMESTAMPTZ DEFAULT NOW(),

  CONSTRAINT social_owner CHECK (session_id IS NOT NULL OR user_id IS NOT NULL)
);

-- ============================================
-- ASSESSMENTS (detailed individual assessments)
-- ============================================

CREATE TABLE assessments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID REFERENCES demographic_sessions(id),
  user_id UUID REFERENCES profiles(id),

  assessment_type assessment_type NOT NULL,
  status assessment_status DEFAULT 'in_progress',
  is_premium BOOLEAN DEFAULT FALSE,

  raw_answers JSONB DEFAULT '{}',
  total_score INTEGER,
  score_breakdown JSONB,
  risk_level risk_level,

  -- RAG-generated result
  result_text TEXT,
  result_html TEXT,
  recommendations JSONB,

  -- Metadata
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  time_spent_seconds INTEGER,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  CONSTRAINT assessment_owner CHECK (session_id IS NOT NULL OR user_id IS NOT NULL)
);

-- ============================================
-- TRIAGE EVENTS
-- ============================================

CREATE TABLE triage_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  assessment_id UUID REFERENCES assessments(id),
  initial_screening_id UUID REFERENCES initial_screenings(id),
  user_id UUID REFERENCES profiles(id),
  session_id UUID REFERENCES demographic_sessions(id),

  risk_level risk_level NOT NULL,
  trigger_reason TEXT NOT NULL,
  trigger_question_id TEXT,
  trigger_answer JSONB,

  -- Actions taken
  chat_blocked BOOLEAN DEFAULT FALSE,
  emergency_modal_shown BOOLEAN DEFAULT FALSE,
  notification_sent BOOLEAN DEFAULT FALSE,

  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- KNOWLEDGE BASE ARTICLES
-- ============================================

CREATE TABLE kb_articles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  title_ms TEXT,
  summary TEXT,
  summary_ms TEXT,
  body TEXT NOT NULL,
  body_ms TEXT,
  body_html TEXT,

  -- Categorization
  category assessment_type,
  tags TEXT[] DEFAULT '{}',

  -- Vector embedding for RAG (OpenAI ada-002 = 1536 dimensions)
  embedding vector(1536),
  embedding_ms vector(1536),

  -- Metadata
  author TEXT,
  is_published BOOLEAN DEFAULT TRUE,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- CHAT MESSAGES
-- ============================================

CREATE TABLE chat_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) NOT NULL,

  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,

  -- Safety metadata
  was_filtered BOOLEAN DEFAULT FALSE,
  filter_reason TEXT,

  -- RAG context used
  rag_context JSONB,

  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- INTERVENTIONS
-- ============================================

CREATE TABLE interventions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  title TEXT NOT NULL,
  title_ms TEXT,
  description TEXT,
  description_ms TEXT,
  intervention_type TEXT CHECK (intervention_type IN ('online_video', 'in_person')),

  -- For online video
  video_url TEXT,
  duration_minutes INTEGER,
  chapters JSONB,

  -- For in-person
  external_booking_url TEXT,

  -- Pricing
  price_myr DECIMAL(10, 2),
  is_free BOOLEAN DEFAULT FALSE,

  -- Targeting
  target_conditions assessment_type[],
  target_risk_levels risk_level[],

  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- USER INTERVENTIONS
-- ============================================

CREATE TABLE user_interventions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) NOT NULL,
  intervention_id UUID REFERENCES interventions(id) NOT NULL,
  payment_id UUID,

  -- Progress
  progress_percent INTEGER DEFAULT 0,
  last_watched_chapter INTEGER,
  completed_at TIMESTAMPTZ,

  created_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(user_id, intervention_id)
);

-- ============================================
-- PAYMENTS
-- ============================================

CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) NOT NULL,

  amount_myr DECIMAL(10, 2) NOT NULL,
  currency TEXT DEFAULT 'MYR',
  payment_method TEXT CHECK (payment_method IN ('stripe', 'fpx', 'billplz')),
  status payment_status DEFAULT 'pending',

  -- What was purchased
  product_type TEXT CHECK (product_type IN ('assessment', 'intervention', 'subscription')),
  product_id UUID,

  -- Provider-specific IDs
  stripe_payment_intent_id TEXT,
  stripe_checkout_session_id TEXT,
  fpx_transaction_id TEXT,
  billplz_bill_id TEXT,

  metadata JSONB,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- Add foreign key reference for user_interventions.payment_id
ALTER TABLE user_interventions
ADD CONSTRAINT fk_user_interventions_payment
FOREIGN KEY (payment_id) REFERENCES payments(id);

-- ============================================
-- SUBSCRIPTIONS
-- ============================================

CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) NOT NULL UNIQUE,

  tier subscription_tier NOT NULL,
  status TEXT CHECK (status IN ('active', 'cancelled', 'past_due', 'expired')),

  stripe_subscription_id TEXT,
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- ASSESSMENT QUESTIONS (reference data)
-- ============================================

CREATE TABLE assessment_questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  assessment_type assessment_type NOT NULL,
  question_order INTEGER NOT NULL,
  question_id TEXT NOT NULL,

  question_text TEXT NOT NULL,
  question_text_ms TEXT,

  question_type TEXT CHECK (question_type IN ('yes_no', 'likert', 'multiple_choice', 'scale')),
  options JSONB NOT NULL,

  -- Triage rules
  triage_rule JSONB,

  is_active BOOLEAN DEFAULT TRUE,

  UNIQUE(assessment_type, question_id)
);

-- ============================================
-- INDEXES
-- ============================================

CREATE INDEX idx_profiles_email ON profiles(email);
CREATE INDEX idx_profiles_subscription ON profiles(subscription_tier);

CREATE INDEX idx_demographic_sessions_token ON demographic_sessions(session_token);
CREATE INDEX idx_demographic_sessions_expires ON demographic_sessions(expires_at);

CREATE INDEX idx_initial_screenings_session ON initial_screenings(session_id);
CREATE INDEX idx_initial_screenings_user ON initial_screenings(user_id);
CREATE INDEX idx_initial_screenings_risk ON initial_screenings(overall_risk_level);

CREATE INDEX idx_social_screenings_session ON social_function_screenings(session_id);
CREATE INDEX idx_social_screenings_user ON social_function_screenings(user_id);

CREATE INDEX idx_assessments_session ON assessments(session_id);
CREATE INDEX idx_assessments_user ON assessments(user_id);
CREATE INDEX idx_assessments_type ON assessments(assessment_type);
CREATE INDEX idx_assessments_status ON assessments(status);
CREATE INDEX idx_assessments_risk ON assessments(risk_level);

CREATE INDEX idx_triage_events_user ON triage_events(user_id);
CREATE INDEX idx_triage_events_risk ON triage_events(risk_level);
CREATE INDEX idx_triage_events_created ON triage_events(created_at);

CREATE INDEX idx_kb_articles_category ON kb_articles(category);
CREATE INDEX idx_kb_articles_slug ON kb_articles(slug);
CREATE INDEX idx_kb_articles_published ON kb_articles(is_published);

-- Vector similarity search index (IVFFlat for approximate nearest neighbor)
CREATE INDEX idx_kb_articles_embedding ON kb_articles
USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 100);

CREATE INDEX idx_chat_messages_user ON chat_messages(user_id);
CREATE INDEX idx_chat_messages_created ON chat_messages(created_at);

CREATE INDEX idx_payments_user ON payments(user_id);
CREATE INDEX idx_payments_status ON payments(status);

CREATE INDEX idx_questions_type ON assessment_questions(assessment_type);

-- ============================================
-- FUNCTIONS
-- ============================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to relevant tables
CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER assessments_updated_at
  BEFORE UPDATE ON assessments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER kb_articles_updated_at
  BEFORE UPDATE ON kb_articles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER subscriptions_updated_at
  BEFORE UPDATE ON subscriptions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Vector similarity search function for RAG
CREATE OR REPLACE FUNCTION match_kb_articles(
  query_embedding vector(1536),
  match_threshold float DEFAULT 0.7,
  match_count int DEFAULT 5,
  filter_category assessment_type DEFAULT NULL
)
RETURNS TABLE (
  id UUID,
  title TEXT,
  body TEXT,
  category assessment_type,
  similarity float
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    kb.id,
    kb.title,
    kb.body,
    kb.category,
    1 - (kb.embedding <=> query_embedding) as similarity
  FROM kb_articles kb
  WHERE kb.is_published = true
    AND kb.embedding IS NOT NULL
    AND (filter_category IS NULL OR kb.category = filter_category)
    AND 1 - (kb.embedding <=> query_embedding) > match_threshold
  ORDER BY kb.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;

-- Block user chat function
CREATE OR REPLACE FUNCTION block_user_chat(
  p_user_id UUID,
  p_reason TEXT,
  p_duration_hours INTEGER DEFAULT 24
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE profiles
  SET
    is_chat_blocked = true,
    chat_blocked_until = NOW() + (p_duration_hours || ' hours')::interval,
    chat_blocked_reason = p_reason
  WHERE id = p_user_id;
END;
$$;

-- Create profile on user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (new.id, new.email);
  RETURN new;
END;
$$;

-- Trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ============================================
-- ROW LEVEL SECURITY POLICIES
-- ============================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE demographic_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE initial_screenings ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_function_screenings ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE triage_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE kb_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE interventions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_interventions ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment_questions ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Demographic sessions (public insert for anonymous users)
CREATE POLICY "Anyone can create demographic sessions"
  ON demographic_sessions FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can view their own sessions"
  ON demographic_sessions FOR SELECT
  USING (converted_to_user_id = auth.uid() OR session_token IS NOT NULL);

-- Initial screenings
CREATE POLICY "Users can view own screenings"
  ON initial_screenings FOR SELECT
  USING (user_id = auth.uid() OR session_id IS NOT NULL);

CREATE POLICY "Anyone can create screenings"
  ON initial_screenings FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can update own screenings"
  ON initial_screenings FOR UPDATE
  USING (user_id = auth.uid());

-- Social function screenings
CREATE POLICY "Users can view own social screenings"
  ON social_function_screenings FOR SELECT
  USING (user_id = auth.uid() OR session_id IS NOT NULL);

CREATE POLICY "Anyone can create social screenings"
  ON social_function_screenings FOR INSERT
  WITH CHECK (true);

-- Assessments
CREATE POLICY "Users can view own assessments"
  ON assessments FOR SELECT
  USING (user_id = auth.uid() OR session_id IS NOT NULL);

CREATE POLICY "Anyone can create assessments"
  ON assessments FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can update own assessments"
  ON assessments FOR UPDATE
  USING (user_id = auth.uid());

-- Triage events (admin only through service role)
CREATE POLICY "Service role can manage triage events"
  ON triage_events FOR ALL
  USING (auth.role() = 'service_role');

-- KB Articles (public read)
CREATE POLICY "Anyone can view published articles"
  ON kb_articles FOR SELECT
  USING (is_published = true);

-- Chat messages
CREATE POLICY "Users can view own messages"
  ON chat_messages FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can create own messages"
  ON chat_messages FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- Interventions (public read)
CREATE POLICY "Anyone can view active interventions"
  ON interventions FOR SELECT
  USING (is_active = true);

-- User interventions
CREATE POLICY "Users can view own interventions"
  ON user_interventions FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can update own interventions"
  ON user_interventions FOR UPDATE
  USING (user_id = auth.uid());

-- Payments
CREATE POLICY "Users can view own payments"
  ON payments FOR SELECT
  USING (user_id = auth.uid());

-- Subscriptions
CREATE POLICY "Users can view own subscription"
  ON subscriptions FOR SELECT
  USING (user_id = auth.uid());

-- Assessment questions (public read)
CREATE POLICY "Anyone can view active questions"
  ON assessment_questions FOR SELECT
  USING (is_active = true);
