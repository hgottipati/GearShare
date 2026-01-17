# Custom Domain Setup Guide

This guide will help you set up a custom domain (like `sharemygear.com`) so your site doesn't have "vercel" in the URL.

## Option 1: Use a Custom Domain on Vercel (Recommended)

Vercel makes it easy to add a custom domain with free SSL certificates.

### Step 1: Buy a Domain (if you don't have one)

Popular domain registrars:
- **Namecheap** (https://namecheap.com) - Good prices, easy to use
- **Google Domains** (https://domains.google.com) - Simple interface
- **Cloudflare** (https://cloudflare.com) - Good prices, includes DNS
- **GoDaddy** (https://godaddy.com) - Popular but can be expensive

### Step 2: Add Domain to Vercel

1. Go to your Vercel project dashboard
2. Click on **Settings** → **Domains**
3. Enter your domain (e.g., `sharemygear.com`)
4. Click **Add**

### Step 3: Configure DNS

Vercel will show you DNS records to add. You have two options:

#### Option A: Use Vercel's Nameservers (Easiest)

1. In your domain registrar (where you bought the domain):
   - Go to DNS/Nameserver settings
   - Replace existing nameservers with Vercel's:
     - `ns1.vercel-dns.com`
     - `ns2.vercel-dns.com`
2. Wait 24-48 hours for DNS to propagate

#### Option B: Add DNS Records (Keep Your Current DNS)

If you want to keep your current DNS provider:

1. In your domain registrar's DNS settings, add these records:

   **For root domain (sharemygear.com):**
   ```
   Type: A
   Name: @
   Value: 76.76.21.21
   ```

   **For www subdomain (www.sharemygear.com):**
   ```
   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   ```

2. Wait 24-48 hours for DNS to propagate

### Step 4: Update Environment Variables

1. In Vercel dashboard, go to **Settings** → **Environment Variables**
2. Update `NEXT_PUBLIC_APP_URL` to your custom domain:
   ```
   https://sharemygear.com
   ```
   (or `https://www.sharemygear.com` if you prefer www)
3. Make sure to set it for **Production** environment
4. Click **Save**

### Step 5: Update Supabase Settings

1. Go to your Supabase project dashboard
2. Navigate to **Authentication** → **URL Configuration**
3. Update **Site URL** to your custom domain:
   ```
   https://sharemygear.com
   ```
4. Update **Redirect URLs** to include:
   ```
   https://sharemygear.com/**
   https://sharemygear.com/auth/callback
   ```
5. Click **Save**

### Step 6: Verify SSL Certificate

Vercel automatically provisions SSL certificates. After DNS propagates:
1. Check that your site loads with `https://`
2. The SSL certificate should be active automatically
3. You can verify in Vercel dashboard under **Settings** → **Domains**

## Option 2: Use a Subdomain on Vercel (Free, but still has vercel.app)

If you want a shorter URL but don't want to buy a domain:

1. Go to **Settings** → **General** in Vercel
2. Change **Project Name** to something shorter (e.g., `sharemygear`)
3. Your URL will be: `https://sharemygear.vercel.app`
4. Still has "vercel" but shorter than the default

## Quick Checklist

- [ ] Domain purchased (if needed)
- [ ] Domain added to Vercel project
- [ ] DNS configured (nameservers or A/CNAME records)
- [ ] `NEXT_PUBLIC_APP_URL` environment variable updated
- [ ] Supabase Site URL updated
- [ ] Supabase Redirect URLs updated
- [ ] SSL certificate active (automatic on Vercel)
- [ ] Site loads on custom domain

## Troubleshooting

### Domain Not Working After 48 Hours

1. Check DNS propagation: Use https://dnschecker.org
2. Verify DNS records are correct in your registrar
3. Make sure you're using the right DNS provider (where you bought the domain)
4. Check Vercel dashboard for any error messages

### SSL Certificate Issues

- Vercel automatically provisions SSL, but it can take a few hours after DNS propagates
- If it's been more than 24 hours, check Vercel dashboard for errors
- Make sure your DNS is pointing to Vercel correctly

### Authentication Not Working

- Double-check Supabase redirect URLs include your custom domain
- Make sure `NEXT_PUBLIC_APP_URL` is set correctly
- Clear browser cache and try again

## Cost

- **Vercel**: Free for custom domains (includes SSL)
- **Domain**: Usually $10-15/year for a `.com` domain
- **Total**: Just the domain cost, everything else is free!

## Next Steps

After your custom domain is set up:
1. Update any hardcoded URLs in your code (if any)
2. Update social media links
3. Set up email with your custom domain (optional)
4. Consider setting up `www` redirect (Vercel can do this automatically)




