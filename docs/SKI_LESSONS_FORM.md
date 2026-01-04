# Ski Lessons Enrollment Form - Integration Guide

## Overview

A complete ski lesson enrollment form has been integrated into your GearShare website. Parents can submit enrollment forms directly through your website, and you can view and manage all submissions through an admin panel.

## What Was Created

### 1. Database Table
- **File**: `supabase/migration-add-ski-lessons.sql`
- **Table**: `ski_lesson_submissions`
- Stores all form submissions with proper RLS (Row Level Security) policies
- Only admins can view submissions; anyone can submit (public form)

### 2. Form Page
- **File**: `app/ski-lessons/page.tsx`
- **URL**: `/ski-lessons`
- Public-facing form that matches your Google Form structure
- Includes all fields: email, parent name, participant info, lesson preferences, gear status
- Form validation and success confirmation

### 3. Admin Dashboard
- **File**: `app/admin/ski-submissions/page.tsx`
- **URL**: `/admin/ski-submissions`
- View all submissions in a clean, organized interface
- Filter by submissions that need gear help
- Export submissions to CSV
- Delete submissions

### 4. Email Notifications
- **File**: `lib/email-notifications.ts` (updated)
- Sends two emails when a form is submitted:
  1. **To you** (`impavider@gmail.com`): Detailed submission information
  2. **To parent**: Confirmation email with submission summary

### 5. Form Validation
- **File**: `components/FormValidation.tsx` (updated)
- Comprehensive validation for all form fields
- Age validation (6-15 years)
- Email and phone number validation
- Required field checks

### 6. Database Types
- **File**: `lib/database.types.ts` (updated)
- TypeScript types for the new table

## Setup Instructions

### Step 1: Run Database Migration

1. Go to your Supabase dashboard
2. Navigate to SQL Editor
3. Copy and paste the contents of `supabase/migration-add-ski-lessons.sql`
4. Run the migration

### Step 2: Configure Email Notifications

The email notification system is currently set up but uses a mock function. To enable real emails:

1. **Option A: Supabase Edge Functions** (Recommended)
   - Create a Supabase Edge Function for sending emails
   - Update `lib/email-notifications.ts` to call your edge function

2. **Option B: Resend API**
   - Install: `npm install @resend/node`
   - Create an API route at `app/api/send-email/route.ts`
   - Update `lib/email-notifications.ts` to use the API route

3. **Option C: SendGrid/Nodemailer**
   - Set up your preferred email service
   - Update the `sendEmailNotification` function

### Step 3: Share the Form Link

Share this URL with parents:
```
https://yourdomain.com/ski-lessons
```

Or if you want to add it to your landing page/navbar, you can add a link to `/ski-lessons`.

## Features

### Form Features
- ✅ All fields from your Google Form
- ✅ Real-time validation
- ✅ Success confirmation page
- ✅ Mobile-responsive design
- ✅ Matches your website's styling

### Admin Features
- ✅ View all submissions
- ✅ Filter by gear status (need help vs ready)
- ✅ Export to CSV
- ✅ Delete submissions
- ✅ See submission timestamps
- ✅ Access from main admin panel

### Email Features
- ✅ Automatic email to you when form is submitted
- ✅ Confirmation email to parent
- ✅ Detailed submission information in emails

## Form Fields

1. **Email** (required)
2. **Parent/Guardian Name** (required)
3. **Participant's Name** (required)
4. **Age** (required, 6-15)
5. **Phone Number** (required)
6. **Ski Level** (required: Beginner, Intermediate, Advanced)
7. **Lesson Type** (required):
   - 4-Week Private ($640)
   - 4-Week Small Group ($440/ea)
   - One-Time Private ($180)
   - One-Time Small Group ($120/ea)
8. **Preferred Day** (required: Saturday, Sunday, Any)
9. **Questions/Preferences** (optional)
10. **Gear Status** (required: Ready or Need Help)

## Accessing Submissions

1. Log in as admin
2. Go to `/admin` or click "View Ski Lesson Submissions" button
3. Or go directly to `/admin/ski-submissions`

## CSV Export

The CSV export includes:
- Email
- Parent Name
- Participant Name
- Age
- Phone
- Ski Level
- Lesson Type
- Preferred Day
- Gear Status
- Questions/Preferences
- Submission Date/Time

## Customization

### Change Email Address
In `app/ski-lessons/page.tsx`, line ~95, change:
```typescript
'impavider@gmail.com', // Your email
```

### Update Pricing/Lesson Types
Edit the form options in `app/ski-lessons/page.tsx` and update the `lessonTypeLabels` in:
- `app/ski-lessons/page.tsx` (form display)
- `app/admin/ski-submissions/page.tsx` (admin display)
- `lib/email-notifications.ts` (email display)

### Styling
All components use Tailwind CSS and match your existing design system. You can customize colors, spacing, etc. in the component files.

## Security

- ✅ Row Level Security (RLS) enabled
- ✅ Only admins can view submissions
- ✅ Public can only submit (not view)
- ✅ Form validation prevents invalid data
- ✅ SQL injection protection via Supabase

## Next Steps

1. Run the database migration
2. Test the form by submitting a test entry
3. Configure email notifications (if not already done)
4. Share the form link with parents
5. Monitor submissions through the admin panel

## Troubleshooting

### Form not submitting
- Check browser console for errors
- Verify database migration ran successfully
- Check Supabase RLS policies

### Emails not sending
- Verify email notification function is configured
- Check email service API keys/credentials
- Check Supabase Edge Function logs (if using)

### Can't view submissions
- Verify you're logged in as admin
- Check `is_admin` flag in your profile
- Verify RLS policies are correct

## Support

If you encounter any issues, check:
1. Supabase dashboard logs
2. Browser console for errors
3. Network tab for failed requests

