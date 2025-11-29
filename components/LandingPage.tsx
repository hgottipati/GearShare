'use client'

import Link from 'next/link'
import Image from 'next/image'
import { 
  ShoppingBag, 
  Users, 
  Shield, 
  MessageSquare, 
  CheckCircle2,
  Lock,
  Eye,
  UserCheck,
  ArrowRight,
  Sparkles,
  UserPlus,
  Upload,
  Search,
  Handshake,
  RefreshCw
} from 'lucide-react'
import { useEffect, useState } from 'react'

export default function LandingPage() {
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-32 px-4 sm:px-6 lg:px-8">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>

        <div className="relative max-w-7xl mx-auto">
          <div className={`text-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              <span className="block animate-fade-in-up">Your Private</span>
              <span className="block animate-fade-in-up" style={{ animationDelay: '200ms' }}>
                <span className="bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
                  Gear
                </span>
                <span className="bg-gradient-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent">
                  Marketplace
                </span>
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 mb-12 max-w-3xl mx-auto leading-relaxed">
              Transform your gear trading experience. Connect with your community, buy, sell, trade, or rent equipment. 
              Our platform makes it easy to find the perfect gear for your next adventure.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link
                href="/login?mode=signup"
                className="group relative px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
              >
                Get Started
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="#how-it-works"
                className="px-8 py-4 bg-white text-gray-700 rounded-lg font-semibold text-lg border-2 border-gray-300 hover:border-gray-400 shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300"
              >
                See How It Works
              </Link>
            </div>

            {/* Security Badges */}
            <div className="flex flex-wrap justify-center gap-6 md:gap-8">
              <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-md hover:shadow-lg transition-all duration-300 hover:scale-110 animate-fade-in-up" style={{ animationDelay: '400ms' }}>
                <Shield className="w-5 h-5 text-green-600" />
                <span className="text-sm font-medium text-gray-700">SSL Secured</span>
              </div>
              <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-md hover:shadow-lg transition-all duration-300 hover:scale-110 animate-fade-in-up" style={{ animationDelay: '500ms' }}>
                <Lock className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-medium text-gray-700">Data Encrypted</span>
              </div>
              <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-md hover:shadow-lg transition-all duration-300 hover:scale-110 animate-fade-in-up" style={{ animationDelay: '600ms' }}>
                <Eye className="w-5 h-5 text-purple-600" />
                <span className="text-sm font-medium text-gray-700">Privacy Protected</span>
              </div>
              <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-md hover:shadow-lg transition-all duration-300 hover:scale-110 animate-fade-in-up" style={{ animationDelay: '700ms' }}>
                <UserCheck className="w-5 h-5 text-orange-600" />
                <span className="text-sm font-medium text-gray-700">Private Community</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Get started in 5 simple steps
            </p>
          </div>

          <div className="space-y-12">
            {/* Step 1 */}
            <div className={`flex flex-col md:flex-row items-center gap-8 transition-all duration-700 ${
              howItWorksVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'
            }`} style={{ transitionDelay: '0ms' }}>
              <div className="flex-shrink-0">
                <div className="relative">
                  <div className="w-24 h-24 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-xl transform hover:scale-110 transition-transform duration-300">
                    <UserPlus className="w-12 h-12 text-white" />
                  </div>
                  <div className="absolute -top-2 -left-2 w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
                    1
                  </div>
                </div>
              </div>
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                  Join the Community
                </h3>
                <p className="text-lg text-gray-600 leading-relaxed">
                  Create an account using your email. Only approved ski students and parents get access — keeping everything safe, trusted, and local.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className={`flex flex-col md:flex-row-reverse items-center gap-8 transition-all duration-700 ${
              howItWorksVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'
            }`} style={{ transitionDelay: '150ms' }}>
              <div className="flex-shrink-0">
                <div className="relative">
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-xl transform hover:scale-110 transition-transform duration-300">
                    <Upload className="w-12 h-12 text-white" />
                  </div>
                  <div className="absolute -top-2 -left-2 w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
                    2
                  </div>
                </div>
              </div>
              <div className="flex-1 text-center md:text-right">
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                  Post Your Gear
                </h3>
                <p className="text-lg text-gray-600 leading-relaxed">
                  Got skis or boots your kid outgrew? Upload a photo, add size/condition, set a price or select &quot;open to trade.&quot;
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className={`flex flex-col md:flex-row items-center gap-8 transition-all duration-700 ${
              howItWorksVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'
            }`} style={{ transitionDelay: '300ms' }}>
              <div className="flex-shrink-0">
                <div className="relative">
                  <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl transform hover:scale-110 transition-transform duration-300">
                    <Search className="w-12 h-12 text-white" />
                  </div>
                  <div className="absolute -top-2 -left-2 w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
                    3
                  </div>
                </div>
              </div>
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                  Browse What You Need
                </h3>
                <p className="text-lg text-gray-600 leading-relaxed">
                  Search through gear listed by other ski families — find the right size at the right time without paying full retail.
                </p>
              </div>
            </div>

            {/* Step 4 */}
            <div className={`flex flex-col md:flex-row-reverse items-center gap-8 transition-all duration-700 ${
              howItWorksVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'
            }`} style={{ transitionDelay: '450ms' }}>
              <div className="flex-shrink-0">
                <div className="relative">
                  <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-xl transform hover:scale-110 transition-transform duration-300">
                    <Handshake className="w-12 h-12 text-white" />
                  </div>
                  <div className="absolute -top-2 -left-2 w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
                    4
                  </div>
                </div>
              </div>
              <div className="flex-1 text-center md:text-right">
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                  Connect & Arrange Pickup
                </h3>
                <p className="text-lg text-gray-600 leading-relaxed">
                  Message the seller directly to coordinate a quick, simple handoff. No shipping, no fees, no hassle.
                </p>
              </div>
            </div>

            {/* Step 5 */}
            <div className={`flex flex-col md:flex-row items-center gap-8 transition-all duration-700 ${
              howItWorksVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'
            }`} style={{ transitionDelay: '600ms' }}>
              <div className="flex-shrink-0">
                <div className="relative">
                  <div className="w-24 h-24 bg-gradient-to-br from-pink-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-xl transform hover:scale-110 transition-transform duration-300">
                    <RefreshCw className="w-12 h-12 text-white" />
                  </div>
                  <div className="absolute -top-2 -left-2 w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
                    5
                  </div>
                </div>
              </div>
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                  Swap Again Next Season
                </h3>
                <p className="text-lg text-gray-600 leading-relaxed">
                  Kids grow fast — gear comes and goes. Reuse, share, and save money year after year.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Why Choose ShareMyGear?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need to trade gear with your community
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className={`group relative bg-gradient-to-br from-blue-50 to-indigo-50 p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-blue-100 ${
              featuresVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`} style={{ transitionDelay: '0ms' }}>
              <div className="absolute top-4 right-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <ShoppingBag className="w-24 h-24 text-blue-600" />
              </div>
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-6 transform group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300">
                  <ShoppingBag className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Easy Marketplace</h3>
                <p className="text-gray-600 leading-relaxed">
                  Create listings with photos, set prices, and manage your gear inventory. Buy, sell, trade, or rent with ease.
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className={`group relative bg-gradient-to-br from-purple-50 to-pink-50 p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-purple-100 ${
              featuresVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`} style={{ transitionDelay: '150ms' }}>
              <div className="absolute top-4 right-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Users className="w-24 h-24 text-purple-600" />
              </div>
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-6 transform group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Private Community</h3>
                <p className="text-gray-600 leading-relaxed">
                  Connect with verified members of your community. Admin-approved access ensures a safe and trusted environment.
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className={`group relative bg-gradient-to-br from-green-50 to-teal-50 p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-green-100 ${
              featuresVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`} style={{ transitionDelay: '300ms' }}>
              <div className="absolute top-4 right-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <MessageSquare className="w-24 h-24 text-green-600" />
              </div>
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mb-6 transform group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300">
                  <MessageSquare className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Direct Messaging</h3>
                <p className="text-gray-600 leading-relaxed">
                  Communicate directly with buyers and sellers. Negotiate deals, ask questions, and coordinate pickups seamlessly.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-4xl mx-auto text-center">
          <div className="inline-block mb-6">
            <Sparkles className="w-16 h-16 text-yellow-300 animate-pulse" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join your community and start trading gear today. It only takes a minute to get started.
          </p>
          <Link
            href="/login?mode=signup"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-gray-900 rounded-lg font-semibold text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
          >
            Join ShareMyGear
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  )
}

