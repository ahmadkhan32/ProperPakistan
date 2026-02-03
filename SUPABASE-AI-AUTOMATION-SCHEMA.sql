-- ================================================
-- AI BLOG AUTOMATION PLATFORM - DATABASE SCHEMA
-- ProperPakistan AI Automation Extension
-- ================================================
-- Run this in Supabase SQL Editor

-- ================================================
-- 1. CHATBOT MESSAGES TABLE
-- ================================================
CREATE TABLE IF NOT EXISTS public.chatbot_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  message TEXT NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_chatbot_messages_user ON public.chatbot_messages(user_id);
CREATE INDEX idx_chatbot_messages_created ON public.chatbot_messages(created_at DESC);

-- RLS Policies
ALTER TABLE public.chatbot_messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own chat history" ON public.chatbot_messages;
CREATE POLICY "Users can view own chat history"
  ON public.chatbot_messages FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create own messages" ON public.chatbot_messages;
CREATE POLICY "Users can create own messages"
  ON public.chatbot_messages FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ================================================
-- 2. POST ANALYTICS TABLE
-- ================================================
CREATE TABLE IF NOT EXISTS public.post_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE,
  visitor_ip TEXT,
  country TEXT,
  city TEXT,
  region TEXT,
  age_group TEXT CHECK (age_group IN ('13-17', '18-24', '25-34', '35-44', '45+', 'unknown')),
  device_type TEXT CHECK (device_type IN ('mobile', 'desktop', 'tablet', 'unknown')),
  browser TEXT,
  os TEXT,
  referrer TEXT,
  session_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_post_analytics_post ON public.post_analytics(post_id);
CREATE INDEX idx_post_analytics_country ON public.post_analytics(country);
CREATE INDEX idx_post_analytics_created ON public.post_analytics(created_at DESC);
CREATE INDEX idx_post_analytics_age ON public.post_analytics(age_group);
CREATE INDEX idx_post_analytics_device ON public.post_analytics(device_type);

-- RLS Policies
ALTER TABLE public.post_analytics ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "All can insert analytics" ON public.post_analytics;
CREATE POLICY "All can insert analytics"
  ON public.post_analytics FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can view analytics" ON public.post_analytics;
CREATE POLICY "Admins can view analytics"
  ON public.post_analytics FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ================================================
-- 3. EXTEND POSTS TABLE FOR SCHEDULING
-- ================================================
ALTER TABLE public.posts 
ADD COLUMN IF NOT EXISTS publish_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS scheduled BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS published_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS ai_generated BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS generation_prompt TEXT,
ADD COLUMN IF NOT EXISTS scheduling_frequency TEXT CHECK (
  scheduling_frequency IN ('once', 'daily', 'weekly', 'monthly', 'custom')
),
ADD COLUMN IF NOT EXISTS next_publish_at TIMESTAMPTZ;

-- Index for scheduler to find posts to publish
CREATE INDEX IF NOT EXISTS idx_posts_scheduled ON public.posts(scheduled, publish_at)
  WHERE scheduled = true AND status = 'draft';

-- ================================================
-- 4. ANALYTICS FUNCTIONS
-- ================================================

-- Function: Get total views per post
CREATE OR REPLACE FUNCTION get_post_views(post_uuid UUID)
RETURNS INTEGER AS $$
  SELECT COUNT(*)::INTEGER
  FROM post_analytics
  WHERE post_id = post_uuid;
$$ LANGUAGE SQL STABLE;

-- Function: Get unique views per post (by IP)
CREATE OR REPLACE FUNCTION get_post_unique_views(post_uuid UUID)
RETURNS INTEGER AS $$
  SELECT COUNT(DISTINCT visitor_ip)::INTEGER
  FROM post_analytics
  WHERE post_id = post_uuid;
$$ LANGUAGE SQL STABLE;

-- Function: Get top countries
CREATE OR REPLACE FUNCTION get_top_countries(limit_count INTEGER DEFAULT 10)
RETURNS TABLE(country TEXT, view_count BIGINT) AS $$
  SELECT 
    country, 
    COUNT(*) as view_count
  FROM post_analytics
  WHERE country IS NOT NULL
  GROUP BY country
  ORDER BY view_count DESC
  LIMIT limit_count;
$$ LANGUAGE SQL STABLE;

-- Function: Get age distribution
CREATE OR REPLACE FUNCTION get_age_distribution()
RETURNS TABLE(age_group TEXT, count BIGINT) AS $$
  SELECT 
    age_group, 
    COUNT(*) as count
  FROM post_analytics
  WHERE age_group IS NOT NULL AND age_group != 'unknown'
  GROUP BY age_group
  ORDER BY 
    CASE age_group
      WHEN '13-17' THEN 1
      WHEN '18-24' THEN 2
      WHEN '25-34' THEN 3
      WHEN '35-44' THEN 4
      WHEN '45+' THEN 5
      ELSE 6
    END;
$$ LANGUAGE SQL STABLE;

-- Function: Get device distribution
CREATE OR REPLACE FUNCTION get_device_distribution()
RETURNS TABLE(device_type TEXT, count BIGINT) AS $$
  SELECT 
    device_type, 
    COUNT(*) as count
  FROM post_analytics
  WHERE device_type IS NOT NULL AND device_type != 'unknown'
  GROUP BY device_type
  ORDER BY count DESC;
$$ LANGUAGE SQL STABLE;

-- Function: Get analytics overview
CREATE OR REPLACE FUNCTION get_analytics_overview(days_back INTEGER DEFAULT 30)
RETURNS TABLE(
  total_views BIGINT,
  unique_views BIGINT,
  top_country TEXT,
  most_common_age TEXT,
  mobile_percentage NUMERIC
) AS $$
  SELECT 
    (SELECT COUNT(*) FROM post_analytics WHERE created_at >= NOW() - (days_back || ' days')::INTERVAL),
    (SELECT COUNT(DISTINCT visitor_ip) FROM post_analytics WHERE created_at >= NOW() - (days_back || ' days')::INTERVAL),
    (SELECT country FROM post_analytics WHERE created_at >= NOW() - (days_back || ' days')::INTERVAL AND country IS NOT NULL GROUP BY country ORDER BY COUNT(*) DESC LIMIT 1),
    (SELECT age_group FROM post_analytics WHERE created_at >= NOW() - (days_back || ' days')::INTERVAL AND age_group != 'unknown' GROUP BY age_group ORDER BY COUNT(*) DESC LIMIT 1),
    (SELECT ROUND((COUNT(*) FILTER (WHERE device_type = 'mobile')::NUMERIC / NULLIF(COUNT(*), 0)) * 100, 2) FROM post_analytics WHERE created_at >= NOW() - (days_back || ' days')::INTERVAL);
$$ LANGUAGE SQL STABLE;

-- ================================================
-- 5. AUTO-UPDATE TRIGGERS
-- ================================================

-- Trigger to update published_at when status changes to published
CREATE OR REPLACE FUNCTION set_published_at()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'published' AND OLD.status != 'published' THEN
    NEW.published_at = NOW();
    NEW.scheduled = false;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_set_published_at ON public.posts;
CREATE TRIGGER trigger_set_published_at
  BEFORE UPDATE ON public.posts
  FOR EACH ROW
  EXECUTE FUNCTION set_published_at();

-- ================================================
-- 6. SCHEDULER HELPER FUNCTION
-- ================================================

-- Function: Get posts ready to publish
CREATE OR REPLACE FUNCTION get_posts_to_publish()
RETURNS SETOF public.posts AS $$
  SELECT *
  FROM public.posts
  WHERE scheduled = true
    AND status = 'draft'
    AND publish_at <= NOW()
  ORDER BY publish_at ASC;
$$ LANGUAGE SQL STABLE;

-- Function: Publish a scheduled post
CREATE OR REPLACE FUNCTION publish_scheduled_post(post_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
  UPDATE public.posts
  SET 
    status = 'published',
    scheduled = false,
    published_at = NOW()
  WHERE id = post_uuid;
  
  RETURN FOUND;
END;
$$ LANGUAGE plpgsql;

-- ================================================
-- 7. ANALYTICS MATERIALIZED VIEW (PERFORMANCE)
-- ================================================

CREATE MATERIALIZED VIEW IF NOT EXISTS mv_post_analytics_summary AS
SELECT 
  p.id as post_id,
  p.title,
  p.slug,
  COUNT(pa.id) as total_views,
  COUNT(DISTINCT pa.visitor_ip) as unique_views,
  MODE() WITHIN GROUP (ORDER BY pa.country) as top_country,
  MODE() WITHIN GROUP (ORDER BY pa.device_type) as top_device,
  MAX(pa.created_at) as last_viewed
FROM public.posts p
LEFT JOIN public.post_analytics pa ON p.id = pa.post_id
WHERE p.status = 'published'
GROUP BY p.id, p.title, p.slug;

-- Refresh function
CREATE OR REPLACE FUNCTION refresh_analytics_summary()
RETURNS void AS $$
BEGIN
  REFRESH MATERIALIZED VIEW mv_post_analytics_summary;
END;
$$ LANGUAGE plpgsql;

-- ================================================
-- 8. SAMPLE DATA (OPTIONAL - FOR TESTING)
-- ================================================

-- Insert sample chatbot message
-- INSERT INTO public.chatbot_messages (user_id, role, message) VALUES
-- ((SELECT id FROM profiles WHERE role = 'admin' LIMIT 1), 'user', 'Write a blog about AI in Pakistan');

-- ================================================
-- ✅ SETUP COMPLETE
-- ================================================

-- IMPORTANT: Run this command to create the indexes:
-- REINDEX TABLE public.post_analytics;
-- REFRESH MATERIALIZED VIEW mv_post_analytics_summary;

-- Test queries:
-- SELECT * FROM get_top_countries(5);
-- SELECT * FROM get_age_distribution();
-- SELECT * FROM get_analytics_overview(30);
-- SELECT * FROM get_posts_to_publish();
