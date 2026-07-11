'use client'

import Link from "next/link";
import { useState, useTransition } from "react"


import { Check, Eye, EyeOff, X } from "@deemlol/next-icons";
import { redirect } from "next/navigation";

function SignUpClient({ setSignUp, SetSignUpSuccess }) {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [showPassword, setShowPassword] = useState(false);
  const [isPending, startTransition] = useTransition();

  const rules = [
    {
      label: "At least 1 uppercase letter",
      valid: /[A-Z]/.test(password),
    },
    {
      label: "At least 1 number",
      valid: /[0-9]/.test(password),
    },
    {
      label: "Minimum 8 characters",
      valid: password.length >= 8,
    },
  ];

const handleSubmit = (formData) => {
    startTransition(async () => {
      try {
         await signUpUser(formData);

        router.push('/account')

      } catch (error) {
        toast.error('An error occured when signing up, Please try again!!', {
  duration: 4000,
  style: {
    background: '#041527',
    color: '#fff',
  },
});
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex 
    items-center justify-center bg-black/40 backdrop-blur-md">

      {/* CARD */}
      <div className="relative w-[92%] 
      max-w-md rounded-2xl bg-white
       backdrop-blur-xl shadow-xl p-6">

        {/* Header */}
        <h2 className="font-sans text-(--accent-primary) font-bold text-center text-2xl">
          <Link href='login'>Grossary</Link>
        </h2>

        <p className="text-sm text-center mb-4">
          Register with email & password
        </p>

        {/* FORM */}
        <form
          action={handleSubmit}
          className="space-y-4"
        >
          <input
            type="text"
            placeholder="Full name*"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-md border border-gray-200 px-4 py-3 text-sm
            focus:outline-none focus:ring-2 focus:ring-(--accent-secondary)"
            required
          />

          <input
            type="email"
            placeholder="Email address*"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-md border border-gray-200 px-4 py-3 text-sm
            focus:outline-none focus:ring-2 focus:ring-(--accent-secondary)"
            required
          />

          {/* PASSWORD */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password*"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-md border border-gray-200 px-4 py-3 text-sm
              focus:outline-none focus:ring-2 focus:ring-(--accent-secondary)"
              required
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {/* PASSWORD RULES */}
          {password.length > 0 && (
            <ul className="text-xs space-y-1">
              {rules.map((rule, i) => (
                <li
                  key={i}
                  className={`flex items-center gap-2 ${
                    rule.valid ? "text-green-600" : "text-gray-500"
                  }`}
                >
                  {rule.valid ? (
                    <Check size={14} />
                  ) : (
                    <X size={14} className="text-red-500" />
                  )}
                  {rule.label}
                </li>
              ))}
            </ul>
          )}

             <button
        type="submit"
        disabled={isPending}
        className="bg-[#1EC677] text-white px-4 py-2 w-full rounded disabled:opacity-50"
      >
        {isPending ? 'Signing up...' : 'Sign Up'}
      </button>
        </form>
  {/* Terms and Privacy */}
      <section className="text-center text-sm text-[#908787] mb-4 px-2">
        By clicking the button above, you agree to our{" "}
        <Link href="/terms" className="underline text-[#041527]">Terms of Use</Link>{" "}
        and{" "}
        <Link href="/privacy-policy" className="underline text-[#041527]">Privacy Policy</Link>.
      </section>

        <div className="text-center mt-3 text-sm">
          <span>Have an account already?</span>{" "}
          <button
            className="text-blue-500 cursor-pointer"
            onClick={() => setSignUp(prev => !prev)}
          >
            Sign In
          </button>
        </div>
      </div>
    </div>
  )
}

export default SignUpClient