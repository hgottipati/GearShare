-- Migration: Add rent field to listings table
-- Run this in Supabase SQL Editor

-- Add rent_available and rent_price columns
ALTER TABLE listings
ADD COLUMN IF NOT EXISTS rent_available BOOLEAN DEFAULT false;

ALTER TABLE listings
ADD COLUMN IF NOT EXISTS rent_price DECIMAL(10, 2);

