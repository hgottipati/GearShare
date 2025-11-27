'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase-client'
import { useAuth } from '@/app/providers'
import Navbar from '@/components/Navbar'
import Link from 'next/link'
import Image from 'next/image'
import toast from 'react-hot-toast'

interface Profile {
  name: string | null
  email: string
  phone: string | null
  is_approved: boolean
}

interface Listing {
  id: string
  title: string
  category: string
  price: number | null
  trade_only: boolean
  created_at: string
  listing_images: { image_url: string }[]
}

interface Message {
  id: string
  message: string
  created_at: string
  read: boolean
  listings: { title: string }
  profiles: { name: string | null; email: string }
}

export default function ProfilePage() {
  const { user } = useAuth()
  const router = useRouter()
  const supabase = createClient()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [listings, setListings] = useState<Listing[]>([])
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'listings' | 'messages'>('listings')

  useEffect(() => {
    if (user) {
      loadData()
    } else {
      router.push('/login')
    }
  }, [user])

  const loadData = async () => {
    if (!user) return

    // Load profile
    const { data: profileData } = await supabase
      .from('profiles')
      .select('name, email, phone, is_approved')
      .eq('id', user.id)
      .single()

    setProfile(profileData)

    // Load user's listings
    const { data: listingsData } = await supabase
      .from('listings')
      .select(
        `
        id,
        title,
        category,
        price,
        trade_only,
        created_at,
        listing_images(image_url)
      `
      )
      .eq('user_id', user.id)
      .eq('is_active', true)
      .order('created_at', { ascending: false })

    setListings(listingsData || [])

    // Load messages
    const { data: messagesData } = await supabase
      .from('messages')
      .select(
        `
        id,
        message,
        created_at,
        read,
        listings(title),
        profiles!messages_receiver_id_fkey(name, email)
      `
      )
      .eq('receiver_id', user.id)
      .order('created_at', { ascending: false })
      .limit(20)

    setMessages(messagesData || [])
    setLoading(false)
  }

  const updateProfile = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!user) return

    const formData = new FormData(e.currentTarget)
    const { error } = await supabase
      .from('profiles')
      .update({
        name: formData.get('name') as string,
        phone: formData.get('phone') as string || null,
      })
      .eq('id', user.id)

    if (error) {
      toast.error('Error updating profile')
    } else {
      loadData()
      toast.success('Profile updated!')
    }
  }

  const markAsRead = async (messageId: string) => {
    const { error } = await supabase
      .from('messages')
      .update({ read: true })
      .eq('id', messageId)

    if (!error) {
      loadData()
    }
  }

  if (loading || !profile) {
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
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">My Profile</h1>
        <p className="text-gray-600 mb-8">Manage your account and listings</p>

        {!profile.is_approved && (
          <div className="mb-6 p-4 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded">
            Your account is pending approval. You&apos;ll be able to create listings once
            approved.
          </div>
        )}

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-6">
          <h2 className="text-xl font-semibold mb-6 text-gray-900">Profile Information</h2>
          <form onSubmit={updateProfile} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Name
              </label>
              <input
                type="text"
                name="name"
                defaultValue={profile.name || ''}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={profile.email}
                disabled
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone
              </label>
              <input
                type="tel"
                name="phone"
                defaultValue={profile.phone || ''}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Update Profile
            </button>
          </form>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="border-b border-gray-200">
            <div className="flex">
              <button
                onClick={() => setActiveTab('listings')}
                className={`px-6 py-3 font-medium ${
                  activeTab === 'listings'
                    ? 'border-b-2 border-blue-600 text-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                My Listings ({listings.length})
              </button>
              <button
                onClick={() => setActiveTab('messages')}
                className={`px-6 py-3 font-medium ${
                  activeTab === 'messages'
                    ? 'border-b-2 border-blue-600 text-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Messages ({messages.filter((m) => !m.read).length})
              </button>
            </div>
          </div>

          <div className="p-6">
            {activeTab === 'listings' ? (
              <div>
                {listings.length === 0 ? (
                  <p className="text-gray-600">You haven&apos;t created any listings yet.</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {listings.map((listing) => (
                      <Link
                        key={listing.id}
                        href={`/listings/${listing.id}`}
                        className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                      >
                        <div className="aspect-video bg-gray-200 relative overflow-hidden">
                          {listing.listing_images &&
                          listing.listing_images.length > 0 ? (
                            <Image
                              src={listing.listing_images[0].image_url}
                              alt={listing.title}
                              fill
                              className="object-cover"
                              sizes="(max-width: 768px) 100vw, 50vw"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                              No Image
                            </div>
                          )}
                        </div>
                        <div className="p-4">
                          <h3 className="font-semibold mb-1 line-clamp-2">
                            {listing.title}
                          </h3>
                          <p className="text-sm text-gray-600">{listing.category}</p>
                          {listing.trade_only ? (
                            <p className="text-sm text-blue-600 font-semibold mt-1">
                              Trade Only
                            </p>
                          ) : listing.price ? (
                            <p className="text-sm text-green-600 font-semibold mt-1">
                              ${listing.price}
                            </p>
                          ) : null}
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {messages.length === 0 ? (
                  <p className="text-gray-600">No messages yet.</p>
                ) : (
                  messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`p-4 border rounded-lg ${
                        !msg.read ? 'bg-blue-50 border-blue-200' : 'bg-gray-50'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <p className="font-semibold">
                            {msg.profiles.name || msg.profiles.email}
                          </p>
                          <p className="text-sm text-gray-600">
                            Re: {msg.listings.title}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          {!msg.read && (
                            <button
                              onClick={() => markAsRead(msg.id)}
                              className="text-xs text-blue-600 hover:text-blue-800 px-2 py-1 rounded hover:bg-blue-100"
                            >
                              Mark as read
                            </button>
                          )}
                          <span className="text-xs text-gray-500">
                            {new Date(msg.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <p className="text-gray-700">{msg.message}</p>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

