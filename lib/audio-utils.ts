/* ============================================================
   Audio Utility — Universal Audio & YouTube Fade-In & Fade-Out
   ============================================================ */

/**
 * Smoothly fades in an HTMLAudioElement volume from 0 to targetVolume over durationMs.
 */
export function fadeInAudio(
  audio: HTMLAudioElement | null,
  targetVolume = 0.7,
  durationMs = 2500,
  startTime?: number
): () => void {
  if (!audio) return () => {};

  if (startTime !== undefined && startTime > 0) {
    try {
      audio.currentTime = startTime;
    } catch {
      // Ignore seek error if metadata not ready yet
    }
  }

  audio.volume = 0;
  const playPromise = audio.play();
  if (playPromise !== undefined) {
    playPromise.catch((err) => {
      console.warn('Audio play auto-prevented:', err);
    });
  }

  const steps = 30;
  const stepTime = durationMs / steps;
  const volumeIncrement = targetVolume / steps;
  let currentVol = 0;

  const fadeInterval = setInterval(() => {
    if (!audio) {
      clearInterval(fadeInterval);
      return;
    }
    currentVol = Math.min(targetVolume, currentVol + volumeIncrement);
    audio.volume = currentVol;

    if (currentVol >= targetVolume) {
      clearInterval(fadeInterval);
    }
  }, stepTime);

  return () => {
    clearInterval(fadeInterval);
  };
}

/**
 * Smoothly fades out an HTMLAudioElement volume to 0 over durationMs, then pauses.
 */
export function fadeOutAudio(
  audio: HTMLAudioElement | null,
  durationMs = 500,
  onComplete?: () => void
): () => void {
  if (!audio || audio.paused) {
    if (onComplete) onComplete();
    return () => {};
  }

  const startVolume = audio.volume;
  const steps = 15;
  const stepTime = durationMs / steps;
  const volumeDecrement = startVolume / steps;
  let currentVol = startVolume;

  const fadeInterval = setInterval(() => {
    if (!audio) {
      clearInterval(fadeInterval);
      if (onComplete) onComplete();
      return;
    }
    currentVol = Math.max(0, currentVol - volumeDecrement);
    audio.volume = currentVol;

    if (currentVol <= 0) {
      clearInterval(fadeInterval);
      audio.pause();
      if (onComplete) onComplete();
    }
  }, stepTime);

  return () => {
    clearInterval(fadeInterval);
  };
}

/**
 * Smoothly fades in a YouTube iframe player volume from 0 to targetVolume (0-100) over durationMs.
 */
export function fadeInYouTubeIframe(
  iframe: HTMLIFrameElement | null,
  targetVolume = 70,
  durationMs = 2500
): () => void {
  if (!iframe || !iframe.contentWindow) return () => {};

  try {
    iframe.contentWindow.postMessage(
      JSON.stringify({ event: 'command', func: 'setVolume', args: [0] }),
      '*'
    );
    iframe.contentWindow.postMessage(
      JSON.stringify({ event: 'command', func: 'playVideo', args: [] }),
      '*'
    );
  } catch (err) {
    console.warn('YouTube postMessage error:', err);
  }

  const steps = 25;
  const stepTime = durationMs / steps;
  const volumeIncrement = targetVolume / steps;
  let currentVol = 0;

  const fadeInterval = setInterval(() => {
    if (!iframe || !iframe.contentWindow) {
      clearInterval(fadeInterval);
      return;
    }
    currentVol = Math.min(targetVolume, currentVol + volumeIncrement);
    try {
      iframe.contentWindow.postMessage(
        JSON.stringify({ event: 'command', func: 'setVolume', args: [Math.round(currentVol)] }),
        '*'
      );
    } catch {
      // Ignore
    }

    if (currentVol >= targetVolume) {
      clearInterval(fadeInterval);
    }
  }, stepTime);

  return () => {
    clearInterval(fadeInterval);
  };
}
