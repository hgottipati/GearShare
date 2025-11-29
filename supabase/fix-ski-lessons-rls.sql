-- Fix RLS policies for ski_lesson_submissions table
-- This ensures public form submissions work correctly

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Anyone can submit ski lesson form" ON ski_lesson_submissions;
DROP POLICY IF EXISTS "Admins can view all ski lesson submissions" ON ski_lesson_submissions;
DROP POLICY IF EXISTS "Admins can update ski lesson submissions" ON ski_lesson_submissions;
DROP POLICY IF EXISTS "Admins can delete ski lesson submissions" ON ski_lesson_submissions;

-- Recreate INSERT policy - allows anyone (including anonymous users) to insert
-- Using FOR ALL to apply to all roles (anon, authenticated, service_role)
CREATE POLICY "Anyone can submit ski lesson form"
  ON ski_lesson_submissions
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Only admins can view submissions
CREATE POLICY "Admins can view all ski lesson submissions"
  ON ski_lesson_submissions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- Only admins can update submissions
CREATE POLICY "Admins can update ski lesson submissions"
  ON ski_lesson_submissions FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- Only admins can delete submissions
CREATE POLICY "Admins can delete ski lesson submissions"
  ON ski_lesson_submissions FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND is_admin = true
    )
  );

