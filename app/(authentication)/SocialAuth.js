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
    "w-[85%] md:max-w-sm border border-gray-400 hover:bg-gray-100 cursor-pointer flex justify-center items-center gap-2 rounded-sm py-2 text-sm md:py-3 md:text-base md:rounded-md transition-colors";

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        handleSocialLogin()
      }}
      className="w-full h-[40vh] rounded-t-3xl shadow-2xl shadow-gray-300
      md:h-full md:w-1/2 md:rounded-none md:bg-white md:shadow-none"
    >
      <div className="h-full flex flex-col justify-evenly items-center overflow-y-auto px-2 py-2 md:px-10 md:py-8">
        {/* Header */}
        <header className="text-center space-y-0.5 md:space-y-2">
          <h1 className={`text-xl font-bold md:text-3xl ${LogoFont.className}`}>
            Welcome to <Logo />
          </h1>
          <h2 className="text-sm font-semibold md:text-lg">
            Create an account & start saving more for every grocery trip.
          </h2>
          <p className="text-[#908787] text-xs md:text-sm">
            Plan smarter. Shop better. Save more.
          </p>
        </header>

        {error && <p className="text-xs text-red-600 md:text-sm">{error}</p>}

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
        <p className="text-center text-[11px] leading-tight text-[#908787] px-2 md:text-xs md:max-w-sm">
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

        <p className="text-center text-xs md:text-sm">
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