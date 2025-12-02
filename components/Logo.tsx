'use client'

import Link from 'next/link'
import Image from 'next/image'

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
  const iconSize = sizeClasses[size].icon

  const logoContent = (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <div className={`relative ${iconSize} flex items-center justify-center`}>
        <Image
          src="/logo.png"
          alt="ShareMyGear Logo"
          width={32}
          height={32}
          className="w-full h-full object-contain"
          priority
        />
      </div>
      {showText && (
        <span className={`${sizeClasses[size].text} font-semibold tracking-tight`}>
          {isDark ? (
            <>
              <span className="text-gray-200">ShareMy</span>
              <span className="text-gray-300">Gear</span>
            </>
          ) : (
            <>
              <span className="text-gray-900">ShareMy</span>
              <span className="text-blue-700">Gear</span>
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

