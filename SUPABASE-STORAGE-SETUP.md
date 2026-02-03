# 🗄️ Supabase Storage Bucket Setup Guide

## Quick Steps to Create Storage Buckets

### Step 1: Open Supabase Dashboard
Go to: https://supabase.com/dashboard/project/vtlobwtvhdeszradzruz

### Step 2: Navigate to Storage
1. Click **"Storage"** in the left sidebar
2. Click **"New Bucket"** button

### Step 3: Create These Buckets

#### Bucket 1: `post-images`
- **Name:** `post-images`
- **Public:** ✅ Yes (toggle ON)
- **File size limit:** 5MB
- Click **"Create Bucket"**

#### Bucket 2: `post-documents`
- **Name:** `post-documents`
- **Public:** ❌ No (private)
- **File size limit:** 10MB
- Click **"Create Bucket"**

---

## Step 4: Set Bucket Policies (IMPORTANT!)

After creating buckets, set up access policies:

### For `post-images` bucket:
Click on `post-images` → **Policies** tab → **New Policy**

```sql
-- Allow public read access
CREATE POLICY "Public Access" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'post-images');

-- Allow authenticated users to upload
CREATE POLICY "Authenticated Upload" 
ON storage.objects FOR INSERT 
WITH CHECK (
  bucket_id = 'post-images' 
  AND auth.role() = 'authenticated'
);
```

### For `post-documents` bucket:
```sql
-- Only authenticated users can read/write
CREATE POLICY "Authenticated Access" 
ON storage.objects FOR ALL 
USING (
  bucket_id = 'post-documents' 
  AND auth.role() = 'authenticated'
);
```

---

## Alternative: Run This SQL

Go to **SQL Editor** and run:

```sql
-- Create storage buckets via SQL
INSERT INTO storage.buckets (id, name, public, file_size_limit)
VALUES 
  ('post-images', 'post-images', true, 5242880),
  ('post-documents', 'post-documents', false, 10485760)
ON CONFLICT (id) DO NOTHING;

-- Set RLS policies for post-images (public read)
CREATE POLICY "Public read for post-images" 
ON storage.objects FOR SELECT 
TO public
USING (bucket_id = 'post-images');

-- Set RLS policies for authenticated uploads
CREATE POLICY "Auth upload for post-images" 
ON storage.objects FOR INSERT 
TO authenticated
WITH CHECK (bucket_id = 'post-images');

CREATE POLICY "Auth access for post-documents" 
ON storage.objects FOR ALL 
TO authenticated
USING (bucket_id = 'post-documents');
```

---

## ✅ Verify Setup

1. Go to **Storage** → Click `post-images`
2. Try uploading a test image
3. Check that the public URL works

---

## 📝 Your Images Are Now Fixed!

The PostCard and Home page now use:
- `cover_image` field from database (Unsplash URLs)
- Fallback to a default image if broken
- Error handler to catch failed loads

**Refresh your homepage to see the images!** 🎉
