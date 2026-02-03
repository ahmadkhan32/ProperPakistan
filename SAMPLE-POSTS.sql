/*===========================================================
  1) ENABLE EXTENSIONS
===========================================================*/
CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS pg_trgm;

/*===========================================================
  2) TABLES & SCHEMA UPDATES
===========================================================*/

-- CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- PROFILES TABLE
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT,
  email TEXT UNIQUE,
  role TEXT DEFAULT 'user',
  avatar_url TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- UPDATE PROFILES (Ensure email exists)
DO $$ 
BEGIN 
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='email') THEN
    ALTER TABLE profiles ADD COLUMN email TEXT UNIQUE;
  END IF;
END $$;

-- POSTS TABLE
CREATE TABLE IF NOT EXISTS posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  author_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- UPDATE POSTS (Ensure all new columns exist)
DO $$ 
BEGIN 
  -- Check cover_image
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='posts' AND column_name='cover_image') THEN
    ALTER TABLE posts ADD COLUMN cover_image TEXT;
  END IF;

  -- Check status
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='posts' AND column_name='status') THEN
    ALTER TABLE posts ADD COLUMN status TEXT DEFAULT 'draft' CHECK (status IN ('draft','published'));
  END IF;

  -- Check featured
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='posts' AND column_name='featured') THEN
    ALTER TABLE posts ADD COLUMN featured BOOLEAN DEFAULT false;
  END IF;

  -- Check SEO columns
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='posts' AND column_name='seo_title') THEN
    ALTER TABLE posts ADD COLUMN seo_title TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='posts' AND column_name='seo_description') THEN
    ALTER TABLE posts ADD COLUMN seo_description TEXT;
  END IF;

  -- Check tags
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='posts' AND column_name='tags') THEN
    ALTER TABLE posts ADD COLUMN tags TEXT[] DEFAULT ARRAY[]::TEXT[];
  END IF;

  -- Check views
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='posts' AND column_name='views') THEN
    ALTER TABLE posts ADD COLUMN views INTEGER DEFAULT 0;
  END IF;
END $$;

/*===========================================================
  3) BASE DATA
===========================================================*/

INSERT INTO categories (name, slug)
VALUES ('Technology', 'technology'), ('Education', 'education')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO profiles (id, full_name, email, role)
SELECT gen_random_uuid(), 'Admin User', 'admin@example.com', 'admin'
WHERE NOT EXISTS (SELECT 1 FROM profiles WHERE role = 'admin');

/*===========================================================
  4) INSERT SAMPLE POSTS
===========================================================*/

INSERT INTO posts
(title, slug, content, excerpt, category_id, author_id, cover_image, status, featured, seo_title, seo_description, tags, created_at, views)
VALUES
(
  'The Future of AI in Pakistan: Opportunities and Challenges',
  'future-ai-pakistan-opportunities-challenges',
  '<h2>Introduction</h2><p>Artificial Intelligence is transforming Pakistan''s tech landscape.</p>',
  'Exploring how AI is reshaping Pakistan technology sector.',
  (SELECT id FROM categories WHERE slug = 'technology' LIMIT 1),
  (SELECT id FROM profiles WHERE role = 'admin' LIMIT 1),
  'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800',
  'published',
  true,
  'AI in Pakistan: Future Opportunities & Challenges 2026',
  'Discover how AI is transforming Pakistan.',
  ARRAY['AI','Pakistan','Technology','Innovation'],
  NOW() - INTERVAL '2 days',
  1247
),
(
  '10 Essential Web Development Tools Every Pakistani Freelancer Should Know',
  'web-development-tools-pakistani-freelancers',
  '<h2>Tools</h2><p>VS Code, Figma, GitHub...</p>',
  'Guide to must-have tools for web developers in Pakistan.',
  (SELECT id FROM categories WHERE slug = 'technology' LIMIT 1),
  (SELECT id FROM profiles WHERE role = 'admin' LIMIT 1),
  'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800',
  'published',
  false,
  'Top 10 Web Development Tools for Pakistani Freelancers',
  'Master essential web dev tools.',
  ARRAY['Web Development','Freelancing','Pakistan'],
  NOW() - INTERVAL '5 days',
  892
)
ON CONFLICT (slug) DO NOTHING;

/*===========================================================
  5) RANDOMIZE VIEWS
===========================================================*/
UPDATE posts
SET views = FLOOR(RANDOM() * 3000 + 500)
WHERE created_at < NOW() - INTERVAL '3 days';

SELECT '✅ SUPABASE BLOG SCRIPT EXECUTED SUCCESSFULLY' AS message;