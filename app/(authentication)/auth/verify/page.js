"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import TurnstileVerify from "@/app/(website)/_components/TurnstileVerify";


export default function VerifyPage() {
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleVerify = async (e) => {
    e.preventDefault();

    if (!token) return;

    setLoading(true);

    try {
      const res = await fetch("/api/verify-turnstile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });

      const data = await res.json();

      if (data.success) {
        // Set cookie to allow access to /signup (expires in 15 days)
        const expires = new Date(Date.now() + 2 * 60 * 1000).toUTCString();
        document.cookie = `verified=true; path=/; expires=${expires}`;

        router.push("/auth/signup");
      } else {
        alert("Verification failed ❌ Please try again.");
      }
    } catch (err) {
      console.error("Verification error:", err);
      alert("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-2xl font-semibold mb-6">Please verify you’re human</h1>

      <form onSubmit={handleVerify} className="flex flex-col gap-6 w-full max-w-md">
        {/* Turnstile widget */}
        <TurnstileVerify onVerify={(token) => setToken(token)} />

        <button
          type="submit"
          disabled={!token || loading}
          className="bg-[#A2B06D] text-white px-6 py-3 rounded-lg hover:bg-[#8fa85a] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Verifying..." : "Verify & Continue"}
        </button>
      </form>
    </div>
  );
}
