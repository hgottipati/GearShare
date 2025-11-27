'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase-client'

interface Announcement {
  id: string
  title: string
  content: string
  is_pinned: boolean
  created_at: string
}

export default function Announcements() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const supabase = createClient()

  useEffect(() => {
    loadAnnouncements()
  }, [])

  const loadAnnouncements = async () => {
    const { data } = await supabase
      .from('announcements')
      .select('*')
      .order('is_pinned', { ascending: false })
      .order('created_at', { ascending: false })
      .limit(5)

    if (data) {
      setAnnouncements(data)
    }
  }

  if (announcements.length === 0) return null

  return (
    <div className="mb-6 space-y-4">
      {announcements.map((announcement) => (
        <div
          key={announcement.id}
          className={`bg-white rounded-lg shadow-sm p-4 border ${
            announcement.is_pinned
              ? 'border-blue-300 bg-blue-50'
              : 'border-gray-200'
          }`}
        >
          {announcement.is_pinned && (
            <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded mb-2 inline-block font-semibold">
              Pinned
            </span>
          )}
          <h3 className="font-semibold text-lg mb-2 text-gray-900">{announcement.title}</h3>
          <p className="text-gray-700 whitespace-pre-wrap">{announcement.content}</p>
        </div>
      ))}
    </div>
  )
}

