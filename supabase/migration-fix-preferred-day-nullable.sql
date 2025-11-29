-- Fix preferred_day column to allow NULL values
-- Since we removed the preferred_day question from the form

ALTER TABLE ski_lesson_submissions 
  ALTER COLUMN preferred_day DROP NOT NULL,
  DROP CONSTRAINT IF EXISTS ski_lesson_submissions_preferred_day_check;

-- Recreate the constraint to allow NULL or the valid values
ALTER TABLE ski_lesson_submissions
  ADD CONSTRAINT ski_lesson_submissions_preferred_day_check 
  CHECK (preferred_day IS NULL OR preferred_day IN ('Saturday', 'Sunday', 'Any'));

