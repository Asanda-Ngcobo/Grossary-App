'use client'

import Link from "next/link";
import { useState, useTransition } from "react";
import { ChevronLeft, Eye, EyeOff } from "@deemlol/next-icons";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import { login } from "@/app/_lib/actions";
import SignUpClient from "./SignUpClient";

const toastStyle = {
  background: "#0B2E1E",
  color: "#fff",
};

function EmailLogin({ setIsEmail }) {
  const [signup, setSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isPending, startTransition] = useTransition();

  const router = useRouter();

  function handleSubmit(event) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    startTransition(async () => {
      try {
        await login(formData);

        toast.success("Signed in successfully!", {
          duration: 3000,
          style: toastStyle,
        });

        router.push("/account");
      } catch {
        toast.error("Incorrect email or password.", {
          duration: 5000,
          style: toastStyle,
        });
      }
    });
  }

  return (
    <>
      <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 backdrop-blur-md">
        <div className="relative w-[92%] max-w-md rounded-2xl bg-white/80 backdrop-blur-xl shadow-2xl p-7 animate-in fade-in zoom-in-95 duration-200">

          <button
            type="button"
            onClick={() => setIsEmail(false)}
            aria-label="Go back"
            className="absolute left-5 top-5 flex h-9 w-9 items-center justify-center rounded-full bg-(--accent-primary) transition hover:scale-105"
          >
            <ChevronLeft />
          </button>

          {signup ? (
            <SignUpClient setSignUp={setSignUp} />
          ) : (
            <div className="mt-10">
              <h2 className="text-2xl font-semibold mb-1">
                Welcome back
              </h2>

              <p className="text-sm text-gray-500 mb-6">
                Sign in to continue.
              </p>

              <form
                onSubmit={handleSubmit}
                className="space-y-4"
              >
                <input
                  type="email"
                  name="email"
                  required
                  autoComplete="email"
                  placeholder="Email address"
                  className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm transition focus:border-(--accent-secondary) focus:outline-none focus:ring-2 focus:ring-(--accent-secondary)"
                />

                <div className="text-right text-xs">
                  <Link
                    href="/auth/forgot-password"
                    className="text-blue-500 hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>

                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    required
                    autoComplete="current-password"
                    placeholder="Password"
                    className="w-full rounded-lg border border-gray-200 px-4 py-3 pr-12 text-sm transition focus:border-(--accent-secondary) focus:outline-none focus:ring-2 focus:ring-(--accent-secondary)"
                  />

                  <button
                    type="button"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black"
                  >
                    {showPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={isPending}
                  className="w-full rounded-lg bg-[#1EC677] py-3 font-medium text-white transition hover:bg-[#17b66b] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isPending ? "Signing in..." : "Sign in"}
                </button>
              </form>

              <div className="mt-6 text-center text-sm">
                <span className="text-gray-600">
                  Do not have an account?
                </span>{" "}
                <button
                  type="button"
                  onClick={() => setSignUp(true)}
                  className="font-medium text-blue-500 hover:underline"
                >
                  Sign up
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default EmailLogin;