'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import LandingNavbar from '@/components/LandingNavbar'
import LandingFooter from '@/components/LandingFooter'
import { 
  CheckCircle2, 
  Circle,
  ShoppingBag, 
  ExternalLink, 
  MapPin, 
  Calendar,
  Info,
  ArrowLeft,
  Package,
  ChevronDown,
  ChevronUp,
  Sparkles,
  TrendingUp,
  DollarSign,
  Layers,
  Heart
} from 'lucide-react'

interface GearItem {
  id: string
  name: string
  category: string
  required: boolean
  canRent: boolean
  description?: string
  links?: { label: string; url: string }[]
  tips?: string[]
}

const gearItems: GearItem[] = [
  // Clothing - Must Purchase
  { id: 'base-top', name: 'Long-sleeve thermal top', category: 'clothing', required: true, canRent: false, description: 'Synthetic or wool materials are better than cotton', tips: ['Fitted, moisture-wicking materials keep them dry', 'Avoid cotton - it retains moisture'] },
  { id: 'base-bottom', name: 'Thermal leggings or long underwear', category: 'clothing', required: true, canRent: false, description: 'Avoid cotton - it gets wet and cold', tips: ['Base layer should be fitted, not loose'] },
  { id: 'fleece', name: 'Fleece sweater or mid-layer', category: 'clothing', required: false, canRent: false, description: 'For extra warmth - insulation is key', tips: ['Fleece is a great, lightweight option', 'Perfect for layering'] },
  { id: 'ski-jacket', name: 'Insulated ski jacket', category: 'clothing', required: true, canRent: false, description: 'Waterproof and windproof recommended', tips: ['Look for breathable materials', 'Ensure proper fit for layering'] },
  { id: 'ski-pants', name: 'Ski pants or bibs', category: 'clothing', required: true, canRent: false, description: 'Waterproof and windproof to shield against the elements', tips: ['Bibs are great for keeping snow out', 'Look for adjustable waistbands for growing kids'] },
  { id: 'gloves', name: 'Waterproof gloves or mittens', category: 'clothing', required: true, canRent: false, description: 'Thick, insulated to keep little hands warm and dry', tips: ['Mittens are warmer for kids', 'Consider an extra pair in case first gets wet'] },
  { id: 'ski-socks', name: 'Ski socks', category: 'clothing', required: true, canRent: false, description: 'A single pair of thick, warm socks. Avoid cotton, opt for wool and synthetic blends', tips: ['Avoid layering socks to prevent blisters', 'Moisture-wicking is essential'] },
  { id: 'neck-warmer', name: 'Neck warmer or balaclava', category: 'clothing', required: false, canRent: false, description: 'Optional but recommended for extra warmth' },
  
  // Safety - Must Purchase
  { id: 'helmet', name: 'Ski helmet', category: 'safety', required: true, canRent: false, description: 'Safety first! A well-fitted helmet is non-negotiable. Look for ASTM F2040 or CE EN 1077 certification', links: [
    { label: 'Standard Sizes - Amazon', url: 'https://a.co/d/ivlaa2g' },
    { label: 'Extra Small Sizes - Amazon', url: 'https://a.co/d/gFzgsS1' }
  ] },
  { id: 'goggles', name: 'Goggles', category: 'safety', required: true, canRent: false, description: 'Protect those peepers from UV rays and blinding snow. Look for anti-fog coating and UV protection', links: [
    { label: 'Option 1 - Amazon', url: 'https://a.co/d/9WTCrGf' },
    { label: 'Option 2 - Amazon', url: 'https://a.co/d/7UH3UYs' }
  ] },
  
  // Equipment - Can Rent
  { id: 'skis', name: 'Skis', category: 'equipment', required: true, canRent: true, description: 'Lightweight and size-appropriate skis for easier control', tips: ['Shorter skis are easier for beginners to learn', 'Should reach between chin and nose when standing', 'Match to child\'s height and weight'] },
  { id: 'boots', name: 'Ski boots', category: 'equipment', required: true, canRent: true, description: 'Comfortable, properly sized boots make all the difference', tips: ['Must fit snugly but not be painful', 'Proper fit is crucial for control and safety', 'Should allow for one pair of ski socks only'] },
  { id: 'poles', name: 'Poles', category: 'equipment', required: false, canRent: true, description: 'Optional for beginners but useful as they progress', tips: ['Often not needed in first lessons', 'When ready, should reach from ground to armpit'] },
  
  // Extras
  { id: 'hand-warmers', name: 'Hand warmers', category: 'extras', required: false, canRent: false, description: 'Disposable or rechargeable' },
  { id: 'backpack', name: 'Backpack', category: 'extras', required: false, canRent: false, description: 'For snacks, water, and extra layers' },
  { id: 'water-bottle', name: 'Water bottle', category: 'extras', required: false, canRent: false, description: 'Insulated to prevent freezing' },
  { id: 'sunscreen', name: 'Sunscreen (SPF 30+)', category: 'extras', required: false, canRent: false, description: 'For face, even on cloudy days' },
  { id: 'lip-balm', name: 'Lip balm with SPF', category: 'extras', required: false, canRent: false },
  { id: 'extra-gloves', name: 'Extra pair of gloves', category: 'extras', required: false, canRent: false, description: 'In case first pair gets wet' },
]

const categories = [
  { id: 'clothing', name: 'Clothing & Layering', icon: Layers, color: 'blue', description: 'Must purchase - cannot be rented' },
  { id: 'safety', name: 'Safety Essentials', icon: CheckCircle2, color: 'red', description: 'Must purchase - cannot be rented' },
  { id: 'equipment', name: 'Ski Equipment', icon: ShoppingBag, color: 'green', description: 'Can be rented (~$180/full season) or purchased' },
  { id: 'extras', name: 'Extras & Comfort', icon: Sparkles, color: 'purple', description: 'Optional but recommended' },
]

const rentalLocations = [
  {
    name: 'Play It Again Sports - Lynnwood',
    description: 'Full-season rentals available. Appointment required.',
    mapUrl: 'https://maps.app.goo.gl/jYuCujodrupQ6Buj7',
    bookingUrl: 'https://playitagainsportslynnwood.simplybook.me/v2/#book',
  },
  {
    name: 'Play It Again Sports - Woodinville',
    description: 'Full-season rentals available. Appointment required.',
    mapUrl: 'https://maps.app.goo.gl/zVX931wHkLXUGjvJ6',
    bookingUrl: 'https://playitagainsportswoodinville.simplybook.me/v2/#book',
  },
  {
    name: 'Superior Seconds - Issaquah',
    description: 'Used ski equipment store - great for buying and selling gear.',
    mapUrl: null,
    bookingUrl: 'https://superiorseconds.myshopify.com',
    bookingLabel: 'Visit Online Store',
  },
]

export default function GearListPage() {
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set())
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(['clothing', 'safety', 'equipment']))
  const [showProgress, setShowProgress] = useState(true)

  // Load checked items from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('gear-checklist')
    if (saved) {
      setCheckedItems(new Set(JSON.parse(saved)))
    }
  }, [])

  // Save checked items to localStorage
  useEffect(() => {
    localStorage.setItem('gear-checklist', JSON.stringify(Array.from(checkedItems)))
  }, [checkedItems])

  const toggleItem = (itemId: string) => {
    setCheckedItems(prev => {
      const next = new Set(prev)
      if (next.has(itemId)) {
        next.delete(itemId)
      } else {
        next.add(itemId)
      }
      return next
    })
  }

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev => {
      const next = new Set(prev)
      if (next.has(categoryId)) {
        next.delete(categoryId)
      } else {
        next.add(categoryId)
      }
      return next
    })
  }

  const requiredItems = gearItems.filter(item => item.required)
  const checkedRequired = requiredItems.filter(item => checkedItems.has(item.id)).length
  const totalRequired = requiredItems.length
  const progress = totalRequired > 0 ? Math.round((checkedRequired / totalRequired) * 100) : 0

  const getCategoryItems = (categoryId: string) => {
    return gearItems.filter(item => item.category === categoryId)
  }

  const getCategoryProgress = (categoryId: string) => {
    const items = getCategoryItems(categoryId)
    const checked = items.filter(item => checkedItems.has(item.id)).length
    return items.length > 0 ? Math.round((checked / items.length) * 100) : 0
  }

  return (
    <>
      <LandingNavbar />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 pt-16">
        {/* Hero Section with Image */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-12 relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-white/10 opacity-20"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="flex items-center mb-4">
              <Link
                href="/ski-lessons/program"
                className="flex items-center text-blue-100 hover:text-white transition-colors mb-4 group"
              >
                <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
                Back to Program
              </Link>
            </div>
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold mb-4 animate-fade-in-up">
                  Get Kids Slope Ready! ⛷️
                </h1>
                <p className="text-xl md:text-2xl text-blue-100 mb-4">
                  Skiing is not just a sport; it&apos;s a family adventure that brings joy, laughter, and unforgettable memories.
                </p>
                <p className="text-lg text-blue-200">
                  Before your kids can make their first triumphant swish down the slopes, let&apos;s make sure they have everything they need to stay warm, safe, and focused on having fun.
                </p>
              </div>
              <div className="relative h-64 md:h-80 rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src="/image-skigear.png"
                  alt="Happy family in ski gear ready for the slopes"
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Progress Card */}
          {showProgress && (
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl shadow-xl p-8 mb-8 text-white animate-fade-in-up">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                    <TrendingUp className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">Your Progress</h2>
                    <p className="text-green-100 text-sm">Required items checklist</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowProgress(false)}
                  className="text-white/80 hover:text-white transition-colors text-2xl leading-none"
                  aria-label="Close progress"
                >
                  ×
                </button>
              </div>
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-lg font-semibold">
                    {checkedRequired} of {totalRequired} required items
                  </span>
                  <span className="text-2xl font-bold">{progress}%</span>
                </div>
                <div className="w-full bg-white/20 rounded-full h-4 overflow-hidden backdrop-blur-sm">
                  <div 
                    className="h-full bg-white rounded-full transition-all duration-500 ease-out shadow-lg"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>
              {progress === 100 && (
                <div className="flex items-center gap-2 text-green-100 mt-4 animate-pulse">
                  <CheckCircle2 className="w-5 h-5" />
                  <span className="font-semibold">🎉 All required items checked! You&apos;re ready to hit the slopes!</span>
                </div>
              )}
            </div>
          )}

          {/* Introduction Section */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border-2 border-blue-100">
            <div className="prose max-w-none">
              <p className="text-lg text-gray-700 leading-relaxed mb-4">
                Watching your kids make their first tentative slide down the bunny slope or their triumphant swish down an intermediate run is as rewarding as it gets. However, before the family can enjoy these moments, you need to answer: <strong>&quot;What do kids need for skiing?&quot;</strong>
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                From choosing ski equipment for kids to ensuring they&apos;re dressed warmly enough to enjoy themselves, this comprehensive guide will cover all you need to know to make your family skiing trip a success.
              </p>
            </div>
          </div>

          {/* Cutting Costs Section */}
          <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl shadow-lg p-8 mb-8 border-2 border-orange-200">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 bg-orange-100 rounded-xl flex items-center justify-center border-2 border-orange-200">
                <DollarSign className="w-7 h-7 text-orange-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Cutting Costs, Not Corners</h2>
                <p className="text-gray-600">Skiing can be pricey, but there are smart ways to outfit your kids without breaking the bank</p>
              </div>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl p-6 border-2 border-orange-100 hover:border-orange-300 transition-colors">
                <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-orange-600" />
                  Rentals
                </h3>
                <p className="text-gray-700 text-sm mb-3">
                  Consider renting equipment, especially if your child is still growing rapidly. Equipment can be rented for ~$180/full season.
                </p>
                <p className="text-xs text-gray-600 italic">
                  Check out the local Equipment Rental Locations below.
                </p>
              </div>
              <div className="bg-white rounded-xl p-6 border-2 border-orange-100 hover:border-orange-300 transition-colors">
                <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-orange-600" />
                  End-of-Season Sales
                </h3>
                <p className="text-gray-700 text-sm">
                  The best deals are often found as the season winds down. Plan ahead and stock up for next year!
                </p>
              </div>
              <div className="bg-white rounded-xl p-6 border-2 border-orange-100 hover:border-orange-300 transition-colors">
                <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <Package className="w-5 h-5 text-orange-600" />
                  Swap Clubs & Second-Hand
                </h3>
                <p className="text-gray-700 text-sm">
                  Gently used gear at a fraction of the cost. 
                  You can ask for used gear at the local stores or checkout our <a href="https://sharemygear.vercel.app/marketplace-landing" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">Gear Marketplace</a> for local gear swaps.
                </p>
              </div>
            </div>
          </div>

          {/* Dress to Impress Section */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl shadow-lg p-8 mb-8 border-2 border-blue-200">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center border-2 border-blue-200">
                <Layers className="w-7 h-7 text-blue-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Dress to Impress: The Importance of Layering</h2>
                <p className="text-gray-600">Keeping kids warm on the slopes is all about choosing the right materials and doing them in layers</p>
              </div>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl p-6 border-2 border-blue-100">
                <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <span className="text-2xl">1️⃣</span>
                  Base Layer
                </h3>
                <p className="text-gray-700 text-sm">
                  Fitted, moisture-wicking materials to keep them dry. Synthetic or wool materials are better than cotton. Cotton retains moisture and can make kids cold.
                </p>
              </div>
              <div className="bg-white rounded-xl p-6 border-2 border-blue-100">
                <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <span className="text-2xl">2️⃣</span>
                  Mid Layer
                </h3>
                <p className="text-gray-700 text-sm">
                  Insulation is key. Fleece is a great, lightweight option for extra warmth between the base and outer layers.
                </p>
              </div>
              <div className="bg-white rounded-xl p-6 border-2 border-blue-100">
                <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <span className="text-2xl">3️⃣</span>
                  Outer Layer
                </h3>
                <p className="text-gray-700 text-sm">
                  Waterproof and windproof jackets and pants shield against the elements. Look for breathable materials that allow moisture to escape.
                </p>
              </div>
            </div>
            <div className="mt-6 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg">
              <p className="text-sm text-yellow-900">
                <strong>💡 Sock Tip:</strong> A single pair of thick, warm socks. Avoid cotton, and opt for blends of wool and synthetic. <strong>Avoid layering socks to prevent blisters.</strong>
              </p>
            </div>
          </div>

          {/* Important Note */}
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-lg mb-8 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start">
              <Info className="w-6 h-6 text-yellow-600 mr-3 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-yellow-900 mb-2">Important Reminder</h3>
                <p className="text-yellow-800">
                  All participants must have ski gear ready (skis, boots, helmet, gloves, goggles, and warm clothing) 
                  before the first class. If you need help finding rentals or purchasing gear, I&apos;m happy to assist!
                </p>
              </div>
            </div>
          </div>

          {/* Gear Categories */}
          <div className="space-y-6 mb-8">
            {categories.map((category) => {
              const CategoryIcon = category.icon
              const items = getCategoryItems(category.id)
              const categoryProgress = getCategoryProgress(category.id)
              const isExpanded = expandedCategories.has(category.id)
              const colorClasses = {
                blue: 'bg-blue-100 text-blue-600 border-blue-200',
                red: 'bg-red-100 text-red-600 border-red-200',
                green: 'bg-green-100 text-green-600 border-green-200',
                purple: 'bg-purple-100 text-purple-600 border-purple-200',
              }

              return (
                <div
                  key={category.id}
                  className="bg-white rounded-xl shadow-lg overflow-hidden border-2 border-gray-100 hover:shadow-xl transition-all duration-300"
                >
                  {/* Category Header */}
                  <button
                    onClick={() => toggleCategory(category.id)}
                    className="w-full p-6 flex items-center justify-between hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div className={`w-14 h-14 ${colorClasses[category.color as keyof typeof colorClasses]} rounded-xl flex items-center justify-center border-2`}>
                        <CategoryIcon className="w-7 h-7" />
                      </div>
                      <div className="text-left flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <h2 className="text-2xl font-bold text-gray-900">{category.name}</h2>
                          <span className="text-sm font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                            {items.filter(i => checkedItems.has(i.id)).length}/{items.length}
                          </span>
                        </div>
                        <p className="text-gray-600 text-sm">{category.description}</p>
                        {items.length > 0 && (
                          <div className="mt-2 w-full bg-gray-200 rounded-full h-2 max-w-xs">
                            <div
                              className={`h-2 rounded-full transition-all duration-500 ${
                                category.color === 'blue' ? 'bg-blue-600' :
                                category.color === 'red' ? 'bg-red-600' :
                                category.color === 'green' ? 'bg-green-600' :
                                'bg-purple-600'
                              }`}
                              style={{ width: `${categoryProgress}%` }}
                            ></div>
                          </div>
                        )}
                      </div>
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="w-6 h-6 text-gray-400 flex-shrink-0" />
                    ) : (
                      <ChevronDown className="w-6 h-6 text-gray-400 flex-shrink-0" />
                    )}
                  </button>

                  {/* Category Items */}
                  {isExpanded && (
                    <div className="px-6 pb-6 space-y-3 animate-fade-in-up">
                      {items.map((item) => {
                        const isChecked = checkedItems.has(item.id)
                        return (
                          <div
                            key={item.id}
                            className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                              isChecked
                                ? 'bg-green-50 border-green-200'
                                : 'bg-gray-50 border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <button
                                onClick={() => toggleItem(item.id)}
                                className="mt-0.5 flex-shrink-0 focus:outline-none group"
                                aria-label={`${isChecked ? 'Uncheck' : 'Check'} ${item.name}`}
                              >
                                {isChecked ? (
                                  <CheckCircle2 className="w-6 h-6 text-green-600 group-hover:scale-110 transition-transform" />
                                ) : (
                                  <Circle className="w-6 h-6 text-gray-400 group-hover:text-gray-600 transition-colors" />
                                )}
                              </button>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-2">
                                  <div className="flex-1">
                                    <h3 className={`font-semibold mb-1 ${isChecked ? 'text-green-900 line-through' : 'text-gray-900'}`}>
                                      {item.name}
                                      {item.required && (
                                        <span className="ml-2 text-xs font-bold text-red-600">REQUIRED</span>
                                      )}
                                    </h3>
                                    {item.description && (
                                      <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                                    )}
                                    {item.tips && item.tips.length > 0 && (
                                      <div className="mt-2 space-y-1">
                                        {item.tips.map((tip, idx) => (
                                          <p key={idx} className="text-xs text-gray-500 flex items-start">
                                            <span className="mr-1">💡</span>
                                            {tip}
                                          </p>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                  {item.canRent && (
                                    <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full flex-shrink-0">
                                      Can Rent
                                    </span>
                                  )}
                                </div>
                                {item.links && item.links.length > 0 && (
                                  <div className="mt-3 flex flex-wrap gap-2">
                                    {item.links.map((link, idx) => (
                                      <a
                                        key={idx}
                                        href={link.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center text-xs text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-md transition-colors font-medium"
                                      >
                                        <ExternalLink className="w-3 h-3 mr-1.5" />
                                        {link.label}
                                      </a>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* Rental Locations */}
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8 border-2 border-orange-200">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mr-4 border-2 border-orange-200">
                <MapPin className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Equipment Rental Locations</h2>
                <p className="text-gray-600">Local options for renting ski equipment</p>
              </div>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {rentalLocations.map((location, idx) => (
                <div
                  key={idx}
                  className="border-2 border-gray-200 rounded-xl p-6 hover:shadow-lg hover:border-orange-300 transition-all duration-200 bg-gradient-to-br from-white to-orange-50/30"
                >
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 flex-1">
                      {location.name}
                    </h3>
                    <Calendar className="w-5 h-5 text-orange-600 flex-shrink-0" />
                  </div>
                  <p className="text-gray-600 text-sm mb-4">{location.description}</p>
                  <div className="space-y-2">
                    {location.mapUrl && (
                      <a
                        href={location.mapUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-sm text-blue-600 hover:text-blue-800 transition-colors font-medium"
                      >
                        <MapPin className="w-4 h-4 mr-2" />
                        View on Maps
                        <ExternalLink className="w-3 h-3 ml-1.5" />
                      </a>
                    )}
                    <a
                      href={location.bookingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-sm text-blue-600 hover:text-blue-800 transition-colors font-medium"
                    >
                      <Calendar className="w-4 h-4 mr-2" />
                      {location.bookingLabel || 'Book Appointment'}
                      <ExternalLink className="w-3 h-3 ml-1.5" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Making Memories Section */}
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl shadow-lg p-8 mb-8 border-2 border-purple-200">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center border-2 border-purple-200">
                <Heart className="w-7 h-7 text-purple-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Making Memories Without the Chill</h2>
                <p className="text-gray-600">Skiing with kids is more than just the gear</p>
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 border-2 border-purple-100">
              <p className="text-gray-700 leading-relaxed mb-4">
                Skiing with kids is more than just the gear; it&apos;s about making the mountain a place of joy and discovery. With the right preparation, your little ones will stay warm, safe, and focused on having fun.
              </p>
              <p className="text-gray-700 leading-relaxed font-semibold">
                Once your kids are outfitted from helmet to boots and layers sorted, the slopes await. Whether it&apos;s their first time on skis or they&apos;re already zooming past you, the right gear and preparation make all the difference.
              </p>
            </div>
          </div>

          {/* CTA Section */}
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl shadow-xl p-8 text-center text-white">
            <h2 className="text-2xl font-bold mb-4">Need Help with Gear?</h2>
            <p className="text-orange-100 mb-6 text-lg">
              If you need assistance finding rentals or purchasing gear, I&apos;m happy to help! 
              Mention it in your lesson enrollment form.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/ski-lessons"
                className="inline-flex items-center px-8 py-3 bg-white text-orange-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors shadow-lg hover:scale-105 transform"
              >
                Enroll in Lessons
              </Link>
              <Link
                href="/ski-lessons/program"
                className="inline-flex items-center px-8 py-3 bg-white/20 text-white rounded-lg font-semibold hover:bg-white/30 transition-colors border-2 border-white hover:scale-105 transform"
              >
                View Lesson Program
              </Link>
            </div>
          </div>

          {/* Final CTA */}
          <div className="mt-8 text-center">
            <p className="text-2xl font-bold text-gray-900 mb-2">
              Now for the easy part:
            </p>
            <p className="text-xl text-gray-700">
              Get suited, booted, and have some fun out there! 🎿
            </p>
          </div>
        </div>
      </div>
      <LandingFooter />
    </>
  )
}
