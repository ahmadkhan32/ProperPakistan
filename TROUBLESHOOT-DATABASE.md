# 🚨 TROUBLESHOOTING: Posts Table Not Found

## Current Error:
```
Could not find the table 'public.posts' in the schema cache
Hint: Perhaps you meant the table 'public.comments'
```

This means the SQL **wasn't run successfully** or only **partially executed**.

---

## ✅ STEP-BY-STEP FIX:

### Step 1: Check What Tables Exist

1. Go to Supabase: https://supabase.com/dashboard/project/vtlobwtvhdeszradzruz
2. Click **"Table Editor"** (left sidebar)
3. Look at the list of tables

**What do you see?**
- ✅ Only `comments` exists? → SQL failed partway
- ❌ No tables at all? → SQL wasn't run
- ✅ All tables exist? → Schema cache issue

---

### Step 2: Run SQL Properly

#### 🎯 **Method 1: Small Chunks (RECOMMENDED)**

Run the SQL in **3 separate chunks** to avoid timeout:

**CHUNK 1 - Drop & Create Profiles/Categories:**
```sql
DROP TABLE IF EXISTS public.comments CASCADE;
DROP TABLE IF EXISTS public.likes CASCADE;
DROP TABLE IF EXISTS public.bookmarks CASCADE;
DROP TABLE IF EXISTS public.posts CASCADE;
DROP TABLE IF EXISTS public.categories CASCADE;
DROP TABLE IF EXISTS public.subscribers CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  avatar_url TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  supabase_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_profiles_email ON public.profiles(email);
CREATE INDEX idx_profiles_role ON public.profiles(role);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Profiles viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

CREATE TABLE public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  icon TEXT,
  color TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_categories_slug ON public.categories(slug);
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Categories viewable by all" ON public.categories FOR SELECT USING (true);

INSERT INTO public.categories (name, slug, description, icon, color) VALUES
  ('Technology', 'technology', 'Latest tech news, tutorials, and tips', '💻', '#3b82f6'),
  ('Education', 'education', 'Educational resources and learning paths', '📚', '#10b981'),
  ('Freelancing', 'freelancing', 'Freelancing tips and success stories', '💼', '#f59e0b'),
  ('Study Abroad', 'study-abroad', 'Scholarships and study opportunities', '✈️', '#8b5cf6');
```
**Click "Run"** → Wait for success ✅

**CHUNK 2 - Create Posts & Comments:**
```sql
CREATE TABLE public.posts (
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
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_posts_slug ON public.posts(slug);
CREATE INDEX idx_posts_category ON public.posts(category_id);
CREATE INDEX idx_posts_author ON public.posts(author_id);
CREATE INDEX idx_posts_status ON public.posts(status);
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Published posts viewable by all" ON public.posts FOR SELECT USING (status = 'published');

CREATE TABLE public.comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  text TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_comments_post ON public.comments(post_id);
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Comments viewable by all" ON public.comments FOR SELECT USING (true);

CREATE TABLE public.likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(post_id, user_id)
);

ALTER TABLE public.likes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Likes viewable by all" ON public.likes FOR SELECT USING (true);

CREATE TABLE public.bookmarks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(post_id, user_id)
);

ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own bookmarks" ON public.bookmarks FOR SELECT USING (auth.uid() = user_id);
```
**Click "Run"** → Wait for success ✅

**CHUNK 3 - Triggers:**
```sql
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, avatar_url, supabase_id)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(COALESCE(NEW.email, ''), '@', 1)),
    COALESCE(NEW.email, ''),
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
```
**Click "Run"** → Wait for success ✅

---

### Step 3: Reload Schema Cache

After running all chunks:

1. Go to **Settings** → **API**
2. Scroll to **"API Settings"**
3. Click **"Reload schema cache"** button
4. Wait 10 seconds

---

### Step 4: Verify Tables

1. Go to **Table Editor**
2. You should see:
   - ✅ profiles
   - ✅ categories (with 4 rows)
   - ✅ posts
   - ✅ comments
   - ✅ likes
   - ✅ bookmarks

---

### Step 5: Test Your App

1. Refresh: http://localhost:5173
2. Error should be GONE! ✅

---

## 🆘 Still Having Issues?

### Option A: Manual Table Creation

Go to Table Editor → Click "New table" → Name it "posts" → Add columns manually:
- id (uuid, primary key)
- title (text, required)
- slug (text, unique)
- content (text)
- category_id (uuid)
- author_id (uuid)
- status (text, default: 'published')
- created_at (timestamptz)

### Option B: Contact Me

If none of this works, send me a screenshot of:
1. Your Supabase Table Editor
2. The exact error when running SQL

---

## ⚡ Quick Test

Run this simple SQL to test:
```sql
SELECT tablename FROM pg_tables WHERE schemaname = 'public';
```

This will show ALL your public tables. You should see `posts` in the list!
