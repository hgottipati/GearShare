'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Twitter, Youtube, Linkedin, Mail, Shield, Lock, Eye, UserCheck } from 'lucide-react'

export default function LandingFooter() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand Section */}
          <div>
            <Link href="/" className="flex items-center mb-4">
              <Image
                src="/logo.png"
                alt="GearShare"
                width={120}
                height={40}
                className="h-10 w-auto brightness-0 invert"
                unoptimized
              />
            </Link>
            <p className="text-sm text-gray-400 mb-4 max-w-xs">
              Private gear marketplace that transforms how you buy, sell, trade, and rent equipment with your community.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Youtube className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Product</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#features" className="text-gray-400 hover:text-white transition-colors text-sm">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="#features" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Features
                </Link>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Pricing
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
                  API
                </a>
              </li>
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Contact
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Careers
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Blog
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Security Badges */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <div className="flex items-center gap-2 bg-gray-800 px-4 py-2 rounded-full">
            <Shield className="w-4 h-4 text-green-500" />
            <span className="text-xs font-medium">SSL Secured</span>
          </div>
          <div className="flex items-center gap-2 bg-gray-800 px-4 py-2 rounded-full">
            <Lock className="w-4 h-4 text-blue-500" />
            <span className="text-xs font-medium">Data Encrypted</span>
          </div>
          <div className="flex items-center gap-2 bg-gray-800 px-4 py-2 rounded-full">
            <Eye className="w-4 h-4 text-purple-500" />
            <span className="text-xs font-medium">Privacy Protected</span>
          </div>
          <div className="flex items-center gap-2 bg-gray-800 px-4 py-2 rounded-full">
            <UserCheck className="w-4 h-4 text-orange-500" />
            <span className="text-xs font-medium">Private Community</span>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-400">
              © 2025 GearShare. All rights reserved.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">
                Terms of Service
              </a>
              <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">
                Cookie Policy
              </a>
              <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">
                Security
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

