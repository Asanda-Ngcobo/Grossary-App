
let audioContext = null;

export async function initializeGrossaryPlusSound() {
  if (typeof window === "undefined") return;

  try {
    const AudioContextClass =
      window.AudioContext || window.webkitAudioContext;

    if (!AudioContextClass) return;

    if (!audioContext || audioContext.state === "closed") {
      audioContext = new AudioContextClass();
    }

    if (audioContext.state === "suspended") {
      await audioContext.resume();
    }
  } catch (error) {
    console.warn(
      "Unable to initialize Grossary Plus sound:",
      error
    );
  }
}

export async function playGrossaryPlusSuccessSound() {
  try {
    if (typeof window === "undefined") return;

    // Initialize if it hasn't been initialized yet.
    await initializeGrossaryPlusSound();

    if (!audioContext || audioContext.state !== "running") {
      return;
    }

    const playBeep = (frequency, startTime, duration) => {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.type = "square";

      oscillator.frequency.setValueAtTime(
        frequency,
        startTime
      );

      gainNode.gain.setValueAtTime(0.0001, startTime);

      gainNode.gain.exponentialRampToValueAtTime(
        0.12,
        startTime + 0.01
      );

      gainNode.gain.setValueAtTime(
        0.12,
        startTime + duration - 0.02
      );

      gainNode.gain.exponentialRampToValueAtTime(
        0.0001,
        startTime + duration
      );

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.start(startTime);
      oscillator.stop(startTime + duration);
    };

    const startTime = audioContext.currentTime;

    // First scanner beep
    playBeep(1800, startTime, 0.09);

    // Second scanner beep
    playBeep(1400, startTime + 0.13, 0.11);
  } catch (error) {
    console.warn(
      "Unable to play Grossary Plus success sound:",
      error
    );
  }
}


export async function playGrossaryPlusErrorSound() {
  try {
    if (typeof window === "undefined") return;

    await initializeGrossaryPlusSound();

    if (!audioContext || audioContext.state !== "running") {
      return;
    }

    const playBeep = (frequency, startTime, duration) => {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.type = "sine";

      oscillator.frequency.setValueAtTime(
        frequency,
        startTime
      );

      gainNode.gain.setValueAtTime(0.0001, startTime);

      gainNode.gain.exponentialRampToValueAtTime(
        0.15,
        startTime + 0.015
      );

      gainNode.gain.setValueAtTime(
        0.15,
        startTime + duration - 0.03
      );

      gainNode.gain.exponentialRampToValueAtTime(
        0.0001,
        startTime + duration
      );

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.start(startTime);
      oscillator.stop(startTime + duration);
    };

    const startTime = audioContext.currentTime;

    // Low error tone
    playBeep(440, startTime, 0.18);

    // Second, lower tone
    playBeep(330, startTime + 0.23, 0.25);
  } catch (error) {
    console.warn(
      "Unable to play Grossary Plus error sound:",
      error
    );
  }
}
