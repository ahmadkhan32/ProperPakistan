# 🔗 How to Connect Supabase to Your ProperPakistan Blog

## Quick Answer:
Supabase **doesn't connect to MongoDB** - they work side-by-side. Your Node.js backend talks to both!

---

## 📋 Step-by-Step Setup (15 minutes)

### Step 1: Create Supabase Account

1. Go to: https://supabase.com
2. Click **"Start your project"**
3. Sign in with GitHub or Google
4. Click **"New Project"**

### Step 2: Create Project

Fill in:
- **Organization:** Your name (create new if needed)
- **Name:** `properpakistan` 
- **Database Password:** Choose a strong password (SAVE IT!)
- **Region:** `Singapore (Southeast Asia)` (closest to Pakistan)
- **Pricing Plan:** Free

Click **"Create new project"** → Wait 2 minutes

### Step 3: Run SQL Setup

1. In Supabase dashboard, click **"SQL Editor"** (left sidebar)
2. Click **"New query"**
3. Open the file: `supabase-setup.sql` 
4. **Copy ALL the SQL code**
5. **Paste** into Supabase SQL editor
6. Click **"RUN"** button (bottom right)
7. Should say: ✅ **Success. No rows returned**

This creates all your tables!

### Step 4: Create Storage Bucket

1. Click **"Storage"** (left sidebar)
2. Click **"New bucket"**
3. Settings:
   - **Name:** `blog-images`
   - **Public bucket:** ✅ **CHECK THIS BOX** (important!)
   - Click **"Create bucket"**

4. Click on `blog-images` bucket
5. Click **"Policies"** tab
6. Click **"New policy"**
7. Select **"For full customization"**
8. Paste this policy:

```sql
CREATE POLICY "Public Access"
ON storage.objects FOR ALL
USING (bucket_id = 'blog-images');
```

9. Click **"Review"** → **"Save policy"**

### Step 5: Enable Google Authentication (Optional)

1. Click **"Authentication"** → **"Providers"**
2. Find **"Google"**
3. Toggle to **Enabled**
4. You need Google OAuth credentials:
   - Go to: https://console.cloud.google.com
   - Create project → Enable Google+ API
   - Create OAuth 2.0 credentials
   - Copy Client ID and Secret
   - Paste into Supabase

(Or skip this and use email auth only)

### Step 6: Get Your API Keys

1. Click **"Settings"** → **"API"** (left sidebar)
2. Copy these 2 values:

```
Project URL: https://xxxxxxxxxxxxx.supabase.co
anon public: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Step 7: Update Frontend .env

Open: `client/.env`

```env
VITE_API_URL=http://localhost:5000/api
VITE_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Replace with YOUR values from Supabase!

### Step 8: Update Backend .env

Open: `server/.env`

```env
# MongoDB (your existing database)
MONGODB_URI=mongodb://localhost:27017/properpakistan

# Supabase (new)
SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# JWT Secret (create a random string)
JWT_SECRET=super-secret-change-this-to-random-string

PORT=5000
NODE_ENV=development
```

### Step 9: Restart Both Servers

Stop both terminals (Ctrl+C) and restart:

```powershell
# Terminal 1 - Backend
cd "C:\Users\asadk\Downloads\Proper Pakistan\server"
npm run dev

# Terminal 2 - Frontend  
cd "C:\Users\asadk\Downloads\Proper Pakistan\client"
npm run dev
```

### Step 10: Test It!

1. Open: http://localhost:5173
2. Click **"Sign In"**
3. Create new account
4. Go to Supabase → **"Table Editor"** → **"profiles"**
5. You should see your profile auto-created! ✅

---

## ✅ What Just Happened?

Now your app uses **TWO databases**:

### MongoDB → Blog Content
- Posts
- Categories  
- User accounts (basic info)

### Supabase → User Features
- Authentication (login/logout)
- Comments (realtime!)
- Likes on posts
- Bookmarks
- Profile pictures

The Node.js backend connects to both automatically!

---

## 🔍 How It Works Together

When a user signs up:
1. ✅ Supabase creates auth account
2. ✅ Trigger auto-creates profile in Supabase
3. ✅ Backend syncs user to MongoDB
4. ✅ User can now comment, like, bookmark!

When viewing a blog post:
1. ✅ Post content from **MongoDB**
2. ✅ Comments from **Supabase** (realtime)
3. ✅ Likes count from **Supabase**
4. ✅ All displayed together seamlessly!

---

## 🆘 Troubleshooting

**Error: "Invalid API key"**
- Check you copied the **anon public** key (not service_role)
- Make sure no extra spaces in .env file

**Comments not appearing**
- Check Supabase → Database → Replication
- Make sure `comments` table is enabled for realtime

**Can't upload images**
- Make sure bucket is **PUBLIC**
- Check bucket policies are correct

**MongoDB connection error**
- Make sure MongoDB is running
- Check connection string in server/.env

---

## 🎉 You're Done!

Your blog now has:
- ✅ User authentication (Supabase)
- ✅ Blog posts (MongoDB)
- ✅ Real-time comments (Supabase)
- ✅ Likes & bookmarks (Supabase)
- ✅ Image uploads (Supabase Storage)

Both databases work together perfectly! 🚀
