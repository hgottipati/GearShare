-- Migration: Add ski_lesson_submissions table
-- This table stores enrollment submissions for ski lessons

CREATE TABLE IF NOT EXISTS ski_lesson_submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT NOT NULL,
  parent_name TEXT NOT NULL,
  participant_name TEXT NOT NULL,
  age INTEGER NOT NULL,
  phone_number TEXT NOT NULL,
  ski_level TEXT NOT NULL CHECK (ski_level IN ('Beginner', 'Intermediate', 'Advanced')),
  lesson_type TEXT NOT NULL CHECK (lesson_type IN ('4-week-private', '4-week-group', 'one-time-private', 'one-time-group')),
  preferred_day TEXT NOT NULL CHECK (preferred_day IN ('Saturday', 'Sunday', 'Any')),
  questions_preferences TEXT,
  gear_status TEXT NOT NULL CHECK (gear_status IN ('ready', 'need-help')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_ski_lesson_submissions_created_at ON ski_lesson_submissions(created_at);
CREATE INDEX IF NOT EXISTS idx_ski_lesson_submissions_email ON ski_lesson_submissions(email);

-- Trigger for updated_at
CREATE TRIGGER update_ski_lesson_submissions_updated_at BEFORE UPDATE ON ski_lesson_submissions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) Policies
ALTER TABLE ski_lesson_submissions ENABLE ROW LEVEL SECURITY;

-- Anyone can insert (public form)
CREATE POLICY "Anyone can submit ski lesson form"
  ON ski_lesson_submissions FOR INSERT
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

