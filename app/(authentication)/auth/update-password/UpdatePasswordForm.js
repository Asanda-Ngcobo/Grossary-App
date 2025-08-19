'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

import SignUpButton from '@/app/(account)/_ui/MainAppButton'
import { createClient } from '@/app/_utils/supabase/client'
import { Eye, EyeOff } from '@deemlol/next-icons'

export function UpdatePasswordForm() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleForgotPassword = async (e) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      setIsLoading(false)
      return
    }

    try {
      const { error } = await supabase.auth.updateUser({ password })
      if (error) throw error
      router.push('/account')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-2xl border p-6 shadow-sm">
        <div className="mb-4 grid justify-center">
          <h2 className="text-2xl font-semibold ">Reset Your Password</h2>
          <p className="text-sm text-muted-foreground">
            Please enter your new password below.
          </p>
        </div>

        <form onSubmit={handleForgotPassword} className="space-y-4 mx-auto mb-10">
            <div className="max-w-3xl mx-auto pt-[25%] lg:pt-[10%] p-6 text-gray-900">
            {/* New Password */}
            <div className="grid gap-2 relative items-center">
              <label htmlFor="password">New password</label>
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="New password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                 className="border p-2 w-full rounded-sm"
              />
              <button
                type="button"
                className="absolute right-3 top-11 text-gray-500 hover:text-gray-700"
                onClick={() => setShowPassword((prev) => !prev)}
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* Confirm Password */}
            <div className="grid gap-2 relative">
              <label htmlFor="confirmPassword">Confirm password</label>
              <input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Confirm password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                 className="border p-2 w-full rounded-sm"
              />
              <button
                type="button"
                className="absolute right-3 top-11 text-gray-500 hover:text-gray-700"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                tabIndex={-1}
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* Error Message */}
            {error && <p className="text-sm text-red-500">{error}</p>}

            {/* Submit */}
            {/* <SignUpBu type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Saving...' : 'Save new password'}
            </SignUpBu> */}

            <button
          type="submit"
          disabled={isLoading}
          className="bg-[#A2B06D] text-white px-4 my-2 py-2 w-full rounded disabled:opacity-50"
        >
          {isLoading ? 'Saving...' : 'Save New password'}
        </button>
          </div>
        </form>
      </div>
    </div>
  )
}
