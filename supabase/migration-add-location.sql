-- Migration: Add location field to listings table
-- Run this in Supabase SQL Editor

-- Add location column
ALTER TABLE listings
ADD COLUMN IF NOT EXISTS location TEXT;

-- Create index for location filtering
CREATE INDEX IF NOT EXISTS idx_listings_location ON listings(location);

