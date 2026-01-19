-- Migration: Add notifications, notification_settings, and favorites tables
-- Run this in Supabase SQL Editor

-- Favorites table (for tracking favorited listings)
CREATE TABLE IF NOT EXISTS favorites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  listing_id UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  UNIQUE(user_id, listing_id)
);

-- Notification settings table
CREATE TABLE IF NOT EXISTS notification_settings (
  user_id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  notify_messages BOOLEAN DEFAULT true,
  notify_new_listings BOOLEAN DEFAULT true,
  notify_favorite_sold BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('message', 'new_listing', 'favorite_sold')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  link TEXT,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_listing_id ON favorites(listing_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(user_id, read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at DESC);

-- Enable RLS
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- RLS Policies for favorites
CREATE POLICY "Users can view their own favorites"
  ON favorites FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own favorites"
  ON favorites FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own favorites"
  ON favorites FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for notification_settings
CREATE POLICY "Users can view their own notification settings"
  ON notification_settings FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notification settings"
  ON notification_settings FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own notification settings"
  ON notification_settings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for notifications
CREATE POLICY "Users can view their own notifications"
  ON notifications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "System can create notifications for users"
  ON notifications FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can update their own notifications"
  ON notifications FOR UPDATE
  USING (auth.uid() = user_id);

-- Function to automatically create notification settings on profile creation
CREATE OR REPLACE FUNCTION create_notification_settings()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO notification_settings (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create notification settings when profile is created
DROP TRIGGER IF EXISTS on_profile_created_notification_settings ON profiles;
CREATE TRIGGER on_profile_created_notification_settings
  AFTER INSERT ON profiles
  FOR EACH ROW EXECUTE FUNCTION create_notification_settings();

-- Function to create notification when message is sent
CREATE OR REPLACE FUNCTION notify_new_message()
RETURNS TRIGGER AS $$
DECLARE
  receiver_settings notification_settings%ROWTYPE;
  listing_title TEXT;
BEGIN
  -- Get receiver's notification settings
  SELECT * INTO receiver_settings
  FROM notification_settings
  WHERE user_id = NEW.receiver_id;

  -- Get listing title
  SELECT title INTO listing_title
  FROM listings
  WHERE id = NEW.listing_id;

  -- Only create notification if user has message notifications enabled (default true)
  IF receiver_settings.notify_messages IS NULL OR receiver_settings.notify_messages = true THEN
    INSERT INTO notifications (user_id, type, title, message, link)
    VALUES (
      NEW.receiver_id,
      'message',
      'New Message',
      COALESCE('You have a new message about: ' || listing_title, 'You have a new message'),
      '/messages'
    );
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new messages
DROP TRIGGER IF EXISTS on_message_created_notify ON messages;
CREATE TRIGGER on_message_created_notify
  AFTER INSERT ON messages
  FOR EACH ROW EXECUTE FUNCTION notify_new_message();

-- Function to create notifications for new listings
CREATE OR REPLACE FUNCTION notify_new_listing()
RETURNS TRIGGER AS $$
BEGIN
  -- Notify all users who have new listing notifications enabled
  INSERT INTO notifications (user_id, type, title, message, link)
  SELECT 
    ns.user_id,
    'new_listing',
    'New Listing Available',
    'A new listing has been added: ' || NEW.title,
    '/listings/' || NEW.id
  FROM notification_settings ns
  WHERE ns.notify_new_listings = true
    AND ns.user_id != NEW.user_id  -- Don't notify the seller
    AND EXISTS (
      SELECT 1 FROM profiles WHERE id = ns.user_id AND is_approved = true
    );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new listings
DROP TRIGGER IF EXISTS on_listing_created_notify ON listings;
CREATE TRIGGER on_listing_created_notify
  AFTER INSERT ON listings
  FOR EACH ROW 
  WHEN (NEW.is_active = true)
  EXECUTE FUNCTION notify_new_listing();

-- Function to create notifications when favorited listing is sold
CREATE OR REPLACE FUNCTION notify_favorite_sold()
RETURNS TRIGGER AS $$
BEGIN
  -- Only trigger if status changed to Sold
  IF NEW.status = 'Sold' AND (OLD.status IS NULL OR OLD.status != 'Sold') THEN
    -- Notify all users who favorited this listing and have notifications enabled
    INSERT INTO notifications (user_id, type, title, message, link)
    SELECT 
      f.user_id,
      'favorite_sold',
      'Listing You Favorited Was Sold',
      'The listing "' || NEW.title || '" you favorited has been marked as sold',
      '/listings/' || NEW.id
    FROM favorites f
    JOIN notification_settings ns ON f.user_id = ns.user_id
    WHERE f.listing_id = NEW.id
      AND ns.notify_favorite_sold = true
      AND f.user_id != NEW.user_id;  -- Don't notify the seller
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for listing status changes
DROP TRIGGER IF EXISTS on_listing_status_changed_notify ON listings;
CREATE TRIGGER on_listing_status_changed_notify
  AFTER UPDATE OF status ON listings
  FOR EACH ROW EXECUTE FUNCTION notify_favorite_sold();

-- Update existing profiles to have notification settings
INSERT INTO notification_settings (user_id)
SELECT id FROM profiles
ON CONFLICT (user_id) DO NOTHING;
