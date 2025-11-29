'use client'

import Link from 'next/link'
import { ShoppingBag } from 'lucide-react'

interface LogoProps {
  className?: string
  showText?: boolean
  size?: 'sm' | 'md' | 'lg'
  href?: string | null
  variant?: 'light' | 'dark'
}

export default function Logo({ 
  className = '', 
  showText = true, 
  size = 'md',
  href = '/',
  variant = 'light'
}: LogoProps) {
  const sizeClasses = {
    sm: { icon: 'w-6 h-6', text: 'text-xl' },
    md: { icon: 'w-8 h-8', text: 'text-2xl' },
    lg: { icon: 'w-10 h-10', text: 'text-3xl' }
  }

  const isDark = variant === 'dark'

  const logoContent = (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="relative">
        <div className={`${sizeClasses[size].icon} bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center shadow-md`}>
          <ShoppingBag className="w-1/2 h-1/2 text-white" />
        </div>
        <div className={`absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full ${isDark ? 'border-2 border-gray-900' : 'border-2 border-white'}`}></div>
      </div>
      {showText && (
        <span className={`${sizeClasses[size].text} font-bold`}>
          {isDark ? (
            <>
              <span className="text-orange-400">ShareMy</span>
              <span className="text-blue-400">Gear</span>
            </>
          ) : (
            <>
              <span className="bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
                ShareMy
              </span>
              <span className="bg-gradient-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent">
                Gear
              </span>
            </>
          )}
        </span>
      )}
    </div>
  )

  if (href) {
    return (
      <Link href={href} className="hover:opacity-90 transition-opacity">
        {logoContent}
      </Link>
    )
  }

  return logoContent
}

