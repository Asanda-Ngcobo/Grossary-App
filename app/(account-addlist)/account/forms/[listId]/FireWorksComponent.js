'use client';

import { useEffect, useState } from 'react';
import Fireworks from "react-canvas-confetti/dist/presets/fireworks";

export default function FireworksComponent() {
  const [showFireworks, setShowFireworks] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowFireworks(false);
    }, 5000); // 5 seconds

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {showFireworks && <Fireworks autorun={{ speed: 3 }} />}
    </>
  );
}
