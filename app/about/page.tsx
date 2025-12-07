'use client'

import Image from 'next/image'
import LandingNavbar from '@/components/LandingNavbar'
import LandingFooter from '@/components/LandingFooter'
import { Mountain, Award, Users, MapPin, Snowflake, Phone } from 'lucide-react'

export default function AboutPage() {
  // Last updated date - update this when you make changes
  const lastUpdated = '2024-12-15'

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  }

  return (
    <>
      <LandingNavbar />
      <div className="min-h-screen bg-white">
        {/* Panoramic Photo Section */}
        <section className="relative w-full h-64 md:h-96 lg:h-[500px] overflow-hidden">
          <Image 
            src="/panoramic-photo.jpg" 
            alt="Mountain panorama" 
            fill
            className="object-cover object-center"
            priority
            sizes="100vw"
          />
        </section>
        
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-24 pb-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-50 to-white">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-blue-50 rounded-full border border-blue-100">
              <Snowflake className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-900">About Your Instructor</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight text-gray-900">
              Passion for Skiing,<br />
              <span className="text-blue-700">Dedicated to Teaching</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Over a decade of skiing experience, combined with a commitment to helping kids discover the joy and confidence that comes with learning to ski.
            </p>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            {/* Story Section */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 md:p-12 mb-12">
              <div className="prose prose-lg max-w-none">
                <p className="text-gray-700 leading-relaxed mb-6">
                  Hello my name is Hareesh. Skiing has been a central part of my life for more than ten years. What started as a personal passion has evolved into a commitment to sharing that love of the sport with the next generation of skiers.
                </p>
                <p className="text-gray-700 leading-relaxed mb-6">
                  I&apos;m currently working toward my alpine instructor certification and am an active member of the Pacific Northwest PSIA (Professional Ski Instructors of America). This is my third year teaching skiing, and I&apos;ve had the privilege of working with beginners through small-group and family lessons, helping kids build confidence and skills on the slopes.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  When I&apos;m not teaching, I work with a travel company that has given me incredible opportunities to ski across many countries and mountain ranges—from the Himalayas in Gulmarg, Kashmir, to the powder of Sapporo, Japan, to the varied terrain of Canada and mountains throughout the United States. These experiences have deepened my appreciation for different skiing styles and teaching approaches, which I bring back to my students here at Summit at Snoqualmie.
                </p>
              </div>
            </div>

            {/* Highlights Grid */}
            <div className="grid md:grid-cols-2 gap-6 mb-12">
              {/* Experience */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-100">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-blue-700 rounded-lg flex items-center justify-center">
                    <Mountain className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">10+ Years</h3>
                    <p className="text-sm text-gray-600">Skiing Experience</p>
                  </div>
                </div>
                <p className="text-gray-700 text-sm leading-relaxed">
                  Over a decade of skiing has given me a deep understanding of the sport and what it takes to progress safely and confidently.
                </p>
              </div>

              {/* Teaching */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-6 border border-green-100">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-green-700 rounded-lg flex items-center justify-center">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">3rd Year</h3>
                    <p className="text-sm text-gray-600">Teaching Skiing</p>
                  </div>
                </div>
                <p className="text-gray-700 text-sm leading-relaxed">
                  Three years of hands-on teaching experience with kids, focusing on building confidence and making lessons fun and engaging.
                </p>
              </div>

              {/* Certification */}
              <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-lg p-6 border border-purple-100">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-purple-700 rounded-lg flex items-center justify-center">
                    <Award className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">PSIA Member</h3>
                    <p className="text-sm text-gray-600">Pacific Northwest</p>
                  </div>
                </div>
                <p className="text-gray-700 text-sm leading-relaxed">
                  Active member of the Professional Ski Instructors of America, working toward alpine instructor certification.
                </p>
              </div>

              {/* Travel */}
              <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-lg p-6 border border-orange-100">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-orange-700 rounded-lg flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">Global Experience</h3>
                    <p className="text-sm text-gray-600">Skiing Worldwide</p>
                  </div>
                </div>
                <p className="text-gray-700 text-sm leading-relaxed">
                  Skiing across diverse mountain ranges—from the Himalayas to Japan, Canada, and throughout the US—brings varied perspectives to teaching.
                </p>
              </div>

              {/* Contact */}
              <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-lg p-6 border border-teal-100">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-teal-700 rounded-lg flex items-center justify-center">
                    <Phone className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">Contact</h3>
                    <p className="text-sm text-gray-600">Get in Touch</p>
                  </div>
                </div>
                <a 
                  href="tel:+14253015595"
                  className="text-gray-700 text-sm leading-relaxed hover:text-teal-700 transition-colors font-medium"
                >
                  +1 (425) 301-5595
                </a>
              </div>
            </div>

            {/* Teaching Philosophy */}
            <div className="bg-blue-50 rounded-lg p-8 md:p-12 border-l-4 border-blue-600">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">My Teaching Approach</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                I believe skiing should be fun first. My approach focuses on building confidence and balance early on, keeping lessons engaging so kids stay excited about skiing, and helping parents see visible progress each week.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Whether it&apos;s a structured 4-week progression program or a flexible one-time lesson, I work to match each child&apos;s age, comfort level, and learning style to create the best possible experience on the slopes.
              </p>
            </div>

            {/* Last Updated */}
            <div className="mt-8 text-center text-sm text-gray-500">
              Last updated: {formatDate(lastUpdated)}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-indigo-700">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Start Your Ski Journey?
            </h2>
            <p className="text-lg text-blue-100 mb-6 max-w-xl mx-auto">
              Let&apos;s work together to help your child discover the joy of skiing.
            </p>
            <div className="mb-8">
              <a 
                href="tel:+14253015595"
                className="inline-flex items-center gap-2 text-white hover:text-blue-100 transition-colors text-lg font-medium"
              >
                <Phone className="w-5 h-5" />
                +1 (425) 301-5595
              </a>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/ski-lessons"
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-blue-700 rounded-lg font-semibold text-base hover:bg-gray-50 transition-colors"
              >
                Enroll Now
              </a>
              <a
                href="/ski-lessons/program"
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-transparent text-white rounded-lg font-semibold text-base border-2 border-white hover:bg-white/10 transition-colors"
              >
                View Program Details
              </a>
            </div>
          </div>
        </section>
      </div>
      <LandingFooter />
    </>
  )
}


