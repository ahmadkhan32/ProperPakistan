# 🇵🇰 ProperPakistan.com - MERN + Supabase Blog Platform

A production-ready, SEO-optimized blog platform built specifically for Pakistan using the MERN stack with Supabase integration for authentication, real-time comments, and cloud storage.

## ✨ Features

### 🎯 Core Features
- **SEO Optimized**: Meta tags, Open Graph, Schema markup, and slug-based URLs
- **Real-time Comments**: Live commenting system using Supabase Realtime
- **Social Authentication**: Email/Password and Google OAuth via Supabase
- **Like System**: Real-time post likes with Supabase
- **Bookmark System**: Save posts for later reading
- **Category Filtering**: Browse posts by category
- **Featured Posts**: Highlight important content
- **Rich Text Editor**: React Quill for beautiful content creation
- **Image Upload**: Supabase Storage integration
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Admin Dashboard**: Complete CMS for post management

### 🎨 Design
- Pakistan-themed color palette (green & white)
- Premium gradients and animations
- Card-based layouts with hover effects
- Dark mode ready components
- Urdu font support (Noto Nastaliq Urdu)

## 🛠️ Tech Stack

### Frontend
- **React** 18 with Vite
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Axios** for API calls
- **React Helmet** for SEO
- **React Quill** for rich text editing
- **Lucide React** for icons

### Backend
- **Node.js** with Express
- **MongoDB** with Mongoose
- **JWT** for authentication
- **Supabase** for:
  - Authentication (Email + Google OAuth)
  - Real-time comments
  - Likes system
  - Cloud storage

## 📁 Project Structure

```
proper-pakistan/
├── client/                  # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── context/        # React Context (Auth)
│   │   ├── services/       # API & Supabase services
│   │   ├── App.jsx         # Main app with routing
│   │   └── index.css       # Global styles
│   ├── .env.example        # Environment template
│   └── package.json
│
└── server/                 # Node.js backend
    ├── config/            # DB configuration
    ├── models/            # Mongoose models
    ├── controllers/       # Business logic
    ├── routes/            # API routes
    ├── middleware/        # Auth middleware
    ├── server.js          # Entry point
    ├── .env.example       # Environment template
    └── package.json
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- Supabase account (free tier works)

### 1. Clone & Install

```bash
cd "c:\Users\asadk\Downloads\Proper Pakistan"
```

### 2. Backend Setup

```bash
cd server
npm install

# Copy environment file
copy .env.example .env

# Edit .env with your credentials:
# - MongoDB connection string
# - JWT secret
# - Supabase credentials
```

**Backend Environment Variables:**
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
FRONTEND_URL=http://localhost:5173
```

### 3. Frontend Setup

```bash
cd ../client
# Dependencies already installed

# Copy environment file
copy .env.example .env

# Edit .env with your credentials
```

**Frontend Environment Variables:**
```env
VITE_API_URL=http://localhost:5000/api
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Supabase Setup

1. Create a new project at [supabase.com](https://supabase.com)
2. Get your project URL and anon key from Settings > API
3. **Enable Google OAuth:**
   - Go to Authentication > Providers
   - Enable Google provider
   - Add your Google client ID and secret

4. **Create Tables:**

```sql
-- Comments table
CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id VARCHAR(255) NOT NULL,
  user_id UUID REFERENCES auth.users(id),
  text TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Likes table
CREATE TABLE likes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id VARCHAR(255) NOT NULL,
  user_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(post_id, user_id)
);
```

5. **Create Storage Bucket:**
   - Go to Storage
   - Create bucket named `blog-images`
   - Make it public

6. **Set up RLS Policies:**
```sql
-- Comments: Anyone can read, authenticated users can insert their own
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for all users" ON comments
FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users only" ON comments
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Enable delete for users based on user_id" ON comments
FOR DELETE USING (auth.uid() = user_id);

-- Likes: Similar policies
ALTER TABLE likes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for all users" ON likes
FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users only" ON likes
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Enable delete for users based on user_id" ON likes
FOR DELETE USING (auth.uid() = user_id);
```

### 5. Run the Application

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd client
npm run dev
```

Visit `http://localhost:5173` to see the application!

## 📝 Usage

### Creating an Admin User
1. Sign up through the UI
2. In MongoDB, update the user's role to `admin`:
```js
db.users.updateOne(
  { email: "your@email.com" },
  { $set: { role: "admin" } }
)
```
3. Sign out and sign back in
4. Access `/dashboard` route

### Creating Content
1. Login as admin
2. Go to Dashboard
3. Click "New Post"
4. Fill in the form with title, content, category, etc.
5. Upload featured image
6. Add SEO metadata
7. Publish!

## 🎨 Customization

### Adding Categories
Categories need to be added directly to MongoDB for now:

```js
db.categories.insertMany([
  { name: "Technology", slug: "technology", icon: "💻", color: "#3b82f6", description: "Tech news and tutorials" },
  { name: "Education", slug: "education", icon: "📚", color: "#10b981", description: "Educational content" },
  { name: "Freelancing", slug: "freelancing", icon: "💼", color: "#f59e0b", description: "Freelancing tips" },
  { name: "Study Abroad", slug: "study-abroad", icon: "✈️", color: "#8b5cf6", description: "Study opportunities abroad" }
])
```

### Changing Colors
Edit `client/tailwind.config.js` to modify the color scheme.

## 🌐 Deployment

### Frontend (Vercel)
1. Push code to GitHub
2. Connect to Vercel
3. Add environment variables
4. Deploy!

### Backend (Railway/Render)
1. Push code to GitHub
2. Connect to Railway or Render
3. Add environment variables
4. Deploy!

### MongoDB (Atlas)
Use MongoDB Atlas for production database.

## 📊 API Endpoints

### Posts
- `GET /api/posts` - Get all posts (with pagination, search, category filter)
- `GET /api/posts/:slug` - Get single post
- `POST /api/posts` - Create post (admin)
- `PUT /api/posts/:id` - Update post (admin)
- `DELETE /api/posts/:id` - Delete post (admin)
- `GET /api/posts/:id/related` - Get related posts
- `GET /api/posts/stats/overview` - Get stats (admin)

### Categories
- `GET /api/categories` - Get all categories
- `GET /api/categories/:slug` - Get single category
- `POST /api/categories` - Create category (admin)
- `PUT /api/categories/:id` - Update category (admin)
- `DELETE /api/categories/:id` - Delete category (admin)

### Auth
- `POST /api/auth/sync` - Sync Supabase user with backend
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile
- `POST /api/auth/bookmark/:postId` - Toggle bookmark
- `GET /api/auth/users` - Get all users (admin)

## 🔒 Security Features
- JWT authentication
- Supabase Row Level Security (RLS)
- Input validation
- CORS configuration
- Protected admin routes
- Secure password handling (Supabase)

## 🚀 Future Enhancements
- [ ] Newsletter subscription with email service
- [ ] Comment moderation dashboard
- [ ] Advanced analytics
- [ ] Post scheduling
- [ ] Multi-author support
- [ ] Search with Algolia
- [ ] Progressive Web App (PWA)
- [ ] Urdu language toggle
- [ ] AdSense integration
- [ ] Sitemap generation

## 📄 License
MIT

## 👤 Author
Built for ProperPakistan.com

## 🤝 Contributing
Contributions, issues, and feature requests are welcome!

---

**Made with ❤️ in Pakistan 🇵🇰**
