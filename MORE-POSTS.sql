-- Additional Sample Posts for ProperPakistan
-- Run this in Supabase SQL Editor to add more content

INSERT INTO posts
(title, slug, content, excerpt, category_id, author_id, cover_image, status, featured, seo_title, seo_description, tags, created_at, views)
VALUES
-- Education Posts
(
  'Complete Guide to Studying Abroad from Pakistan in 2026',
  'complete-guide-studying-abroad-pakistan-2026',
  '<h2>Your Dream of Studying Abroad</h2><p>Thousands of Pakistani students study abroad every year. Top destinations include USA, UK, Canada, Australia, and Germany.</p><h3>Scholarship Opportunities</h3><p>Learn about Fulbright, Chevening, and other fully-funded scholarships available for Pakistani students.</p>',
  'Everything Pakistani students need to know about studying abroad including scholarships and visa processes.',
  (SELECT id FROM categories WHERE slug = 'education' LIMIT 1),
  (SELECT id FROM profiles WHERE role = 'admin' LIMIT 1),
  'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800',
  'published',
  true,
  'Study Abroad from Pakistan: Complete 2026 Guide',
  'Ultimate guide for Pakistani students planning to study abroad.',
  ARRAY['Study Abroad', 'Pakistan', 'Education', 'Scholarships'],
  NOW() - INTERVAL '3 days',
  2341
),
(
  'Top 10 Online Learning Platforms for Pakistani Students',
  'top-online-learning-platforms-pakistani-students',
  '<h2>Education at Your Fingertips</h2><p>Online learning has revolutionized education in Pakistan. Platforms like Coursera, edX, and Udemy offer world-class courses accessible to everyone.</p>',
  'Discover the best online learning platforms for Pakistani students.',
  (SELECT id FROM categories WHERE slug = 'education' LIMIT 1),
  (SELECT id FROM profiles WHERE role = 'admin' LIMIT 1),
  'https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=800',
  'published',
  false,
  'Best Online Learning Platforms for Pakistani Students',
  'Top e-learning platforms for Pakistani students.',
  ARRAY['Online Learning', 'Education', 'Pakistan', 'E-Learning'],
  NOW() - INTERVAL '6 days',
  1678
),

-- Freelancing Posts
(
  'How to Start Freelancing in Pakistan: Complete Beginners Guide',
  'start-freelancing-pakistan-beginners-guide',
  '<h2>Your Journey to Financial Freedom</h2><p>Pakistan is among the top freelancing nations globally. Popular skills include web development, graphic design, and content writing.</p><h3>Step 1: Choose Your Skill</h3><p>Identify what you are good at and what the market demands.</p>',
  'Step-by-step guide for beginners to start freelancing in Pakistan.',
  (SELECT id FROM categories WHERE slug = 'freelancing' LIMIT 1),
  (SELECT id FROM profiles WHERE role = 'admin' LIMIT 1),
  'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800',
  'published',
  true,
  'Start Freelancing in Pakistan: Beginners Guide 2026',
  'Learn how to start freelancing from Pakistan.',
  ARRAY['Freelancing', 'Pakistan', 'Work From Home', 'Online Jobs'],
  NOW() - INTERVAL '1 day',
  3124
),
(
  'Upwork Success Tips: Win More Clients as Pakistani Freelancer',
  'upwork-success-tips-pakistani-freelancers',
  '<h2>Mastering Upwork</h2><p>Upwork is competitive, but with the right strategy, you can stand out. Focus on profile optimization, personalized proposals, and competitive pricing.</p>',
  'Proven strategies to help Pakistani freelancers win more projects on Upwork.',
  (SELECT id FROM categories WHERE slug = 'freelancing' LIMIT 1),
  (SELECT id FROM profiles WHERE role = 'admin' LIMIT 1),
  'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=800',
  'published',
  false,
  'Upwork Tips for Pakistani Freelancers',
  'Expert tips for Pakistani freelancers to succeed on Upwork.',
  ARRAY['Upwork', 'Freelancing', 'Pakistan', 'Tips'],
  NOW() - INTERVAL '4 days',
  1923
),
(
  'Fiverr vs Upwork: Which is Better for Pakistani Freelancers?',
  'fiverr-vs-upwork-pakistani-freelancers',
  '<h2>The Ultimate Comparison</h2><p>Both platforms have helped thousands of Pakistanis earn online. Fiverr is gig-based while Upwork offers long-term projects.</p>',
  'Detailed comparison of Fiverr and Upwork for Pakistani freelancers.',
  (SELECT id FROM categories WHERE slug = 'freelancing' LIMIT 1),
  (SELECT id FROM profiles WHERE role = 'admin' LIMIT 1),
  'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800',
  'published',
  false,
  'Fiverr vs Upwork: Best Platform for Pakistani Freelancers',
  'Compare Fiverr and Upwork for Pakistani freelancers.',
  ARRAY['Fiverr', 'Upwork', 'Freelancing', 'Comparison'],
  NOW() - INTERVAL '1 week',
  2456
),

-- Study Abroad Posts
(
  'Fulbright Scholarship for Pakistani Students: Application Guide',
  'fulbright-scholarship-pakistan-application-guide',
  '<h2>Win Your Fully-Funded Masters in USA</h2><p>The Fulbright Program is the most prestigious scholarship for Pakistanis. Requirements include 16 years of education and strong academics.</p>',
  'Complete guide to applying for Fulbright Scholarship from Pakistan.',
  (SELECT id FROM categories WHERE slug = 'study-abroad' LIMIT 1),
  (SELECT id FROM profiles WHERE role = 'admin' LIMIT 1),
  'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800',
  'published',
  true,
  'Fulbright Scholarship Pakistan: Complete Guide 2026',
  'Get your Fulbright Scholarship! Complete application guide.',
  ARRAY['Fulbright', 'Scholarship', 'Pakistan', 'USA'],
  NOW() - INTERVAL '2 days',
  2789
),
(
  'Student Visa Process for Pakistan: Country-by-Country Guide',
  'student-visa-process-pakistan-country-guide',
  '<h2>Navigate the Visa Maze</h2><p>Getting a student visa can be stressful. This guide covers USA F-1, UK Tier 4, and Canada Study Permit processes.</p>',
  'Comprehensive guide to student visa processes for Pakistani students.',
  (SELECT id FROM categories WHERE slug = 'study-abroad' LIMIT 1),
  (SELECT id FROM profiles WHERE role = 'admin' LIMIT 1),
  'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800',
  'published',
  false,
  'Student Visa Guide for Pakistan: USA, UK, Canada',
  'Master the student visa process from Pakistan.',
  ARRAY['Student Visa', 'Pakistan', 'Study Abroad', 'Immigration'],
  NOW() - INTERVAL '5 days',
  1934
),

-- More Technology Posts
(
  'Blockchain Technology: Understanding Basics for Beginners',
  'blockchain-technology-beginners-guide',
  '<h2>What is Blockchain?</h2><p>Blockchain is a revolutionary technology that powers cryptocurrencies and much more. It is a distributed ledger used in supply chain, healthcare, and voting systems.</p>',
  'Beginner-friendly introduction to blockchain technology.',
  (SELECT id FROM categories WHERE slug = 'technology' LIMIT 1),
  (SELECT id FROM profiles WHERE role = 'admin' LIMIT 1),
  'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800',
  'published',
  false,
  'Blockchain for Beginners: Complete Guide 2026',
  'Learn blockchain technology from scratch.',
  ARRAY['Blockchain', 'Cryptocurrency', 'Technology'],
  NOW() - INTERVAL '1 week',
  1456
),
(
  'Digital Marketing Trends in Pakistan 2026',
  'digital-marketing-trends-pakistan-2026',
  '<h2>Stay Ahead of the Curve</h2><p>Pakistan digital marketing landscape is evolving rapidly. TikTok and Instagram Reels dominate social media marketing.</p>',
  'Latest digital marketing trends shaping Pakistan online business.',
  (SELECT id FROM categories WHERE slug = 'technology' LIMIT 1),
  (SELECT id FROM profiles WHERE role = 'admin' LIMIT 1),
  'https://images.unsplash.com/photo-1432888622747-4eb9a8f2c6b4?w=800',
  'published',
  false,
  'Digital Marketing Trends Pakistan 2026',
  'Latest digital marketing trends in Pakistan.',
  ARRAY['Digital Marketing', 'Pakistan', 'Trends', 'Social Media'],
  NOW() - INTERVAL '3 days',
  1398
),
(
  'IELTS Preparation Guide for Pakistani Students: Score 7+ Band',
  'ielts-preparation-guide-pakistani-students',
  '<h2>Ace Your IELTS Exam</h2><p>IELTS is mandatory for studying abroad. This guide covers Listening, Reading, Writing, and Speaking sections with a 3-month study plan.</p>',
  'Complete IELTS preparation guide for Pakistani students.',
  (SELECT id FROM categories WHERE slug = 'education' LIMIT 1),
  (SELECT id FROM profiles WHERE role = 'admin' LIMIT 1),
  'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800',
  'published',
  false,
  'IELTS Guide for Pakistani Students: Score 7+ Band',
  'IELTS preparation guide for Pakistani students.',
  ARRAY['IELTS', 'Pakistan', 'Study Abroad', 'English Test'],
  NOW() - INTERVAL '6 days',
  1845
)
ON CONFLICT (slug) DO NOTHING;

-- Randomize views for older posts
UPDATE posts SET views = FLOOR(RANDOM() * 3000 + 500) WHERE created_at < NOW() - INTERVAL '3 days';

SELECT 'Added 10 more sample posts! Total posts now available.' as message;
