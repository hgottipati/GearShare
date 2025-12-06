'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase-client'
import { Package, Users, TrendingUp } from 'lucide-react'

interface Stats {
  listingsCount: number
  enrollmentsCount: number
  recentEnrollments: number
}

export default function LiveStats() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    loadStats()
    // Refresh stats every 5 minutes
    const interval = setInterval(loadStats, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  const loadStats = async () => {
    try {
      // Get active listings count
      const { count: listingsCount } = await supabase
        .from('listings')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true)

      // Get total enrollments
      const { count: enrollmentsCount } = await supabase
        .from('ski_lesson_submissions')
        .select('*', { count: 'exact', head: true })

      // Get recent enrollments (last 7 days)
      const sevenDaysAgo = new Date()
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
      const { count: recentEnrollments } = await supabase
        .from('ski_lesson_submissions')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', sevenDaysAgo.toISOString())

      setStats({
        listingsCount: listingsCount || 0,
        enrollmentsCount: enrollmentsCount || 0,
        recentEnrollments: recentEnrollments || 0,
      })
    } catch (error) {
      console.error('Error loading stats:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex flex-wrap justify-center gap-8 md:gap-12 text-center">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse">
            <div className="h-8 w-24 bg-gray-200 rounded mb-1"></div>
            <div className="h-4 w-32 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    )
  }

  if (!stats) return null

  return (
    <div className="flex flex-wrap justify-center gap-8 md:gap-12 text-center">
      <div>
        <div className="flex items-center justify-center gap-2 mb-1">
          <Package className="w-5 h-5 text-blue-600" />
          <div className="text-3xl font-bold text-gray-900">{stats.listingsCount}</div>
        </div>
        <div className="text-sm text-gray-600">Active Listings</div>
      </div>
      <div>
        <div className="flex items-center justify-center gap-2 mb-1">
          <Users className="w-5 h-5 text-green-600" />
          <div className="text-3xl font-bold text-gray-900">{stats.enrollmentsCount}</div>
        </div>
        <div className="text-sm text-gray-600">Students Enrolled</div>
      </div>
      <div>
        <div className="flex items-center justify-center gap-2 mb-1">
          <TrendingUp className="w-5 h-5 text-orange-600" />
          <div className="text-3xl font-bold text-gray-900">{stats.recentEnrollments}</div>
        </div>
        <div className="text-sm text-gray-600">This Week</div>
      </div>
    </div>
  )
}

