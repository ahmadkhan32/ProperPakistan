# ✅ Your Login Credentials

## 📧 Your Account Details:

**Email:** asadkhanbaloch111@gmail.com  
**Password:** [The password you just created during signup]

---

## 🔐 Next Steps to Access Dashboard:

### Step 1: Make Yourself Admin

Your account exists now, but it's a regular "user". You need to be "admin" to access `/dashboard`.

1. Open [Supabase SQL Editor](https://supabase.com/dashboard/project/vtlobwtvhdeszradzruz/sql/new)

2. Copy and paste this SQL:
```sql
UPDATE public.profiles 
SET role = 'admin' 
WHERE email = 'asadkhanbaloch111@gmail.com';
```

3. Click **RUN**

4. You should see: `UPDATE 1` (means it worked!)

---

### Step 2: Log Out (if logged in)

1. Go to http://localhost:5173
2. If you see your name in the top right, click it
3. Click **"Sign Out"**

---

### Step 3: Log In Again

1. Go to http://localhost:5173/login
2. Enter:
   - **Email:** asadkhanbaloch111@gmail.com
   - **Password:** [your password]
3. Click **"Sign In"**
4. You'll be redirected to `/dashboard` ✅

---

## 🎯 What Should Happen:

```
Login → Check role → 
   ↓
If admin: Redirect to /dashboard ✅
   ↓
If user: Redirect to / (homepage)
```

Since you'll be admin after Step 1, you'll go straight to dashboard!

---

## 🐛 If Login Fails:

**Error: "Invalid credentials"**
- Double-check your password
- Make sure you're using the same email: asadkhanbaloch111@gmail.com

**Error: "Not redirected to dashboard"**
- Make sure you ran the SQL in Step 1
- Verify by checking the profiles table in Supabase

---

## ✅ To Verify You're Admin:

After running the SQL in Step 1, you can check:

1. Go to [Supabase Table Editor](https://supabase.com/dashboard/project/vtlobwtvhdeszradzruz/editor)
2. Click on `profiles` table
3. Find your row (email: asadkhanbaloch111@gmail.com)
4. Check the `role` column - it should say **"admin"**

---

**Now go run Step 1 (the SQL command) to become admin!** 🚀
