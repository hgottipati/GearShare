'use client'

import { useState } from 'react'
import LandingNavbar from '@/components/LandingNavbar'
import LandingFooter from '@/components/LandingFooter'
import Link from 'next/link'
import { ChevronRight, ChevronLeft, CheckCircle2, ArrowRight } from 'lucide-react'

const weekPrograms = [
  {
    week: 1,
    title: 'Foundation & Balance',
    focus: 'Building Confidence on Skis',
    objectives: [
      'Introduction to ski equipment and safety',
      'Basic stance and balance exercises',
      'Walking and gliding on flat terrain',
      'Learning to stop (snowplow/pizza)',
      'Getting comfortable with speed control',
    ],
    skills: [
      'Proper equipment fitting and use',
      'Basic balance and coordination',
      'Snowplow stop technique',
      'Confidence on gentle slopes',
    ],
    duration: '2 hours',
    location: 'Beginner area at Summit at Snoqualmie',
  },
  {
    week: 2,
    title: 'Turning & Control',
    focus: 'Mastering Direction Changes',
    objectives: [
      'Refining snowplow technique',
      'Introduction to turning (wedge turns)',
      'Speed control on steeper terrain',
      'Learning to link turns',
      'Building muscle memory for movements',
    ],
    skills: [
      'Wedge turn technique',
      'Speed control on varied terrain',
      'Linking multiple turns together',
      'Improved balance and coordination',
    ],
    duration: '2 hours',
    location: 'Beginner to intermediate slopes',
  },
  {
    week: 3,
    title: 'Parallel Skiing Basics',
    focus: 'Transitioning to Parallel Turns',
    objectives: [
      'Introduction to parallel skiing stance',
      'Learning to keep skis together',
      'Refining turn shape and rhythm',
      'Building confidence on blue runs',
      'Introduction to pole planting',
    ],
    skills: [
      'Parallel skiing fundamentals',
      'Improved turn shape and control',
      'Confidence on intermediate terrain',
      'Basic pole planting technique',
    ],
    duration: '2 hours',
    location: 'Intermediate slopes (blue runs)',
  },
  {
    week: 4,
    title: 'Refinement & Independence',
    focus: 'Becoming an Independent Skier',
    objectives: [
      'Perfecting parallel turns',
      'Advanced speed and terrain control',
      'Building independence on the mountain',
      'Introduction to more challenging terrain',
      'Setting goals for continued improvement',
    ],
    skills: [
      'Confident parallel skiing',
      'Independent navigation of slopes',
      'Adaptability to different conditions',
      'Foundation for advanced techniques',
    ],
    duration: '2 hours',
    location: 'Varied terrain based on skill level',
  },
]

export default function SkiLessonsProgramPage() {
  const [currentWeek, setCurrentWeek] = useState(1)

  const goToWeek = (week: number) => {
    setCurrentWeek(week)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const currentProgram = weekPrograms[currentWeek - 1]

  return (
    <>
      <LandingNavbar />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                🏔️ 4-Week Progression Program
              </h1>
              <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto">
                A structured course designed for steady, consistent improvement. Build confidence
                and skills week by week with personalized instruction.
              </p>
            </div>
          </div>
        </div>

        {/* Program Overview */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Program Overview</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">What You&apos;ll Learn</h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start">
                    <CheckCircle2 className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Foundation skills and proper technique</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Progressive skill building week by week</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Confidence on varied terrain</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Independent skiing skills</span>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Program Details</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>
                    <strong>Duration:</strong> 4 weeks, 2 hours per lesson
                  </li>
                  <li>
                    <strong>Location:</strong> Summit at Snoqualmie
                  </li>
                  <li>
                    <strong>Format:</strong> Private (1-on-1) or Small Group (2-3 kids)
                  </li>
                  <li>
                    <strong>Pricing:</strong> Private $640 | Small Group $440/ea
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Week Navigation */}
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <div className="flex flex-wrap justify-center gap-2">
              {weekPrograms.map((program) => (
                <button
                  key={program.week}
                  onClick={() => goToWeek(program.week)}
                  className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                    currentWeek === program.week
                      ? 'bg-blue-600 text-white shadow-lg scale-105'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Week {program.week}
                </button>
              ))}
            </div>
          </div>

          {/* Current Week Details */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-bold mb-2">
                    Week {currentProgram.week}: {currentProgram.title}
                  </h2>
                  <p className="text-blue-100 text-lg">{currentProgram.focus}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-blue-200">Duration</p>
                  <p className="text-xl font-semibold">{currentProgram.duration}</p>
                </div>
              </div>
            </div>

            <div className="p-8">
              <div className="grid md:grid-cols-2 gap-8 mb-8">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                    <span className="w-2 h-2 bg-blue-600 rounded-full mr-2"></span>
                    Learning Objectives
                  </h3>
                  <ul className="space-y-3">
                    {currentProgram.objectives.map((objective, index) => (
                      <li key={index} className="flex items-start text-gray-700">
                        <ChevronRight className="w-5 h-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                        <span>{objective}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                    <span className="w-2 h-2 bg-green-600 rounded-full mr-2"></span>
                    Skills You&apos;ll Master
                  </h3>
                  <ul className="space-y-3">
                    {currentProgram.skills.map((skill, index) => (
                      <li key={index} className="flex items-start text-gray-700">
                        <CheckCircle2 className="w-5 h-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                        <span>{skill}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="bg-blue-50 rounded-lg p-6 border-l-4 border-blue-600">
                <p className="text-gray-700">
                  <strong>Location:</strong> {currentProgram.location}
                </p>
              </div>
            </div>

            {/* Navigation Arrows */}
            <div className="border-t border-gray-200 p-6 flex justify-between items-center bg-gray-50">
              <button
                onClick={() => goToWeek(currentWeek > 1 ? currentWeek - 1 : 4)}
                className="flex items-center px-4 py-2 text-gray-700 hover:text-blue-600 transition-colors"
              >
                <ChevronLeft className="w-5 h-5 mr-1" />
                {currentWeek > 1 ? `Week ${currentWeek - 1}` : 'Week 4'}
              </button>
              <div className="text-sm text-gray-500">
                Week {currentWeek} of 4
              </div>
              <button
                onClick={() => goToWeek(currentWeek < 4 ? currentWeek + 1 : 1)}
                className="flex items-center px-4 py-2 text-gray-700 hover:text-blue-600 transition-colors"
              >
                {currentWeek < 4 ? `Week ${currentWeek + 1}` : 'Week 1'}
                <ChevronRight className="w-5 h-5 ml-1" />
              </button>
            </div>
          </div>

          {/* CTA Section */}
          <div className="mt-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg shadow-lg p-8 text-center text-white">
            <h2 className="text-2xl font-bold mb-4">Ready to Start Your Ski Journey?</h2>
            <p className="text-orange-100 mb-6 text-lg">
              Join our 4-week progression program and build your skills with personalized
              instruction.
            </p>
            <Link
              href="/ski-lessons"
              className="inline-flex items-center px-8 py-3 bg-white text-orange-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors shadow-lg"
            >
              Enroll Now
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </div>
        </div>
      </div>
      <LandingFooter />
    </>
  )
}

