'use client'


import Image from "next/image"
import { useState } from "react"
import GoogleIcon from '@/public/icons8-google-48.png'
import EmailIcon from '@/public/icons8-email-50.png'
import { createClient } from "../_utils/supabase/client"
import Logo from "../(website)/_components/Logo"
import Link from "next/link"


function SocialAuth() {
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

 const handleSocialLogin = async (e) => {
 
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

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        handleSocialLogin()
      }}
    className=" w-[90%] md:w-[40%] h-[60vh]
      md:shadow-lg">
      <div className="flex flex-col  gap-4
      justify-center items-center
      
      ">
            {/* Header */}
      <header className=" mb-6 pb-4 space-y-2 text-center">
        <h1 className="text-[24px] font-bold">Welcome to<Logo/></h1>
        <h2 className="text-xl font-bold">No missed grocery items. No overspending.</h2>
        <p className="text-[#908787] text-base">Plan smarter. Shop better. Save more.</p>
        
      </header>
        {error && <p className="text-sm text-destructive-500">{error}</p>}
        <button
          type="submit"
          disabled={isLoading}
          className="w-[80%] mx-[10%] border
           border-gray-400 hover:bg-gray-200 
           cursor-pointer flex justify-center items-center
            rounded-sm py-3 my-2"
        >
          {isLoading ? (
            'Logging in...'
          ) : (
            <p className="flex gap-2">
              <span>
                <Image src={GoogleIcon} alt="google icon" width={20} />
              </span>
              Continue with Google
            </p>
          )}
        </button>
        <div><p>OR</p></div>
              <button
          
        
          className="w-[80%] mx-[10%] border border-gray-400 hover:bg-gray-200 cursor-pointer flex justify-center items-center rounded-sm py-3 my-2"
        >
          <Link href='/auth/signup/email'>
      
                  <p className="flex gap-2">
             <span>
               <Image src={EmailIcon} alt="email icon" width={20} />
              </span>
          Continue with Email
  

          </p>
       
     </Link>
         
          
        </button>
         {/* Terms and Privacy */}
              <section className="text-center text-sm text-[#908787] mb-4 px-2">
                By continuing, you agree to our{" "}
                <Link href="/terms" className="underline text-[#041527]">Terms of Use</Link>{" "}
                and{" "}
                <Link href="/privacy-policy" className="underline text-[#041527]">Privacy Policy</Link>.
              </section>
      </div>
    </form>
  )
}

export default SocialAuth
