'use client'


import Image from "next/image"
import { useState } from "react"
import GoogleIcon from '@/public/icons8-google-48.png'
import EmailIcon from '@/public/icons8-email-50.png'


import Link from "next/link"

import { createClient } from "@/app/_utils/supabase/client"


function LoginAuth() {
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
    <h1 className="text-[24px] font-bold">Welcome back 😍</h1>
    <h2 className="text-xl font-bold">No missed grocery items. No overspending.</h2>
     <p className="text-[#908787] text-base">Plan smarter. Shop better. Save more.</p>
     </header>

        {error && <p className="text-sm text-destructive-500">{error}</p>}
         <button
          
        
          className="w-[80%] mx-[10%] border border-gray-400 hover:bg-gray-200 cursor-pointer flex justify-center items-center rounded-sm py-3 my-2"
        >
          <Link href='/login/email'>
          
                  <p className="flex gap-2">
             <span>
               <Image src={EmailIcon} alt="email icon" width={20} />
              </span>
          Continue with Email & Password
  

          </p>
          
     </Link>
         
          
        </button>
        <div><p>OR</p></div>

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
        
             
      </div>
    </form>
  )
}

export default LoginAuth
