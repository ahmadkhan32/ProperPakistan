-- ================================================
-- FIX DUPLICATE SLUG ERROR (RUN ONCE SAFELY)
-- ================================================

-- STEP 1: DELETE EXISTING POSTS WITH SAME SLUGS
DELETE FROM public.posts
WHERE slug IN (
  'react-roadmap-pakistani-developers',
  'mern-stack-interview-questions-pakistan',
  'vscode-extensions-pakistani-developers',
  'learn-programming-urdu-free-resources'
);

-- ================================================
-- STEP 2: INSERT POSTS (NO CONFLICT NOW)
-- ================================================

-- POST 1: React Roadmap
INSERT INTO public.posts (
  title, slug, content, excerpt, image,
  category_id, author_id,
  seo_title, seo_description,
  tags, featured, status
)
VALUES (
  'React Roadmap for Pakistani Developers',
  'react-roadmap-pakistani-developers',
  '<h2>Complete React Learning Path for Pakistani Developers</h2>
   <p>React.js has become the go-to library for building modern web applications...</p>',
  'Complete roadmap to learn React.js with hooks, state management, and real-world projects.',
  'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800',
  (SELECT id FROM categories WHERE slug = 'technology' LIMIT 1),
  (SELECT id FROM profiles LIMIT 1),
  'React Roadmap 2026 - Complete Guide for Pakistani Developers',
  'Learn React.js step by step with this comprehensive roadmap.',
  ARRAY['React','JavaScript','Web Development','Frontend','Tutorial'],
  true,
  'published'
);

-- POST 2: MERN Interview
INSERT INTO public.posts (
  title, slug, content, excerpt, image,
  category_id, author_id,
  seo_title, seo_description,
  tags, status
)
VALUES (
  'Top 50 MERN Stack Interview Questions - Pakistan 2026',
  'mern-stack-interview-questions-pakistan',
  '<h2>Top MERN Stack Interview Questions Asked in Pakistan</h2>',
  '50 most asked MERN stack interview questions in Pakistani tech companies.',
  'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800',
  (SELECT id FROM categories WHERE slug = 'technology' LIMIT 1),
  (SELECT id FROM profiles LIMIT 1),
  'MERN Stack Interview Questions Pakistan 2026',
  'Top MERN interview questions asked by Pakistani companies.',
  ARRAY['MERN','Interview','Jobs','MongoDB','React','Node.js'],
  'published'
);

-- POST 3: VS Code Extensions
INSERT INTO public.posts (
  title, slug, content, excerpt, image,
  category_id, author_id,
  seo_title, seo_description,
  tags, featured, status
)
VALUES (
  '15 Must-Have VS Code Extensions for Pakistani Developers',
  'vscode-extensions-pakistani-developers',
  '<h2>Boost Your Productivity with VS Code Extensions</h2>',
  'Best VS Code extensions every Pakistani developer should use.',
  'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800',
  (SELECT id FROM categories WHERE slug = 'technology' LIMIT 1),
  (SELECT id FROM profiles LIMIT 1),
  '15 Best VS Code Extensions for Developers in Pakistan',
  'Must-have VS Code extensions for productivity.',
  ARRAY['VS Code','Tools','Productivity','Development'],
  true,
  'published'
);

-- POST 4: Programming in Urdu
INSERT INTO public.posts (
  title, slug, content, excerpt, image,
  category_id, author_id,
  seo_title, seo_description,
  tags, status
)
VALUES (
  'Learn Programming in Urdu - Free Resources 2026',
  'learn-programming-urdu-free-resources',
  '<h2>اردو میں پروگرامنگ سیکھیں</h2>',
  'Best Urdu programming resources for Pakistani students.',
  'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800',
  (SELECT id FROM categories WHERE slug = 'education' LIMIT 1),
  (SELECT id FROM profiles LIMIT 1),
  'Learn Programming in Urdu - Free Resources',
  'Urdu programming roadmap for Pakistan.',
  ARRAY['Urdu','Programming','Education','Pakistan'],
  'published'
);

-- ================================================
-- VERIFY
-- ================================================
SELECT title, slug FROM public.posts ORDER BY created_at DESC;
