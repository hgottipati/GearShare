# First Admin Setup Guide

After creating your first account, you need to manually set yourself as an admin in Supabase to access the admin panel and approve users.

## Step 1: Set Yourself as Admin in Supabase

1. Go to your [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Navigate to **Table Editor** → **profiles**
4. Find your user record (search by your email address)
5. Click on your profile row to edit it
6. Set both fields:
   - `is_admin` → **true** (check the box)
   - `is_approved` → **true** (check the box)
7. Click **Save** or press Enter

## Step 2: Refresh Your App

1. Go back to your Vercel-deployed app
2. Refresh the page (or log out and log back in)
3. You should now see the **Admin** link in the navigation
4. Click on **Admin** to access the admin panel

## Step 3: Approve Other Users (Optional)

Once you're an admin, you can:
- Go to the **Admin Panel** → **Users** tab
- See all pending users
- Click **Approve** to approve any user
- Click **Reject** to remove a user

## Alternative: Direct SQL Query

If you prefer using SQL, you can also run this in Supabase SQL Editor:

```sql
-- Replace 'your-email@example.com' with your actual email
UPDATE profiles
SET is_admin = true, is_approved = true
WHERE email = 'your-email@example.com';
```

## Troubleshooting

**Can't find your profile?**
- Make sure you've completed the signup process
- Check the `auth.users` table to find your user ID
- Then check the `profiles` table for a matching ID

**Still can't access admin panel?**
- Make sure you've saved the changes in Supabase
- Try logging out and logging back in
- Clear your browser cache
- Check that `is_admin` is set to `true` (not just `is_approved`)

**Need to approve multiple users?**
- Once you're an admin, you can approve users through the admin panel
- No need to manually edit each user in Supabase

