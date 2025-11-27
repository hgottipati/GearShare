'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { createClient } from '@/lib/supabase-client'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [debugInfo, setDebugInfo] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log('=== LOGIN FORM SUBMITTED ===')
    console.log('Email:', email)
    console.log('Is Sign Up:', isSignUp)
    console.log('Supabase client initialized:', !!supabase)
    
    setLoading(true)
    setError(null)
    setMessage(null)
    setDebugInfo('Form submitted, processing...')

    try {
      if (isSignUp) {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              name,
            },
          },
        })

        if (signUpError) throw signUpError

        // Update profile with phone if provided
        if (data.user && phone) {
          await supabase
            .from('profiles')
            .update({ phone })
            .eq('id', data.user.id)
        }

        setMessage(
          'Account created! Please wait for admin approval before accessing the marketplace.'
        )
        setLoading(false)
      } else {
        console.log('Attempting to sign in...')
        setDebugInfo('Attempting to sign in...')
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        })

        console.log('Sign in response:', { 
          hasSession: !!signInData?.session, 
          error: signInError?.message,
          user: signInData?.user?.id 
        })

        if (signInError) {
          console.error('Sign in error:', signInError)
          // If email not confirmed, check if user is admin or approved
          if (signInError.message.includes('email_not_confirmed') || signInError.message.includes('Email not confirmed')) {
            // Try to get user by email to check their profile
            const { data: profileData } = await supabase
              .from('profiles')
              .select('is_admin, is_approved')
              .eq('email', email)
              .single()

            // If user is admin or approved, allow them to proceed
            if (profileData && (profileData.is_admin || profileData.is_approved)) {
              // Try to sign in again with email confirmation bypass
              // Note: This requires the email to be confirmed in Supabase auth
              // For now, we'll show a helpful message
              setError(
                'Email confirmation required. Please contact an administrator to confirm your email, or check your inbox for the confirmation link.'
              )
              setLoading(false)
              return
            }
          }
          throw signInError
        }

        // Wait for session to be established and cookies to be set
        if (signInData?.session) {
          console.log('Session found in response, waiting for cookies to be set...')
          setDebugInfo('Session found, setting cookies...')
          
          // Give the browser time to write cookies to disk
          // Multiple checks to ensure cookies are persisted
          let sessionVerified = false
          for (let i = 0; i < 10; i++) {
            await new Promise(resolve => setTimeout(resolve, 100))
            const { data: { session: checkSession }, error: sessionError } = await supabase.auth.getSession()
            console.log(`Session check ${i + 1}/10:`, { 
              hasSession: !!checkSession, 
              error: sessionError?.message,
              accessToken: checkSession?.access_token ? 'present' : 'missing'
            })
            
            if (checkSession?.access_token) {
              // Verify we can get the user (this confirms cookies are working)
              try {
                const { data: { user }, error: userError } = await supabase.auth.getUser()
                console.log(`User check ${i + 1}/10:`, { 
                  hasUser: !!user, 
                  userId: user?.id,
                  error: userError?.message 
                })
                
                if (user && !userError) {
                  console.log('User verified, cookies should be set, redirecting...')
                  setDebugInfo('Cookies verified, redirecting...')
                  sessionVerified = true
                  
                  // Additional small delay to ensure cookies are committed
                  await new Promise(resolve => setTimeout(resolve, 200))
                  
                  // Use window.location for a full page reload to ensure session is picked up
                  window.location.href = '/'
                  return // Exit the function, don't continue
                }
              } catch (userError) {
                console.warn('User check failed:', userError)
              }
            }
          }
          
          // If we get here, session verification failed
          if (!sessionVerified) {
            console.error('Session verification failed after multiple attempts')
            setDebugInfo('Session verification failed')
            setError('Login successful but session verification failed. Please refresh the page and try again.')
            setLoading(false)
          }
        } else {
          console.error('No session in sign in response')
          setDebugInfo('No session in response, checking fallback...')
          // Fallback: wait a bit and check session again
          await new Promise(resolve => setTimeout(resolve, 500))
          const { data: { session } } = await supabase.auth.getSession()
          if (session) {
            console.log('Session found in fallback check, redirecting...')
            setDebugInfo('Session found in fallback, redirecting...')
            window.location.href = '/'
            // Don't set loading to false since we're redirecting
          } else {
            console.error('No session found after login')
            setDebugInfo('No session found after login')
            setError('Login failed: No session created. Please check your credentials and try again.')
            setLoading(false)
          }
        }
      }
    } catch (err: any) {
      console.error('Login error:', err)
      setDebugInfo(`Error: ${err.message || 'Unknown error'}`)
      setError(err.message || 'An error occurred')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 px-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-xl border border-gray-200 p-8">
        <div className="flex flex-col items-center mb-6">
          <Image
            src="/logo.png"
            alt="GearShare"
            width={150}
            height={50}
            className="mb-4 h-auto w-auto"
            priority
            unoptimized
          />
          <h1 className="text-3xl font-bold text-gray-900">
            {isSignUp ? 'Create Account' : 'Welcome Back'}
          </h1>
          <p className="text-gray-600 text-sm mt-1">
            {isSignUp ? 'Join the GearShare community' : 'Sign in to continue'}
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        {message && (
          <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
            {message}
          </div>
        )}

        {debugInfo && (
          <div className="mb-4 p-3 bg-blue-100 border border-blue-400 text-blue-700 rounded text-sm">
            Debug: {debugInfo}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <>
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Name
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required={isSignUp}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Phone (Optional)
                </label>
                <input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </>
          )}

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {loading
              ? 'Loading...'
              : isSignUp
                ? 'Create Account'
                : 'Login'}
          </button>
        </form>

        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={() => {
              setIsSignUp(!isSignUp)
              setError(null)
              setMessage(null)
            }}
            className="text-blue-600 hover:text-blue-800 text-sm"
          >
            {isSignUp
              ? 'Already have an account? Login'
              : "Don't have an account? Sign up"}
          </button>
        </div>
      </div>
    </div>
  )
}

