'use client'

import Link from 'next/link'
import LandingNavbar from '@/components/LandingNavbar'
import LandingFooter from '@/components/LandingFooter'
import { 
  CheckCircle2, 
  ShoppingBag, 
  ExternalLink, 
  MapPin, 
  Calendar,
  Info,
  ArrowLeft,
  Package
} from 'lucide-react'

export default function GearListPage() {
  return (
    <>
      <LandingNavbar />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 pt-16">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center mb-4">
              <Link
                href="/ski-lessons/program"
                className="flex items-center text-blue-100 hover:text-white transition-colors mb-4"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Program
              </Link>
            </div>
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                ⛷️ Complete Ski Gear Checklist
              </h1>
              <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto">
                Everything your child needs to be ready for ski lessons. Organized by category with helpful tips and links.
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Important Note */}
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-lg mb-8">
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

          {/* Quick Tips */}
          <div className="bg-blue-50 rounded-lg p-6 mb-8 border border-blue-200">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <Info className="w-6 h-6 text-blue-600 mr-2" />
              Pro Tips for Parents
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-start">
                <CheckCircle2 className="w-5 h-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">
                  <strong>Rent for growing kids</strong> unless skiing frequently. Equipment can be rented for ~$180/full season.
                </span>
              </div>
              <div className="flex items-start">
                <CheckCircle2 className="w-5 h-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">
                  <strong>Ask for used gear</strong> to buy so you can sell them back next season.
                </span>
              </div>
              <div className="flex items-start">
                <CheckCircle2 className="w-5 h-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">
                  <strong>Shorter skis are easier</strong> for beginners to learn and control.
                </span>
              </div>
              <div className="flex items-start">
                <CheckCircle2 className="w-5 h-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">
                  <strong>Proper fit is crucial</strong> - boots should be snug but not painful, and skis should match the child&apos;s height and weight.
                </span>
              </div>
            </div>
          </div>

          {/* Clothing Section */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                <Package className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Clothing</h2>
                <p className="text-gray-600">Must purchase - cannot be rented</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="border-l-4 border-blue-500 pl-4">
                <h3 className="font-semibold text-gray-900 mb-2">Base Layers</h3>
                <p className="text-gray-700 mb-2">
                  Synthetic or wool materials are better than cotton. Cotton retains moisture and can make kids cold.
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-1 ml-4">
                  <li>Long-sleeve thermal top</li>
                  <li>Thermal leggings or long underwear</li>
                  <li>Avoid cotton - it gets wet and cold</li>
                </ul>
              </div>
              <div className="border-l-4 border-blue-500 pl-4">
                <h3 className="font-semibold text-gray-900 mb-2">Outerwear</h3>
                <ul className="list-disc list-inside text-gray-600 space-y-1 ml-4">
                  <li>Insulated ski jacket (waterproof recommended)</li>
                  <li>Ski pants or bibs (waterproof recommended)</li>
                  <li>Fleece sweater or mid-layer for extra warmth</li>
                </ul>
              </div>
              <div className="border-l-4 border-blue-500 pl-4">
                <h3 className="font-semibold text-gray-900 mb-2">Essential Accessories</h3>
                <ul className="list-disc list-inside text-gray-600 space-y-1 ml-4">
                  <li>Waterproof gloves or mittens (thick, insulated)</li>
                  <li>Ski socks (thick, moisture-wicking, avoid cotton)</li>
                  <li>Neck warmer or balaclava (optional but recommended)</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Safety Accessories Section */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mr-4">
                <CheckCircle2 className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Safety Accessories</h2>
                <p className="text-gray-600">Must purchase - cannot be rented</p>
              </div>
            </div>
            <div className="space-y-6">
              <div className="border-l-4 border-red-500 pl-4">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                  🪖 Helmet
                  <span className="ml-2 text-sm font-normal text-red-600">(REQUIRED)</span>
                </h3>
                <p className="text-gray-700 mb-3">
                  A properly fitted ski helmet is mandatory for all lessons. Look for ASTM F2040 or CE EN 1077 certification.
                </p>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm font-semibold text-gray-900 mb-2">Recommended Options:</p>
                  <ul className="space-y-2">
                    <li>
                      <a
                        href="https://a.co/d/ivlaa2g"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Standard Sizes - View on Amazon
                      </a>
                    </li>
                    <li>
                      <a
                        href="https://a.co/d/gFzgsS1"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Extra Small Sizes - View on Amazon
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="border-l-4 border-red-500 pl-4">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                  🥽 Goggles
                  <span className="ml-2 text-sm font-normal text-red-600">(REQUIRED)</span>
                </h3>
                <p className="text-gray-700 mb-3">
                  Protect eyes from wind, sun, and snow. Look for anti-fog coating and UV protection.
                </p>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm font-semibold text-gray-900 mb-2">Recommended Options:</p>
                  <ul className="space-y-2">
                    <li>
                      <a
                        href="https://a.co/d/9WTCrGf"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Option 1 - View on Amazon
                      </a>
                    </li>
                    <li>
                      <a
                        href="https://a.co/d/7UH3UYs"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Option 2 - View on Amazon
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Equipment Section */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                <ShoppingBag className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Ski Equipment</h2>
                <p className="text-gray-600">Can be rented (~$180/full season) or purchased</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="border-l-4 border-green-500 pl-4">
                <h3 className="font-semibold text-gray-900 mb-2">Skis</h3>
                <ul className="list-disc list-inside text-gray-600 space-y-1 ml-4">
                  <li>Kid-sized skis appropriate for height and weight</li>
                  <li>Shorter skis are easier for beginners to learn</li>
                  <li>Should reach between chin and nose when standing</li>
                </ul>
              </div>
              <div className="border-l-4 border-green-500 pl-4">
                <h3 className="font-semibold text-gray-900 mb-2">Ski Boots</h3>
                <ul className="list-disc list-inside text-gray-600 space-y-1 ml-4">
                  <li>Must fit snugly but not be painful</li>
                  <li>Proper fit is crucial for control and safety</li>
                  <li>Should allow for one pair of ski socks only</li>
                </ul>
              </div>
              <div className="border-l-4 border-green-500 pl-4">
                <h3 className="font-semibold text-gray-900 mb-2">Poles</h3>
                <ul className="list-disc list-inside text-gray-600 space-y-1 ml-4">
                  <li>Optional for beginners (often not needed in first lessons)</li>
                  <li>When ready, should reach from ground to armpit</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Extras Section */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                <Package className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Extras & Comfort Items</h2>
                <p className="text-gray-600">Optional but recommended</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-start">
                <CheckCircle2 className="w-5 h-5 text-purple-600 mr-3 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">Hand warmers (disposable or rechargeable)</span>
              </div>
              <div className="flex items-start">
                <CheckCircle2 className="w-5 h-5 text-purple-600 mr-3 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">Backpack for snacks, water, and extra layers</span>
              </div>
              <div className="flex items-start">
                <CheckCircle2 className="w-5 h-5 text-purple-600 mr-3 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">Water bottle (insulated to prevent freezing)</span>
              </div>
              <div className="flex items-start">
                <CheckCircle2 className="w-5 h-5 text-purple-600 mr-3 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">Sunscreen (SPF 30+ for face, even on cloudy days)</span>
              </div>
              <div className="flex items-start">
                <CheckCircle2 className="w-5 h-5 text-purple-600 mr-3 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">Lip balm with SPF protection</span>
              </div>
              <div className="flex items-start">
                <CheckCircle2 className="w-5 h-5 text-purple-600 mr-3 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">Extra pair of gloves (in case first pair gets wet)</span>
              </div>
            </div>
          </div>

          {/* Rental Locations Section */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mr-4">
                <MapPin className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Equipment Rental Locations</h2>
                <p className="text-gray-600">Local options for renting ski equipment</p>
              </div>
            </div>
            <div className="space-y-6">
              <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      Play It Again Sports - Lynnwood
                    </h3>
                    <p className="text-gray-600 mb-3">
                      Full-season rentals available. <strong>Appointment required.</strong>
                    </p>
                  </div>
                  <Calendar className="w-6 h-6 text-orange-600 flex-shrink-0" />
                </div>
                <div className="space-y-2">
                  <a
                    href="https://maps.app.goo.gl/jYuCujodrupQ6Buj7"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    <MapPin className="w-4 h-4 mr-2" />
                    View Location on Google Maps
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </a>
                  <a
                    href="https://playitagainsportslynnwood.simplybook.me/v2/#book"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    Book Appointment Online
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </a>
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      Play It Again Sports - Woodinville
                    </h3>
                    <p className="text-gray-600 mb-3">
                      Full-season rentals available. <strong>Appointment required.</strong>
                    </p>
                  </div>
                  <Calendar className="w-6 h-6 text-orange-600 flex-shrink-0" />
                </div>
                <div className="space-y-2">
                  <a
                    href="https://maps.app.goo.gl/zVX931wHkLXUGjvJ6"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    <MapPin className="w-4 h-4 mr-2" />
                    View Location on Google Maps
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </a>
                  <a
                    href="https://playitagainsportswoodinville.simplybook.me/v2/#book"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    Book Appointment Online
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </a>
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      Superior Seconds - Issaquah
                    </h3>
                    <p className="text-gray-600 mb-3">
                      Used ski equipment store - great for buying and selling gear.
                    </p>
                  </div>
                  <ShoppingBag className="w-6 h-6 text-orange-600 flex-shrink-0" />
                </div>
                <a
                  href="https://superiorseconds.myshopify.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Visit Online Store
                </a>
              </div>
            </div>
          </div>

          {/* Checklist Summary */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-lg shadow-lg p-8 text-white mb-8">
            <h2 className="text-2xl font-bold mb-6">Quick Checklist Summary</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                <h3 className="font-semibold mb-3">Must Purchase (Cannot Rent)</h3>
                <ul className="space-y-2 text-blue-100">
                  <li className="flex items-center">
                    <CheckCircle2 className="w-5 h-5 mr-2 flex-shrink-0" />
                    Base layers (synthetic/wool)
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 className="w-5 h-5 mr-2 flex-shrink-0" />
                    Ski jacket & pants (waterproof)
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 className="w-5 h-5 mr-2 flex-shrink-0" />
                    Waterproof gloves
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 className="w-5 h-5 mr-2 flex-shrink-0" />
                    Ski socks
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 className="w-5 h-5 mr-2 flex-shrink-0" />
                    Helmet (REQUIRED)
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 className="w-5 h-5 mr-2 flex-shrink-0" />
                    Goggles (REQUIRED)
                  </li>
                </ul>
              </div>
              <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                <h3 className="font-semibold mb-3">Can Rent or Purchase</h3>
                <ul className="space-y-2 text-blue-100">
                  <li className="flex items-center">
                    <CheckCircle2 className="w-5 h-5 mr-2 flex-shrink-0" />
                    Skis (kid-sized)
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 className="w-5 h-5 mr-2 flex-shrink-0" />
                    Ski boots (snug fit)
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 className="w-5 h-5 mr-2 flex-shrink-0" />
                    Poles (optional for beginners)
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg shadow-lg p-8 text-center text-white">
            <h2 className="text-2xl font-bold mb-4">Need Help with Gear?</h2>
            <p className="text-orange-100 mb-6 text-lg">
              If you need assistance finding rentals or purchasing gear, I&apos;m happy to help! 
              Mention it in your lesson enrollment form.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/ski-lessons"
                className="inline-flex items-center px-8 py-3 bg-white text-orange-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors shadow-lg"
              >
                Enroll in Lessons
              </Link>
              <Link
                href="/ski-lessons/program"
                className="inline-flex items-center px-8 py-3 bg-white/20 text-white rounded-lg font-semibold hover:bg-white/30 transition-colors border-2 border-white"
              >
                View Lesson Program
              </Link>
            </div>
          </div>
        </div>
      </div>
      <LandingFooter />
    </>
  )
}

