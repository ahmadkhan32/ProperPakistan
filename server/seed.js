import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Category from './models/Category.js';
import Post from './models/Post.js';
import User from './models/User.js';

dotenv.config();

const categories = [
    {
        name: 'Technology',
        slug: 'technology',
        icon: '💻',
        color: '#3b82f6',
        description: 'Latest tech news, tutorials, and tips for Pakistani developers'
    },
    {
        name: 'Education',
        slug: 'education',
        icon: '📚',
        color: '#10b981',
        description: 'Educational resources, courses, and learning paths'
    },
    {
        name: 'Freelancing',
        slug: 'freelancing',
        icon: '💼',
        color: '#f59e0b',
        description: 'Freelancing tips, gigs, and success stories from Pakistan'
    },
    {
        name: 'Study Abroad',
        slug: 'study-abroad',
        icon: '✈️',
        color: '#8b5cf6',
        description: 'Scholarships, visa guides, and study abroad opportunities'
    }
];

const samplePosts = [
    // Technology Posts
    {
        title: 'React Roadmap for Pakistani Developers',
        slug: 'react-roadmap-pakistani-developers',
        content: `<h2>Complete React Learning Path for Pakistani Developers</h2>
    
    <p>React has become the most in-demand frontend framework in Pakistan's tech industry. Whether you're aiming for a job at a local company or want to work with international clients, mastering React is essential.</p>
    
    <h3>Why React?</h3>
    <p>React is used by top companies like Facebook, Netflix, and Airbnb. In Pakistan, companies like Careem, Daraz, and numerous startups are actively hiring React developers.</p>
    
    <h3>Learning Path</h3>
    <ol>
      <li><strong>JavaScript Fundamentals:</strong> ES6+, async/await, promises</li>
      <li><strong>React Basics:</strong> Components, props, state</li>
      <li><strong>Hooks:</strong> useState, useEffect, useContext, custom hooks</li>
      <li><strong>State Management:</strong> Redux, Context API</li>
      <li><strong>Routing:</strong> React Router v6</li>
      <li><strong>API Integration:</strong> Axios, Fetch</li>
    </ol>
    
    <h3>Project Ideas</h3>
    <ul>
      <li>E-commerce website (like Daraz clone)</li>
      <li>Blog platform</li>
      <li>Task management app</li>
      <li>Weather app with API</li>
    </ul>
    
    <p>Start building projects from day one. Pakistani employers value practical experience over certificates!</p>`,
        excerpt: 'Complete roadmap to learn React.js with hooks, state management, and real-world projects. Perfect for Pakistani developers looking to get hired.',
        category: 'technology',
        image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800',
        seoTitle: 'React Roadmap 2026 - Complete Guide for Pakistani Developers',
        seoDescription: 'Learn React.js step by step with this comprehensive roadmap. Includes hooks, projects, and job tips for Pakistani developers.',
        tags: ['react', 'javascript', 'frontend', 'pakistan', 'tutorial'],
        status: 'published',
        featured: true
    },
    {
        title: 'MERN Stack Interview Questions',
        slug: 'mern-stack-interview-questions',
        content: `<h2>50+ MERN Stack Interview Questions with Answers</h2>
    
    <p>Preparing for a MERN stack interview in Pakistan? This comprehensive guide covers everything from basics to advanced concepts.</p>
    
    <h3>MongoDB Questions</h3>
    <ol>
      <li><strong>What is MongoDB?</strong> - NoSQL database using JSON-like documents</li>
      <li><strong>Difference between SQL and NoSQL?</strong> - Schema flexibility, scaling</li>
      <li><strong>What are indexes?</strong> - Speed up queries</li>
    </ol>
    
    <h3>Express.js Questions</h3>
    <ol>
      <li><strong>What is middleware?</strong> - Functions that execute during request-response cycle</li>
      <li><strong>How to handle errors?</strong> - Error-handling middleware</li>
    </ol>
    
    <h3>React Questions</h3>
    <ol>
      <li><strong>Virtual DOM?</strong> - In-memory representation of real DOM</li>
      <li><strong>Hooks vs Class Components?</strong> - Hooks are cleaner, more modern</li>
    </ol>
    
    <h3>Node.js Questions</h3>
    <ol>
      <li><strong>Event Loop?</strong> - Non-blocking I/O operations</li>
      <li><strong>NPM vs Yarn?</strong> - Package managers</li>
    </ol>
    
    <p>Practice these questions and build a portfolio project to stand out!</p>`,
        excerpt: '50+ essential MERN stack interview questions with detailed answers. Perfect preparation for Node.js, MongoDB, Express, and React interviews.',
        category: 'technology',
        image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800',
        seoTitle: 'MERN Stack Interview Questions 2026 - Complete Guide',
        seoDescription: '50+ MERN stack interview questions covering MongoDB, Express, React, and Node.js. Ace your next tech interview!',
        tags: ['mern', 'interview', 'mongodb', 'react', 'nodejs'],
        status: 'published',
        featured: false
    },
    {
        title: 'Best VS Code Extensions 2026',
        slug: 'best-vscode-extensions-2026',
        content: `<h2>Top VS Code Extensions for Pakistani Developers</h2>
    
    <p>Boost your productivity with these must-have Visual Studio Code extensions!</p>
    
    <h3>Essential Extensions</h3>
    
    <h4>1. Prettier - Code Formatter</h4>
    <p>Automatically format your code. No more debates about spaces vs tabs!</p>
    
    <h4>2. ESLint</h4>
    <p>Find and fix JavaScript errors before runtime. Essential for React projects.</p>
    
    <h4>3. Live Server</h4>
    <p>Launch a local development server with live reload. Perfect for HTML/CSS/JS projects.</p>
    
    <h4>4. GitLens</h4>
    <p>Supercharge Git inside VS Code. See who changed what and when.</p>
    
    <h4>5. Auto Rename Tag</h4>
    <p>Automatically rename paired HTML/JSX tags. Huge time saver!</p>
    
    <h4>6. Tailwind CSS IntelliSense</h4>
    <p>Autocomplete for Tailwind classes. Must-have for modern web development.</p>
    
    <h4>7. Thunder Client</h4>
    <p>Test APIs directly in VS Code. Alternative to Postman.</p>
    
    <p>Install these extensions and watch your productivity skyrocket!</p>`,
        excerpt: 'Discover the best VS Code extensions for 2026. Boost your productivity with these essential tools for web development.',
        category: 'technology',
        image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800',
        seoTitle: 'Best VS Code Extensions 2026 - Developer Productivity Tools',
        seoDescription: 'Top VS Code extensions for web developers including Prettier, ESLint, GitLens, and more. Increase your coding productivity!',
        tags: ['vscode', 'extensions', 'productivity', 'tools'],
        status: 'published',
        featured: false
    },

    // Education Posts
    {
        title: 'How to Learn Programming in Urdu',
        slug: 'learn-programming-urdu',
        content: `<h2>اردو میں پروگرامنگ سیکھنے کا مکمل گائیڈ</h2>
    
    <p>Programming seekhna chahte hain lekin English mein mushkil ho rahi hai? Yeh guide aapke liye hai!</p>
    
    <h3>Best Urdu Resources</h3>
    
    <h4>1. YouTube Channels</h4>
    <ul>
      <li><strong>Codanics:</strong> Python, Data Science in Urdu</li>
      <li><strong>Yahoo Baba:</strong> Web development complete course</li>
      <li><strong>The Baig Web:</strong> HTML, CSS, JavaScript tutorials</li>
    </ul>
    
    <h4>2. Learning Path</h4>
    <ol>
      <li>Start with HTML/CSS - Website ki buniyad</li>
      <li>JavaScript seekhein - Interactivity ke liye</li>
      <li>Backend language (Python ya Node.js)</li>
      <li>Database (MongoDB ya MySQL)</li>
    </ol>
    
    <h4>3. Practice Projects</h4>
    <p>Har din kam se kam 2 ghante practice karein:</p>
    <ul>
      <li>Simple calculator</li>
      <li>Todo list app</li>
      <li>Portfolio website</li>
    </ul>
    
    <h3>Job Market in Pakistan</h3>
    <p>Programming seekh kar aap Rs. 50,000 - 150,000 per month kama sakte hain. Remote jobs bhi available hain!</p>`,
        excerpt: 'اردو میں پروگرامنگ سیکھیں۔ Complete guide with Urdu resources, YouTube channels, and step-by-step learning path for Pakistani students.',
        category: 'education',
        image: 'https://images.unsplash.com/photo-1516397281156-ca07cf9746fc?w=800',
        seoTitle: 'Programming in Urdu - اردو میں پروگرامنگ سیکھیں',
        seoDescription: 'Learn programming in Urdu language. Best Urdu resources, YouTube channels, and complete roadmap for Pakistani students.',
        tags: ['urdu', 'programming', 'education', 'pakistan', 'tutorial'],
        status: 'published',
        featured: true
    },
    {
        title: 'Free IT Courses for Pakistani Students',
        slug: 'free-it-courses-pakistan',
        content: `<h2>Free IT Courses Available in Pakistan</h2>
    
    <p>Want to learn IT skills but can't afford expensive courses? Here are completely FREE options!</p>
    
    <h3>Government Initiatives</h3>
    
    <h4>1. DigiSkills Pakistan</h4>
    <p>Government of Pakistan's official platform offering free courses in:</p>
    <ul>
      <li>Freelancing</li>
      <li>WordPress</li>
      <li>Digital Marketing</li>
      <li>Graphic Design</li>
      <li>Video Editing</li>
    </ul>
    <p>Certificate is also free!</p>
    
    <h4>2. NAVTTC Programs</h4>
    <p>Free technical training in major cities. Courses include:</p>
    <ul>
      <li>Web Development</li>
      <li>Mobile App Development</li>
      <li>Cloud Computing</li>
    </ul>
    
    <h3>International Free Resources</h3>
    
    <h4>freeCodeCamp</h4>
    <p>Complete web development curriculum - absolutely free!</p>
    
    <h4>Coursera</h4>
    <p>Apply for financial aid - most courses are free for Pakistani students.</p>
    
    <h4>edX</h4>
    <p>Audit courses for free from Harvard, MIT.</p>
    
    <h3>How to Apply</h3>
    <p>Visit DigiSkills.pk, register with your CNIC, and start learning today!</p>`,
        excerpt: 'Discover free IT courses available for Pakistani students. DigiSkills, NAVTTC, and international platforms offering free certifications.',
        category: 'education',
        image: 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=800',
        seoTitle: 'Free IT Courses in Pakistan 2026 - Complete Guide',
        seoDescription: 'Free IT courses for Pakistani students including DigiSkills, NAVTTC, freeCodeCamp, and Coursera financial aid options.',
        tags: ['free', 'courses', 'pakistan', 'education', 'it'],
        status: 'published',
        featured: false
    },
    {
        title: 'BSCS vs BSIT – Which is Better?',
        slug: 'bscs-vs-bsit-comparison',
        content: `<h2>BSCS vs BSIT: Complete Comparison for Pakistani Students</h2>
    
    <p>Confused between Computer Science and Information Technology? This guide will help!</p>
    
    <h3>BSCS (Computer Science)</h3>
    
    <h4>Focus Areas:</h4>
    <ul>
      <li>Algorithms and Data Structures</li>
      <li>Artificial Intelligence</li>
      <li>Theory of Computation</li>
      <li>Software Engineering</li>
      <li>More Mathematics oriented</li>
    </ul>
    
    <h4>Best For:</h4>
    <p>Students who want to become software engineers, work on complex algorithms, research, or pursue MS/PhD.</p>
    
    <h3>BSIT (Information Technology)</h3>
    
    <h4>Focus Areas:</h4>
    <ul>
      <li>Networking</li>
      <li>Database Management</li>
      <li>Web Development</li>
      <li>System Administration</li>
      <li>More practical oriented</li>
    </ul>
    
    <h4>Best For:</h4>
    <p>Students who want hands-on skills, quick job entry, or freelancing career.</p>
    
    <h3>Job Market in Pakistan</h3>
    
    <table>
      <tr>
        <th>Aspect</th>
        <th>BSCS</th>
        <th>BSIT</th>
      </tr>
      <tr>
        <td>Starting Salary</td>
        <td>Rs 40k-60k</td>
        <td>Rs 35k-50k</td>
      </tr>
      <tr>
        <td>Growth Potential</td>
        <td>Higher (research roles)</td>
        <td>Good (technical roles)</td>
      </tr>
      <tr>
        <td>Difficulty</td>
        <td>More challenging</td>
        <td>Moderate</td>
      </tr>
    </table>
    
    <h3>My Recommendation</h3>
    <p>Choose BSCS if you love problem-solving and theory. Choose BSIT if you want practical skills and faster job entry. Both are excellent choices!</p>`,
        excerpt: 'Complete comparison of BSCS vs BSIT degrees in Pakistan. Career prospects, salary, difficulty level, and which one to choose for your future.',
        category: 'education',
        image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800',
        seoTitle: 'BSCS vs BSIT Comparison 2026 - Which Degree is Better in Pakistan?',
        seoDescription: 'Detailed comparison of BSCS and BSIT degrees in Pakistan. Career prospects, salary expectations, and expert recommendations.',
        tags: ['bscs', 'bsit', 'degree', 'pakistan', 'career'],
        status: 'published',
        featured: false
    },

    // Freelancing Posts
    {
        title: 'How to Get First Order on Fiverr',
        slug: 'first-order-fiverr-pakistan',
        content: `<h2>Get Your First Fiverr Order in 7 Days - Pakistani Guide</h2>
    
    <p>Getting your first order on Fiverr is challenging but not impossible. Follow this proven strategy!</p>
    
    <h3>Step 1: Choose the Right Gig</h3>
    
    <h4>High-Demand Skills in Pakistan:</h4>
    <ul>
      <li>WordPress Website Development</li>
      <li>Logo Design</li>
      <li>Data Entry</li>
      <li>Content Writing</li>
      <li>SEO</li>
    </ul>
    
    <h3>Step 2: Create a Professional Profile</h3>
    <ol>
      <li>Professional photo (not selfie!)</li>
      <li>Write clear description in English</li>
      <li>Add relevant skills</li>
      <li>Get certifications from Fiverr Learn</li>
    </ol>
    
    <h3>Step 3: Optimize Your Gig</h3>
    
    <h4>Gig Title Formula:</h4>
    <p>"I will [specific service] professionally in [time frame]"</p>
    <p>Example: "I will design a modern WordPress website in 3 days"</p>
    
    <h4>Pricing Strategy:</h4>
    <ul>
      <li>Basic: Rs. 1,500 ($5)</li>
      <li>Standard: Rs. 3,000 ($10)</li>
      <li>Premium: Rs. 6,000 ($20)</li>
    </ul>
    
    <h3>Step 4: Get First Reviews</h3>
    <ul>
      <li>Offer friends/family discount</li>
      <li>Join Facebook groups for first clients</li>
      <li>Always deliver more than promised</li>
    </ul>
    
    <h3>Pro Tips for Pakistanis</h3>
    <ul>
      <li>Use JazzCash/Easypaisa for Fiverr withdrawal</li>
      <li>Best working hours: 6 PM - 12 AM (when US clients are active)</li>
      <li>Response time matters - reply within 1 hour</li>
    </ul>`,
        excerpt: 'Complete guide to get your first Fiverr order from Pakistan. Proven strategies, gig optimization, pricing tips, and success secrets.',
        category: 'freelancing',
        image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800',
        seoTitle: 'How to Get First Fiverr Order in Pakistan - Complete Guide 2026',
        seoDescription: 'Step-by-step guide to get your first Fiverr order from Pakistan. Gig optimization, pricing strategy, and proven tips to start earning!',
        tags: ['fiverr', 'freelancing', 'pakistan', 'first-order', 'guide'],
        status: 'published',
        featured: true
    },
    {
        title: 'Low Competition Fiverr Gigs',
        slug: 'low-competition-fiverr-gigs',
        content: `<h2>10 Low Competition Fiverr Gigs for 2026</h2>
    
    <p>Tired of competing with thousands of sellers? Try these underserved niches!</p>
    
    <h3>1. Notion Template Design</h3>
    <p>Growing demand, few Pakistani sellers. Charge $10-50 per template.</p>
    
    <h3>2. Discord Server Setup</h3>
    <p>Gaming communities need custom Discord servers. Easy to learn, good pay.</p>
    
    <h3>3. LinkedIn Profile Optimization</h3>
    <p>Professionals in Pakistan need LinkedIn help. Charge Rs. 3,000-5,000.</p>
    
    <h3>4. Email Signature Design</h3>
    <p>Simple HTML skill, quick delivery, repeat clients.</p>
    
    <h3>5. Canva Template Creation</h3>
    <p>Make social media templates for businesses. No Photoshop needed!</p>
    
    <h3>6. Podcast Editing</h3>
    <p>Use free tool like Audacity. Charge $20-50 per episode.</p>
    
    <h3>7. Pinterest Pin Design</h3>
    <p>Businesses need Pinterest marketing. Design pins in Canva.</p>
    
    <h3>8. Resume Writing (ATS Optimized)</h3>
    <p>Help job seekers in Pakistan. Charge Rs. 2,000-4,000.</p>
    
    <h3>9. Instagram Reel Editing</h3>
    <p>Use mobile apps like CapCut. Quick turnaround.</p>
    
    <h3>10. Google My Business Optimization</h3>
    <p>Local businesses need this. Simple service, recurring income.</p>
    
    <h3>How to Start</h3>
    <ul>
      <li>Learn one skill from YouTube (1 week)</li>
      <li>Create sample work for portfolio</li>
      <li>Launch gig with competitive price</li>
      <li>Get first 5 reviews</li>
      <li>Increase prices gradually</li>
    </ul>`,
        excerpt: '10 low competition Fiverr gigs for 2026. Find your profitable niche with less competition and start earning faster on Fiverr!',
        category: 'freelancing',
        image: 'https://images.unsplash.com/photo-1487017931947-9c8784546640?w=800',
        seoTitle: 'Low Competition Fiverr Gigs 2026 - Profitable Niches',
        seoDescription: 'Discover 10 low competition Fiverr gigs for 2026. Easy to learn skills with high demand and less competition from Pakistan.',
        tags: ['fiverr', 'gigs', 'low-competition', 'niches', 'freelancing'],
        status: 'published',
        featured: false
    },
    {
        title: 'Upwork Proposal Template Pakistan',
        slug: 'upwork-proposal-template-pakistan',
        content: `<h2>Winning Upwork Proposal Template for Pakistani Freelancers</h2>
    
    <p>Stop sending generic proposals! Use this proven template that gets responses.</p>
    
    <h3>The Winning Formula</h3>
    
    <h4>1. Personalized Greeting (30 seconds to write)</h4>
    <pre>
Hi [Client's Name],

I read your [project type] project and noticed you need [specific requirement they mentioned].
    </pre>
    
    <h4>2. Show You Understand (1-2 lines)</h4>
    <pre>
I understand you're looking for [restate their need in different words]. 
This is important because [show you understand their business/goal].
    </pre>
    
    <h4>3. Your Solution (2-3 lines)</h4>
    <pre>
I can deliver this by:
- [Specific action 1]
- [Specific action 2]
- [Specific action 3]
    </pre>
    
    <h4>4. Proof/Portfolio (1-2 lines)</h4>
    <pre>
I've completed similar projects for [number] clients. You can see my work here: [portfolio link]
    </pre>
    
    <h4>5. Call to Action</h4>
    <pre>
I'm available to start immediately. Can we schedule a quick call to discuss your requirements?

Best regards,
[Your Name]
    </pre>
    
    <h3>Example for Web Development Job</h3>
    
    <pre>
Hi Sarah,

I read your WordPress website project and noticed you need a custom booking system with payment integration.

I understand you're looking for a professional real estate website that allows property listings and appointment scheduling. This is important because it will help you generate more leads on autopilot.

I can deliver this by:
- Building a custom WordPress theme matching your brand
- Integrating WooCommerce for payments
- Adding booking plugin for appointments
- Making it mobile-responsive and SEO-friendly

I've completed 15+ WordPress projects for clients in the US and UK. You can see my recent real estate website here: [link]

I'm available to start immediately. Can we schedule a quick call to discuss your requirements?

Best regards,
Ahmed Khan
    </pre>
    
    <h3>Pakistani-Specific Tips</h3>
    <ul>
      <li>Mention timezone: "I'm available in your business hours (EST/PST)"</li>
      <li>Offer value: "I can include free 1-month maintenance"</li>
      <li>Be professional: No "kindly", "do the needful"</li>
      <li>Keep it under 200 words</li>
    </ul>
    
    <h3>Common Mistakes to Avoid</h3>
    <ul>
      <li>❌ Copy-pasting same proposal</li>
      <li>❌ Talking too much about yourself</li>
      <li>❌ Quoting very low rates (devalues Pakistani talent)</li>
      <li>❌ Poor grammar (use Grammarly)</li>
    </ul>`,
        excerpt: 'Winning Upwork proposal template for Pakistani freelancers. Get more interviews with this proven formula that actually works!',
        category: 'freelancing',
        image: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800',
        seoTitle: 'Upwork Proposal Template Pakistan - Win More Jobs 2026',
        seoDescription: 'Copy-paste Upwork proposal template for Pakistani freelancers. Proven formula that gets responses and wins projects!',
        tags: ['upwork', 'proposals', 'freelancing', 'pakistan', 'template'],
        status: 'published',
        featured: false
    },

    // Study Abroad Posts
    {
        title: 'Malaysia Scholarship with 2.7 CGPA',
        slug: 'malaysia-scholarship-low-cgpa',
        content: `<h2>Get Malaysia Scholarship with 2.7 CGPA - Complete Guide</h2>
    
    <p>Think you can't study abroad with low CGPA? Think again! Malaysia accepts Pakistani students with 2.5+ CGPA.</p>
    
    <h3>Available Scholarships</h3>
    
    <h4>1. Malaysian Commonwealth Scholarship</h4>
    <ul>
      <li>Minimum CGPA: 2.7</li>
      <li>Coverage: Full tuition + living allowance</li>
      <li>Deadline: March every year</li>
    </ul>
    
    <h4>2. University-Specific Scholarships</h4>
    
    <p><strong>University of Malaya:</strong></p>
    <ul>
      <li>Accepts 2.5+ CGPA for Diplomas</li>
      <li>50% tuition waiver available</li>
    </ul>
    
    <p><strong>Universiti Teknologi Malaysia (UTM):</strong></p>
    <ul>
      <li>25-50% scholarship for Pakistani students</li>
      <li>CGPA requirement: 2.6+</li>
    </ul>
    
    <h3>How to Apply (Step-by-Step)</h3>
    
    <h4>Documents Required:</h4>
    <ol>
      <li>Bachelor's degree (attested by HEC)</li>
      <li>Transcripts</li>
      <li>Passport copy</li>
      <li>IELTS 5.5+ (or can take English course in Malaysia)</li>
      <li>Research proposal (for Master's)</li>
      <li>Two recommendation letters</li>
    </ol>
    
    <h4>Application Process:</h4>
    <ol>
      <li>Visit university website</li>
      <li>Create account</li>
      <li>Upload documents</li>
      <li>Pay application fee (RM 200-500 ~ Rs. 12,000-30,000)</li>
      <li>Wait for offer letter (2-4 weeks)</li>
    </ol>
    
    <h3>Cost Breakdown</h3>
    <table>
      <tr><td>Tuition (per year)</td><td>RM 8,000-15,000 (Rs. 480k-900k)</td></tr>
      <tr><td>Accommodation</td><td>RM 500-800/month (Rs. 30k-48k)</td></tr>
      <tr><td>Food</td><td>RM 500/month (Rs. 30k)</td></tr>
      <tr><td>Total annual</td><td>RM 20,000-28,000 (Rs. 1.2M-1.7M)</td></tr>
    </table>
    
    <h3>After Scholarship</h3>
    <ul>
      <li>Part-time work allowed (20 hrs/week)</li>
      <li>Earn RM 1,500-2,000/month</li>
      <li>Can recover 50% of expenses</li>
    </ul>
    
    <h3>Pakistani Students Community</h3>
    <p>Join "Pakistanis in Malaysia" Facebook group for support, accommodation, and tips!</p>`,
        excerpt: 'Complete guide to get Malaysia scholarship with 2.7 CGPA from Pakistan. Universities, application process, costs, and success tips!',
        category: 'study-abroad',
        image: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=800',
        seoTitle: 'Malaysia Scholarship for Pakistani Students with Low CGPA 2026',
        seoDescription: 'Get Malaysia scholarship with 2.7 CGPA. Complete guide including universities, application process, costs, and requirements for Pakistani students.',
        tags: ['malaysia', 'scholarship', 'study-abroad', 'pakistan', 'low-cgpa'],
        status: 'published',
        featured: true
    },
    {
        title: 'Student Visa Process from Pakistan',
        slug: 'student-visa-process-pakistan',
        content: `<h2>Student Visa Application Process from Pakistan - 2026 Guide</h2>
    
    <p>Planning to study abroad? Here's the complete student visa process for popular destinations.</p>
    
    <h3>Malaysia Student Visa (Easiest)</h3>
    
    <h4>Requirements:</h4>
    <ul>
      <li>Offer letter from Malaysian university</li>
      <li>Passport (6 months validity)</li>
      <li>Bank statement (Rs. 500,000)</li>
      <li>Medical test</li>
      <li>No IELTS required</li>
    </ul>
    
    <h4>Process:</h4>
    <ol>
      <li>University applies for EMGS (Education Malaysia Global Services)</li>
      <li>Wait 2-4 weeks for approval</li>
      <li>Get 35% approval (eVAL)</li>
      <li>Book flight</li>
      <li>Complete visa on arrival</li>
    </ol>
    
    <p><strong>Success Rate:</strong> 95%</p>
    <p><strong>Processing Time:</strong> 1-2 months</p>
    
    <h3>UK Student Visa</h3>
    
    <h4>Requirements:</h4>
    <ul>
      <li>CAS (Confirmation of Acceptance) from UK university</li>
      <li>IELTS 6.0-6.5</li>
      <li>Bank statement (£9,207 for 9 months ~ Rs. 3.3M)</li>
      <li>TB test</li>
      <li>Visa fee: £363 (Rs. 130,000)</li>
    </ul>
    
    <h4>Process:</h4>
    <ol>
      <li>Apply online at gov.uk</li>
      <li>Book biometrics appointment in Karachi/Islamabad</li>
      <li>Submit documents</li>
      <li>Wait 3 weeks for decision</li>
    </ol>
    
    <p><strong>Success Rate:</strong> 85% (if documents are correct)</p>
    
    <h3>Canada Student Visa</h3>
    
    <h4>Requirements:</h4>
    <ul>
      <li>Letter of Acceptance</li>
      <li>IELTS 6.5+</li>
      <li>Tuition fee payment proof</li>
      <li>GIC (CAD $10,000 ~ Rs. 2.4M)</li>
      <li>Medical exam</li>
      <li>Police certificate</li>
    </ul>
    
    <h4>Process:</h4>
    <ol>
      <li>Apply online or through VFS</li>
      <li>Submit biometrics</li>
      <li>Wait 4-8 weeks</li>
    </ol>
    
    <p><strong>Success Rate:</strong> 70% (improving after 2024 changes)</p>
    
    <h3>Common Rejection Reasons</h3>
    <ul>
      <li>Insufficient funds</li>
      <li>Poor academic record</li>
      <li>No proof of intent to return</li>
      <li>Fake documents</li>
    </ul>
    
    <h3>Pro Tips for Pakistani Students</h3>
    <ul>
      <li>Show family ties to Pakistan</li>
      <li>Don't show immigration intent</li>
      <li>Keep funds in account for 6+ months</li>
      <li>Be honest in interview</li>
    </ul>`,
        excerpt: 'Complete student visa application process from Pakistan for Malaysia, UK, and Canada. Requirements, timeline, costs, and success tips!',
        category: 'study-abroad',
        image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800',
        seoTitle: 'Student Visa Process from Pakistan 2026 - Complete Guide',
        seoDescription: 'Student visa application guide for Malaysian, UK, and Canadian universities from Pakistan. Requirements, process, and approval tips.',
        tags: ['visa', 'student-visa', 'pakistan', 'study-abroad', 'immigration'],
        status: 'published',
        featured: false
    },
    {
        title: 'Cheap Universities in Kuala Lumpur',
        slug: 'cheap-universities-kuala-lumpur',
        content: `<h2>Affordable Universities in Kuala Lumpur for Pakistani Students</h2>
    
    <p>Want quality education without breaking the bank? These KL universities are perfect!</p>
    
    <h3>1. UCSI University</h3>
    
    <h4>Why Choose UCSI?</h4>
    <ul>
      <li>QS Ranked (300-350)</li>
      <li>Affordable fees</li>
      <li>Strong Pakistani community</li>
    </ul>
    
    <h4>Popular Programs:</h4>
    <table>
      <tr><th>Program</th><th>Annual Fee</th></tr>
      <tr><td>Computer Science</td><td>RM 18,000 (Rs. 1.08M)</td></tr>
      <tr><td>Business Administration</td><td>RM 15,000 (Rs. 900k)</td></tr>
      <tr><td>Engineering</td><td>RM 20,000 (Rs. 1.2M)</td></tr>
    </table>
    
    <h3>2. Taylor's University</h3>
    
    <h4>Highlights:</h4>
    <ul>
      <li>Top 300 globally</li>
      <li>Near Sunway</li>
      <li>Good part-time job opportunities</li>
    </ul>
    
    <h4>Fees:</h4>
    <p>RM 22,000-28,000 per year (Rs. 1.3M-1.7M)</p>
    
    <h3>3. Asia Pacific University (APU)</h3>
    
    <h4>Best For:</h4>
    <ul>
      <li>IT students</li>
      <li>Most affordable option</li>
    </ul>
    
    <h4>Fees:</h4>
    <ul>
      <li>Diploma: RM 25,000 total (Rs. 1.5M for 2 years)</li>
      <li>Degree: RM 45,000 total (Rs. 2.7M for 3 years)</li>
    </ul>
    
    <h3>4. HELP University</h3>
    
    <h4>Good For:</h4>
    <ul>
      <li>Business & Psychology</li>
      <li>City center location</li>
    </ul>
    
    <h4>Fees:</h4>
    <p>RM 20,000-25,000 per year</p>
    
    <h3>Living Costs in KL</h3>
    
    <h4>Monthly Budget:</h4>
    <table>
      <tr><td>Accommodation (shared)</td><td>RM 500 (Rs. 30k)</td></tr>
      <tr><td>Food</td><td>RM 500 (Rs. 30k)</td></tr>
      <tr><td>Transport</td><td>RM 150 (Rs. 9k)</td></tr>
      <tr><td>Utilities</td><td>RM 150 (Rs. 9k)</td></tr>
      <tr><td><strong>Total</strong></td><td><strong>RM 1,300 (Rs. 78k)</strong></td></tr>
    </table>
    
    <h3>Part-Time Work</h3>
    <ul>
      <li>Allowed 20 hours/week</li>
      <li>Earn RM 8-12/hour</li>
      <li>Monthly: RM 1,500-2,000 (Rs. 90k-120k)</li>
    </ul>
    
    <h4>Popular Jobs:</h4>
    <ul>
      <li>Restaurant server</li>
      <li>Retail assistant</li>
      <li>Online tutor</li>
      <li>Freelancing (best option!)</li>
    </ul>
    
    <h3>How to Apply</h3>
    <ol>
      <li>Visit university website</li>
      <li>Check programs</li>
      <li>Prepare documents (HEC attested)</li>
      <li>Apply online</li>
      <li>Get offer letter in 2 weeks</li>
      <li>Apply for student visa</li>
    </ol>
    
    <h3>Pakistani Students Recommendation</h3>
    <p>Join Facebook groups:</p>
    <ul>
      <li>"Pakistani Students in Malaysia"</li>
      <li>"KL Pakistani Community"</li>
    </ul>
    <p>Get insider tips, find roommates, and second-hand items!</p>`,
        excerpt: 'Affordable universities in Kuala Lumpur for Pakistani students. Complete fee breakdown, living costs, and application guide for 2026.',
        category: 'study-abroad',
        image: 'https://images.unsplash.com/photo-1564981797816-1043664bf78d?w=800',
        seoTitle: 'Cheap Universities in Kuala Lumpur Malaysia for Pakistani Students',
        seoDescription: 'Best affordable universities in Kuala Lumpur for Pakistani students. Fees, living costs, part-time work, and complete application guide.',
        tags: ['kuala-lumpur', 'malaysia', 'universities', 'cheap', 'pakistan'],
        status: 'published',
        featured: false
    }
];

const seedDatabase = async () => {
    try {
        console.log('🌱 Starting database seeding...');

        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ MongoDB connected');

        // Clear existing data
        await Category.deleteMany({});
        await Post.deleteMany({});
        console.log('🗑️  Cleared existing data');

        // Insert categories
        const createdCategories = await Category.insertMany(categories);
        console.log(`✅ ${createdCategories.length} categories created`);

        // Create category mapping
        const categoryMap = {};
        createdCategories.forEach(cat => {
            categoryMap[cat.slug] = cat._id;
        });

        // Create a default admin user (you'll need to update the role manually)
        let adminUser = await User.findOne({ email: 'admin@properpakistan.com' });
        if (!adminUser) {
            adminUser = await User.create({
                name: 'Admin',
                email: 'admin@properpakistan.com',
                role: 'admin',
                supabaseId: 'temp-id-change-later'
            });
            console.log('✅ Admin user created');
        }

        // Insert posts with correct category IDs
        const postsToInsert = samplePosts.map(post => ({
            ...post,
            category: categoryMap[post.category],
            author: adminUser._id
        }));

        const createdPosts = await Post.insertMany(postsToInsert);
        console.log(`✅ ${createdPosts.length} posts created`);

        console.log('\n🎉 Database seeded successfully!');
        console.log('\n📊 Summary:');
        console.log(`   Categories: ${createdCategories.length}`);
        console.log(`   Posts: ${createdPosts.length}`);
        console.log(`   - Technology: 3 posts`);
        console.log(`   - Education: 3 posts`);
        console.log(`   - Freelancing: 3 posts`);
        console.log(`   - Study Abroad: 3 posts`);

        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    }
};

seedDatabase();
