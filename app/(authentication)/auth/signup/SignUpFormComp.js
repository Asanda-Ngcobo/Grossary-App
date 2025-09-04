'use client'

import GoogleAuthComp from './GoogleAuthComp'
import Link from 'next/link'
import Logo from '@/app/(website)/_components/Logo'
import { useState } from 'react';
import { Eye, EyeOff } from '@deemlol/next-icons';
// import Image from 'next/image'
// import { getGoogleSignInUrl, googleAuthLogin } from '@/app/_lib/actions'

function SignUpFormComp({handleSubmit, isPending}) {

  // const handleClick = async () => {
  //     const url = await getGoogleSignInUrl('/account');
  //     window.location.href = url;
  //   };

  const [showPassword, setShowPassword] = useState(false);
  return (
    <div className="w-[90%] max-w-[500px] mx-auto py-6 text-[#041527] grid gap-4">
      {/* Header */}
      <header className="border-b border-[#908787] mb-6 pb-4 space-y-2 text-center">
        <h1 className="text-[24px] font-bold">Welcome to<Logo/></h1>
        <h2 className="text-xl font-bold">No missed grocery items. No overspending.</h2>
        <p className="text-[#908787] text-base">Plan smarter. Shop better. Save more.</p>
        
      </header>

{/* email SignUp  */}
 <form action={handleSubmit} className="space-y-4 mx-auto">
    <h3 className="text-center text-xl font-extrabold">Sign Up</h3>
      <input type="text" name="fullName" placeholder="Full Name"
       required className="border p-2 w-full rounded-sm" />

      <input type="email" name="email" placeholder="Email" 
      required className="border p-2 w-full rounded-sm" />

      {/* <input type="password" name="password" placeholder="Password"
       required className="border p-2 w-full rounded-sm" /> */}
        <div className="relative">
         
          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            placeholder="Password"
            required
            className="border p-2 w-full rounded-sm pr-10"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-2 flex items-center text-gray-600"
            tabIndex={-1}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

{/* <input
  type="date"
  name="date_of_birth"
  placeholder="Date Of Birth"
  
  className="border p-2 w-full rounded-sm"
/> */}
      <button
        type="submit"
        disabled={isPending}
        className="bg-[#A2B06D] text-white px-4 py-2 w-full rounded disabled:opacity-50"
      >
        {isPending ? 'Signing up...' : 'Sign Up'}
      </button>
    </form>
      {/* Social Signup */}
     
      
 
      
     

     
      

      {/* Terms and Privacy */}
      <section className="text-center text-sm text-[#908787] mb-4 px-2">
        By clicking the button above, you agree to our{" "}
        <Link href="/terms" className="underline text-[#041527]">Terms of Use</Link>{" "}
        and{" "}
        <Link href="/privacy-policy" className="underline text-[#041527]">Privacy Policy</Link>.
      </section>

      {/* Already have an account */}
      <section className="text-center text-sm">
        <span className="font-semibold">Already have an account? </span>
        <Link href="/login" className="text-[#5358BB] font-semibold underline">
          Sign in
        </Link>
      </section>
    </div>
  )
}

export default SignUpFormComp
