# 🎯 COPY THIS → PASTE IN SUPABASE → CLICK RUN

**Quick Links:**
- 📝 [Open SQL Editor](https://supabase.com/dashboard/project/vtlobwtvhdeszradzruz/sql/new) ← Click this
- ⚙️ [Reload Schema Cache](https://supabase.com/dashboard/project/vtlobwtvhdeszradzruz/settings/api) ← After running SQL

---

## Step 1: Copy Everything Below This Line

```sql
-- ========================================
-- COMPLETE DATABASE SETUP - COPY ALL OF THIS
-- ========================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- 2. PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  avatar_url TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view profiles" ON profiles;
CREATE POLICY "Public can view profiles" ON profiles FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- 3. CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  icon TEXT,
  color TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone view categories" ON categories;
CREATE POLICY "Anyone view categories" ON categories FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin manage categories" ON categories;
CREATE POLICY "Admin manage categories" ON categories FOR ALL 
USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- Seed Categories
INSERT INTO categories (name, slug, description, icon, color) VALUES
('Technology','technology','Latest in tech','💻','#3b82f6'),
('Education','education','Learning resources','📚','#10b981'),
('Freelancing','freelancing','Work from home','💼','#f59e0b'),
('Study Abroad','study-abroad','Scholarship guides','✈️','#8b5cf6')
ON CONFLICT (slug) DO NOTHING;

-- 4. POSTS TABLE
CREATE TABLE IF NOT EXISTS public.posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  image TEXT,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  author_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  seo_title TEXT,
  seo_description TEXT,
  tags TEXT[],
  views INTEGER DEFAULT 0,
  featured BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'published' CHECK (status IN ('draft', 'published')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  search_vector tsvector GENERATED ALWAYS AS (
    setweight(to_tsvector('english', title), 'A') ||
    setweight(to_tsvector('english', content), 'B')
  ) STORED
);

CREATE INDEX IF NOT EXISTS idx_posts_slug ON posts(slug);
CREATE INDEX IF NOT EXISTS idx_posts_category ON posts(category_id);
CREATE INDEX IF NOT EXISTS idx_posts_author ON posts(author_id);
CREATE INDEX IF NOT EXISTS idx_posts_search ON posts USING GIN(search_vector);
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public view published posts" ON posts;
CREATE POLICY "Public view published posts" ON posts FOR SELECT USING (status = 'published');

DROP POLICY IF EXISTS "Admin manage posts" ON posts;
CREATE POLICY "Admin manage posts" ON posts FOR ALL 
USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- 5. COMMENTS TABLE
CREATE TABLE IF NOT EXISTS public.comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_comments_post_id ON comments(post_id);
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Comments viewable by all" ON comments;
CREATE POLICY "Comments viewable by all" ON comments FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can comment" ON comments;
CREATE POLICY "Users can comment" ON comments FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can manage own comments" ON comments;
CREATE POLICY "Users can manage own comments" ON comments FOR ALL USING (auth.uid() = user_id);

-- 6. LIKES TABLE (THIS FIXES YOUR ERROR!)
CREATE TABLE IF NOT EXISTS public.likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(post_id, user_id)
);

ALTER TABLE likes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Likes viewable by all" ON likes;
CREATE POLICY "Likes viewable by all" ON likes FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can like/unlike" ON likes;
CREATE POLICY "Users can like/unlike" ON likes FOR ALL USING (auth.uid() = user_id);

-- 7. BOOKMARKS TABLE
CREATE TABLE IF NOT EXISTS public.bookmarks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(post_id, user_id)
);

ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users view own bookmarks" ON bookmarks;
CREATE POLICY "Users view own bookmarks" ON bookmarks FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users manage own bookmarks" ON bookmarks;
CREATE POLICY "Users manage own bookmarks" ON bookmarks FOR ALL USING (auth.uid() = user_id);

-- 8. SUBSCRIBERS TABLE
CREATE TABLE IF NOT EXISTS public.subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  subscribed BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE subscribers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can subscribe" ON subscribers;
CREATE POLICY "Public can subscribe" ON subscribers FOR INSERT WITH CHECK (true);

-- 9. AUTO-CREATE PROFILE ON SIGNUP
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 10. AUTO-UPDATE TIMESTAMPS
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_updated_at_posts ON posts;
CREATE TRIGGER set_updated_at_posts BEFORE UPDATE ON posts FOR EACH ROW EXECUTE FUNCTION update_timestamp();

DROP TRIGGER IF EXISTS set_updated_at_profiles ON profiles;
CREATE TRIGGER set_updated_at_profiles BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_timestamp();

DROP TRIGGER IF EXISTS set_updated_at_comments ON comments;
CREATE TRIGGER set_updated_at_comments BEFORE UPDATE ON comments FOR EACH ROW EXECUTE FUNCTION update_timestamp();

-- ========================================
-- ✅ DONE! Now click RUN button
-- ========================================
```

---

## Step 2: After Running SQL

1. Go to [API Settings](https://supabase.com/dashboard/project/vtlobwtvhdeszradzruz/settings/api)
2. Click **"Reload schema cache"** button
3. Restart your server: `Ctrl+C` then `npm run dev`

Done! 🎉
