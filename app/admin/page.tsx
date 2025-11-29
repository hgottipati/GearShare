'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase-client'
import { useAuth } from '@/app/providers'
import Navbar from '@/components/Navbar'
import toast from 'react-hot-toast'
import { notifyUserApproval } from '@/lib/email-notifications'

interface Profile {
  id: string
  email: string
  name: string | null
  phone: string | null
  is_approved: boolean
  is_admin: boolean
  created_at: string
}

interface Listing {
  id: string
  title: string
  category: string
  created_at: string
  is_active: boolean
  profiles: { name: string | null; email: string }
}

interface Announcement {
  id: string
  title: string
  content: string
  is_pinned: boolean
  created_at: string
}

export default function AdminPage() {
  const { user } = useAuth()
  const router = useRouter()
  const supabase = createClient()
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'users' | 'listings' | 'announcements'>(
    'users'
  )

  const [users, setUsers] = useState<Profile[]>([])
  const [listings, setListings] = useState<Listing[]>([])
  const [announcements, setAnnouncements] = useState<Announcement[]>([])

  const [announcementForm, setAnnouncementForm] = useState({
    title: '',
    content: '',
    is_pinned: false,
  })

  useEffect(() => {
    checkAdmin()
  }, [user])

  const checkAdmin = async () => {
    if (!user) {
      router.push('/login')
      return
    }

    const { data } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', user.id)
      .single()

    if (data?.is_admin) {
      setIsAdmin(true)
      loadData()
    } else {
      router.push('/')
    }
  }

  const loadData = async () => {
    // Load users
    const { data: usersData } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false })

    setUsers(usersData || [])

    // Load listings
    const { data: listingsData } = await supabase
      .from('listings')
      .select(
        `
        id,
        title,
        category,
        created_at,
        is_active,
        profiles(name, email)
      `
      )
      .order('created_at', { ascending: false })
      .limit(50)

    setListings(listingsData || [])

    // Load announcements
    const { data: announcementsData } = await supabase
      .from('announcements')
      .select('*')
      .order('is_pinned', { ascending: false })
      .order('created_at', { ascending: false })

    setAnnouncements(announcementsData || [])
    setLoading(false)
  }

  const approveUser = async (userId: string) => {
    const { error } = await supabase
      .from('profiles')
      .update({ is_approved: true })
      .eq('id', userId)

    if (error) {
      toast.error('Error approving user')
    } else {
      toast.success('User approved')
      loadData()
    }
  }

  const rejectUser = async (userId: string) => {
    if (!confirm('Are you sure you want to reject this user?')) return

    const { error } = await supabase.from('profiles').delete().eq('id', userId)

    if (error) {
      toast.error('Error rejecting user')
    } else {
      toast.success('User rejected')
      loadData()
    }
  }

  const deleteListing = async (listingId: string) => {
    if (!confirm('Are you sure you want to delete this listing?')) return

    const { error } = await supabase
      .from('listings')
      .update({ is_active: false })
      .eq('id', listingId)

    if (error) {
      toast.error('Error deleting listing')
    } else {
      toast.success('Listing deleted')
      loadData()
    }
  }

  const createAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    const { error } = await supabase.from('announcements').insert({
      title: announcementForm.title,
      content: announcementForm.content,
      is_pinned: announcementForm.is_pinned,
      created_by: user.id,
    })

    if (error) {
      toast.error('Error creating announcement')
    } else {
      toast.success('Announcement created')
      setAnnouncementForm({ title: '', content: '', is_pinned: false })
      loadData()
    }
  }

  const deleteAnnouncement = async (announcementId: string) => {
    if (!confirm('Are you sure you want to delete this announcement?')) return

    const { error } = await supabase
      .from('announcements')
      .delete()
      .eq('id', announcementId)

    if (error) {
      toast.error('Error deleting announcement')
    } else {
      toast.success('Announcement deleted')
      loadData()
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pb-16 md:pb-8">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAdmin) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Admin Panel</h1>
          <Link
            href="/admin/ski-submissions"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium"
          >
            View Ski Lesson Submissions
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="border-b border-gray-200">
            <div className="flex">
              <button
                onClick={() => setActiveTab('users')}
                className={`px-6 py-3 font-medium ${
                  activeTab === 'users'
                    ? 'border-b-2 border-blue-600 text-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Users ({users.filter((u) => !u.is_approved).length} pending)
              </button>
              <button
                onClick={() => setActiveTab('listings')}
                className={`px-6 py-3 font-medium ${
                  activeTab === 'listings'
                    ? 'border-b-2 border-blue-600 text-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Listings
              </button>
              <button
                onClick={() => setActiveTab('announcements')}
                className={`px-6 py-3 font-medium ${
                  activeTab === 'announcements'
                    ? 'border-b-2 border-blue-600 text-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Announcements
              </button>
            </div>
          </div>

          <div className="p-6">
            {activeTab === 'users' && (
              <div className="space-y-4">
                {users.map((user) => (
                  <div
                    key={user.id}
                    className="border rounded-lg p-4 flex justify-between items-center"
                  >
                    <div>
                      <p className="font-semibold">{user.name || 'No name'}</p>
                      <p className="text-sm text-gray-600">{user.email}</p>
                      {user.phone && (
                        <p className="text-sm text-gray-600">{user.phone}</p>
                      )}
                      <div className="mt-2 flex gap-2">
                        {user.is_approved ? (
                          <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                            Approved
                          </span>
                        ) : (
                          <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                            Pending
                          </span>
                        )}
                        {user.is_admin && (
                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                            Admin
                          </span>
                        )}
                      </div>
                    </div>
                    {!user.is_approved && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => approveUser(user.id)}
                          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => rejectUser(user.id)}
                          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'listings' && (
              <div className="space-y-4">
                {listings.map((listing) => (
                  <div
                    key={listing.id}
                    className="border rounded-lg p-4 flex justify-between items-center"
                  >
                    <div>
                      <p className="font-semibold">{listing.title}</p>
                      <p className="text-sm text-gray-600">{listing.category}</p>
                      <p className="text-sm text-gray-600">
                        By: {listing.profiles.name || listing.profiles.email}
                      </p>
                      {!listing.is_active && (
                        <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded mt-1 inline-block">
                          Deleted
                        </span>
                      )}
                    </div>
                    {listing.is_active && (
                      <button
                        onClick={() => deleteListing(listing.id)}
                        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'announcements' && (
              <div className="space-y-6">
                <div className="border rounded-lg p-4">
                  <h2 className="text-xl font-semibold mb-4">Create Announcement</h2>
                  <form onSubmit={createAnnouncement} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Title
                      </label>
                      <input
                        type="text"
                        value={announcementForm.title}
                        onChange={(e) =>
                          setAnnouncementForm({
                            ...announcementForm,
                            title: e.target.value,
                          })
                        }
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Content
                      </label>
                      <textarea
                        value={announcementForm.content}
                        onChange={(e) =>
                          setAnnouncementForm({
                            ...announcementForm,
                            content: e.target.value,
                          })
                        }
                        required
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={announcementForm.is_pinned}
                          onChange={(e) =>
                            setAnnouncementForm({
                              ...announcementForm,
                              is_pinned: e.target.checked,
                            })
                          }
                          className="mr-2"
                        />
                        <span className="text-sm font-medium text-gray-700">
                          Pin to top
                        </span>
                      </label>
                    </div>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      Create Announcement
                    </button>
                  </form>
                </div>

                <div>
                  <h2 className="text-xl font-semibold mb-4">Existing Announcements</h2>
                  <div className="space-y-4">
                    {announcements.map((announcement) => (
                      <div
                        key={announcement.id}
                        className="border rounded-lg p-4 flex justify-between items-start"
                      >
                        <div>
                          {announcement.is_pinned && (
                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded mb-2 inline-block">
                              Pinned
                            </span>
                          )}
                          <p className="font-semibold">{announcement.title}</p>
                          <p className="text-sm text-gray-700 mt-2 whitespace-pre-wrap">
                            {announcement.content}
                          </p>
                          <p className="text-xs text-gray-500 mt-2">
                            {new Date(announcement.created_at).toLocaleString()}
                          </p>
                        </div>
                        <button
                          onClick={() => deleteAnnouncement(announcement.id)}
                          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

