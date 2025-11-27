-- Storage policies for listing-images bucket
-- Run this in Supabase SQL Editor

-- First, make sure the bucket exists and is public
-- You can create it in the Storage UI if it doesn't exist

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Authenticated users can upload listing images" ON storage.objects;
DROP POLICY IF EXISTS "Public can view listing images" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own listing images" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own listing images" ON storage.objects;

-- Policy: Allow authenticated approved users to upload listing images
-- We check if the user is approved, and optionally verify listing ownership
CREATE POLICY "Authenticated users can upload listing images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'listing-images' AND
  EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND is_approved = true
  )
);

-- Policy: Allow public read access to listing images
CREATE POLICY "Public can view listing images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'listing-images');

-- Policy: Allow users to update their own listing images
CREATE POLICY "Users can update their own listing images"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'listing-images' AND
  EXISTS (
    SELECT 1 FROM listings
    WHERE id::text = (storage.foldername(name))[1]
    AND user_id = auth.uid()
  )
);

-- Policy: Allow users to delete their own listing images
CREATE POLICY "Users can delete their own listing images"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'listing-images' AND
  EXISTS (
    SELECT 1 FROM listings
    WHERE id::text = (storage.foldername(name))[1]
    AND user_id = auth.uid()
  )
);

