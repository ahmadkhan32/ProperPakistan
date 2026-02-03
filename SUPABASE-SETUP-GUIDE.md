# 🚀 Supabase Setup Guide for ProperPakistan.com

Follow these steps to configure Supabase for your blog platform.

---

## 📋 Prerequisites

- Supabase account (free tier is enough)
- 15 minutes of time

---

## Step 1: Create Supabase Project

1. Go to https://supabase.com
2. Click **"Start your project"**
3. Sign up with GitHub/Google (recommended)
4. Click **"New Project"**
5. Fill in details:
   - **Name:** properpakistan
   - **Database Password:** (Save this securely!)
   - **Region:** Singapore (closest to Pakistan)
6. Click **"Create new project"**
7. Wait 2-3 minutes for setup

---

## Step 2: Run SQL Setup

1. In your Supabase dashboard, go to **SQL Editor** (left sidebar)
2. Click **"New query"**
3. Copy the entire content of `supabase-setup.sql`
4. Paste it in the SQL editor
5. Click **"Run"** (or press Ctrl+Enter)
6. You should see: ✓ Success. No rows returned

This creates:
- ✅ profiles table
- ✅ comments table (with realtime)
- ✅ likes table
- ✅ bookmarks table
- ✅ subscribers table
- ✅ All RLS policies
- ✅ Triggers for auto-profile creation

---

## Step 3: Create Storage Bucket

1. Go to **Storage** (left sidebar)
2. Click **"New bucket"**
3. Settings:
   - **Name:** `blog-images`
   - **Public:** ✅ CHECKED (important!)
   - **File size limit:** 5 MB
   - **Allowed MIME types:** Leave default
4. Click **"Create bucket"**

### Configure Bucket Policies

1. Click on `blog-images` bucket
2. Go to **Policies** tab
3. Click **"New policy"**
4. Template: **"Public Access for all operations"**
5. Click **"Review"** → **"Save policy"**

Now anyone can upload/view images!

---

## Step 4: Enable Realtime

1. Go to **Database** → **Replication**
2. Find **supabase_realtime** publication
3. Click **"Enable"**
4. Select table: **comments**
5. Click **"Save"**

This enables real-time comment updates!

---

## Step 5: Configure Google OAuth (Optional)

1. Go to **Authentication** → **Providers**
2. Find **Google**
3. Toggle **Enabled**
4. You need:
   - Google Client ID
   - Google Client Secret

### Get Google Credentials:

1. Go to https://console.cloud.google.com
2. Create new project: "ProperPakistan Auth"
3. Enable **Google+ API**
4. Go to **Credentials** → **Create Credentials** → **OAuth 2.0 Client ID**
5. Application type: **Web application**
6. Authorized redirect URIs:
   ```
   https://[YOUR-PROJECT-REF].supabase.co/auth/v1/callback
   ```
   (Copy from Supabase Google provider settings)
7. Copy **Client ID** and **Client Secret**
8. Paste in Supabase Google provider settings
9. **Save**

---

## Step 6: Get API Credentials

1. Go to **Settings** → **API**
2. Copy these values:

```
Project URL: https://[your-project-ref].supabase.co
anon public key: eyJhbGc...
```

---

## Step 7: Update Environment Files

### Frontend `.env`

```env
VITE_API_URL=http://localhost:5000/api
VITE_SUPABASE_URL=https://[your-project-ref].supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc... (your anon key)
```

### Backend `.env`

```env
# MongoDB
MONGODB_URI=mongodb://localhost:27017/properpakistan

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this

# Supabase
SUPABASE_URL=https://[your-project-ref].supabase.co
SUPABASE_ANON_KEY=eyJhbGc... (your anon key)
SUPABASE_SERVICE_KEY=eyJhbGc... (your service_role key - keep secret!)

# Server
PORT=5000
NODE_ENV=development
```

---

## Step 8: Test Supabase Integration

### Test 1: Check Tables

1. Go to **Table Editor**
2. You should see all tables:
   - profiles
   - comments
   - likes
   - bookmarks
   - subscribers

### Test 2: Test Auth

1. Go to **Authentication** → **Users**
2. Click **"Add user"** → **"Create new user"**
3. Email: `test@properpakistan.com`
4. Password: `Test123!`
5. Click **"Create user"**
6. Go to **Table Editor** → **profiles**
7. You should see auto-created profile! ✅

### Test 3: Test Storage

1. Go to **Storage** → **blog-images**
2. Click **"Upload file"**
3. Upload any image
4. Click on image → **"Get URL"**
5. URL should work in browser ✅

---

## Step 9: Restart Frontend

```powershell
# Stop frontend (Ctrl+C in terminal)
cd "C:\Users\asadk\Downloads\Proper Pakistan\client"
npm run dev
```

---

## Step 10: Verify Everything Works

1. Open http://localhost:5173
2. Click **"Sign In"**
3. Try signing up with email
4. Try Google OAuth (if configured)
5. Check profile is created in Supabase
6. Go to any blog post
7. Try adding a comment (should work in realtime!)
8. Try liking a post
9. Check Supabase tables - data should appear!

---

## 🎉 Supabase Setup Complete!

Your platform now has:
- ✅ User authentication (Email + Google)
- ✅ Real-time comments
- ✅ Likes and bookmarks
- ✅ Image upload to cloud storage
- ✅ Secure RLS policies
- ✅ Auto-profile creation

---

## 🔧 Common Issues & Solutions

### Issue: "Invalid API key"
**Solution:** Double-check you copied the **anon public** key, not service_role

### Issue: Comments not appearing
**Solution:** Check Realtime is enabled for comments table

### Issue: Can't upload images
**Solution:** Make sure bucket is PUBLIC and has correct policies

### Issue: Google login not working
**Solution:** Verify redirect URI matches exactly in Google Console

---

## 📊 Next Steps

1. ✅ Supabase configured
2. ⏳ Setup MongoDB
3. ⏳ Run seed script
4. ⏳ Promote first user to admin
5. ⏳ Start creating content!

---

## 🆘 Need Help?

- Supabase Docs: https://supabase.com/docs
- Discord: https://discord.supabase.com
- Check logs in Supabase Dashboard → Logs

Good luck! 🚀
