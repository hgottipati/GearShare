'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { Home, Plus, User, Settings } from 'lucide-react'
import { useAuth } from '@/app/providers'
import { createClient } from '@/lib/supabase-client'
import { useState, useEffect } from 'react'

export default function MobileBottomNav() {
  const pathname = usePathname()
  const { user } = useAuth()
  const supabase = createClient()
  const [isAdmin, setIsAdmin] = useState(false)

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
    }
  }, [user, supabase])

  if (!user) return null

  const isActive = (path: string) => pathname === path

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
      <div className="flex justify-around items-center h-16">
        <Link
          href="/"
          className={`flex flex-col items-center justify-center flex-1 h-full ${
            isActive('/') ? 'text-blue-600' : 'text-gray-600'
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
          href="/profile"
          className={`flex flex-col items-center justify-center flex-1 h-full ${
            isActive('/profile') ? 'text-blue-600' : 'text-gray-600'
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

