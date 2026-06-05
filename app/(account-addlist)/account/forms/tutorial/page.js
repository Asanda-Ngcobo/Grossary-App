"use client";

import Link from "next/link";

export default function TutorialPage() {
  return (
    <main className="min-h-screen bg-white flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-2xl text-center">

        {/* Header */}
        <h1 className="text-3xl font-bold text-[#0B2E1E]">
          Thank you for completing our survey 💚
        </h1>

        <p className="mt-4 text-gray-600 leading-relaxed">
          Your responses will help make Grossary better for everyone.
          <br />
          Watch the video below for your next step.
        </p>

        <div className="mt-10 flex justify-center">
          <div className="w-full max-w-md rounded-2xl overflow-hidden shadow-lg border bg-black">
            <video
              className="w-full h-auto"
              controls
              playsInline
              preload="metadata"
            >
              <source src="/Grocery Shopping For June.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>

        {/* CTA Button */}
        <div className="mt-10">
          <Link
            href="/account"
            className="inline-flex items-center
             justify-center rounded-xl bg-[#0B2E1E] px-8 py-4 text-white font-medium hover:bg-green-700 transition"
          >
            Go to Home
          </Link>
        </div>

      </div>
    </main>
  );
}
