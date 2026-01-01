'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase-client'
import { useAuth } from '@/app/providers'
import Navbar from '@/components/Navbar'
import toast from 'react-hot-toast'
import Link from 'next/link'

interface SkiSubmission {
  id: string
  email: string
  parent_name: string
  participant_name: string
  age: number
  phone_number: string
  ski_level: 'Beginner' | 'Intermediate' | 'Advanced'
  lesson_type: '4-week-private' | '4-week-group' | 'one-time-private' | 'one-time-group'
  preferred_day: 'Saturday' | 'Sunday' | 'Any' | null
  questions_preferences: string | null
  gear_status: 'ready' | 'need-help'
  created_at: string
}

const lessonTypeLabels: Record<string, string> = {
  '4-week-private': '4-Week Private ($640)',
  '4-week-group': '4-Week Small Group ($440/ea)',
  'one-time-private': 'One-Time Private ($180)',
  'one-time-group': 'One-Time Small Group ($120/ea)',
}

export default function SkiSubmissionsPage() {
  const { user } = useAuth()
  const router = useRouter()
  const supabase = createClient()
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)
  const [submissions, setSubmissions] = useState<SkiSubmission[]>([])
  const [filter, setFilter] = useState<'all' | 'need-help'>('all')

  useEffect(() => {
    checkAdmin()
  }, [user])

  const checkAdmin = async () => {
    if (!user) {
      router.push('/login')
      return
    }

    const { data } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', user.id)
      .single()

    if (data?.is_admin) {
      setIsAdmin(true)
      loadSubmissions()
    } else {
      router.push('/')
    }
  }

  const loadSubmissions = async () => {
    try {
      let query = supabase
        .from('ski_lesson_submissions')
        .select('*')
        .order('created_at', { ascending: false })

      if (filter === 'need-help') {
        query = query.eq('gear_status', 'need-help')
      }

      const { data, error } = await query

      if (error) throw error
      setSubmissions(data || [])
    } catch (err: any) {
      console.error('Error loading submissions:', err)
      toast.error('Error loading submissions')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (isAdmin) {
      loadSubmissions()
    }
  }, [filter, isAdmin])

  const deleteSubmission = async (id: string) => {
    if (!confirm('Are you sure you want to delete this submission?')) return

    const { error } = await supabase.from('ski_lesson_submissions').delete().eq('id', id)

    if (error) {
      toast.error('Error deleting submission')
    } else {
      toast.success('Submission deleted')
      loadSubmissions()
    }
  }

  const exportToCSV = () => {
    const headers = [
      'Email',
      'Parent Name',
      'Participant Name',
      'Age',
      'Phone',
      'Ski Level',
      'Lesson Type',
      'Gear Status',
      'Questions/Preferences',
      'Submitted',
    ]

    const rows = submissions.map((sub) => [
      sub.email,
      sub.parent_name,
      sub.participant_name,
      sub.age.toString(),
      sub.phone_number,
      sub.ski_level,
      lessonTypeLabels[sub.lesson_type] || sub.lesson_type,
      sub.gear_status === 'need-help' ? 'Needs Help' : 'Ready',
      sub.questions_preferences || '',
      new Date(sub.created_at).toLocaleString(),
    ])

    const csvContent = [headers, ...rows]
      .map((row) => row.map((cell) => `"${cell}"`).join(','))
      .join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `ski-lesson-submissions-${new Date().toISOString().split('T')[0]}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pb-16 md:pb-8">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAdmin) {
    return null
  }

  const filteredSubmissions =
    filter === 'need-help'
      ? submissions.filter((s) => s.gear_status === 'need-help')
      : submissions

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Ski Lesson Submissions</h1>
            <p className="text-gray-600">
              Total: {submissions.length} | Need Gear Help:{' '}
              {submissions.filter((s) => s.gear_status === 'need-help').length}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={exportToCSV}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm"
            >
              Export CSV
            </button>
            <Link
              href="/admin"
              className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 text-sm"
            >
              Back to Admin
            </Link>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex gap-4">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                filter === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All Submissions
            </button>
            <button
              onClick={() => setFilter('need-help')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                filter === 'need-help'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Need Gear Help ({submissions.filter((s) => s.gear_status === 'need-help').length})
            </button>
          </div>
        </div>

        {/* Submissions List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {filteredSubmissions.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No submissions found.
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredSubmissions.map((submission) => (
                <div key={submission.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-sm font-medium text-gray-500">Parent/Guardian</p>
                          <p className="text-gray-900">{submission.parent_name}</p>
                          <p className="text-sm text-gray-600">{submission.email}</p>
                          <p className="text-sm text-gray-600">{submission.phone_number}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">Participant</p>
                          <p className="text-gray-900">
                            {submission.participant_name} (Age {submission.age})
                          </p>
                          <p className="text-sm text-gray-600">
                            Level: <span className="font-medium">{submission.ski_level}</span>
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">Lesson Details</p>
                          <p className="text-gray-900">
                            {lessonTypeLabels[submission.lesson_type] || submission.lesson_type}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">Gear Status</p>
                          <span
                            className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                              submission.gear_status === 'need-help'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-green-100 text-green-800'
                            }`}
                          >
                            {submission.gear_status === 'need-help'
                              ? 'Needs Help'
                              : 'Gear Ready'}
                          </span>
                          <p className="text-xs text-gray-500 mt-2">
                            Submitted: {new Date(submission.created_at).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      {submission.questions_preferences && (
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <p className="text-sm font-medium text-gray-500 mb-1">
                            Questions/Preferences:
                          </p>
                          <p className="text-sm text-gray-700 whitespace-pre-wrap">
                            {submission.questions_preferences}
                          </p>
                        </div>
                      )}
                    </div>
                    <div className="ml-4">
                      <button
                        onClick={() => deleteSubmission(submission.id)}
                        className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

