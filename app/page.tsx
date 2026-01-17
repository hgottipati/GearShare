import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase-server'
import LandingPage from '@/components/LandingPage'
import LandingNavbar from '@/components/LandingNavbar'
import LandingFooter from '@/components/LandingFooter'

export default async function Home() {
  const supabase = await createClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Show landing page for non-authenticated users
  if (!session) {
    return (
      <>
        <LandingNavbar />
        <LandingPage />
        <LandingFooter />
      </>
    )
  }

  // Redirect authenticated users to marketplace (gear share exchange)
  redirect('/marketplace')
}

