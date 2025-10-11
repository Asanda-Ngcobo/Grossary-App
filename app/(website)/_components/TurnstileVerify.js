'use client'
import { useEffect, useRef } from "react";

export default function TurnstileVerify({ onVerify }) {
  const ref = useRef(null);

  useEffect(() => {
    if (window.turnstile && ref.current) {
      window.turnstile.render(ref.current, {
        sitekey: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY,
        callback: onVerify, // Pass token back to parent
        
      });
    }
  }, [onVerify]);

  return <div ref={ref} className="cf-turnstile" />;
}
