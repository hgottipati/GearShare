'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase-client'
import { useAuth } from '@/app/providers'
import Navbar from '@/components/Navbar'
import Link from 'next/link'
import Image from 'next/image'
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
  listings: { id: string; title: string; listing_images: { image_url: string }[] }
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
  listings: { id: string; title: string; listing_images: { image_url: string }[] }
}

interface Conversation {
  otherPersonId: string
  otherPersonName: string | null
  otherPersonEmail: string
  listingId: string
  listingTitle: string
  listingImage: string | null
  messages: Message[]
  unreadCount: number
  latestMessage: Message
}

interface ListingGroup {
  listingId: string
  listingTitle: string
  listingImage: string | null
  conversations: Conversation[]
}

function MessagesPageContent() {
  const { user } = useAuth()
  const router = useRouter()
  const supabase = createClient()
  const [listingGroups, setListingGroups] = useState<ListingGroup[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedConversations, setExpandedConversations] = useState<Set<string>>(new Set())
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

    // Load both received and sent messages with listing images
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
          listings(
            id,
            title,
            listing_images(image_url)
          )
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
          listings(
            id,
            title,
            listing_images(image_url)
          )
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
        const listingImages = msg.listings?.listing_images || []
        return {
          id: msg.id,
          message: msg.message,
          created_at: msg.created_at,
          read: msg.read,
          sender_id: msg.sender_id,
          receiver_id: msg.receiver_id,
          listing_id: msg.listing_id,
          listings: {
            id: msg.listings.id,
            title: msg.listings.title,
            listing_images: listingImages,
          },
          sender_profile: senderProfile,
          receiver_profile: { name: profileData?.name || null, email: profileData?.email || '' },
        }
      }),
      ...(sentMessagesResult.data || []).map((msg: MessageQueryResult) => {
        const receiverProfile = profilesMap.get(msg.receiver_id) || { name: null, email: '' }
        const listingImages = msg.listings?.listing_images || []
        return {
          id: msg.id,
          message: msg.message,
          created_at: msg.created_at,
          read: true, // Sent messages are always "read"
          sender_id: msg.sender_id,
          receiver_id: msg.receiver_id,
          listing_id: msg.listing_id,
          listings: {
            id: msg.listings.id,
            title: msg.listings.title,
            listing_images: listingImages,
          },
          sender_profile: { name: profileData?.name || null, email: profileData?.email || '' },
          receiver_profile: receiverProfile,
        }
      }),
    ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

    // Group messages by listing, then by conversation partner
    const listingMap = new Map<string, Map<string, Message[]>>()

    allMessages.forEach((msg) => {
      // Determine the other person in the conversation
      const otherPersonId = msg.sender_id === user.id ? msg.receiver_id : msg.sender_id
      
      if (!listingMap.has(msg.listing_id)) {
        listingMap.set(msg.listing_id, new Map())
      }
      
      const conversationMap = listingMap.get(msg.listing_id)!
      if (!conversationMap.has(otherPersonId)) {
        conversationMap.set(otherPersonId, [])
      }
      
      conversationMap.get(otherPersonId)!.push(msg)
    })

    // Convert to ListingGroup structure
    const groups: ListingGroup[] = []
    
    listingMap.forEach((conversationMap, listingId) => {
      const firstMessage = allMessages.find(m => m.listing_id === listingId)
      if (!firstMessage) return

      const listingImage = firstMessage.listings.listing_images?.[0]?.image_url || null
      
      const conversations: Conversation[] = []
      
      conversationMap.forEach((messages, otherPersonId) => {
        // Sort messages by date (oldest first for conversation view)
        const sortedMessages = [...messages].sort((a, b) => 
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        )
        
        const otherPerson = messages[0].sender_id === user.id 
          ? messages[0].receiver_profile 
          : messages[0].sender_profile
        
        const unreadCount = messages.filter(m => !m.read && m.receiver_id === user.id).length
        const latestMessage = sortedMessages[sortedMessages.length - 1]
        
        conversations.push({
          otherPersonId,
          otherPersonName: otherPerson.name,
          otherPersonEmail: otherPerson.email,
          listingId,
          listingTitle: firstMessage.listings.title,
          listingImage,
          messages: sortedMessages,
          unreadCount,
          latestMessage,
        })
      })

      // Sort conversations by latest message date (newest first)
      conversations.sort((a, b) => 
        new Date(b.latestMessage.created_at).getTime() - new Date(a.latestMessage.created_at).getTime()
      )

      groups.push({
        listingId,
        listingTitle: firstMessage.listings.title,
        listingImage,
        conversations,
      })
    })

    // Sort listing groups by latest message across all conversations
    groups.sort((a, b) => {
      const aLatest = a.conversations[0]?.latestMessage?.created_at || ''
      const bLatest = b.conversations[0]?.latestMessage?.created_at || ''
      return new Date(bLatest).getTime() - new Date(aLatest).getTime()
    })

    setListingGroups(groups)
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

  const toggleConversation = (conversationKey: string) => {
    const newExpanded = new Set(expandedConversations)
    if (newExpanded.has(conversationKey)) {
      newExpanded.delete(conversationKey)
    } else {
      newExpanded.add(conversationKey)
    }
    setExpandedConversations(newExpanded)
  }

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
    
    if (diffInSeconds < 60) {
      return 'just now'
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60)
      return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600)
      return `${hours} hour${hours !== 1 ? 's' : ''} ago`
    } else if (diffInSeconds < 604800) {
      const days = Math.floor(diffInSeconds / 86400)
      return `${days} day${days !== 1 ? 's' : ''} ago`
    } else if (diffInSeconds < 2592000) {
      const weeks = Math.floor(diffInSeconds / 604800)
      return `about ${weeks} week${weeks !== 1 ? 's' : ''} ago`
    } else if (diffInSeconds < 31536000) {
      const months = Math.floor(diffInSeconds / 2592000)
      return `about ${months} month${months !== 1 ? 's' : ''} ago`
    } else {
      return date.toLocaleDateString()
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
        <div className="mb-6">
          <Link href="/marketplace" className="text-sm text-gray-600 hover:text-gray-900 mb-2 inline-block">
            Home
          </Link>
          <span className="text-sm text-gray-400 mx-2">/</span>
          <span className="text-sm text-gray-900 font-medium">Inbox</span>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Inbox</h1>

        {listingGroups.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
            <p className="text-gray-600">No messages yet.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {listingGroups.map((group) => (
              <div key={group.listingId} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                {/* Listing Header */}
                <div className="p-4 border-b border-gray-200 bg-gray-50">
                  <div className="flex items-center gap-3">
                    {group.listingImage && (
                      <Link href={`/listings/${group.listingId}`} className="flex-shrink-0">
                        <div className="w-16 h-16 relative rounded-lg overflow-hidden border border-gray-200">
                          <Image
                            src={group.listingImage}
                            alt={group.listingTitle}
                            fill
                            className="object-cover"
                            sizes="64px"
                          />
                        </div>
                      </Link>
                    )}
                    <div className="flex-1 min-w-0">
                      <Link 
                        href={`/listings/${group.listingId}`}
                        className="text-lg font-semibold text-gray-900 hover:text-blue-600 line-clamp-1"
                      >
                        {group.listingTitle}
                      </Link>
                      <p className="text-sm text-gray-600">
                        {group.conversations.length} conversation{group.conversations.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Conversations */}
                <div className="divide-y divide-gray-200">
                  {group.conversations.map((conversation) => {
                    const conversationKey = `${conversation.listingId}-${conversation.otherPersonId}`
                    const isExpanded = expandedConversations.has(conversationKey)
                    const isSent = conversation.latestMessage.sender_id === user?.id
                    const previewText = isSent 
                      ? `You: ${conversation.latestMessage.message.substring(0, 60)}${conversation.latestMessage.message.length > 60 ? '...' : ''}`
                      : conversation.latestMessage.message.substring(0, 80) + (conversation.latestMessage.message.length > 80 ? '...' : '')

                    return (
                      <div key={conversationKey}>
                        {/* Conversation Preview */}
                        <div
                          className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                            conversation.unreadCount > 0 ? 'bg-blue-50/50' : ''
                          }`}
                          onClick={() => toggleConversation(conversationKey)}
                        >
                          <div className="flex items-start gap-3">
                            {/* Avatar placeholder */}
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-semibold flex-shrink-0">
                              {conversation.otherPersonName 
                                ? conversation.otherPersonName.charAt(0).toUpperCase()
                                : conversation.otherPersonEmail.charAt(0).toUpperCase()}
                            </div>
                            
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-1">
                                <p className="font-semibold text-gray-900">
                                  {conversation.otherPersonName || conversation.otherPersonEmail}
                                </p>
                                <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
                                  {formatTimeAgo(conversation.latestMessage.created_at)}
                                </span>
                              </div>
                              <p className="text-sm text-gray-600 line-clamp-1">{previewText}</p>
                              {conversation.unreadCount > 0 && (
                                <span className="inline-block mt-1 text-xs bg-blue-600 text-white px-2 py-0.5 rounded-full">
                                  {conversation.unreadCount} new
                                </span>
                              )}
                            </div>

                            {/* Listing thumbnail */}
                            {conversation.listingImage && (
                              <Link 
                                href={`/listings/${conversation.listingId}`}
                                onClick={(e) => e.stopPropagation()}
                                className="flex-shrink-0"
                              >
                                <div className="w-12 h-12 relative rounded border border-gray-200 overflow-hidden">
                                  <Image
                                    src={conversation.listingImage}
                                    alt={conversation.listingTitle}
                                    fill
                                    className="object-cover"
                                    sizes="48px"
                                  />
                                </div>
                              </Link>
                            )}
                          </div>
                        </div>

                        {/* Expanded Conversation View */}
                        {isExpanded && (
                          <div className="bg-gray-50 border-t border-gray-200 p-4 space-y-4">
                            {conversation.messages.map((msg) => {
                              const msgIsSent = msg.sender_id === user?.id
                              return (
                                <div
                                  key={msg.id}
                                  className={`p-4 rounded-lg ${
                                    !msg.read && !msgIsSent
                                      ? 'bg-blue-50 border border-blue-200'
                                      : msgIsSent
                                      ? 'bg-gray-100 border border-gray-200'
                                      : 'bg-white border border-gray-200'
                                  }`}
                                >
                                  <div className="flex justify-between items-start mb-2">
                                    <div className="flex items-center gap-2">
                                      <p className="font-semibold text-gray-900">
                                        {msgIsSent ? 'You' : conversation.otherPersonName || conversation.otherPersonEmail}
                                      </p>
                                      {msgIsSent && (
                                        <span className="text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded">
                                          Sent
                                        </span>
                                      )}
                                      {!msgIsSent && !msg.read && (
                                        <span className="text-xs bg-blue-600 text-white px-2 py-0.5 rounded">
                                          New
                                        </span>
                                      )}
                                    </div>
                                    <span className="text-xs text-gray-500">
                                      {formatTimeAgo(msg.created_at)}
                                    </span>
                                  </div>
                                  <p className="text-gray-700 mb-3 whitespace-pre-wrap">{msg.message}</p>
                                  <div className="flex items-center gap-2 pt-2 border-t border-gray-200">
                                    {!msgIsSent && !msg.read && (
                                      <button
                                        onClick={() => markAsRead(msg.id)}
                                        className="text-xs text-blue-600 hover:text-blue-800 px-3 py-1.5 rounded-md hover:bg-blue-100 font-medium"
                                      >
                                        Mark as read
                                      </button>
                                    )}
                                    {!msgIsSent && (
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
                                  {replyingTo === msg.id && !msgIsSent && (
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
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default function MessagesPage() {
  return <MessagesPageContent />
}
