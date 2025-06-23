'use client'

import Script from 'next/script'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { createClient } from '@/app/_utils/supabase/client'

const OneTapComponent = () => {
  const supabase = createClient()
  const router = useRouter()

  // generate nonce for Google ID token sign-in
  const generateNonce = async () => {
    const nonce = btoa(String.fromCharCode(...crypto.getRandomValues(new Uint8Array(32))))
    const encoder = new TextEncoder()
    const encodedNonce = encoder.encode(nonce)
    const hashBuffer = await crypto.subtle.digest('SHA-256', encodedNonce)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    const hashedNonce = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
    return [nonce, hashedNonce]
  }

  useEffect(() => {
    const initializeGoogleOneTap = () => {
      console.log('Initializing Google One Tap')
      window.addEventListener('load', async () => {
        const [nonce, hashedNonce] = await generateNonce()
        console.log('Nonce:', nonce, hashedNonce)

        // Check existing session
        const { data, error } = await supabase.auth.getSession()
        if (error) {
          console.error('Error getting session', error)
        }
        if (data.session) {
          router.push('/account')
          return
        }

        /* global google */
        google.accounts.id.initialize({
          client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
          callback: async (response) => {
            try {
              const { data, error } = await supabase.auth.signInWithIdToken({
                provider: 'google',
                token: response.credential,
                nonce,
              })
              console.log(data)

              if (error) throw error
              console.log('Session data:', data)

              

              const user = data.user
              if (user) {
                const { id, email, user_metadata } = user
                const fullName = user_metadata.name || ''
                // const avatar_url = user_metadata.avatar_url || ''

                // Save user info in users_info table
                const { error: insertError } = await supabase.from('users_info').upsert(
                  {
                    id,
                    email,
                    fullName,
                 
                  },
                  { onConflict: 'id' }
                )

                if (insertError) throw insertError

                console.log('User info saved to users_info table')
              }

              router.push('/account')
            } catch (error) {
              console.error('Error logging in with Google One Tap:', error)
            }
          },
          nonce: hashedNonce,
          use_fedcm_for_prompt: true,
        })

        google.accounts.id.prompt()
      })
    }

    initializeGoogleOneTap()

    return () => window.removeEventListener('load', initializeGoogleOneTap)
  }, [router, supabase])

  return (
    <>
      <Script src="https://accounts.google.com/gsi/client" />
      <div id="oneTap" className="fixed top-0 right-0 z-[100]" />
    </>
  )
}

export default OneTapComponent
