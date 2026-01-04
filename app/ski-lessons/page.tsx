'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase-client'
import toast from 'react-hot-toast'
import { validateSkiLessonForm, type ValidationErrors } from '@/components/FormValidation'
import { notifySkiLessonSubmission } from '@/lib/email-notifications'
import LandingNavbar from '@/components/LandingNavbar'
import LandingFooter from '@/components/LandingFooter'

export default function SkiLessonsPage() {
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({})

  const [formData, setFormData] = useState({
    email: '',
    parent_name: '',
    participant_name: '',
    age: '',
    phone_number: '',
    ski_level: '',
    lesson_type: '',
    questions_preferences: '',
    gear_status: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setValidationErrors({})

    // Validate form
    const errors = validateSkiLessonForm(formData)
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors)
      setLoading(false)
      toast.error('Please fix the form errors')
      return
    }

    try {
      // Submit to database
      const { data, error: submitError } = await supabase
        .from('ski_lesson_submissions')
        .insert({
          email: formData.email.trim(),
          parent_name: formData.parent_name.trim(),
          participant_name: formData.participant_name.trim(),
          age: parseInt(formData.age),
          phone_number: formData.phone_number.trim(),
          ski_level: formData.ski_level as 'Beginner' | 'Intermediate' | 'Advanced',
          lesson_type: formData.lesson_type as
            | '4-week-private'
            | '4-week-group'
            | 'one-time-private'
            | 'one-time-group',
          preferred_day: null,
          questions_preferences: formData.questions_preferences.trim() || null,
          gear_status: formData.gear_status as 'ready' | 'need-help',
        })
        .select()
        .single()

      if (submitError) throw submitError

      // Send email notification
      await notifySkiLessonSubmission(
        'impavider@gmail.com', // Your email
        formData.email.trim(),
        formData.parent_name.trim(),
        formData.participant_name.trim(),
        data
      )

      toast.success('Thank you! Your submission has been received.')
      setSubmitted(true)
      setFormData({
        email: '',
        parent_name: '',
        participant_name: '',
        age: '',
        phone_number: '',
        ski_level: '',
        lesson_type: '',
        questions_preferences: '',
        gear_status: '',
      })
    } catch (err: any) {
      console.error('Error submitting form:', err)
      toast.error(err.message || 'An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <>
        <LandingNavbar />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center py-16">
          <div className="max-w-2xl mx-auto px-4 text-center">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="mb-6">
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
                  <svg
                    className="h-8 w-8 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Thank You for Your Interest! 🎿
                </h2>
                <p className="text-gray-600">
                  Your enrollment form has been submitted successfully. I&apos;ll review your
                  information and get back to you soon to discuss lesson options and scheduling.
                </p>
              </div>
              <button
                onClick={() => setSubmitted(false)}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Submit Another Form
              </button>
            </div>
          </div>
        </div>
        <LandingFooter />
      </>
    )
  }

  return (
    <>
      <LandingNavbar />
      <div className="min-h-screen bg-gray-50 pb-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Ski Interest Form 2025/26
            </h1>
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6 text-left">
              <p className="text-gray-700 mb-3">
                Welcome! I offer personalized ski lessons for kids (ages 6–15) at Summit at
                Snoqualmie focused on fun, safety, and steady progression.
              </p>
              <p className="text-gray-700 mb-3">
                I&apos;m a passionate skier and local instructor-in-training with 3 years of
                hands-on experience teaching beginners through small-group and family lessons.
                My approach focuses on:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-1 mb-3">
                <li>Building confidence and balance early on</li>
                <li>Keeping lessons fun and engaging so kids stay excited</li>
                <li>Helping parents see visible progress each week</li>
              </ul>
              <p className="text-gray-700">
                This form helps me match your child&apos;s age, comfort level, and availability to
                the right session.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6 text-left">
              <h2 className="text-xl font-semibold mb-4">Lesson Options</h2>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-900">
                      🏔️ 4-Week Progression Program
                    </h3>
                    <Link
                      href="/ski-lessons/program"
                      className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                    >
                      View Program Details →
                    </Link>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    A structured 4-week course designed for steady, consistent improvement.
                  </p>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Private (1-on-1) - $640 (1 hr per session)</li>
                    <li>• Small Group - $440 /ea kid (2-3 kids /class)</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    ❄️ Private & Small-Group Lessons
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">
                    One-time lessons you can book as needed.
                  </p>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Private (1-on-1) - $180</li>
                    <li>• Small Group - $120 /ea kid (4 kids max/class)</li>
                  </ul>
                </div>
                <p className="text-sm text-gray-600 mt-4">
                  All group lessons are 2 hrs each 🎿
                </p>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sm:p-8">
            <div className="space-y-6">
              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    validationErrors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                  required
                />
                {validationErrors.email && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.email}</p>
                )}
              </div>

              {/* Parent Name */}
              <div>
                <label
                  htmlFor="parent_name"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Parent/Guardian Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="parent_name"
                  value={formData.parent_name}
                  onChange={(e) => setFormData({ ...formData, parent_name: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    validationErrors.parent_name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  required
                />
                {validationErrors.parent_name && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.parent_name}</p>
                )}
              </div>

              {/* Participant Name */}
              <div>
                <label
                  htmlFor="participant_name"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  ⛷️ Participant&apos;s Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="participant_name"
                  value={formData.participant_name}
                  onChange={(e) =>
                    setFormData({ ...formData, participant_name: e.target.value })
                  }
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    validationErrors.participant_name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  required
                />
                {validationErrors.participant_name && (
                  <p className="mt-1 text-sm text-red-600">
                    {validationErrors.participant_name}
                  </p>
                )}
              </div>

              {/* Age */}
              <div>
                <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-2">
                  Age <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  id="age"
                  min="6"
                  max="15"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    validationErrors.age ? 'border-red-500' : 'border-gray-300'
                  }`}
                  required
                />
                {validationErrors.age && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.age}</p>
                )}
              </div>

              {/* Phone Number */}
              <div>
                <label
                  htmlFor="phone_number"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  id="phone_number"
                  value={formData.phone_number}
                  onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    validationErrors.phone_number ? 'border-red-500' : 'border-gray-300'
                  }`}
                  required
                />
                {validationErrors.phone_number && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.phone_number}</p>
                )}
              </div>

              {/* Ski Level */}
              <div>
                <label
                  htmlFor="ski_level"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Ski Level <span className="text-red-500">*</span>
                </label>
                <select
                  id="ski_level"
                  value={formData.ski_level}
                  onChange={(e) => setFormData({ ...formData, ski_level: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    validationErrors.ski_level ? 'border-red-500' : 'border-gray-300'
                  }`}
                  required
                >
                  <option value="">Select ski level</option>
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
                {validationErrors.ski_level && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.ski_level}</p>
                )}
              </div>

              {/* Lesson Type */}
              <div>
                <label
                  htmlFor="lesson_type"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Lesson Type <span className="text-red-500">*</span>
                </label>
                <select
                  id="lesson_type"
                  value={formData.lesson_type}
                  onChange={(e) => setFormData({ ...formData, lesson_type: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    validationErrors.lesson_type ? 'border-red-500' : 'border-gray-300'
                  }`}
                  required
                >
                  <option value="">Select lesson type</option>
                  <optgroup label="4-Week Progression Program">
                    <option value="4-week-private">Private (1-on-1) - $640</option>
                    <option value="4-week-group">Small Group - $440 /ea kid (4 kids max/class)</option>
                  </optgroup>
                  <optgroup label="One-Time Lessons">
                    <option value="one-time-private">Private (1-on-1) - $180</option>
                    <option value="one-time-group">Small Group - $120 /ea kid (4 kids max)</option>
                  </optgroup>
                </select>
                {validationErrors.lesson_type && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.lesson_type}</p>
                )}
              </div>

              {/* Questions/Preferences */}
              <div>
                <label
                  htmlFor="questions_preferences"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Any questions or preferences
                </label>
                <textarea
                  id="questions_preferences"
                  rows={4}
                  value={formData.questions_preferences}
                  onChange={(e) =>
                    setFormData({ ...formData, questions_preferences: e.target.value })
                  }
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    validationErrors.questions_preferences
                      ? 'border-red-500'
                      : 'border-gray-300'
                  }`}
                />
                {validationErrors.questions_preferences && (
                  <p className="mt-1 text-sm text-red-600">
                    {validationErrors.questions_preferences}
                  </p>
                )}
              </div>

              {/* Gear Reminder */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gear Reminder <span className="text-red-500">*</span>
                </label>
                <p className="text-sm text-gray-600 mb-3">
                  All participants must have ski gear ready (skis, boots, helmet, gloves, goggles
                  and warm clothing) before the first class. If you need help finding rentals or
                  purchasing gear, I&apos;m happy to assist. Please confirm below:
                </p>
                <Link
                  href="/ski-lessons/program/gear-list"
                  target="_blank"
                  className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 font-medium mb-3"
                >
                  View Complete Gear Checklist →
                </Link>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="gear_status"
                      value="ready"
                      checked={formData.gear_status === 'ready'}
                      onChange={(e) =>
                        setFormData({ ...formData, gear_status: e.target.value })
                      }
                      className="mr-2"
                      required
                    />
                    <span>I understand and will have the required gear ready before the class.</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="gear_status"
                      value="need-help"
                      checked={formData.gear_status === 'need-help'}
                      onChange={(e) =>
                        setFormData({ ...formData, gear_status: e.target.value })
                      }
                      className="mr-2"
                    />
                    <span>I need help finding rentals or purchasing ski gear</span>
                  </label>
                </div>
                {validationErrors.gear_status && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.gear_status}</p>
                )}
              </div>

              {/* Submit Button */}
              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
                >
                  {loading ? 'Submitting...' : 'Submit'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
      <LandingFooter />
    </>
  )
}

