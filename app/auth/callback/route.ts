import { createClient } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'
import { type NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const next = requestUrl.searchParams.get('next') || '/marketplace'

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      // Successfully exchanged code for session, redirect to marketplace
      return NextResponse.redirect(new URL(next, request.url))
    }
  }

  // If no code or error occurred, redirect to login
  return NextResponse.redirect(new URL('/login', request.url))
}
