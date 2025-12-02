'use client'

import Link from 'next/link'
import Image from 'next/image'
import { 
  ArrowRight,
  UserPlus,
  Upload,
  Search,
  MessageSquare,
  RefreshCw,
  Snowflake,
  Mountain,
  Users,
  Package,
  TrendingUp,
  GraduationCap,
  Calendar,
  Award
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
              <span className="text-sm font-medium text-blue-900">Ski Lessons at Summit at Snoqualmie</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight text-gray-900">
              <span className="block">Ski Lessons for Kids</span>
              <span className="block mt-2">
                <span className="text-blue-700">Ages 6-15</span>
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
              Personalized ski instruction focused on fun, safety, and steady progression. 
              Build confidence and skills with structured 4-week programs or flexible one-time lessons.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Link
                href="/ski-lessons"
                className="group px-8 py-3.5 bg-blue-700 text-white rounded-lg font-semibold text-base hover:bg-blue-800 transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                Enroll Now
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/ski-lessons/program"
                className="px-8 py-3.5 bg-white text-gray-700 rounded-lg font-semibold text-base border border-gray-300 hover:border-gray-400 hover:bg-gray-50 transition-colors"
              >
                View Program Details
              </Link>
            </div>

            {/* Key Stats */}
            <div className="flex flex-wrap justify-center gap-8 md:gap-12 text-center">
              <div>
                <div className="text-3xl font-bold text-gray-900 mb-1">4 Weeks</div>
                <div className="text-sm text-gray-600">Structured progression</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-900 mb-1">2 Hours</div>
                <div className="text-sm text-gray-600">Per lesson</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-900 mb-1">Personalized</div>
                <div className="text-sm text-gray-600">1-on-1 or small groups</div>
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
              How Our Ski Lessons Work
            </h2>
            <p className="text-lg text-gray-600 max-w-xl mx-auto">
              Simple steps to get your child started on their skiing journey
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
                  Submit Interest Form
                </h3>
                <p className="text-base text-gray-600 leading-relaxed">
                  Fill out our simple enrollment form with your child&apos;s age, skill level, and lesson preferences. We&apos;ll match them to the perfect program.
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
                  Get Matched & Schedule
                </h3>
                <p className="text-base text-gray-600 leading-relaxed">
                  We&apos;ll review your submission and contact you to discuss lesson options, scheduling, and answer any questions you have.
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
                  Prepare Your Gear
                </h3>
                <p className="text-base text-gray-600 leading-relaxed">
                  Make sure your child has all required equipment—skis, boots, helmet, gloves, goggles, and warm clothing. We can help with rentals or purchases if needed.
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
                  Start Learning & Progress
                </h3>
                <p className="text-base text-gray-600 leading-relaxed">
                  Attend weekly lessons at Summit at Snoqualmie. Watch your child build confidence and skills through our structured 4-week progression program or flexible one-time lessons.
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
                  Become an Independent Skier
                </h3>
                <p className="text-base text-gray-600 leading-relaxed">
                  By the end of the program, your child will have the skills and confidence to ski independently, with a solid foundation for continued improvement.
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
              Why Choose Our Ski Lessons
            </h2>
            <p className="text-lg text-gray-600 max-w-xl mx-auto">
              Personalized instruction designed for kids to learn, grow, and have fun on the slopes
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className={`p-6 bg-gray-50 rounded-lg border border-gray-200 transition-opacity duration-500 ${
              featuresVisible ? 'opacity-100' : 'opacity-0'
            }`}>
              <div className="w-10 h-10 bg-blue-700 rounded-lg flex items-center justify-center mb-4">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Structured Learning</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Our 4-week progression program builds skills systematically, from foundation to independent skiing. Each week focuses on specific techniques and goals.
              </p>
            </div>

            {/* Feature 2 */}
            <div className={`p-6 bg-gray-50 rounded-lg border border-gray-200 transition-opacity duration-500 ${
              featuresVisible ? 'opacity-100' : 'opacity-0'
            }`} style={{ transitionDelay: '100ms' }}>
              <div className="w-10 h-10 bg-blue-700 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Personalized Attention</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Choose between private 1-on-1 lessons or small group sessions (2-4 kids). Every child gets the attention they need to progress at their own pace.
              </p>
            </div>

            {/* Feature 3 */}
            <div className={`p-6 bg-gray-50 rounded-lg border border-gray-200 transition-opacity duration-500 ${
              featuresVisible ? 'opacity-100' : 'opacity-0'
            }`} style={{ transitionDelay: '200ms' }}>
              <div className="w-10 h-10 bg-blue-700 rounded-lg flex items-center justify-center mb-4">
                <Award className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Fun & Confidence</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                We focus on making lessons enjoyable while building confidence. Kids stay excited about skiing and parents see visible progress each week.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Marketplace Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8 md:p-12">
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-blue-50 rounded-full border border-blue-100">
                <Package className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-900">Community Feature</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                Gear Marketplace
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Need ski gear? Our community marketplace helps families buy, sell, and trade equipment. 
                No shipping, no fees—just local families helping each other out.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/login?mode=signup"
                className="px-8 py-3.5 bg-blue-700 text-white rounded-lg font-semibold text-base hover:bg-blue-800 transition-colors flex items-center justify-center gap-2"
              >
                Join to Access Marketplace
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-blue-700">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Start Your Ski Journey?
          </h2>
          <p className="text-lg text-blue-100 mb-8 max-w-xl mx-auto">
            Enroll your child in our ski lessons program and watch them build confidence and skills on the slopes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/ski-lessons"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-blue-700 rounded-lg font-semibold text-base hover:bg-gray-50 transition-colors"
            >
              Enroll Now
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/ski-lessons/program"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-transparent text-white rounded-lg font-semibold text-base border-2 border-white hover:bg-white/10 transition-colors"
            >
              View Program Details
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

