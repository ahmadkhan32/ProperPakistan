# 🚀 ProperPakistan Database Setup Guide

## Step 1: Run Database Setup

### 1.1 Open Supabase SQL Editor
Go to: [Supabase SQL Editor](https://supabase.com/dashboard/project/vtlobwtvhdeszradzruz/sql/new)

### 1.2 Copy & Run the Setup SQL
1. Open `COMPLETE-DATABASE-SETUP.sql` in your project
2. **Copy ALL the code**
3. Paste into Supabase SQL Editor
4. Click **RUN**

**Expected Result:** ✅ Success (no errors)

---

## Step 2: Make Yourself Admin

After the database is set up, run this SQL to promote your account:

```sql
UPDATE public.profiles 
SET role = 'admin' 
WHERE email = 'asadkhanbaloch111@gmail.com';
```

**Expected Result:** `UPDATE 1`

---

## Step 3: Reload Schema Cache

**CRITICAL:** Supabase needs to refresh its API cache after schema changes.

1. Go to: **Settings** → **API**
2. Click **"Reload schema cache"** button
3. Wait 5 seconds

---

## Step 4: Test Login

1. Go to your app: http://localhost:5173
2. **Sign Out** (if logged in)
3. **Sign In** again with your credentials
4. You should be redirected to `/dashboard` ✅

---

## Step 5: Add Sample Content (Optional)

If you want the 12 SRS posts, run `SRS-CONTENT-SEED.sql` in SQL Editor.

---

## ✅ Verification Checklist

- [ ] Database tables created
- [ ] Categories seeded (4 categories)
- [ ] Your account role is 'admin'
- [ ] Schema cache reloaded
- [ ] Logged out and back in
- [ ] Dashboard accessible

---

## 🐛 Troubleshooting

### Issue: "PGRST205: Could not find the table"
**Solution:** Reload schema cache (Step 3)

### Issue: "Not redirected to dashboard"
**Solution:** Check your role in `profiles` table (should be 'admin')

### Issue: "Cannot read posts"
**Solution:** Run `SRS-CONTENT-SEED.sql` to add sample posts
