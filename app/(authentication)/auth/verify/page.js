"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import TurnstileVerify from "@/app/(website)/_components/TurnstileVerify";

export default function VerifyPage() {
  const [token, setToken] = useState("");
  const router = useRouter();

  // Callback when token is received
  const handleToken = (token) => {
    setToken(token);
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!token) {
      alert("Please complete the verification.");
      return;
    }

    try {
      const res = await fetch("/api/verify-turnstile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });

      const data = await res.json();

      if (data.success) {
        // Store short-lived cookie to allow access to signup
        const expires = new Date(Date.now() + 2 * 60 * 1000).toUTCString(); // 2 minutes
        document.cookie = `verified=true; path=/; expires=${expires}`;
        router.push("/auth/signup");
      } else {
        alert("Verification failed ❌ Please try again.");
      }
    } catch (error) {
      console.error("Verification error:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-lg mb-4">Please verify you’re human</h1>

      <form onSubmit={handleVerify} className="flex flex-col gap-4">
        {/* ✅ Cloudflare widget */}
        <TurnstileVerify onVerify={handleToken} />

        <button
          type="submit"
          disabled={!token}
          className="bg-[#A2B06D] text-white px-4 py-2 rounded-lg cursor-pointer disabled:opacity-50 active:bg-gray-400"
        >
          Verify & Continue
        </button>
      </form>
    </div>
  );
}
