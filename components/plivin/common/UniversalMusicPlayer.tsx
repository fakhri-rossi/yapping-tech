'use client';

import { useEffect, useRef, useState } from 'react';
import { fadeInAudio, fadeOutAudio, fadeInYouTubeIframe } from '@lib/audio-utils';

interface UniversalMusicPlayerProps {
  musicUrl?: string;
  isPlaying: boolean;
  volume?: number;
  showControls?: boolean;
  startTime?: number;
}

/**
 * Extracts YouTube Video ID from any YouTube URL (watch, shorts, embed, youtu.be, etc.)
 */
export function parseYouTubeVideoId(url?: string): string | null {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|shorts\/)([^#&?]*).*/;
  const match = url.trim().match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
}

export default function UniversalMusicPlayer({
  musicUrl = '',
  isPlaying,
  volume = 0.7,
  showControls = true,
  startTime = 0,
}: UniversalMusicPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const [ytVideoId, setYtVideoId] = useState<string | null>(null);
  const [userMuted, setUserMuted] = useState(false);
  const hasSeekedRef = useRef(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!musicUrl) {
        setYtVideoId(null);
        return;
      }
      const detectedYtId = parseYouTubeVideoId(musicUrl);
      setYtVideoId(detectedYtId);
      hasSeekedRef.current = false;
    }, 0);
    return () => clearTimeout(timer);
  }, [musicUrl]);

  const effectivePlay = isPlaying && !userMuted;

  // 1. Handle standard HTML5 audio with smooth Fade-In & Fade-Out
  useEffect(() => {
    if (ytVideoId) return; // Managed by YouTube Iframe

    const audio = audioRef.current;
    if (!audio) return;

    let cleanupFade: (() => void) | undefined;

    if (effectivePlay) {
      const seekTime = !hasSeekedRef.current ? startTime : undefined;
      cleanupFade = fadeInAudio(audio, volume, 2500, seekTime);
      hasSeekedRef.current = true;
    } else {
      cleanupFade = fadeOutAudio(audio, 400);
    }

    return () => {
      if (cleanupFade) cleanupFade();
    };
  }, [effectivePlay, musicUrl, volume, ytVideoId, startTime]);

  // 2. Handle YouTube iframe PostMessage Play/Pause with smooth Fade-In
  useEffect(() => {
    if (!ytVideoId) return;
    const iframe = iframeRef.current;
    if (!iframe || !iframe.contentWindow) return;

    let cleanupYtFade: (() => void) | undefined;

    try {
      if (effectivePlay) {
        cleanupYtFade = fadeInYouTubeIframe(iframe, Math.round(volume * 100), 2500);
      } else {
        iframe.contentWindow.postMessage(
          JSON.stringify({ event: 'command', func: 'pauseVideo', args: [] }),
          '*'
        );
      }
    } catch (err) {
      console.warn('YouTube postMessage error:', err);
    }

    return () => {
      if (cleanupYtFade) cleanupYtFade();
    };
  }, [effectivePlay, ytVideoId, volume]);

  if (!musicUrl) return null;

  const toggleMusic = () => {
    setUserMuted((prev) => !prev);
  };

  // IMPORTANT: Keep ytEmbedSrc STATIC during play/pause so the iframe doesn't reload.
  const ytEmbedSrc = ytVideoId
    ? `https://www.youtube.com/embed/${ytVideoId}?enablejsapi=1&autoplay=1&playsinline=1&loop=1&playlist=${ytVideoId}&controls=0&mute=0${
        startTime > 0 ? `&start=${startTime}` : ''
      }&origin=${typeof window !== 'undefined' ? window.location.origin : ''}`
    : '';

  return (
    <>
      {/* YouTube Embed Player */}
      {ytVideoId && (
        <div className="sr-only pointer-events-none opacity-0 absolute w-1 h-1 overflow-hidden -left-[9999px]">
          <iframe
            key={ytVideoId}
            ref={iframeRef}
            src={ytEmbedSrc}
            title="Background Music YouTube"
            allow="autoplay; encrypted-media; fullscreen"
            className="w-1 h-1"
            onLoad={() => {
              const iframe = iframeRef.current;
              if (!iframe || !iframe.contentWindow) return;
              if (effectivePlay) {
                try {
                  fadeInYouTubeIframe(iframe, Math.round(volume * 100), 2000);
                } catch {
                  // Ignore
                }
              } else {
                try {
                  iframe.contentWindow.postMessage(
                    JSON.stringify({ event: 'command', func: 'pauseVideo', args: [] }),
                    '*'
                  );
                } catch {
                  // Ignore
                }
              }
            }}
          />
        </div>
      )}

      {/* Standard HTML5 Audio */}
      {!ytVideoId && <audio ref={audioRef} src={musicUrl} loop preload="auto" className="hidden" />}

      {/* Floating Music ON/OFF Toggle Button */}
      {showControls !== false && isPlaying && (
        <button
          type="button"
          onClick={toggleMusic}
          title={userMuted ? 'Nyalakan Musik' : 'Matikan Musik'}
          className="fixed top-4 right-4 z-50 p-2.5 rounded-full bg-black/80 text-white border border-white/20 hover:border-white hover:bg-black transition-all shadow-xl backdrop-blur-md flex items-center justify-center cursor-pointer group"
        >
          {effectivePlay ? (
            <span className="relative flex items-center justify-center">
              <span className="absolute -inset-1 rounded-full bg-emerald-500/40 animate-ping" />
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-400 relative">
                <path d="M9 18V5l12-2v13" />
                <circle cx="6" cy="18" r="3" />
                <circle cx="18" cy="16" r="3" />
              </svg>
            </span>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-rose-400">
              <line x1="1" y1="1" x2="23" y2="23" />
              <path d="M9 18V5l12-2v13" />
              <circle cx="6" cy="18" r="3" />
              <circle cx="18" cy="16" r="3" />
            </svg>
          )}
        </button>
      )}
    </>
  );
}
