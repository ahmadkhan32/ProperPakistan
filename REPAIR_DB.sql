-- ================================================
-- 🛠️ REPAIR DATABASE SCRIPT
-- Run this to create the missing 'posts' table
-- ================================================

-- 1. Create Categories (if missing)
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  icon TEXT,
  color TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert Default Categories (safe to run multiple times)
INSERT INTO public.categories (name, slug, description, icon, color) VALUES
  ('Technology', 'technology', 'Latest tech news, tutorials, and tips', '💻', '#3b82f6'),
  ('Education', 'education', 'Educational resources and learning paths', '📚', '#10b981'),
  ('Freelancing', 'freelancing', 'Freelancing tips and success stories', '💼', '#f59e0b'),
  ('Study Abroad', 'study-abroad', 'Scholarships and study opportunities', '✈️', '#8b5cf6')
ON CONFLICT (slug) DO NOTHING;

-- 2. Create Posts (The missing table!)
CREATE TABLE IF NOT EXISTS public.posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  image TEXT,
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  author_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  seo_title TEXT,
  seo_description TEXT,
  tags TEXT[],
  views INTEGER DEFAULT 0,
  featured BOOLEAN DEFAULT FALSE,
  status TEXT DEFAULT 'published',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  -- Full Text Search Setup
  search_vector tsvector GENERATED ALWAYS AS (
    setweight(to_tsvector('english', coalesce(title, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(excerpt, '')), 'B') ||
    setweight(to_tsvector('english', coalesce(content, '')), 'C')
  ) STORED
);

-- 3. Enable Permissions (RLS)
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

-- Policies for Categories
DROP POLICY IF EXISTS "Categories viewable by all" ON public.categories;
CREATE POLICY "Categories viewable by all" ON public.categories FOR SELECT USING (true);

-- Policies for Posts
DROP POLICY IF EXISTS "Published posts viewable by all" ON public.posts;
CREATE POLICY "Published posts viewable by all" ON public.posts FOR SELECT USING (status = 'published');

DROP POLICY IF EXISTS "Admin can do everything with posts" ON public.posts;
CREATE POLICY "Admin can do everything with posts" ON public.posts FOR ALL USING (
  auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'admin')
);

-- 4. Create Indexes for Performance
CREATE INDEX IF NOT EXISTS idx_posts_slug ON public.posts(slug);
CREATE INDEX IF NOT EXISTS idx_posts_category ON public.posts(category_id);
CREATE INDEX IF NOT EXISTS idx_posts_author ON public.posts(author_id);
CREATE INDEX IF NOT EXISTS idx_posts_created ON public.posts(created_at DESC);

-- ================================================
-- ✅ REPAIR COMPLETE
-- Now Click "Reload schema cache" in Supabase Settings!
-- ================================================
