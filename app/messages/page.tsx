'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase-client'
import { useAuth } from '@/app/providers'
import Navbar from '@/components/Navbar'
import Link from 'next/link'
import toast from 'react-hot-toast'
import MessageSeller from '@/components/MessageSeller'

interface Message {
  id: string
  message: string
  created_at: string
  read: boolean
  sender_id: string
  receiver_id: string
  listing_id: string
  listings: { id: string; title: string }
  sender_profile: { name: string | null; email: string }
  receiver_profile: { name: string | null; email: string }
}

interface MessageQueryResult {
  id: string
  message: string
  created_at: string
  read: boolean
  sender_id: string
  receiver_id: string
  listing_id: string
  listings: { id: string; title: string }
}

function MessagesPageContent() {
  const { user } = useAuth()
  const router = useRouter()
  const supabase = createClient()
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [replyingTo, setReplyingTo] = useState<string | null>(null)

  useEffect(() => {
    if (user) {
      loadData()
    } else {
      router.push('/login')
    }
  }, [user])

  const loadData = async () => {
    if (!user) return

    // Get user profile for receiver_profile in sent messages
    const { data: profileData } = await supabase
      .from('profiles')
      .select('name, email')
      .eq('id', user.id)
      .single()

    // Load both received and sent messages
    const [receivedMessagesResult, sentMessagesResult] = await Promise.all([
      // Messages received by user (need sender profile)
      supabase
        .from('messages')
        .select(
          `
          id,
          message,
          created_at,
          read,
          sender_id,
          receiver_id,
          listing_id,
          listings(id, title)
        `
        )
        .eq('receiver_id', user.id)
        .order('created_at', { ascending: false }),
      // Messages sent by user (need receiver profile)
      supabase
        .from('messages')
        .select(
          `
          id,
          message,
          created_at,
          read,
          sender_id,
          receiver_id,
          listing_id,
          listings(id, title)
        `
        )
        .eq('sender_id', user.id)
        .order('created_at', { ascending: false }),
    ])

    // Get unique sender and receiver IDs to fetch profiles
    const senderIds = new Set<string>()
    const receiverIds = new Set<string>()
    
    receivedMessagesResult.data?.forEach((msg: MessageQueryResult) => senderIds.add(msg.sender_id))
    sentMessagesResult.data?.forEach((msg: MessageQueryResult) => receiverIds.add(msg.receiver_id))

    // Fetch all needed profiles
    const allProfileIds = Array.from(new Set([...senderIds, ...receiverIds]))
    const { data: profilesData } = await supabase
      .from('profiles')
      .select('id, name, email')
      .in('id', allProfileIds)

    const profilesMap = new Map(
      (profilesData || []).map((p: { id: string; name: string | null; email: string }) => [p.id, { name: p.name, email: p.email }])
    )

    // Combine and format messages
    const allMessages: Message[] = [
      ...(receivedMessagesResult.data || []).map((msg: MessageQueryResult) => {
        const senderProfile = profilesMap.get(msg.sender_id) || { name: null, email: '' }
        return {
          id: msg.id,
          message: msg.message,
          created_at: msg.created_at,
          read: msg.read,
          sender_id: msg.sender_id,
          receiver_id: msg.receiver_id,
          listing_id: msg.listing_id,
          listings: msg.listings,
          sender_profile: senderProfile,
          receiver_profile: { name: profileData?.name || null, email: profileData?.email || '' },
        }
      }),
      ...(sentMessagesResult.data || []).map((msg: MessageQueryResult) => {
        const receiverProfile = profilesMap.get(msg.receiver_id) || { name: null, email: '' }
        return {
          id: msg.id,
          message: msg.message,
          created_at: msg.created_at,
          read: true, // Sent messages are always "read"
          sender_id: msg.sender_id,
          receiver_id: msg.receiver_id,
          listing_id: msg.listing_id,
          listings: msg.listings,
          sender_profile: { name: profileData?.name || null, email: profileData?.email || '' },
          receiver_profile: receiverProfile,
        }
      }),
    ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

    setMessages(allMessages)
    setLoading(false)
  }

  useEffect(() => {
    if (!user) return

    // Set up real-time subscription for new messages
    const channel = supabase
      .channel('messages-page')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'messages',
          filter: `receiver_id=eq.${user.id}`,
        },
        (payload: { eventType: string }) => {
          // Reload messages when new ones arrive
          loadData()
          // Show notification for new messages
          if (payload.eventType === 'INSERT') {
            toast.success('You have a new message!', {
              icon: '💬',
              duration: 4000,
            })
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [user, supabase])

  const markAsRead = async (messageId: string) => {
    const { error } = await supabase
      .from('messages')
      .update({ read: true })
      .eq('id', messageId)

    if (!error) {
      loadData()
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pb-16 md:pb-8">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white rounded-lg shadow p-6 animate-pulse space-y-4">
            <div className="h-6 bg-gray-300 rounded w-1/3"></div>
            <div className="h-4 bg-gray-300 rounded w-1/2"></div>
            <div className="h-4 bg-gray-300 rounded w-1/4"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-16 md:pb-8">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Messages</h1>
        <p className="text-gray-600 mb-8">View and manage your conversations</p>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6">
            {messages.length === 0 ? (
              <p className="text-gray-600">No messages yet.</p>
            ) : (
              <div className="space-y-4">
                {messages.map((msg) => {
                  const isSent = msg.sender_id === user?.id
                  const otherPerson = isSent ? msg.receiver_profile : msg.sender_profile
                  
                  return (
                    <div
                      key={msg.id}
                      className={`p-5 border rounded-xl ${
                        !msg.read && !isSent
                          ? 'bg-blue-50 border-blue-200'
                          : isSent
                          ? 'bg-gray-50 border-gray-200'
                          : 'bg-white border-gray-200'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-semibold text-gray-900">
                              {isSent ? 'You' : otherPerson.name || otherPerson.email}
                            </p>
                            {isSent && (
                              <span className="text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded">
                                Sent
                              </span>
                            )}
                            {!isSent && !msg.read && (
                              <span className="text-xs bg-blue-600 text-white px-2 py-0.5 rounded">
                                New
                              </span>
                            )}
                          </div>
                          <Link
                            href={`/listings/${msg.listing_id}`}
                            className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
                          >
                            Re: {msg.listings.title}
                          </Link>
                        </div>
                        <span className="text-xs text-gray-500">
                          {new Date(msg.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-gray-700 mb-3 whitespace-pre-wrap">{msg.message}</p>
                      <div className="flex items-center gap-2 pt-3 border-t border-gray-200">
                        {!isSent && !msg.read && (
                          <button
                            onClick={() => markAsRead(msg.id)}
                            className="text-xs text-blue-600 hover:text-blue-800 px-3 py-1.5 rounded-md hover:bg-blue-100 font-medium"
                          >
                            Mark as read
                          </button>
                        )}
                        {!isSent && (
                          <button
                            onClick={() => setReplyingTo(replyingTo === msg.id ? null : msg.id)}
                            className="text-xs text-white bg-blue-600 hover:bg-blue-700 px-3 py-1.5 rounded-md font-medium"
                          >
                            {replyingTo === msg.id ? 'Cancel Reply' : 'Reply'}
                          </button>
                        )}
                        <Link
                          href={`/listings/${msg.listing_id}`}
                          className="text-xs text-gray-600 hover:text-gray-900 px-3 py-1.5 rounded-md hover:bg-gray-100 font-medium"
                        >
                          View Listing
                        </Link>
                      </div>
                      {replyingTo === msg.id && !isSent && (
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <MessageSeller
                            listingId={msg.listing_id}
                            receiverId={msg.sender_id}
                            onSent={async () => {
                              // Mark the original message as read when replying
                              if (!msg.read) {
                                await markAsRead(msg.id)
                              }
                              setReplyingTo(null)
                              loadData()
                              toast.success('Reply sent!')
                            }}
                          />
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function MessagesPage() {
  return <MessagesPageContent />
}

