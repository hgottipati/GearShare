'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase-client'
import toast from 'react-hot-toast'
import { notifyNewMessage } from '@/lib/email-notifications'

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

    // Get receiver and listing info for email
    const [receiverData, listingData] = await Promise.all([
      supabase.from('profiles').select('email, name').eq('id', receiverId).single(),
      supabase.from('listings').select('title').eq('id', listingId).single(),
    ])

    const { error } = await supabase.from('messages').insert({
      listing_id: listingId,
      sender_id: user.id,
      receiver_id: receiverId,
      message: message.trim(),
    })

    if (error) {
      toast.error('Error sending message: ' + error.message)
    } else {
      setMessage('')
      toast.success('Message sent!')
      
      // Send email notification (non-blocking)
      if (receiverData.data && listingData.data) {
        const senderProfile = await supabase
          .from('profiles')
          .select('name')
          .eq('id', user.id)
          .single()
        
        notifyNewMessage(
          receiverData.data.email,
          senderProfile.data?.name || 'Someone',
          listingData.data.title,
          message.trim()
        ).catch(console.error)
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

