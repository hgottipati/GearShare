# Notifications Feature Setup

This document explains how to set up the notifications feature for the gear marketplace.

## Features

The notification system includes:

1. **Message Notifications** - Users get notified when someone sends them a message
2. **New Listing Notifications** - Users get notified when new listings are added to the marketplace
3. **Favorite Sold Notifications** - Users get notified when a listing they favorited is marked as sold
4. **Notification Settings** - Users can control which notifications they receive
5. **Favorites System** - Users can favorite listings to track items they're interested in

## Database Migration

To enable notifications, you need to run the database migration:

### Steps:

1. Go to your Supabase Dashboard
2. Navigate to **SQL Editor**
3. Click **New Query**
4. Copy and paste the contents of `supabase/migration-add-notifications.sql`
5. Click **Run** (or press Cmd/Ctrl + Enter)
6. Verify the migration succeeded - you should see "Success. No rows returned"

### What the Migration Creates:

- **favorites** table - Stores user's favorited listings
- **notification_settings** table - Stores user notification preferences
- **notifications** table - Stores all notifications
- **Database triggers** - Automatically create notifications when:
  - A new message is sent
  - A new listing is created
  - A favorited listing is marked as sold
- **RLS policies** - Ensures users can only see their own data

## User Features

### Viewing Notifications

- Click the **Notifications** bell icon in the navbar
- View all notifications on the `/notifications` page
- Click "View →" to navigate to the related item
- Mark individual notifications as read
- Mark all notifications as read at once

### Notification Settings

- Go to **Profile** page
- Scroll to **Notification Settings** section
- Toggle notifications on/off for:
  - New Messages
  - New Listings
  - Favorite Listings Sold
- Click **Save Notification Settings** to apply changes

### Favoriting Listings

- View any listing detail page
- Click the **Favorite** button (heart icon)
- Favorited listings will show a filled heart icon
- You'll be notified if a favorited listing is marked as sold (if enabled in settings)

## How It Works

### Automatic Notifications

The system uses database triggers to automatically create notifications:

1. **Message Notifications**: When a message is inserted, a trigger checks if the receiver has message notifications enabled and creates a notification.

2. **New Listing Notifications**: When a new active listing is created, all users with new listing notifications enabled receive a notification (except the seller).

3. **Favorite Sold Notifications**: When a listing's status changes to "Sold", all users who favorited that listing and have favorite sold notifications enabled receive a notification.

### Real-time Updates

- The navbar shows a badge with the count of unread notifications
- Notifications page updates in real-time when new notifications arrive
- Uses Supabase real-time subscriptions for instant updates

## Default Settings

When a user's profile is created, default notification settings are:
- ✅ New Messages: Enabled
- ✅ New Listings: Enabled
- ✅ Favorite Listings Sold: Enabled

Users can change these settings at any time from their profile page.

## Troubleshooting

### Notifications Not Appearing

1. Check that the migration has been run successfully
2. Verify that notification settings exist for the user (they should be created automatically)
3. Check that the user has the appropriate notification type enabled in their settings
4. Verify RLS policies are correctly set up

### Triggers Not Firing

1. Check Supabase logs for any trigger errors
2. Verify that the trigger functions exist in the database
3. Ensure the triggers are enabled (they should be by default)

### Real-time Notifications Not Updating

1. Check browser console for any WebSocket connection errors
2. Verify Supabase real-time is enabled for your project
3. Check that the user is authenticated

## Future Enhancements

Potential improvements:
- Email notifications (in addition to in-app notifications)
- Push notifications for mobile
- Notification grouping
- Notification history/archiving
- Custom notification preferences per category
