'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase-client'
import Link from 'next/link'
import Image from 'next/image'
import Navbar from './Navbar'
import Announcements from './Announcements'
import { ListingCardSkeleton } from './SkeletonLoader'
import HeroBanner from './HeroBanner'

interface Listing {
  id: string
  title: string
  category: string
  condition: string
  size: string | null
  price: number | null
  location: string | null
  trade_only: boolean
  open_to_trade: boolean
  rent_available: boolean
  rent_price: number | null
  created_at: string
  listing_images: { image_url: string }[]
  profiles: { name: string | null }
}

const ITEMS_PER_PAGE = 12

export default function MarketplaceList() {
  const [listings, setListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [sizeFilter, setSizeFilter] = useState<string>('')
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [conditionFilter, setConditionFilter] = useState<string>('all')
  const [priceMin, setPriceMin] = useState<string>('')
  const [priceMax, setPriceMax] = useState<string>('')
  const [tradeOnlyFilter, setTradeOnlyFilter] = useState<string>('all')
  const [sortBy, setSortBy] = useState<string>('newest')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const [showFilters, setShowFilters] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    setCurrentPage(1) // Reset to first page when filters change
    loadListings(1)
  }, [
    categoryFilter,
    sizeFilter,
    searchQuery,
    conditionFilter,
    priceMin,
    priceMax,
    tradeOnlyFilter,
    sortBy,
  ])

  useEffect(() => {
    loadListings(currentPage)
  }, [currentPage])

  const loadListings = async (page: number = 1) => {
    setLoading(true)
    const from = (page - 1) * ITEMS_PER_PAGE
    const to = from + ITEMS_PER_PAGE - 1

    let query = supabase
      .from('listings')
      .select(
        `
        id,
        title,
        category,
        condition,
        size,
        price,
        location,
        trade_only,
        open_to_trade,
        rent_available,
        rent_price,
        created_at,
        listing_images(image_url),
        profiles(name)
      `,
        { count: 'exact' }
      )
      .eq('is_active', true)
      .range(from, to)

    // Apply filters
    if (categoryFilter !== 'all') {
      query = query.eq('category', categoryFilter)
    }

    if (conditionFilter !== 'all') {
      query = query.eq('condition', conditionFilter)
    }

    if (sizeFilter) {
      query = query.ilike('size', `%${sizeFilter}%`)
    }

    if (searchQuery) {
      query = query.or(
        `title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`
      )
    }

    if (tradeOnlyFilter === 'trade') {
      query = query.eq('trade_only', true)
    } else if (tradeOnlyFilter === 'sale') {
      query = query.eq('trade_only', false)
    }

    if (priceMin) {
      const minPrice = parseFloat(priceMin)
      if (!isNaN(minPrice)) {
        query = query.gte('price', minPrice)
      }
    }

    if (priceMax) {
      const maxPrice = parseFloat(priceMax)
      if (!isNaN(maxPrice)) {
        query = query.lte('price', maxPrice)
      }
    }

    // Apply sorting
    switch (sortBy) {
      case 'newest':
        query = query.order('created_at', { ascending: false })
        break
      case 'oldest':
        query = query.order('created_at', { ascending: true })
        break
      case 'price_low':
        query = query.order('price', { ascending: true, nullsFirst: false })
        break
      case 'price_high':
        query = query.order('price', { ascending: false, nullsFirst: false })
        break
      default:
        query = query.order('created_at', { ascending: false })
    }

    const { data, error, count } = await query

    if (error) {
      console.error('Error loading listings:', error)
    } else {
      setListings(data || [])
      setTotalCount(count || 0)
    }
    setLoading(false)
  }

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE)

  const categories = [
    'all',
    'Skis',
    'Boots',
    'Poles',
    'Helmets',
    'Clothing',
    'Other',
  ]

  return (
    <div className="min-h-screen bg-gray-50 pb-16 md:pb-8">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <HeroBanner />
        
        <Announcements />

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Filters</h2>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="md:hidden text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              {showFilters ? 'Hide' : 'Show'} Filters
            </button>
          </div>

          <div className={`space-y-4 ${showFilters ? 'block' : 'hidden md:block'}`}>
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Listings
              </label>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by title or description..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Quick Filters Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat === 'all' ? 'All Categories' : cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Condition
                </label>
                <select
                  value={conditionFilter}
                  onChange={(e) => setConditionFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                >
                  <option value="all">All Conditions</option>
                  <option value="New">New</option>
                  <option value="Excellent">Excellent</option>
                  <option value="Good">Good</option>
                  <option value="Used">Used</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type
                </label>
                <select
                  value={tradeOnlyFilter}
                  onChange={(e) => setTradeOnlyFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                >
                  <option value="all">All Types</option>
                  <option value="sale">For Sale</option>
                  <option value="trade">Trade Only</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sort By
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="price_low">Price: Low to High</option>
                  <option value="price_high">Price: High to Low</option>
                </select>
              </div>
            </div>

            {/* Advanced Filters Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Size (search)
                </label>
                <input
                  type="text"
                  value={sizeFilter}
                  onChange={(e) => setSizeFilter(e.target.value)}
                  placeholder="e.g., 90cm, size 5"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Min Price ($)
                  </label>
                  <input
                    type="number"
                    value={priceMin}
                    onChange={(e) => setPriceMin(e.target.value)}
                    placeholder="Min"
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Max Price ($)
                  </label>
                  <input
                    type="number"
                    value={priceMax}
                    onChange={(e) => setPriceMax(e.target.value)}
                    placeholder="Max"
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Clear Filters */}
            {(categoryFilter !== 'all' ||
              sizeFilter ||
              searchQuery ||
              conditionFilter !== 'all' ||
              priceMin ||
              priceMax ||
              tradeOnlyFilter !== 'all') && (
              <button
                onClick={() => {
                  setCategoryFilter('all')
                  setSizeFilter('')
                  setSearchQuery('')
                  setConditionFilter('all')
                  setPriceMin('')
                  setPriceMax('')
                  setTradeOnlyFilter('all')
                  setSortBy('newest')
                }}
                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                Clear All Filters
              </button>
            )}
          </div>
        </div>

        {/* Listings Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <ListingCardSkeleton key={i} />
            ))}
          </div>
        ) : listings.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-lg shadow-sm border border-gray-200">
            <p className="text-gray-500 text-lg">No listings found.</p>
            <p className="text-gray-400 text-sm mt-2">Try adjusting your filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map((listing) => {
              const city = listing.location
                ? listing.location.split(',')[0].trim()
                : null
              
              return (
                <Link
                  key={listing.id}
                  href={`/listings/${listing.id}`}
                  className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden border border-gray-200 group hover:border-blue-200"
                >
                  <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 relative overflow-hidden">
                    {listing.listing_images && listing.listing_images.length > 0 ? (
                      <Image
                        src={listing.listing_images[0].image_url}
                        alt={listing.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gradient-to-br from-blue-50 to-indigo-50">
                        <span className="text-sm">No Image</span>
                      </div>
                    )}
                    {city && (
                      <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm text-gray-800 px-2.5 py-1 rounded-md text-xs font-semibold shadow-sm">
                        📍 {city}
                      </div>
                    )}
                    <div className="absolute top-3 right-3 flex gap-1.5">
                      {listing.rent_available && (
                        <span className="bg-indigo-600 text-white px-2.5 py-1 rounded-md text-xs font-semibold shadow-sm">
                          Rent
                        </span>
                      )}
                      {listing.open_to_trade && (
                        <span className="bg-blue-600 text-white px-2.5 py-1 rounded-md text-xs font-semibold shadow-sm">
                          Trade
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="font-bold text-lg mb-3 line-clamp-2 text-gray-900 group-hover:text-blue-600 transition-colors">
                      {listing.title}
                    </h3>
                    <div className="flex items-center gap-2 text-xs mb-4">
                      <span className="bg-blue-50 text-blue-700 px-2.5 py-1 rounded-md font-medium border border-blue-200">
                        {listing.category}
                      </span>
                      <span className="bg-green-50 text-green-700 px-2.5 py-1 rounded-md font-medium border border-green-200">
                        {listing.condition}
                      </span>
                    </div>
                    {listing.size && (
                      <p className="text-sm text-gray-600 mb-4">
                        <span className="font-medium text-gray-700">Size:</span> {listing.size}
                      </p>
                    )}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="flex flex-col gap-1">
                        {listing.trade_only ? (
                          <span className="text-blue-600 font-bold text-lg">Trade Only</span>
                        ) : listing.price ? (
                          <span className="text-gray-900 font-bold text-2xl">
                            ${listing.price}
                          </span>
                        ) : (
                          <span className="text-gray-500 text-sm">Price on request</span>
                        )}
                        {listing.rent_available && listing.rent_price && (
                          <span className="text-indigo-600 font-semibold text-sm">
                            ${listing.rent_price}/day
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        )}

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="mt-8 flex justify-center items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
            >
              Previous
            </button>
            <div className="flex gap-1">
              {[...Array(Math.min(5, totalPages))].map((_, i) => {
                let pageNum
                if (totalPages <= 5) {
                  pageNum = i + 1
                } else if (currentPage <= 3) {
                  pageNum = i + 1
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i
                } else {
                  pageNum = currentPage - 2 + i
                }
                return (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      currentPage === pageNum
                        ? 'bg-blue-600 text-white'
                        : 'bg-white border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {pageNum}
                  </button>
                )
              })}
            </div>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
            >
              Next
            </button>
            <span className="ml-4 text-sm text-gray-600">
              Page {currentPage} of {totalPages} ({totalCount} total)
            </span>
          </div>
        )}
      </div>
    </div>
  )
}

