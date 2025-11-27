-- Migration: Add status field to listings table
-- Run this in Supabase SQL Editor

-- Add status column
ALTER TABLE listings
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'Available' CHECK (status IN ('Available', 'Sold', 'Traded'));

-- Update existing listings to have 'Available' status
UPDATE listings
SET status = 'Available'
WHERE status IS NULL;

-- Create index for status filtering
CREATE INDEX IF NOT EXISTS idx_listings_status ON listings(status);

