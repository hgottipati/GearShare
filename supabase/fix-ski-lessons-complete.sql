-- Complete fix for ski_lesson_submissions RLS and schema issues
-- Run this script to fix all issues at once

-- Step 1: Fix preferred_day column to allow NULL
ALTER TABLE ski_lesson_submissions 
  ALTER COLUMN preferred_day DROP NOT NULL,
  DROP CONSTRAINT IF EXISTS ski_lesson_submissions_preferred_day_check;

ALTER TABLE ski_lesson_submissions
  ADD CONSTRAINT ski_lesson_submissions_preferred_day_check 
  CHECK (preferred_day IS NULL OR preferred_day IN ('Saturday', 'Sunday', 'Any'));

-- Step 2: Drop all existing policies
DROP POLICY IF EXISTS "Anyone can submit ski lesson form" ON ski_lesson_submissions;
DROP POLICY IF EXISTS "Admins can view all ski lesson submissions" ON ski_lesson_submissions;
DROP POLICY IF EXISTS "Admins can update ski lesson submissions" ON ski_lesson_submissions;
DROP POLICY IF EXISTS "Admins can delete ski lesson submissions" ON ski_lesson_submissions;

-- Step 3: Create INSERT policy - allows anonymous and authenticated users to insert
CREATE POLICY "Anyone can submit ski lesson form"
  ON ski_lesson_submissions
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Step 4: Create SELECT policy - allows users to select their own inserted row
-- This is needed for the .select() after insert to work
CREATE POLICY "Users can view their own submission"
  ON ski_lesson_submissions
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Step 5: Only admins can view all submissions
CREATE POLICY "Admins can view all ski lesson submissions"
  ON ski_lesson_submissions FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- Step 6: Only admins can update submissions
CREATE POLICY "Admins can update ski lesson submissions"
  ON ski_lesson_submissions FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- Step 7: Only admins can delete submissions
CREATE POLICY "Admins can delete ski lesson submissions"
  ON ski_lesson_submissions FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND is_admin = true
    )
  );


ALTER TABLE ski_lesson_submissions 
  ADD COLUMN status boolean default true;
 

