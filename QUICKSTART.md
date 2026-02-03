# 🚀 Quick Start Guide - ProperPakistan.com

## Current Status: Frontend Running ✅

The **React frontend** is now running successfully at `http://localhost:5173`!

---

## ⚠️ MongoDB Not Running

The backend server needs MongoDB to store posts, users, and categories.

### Option 1: Install MongoDB Locally (Recommended for Development)

**For Windows:**
1. Download MongoDB Community Server: https://www.mongodb.com/try/download/community
2. Install with default settings
3. MongoDB will start automatically as a Windows service

**Quick Check:**
```bash
# Open a new terminal and run:
mongosh
# If it connects, MongoDB is running!
```

### Option 2: Use MongoDB Atlas (Free Cloud Database)

1. Go to https://www.mongodb.com/cloud/atlas/register
2. Create a free account
3. Create a new cluster (free M0 tier)
4. Get your connection string
5. Update `server/.env`:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/properpakistan
   ```

### Option 3: Quick Test Mode (No Database)

For now, the server will run without MongoDB for basic testing. Some features won't work:
- ❌ Can't create/view posts
- ❌ Can't register users
- ✅ Frontend UI works
- ✅ Can test navigation

---

## 🎯 Next Steps

### 1. Start MongoDB (Choose one option above)

### 2. Restart Backend Server
The backend should auto-restart with nodemon once MongoDB is available.

### 3. Setup Supabase (For Authentication & Comments)

1. Go to https://supabase.com and create account
2. Create new project
3. Get your credentials from Settings > API
4. Update both `.env` files:

**server/.env:**
```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_anon_key_here
```

**client/.env:**
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

5. Create tables in Supabase (SQL Editor):
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

6. Create storage bucket: `blog-images` (make it public)
7. Enable Google OAuth in Authentication > Providers

### 4. Seed Sample Data

Once MongoDB is running, add categories:
```javascript
// In MongoDB shell or Compass
use properpakistan

db.categories.insertMany([
  { name: "Technology", slug: "technology", icon: "💻", color: "#3b82f6", description: "Tech news and tutorials" },
  { name: "Education", slug: "education", icon: "📚", color: "#10b981", description: "Educational content" },
  { name: "Freelancing", slug: "freelancing", icon: "💼", color: "#f59e0b", description: "Freelancing tips" },
  { name: "Study Abroad", slug: "study-abroad", icon: "✈️", color: "#8b5cf6", description: "Study opportunities" }
])
```

### 5. Create Admin User

1. Sign up through the UI at http://localhost:5173/login
2. In MongoDB, update your user role:
```javascript
db.users.updateOne(
  { email: "your@email.com" },
  { $set: { role: "admin" } }
)
```
3. Sign out and sign back in
4. Access admin dashboard at http://localhost:5173/dashboard

---

## 🎉 You're All Set!

Once MongoDB is running, you'll have a fully functional blog platform with:
- ✅ User authentication
- ✅ Post creation and management
- ✅ Real-time comments
- ✅ Categories and filtering
- ✅ Admin dashboard
- ✅ SEO optimization

---

## 💡 Current Running Services

- **Frontend**: http://localhost:5173 ✅ RUNNING
- **Backend**: http://localhost:5000 ⚠️ NEEDS MONGODB
- **MongoDB**: ❌ NOT RUNNING

---

For detailed documentation, see [README.md](file:///c:/Users/asadk/Downloads/Proper%20Pakistan/README.md)
