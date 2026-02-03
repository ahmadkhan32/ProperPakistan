# 🔧 Fix: Make Your Account an Admin

## Problem:
You created an account, but it's assigned the "user" role by default, so you can't access `/dashboard`.

## Solution:
You need to manually promote your account to "admin" in Supabase.

---

## Steps to Make Yourself Admin:

### 1. Open Supabase Dashboard
Go to: [Supabase Table Editor](https://supabase.com/dashboard/project/vtlobwtvhdeszradzruz/editor)

### 2. Navigate to `profiles` Table
Click on **"profiles"** table in the left sidebar

### 3. Find Your Account
Look for the row with your email: **asadkhanbaloch111@gmail.com**

### 4. Edit the `role` Column
- Click on the row
- Find the `role` column
- Change the value from **`user`** to **`admin`**
- Click **Save**

### 5. Log Out and Log Back In
- Refresh the app: http://localhost:5173
- Click **Sign Out**
- Sign back in with your credentials

### 6. Test
After logging in, you should be automatically redirected to `/dashboard` ✅

---

## Alternative: SQL Command

If you prefer SQL, go to **SQL Editor** and run:

```sql
UPDATE public.profiles 
SET role = 'admin' 
WHERE email = 'asadkhanbaloch111@gmail.com';
```

Then refresh and log back in!
