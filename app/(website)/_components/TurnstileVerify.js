
'use client';
import { useEffect, useRef } from 'react';

export default function TurnstileVerify() {
  const ref = useRef(null);

  useEffect(() => {
    if (window.turnstile && ref.current) {
      window.turnstile.render(ref.current, {
        sitekey: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY,
        callback: (token) => console.log('Turnstile token:', token),
      });
    }
  }, []);

  return <div ref={ref} className="cf-turnstile" />;
}
