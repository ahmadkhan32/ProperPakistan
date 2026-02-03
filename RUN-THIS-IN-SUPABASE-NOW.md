# 🚨 URGENT: Fix Database Error

## Error You're Seeing:
```
Could not find a relationship between 'posts' and 'likes' in the schema cache
Failed to load resource: the server responded with a status of 500
```

**Root Cause:** Database tables don't exist in Supabase yet.

---

## ✅ Fix It Now (3 Minutes)

### Step 1: Run SQL Setup

1. **Open Supabase SQL Editor**: 
   👉 [Click here to open](https://supabase.com/dashboard/project/vtlobwtvhdeszradzruz/sql/new)

2. **Copy the SQL file**:
   - Open `COMPLETE-DATABASE-SETUP.sql` in your editor
   - Press `Ctrl+A` (select all)
   - Press `Ctrl+C` (copy)

3. **Paste and Execute**:
   - Click in the Supabase SQL Editor
   - Press `Ctrl+V` (paste)
   - Click the big **green RUN button** (or press `Ctrl+Enter`)
   - **Wait 10 seconds** for "Success. No rows returned" message

---

### Step 2: Reload Schema Cache

1. **Open API Settings**: 
   👉 [Click here](https://supabase.com/dashboard/project/vtlobwtvhdeszradzruz/settings/api)

2. Scroll down to **"Schema Cache"** section

3. Click the **"Reload schema cache"** button

4. Wait 10 seconds

---

### Step 3: Verify Tables Created

1. **Open Table Editor**: 
   👉 [Click here](https://supabase.com/dashboard/project/vtlobwtvhdeszradzruz/editor)

2. **You should see these 7 tables**:
   - ✅ `profiles`
   - ✅ `categories`
   - ✅ `posts`
   - ✅ `comments`
   - ✅ `likes` ← This is the missing one!
   - ✅ `bookmarks`
   - ✅ `subscribers`

---

### Step 4: Restart Your Server

In your terminal where server is running:
- Press `Ctrl+C` to stop the server
- Run `npm run dev` again

---

## ✅ Expected Result

After completing all steps:
- ✅ No more 500 errors
- ✅ Homepage loads posts successfully
- ✅ Login/signup works
- ✅ Server starts without crashes

---

## 🆘 If Still Not Working

**Check if SQL ran successfully:**
```sql
-- Run this in Supabase SQL Editor
SELECT COUNT(*) as table_count 
FROM information_schema.tables 
WHERE table_schema = 'public';
```

**Expected result:** Should show `7` tables

If it shows less than 7, the SQL didn't run completely. Try again!
