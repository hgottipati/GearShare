'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { Home, Plus, User, Settings, MessageSquare } from 'lucide-react'
import { useAuth } from '@/app/providers'
import { createClient } from '@/lib/supabase-client'
import { useState, useEffect } from 'react'

export default function MobileBottomNav() {
  const pathname = usePathname()
  const { user } = useAuth()
  const supabase = createClient()
  const [isAdmin, setIsAdmin] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    if (user) {
      supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', user.id)
        .single()
        .then(({ data }: { data: { is_admin: boolean } | null }) => {
          if (data) setIsAdmin(data.is_admin)
        })

      // Load unread message count
      supabase
        .from('messages')
        .select('id', { count: 'exact', head: true })
        .eq('receiver_id', user.id)
        .eq('read', false)
        .then(({ count }: { count: number | null }) => {
          setUnreadCount(count || 0)
        })

      // Set up real-time subscription for new messages
      const channel = supabase
        .channel('mobile-messages')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'messages',
            filter: `receiver_id=eq.${user.id}`,
          },
          () => {
            // Refresh count when messages change
            supabase
              .from('messages')
              .select('id', { count: 'exact', head: true })
              .eq('receiver_id', user.id)
              .eq('read', false)
              .then(({ count }: { count: number | null }) => {
                setUnreadCount(count || 0)
              })
          }
        )
        .subscribe()

      return () => {
        supabase.removeChannel(channel)
      }
    }
  }, [user, supabase])

  if (!user) return null

  const isActive = (path: string) => {
    if (path === '/profile') {
      // Check if we're on profile but not messages tab
      return pathname === path && !(typeof window !== 'undefined' && window.location.search.includes('tab=messages'))
    }
    if (path === '/marketplace') {
      return pathname === path || pathname === '/'
    }
    return pathname === path
  }
  const isMessagesActive = pathname === '/profile' && typeof window !== 'undefined' && window.location.search.includes('tab=messages')

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
      <div className="flex justify-around items-center h-16">
        <Link
          href="/marketplace"
          className={`flex flex-col items-center justify-center flex-1 h-full ${
            isActive('/marketplace') ? 'text-blue-600' : 'text-gray-600'
          }`}
        >
          <Home size={20} />
          <span className="text-xs mt-1">Home</span>
        </Link>
        <Link
          href="/listings/create"
          className={`flex flex-col items-center justify-center flex-1 h-full ${
            isActive('/listings/create') ? 'text-blue-600' : 'text-gray-600'
          }`}
        >
          <Plus size={20} />
          <span className="text-xs mt-1">Create</span>
        </Link>
        <Link
          href="/profile?tab=messages"
          className={`relative flex flex-col items-center justify-center flex-1 h-full ${
            isMessagesActive ? 'text-blue-600' : 'text-gray-600'
          }`}
        >
          <MessageSquare size={20} />
          <span className="text-xs mt-1">Messages</span>
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1/2 translate-x-3 bg-red-500 text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </Link>
        <Link
          href="/profile"
          className={`flex flex-col items-center justify-center flex-1 h-full ${
            isActive('/profile') && !isMessagesActive ? 'text-blue-600' : 'text-gray-600'
          }`}
        >
          <User size={20} />
          <span className="text-xs mt-1">Profile</span>
        </Link>
        {isAdmin && (
          <Link
            href="/admin"
            className={`flex flex-col items-center justify-center flex-1 h-full ${
              isActive('/admin') ? 'text-blue-600' : 'text-gray-600'
            }`}
          >
            <Settings size={20} />
            <span className="text-xs mt-1">Admin</span>
          </Link>
        )}
      </div>
    </nav>
  )
}

