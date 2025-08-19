'use client'


import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

import OneTapComponent from './AuthButton'
import { createClient } from '@/app/_utils/supabase/client'

export default function LoginComponent() {
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession()
      if (data.session) {
        router.push('/account')
      }
    }

    checkSession()
  }, [router, supabase.auth])

  const handleLoginClick = async () => {
    await supabase.auth.signInWithOAuth({ provider: 'google' })
  }

  return (
    <div>
   
        {/* Google One Tap Login */}
        <OneTapComponent />

        {/* Fallback Button */}
        <button
          onClick={handleLoginClick}
          className="mt-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded w-full"
        >
          Continue with Google
        </button>
      </div>
   
  )
}
