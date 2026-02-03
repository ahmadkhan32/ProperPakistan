-- ================================================
-- COMPLETE SUPABASE DATABASE SETUP
-- ProperPakistan.com - Production Ready
-- ================================================

-- ================================================
-- 0. REQUIRED EXTENSIONS
-- ================================================
CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- ================================================
-- 1. PROFILES TABLE
-- ================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  avatar_url TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  supabase_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Profiles viewable by everyone" ON public.profiles;
CREATE POLICY "Profiles viewable by everyone"
  ON public.profiles FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- ================================================
-- 2. CATEGORIES TABLE
-- ================================================
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  icon TEXT,
  color TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_categories_slug ON public.categories(slug);

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Categories viewable by all" ON public.categories;
CREATE POLICY "Categories viewable by all"
  ON public.categories FOR SELECT USING (true);

DROP POLICY IF EXISTS "Only admins can modify categories" ON public.categories;
CREATE POLICY "Only admins can modify categories"
  ON public.categories FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

INSERT INTO public.categories (name, slug, description, icon, color) VALUES
  ('Technology', 'technology', 'Latest tech news, tutorials, and tips', '💻', '#3b82f6'),
  ('Education', 'education', 'Educational resources and learning paths', '📚', '#10b981'),
  ('Freelancing', 'freelancing', 'Freelancing tips and success stories', '💼', '#f59e0b'),
  ('Study Abroad', 'study-abroad', 'Scholarships and study opportunities', '✈️', '#8b5cf6')
ON CONFLICT (slug) DO NOTHING;

-- ================================================
-- 3. POSTS TABLE
-- ================================================
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
  status TEXT DEFAULT 'published' CHECK (status IN ('draft', 'published')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  search_vector tsvector GENERATED ALWAYS AS (
    setweight(to_tsvector('english', coalesce(title, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(excerpt, '')), 'B') ||
    setweight(to_tsvector('english', coalesce(content, '')), 'C')
  ) STORED
);

CREATE INDEX IF NOT EXISTS idx_posts_slug ON public.posts(slug);
CREATE INDEX IF NOT EXISTS idx_posts_category ON public.posts(category_id);
CREATE INDEX IF NOT EXISTS idx_posts_author ON public.posts(author_id);
CREATE INDEX IF NOT EXISTS idx_posts_status ON public.posts(status);
CREATE INDEX IF NOT EXISTS idx_posts_search ON public.posts USING GIN(search_vector);

ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Published posts viewable by all" ON public.posts;
CREATE POLICY "Published posts viewable by all"
  ON public.posts FOR SELECT USING (status = 'published');

DROP POLICY IF EXISTS "Admin can do everything with posts" ON public.posts;
CREATE POLICY "Admin can do everything with posts"
  ON public.posts FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ================================================
-- 4. COMMENTS TABLE
-- ================================================
CREATE TABLE IF NOT EXISTS public.comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  text TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_comments_post ON public.comments(post_id);

ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Comments viewable by all" ON public.comments;
CREATE POLICY "Comments viewable by all"
  ON public.comments FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can add comments" ON public.comments;
CREATE POLICY "Users can add comments"
  ON public.comments FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can modify own comments" ON public.comments;
CREATE POLICY "Users can modify own comments"
  ON public.comments FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own comments" ON public.comments;
CREATE POLICY "Users can delete own comments"
  ON public.comments FOR DELETE USING (auth.uid() = user_id);

-- ================================================
-- 5. LIKES TABLE
-- ================================================
CREATE TABLE IF NOT EXISTS public.likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (post_id, user_id)
);

ALTER TABLE public.likes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Likes viewable by all" ON public.likes;
CREATE POLICY "Likes viewable by all"
  ON public.likes FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can like" ON public.likes;
CREATE POLICY "Users can like"
  ON public.likes FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can unlike" ON public.likes;
CREATE POLICY "Users can unlike"
  ON public.likes FOR DELETE USING (auth.uid() = user_id);

-- ================================================
-- 6. BOOKMARKS TABLE
-- ================================================
CREATE TABLE IF NOT EXISTS public.bookmarks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (post_id, user_id)
);

ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users view own bookmarks" ON public.bookmarks;
CREATE POLICY "Users view own bookmarks"
  ON public.bookmarks FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can bookmark" ON public.bookmarks;
CREATE POLICY "Users can bookmark"
  ON public.bookmarks FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can unbookmark" ON public.bookmarks;
CREATE POLICY "Users can unbookmark"
  ON public.bookmarks FOR DELETE USING (auth.uid() = user_id);

-- ================================================
-- 7. SUBSCRIBERS TABLE
-- ================================================
CREATE TABLE IF NOT EXISTS public.subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL
    CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
  subscribed BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.subscribers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can subscribe" ON public.subscribers;
CREATE POLICY "Anyone can subscribe"
  ON public.subscribers FOR INSERT WITH CHECK (true);

-- ================================================
-- 8. FUNCTIONS & TRIGGERS
-- ================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, avatar_url, supabase_id)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    NEW.email,
    NEW.raw_user_meta_data->>'avatar_url',
    NEW.id
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_updated_at_posts ON public.posts;
CREATE TRIGGER set_updated_at_posts
BEFORE UPDATE ON public.posts
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_updated_at_comments ON public.comments;
CREATE TRIGGER set_updated_at_comments
BEFORE UPDATE ON public.comments
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ================================================
-- 9. REALTIME SAFE (FINAL FIX)
-- ================================================
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime') THEN

    IF NOT EXISTS (
      SELECT 1
      FROM pg_publication_rel pr
      JOIN pg_class c ON c.oid = pr.prrelid
      WHERE pr.prpubid = (
        SELECT oid FROM pg_publication WHERE pubname = 'supabase_realtime'
      )
      AND c.relname = 'comments'
    ) THEN
      ALTER PUBLICATION supabase_realtime ADD TABLE public.comments;
    END IF;

    IF NOT EXISTS (
      SELECT 1
      FROM pg_publication_rel pr
      JOIN pg_class c ON c.oid = pr.prrelid
      WHERE pr.prpubid = (
        SELECT oid FROM pg_publication WHERE pubname = 'supabase_realtime'
      )
      AND c.relname = 'posts'
    ) THEN
      ALTER PUBLICATION supabase_realtime ADD TABLE public.posts;
    END IF;

  END IF;
END $$;

-- ================================================
-- ✅ SETUP COMPLETE — SAFE TO RE-RUN
-- ================================================
