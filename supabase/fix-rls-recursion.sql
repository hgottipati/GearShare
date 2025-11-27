-- Fix infinite recursion in profiles RLS policies
-- Run this in Supabase SQL Editor

-- Drop the problematic admin policy that causes recursion
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;

-- The existing "Users can view approved profiles" policy should work:
-- USING (is_approved = true OR auth.uid() = id)
-- This allows users to read their own profile (auth.uid() = id) without recursion

-- Verify the policy exists and is correct
-- If it doesn't exist, create it:
DROP POLICY IF EXISTS "Users can view approved profiles" ON profiles;
CREATE POLICY "Users can view approved profiles"
  ON profiles FOR SELECT
  USING (is_approved = true OR auth.uid() = id);

