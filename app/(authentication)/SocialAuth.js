'use client'

import Image from "next/image"
import { useState } from "react"
import GoogleIcon from '@/public/icons8-google-48.png'
import EmailIcon from '@/public/icons8-email-50.png'
import { createClient } from "../_utils/supabase/client"
import Logo from "../(website)/_components/Logo"
import Link from "next/link"
import { Quicksand } from "next/font/google"

const LogoFont = Quicksand({
  subsets: ["latin"],
  display: 'swap',
});

function SocialAuth() {
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleSocialLogin = async () => {
    const supabase = createClient()
    setIsLoading(true)
    setError(null)
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/oauth?next=/account`,
        },
      })
      if (error) throw error
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred')
      setIsLoading(false)
    }
  }

  const buttonClass =
    "w-[85%] border border-gray-400 hover:bg-gray-200 cursor-pointer flex justify-center items-center gap-2 rounded-sm py-2 text-sm"

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        handleSocialLogin()
      }}
      className="w-full md:w-[40%] h-[40vh] md:shadow-lg rounded-tl-3xl 
      rounded-tr-3xl
      bg-gray-200"
    >
      <div className="h-full flex flex-col justify-evenly items-center overflow-y-auto px-2 py-2">
        {/* Header */}
        <header className="text-center space-y-0.5">
          <h1 className={`text-xl font-bold ${LogoFont.className}`}>
            Welcome to{""}<Logo />
          </h1>
          <h2 className="text-sm font-semibold">
            Create an account & start saving more for every grocery trip.
          </h2>
          <p className="text-[#908787] text-xs">
            Plan smarter. Shop better. Save more.
          </p>
        </header>

        {error && <p className="text-xs text-red-600">{error}</p>}

        <button type="submit" disabled={isLoading} className={buttonClass}>
          {isLoading ? (
            'Logging in...'
          ) : (
            <>
              <Image src={GoogleIcon} alt="" width={18} height={18} />
              Continue with Google
            </>
          )}
        </button>

        <Link href="/auth/signup/email" className={buttonClass}>
          <Image src={EmailIcon} alt="" width={18} height={18} />
          Continue with Email
        </Link>

        {/* Terms and Privacy */}
        <p className="text-center text-[11px] leading-tight text-[#908787] px-2">
          By continuing, you agree to our{" "}
          <Link href="/company/terms" className="underline text-[#041527]">
            Terms of Use
          </Link>{" "}
          and{" "}
          <Link href="/company/privacy-policy" className="underline text-[#041527]">
            Privacy Policy
          </Link>
          .
        </p>

        <p className="text-center text-xs">
          <span className="font-semibold">Already have an account? </span>
          <Link href="/login" className="text-[#5358BB] font-semibold underline">
            Login
          </Link>
        </p>
      </div>
    </form>
  )
}

export default SocialAuth