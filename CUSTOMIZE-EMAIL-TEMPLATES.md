# 📧 How to Customize Email Templates in Supabase

## Step-by-Step Guide

### 1. Access Email Templates

1. Go to your Supabase Dashboard: https://supabase.com/dashboard/project/vtlobwtvhdeszradzruz
2. Click **Authentication** (left sidebar)
3. Click **Email Templates** tab

### 2. Choose Template to Edit

You'll see 4 email templates:

- **Confirm signup** ← You want to edit this one!
- **Invite user**
- **Magic link**
- **Change email address**
- **Reset password**

### 3. Edit "Confirm Signup" Template

1. Click **"Confirm signup"**
2. You'll see the default template
3. **Replace everything** with the custom template I created:
   - File: `email-templates/confirm-signup.html`
4. Click **Save**

### 4. Variables Available

You can use these variables in your template:

- `{{ .ConfirmationURL }}` - The verification link (REQUIRED!)
- `{{ .SiteURL }}` - Your app URL
- `{{ .Token }}` - The confirmation token
- `{{ .TokenHash }}` - Hashed token
- `{{ .Email }}` - User's email address

### 5. Test the Email

1. Sign up with a real email
2. Check your inbox
3. You should see the beautiful new design! 🎉

---

## 🎨 What I Created For You

**Custom Features:**
- ✅ Pakistan flag green colors
- ✅ ProperPakistan branding
- ✅ Big green "Confirm Email" button
- ✅ Alternative link (if button doesn't work)
- ✅ Security note (24-hour expiry)
- ✅ "What's Next?" section
- ✅ Professional footer with links
- ✅ Mobile-responsive design

---

## 📋 Quick Copy-Paste Steps

### Option 1: Use My Custom Template

1. Open `email-templates/confirm-signup.html`
2. **Copy ALL the HTML code**
3. Supabase → Authentication → Email Templates
4. Click "Confirm signup"
5. **Delete default template**
6. **Paste my template**
7. Click **Save**
8. Done! ✅

### Option 2: Keep It Simple

If you want a simpler template, use this minimal version:

```html
<h2>Welcome to ProperPakistan! 🇵🇰</h2>

<p>Thanks for signing up! Click the button below to verify your email:</p>

<a href="{{ .ConfirmationURL }}" 
   style="display:inline-block; background:#006633; color:#fff; padding:12px 30px; text-decoration:none; border-radius:5px;">
  Verify Email
</a>

<p>Or copy this link: {{ .ConfirmationURL }}</p>

<p>This link expires in 24 hours.</p>

<p>If you didn't sign up, ignore this email.</p>
```

---

## 🔧 Customize Your Template

### Change Button Color

Find this line:
```html
background: linear-gradient(135deg, #006633 0%, #01411C 100%);
```

Replace with any color you like!

### Change Company Name

Find:
```html
<h1>Proper<span>Pakistan</span></h1>
```

Change to your branding!

### Add Your Logo

Replace the text header with an image:
```html
<img src="https://your-domain.com/logo.png" alt="Logo" style="max-width: 200px;">
```

---

## 🧪 Preview Before Sending

**Unfortunately**, Supabase doesn't have a preview feature. But you can:

1. Save the template
2. Sign up with a test email
3. Check how it looks
4. Adjust if needed
5. Save again

**Pro Tip:** Use a temp email service for testing:
- temp-mail.org
- guerrillamail.com

---

## 📱 Mobile-Friendly Design

My template is already mobile-responsive!

Works perfectly on:
- ✅ Gmail (Desktop & Mobile)
- ✅ Outlook
- ✅ Apple Mail
- ✅ Yahoo Mail
- ✅ ProtonMail

---

## ⚡ Other Templates to Customize

### Reset Password Email

Location: Email Templates → "Reset password"

Quick template:
```html
<h2>Password Reset Request</h2>
<p>Click below to reset your password:</p>
<a href="{{ .ConfirmationURL }}">Reset Password</a>
<p>Link expires in 1 hour.</p>
```

### Magic Link Email

Location: Email Templates → "Magic link"

For passwordless login:
```html
<h2>Your Magic Link</h2>
<p>Click to log in instantly:</p>
<a href="{{ .ConfirmationURL }}">Log In</a>
<p>Expires in 5 minutes.</p>
```

---

## 🎯 Best Practices

1. **Always include {{ .ConfirmationURL }}** - Required!
2. **Keep it simple** - Don't overcomplicate
3. **Test on mobile** - Most users check email on phone
4. **Add expiry warning** - Creates urgency
5. **Include company branding** - Build trust
6. **Provide alternative link** - In case button fails
7. **Add contact email** - For support

---

## 🚨 Common Mistakes to Avoid

❌ **Don't forget the confirmation link!**
```html
<!-- BAD - No link! -->
<p>Confirm your email</p>

<!-- GOOD -->
<a href="{{ .ConfirmationURL }}">Confirm Email</a>
```

❌ **Don't use complex JavaScript**
- Emails don't support JS
- Use HTML + inline CSS only

❌ **Don't use external CSS files**
- Must use inline styles
- Email clients strip `<style>` tags

❌ **Don't make it too long**
- Users skim emails
- Keep it under 3 screens

---

## ✅ Final Checklist

Before saving your template:

- [ ] Confirmation URL is present: `{{ .ConfirmationURL }}`
- [ ] Button is clickable and visible
- [ ] Alternative text link is provided
- [ ] Company name/logo is correct
- [ ] Expiry time is mentioned
- [ ] Footer has contact info
- [ ] Tested in your own inbox
- [ ] Mobile-friendly design
- [ ] No typos or errors

---

## 🎉 You're Done!

Your custom email template is ready! 

**Next Steps:**
1. Upload to Supabase Email Templates
2. Test with a real signup
3. Check your inbox
4. Enjoy the professional emails! ✨

Your users will love the Pakistan-themed confirmation emails! 🇵🇰
