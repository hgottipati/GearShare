'use client'

import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'
import { Menu, X, ChevronDown } from 'lucide-react'
import Logo from './Logo'

export default function LandingNavbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [skiLessonsDropdownOpen, setSkiLessonsDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setSkiLessonsDropdownOpen(false)
      }
    }

    if (skiLessonsDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [skiLessonsDropdownOpen])

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-white/95 backdrop-blur-md shadow-lg' 
        : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Logo href="/" size="md" />

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="#features"
              className="text-gray-700 hover:text-gray-900 font-medium transition-colors"
            >
              Features
            </Link>
            {/* Ski Lessons Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setSkiLessonsDropdownOpen(!skiLessonsDropdownOpen)}
                className="flex items-center text-gray-700 hover:text-gray-900 font-medium transition-colors"
              >
                🎿 Ski Lessons
                <ChevronDown
                  className={`ml-1 w-4 h-4 transition-transform ${
                    skiLessonsDropdownOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {skiLessonsDropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                  <Link
                    href="/ski-lessons"
                    onClick={() => setSkiLessonsDropdownOpen(false)}
                    className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                  >
                    Interest Form
                  </Link>
                  <Link
                    href="/ski-lessons/program"
                    onClick={() => setSkiLessonsDropdownOpen(false)}
                    className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                  >
                    Lesson Program
                  </Link>
                  <Link
                    href="/ski-lessons/program/gear-list"
                    onClick={() => setSkiLessonsDropdownOpen(false)}
                    className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                  >
                    Gear Checklist
                  </Link>
                </div>
              )}
            </div>
            <Link
              href="/login"
              className="text-gray-700 hover:text-gray-900 font-medium transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/login?mode=signup"
              className="px-6 py-2 bg-blue-700 text-white rounded-lg font-semibold hover:bg-blue-800 transition-colors"
            >
              Join
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-gray-700 hover:text-gray-900"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4 bg-white/95 backdrop-blur-md">
            <div className="space-y-2">
              <Link
                href="#features"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-md font-medium"
              >
                Features
              </Link>
              <div className="px-4 py-2">
                <div className="text-gray-700 font-medium mb-2">🎿 Ski Lessons</div>
                <div className="pl-4 space-y-1">
                  <Link
                    href="/ski-lessons"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-2 text-gray-600 hover:bg-gray-50 rounded-md font-medium text-sm"
                  >
                    Interest Form
                  </Link>
                  <Link
                    href="/ski-lessons/program"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-2 text-gray-600 hover:bg-gray-50 rounded-md font-medium text-sm"
                  >
                    Lesson Program
                  </Link>
                  <Link
                    href="/ski-lessons/program/gear-list"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-2 text-gray-600 hover:bg-gray-50 rounded-md font-medium text-sm"
                  >
                    Gear Checklist
                  </Link>
                </div>
              </div>
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-md font-medium"
              >
                Sign In
              </Link>
              <Link
                href="/login?mode=signup"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-2 bg-blue-700 text-white rounded-lg font-semibold text-center hover:bg-blue-800 transition-colors"
              >
                Join
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

