import { redirect } from 'next/navigation'
import Image from 'next/image'
import { createClient } from '@/lib/supabase-server'
import MarketplaceList from '@/components/MarketplaceList'

export default async function MarketplacePage() {
  const supabase = await createClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect('/login')
  }

  // Check if user is approved or admin
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('is_approved, is_admin')
    .eq('id', session.user.id)
    .single()

  // If profile doesn't exist, create it
  if (profileError && profileError.code === 'PGRST116') {
    // Profile doesn't exist, create it
    const { error: insertError } = await supabase
      .from('profiles')
      .insert({
        id: session.user.id,
        email: session.user.email || '',
        name: session.user.user_metadata?.name || null,
        is_approved: false,
        is_admin: false,
      })

    if (insertError) {
      console.error('Failed to create profile:', insertError)
    }
  }

  // Allow admins and approved users
  if (!profile?.is_approved && !profile?.is_admin) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="max-w-md w-full bg-white rounded-xl shadow-xl border border-gray-200 p-8 text-center">
          <div className="flex justify-center mb-6">
            <Image
              src="/logo.png"
              alt="ShareMyGear"
              width={150}
              height={50}
              className="h-auto w-auto"
              priority
              unoptimized
            />
          </div>
          <h1 className="text-3xl font-bold mb-4 text-gray-900">Account Pending Approval</h1>
          <p className="text-gray-600">
            Your account is waiting for admin approval. You&apos;ll be able to access
            the marketplace once approved.
          </p>
        </div>
      </div>
    )
  }

  return <MarketplaceList />
}

