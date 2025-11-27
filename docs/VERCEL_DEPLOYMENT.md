# Vercel Deployment Guide

This guide will walk you through deploying GearShare to Vercel.

## Prerequisites

- A GitHub, GitLab, or Bitbucket account
- A Vercel account (sign up at [vercel.com](https://vercel.com))
- Your Supabase project URL and anon key

## Deployment Steps

### 1. Push Your Code to Git

Make sure your code is pushed to a Git repository (GitHub, GitLab, or Bitbucket):

```bash
git add .
git commit -m "Prepare for Vercel deployment"
git push origin main
```

### 2. Import Project to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click **"Add New..."** → **"Project"**
3. Import your Git repository
4. Vercel will auto-detect Next.js settings

### 3. Configure Environment Variables

In the Vercel project settings, add these environment variables:

**Required:**
- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anon/public key

**Optional (for email notifications):**
- `NEXT_PUBLIC_APP_URL` - Your Vercel deployment URL (e.g., `https://your-app.vercel.app`)

**How to add environment variables:**
1. In your Vercel project dashboard, go to **Settings** → **Environment Variables**
2. Add each variable for all environments (Production, Preview, Development)
3. Click **Save**

### 4. Deploy

1. After adding environment variables, Vercel will automatically trigger a new deployment
2. Or click **"Redeploy"** in the Deployments tab
3. Wait for the build to complete

### 5. Verify Deployment

1. Once deployed, Vercel will provide you with a URL (e.g., `https://your-app.vercel.app`)
2. Visit the URL and test your application
3. Make sure authentication works with Supabase
4. Test creating a listing and uploading images

## Post-Deployment Checklist

- [ ] Verify Supabase connection works
- [ ] Test user authentication (sign up/login)
- [ ] Test image uploads to Supabase Storage
- [ ] Verify admin routes are protected
- [ ] Test creating and viewing listings
- [ ] Update `NEXT_PUBLIC_APP_URL` if you're using email notifications

## Custom Domain (Optional)

1. Go to **Settings** → **Domains**
2. Add your custom domain
3. Follow Vercel's DNS configuration instructions
4. SSL certificates are automatically provisioned

## Environment-Specific Deployments

Vercel automatically creates:
- **Production**: Deployments from your main branch
- **Preview**: Deployments from pull requests and other branches
- **Development**: Local development with `vercel dev`

Each environment can have different environment variables if needed.

## Troubleshooting

### Build Fails

- Check build logs in Vercel dashboard
- Ensure all environment variables are set
- Verify `package.json` has correct build scripts
- Check that Supabase URL and keys are correct

### Images Not Loading

- Verify Supabase Storage bucket is public
- Check `next.config.js` has correct `remotePatterns` for Supabase
- Ensure image URLs are correct

### Authentication Issues

- Verify `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are set
- Check Supabase project settings
- Verify redirect URLs in Supabase Auth settings include your Vercel domain

### Supabase Redirect URLs

In your Supabase project:
1. Go to **Authentication** → **URL Configuration**
2. Add your Vercel URL to **Redirect URLs**:
   - `https://your-app.vercel.app/**`
   - `https://your-app.vercel.app/auth/callback`

## Continuous Deployment

Vercel automatically deploys:
- Every push to the main branch → Production
- Every pull request → Preview deployment
- You can also trigger manual deployments from the dashboard

## Useful Vercel Features

- **Analytics**: Monitor your app's performance
- **Logs**: View server logs and function logs
- **Speed Insights**: Track Core Web Vitals
- **Edge Functions**: Deploy serverless functions (if needed)

## Next Steps

After deployment:
1. Set up your first admin user in Supabase
2. Configure email notifications (if using)
3. Set up monitoring and alerts
4. Configure custom domain (optional)

