'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase-client'
import toast from 'react-hot-toast'

interface MessageSellerProps {
  listingId: string
  receiverId: string
  onSent: () => void
}

export default function MessageSeller({
  listingId,
  receiverId,
  onSent,
}: MessageSellerProps) {
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim()) return

    setLoading(true)

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      toast.error('Please log in to send a message')
      setLoading(false)
      return
    }

    const { data: inserted, error } = await supabase.from('messages').insert({
      listing_id: listingId,
      sender_id: user.id,
      receiver_id: receiverId,
      message: message.trim(),
    }).select('id').single()

    if (error) {
      toast.error('Error sending message: ' + error.message)
    } else {
      setMessage('')
      toast.success('Message sent!')
      
      // Send email notification (non-blocking, server-side via API route)
      if (inserted?.id) {
        fetch('/api/marketplace-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type: 'message', messageId: inserted.id }),
        })
          .then(async (res) => {
            if (!res.ok) {
              const error = await res.json().catch(() => ({ error: 'Unknown error' }))
              console.error('Email notification failed:', error)
            }
          })
          .catch((err) => {
            console.error('Email notification error:', err)
          })
      }
      
      onSent()
    }

    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Your Message
        </label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message here..."
          rows={4}
          required
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
        />
      </div>
      <div className="flex gap-3">
        <button
          type="submit"
          disabled={loading || !message.trim()}
          className="px-6 py-2.5 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
        >
          {loading ? 'Sending...' : 'Send Message'}
        </button>
      </div>
    </form>
  )
}

