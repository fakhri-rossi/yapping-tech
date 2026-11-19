'use client';

import React from 'react';

interface UniversalVideoPlayerProps {
  videoUrl?: string;
  className?: string;
  fallbackPoster?: string;
  muted?: boolean;
  controls?: boolean;
  pointerEventsNone?: boolean;
}

export function parseGoogleDriveFileId(url: string): string | null {
  if (!url) return null;
  const matchFile = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (matchFile && matchFile[1]) return matchFile[1];
  const matchId = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (matchId && matchId[1]) return matchId[1];
  return null;
}

export function parseYouTubeVideoId(url: string): string | null {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|shorts\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
}

export default function UniversalVideoPlayer({
  videoUrl,
  className = 'w-full h-full object-cover',
  fallbackPoster,
  muted = false,
  controls = true,
  pointerEventsNone = false,
}: UniversalVideoPlayerProps) {
  const pointerClass = pointerEventsNone ? 'pointer-events-none' : 'pointer-events-auto';

  if (!videoUrl || videoUrl.trim().length === 0) {
    return (
      <video
        src="/images/sakura-flower.mp4"
        autoPlay
        muted={muted}
        loop
        playsInline
        controls={controls}
        poster={fallbackPoster}
        className={`${className} ${pointerClass}`}
      />
    );
  }

  const cleanUrl = videoUrl.trim();

  // 1. Check if Google Drive Link
  const gdriveId = parseGoogleDriveFileId(cleanUrl);
  if (gdriveId) {
    return (
      <iframe
        src={`https://drive.google.com/file/d/${gdriveId}/preview`}
        title="Video Kenangan Google Drive"
        allow="autoplay; encrypted-media; fullscreen"
        className={`border-0 ${className} ${pointerClass}`}
      />
    );
  }

  // 2. Check if YouTube Link
  const ytId = parseYouTubeVideoId(cleanUrl);
  if (ytId) {
    const ytParams = new URLSearchParams({
      autoplay: '1',
      mute: muted ? '1' : '0',
      controls: controls ? '1' : '0',
      loop: '1',
      playlist: ytId,
      playsinline: '1',
    });

    return (
      <iframe
        src={`https://www.youtube.com/embed/${ytId}?${ytParams.toString()}`}
        title="Video Kenangan YouTube"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className={`border-0 ${className} ${pointerClass}`}
      />
    );
  }

  // 3. Fallback to standard HTML5 video tag
  return (
    <video
      src={cleanUrl}
      autoPlay
      muted={muted}
      loop
      playsInline
      controls={controls}
      poster={fallbackPoster}
      className={`${className} ${pointerClass}`}
    />
  );
}
