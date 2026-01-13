'use client'

import { useState, useRef, useEffect } from 'react'
import LandingNavbar from '@/components/LandingNavbar'
import LandingFooter from '@/components/LandingFooter'
import Link from 'next/link'
import { ChevronRight, ChevronLeft, CheckCircle2, ArrowRight, Calendar, CreditCard, CloudSnow, Clock, Ticket } from 'lucide-react'
import { skiProgramConfig, formatSessionDate, formatClassDate, isSessionUpcoming } from '@/lib/ski-program-config'

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
  const weekNavigationRef = useRef<HTMLDivElement>(null)
  const weekDetailsRef = useRef<HTMLDivElement>(null)

  const goToWeek = (week: number) => {
    setCurrentWeek(week)
    // Scroll to week navigation section so both buttons and header are visible
    // Add offset for fixed navbar (64px = h-16)
    setTimeout(() => {
      if (weekNavigationRef.current) {
        const elementPosition = weekNavigationRef.current.getBoundingClientRect().top
        const offsetPosition = elementPosition + window.pageYOffset - 80 // 80px offset for navbar + padding
        
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        })
      }
    }, 100)
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
                    <strong>Format:</strong> Private (1-on-1) or Small Group (4 kids max/class)
                  </li>
                  <li>
                    <strong>Pricing:</strong> Private $640 (1 hr per session) | Small Group $440/ea (4 kids max/class)
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Session Dates */}
          {(skiProgramConfig.session1.startDate || skiProgramConfig.session2.startDate) && (
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg shadow-lg p-8 mb-8 border-2 border-blue-200">
              <div className="flex items-center gap-3 mb-6">
                <Calendar className="w-6 h-6 text-blue-600" />
                <h2 className="text-2xl font-bold text-gray-900">Session Dates</h2>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                {skiProgramConfig.session1.startDate && (
                  <div className="bg-white rounded-lg p-6 border border-blue-200">
                    <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                      {skiProgramConfig.session1.name}
                    </h3>
                    {skiProgramConfig.session1.classDates && skiProgramConfig.session1.classDates.length > 0 ? (
                      <div className="space-y-3">
                        {skiProgramConfig.session1.classDates.map((date, index) => (
                          <div key={date} className="flex items-start gap-3">
                            <span className="text-blue-600 font-semibold min-w-[60px]">
                              {index + 1}{index === 0 ? 'st' : index === 1 ? 'nd' : index === 2 ? 'rd' : 'th'} class:
                            </span>
                            <span className="text-gray-700">
                              {formatClassDate(date)}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-lg text-gray-700 font-medium">
                        {formatSessionDate(skiProgramConfig.session1.startDate)}
                      </p>
                    )}
                    {isSessionUpcoming(skiProgramConfig.session1.startDate) && (
                      <p className="text-sm text-green-600 mt-4 font-medium">✓ Upcoming</p>
                    )}
                  </div>
                )}
                {skiProgramConfig.session2.startDate && (
                  <div className="bg-white rounded-lg p-6 border border-blue-200">
                    <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <span className="w-2 h-2 bg-indigo-600 rounded-full"></span>
                      {skiProgramConfig.session2.name}
                    </h3>
                    {skiProgramConfig.session2.classDates && skiProgramConfig.session2.classDates.length > 0 ? (
                      <div className="space-y-3">
                        {skiProgramConfig.session2.classDates.map((date, index) => (
                          <div key={date} className="flex items-start gap-3">
                            <span className="text-indigo-600 font-semibold min-w-[60px]">
                              {index + 1}{index === 0 ? 'st' : index === 1 ? 'nd' : index === 2 ? 'rd' : 'th'} class:
                            </span>
                            <span className="text-gray-700">
                              {formatClassDate(date)}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-lg text-gray-700 font-medium">
                        {formatSessionDate(skiProgramConfig.session2.startDate)}
                      </p>
                    )}
                    {isSessionUpcoming(skiProgramConfig.session2.startDate) && (
                      <p className="text-sm text-green-600 mt-4 font-medium">✓ Upcoming</p>
                    )}
                  </div>
                )}
              </div>
              {(!skiProgramConfig.session1.startDate || !skiProgramConfig.session2.startDate) && (
                <p className="text-sm text-gray-600 mt-4">
                  {!skiProgramConfig.session1.startDate && !skiProgramConfig.session2.startDate
                    ? 'Session dates will be announced soon.'
                    : 'Additional session dates will be announced soon.'}
                </p>
              )}
            </div>
          )}

          {/* Week Navigation */}
          <div ref={weekNavigationRef} className="bg-white rounded-lg shadow-lg p-6 mb-8">
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
          <div ref={weekDetailsRef} className="bg-white rounded-lg shadow-lg overflow-hidden">
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

          {/* Gear Checklist Section */}
          <div className="mt-12 bg-white rounded-lg shadow-lg p-8 border-2 border-blue-200">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">⛷️ Need Help with Gear?</h2>
              <p className="text-gray-700 mb-6 text-lg">
                Check out our complete gear checklist with everything your child needs, including 
                rental locations and recommended Amazon links.
              </p>
              <Link
                href="/ski-lessons/program/gear-list"
                className="inline-flex items-center px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg"
              >
                View Complete Gear Checklist
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </div>
          </div>

          {/* FAQs & Policies Section */}
          <div className="mt-12 bg-white rounded-lg shadow-lg p-8 border-2 border-gray-200">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">FAQs & Policies</h2>
            
            <div className="space-y-8">
              {/* Payment Policy */}
              <div className="border-b border-gray-200 pb-6 last:border-b-0 last:pb-0">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 mt-1">
                    <CreditCard className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">💳 Payment Policy</h3>
                    <div className="space-y-2 text-gray-700">
                      <p>
                        Full payment is required upfront to confirm enrollment and ensure commitment to the program.
                      </p>
                      <p>
                        If a student decides not to continue after the first class, the remaining unused classes will be refunded.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Inclement Weather Policy */}
              <div className="border-b border-gray-200 pb-6 last:border-b-0 last:pb-0">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 mt-1">
                    <CloudSnow className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">🌨️ Inclement Weather Policy</h3>
                    <div className="space-y-3 text-gray-700">
                      <p>
                        We follow updates from the Snoqualmie Pass (WSDOT) X/Twitter account for road and weather conditions.
                      </p>
                      <ul className="list-disc list-inside space-y-1 ml-2">
                        <li>If the pass or access roads are closed, the class will be canceled or rescheduled.</li>
                        <li>If the pass is open, classes will proceed as scheduled.</li>
                      </ul>
                      <p className="font-medium text-gray-900">
                        Safety always comes first.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Missed or Skipped Classes */}
              <div className="border-b border-gray-200 pb-6 last:border-b-0 last:pb-0">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 mt-1">
                    <Calendar className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">📆 Missed or Skipped Classes</h3>
                    <div className="space-y-3 text-gray-700">
                      <p>
                        This program is designed as a progression-based course, and skipping a class may affect continuity and skill development.
                      </p>
                      <p>
                        That said, we understand unexpected situations happen:
                      </p>
                      <ul className="list-disc list-inside space-y-1 ml-2">
                        <li>Please notify me at least 24 hours in advance if you need to miss a class.</li>
                        <li>I&apos;m happy to offer one complimentary reschedule during the program, subject to availability.</li>
                        <li>Additional missed classes may not be reschedulable.</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Arrival Time */}
              <div className="border-b border-gray-200 pb-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 mt-1">
                    <Clock className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">⏰ Arrival Time</h3>
                    <p className="text-gray-700">
                      Please plan to arrive 15 minutes early to allow time for parking, gearing up, and meeting at the designated location. This helps us make full use of the lesson time.
                    </p>
                  </div>
                </div>
              </div>

              {/* Lift Tickets & Passes */}
              <div className="pb-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 mt-1">
                    <Ticket className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">🎟️ Lift Tickets & Passes – What Should I Buy?</h3>
                    <div className="space-y-4 text-gray-700">
                      <p>
                        To participate in lessons that use chairlifts, students will need valid lift access.
                      </p>
                      <p>
                        At a minimum, a <strong>4-Day Flex Pass (Unrestricted, Summit Areas Only)</strong> is required to access the beginner lifts used during the program.
                      </p>
                      <p>
                        However, many students enjoy staying on the slopes after class to practice or ski with family. If you plan to ski beyond lesson time or visit more frequently during the season, a Season Pass may be the better value.
                      </p>

                      {/* Option 1 */}
                      <div className="bg-blue-50 rounded-lg p-5 border-l-4 border-blue-600 mt-4">
                        <h4 className="font-semibold text-gray-900 mb-2">Option 1: 4-Day Flex Pass (Minimum Required)</h4>
                        <p className="text-sm text-gray-600 mb-3">Unrestricted · Summit areas only</p>
                        <Link
                          href="https://shop.summitatsnoqualmie.com/l/lift-ticket/lift-tickets/p/winter-ticket-packs"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-700 text-sm font-medium mb-3 inline-block"
                        >
                          🔗 Purchase 4-Day Flex Pass →
                        </Link>
                        <ul className="list-disc list-inside space-y-1 text-sm ml-2">
                          <li>Adult (13+): $335</li>
                          <li>Youth (7–12): $250</li>
                          <li>Child (0–6): $78</li>
                        </ul>
                        <p className="text-sm text-gray-600 mt-3">
                          This option works well if you only plan to ski during lesson days.
                        </p>
                      </div>

                      {/* Option 2 */}
                      <div className="bg-indigo-50 rounded-lg p-5 border-l-4 border-indigo-600 mt-4">
                        <h4 className="font-semibold text-gray-900 mb-2">Option 2: Summit Season Pass (Best for Frequent Skiers)</h4>
                        <Link
                          href="https://shop.summitatsnoqualmie.com/l/season-passes-26/core-passes/p/26-summit-passes"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-indigo-600 hover:text-indigo-700 text-sm font-medium mb-3 inline-block"
                        >
                          🔗 Purchase Season Pass →
                        </Link>
                        <p className="text-sm text-gray-600 mb-3">2025–26 prices (as of Jan 2026):</p>
                        <ul className="list-disc list-inside space-y-1 text-sm ml-2">
                          <li>Adult (26–61): $759</li>
                          <li>Young Adult (19–25): $649</li>
                          <li>Teen (13–18): $589</li>
                          <li>Youth (7–12): $469</li>
                          <li>Child (0–6): $155</li>
                        </ul>
                        <p className="text-sm text-gray-600 mt-3">
                          A season pass is ideal if your child (or family) plans to ski before or after lessons, on weekends, or throughout the winter.
                        </p>
                      </div>

                      {/* Not Sure Section */}
                      <div className="bg-gray-50 rounded-lg p-4 mt-4 border border-gray-200">
                        <p className="text-sm">
                          <strong className="text-gray-900">Not Sure Which One to Choose?</strong>
                          <br />
                          <span className="text-gray-600">
                            If you&apos;re unsure which option makes sense for your situation, feel free to reach out—I&apos;m happy to help you decide based on your plans and skiing frequency.
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="mt-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg shadow-lg p-8 text-center text-white">
            <div className="bg-white/10 rounded-lg px-4 py-2 mb-4 inline-block">
              <p className="text-sm font-semibold">⚠️ Enrollment Currently Closed</p>
            </div>
            <h2 className="text-2xl font-bold mb-4">Ready to Start Your Ski Journey?</h2>
            <p className="text-orange-100 mb-6 text-lg">
              Enrollment is currently closed, but you can join our waitlist. If spots become available, 
              we&apos;ll contact you to join our 4-week progression program.
            </p>
            <Link
              href="/ski-lessons"
              className="inline-flex items-center px-8 py-3 bg-white text-orange-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors shadow-lg"
            >
              Join Waitlist
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </div>
        </div>
      </div>
      <LandingFooter />
    </>
  )
}

