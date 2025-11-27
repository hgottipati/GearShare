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
      <h2>Welcome to GearShare!</h2>
      <p>Hi ${userName},</p>
      <p>Your account has been approved. You can now create listings and start trading!</p>
      <p><a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}">Get started</a></p>
    `,
    text: `Hi ${userName}, your account has been approved!`,
  })
}

