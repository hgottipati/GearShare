// Email notification utilities
// This file provides functions to send emails via Supabase Edge Functions or external service

import { createClient } from '@/lib/supabase-client'

interface EmailData {
  to: string
  subject: string
  html: string
  text?: string
}

/**
 * Send email notification
 * You can implement this using:
 * 1. Supabase Edge Functions (recommended)
 * 2. Resend API
 * 3. SendGrid
 * 4. Nodemailer with SMTP
 */
export async function sendEmailNotification(data: EmailData): Promise<boolean> {
  try {
    // Option 1: Supabase Edge Function
    // Uncomment and configure your edge function URL
    /*
    const supabase = createClient()
    const { error } = await supabase.functions.invoke('send-email', {
      body: data,
    })
    if (error) throw error
    */

    // Option 2: Direct API call to your email service
    // Example with Resend (you'll need to install @resend/node)
    /*
    const response = await fetch('/api/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!response.ok) throw new Error('Failed to send email')
    */

    console.log('Email notification (mock):', data)
    return true
  } catch (error) {
    console.error('Error sending email:', error)
    return false
  }
}

export async function notifyNewMessage(
  receiverEmail: string,
  senderName: string,
  listingTitle: string,
  message: string
) {
  return sendEmailNotification({
    to: receiverEmail,
    subject: `New message about: ${listingTitle}`,
    html: `
      <h2>You have a new message!</h2>
      <p><strong>From:</strong> ${senderName}</p>
      <p><strong>Listing:</strong> ${listingTitle}</p>
      <p><strong>Message:</strong></p>
      <p>${message}</p>
      <p><a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/profile">View message</a></p>
    `,
    text: `New message from ${senderName} about ${listingTitle}: ${message}`,
  })
}

export async function notifyListingInterest(
  sellerEmail: string,
  buyerName: string,
  listingTitle: string
) {
  return sendEmailNotification({
    to: sellerEmail,
    subject: `Someone is interested in: ${listingTitle}`,
    html: `
      <h2>New interest in your listing!</h2>
      <p><strong>Buyer:</strong> ${buyerName}</p>
      <p><strong>Listing:</strong> ${listingTitle}</p>
      <p><a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/listings">View listing</a></p>
    `,
    text: `${buyerName} is interested in your listing: ${listingTitle}`,
  })
}

export async function notifyUserApproval(userEmail: string, userName: string) {
  return sendEmailNotification({
    to: userEmail,
    subject: 'Your account has been approved!',
    html: `
      <h2>Welcome to ShareMyGear!</h2>
      <p>Hi ${userName},</p>
      <p>Your account has been approved. You can now create listings and start trading!</p>
      <p><a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}">Get started</a></p>
    `,
    text: `Hi ${userName}, your account has been approved!`,
  })
}

export async function notifySkiLessonSubmission(
  instructorEmail: string,
  parentEmail: string,
  parentName: string,
  participantName: string,
  submission: {
    age: number
    phone_number: string
    ski_level: string
    lesson_type: string
    questions_preferences: string | null
    gear_status: string
  }
) {
  const lessonTypeLabels: Record<string, string> = {
    '4-week-private': '4-Week Private ($640)',
    '4-week-group': '4-Week Small Group ($440/ea)',
    'one-time-private': 'One-Time Private ($160)',
    'one-time-group': 'One-Time Small Group ($120/ea)',
  }

  // Email to instructor
  await sendEmailNotification({
    to: instructorEmail,
    subject: `New Ski Lesson Enrollment: ${participantName}`,
    html: `
      <h2>New Ski Lesson Enrollment Submission</h2>
      <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="margin-top: 0;">Parent/Guardian Information</h3>
        <p><strong>Name:</strong> ${parentName}</p>
        <p><strong>Email:</strong> ${parentEmail}</p>
        <p><strong>Phone:</strong> ${submission.phone_number}</p>
      </div>
      <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="margin-top: 0;">Participant Information</h3>
        <p><strong>Name:</strong> ${participantName}</p>
        <p><strong>Age:</strong> ${submission.age}</p>
        <p><strong>Ski Level:</strong> ${submission.ski_level}</p>
      </div>
      <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="margin-top: 0;">Lesson Preferences</h3>
        <p><strong>Lesson Type:</strong> ${lessonTypeLabels[submission.lesson_type] || submission.lesson_type}</p>
        <p><strong>Gear Status:</strong> ${submission.gear_status === 'need-help' ? 'Needs Help Finding Gear' : 'Gear Ready'}</p>
        ${submission.questions_preferences ? `<p><strong>Questions/Preferences:</strong><br>${submission.questions_preferences}</p>` : ''}
      </div>
      <p style="margin-top: 20px;">
        <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/admin/ski-submissions" style="background-color: #2563eb; color: white; padding: 10px 20px; text-decoration: none; border-radius: 6px; display: inline-block;">
          View All Submissions
        </a>
      </p>
    `,
    text: `New ski lesson enrollment from ${parentName} for ${participantName} (Age ${submission.age}, ${submission.ski_level} level). Lesson: ${lessonTypeLabels[submission.lesson_type] || submission.lesson_type}`,
  })

  // Confirmation email to parent
  await sendEmailNotification({
    to: parentEmail,
    subject: 'Ski Lesson Enrollment Received - Thank You!',
    html: `
      <h2>Thank You for Your Interest! 🎿</h2>
      <p>Hi ${parentName},</p>
      <p>Thank you for submitting the enrollment form for <strong>${participantName}</strong>. I've received your information and will review it shortly.</p>
      <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
        <h3 style="margin-top: 0;">Your Submission Summary:</h3>
        <ul>
          <li><strong>Participant:</strong> ${participantName} (Age ${submission.age})</li>
          <li><strong>Ski Level:</strong> ${submission.ski_level}</li>
          <li><strong>Lesson Type:</strong> ${lessonTypeLabels[submission.lesson_type] || submission.lesson_type}</li>
          <li><strong>Gear Status:</strong> ${submission.gear_status === 'need-help' ? 'Needs Help' : 'Ready'}</li>
        </ul>
      </div>
      <p>I'll be in touch soon to discuss lesson options, scheduling, and answer any questions you may have.</p>
      <p>If you have any urgent questions, feel free to reach out directly.</p>
      <p>Best regards,<br>Your Ski Instructor</p>
    `,
    text: `Thank you ${parentName} for submitting the enrollment form for ${participantName}. I've received your information and will be in touch soon.`,
  })
}

