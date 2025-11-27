# Setup Guide - Ski Gear Swap

## Prerequisites

- Node.js 18+ installed
- A Supabase account (free tier works fine)

## Step-by-Step Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Supabase

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Wait for the project to finish provisioning (takes ~2 minutes)

### 3. Set Up Database

1. In Supabase Dashboard, go to **SQL Editor**
2. Click **New Query**
3. Copy and paste the entire contents of `supabase/schema.sql`
4. Click **Run** (or press Cmd/Ctrl + Enter)
5. Verify tables were created by going to **Table Editor** - you should see:
   - `profiles`
   - `listings`
   - `listing_images`
   - `messages`
   - `announcements`

### 4. Set Up Storage

1. In Supabase Dashboard, go to **Storage**
2. Click **Create Bucket**
3. Name it: `listing-images`
4. Set it to **Public bucket** (toggle ON)
5. Click **Create bucket**

### 5. Configure Environment Variables

1. In Supabase Dashboard, go to **Settings** > **API**
2. Copy your **Project URL** and **anon/public key**
3. Create a file named `.env.local` in the root directory
4. Add the following:

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

Replace `your_project_url_here` and `your_anon_key_here` with the values you copied.

### 6. Make Yourself Admin

1. Start the development server: `npm run dev`
2. Go to `http://localhost:3000/login`
3. Create an account with your email
4. In Supabase Dashboard, go to **Table Editor** > **profiles**
5. Find your user record (by email)
6. Click the row to edit it
7. Set `is_admin` to `true` and `is_approved` to `true`
8. Save the changes
9. **Confirm your email** (required for login):
   - Go to **Authentication** > **Users** in Supabase Dashboard
   - Find your user by email
   - Click on the user to open details
   - Click the **Confirm Email** button, OR
   - Run this SQL in the SQL Editor (replace `your-email@example.com` with your email):
     ```sql
     UPDATE auth.users 
     SET email_confirmed_at = NOW() 
     WHERE email = 'your-email@example.com';
     ```

### 7. Test the Application

1. Refresh your browser
2. You should now see the Admin link in the navbar
3. Try creating a test listing
4. Test the admin panel to approve users

## Troubleshooting

### "Invalid API key" error
- Make sure your `.env.local` file has the correct values
- Restart the dev server after changing `.env.local`

### "relation does not exist" error
- Make sure you ran the SQL schema in Supabase
- Check that all tables were created in the Table Editor

### Images not uploading
- Verify the `listing-images` bucket exists and is public
- Check Supabase Storage settings

### Can't access admin panel
- Make sure you set `is_admin = true` in your profile
- Refresh the page after making the change

## Next Steps

- Customize the branding/colors in `tailwind.config.ts`
- Add your own domain when ready to deploy
- Consider adding email notifications for new messages
- Set up backups in Supabase

## Deployment

When ready to deploy:

1. Push your code to GitHub
2. Deploy to Vercel (recommended for Next.js):
   - Connect your GitHub repo
   - Add the same environment variables
   - Deploy!

3. Update Supabase settings:
   - Go to **Authentication** > **URL Configuration**
   - Add your production URL to **Site URL** and **Redirect URLs**

