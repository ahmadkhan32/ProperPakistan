# 🔧 Disable Email Confirmation for Development

## Step 1: Disable Email Confirmation

1. Go to **[Supabase Auth Settings](https://supabase.com/dashboard/project/vtlobwtvhdeszradzruz/auth/providers)**

2. Scroll down to **"Email"** provider section

3. Find **"Confirm email"** toggle

4. **Turn it OFF** (disable it)

5. Click **"Save"** at the bottom

---

## Step 2: Test Signup Flow

1. Go to `http://localhost:5173/login`

2. Click **"Sign Up"**

3. Fill in:
   - **Name**: Your Name
   - **Email**: your@email.com
   - **Password**: (min 6 chars)

4. Click **"Sign Up"**

5. **Expected**: 
   - ✅ Account created immediately
   - ✅ You're automatically logged in
   - ✅ NO email confirmation required
   - ✅ Ready to login

---

## Step 3: Make Yourself Admin

After signup, run this in **[Supabase SQL Editor](https://supabase.com/dashboard/project/vtlobwtvhdeszradzruz/sql/new)**:

```sql
UPDATE public.profiles 
SET role = 'admin' 
WHERE id = (
  SELECT id FROM auth.users 
  WHERE email = 'your@email.com'  -- Replace with your actual email
);
```

---

## Step 4: Login & Dashboard Test

1. Go to `http://localhost:5173/login`

2. Click **"Sign In"**

3. Enter your email and password

4. **Expected**:
   - ✅ Automatically redirects to `/dashboard`
   - ✅ Dashboard loads with admin panel
   - ✅ Shows your name in sidebar

---

## ⚠️ For Production Later

When you deploy to production, you should:

1. **Re-enable email confirmation**
2. **Customize email templates** in Supabase Auth > Email Templates
3. **Set up custom SMTP** for reliable email delivery

But for now, keep it OFF for faster development! 🚀
