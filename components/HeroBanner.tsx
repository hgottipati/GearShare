'use client'

import Link from 'next/link'
import { useAuth } from '@/app/providers'

export default function HeroBanner() {
  const { user } = useAuth()

  if (!user) return null

  return (
    <div className="mb-12">
      <div className="max-w-4xl">
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4 leading-tight">
          Community{' '}
          <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Gear Marketplace
          </span>
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl leading-relaxed">
          Buy, sell, trade, or rent ski equipment with your ski lessons community. Connect with fellow
          families and find the perfect gear for your next adventure.
        </p>
        <div className="flex flex-wrap gap-4">
          <Link
            href="/listings/create"
            className="bg-blue-600 text-white px-8 py-3.5 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-sm hover:shadow-md"
          >
            Create Listing
          </Link>
          <Link
            href="/profile"
            className="bg-white text-gray-700 px-8 py-3.5 rounded-lg font-semibold hover:bg-gray-50 transition-colors border-2 border-gray-300 hover:border-gray-400"
          >
            View Profile
          </Link>
        </div>
      </div>
    </div>
  )
}

