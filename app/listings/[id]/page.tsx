'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase-client'
import { useAuth } from '@/app/providers'
import Navbar from '@/components/Navbar'
import MessageSeller from '@/components/MessageSeller'
import ImageGallery from '@/components/ImageGallery'
import toast from 'react-hot-toast'
import Link from 'next/link'

interface Listing {
  id: string
  title: string
  description: string | null
  category: string
  condition: string
  size: string | null
  price: number | null
  location: string | null
  trade_only: boolean
  open_to_trade: boolean
  trade_wants: string | null
  rent_available: boolean
  rent_price: number | null
  status: string
  created_at: string
  user_id: string
  listing_images: { image_url: string; image_order: number }[]
  profiles: {
    name: string | null
    email: string
    phone: string | null
  }
}

export default function ListingDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const supabase = createClient()
  const [listing, setListing] = useState<Listing | null>(null)
  const [loading, setLoading] = useState(true)
  const [showMessageForm, setShowMessageForm] = useState(false)

  useEffect(() => {
    if (params.id) {
      loadListing()
    }
  }, [params.id])

  const loadListing = async () => {
    const { data, error } = await supabase
      .from('listings')
      .select(
        `
        *,
        listing_images(image_url, image_order),
        profiles(name, email, phone)
      `
      )
      .eq('id', params.id)
      .eq('is_active', true)
      .single()

    if (error) {
      console.error('Error loading listing:', error)
    } else {
      // Ensure status exists (default to 'Available' if migration not run)
      if (data) {
        data.status = (data as any).status || 'Available'
      }
      setListing(data)
    }
    setLoading(false)
  }

  const handleDelete = async () => {
    if (!listing || !user || listing.user_id !== user.id) return

    if (!confirm('Are you sure you want to delete this listing?')) return

    const { error } = await supabase
      .from('listings')
      .update({ is_active: false })
      .eq('id', listing.id)

    if (error) {
      toast.error('Error deleting listing')
    } else {
      toast.success('Listing deleted')
      router.push('/')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pb-16 md:pb-8">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="bg-white rounded-lg shadow p-6 animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-3/4 mb-4"></div>
            <div className="h-64 bg-gray-300 rounded mb-4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-300 rounded w-full"></div>
              <div className="h-4 bg-gray-300 rounded w-5/6"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!listing) {
    return (
      <div className="min-h-screen bg-gray-50 pb-16 md:pb-8">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <p>Listing not found.</p>
        </div>
      </div>
    )
  }

  const isOwner = user && listing.user_id === user.id
  const sortedImages = [...listing.listing_images].sort((a, b) => a.image_order - b.image_order)

  const city = listing.location ? listing.location.split(',')[0].trim() : null

  return (
    <div className="min-h-screen bg-gray-50 pb-16 md:pb-8">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <button
          onClick={() => router.back()}
          className="mb-6 text-gray-600 hover:text-gray-900 font-medium flex items-center gap-2 transition-colors"
        >
          ← Back
        </button>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Images */}
          <ImageGallery images={listing.listing_images} title={listing.title} />

          <div className="p-8">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-4xl font-bold text-gray-900">{listing.title}</h1>
              {(listing as any).status && (listing as any).status !== 'Available' && (
                <span
                  className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    (listing as any).status === 'Sold'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}
                >
                  {(listing as any).status}
                </span>
              )}
            </div>

            {city && (
              <div className="mb-6 inline-flex items-center gap-2 bg-blue-50 border border-blue-200 px-4 py-2 rounded-lg">
                <span className="text-lg">📍</span>
                <div>
                  <div className="text-xs text-gray-600">Location</div>
                  <div className="font-semibold text-gray-900">{city}</div>
                  {listing.location && listing.location !== city && (
                    <div className="text-xs text-gray-500">{listing.location}</div>
                  )}
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <div className="text-xs text-gray-600 mb-1 font-medium">Category</div>
                <div className="font-semibold text-gray-900">{listing.category}</div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <div className="text-xs text-gray-600 mb-1 font-medium">Condition</div>
                <div className="font-semibold text-gray-900">{listing.condition}</div>
              </div>
              {listing.size && (
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <div className="text-xs text-gray-600 mb-1 font-medium">Size</div>
                  <div className="font-semibold text-gray-900">{listing.size}</div>
                </div>
              )}
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-xl p-8 mb-8">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div>
                  <div className="text-sm text-gray-500 mb-2 font-medium uppercase tracking-wide">Price</div>
                  {listing.trade_only ? (
                    <div className="text-4xl font-bold text-blue-600">Trade Only</div>
                  ) : listing.price ? (
                    <div className="text-5xl font-bold text-gray-900">${listing.price}</div>
                  ) : (
                    <div className="text-xl text-gray-600">Price on request</div>
                  )}
                </div>
                {(listing as any).rent_available && (listing as any).rent_price && (
                  <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-5">
                    <div className="text-sm text-gray-500 mb-1 font-medium uppercase tracking-wide">Rent</div>
                    <div className="text-3xl font-bold text-indigo-600">
                      ${(listing as any).rent_price}
                      <span className="text-base font-normal text-gray-500">/day</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {listing.open_to_trade && (
              <div className="mb-4 p-3 bg-blue-50 rounded">
                <p className="font-medium text-blue-900">Open to Trade</p>
                {listing.trade_wants && (
                  <p className="text-sm text-blue-800 mt-1">
                    Looking for: {listing.trade_wants}
                  </p>
                )}
              </div>
            )}

            {listing.description && (
              <div className="mb-8">
                <h2 className="font-semibold text-lg mb-3 text-gray-900">Description</h2>
                <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                  {listing.description}
                </p>
              </div>
            )}

            <div className="border-t border-gray-200 pt-6">
              <h2 className="font-semibold text-lg mb-4 text-gray-900">Seller Information</h2>
              <div className="space-y-1">
                <p className="text-gray-900 font-medium">{listing.profiles.name || 'No name'}</p>
                <p className="text-sm text-gray-600">{listing.profiles.email}</p>
                {listing.profiles.phone && (
                  <p className="text-sm text-gray-600">{listing.profiles.phone}</p>
                )}
              </div>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              {isOwner ? (
                <>
                  <Link
                    href={`/listings/${listing.id}/edit`}
                    className="px-6 py-2.5 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-sm"
                  >
                    Edit Listing
                  </Link>
                  {((listing as any).status === 'Available' || !(listing as any).status) && (
                    <div className="flex gap-2">
                      <button
                        onClick={async () => {
                          if (confirm('Mark this listing as Sold?')) {
                            const updateData: any = {}
                            // Only include status if column exists (check by trying to update)
                            try {
                              const { error } = await supabase
                                .from('listings')
                                .update({ status: 'Sold' })
                                .eq('id', listing.id)
                              if (error) {
                                if (error.message.includes('status')) {
                                  toast.error(
                                    'Status feature not available. Please run the database migration. See MIGRATION_INSTRUCTIONS.md'
                                  )
                                } else {
                                  toast.error('Error updating status')
                                }
                              } else {
                                toast.success('Listing marked as Sold')
                                loadListing()
                              }
                            } catch (err) {
                              toast.error('Status feature requires database migration')
                            }
                          }
                        }}
                        className="px-6 py-2.5 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors shadow-sm"
                      >
                        Mark as Sold
                      </button>
                      <button
                        onClick={async () => {
                          if (confirm('Mark this listing as Traded?')) {
                            try {
                              const { error } = await supabase
                                .from('listings')
                                .update({ status: 'Traded' })
                                .eq('id', listing.id)
                              if (error) {
                                if (error.message.includes('status')) {
                                  toast.error(
                                    'Status feature not available. Please run the database migration. See MIGRATION_INSTRUCTIONS.md'
                                  )
                                } else {
                                  toast.error('Error updating status')
                                }
                              } else {
                                toast.success('Listing marked as Traded')
                                loadListing()
                              }
                            } catch (err) {
                              toast.error('Status feature requires database migration')
                            }
                          }
                        }}
                        className="px-6 py-2.5 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-sm"
                      >
                        Mark as Traded
                      </button>
                    </div>
                  )}
                  <button
                    onClick={handleDelete}
                    className="px-6 py-2.5 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors shadow-sm"
                  >
                    Delete Listing
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setShowMessageForm(!showMessageForm)}
                    className="px-6 py-2.5 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-sm"
                  >
                    {showMessageForm ? 'Cancel' : 'Message Seller'}
                  </button>
                  {listing.profiles.phone && (
                    <a
                      href={`tel:${listing.profiles.phone}`}
                      className="px-6 py-2.5 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors shadow-sm"
                    >
                      Call Seller
                    </a>
                  )}
                  <a
                    href={`mailto:${listing.profiles.email}`}
                    className="px-6 py-2.5 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-700 transition-colors shadow-sm"
                  >
                    Email Seller
                  </a>
                </>
              )}
            </div>

            {showMessageForm && !isOwner && user && (
              <div className="mt-4">
                <MessageSeller
                  listingId={listing.id}
                  receiverId={listing.user_id}
                  onSent={() => {
                    setShowMessageForm(false)
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

