
"use client";

import { useEffect } from "react";

export default function useScreenWakeLock(isActive) {
  useEffect(() => {
    if (
      !isActive ||
      typeof navigator === "undefined" ||
      !("wakeLock" in navigator)
    ) {
      return;
    }

    let wakeLock = null;
    let cancelled = false;

    async function requestWakeLock() {
      if (
        cancelled ||
        document.visibilityState !== "visible"
      ) {
        return;
      }

      try {
        if (wakeLock && !wakeLock.released) {
          return;
        }

        const lock = await navigator.wakeLock.request("screen");

        if (cancelled) {
          await lock.release();
          return;
        }

        wakeLock = lock;

        lock.addEventListener("release", () => {
          if (wakeLock === lock) {
            wakeLock = null;
          }
        });
      } catch (error) {
        console.warn("Unable to acquire screen wake lock:", error);
      }
    }

    function handleVisibilityChange() {
      if (document.visibilityState === "visible") {
        requestWakeLock();
      }
    }

    requestWakeLock();

    document.addEventListener(
      "visibilitychange",
      handleVisibilityChange
    );

    return () => {
      cancelled = true;

      document.removeEventListener(
        "visibilitychange",
        handleVisibilityChange
      );

      if (wakeLock && !wakeLock.released) {
        wakeLock.release().catch((error) => {
          console.warn("Unable to release screen wake lock:", error);
        });
      }
    };
  }, [isActive]);
}
