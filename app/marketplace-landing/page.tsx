'use client'

import Link from 'next/link'
import { 
  ArrowRight,
  Package,
  Users,
  MessageSquare,
  Snowflake
} from 'lucide-react'
import LandingNavbar from '@/components/LandingNavbar'
import LandingFooter from '@/components/LandingFooter'
import { useEffect, useState } from 'react'

export default function MarketplaceLandingPage() {
  const [isVisible, setIsVisible] = useState(false)
  const [featuresVisible, setFeaturesVisible] = useState(false)
  const [howItWorksVisible, setHowItWorksVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
    
    // Trigger animations on scroll
    const handleScroll = () => {
      // Features section
      const featuresSection = document.getElementById('features')
      if (featuresSection) {
        const rect = featuresSection.getBoundingClientRect()
        if (rect.top < window.innerHeight * 0.8) {
          setFeaturesVisible(true)
        }
      }
      
      // How It Works section
      const howItWorksSection = document.getElementById('how-it-works')
      if (howItWorksSection) {
        const rect = howItWorksSection.getBoundingClientRect()
        if (rect.top < window.innerHeight * 0.8) {
          setHowItWorksVisible(true)
        }
      }
    }
    
    window.addEventListener('scroll', handleScroll)
    handleScroll() // Check on mount
    
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      <LandingNavbar />
      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-24 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-50 to-white">
          {/* Subtle background pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-20 left-10 w-64 h-64 border-2 border-slate-300 rounded-full"></div>
            <div className="absolute bottom-20 right-10 w-96 h-96 border-2 border-slate-300 rounded-full"></div>
          </div>

          <div className="relative max-w-6xl mx-auto">
            <div className={`text-center transition-opacity duration-700 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
              <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-blue-50 rounded-full border border-blue-100">
                <Snowflake className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-900">Ski Community Marketplace</span>
              </div>
              
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight text-gray-900">
                <span className="block">Trade ski gear with</span>
                <span className="block mt-2">
                  <span className="text-blue-700">your community</span>
                </span>
              </h1>
              
              <p className="text-lg md:text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
                Kids grow fast. Gear gets expensive. Connect with other ski families to buy, sell, and trade equipment. 
                No shipping, no fees—just local families helping each other out.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
                <Link
                  href="/login?mode=signup"
                  className="group px-8 py-3.5 bg-blue-700 text-white rounded-lg font-semibold text-base hover:bg-blue-800 transition-colors flex items-center justify-center gap-2 shadow-sm"
                >
                  Join the Community
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="#how-it-works"
                  className="px-8 py-3.5 bg-white text-gray-700 rounded-lg font-semibold text-base border border-gray-300 hover:border-gray-400 hover:bg-gray-50 transition-colors"
                >
                  How it works
                </Link>
              </div>

              {/* Community Stats */}
              <div className="flex flex-wrap justify-center gap-8 md:gap-12 text-center">
                <div>
                  <div className="text-3xl font-bold text-gray-900 mb-1">Local</div>
                  <div className="text-sm text-gray-600">No shipping needed</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-gray-900 mb-1">Free</div>
                  <div className="text-sm text-gray-600">No platform fees</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-gray-900 mb-1">Trusted</div>
                  <div className="text-sm text-gray-600">Admin-approved members</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                How it works
              </h2>
              <p className="text-lg text-gray-600 max-w-xl mx-auto">
                Simple steps to start trading gear with your community
              </p>
            </div>

            <div className="space-y-10">
              {/* Step 1 */}
              <div className={`flex flex-col md:flex-row items-start gap-6 transition-opacity duration-500 ${
                howItWorksVisible ? 'opacity-100' : 'opacity-0'
              }`}>
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-blue-700 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                    1
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl md:text-2xl font-semibold text-gray-900 mb-2">
                    Join the community
                  </h3>
                  <p className="text-base text-gray-600 leading-relaxed">
                    Sign up with your email. Admin approval keeps it safe and local—only verified ski families in your program.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className={`flex flex-col md:flex-row items-start gap-6 transition-opacity duration-500 ${
                howItWorksVisible ? 'opacity-100' : 'opacity-0'
              }`} style={{ transitionDelay: '100ms' }}>
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-blue-700 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                    2
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl md:text-2xl font-semibold text-gray-900 mb-2">
                    List your gear
                  </h3>
                  <p className="text-base text-gray-600 leading-relaxed">
                    Post skis, boots, or jackets your kid outgrew. Add photos, size, condition, and price—or mark it as &quot;open to trade.&quot;
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className={`flex flex-col md:flex-row items-start gap-6 transition-opacity duration-500 ${
                howItWorksVisible ? 'opacity-100' : 'opacity-0'
              }`} style={{ transitionDelay: '200ms' }}>
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-blue-700 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                    3
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl md:text-2xl font-semibold text-gray-900 mb-2">
                    Find what you need
                  </h3>
                  <p className="text-base text-gray-600 leading-relaxed">
                    Browse listings from other families. Search by size, type, or condition. Find gear at a fraction of retail prices.
                  </p>
                </div>
              </div>

              {/* Step 4 */}
              <div className={`flex flex-col md:flex-row items-start gap-6 transition-opacity duration-500 ${
                howItWorksVisible ? 'opacity-100' : 'opacity-0'
              }`} style={{ transitionDelay: '300ms' }}>
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-blue-700 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                    4
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl md:text-2xl font-semibold text-gray-900 mb-2">
                    Message and meet up
                  </h3>
                  <p className="text-base text-gray-600 leading-relaxed">
                    Contact the seller through the built-in messaging. Arrange a local pickup—no shipping, no payment processing fees.
                  </p>
                </div>
              </div>

              {/* Step 5 */}
              <div className={`flex flex-col md:flex-row items-start gap-6 transition-opacity duration-500 ${
                howItWorksVisible ? 'opacity-100' : 'opacity-0'
              }`} style={{ transitionDelay: '400ms' }}>
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-blue-700 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                    5
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl md:text-2xl font-semibold text-gray-900 mb-2">
                    Trade again next season
                  </h3>
                  <p className="text-base text-gray-600 leading-relaxed">
                    Kids grow, gear gets passed down. List what they outgrew, find what they need. It&apos;s a cycle that saves everyone money.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                Built for ski families
              </h2>
              <p className="text-lg text-gray-600 max-w-xl mx-auto">
                Simple tools that make sense for how you actually trade gear
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {/* Feature 1 */}
              <div className={`p-6 bg-gray-50 rounded-lg border border-gray-200 transition-opacity duration-500 ${
                featuresVisible ? 'opacity-100' : 'opacity-0'
              }`}>
                <div className="w-10 h-10 bg-blue-700 rounded-lg flex items-center justify-center mb-4">
                  <Package className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Simple listings</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Post photos, add sizes and condition. Set a price or mark it as open to trade. No complicated forms.
                </p>
              </div>

              {/* Feature 2 */}
              <div className={`p-6 bg-gray-50 rounded-lg border border-gray-200 transition-opacity duration-500 ${
                featuresVisible ? 'opacity-100' : 'opacity-0'
              }`} style={{ transitionDelay: '100ms' }}>
                <div className="w-10 h-10 bg-blue-700 rounded-lg flex items-center justify-center mb-4">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Verified community</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Only approved members from your ski program. Admin-verified accounts keep it safe and local.
                </p>
              </div>

              {/* Feature 3 */}
              <div className={`p-6 bg-gray-50 rounded-lg border border-gray-200 transition-opacity duration-500 ${
                featuresVisible ? 'opacity-100' : 'opacity-0'
              }`} style={{ transitionDelay: '200ms' }}>
                <div className="w-10 h-10 bg-blue-700 rounded-lg flex items-center justify-center mb-4">
                  <MessageSquare className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Direct messages</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Message sellers to ask questions, negotiate, and arrange local pickups. No middleman, no fees.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-blue-700">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to start trading?
            </h2>
            <p className="text-lg text-blue-100 mb-8 max-w-xl mx-auto">
              Join your ski community and start buying, selling, and trading gear today.
            </p>
            <Link
              href="/login?mode=signup"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-blue-700 rounded-lg font-semibold text-base hover:bg-gray-50 transition-colors"
            >
              Join the community
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      </div>
      <LandingFooter />
    </>
  )
}

