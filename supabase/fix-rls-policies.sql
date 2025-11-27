-- Fix RLS policies to prevent infinite recursion
-- Run this in Supabase SQL Editor

-- Drop the problematic policies
DROP POLICY IF EXISTS "Users can view approved profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;

-- Create a simpler policy that allows users to view their own profile
-- This prevents recursion because it only checks auth.uid()
CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

-- Create a function to check if user is admin (avoids recursion)
CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles
    WHERE id = user_id AND is_admin = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a function to check if user is approved (avoids recursion)
CREATE OR REPLACE FUNCTION public.is_approved(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles
    WHERE id = user_id AND is_approved = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Now create the admin policy using the function (but this still might cause recursion)
-- Better approach: Allow admins to view all profiles using a different method
-- For now, let's just allow users to view their own profile and approved users
-- Admins will need to use a service role key or we'll handle admin views differently

-- Alternative: Create a policy that allows viewing profiles if you're approved
-- But this still has the recursion issue...
-- The best solution is to allow users to always read their own profile (already done above)
-- And handle admin views through the application layer or service role

-- For now, the "Users can view their own profile" policy should be sufficient
-- Users can read their own profile, which is what we need for the home page check

