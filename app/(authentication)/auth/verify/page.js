"use client";
import { useState, useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import SpinnerMini from "@/app/(website)/_components/SpinnerMini";

export default function VerifyPage() {
  const [token, setToken] = useState("");
  const router = useRouter();
   const [isPending] = useTransition();

  useEffect(() => {
    // Make callback globally accessible for Turnstile
    window.turnstileCallback = (token) => {
      setToken(token);
    };
  }, []);

  const handleVerify = async (e) => {
    e.preventDefault();

    const res = await fetch("/api/verify-turnstile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    });

    const data = await res.json();

    if (data.success) {
      // set cookie to allow access to /signup
      const expires = new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toUTCString();// 15 DAYS FROM NOW
      document.cookie = `verified=true; path=/; expires=${expires}`;
      router.push("/auth/signup");
    } else {
      alert("Verification failed ❌ Please try again.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-lg mb-4">Please verify you’re human</h1>

      <form onSubmit={handleVerify} className="flex flex-col gap-4">
        <div
          className="cf-turnstile"
          data-sitekey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY}
          data-callback="turnstileCallback"
        ></div>

        <button
          type="submit"
          disabled={!token}
          className="bg-[#A2B06D] cursor-pointer text-white
          flex justify-center active:bg-gray-400 items-center px-4 py-2 rounded-lg"
        >
          {isPending ? <SpinnerMini/> : 'Verify & Continue'}
        </button>
      </form>

      <script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js"
        async
        defer
      ></script>
    </div>
  );
}
