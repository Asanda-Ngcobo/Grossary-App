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

        {/* Video Embed */}
        <div className="mt-10 flex justify-center">
          <div className="w-full max-w-md rounded-2xl overflow-hidden shadow-lg border">
            <iframe
              src="https://1drv.ms/v/c/a69b2f6b39a4e7c8/IQRSyjVzGYM4TJyY1f2S3tVnARR44CC0alJyZ9LonM841_Y?width=3840&height=2160"
              className="w-full h-[600px]"
              allow="encrypted-media"
              allowFullScreen
            />
          </div>
        </div>

        {/* CTA Button */}
        <div className="mt-10">
          <Link
            href="/account/cards"
            className="inline-flex items-center
             justify-center rounded-xl bg-[#0B2E1E] px-8 py-4 text-white font-medium hover:bg-green-700 transition"
          >
            Finish
          </Link>
        </div>

      </div>
    </main>
  );
}
