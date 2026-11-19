"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";

interface MusicPlayerProps {
  audioSrc: string;
  autoPlay?: boolean;
  accentColor?: string;
}

export function MusicPlayer({ audioSrc, autoPlay, accentColor = "#C5A880" }: MusicPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fadeRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fadeIn = useCallback((audio: HTMLAudioElement) => {
    audio.volume = 0;
    const interval = setInterval(() => {
      if (audio.volume < 0.95) {
        audio.volume = Math.min(audio.volume + 0.05, 1);
      } else {
        audio.volume = 1;
        clearInterval(interval);
      }
    }, 50);
    fadeRef.current = interval;
  }, []);

  useEffect(() => {
    const audio = new Audio(audioSrc);
    audio.loop = true;
    audio.volume = 0;
    audioRef.current = audio;

    if (autoPlay) {
      audio
        .play()
        .then(() => {
          setIsPlaying(true);
          fadeIn(audio);
        })
        .catch(() => {
          // Browser blocked autoplay — stay paused
        });
    }

    return () => {
      audio.pause();
      audio.src = "";
      if (fadeRef.current) clearInterval(fadeRef.current);
    };
  }, [audioSrc, autoPlay, fadeIn]);

  const toggle = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().then(() => {
        setIsPlaying(true);
        if (audio.volume === 0) fadeIn(audio);
      }).catch(() => {});
    }
  }, [isPlaying, fadeIn]);

  return (
    <motion.button
      onClick={toggle}
      className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-lg backdrop-blur-sm"
      style={{ backgroundColor: `${accentColor}20`, border: `2px solid ${accentColor}40` }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      aria-label={isPlaying ? "Pause musik" : "Putar musik"}
    >
      {/* Vinyl disc */}
      <div
        className="w-10 h-10 rounded-full flex items-center justify-center"
        style={{
          backgroundColor: "#1C1917",
          animation: isPlaying ? "spin 3s linear infinite" : "none",
        }}
      >
        {/* Inner ring grooves */}
        <div
          className="w-7 h-7 rounded-full flex items-center justify-center"
          style={{ border: `1px solid #333` }}
        >
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: accentColor }}
          />
        </div>
      </div>

      {/* Music note indicator */}
      {isPlaying && (
        <motion.span
          className="absolute -top-1 -right-1 text-xs"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{ color: accentColor }}
        >
          ♪
        </motion.span>
      )}
    </motion.button>
  );
}
