'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase-client'
import Link from 'next/link'
import Image from 'next/image'
import { getRelativeTime, isNewContent } from '@/lib/utils'
import { ArrowRight, Package } from 'lucide-react'

interface Listing {
  id: string
  title: string
  category: string
  price: number | null
  created_at: string
  listing_images: { image_url: string }[]
}

export default function RecentListings() {
  const [listings, setListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    loadRecentListings()
  }, [])

  const loadRecentListings = async () => {
    try {
      const { data } = await supabase
        .from('listings')
        .select('id, title, category, price, created_at, listing_images(image_url)')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(6)

      setListings(data || [])
    } catch (error) {
      console.error('Error loading recent listings:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="animate-pulse bg-gray-200 rounded-lg aspect-square"></div>
        ))}
      </div>
    )
  }

  if (listings.length === 0) return null

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Recently Added</h2>
        <Link
          href="/marketplace"
          className="text-blue-700 hover:text-blue-800 font-semibold flex items-center gap-1"
        >
          View All
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {listings.map((listing) => {
          const hasImage = listing.listing_images && listing.listing_images.length > 0
          const imageUrl = hasImage ? listing.listing_images[0].image_url : ''
          const isNew = isNewContent(listing.created_at, 24)

          return (
            <Link
              key={listing.id}
              href={`/listings/${listing.id}`}
              className="group relative bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="aspect-square relative bg-gradient-to-br from-gray-100 to-gray-200">
                {hasImage ? (
                  <Image
                    src={imageUrl}
                    alt={listing.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <Package className="w-8 h-8" />
                  </div>
                )}
                {isNew && (
                  <div className="absolute top-2 right-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
                    NEW
                  </div>
                )}
              </div>
              <div className="p-3">
                <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 mb-1">
                  {listing.title}
                </h3>
                {listing.price && (
                  <div className="text-sm font-bold text-blue-700">${listing.price}</div>
                )}
                <div className="text-xs text-gray-500 mt-1">
                  {getRelativeTime(listing.created_at)}
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

