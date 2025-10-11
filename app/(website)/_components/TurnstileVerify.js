"use client";

import { useEffect, useRef } from "react";

export default function TurnstileVerify({ onVerify }) {
  const ref = useRef(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    const sitekey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
    if (!sitekey) {
      console.warn("Missing NEXT_PUBLIC_TURNSTILE_SITE_KEY");
      return;
    }

    const renderWidget = () => {
      if (!window.turnstile || !ref.current) return;

      try {
        const widgetId = window.turnstile.render(ref.current, {
          sitekey,
          callback: (token) => {
            // ✅ Set token for parent component
            if (onVerify) onVerify(token);

            // ✅ Hide Turnstile banner once verified
            const banner = document.querySelector(
              "iframe[src*='challenges.cloudflare.com']"
            );
            if (banner) banner.style.display = "none";
          },
          "error-callback": () => {
            console.error("Turnstile error");
            if (onVerify) onVerify("");
          },
          "expired-callback": () => {
            if (onVerify) onVerify("");
          },
        });

        // store widgetId for cleanup if needed
        if (ref.current) ref.current.dataset.widgetId = String(widgetId);
      } catch (err) {
        console.error("Turnstile render error:", err);
      }
    };

    if (window.turnstile) {
      renderWidget();
    } else {
      // Wait for Turnstile script to load
      intervalRef.current = setInterval(() => {
        if (window.turnstile) {
          renderWidget();
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      }, 300);
    }

    // ✅ Cleanup
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      try {
        if (ref.current) {
          while (ref.current.firstChild) {
            ref.current.removeChild(ref.current.firstChild);
          }
        }
      } catch (cleanupErr) {
        console.warn("Failed to cleanup Turnstile:", cleanupErr);
      }
    };
  }, [onVerify]);

  return <div ref={ref} className="cf-turnstile" />;
}
