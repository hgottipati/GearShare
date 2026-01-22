import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { createClient as createAuthedServerClient } from '@/lib/supabase-server'
import { createClient as createServiceClient } from '@supabase/supabase-js'

type EmailRequest =
  | { type: 'message'; messageId: string }
  | { type: 'new_listing'; listingId: string }
  | { type: 'favorite_sold'; listingId: string }

function getRequiredEnv(name: string): string {
  const v = process.env[name]
  if (!v) throw new Error(`Missing required env var: ${name}`)
  return v
}

function getAppUrl(): string {
  return process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
}

async function getAuthedUserId(): Promise<string | null> {
  const supabase = await createAuthedServerClient()
  const { data } = await supabase.auth.getUser()
  return data.user?.id ?? null
}

function getServiceSupabase() {
  const url = getRequiredEnv('NEXT_PUBLIC_SUPABASE_URL')
  const serviceKey = getRequiredEnv('SUPABASE_SERVICE_ROLE_KEY')
  return createServiceClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
}

function getResend() {
  const apiKey = getRequiredEnv('RESEND_API_KEY')
  return new Resend(apiKey)
}

async function sendEmail(to: string, subject: string, html: string, text?: string) {
  const from = getRequiredEnv('RESEND_FROM_EMAIL')
  const resend = getResend()
  await resend.emails.send({
    from,
    to,
    subject,
    html,
    text,
  })
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as EmailRequest
    const userId = await getAuthedUserId()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabase = getServiceSupabase()

    if (body.type === 'message') {
      const { data: msg, error: msgErr } = await supabase
        .from('messages')
        .select('id, listing_id, sender_id, receiver_id, message')
        .eq('id', body.messageId)
        .single()
      if (msgErr || !msg) throw msgErr || new Error('Message not found')
      if (msg.sender_id !== userId) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
      }

      const [{ data: receiver }, { data: receiverSettings }, { data: listing }, { data: sender }] =
        await Promise.all([
          supabase.from('profiles').select('email, name, is_approved').eq('id', msg.receiver_id).single(),
          supabase
            .from('notification_settings')
            .select('notify_messages')
            .eq('user_id', msg.receiver_id)
            .maybeSingle(),
          supabase.from('listings').select('title').eq('id', msg.listing_id).single(),
          supabase.from('profiles').select('name').eq('id', msg.sender_id).single(),
        ])

      const notifyMessages = receiverSettings?.notify_messages ?? true
      if (!notifyMessages) return NextResponse.json({ ok: true, skipped: true })
      if (!receiver?.email) throw new Error('Receiver email not found')
      if (receiver.is_approved === false) return NextResponse.json({ ok: true, skipped: true })

      const senderName = sender?.name || 'Someone'
      const listingTitle = listing?.title || 'a listing'
      const subject = `New message about: ${listingTitle}`
      const link = `${getAppUrl()}/messages`
      const html = `
        <h2>You have a new message!</h2>
        <p><strong>From:</strong> ${senderName}</p>
        <p><strong>Listing:</strong> ${listingTitle}</p>
        <p><strong>Message:</strong></p>
        <p>${escapeHtml(msg.message)}</p>
        <p><a href="${link}">View messages</a></p>
      `
      const text = `New message from ${senderName} about ${listingTitle}: ${msg.message}\n\nView: ${link}`
      await sendEmail(receiver.email, subject, html, text)
      return NextResponse.json({ ok: true })
    }

    if (body.type === 'new_listing') {
      const { data: listing, error: listingErr } = await supabase
        .from('listings')
        .select('id, title, user_id, is_active')
        .eq('id', body.listingId)
        .single()
      if (listingErr || !listing) throw listingErr || new Error('Listing not found')
      if (listing.user_id !== userId) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
      }
      if (!listing.is_active) return NextResponse.json({ ok: true, skipped: true })

      const { data: recipients, error: recErr } = await supabase
        .from('notification_settings')
        .select('user_id, notify_new_listings, profiles:profiles(email, is_approved)')
        .eq('notify_new_listings', true)
      if (recErr) throw recErr

      const emails =
        (recipients || [])
          .filter((r: any) => r.user_id !== userId)
          .filter((r: any) => r.profiles?.is_approved === true)
          .map((r: any) => r.profiles?.email)
          .filter(Boolean) as string[]

      if (emails.length === 0) return NextResponse.json({ ok: true, skipped: true })

      const subject = `New listing: ${listing.title}`
      const link = `${getAppUrl()}/listings/${listing.id}`
      const html = `
        <h2>New listing available</h2>
        <p><strong>${escapeHtml(listing.title)}</strong> was just added to the marketplace.</p>
        <p><a href="${link}">View listing</a></p>
      `
      const text = `New listing: ${listing.title}\n\nView: ${link}`

      // send sequentially to avoid hammering
      for (const email of emails) {
        await sendEmail(email, subject, html, text)
      }

      return NextResponse.json({ ok: true, sent: emails.length })
    }

    if (body.type === 'favorite_sold') {
      const { data: listing, error: listingErr } = await supabase
        .from('listings')
        .select('id, title, user_id, status')
        .eq('id', body.listingId)
        .single()
      if (listingErr || !listing) throw listingErr || new Error('Listing not found')
      if (listing.user_id !== userId) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
      }
      if (listing.status !== 'Sold') return NextResponse.json({ ok: true, skipped: true })

      const { data: favs, error: favErr } = await supabase
        .from('favorites')
        .select('user_id')
        .eq('listing_id', listing.id)
      if (favErr) throw favErr

      const userIds = Array.from(new Set((favs || []).map((f) => f.user_id))).filter((id) => id !== userId)
      if (userIds.length === 0) return NextResponse.json({ ok: true, skipped: true })

      const { data: settings, error: settingsErr } = await supabase
        .from('notification_settings')
        .select('user_id, notify_favorite_sold, profiles:profiles(email, is_approved)')
        .in('user_id', userIds)
      if (settingsErr) throw settingsErr

      const emails =
        (settings || [])
          .filter((s: any) => (s.notify_favorite_sold ?? true) === true)
          .filter((s: any) => s.profiles?.is_approved === true)
          .map((s: any) => s.profiles?.email)
          .filter(Boolean) as string[]

      if (emails.length === 0) return NextResponse.json({ ok: true, skipped: true })

      const subject = `Sold: ${listing.title}`
      const link = `${getAppUrl()}/listings/${listing.id}`
      const html = `
        <h2>A listing you favorited was sold</h2>
        <p><strong>${escapeHtml(listing.title)}</strong> was marked as sold.</p>
        <p><a href="${link}">View listing</a></p>
      `
      const text = `A listing you favorited was sold: ${listing.title}\n\nView: ${link}`

      for (const email of emails) {
        await sendEmail(email, subject, html, text)
      }

      return NextResponse.json({ ok: true, sent: emails.length })
    }

    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  } catch (err: any) {
    const message = err?.message || 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

function escapeHtml(input: string) {
  return input
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
}

