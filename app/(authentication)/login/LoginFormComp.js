'use client'

import { Eye, EyeOff } from "@deemlol/next-icons"
import Link from "next/link"
import { useState, useTransition } from "react";

function LoginFormComp({handleSubmit, isPending}) {
     
  const [showPassword, setShowPassword] = useState(false);
    return (
        <div>
             <header className="border-b border-[#908787] mb-6 pb-4 space-y-2 text-center">
        <h1 className="text-[24px] font-bold">Welcome back 😍</h1>
        <h2 className="text-xl font-bold">No missed grocery items. No overspending.</h2>
        <p className="text-[#908787] text-base">Plan smarter. Shop better. Save more.</p>
      </header>

      <form action={handleSubmit} className="space-y-4 mx-auto mb-10">
        <h3 className="text-center text-xl font-extrabold">Sign In</h3>
        <input
          type="email"
          name="email"
          placeholder="Email"
          required
          className="border p-2 w-full rounded-sm"
        />
        <Link className='right-0 text-[#5358BB]' href='/auth/reset'>Forgot Password?</Link>
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

        <button
          type="submit"
          disabled={isPending}
          className="bg-amber-700 text-white px-4 py-2 cursor-pointer w-full rounded disabled:opacity-50"
        >
          {isPending ? 'Signing in...' : 'Sign in'}
        </button>
      </form>

      {/* <OneTapComponent /> */}
      

      <section className="text-center text-sm mt-[10vh]">
        <span className="font-semibold">You do not have an account? </span>
        <Link href="/auth/signup" className="text-[#5358BB] font-semibold underline">
          Sign up
        </Link>
      </section>
        </div>
    )
}

export default LoginFormComp
