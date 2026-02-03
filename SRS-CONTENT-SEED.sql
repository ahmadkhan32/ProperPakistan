-- ================================================
-- 🚀 SRS SAMPLE CONTENT SEED FILE
-- Inserts 12 Posts (3 per category) as defined in the SRS
-- ================================================

-- 1. Get Category IDs (Dynamic lookup to ensure correct IDs)
DO $$
DECLARE
  tech_id UUID;
  edu_id UUID;
  free_id UUID;
  abroad_id UUID;
  admin_id UUID;
BEGIN
  -- Get Category IDs
  SELECT id INTO tech_id FROM public.categories WHERE slug = 'technology';
  SELECT id INTO edu_id FROM public.categories WHERE slug = 'education';
  SELECT id INTO free_id FROM public.categories WHERE slug = 'freelancing';
  SELECT id INTO abroad_id FROM public.categories WHERE slug = 'study-abroad';

  -- Get an Admin User ID (using the first admin found, or the first user if no admin)
  SELECT id INTO admin_id FROM public.profiles WHERE role = 'admin' LIMIT 1;
  
  -- Fallback if no admin exists (get any user)
  IF admin_id IS NULL THEN
    SELECT id INTO admin_id FROM public.profiles LIMIT 1;
  END IF;

  -- If still null, we can't insert posts. User must sign up first!
  IF admin_id IS NULL THEN
    RAISE NOTICE '❌ No users found! Please sign up a user first before seeding posts.';
    RETURN;
  END IF;

  -- ================================================
  -- 📁 TECHNOLOGY
  -- ================================================
  
  -- Post 1
  INSERT INTO public.posts (title, slug, content, excerpt, category_id, author_id, image, status, featured)
  VALUES (
    'React Roadmap for Pakistani Developers',
    'react-roadmap-pakistani-developers',
    'React is the most demanded frontend library in Pakistan. To start React you must first learn JavaScript basics such as variables, functions, arrays and ES6 concepts.

After that learn:
- Components
- Props
- Hooks
- State management

Pakistani companies mostly ask about:
- React hooks
- API integration
- Tailwind CSS

If you build 3 projects like portfolio, e-commerce and blog you can easily get internship or remote job.',
    'Complete guide to learning React.js in the Pakistani market context.',
    tech_id,
    admin_id,
    'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&q=80',
    'published',
    true
  ) ON CONFLICT (slug) DO NOTHING;

  -- Post 2
  INSERT INTO public.posts (title, slug, content, excerpt, category_id, author_id, image, status, featured)
  VALUES (
    'MERN Stack Guide for Beginners',
    'mern-stack-guide-beginners',
    'MERN means:
- MongoDB
- Express
- React
- Node

Flow:
Frontend → API → Database

In Pakistan many software houses use MERN for startups.
You should learn:
1. Node API
2. MongoDB schema
3. React UI

Make a project like blog or expense app to become job ready.',
    'Understanding the full stack development flow with MERN.',
    tech_id,
    admin_id,
    'https://images.unsplash.com/photo-1629904853716-6c29f61b432a?w=800&q=80',
    'published',
    false
  ) ON CONFLICT (slug) DO NOTHING;

  -- Post 3
  INSERT INTO public.posts (title, slug, content, excerpt, category_id, author_id, image, status, featured)
  VALUES (
    'Best VS Code Extensions',
    'best-vs-code-extensions',
    'Important extensions:
- Prettier
- ES7 snippets
- Tailwind IntelliSense
- GitLens

These tools increase developer productivity and help Pakistani students code faster.',
    'Boost your productivity with these essential VS Code tools.',
    tech_id,
    admin_id,
    'https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=800&q=80',
    'published',
    false
  ) ON CONFLICT (slug) DO NOTHING;

  -- ================================================
  -- 📁 EDUCATION
  -- ================================================

  -- Post 1
  INSERT INTO public.posts (title, slug, content, excerpt, category_id, author_id, image, status, featured)
  VALUES (
    'How to Start Programming',
    'how-to-start-programming',
    'Many Pakistani students are confused after FSC.
Best path:
1. Learn HTML/CSS
2. JavaScript
3. One framework

Don’t directly jump to AI. First build logic and problem solving.',
    'A clear path for students starting their programming journey.',
    edu_id,
    admin_id,
    'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80',
    'published',
    true
  ) ON CONFLICT (slug) DO NOTHING;

  -- Post 2
  INSERT INTO public.posts (title, slug, content, excerpt, category_id, author_id, image, status, featured)
  VALUES (
    'Free Courses in Pakistan',
    'free-courses-in-pakistan',
    'Government platforms:
- DigiSkills
- NAVTTC
- eRozgaar

International:
- Coursera aid
- edX

Students can learn without paying any fee.',
    'Top resources for free high-quality education in Pakistan.',
    edu_id,
    admin_id,
    'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&q=80',
    'published',
    false
  ) ON CONFLICT (slug) DO NOTHING;

  -- Post 3
  INSERT INTO public.posts (title, slug, content, excerpt, category_id, author_id, image, status, featured)
  VALUES (
    'BSCS vs BSIT',
    'bscs-vs-bsit',
    'BSCS is more theory and programming.
BSIT is more practical and networking.

In Pakistani market both are acceptable but skills matter more than degree.',
    'Comparing Computer Science and Information Technology degrees.',
    edu_id,
    admin_id,
    'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&q=80',
    'published',
    false
  ) ON CONFLICT (slug) DO NOTHING;

  -- ================================================
  -- 📁 FREELANCING
  -- ================================================

  -- Post 1
  INSERT INTO public.posts (title, slug, content, excerpt, category_id, author_id, image, status, featured)
  VALUES (
    'How to Get First Order on Fiverr',
    'how-to-get-first-order-fiverr',
    'To get first order:
- Use low competition keywords
- Make 3 gigs
- Send buyer requests
- Stay online

Pakistani sellers should target:
- WordPress
- React fixes
- Logo design',
    'Proven strategies for new freelancers to get started.',
    free_id,
    admin_id,
    'https://images.unsplash.com/photo-1579389083078-4e7018379f7e?w=800&q=80',
    'published',
    true
  ) ON CONFLICT (slug) DO NOTHING;

  -- Post 2
  INSERT INTO public.posts (title, slug, content, excerpt, category_id, author_id, image, status, featured)
  VALUES (
    'Low Competition Fiverr Niches',
    'low-competition-fiverr-niches',
    'Good niches:
- Bug fixing
- Landing page
- CV design
- Data entry

Avoid web development full projects at start.',
    'Smart niches to target for quicker freelance success.',
    free_id,
    admin_id,
    'https://images.unsplash.com/photo-1607970669930-d6ea0e7843d7?w=800&q=80',
    'published',
    false
  ) ON CONFLICT (slug) DO NOTHING;

  -- Post 3
  INSERT INTO public.posts (title, slug, content, excerpt, category_id, author_id, image, status, featured)
  VALUES (
    'Upwork Proposal Template',
    'upwork-proposal-template',
    'Start with client problem:

“Hi, I read your requirement about React bug. I already fixed similar issue…”

Attach portfolio and keep short.',
    'How to write winning proposals on Upwork.',
    free_id,
    admin_id,
    'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800&q=80',
    'published',
    false
  ) ON CONFLICT (slug) DO NOTHING;

  -- ================================================
  -- 📁 STUDY ABROAD
  -- ================================================

  -- Post 1
  INSERT INTO public.posts (title, slug, content, excerpt, category_id, author_id, image, status, featured)
  VALUES (
    'Malaysia Scholarship 2.7 CGPA',
    'malaysia-scholarship-low-cgpa',
    'Many universities in Malaysia accept low CGPA like:
- UniKL
- UPM
- UTM (some programs)

Documents:
- Transcript
- Passport
- Statement

Pakistani students can apply online.',
    'Opportunities for students with lower CGPA to study in Malaysia.',
    abroad_id,
    admin_id,
    'https://images.unsplash.com/photo-1596622723231-b20320c73769?w=800&q=80',
    'published',
    true
  ) ON CONFLICT (slug) DO NOTHING;

  -- Post 2
  INSERT INTO public.posts (title, slug, content, excerpt, category_id, author_id, image, status, featured)
  VALUES (
    'Visa Process Malaysia',
    'visa-process-malaysia',
    'Steps:
1. Admission letter
2. VAL
3. Medical
4. Sticker visa

Total time 4–6 weeks from Pakistan.',
    'Step-by-step guide to the Malaysian student visa process.',
    abroad_id,
    admin_id,
    'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&q=80',
    'published',
    false
  ) ON CONFLICT (slug) DO NOTHING;

  -- Post 3
  INSERT INTO public.posts (title, slug, content, excerpt, category_id, author_id, image, status, featured)
  VALUES (
    'Cheap Universities Kuala Lumpur',
    'cheap-universities-kuala-lumpur',
    'Affordable options:
- UniKL
- Segi
- Help University

Monthly expense around 1200 RM.',
    'Budget-friendly university options in KL for international students.',
    abroad_id,
    admin_id,
    'https://images.unsplash.com/photo-1565225091771-469a53100652?w=800&q=80',
    'published',
    false
  ) ON CONFLICT (slug) DO NOTHING;

END $$;

-- Verify Insertion
SELECT title, slug FROM public.posts;
