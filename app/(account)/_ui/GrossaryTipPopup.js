
"use client";

import { useEffect } from "react";

export default function GrossaryTipPopup({

  open = false,
  title = "Get Better Results!",
  description,
  example,
  tipNumber = 1,
  totalTips,
  onNext,
  onSkip,
  nextLabel = "Okay, next",
}) {
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onSkip?.();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onSkip]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center
        bg-black/60 px-4 py-6 backdrop-blur-[3px]"
      // onMouseDown={(event) => {
      //   if (event.target === event.currentTarget) {
      //     onSkip?.();
      //   }
      // }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="grossary-tip-title"
        aria-describedby="grossary-tip-description"
        className="relative w-full max-w-md overflow-hidden rounded-3xl
          bg-white shadow-2xl"
      >
        {/* Header */}
        <div className="relative overflow-hidden bg-[#0B2E1E] px-6 pb-7 pt-6">
          <div
            className="absolute -right-10 -top-12 h-36 w-36
              rounded-full bg-[#1EC677]/20"
          />

          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span
                className="flex h-10 w-10 items-center justify-center
                  rounded-xl bg-[#1EC677] text-xl"
                aria-hidden="true"
              >
                💡
              </span>

              <div>
                <p className="text-sm font-semibold text-[#1EC677]">
                  grossary plus tips
                </p>
                <p className="text-xs text-white/70">
                  Make every shop count
                </p>
              </div>
            </div>

            {/* <button
              type="button"
              onClick={onSkip}
              aria-label="Close tip"
              className="flex h-9 w-9 items-center justify-center
                rounded-full text-xl text-white/80 transition
                hover:bg-white/10 hover:text-white"
            >
              ×
            </button> */}
          </div>

          <div className="relative mt-6 flex gap-1.5">
            {Array.from({ length: totalTips }).map((_, index) => (
              <div
                key={index}
                className={`h-1.5 flex-1 rounded-full ${
                  index < tipNumber
                    ? "bg-[#1EC677]"
                    : "bg-white/20"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="px-6 pb-6 pt-7">
         <h2
  id="grossary-tip-title"
  className="text-2xl font-bold leading-tight text-[#0B2E1E]"
>
  {title}
</h2>

{tipNumber === 3 && (
  <div className="mt-5 overflow-hidden rounded-2xl border border-gray-200 bg-black">
    <video
      className="block aspect-video w-full object-cover"
      autoPlay
      muted
      loop
      playsInline
      controls
      preload="metadata"
      aria-label="Grossary Plus shopping demonstration"
    >
      <source src="/Tap the + button.mp4" type="video/mp4" />
      Your browser does not support the video element.
    </video>
  {/* https://1drv.ms/v/c/a69b2f6b39a4e7c8/IQQCxlK4ebARRazndn4f0ngWAeNIMk-UYp-OafGlLIbgiio?width=800&height=800 */}
  </div>
)}

<p
  id="grossary-tip-description"
  className="mt-3 text-base leading-7 text-gray-600"
>
  {description}
</p>

          {example && (
            <div className="mt-5 rounded-2xl border border-[#1EC677]/30
              bg-[#1EC677]/10 p-4">
              <p className="mb-1 text-xs font-bold uppercase tracking-wider
                text-[#0B2E1E]/70">
                Example
              </p>
              <p className="text-sm font-semibold leading-6 text-[#0B2E1E]">
                {example}
              </p>
            </div>
          )}

          {/* Actions */}
          <button
            type="button"
            onClick={onNext}
            className="mt-7 flex w-full items-center justify-center
              gap-2 rounded-xl bg-[#0B2E1E] px-5 py-4
              font-semibold text-white transition
              hover:bg-[#164b34] active:scale-[0.99]"
          >
            {nextLabel}
            <span aria-hidden="true">→</span>
          </button>

          {/* <button
            type="button"
            onClick={onSkip}
            className="mt-3 w-full py-2 text-sm font-medium
              text-gray-500 transition hover:text-[#0B2E1E]"
          >
            Skip tips
          </button> */}
        </div>
      </div>
    </div>
  );
}
