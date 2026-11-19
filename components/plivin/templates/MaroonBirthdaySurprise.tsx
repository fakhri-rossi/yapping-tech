'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { TemplateProps } from '@type/gift';
import UniversalMusicPlayer from '@components/plivin/common/UniversalMusicPlayer';

/* ============================================================
   Maroon Birthday Surprise — Premium Birthday Template
   Dark maroon background, sakura petals, PIN entry, gift box,
   scrollable letter with bouquet, photo & playlist.
   ============================================================ */

/* ---------- SVG Inline Components (no emojis!) ---------- */

const SakuraPetal = ({ className = '', style = {} }: { className?: string; style?: React.CSSProperties }) => (
  <svg className={className} style={style} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M20 2C20 2 28 10 28 20C28 30 20 38 20 38C20 38 12 30 12 20C12 10 20 2 20 2Z"
      fill="url(#petalGrad)"
      opacity="0.9"
    />
    <path
      d="M20 6C20 6 26 12 26 20C26 28 20 34 20 34"
      stroke="rgba(255,255,255,0.3)"
      strokeWidth="0.5"
      fill="none"
    />
    <defs>
      <linearGradient id="petalGrad" x1="12" y1="2" x2="28" y2="38" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FFB7C5" />
        <stop offset="50%" stopColor="#FF8FAB" />
        <stop offset="100%" stopColor="#E8637A" />
      </linearGradient>
    </defs>
  </svg>
);

const GiftBoxIcon = ({ className = '' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Ribbon vertical */}
    <rect x="52" y="8" width="16" height="112" rx="2" fill="#D4A853" opacity="0.9" />
    {/* Ribbon horizontal */}
    <rect x="8" y="42" width="104" height="16" rx="2" fill="#D4A853" opacity="0.9" />
    {/* Box lid */}
    <rect x="8" y="38" width="104" height="24" rx="6" fill="#7B1A2C" stroke="#5A0E1E" strokeWidth="2" />
    {/* Box body */}
    <rect x="14" y="62" width="92" height="52" rx="6" fill="#6B1525" stroke="#4A0E18" strokeWidth="2" />
    {/* Lid ribbon overlay */}
    <rect x="52" y="38" width="16" height="24" fill="#C9953E" />
    {/* Body ribbon overlay */}
    <rect x="52" y="62" width="16" height="52" fill="#C9953E" opacity="0.8" />
    {/* Bow left */}
    <ellipse cx="46" cy="38" rx="16" ry="12" fill="#D4A853" />
    <ellipse cx="46" cy="38" rx="12" ry="8" fill="#E8B96A" />
    {/* Bow right */}
    <ellipse cx="74" cy="38" rx="16" ry="12" fill="#D4A853" />
    <ellipse cx="74" cy="38" rx="12" ry="8" fill="#E8B96A" />
    {/* Bow center */}
    <circle cx="60" cy="38" r="6" fill="#C9953E" stroke="#A87D32" strokeWidth="1" />
    {/* Shine highlight */}
    <rect x="24" y="68" width="24" height="4" rx="2" fill="rgba(255,255,255,0.15)" />
    <rect x="24" y="78" width="16" height="3" rx="1.5" fill="rgba(255,255,255,0.1)" />
  </svg>
);

const BouquetIcon = ({ className = '' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 160 200" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Wrapper / Paper cone */}
    <path d="M40 100L80 190L120 100" fill="#F5E6D3" stroke="#D4C4B0" strokeWidth="2" />
    <path d="M45 105L80 185L115 105" fill="#FAF0E6" />
    {/* Ribbon on wrapper */}
    <path d="M42 105Q80 115 118 105" stroke="#D4A853" strokeWidth="4" fill="none" />
    {/* Rose 1 - center */}
    <circle cx="80" cy="65" r="18" fill="#C94060" />
    <circle cx="80" cy="65" r="12" fill="#E0506E" />
    <circle cx="80" cy="65" r="6" fill="#CC3355" />
    {/* Rose 2 - left */}
    <circle cx="55" cy="78" r="15" fill="#B83050" />
    <circle cx="55" cy="78" r="10" fill="#D04868" />
    <circle cx="55" cy="78" r="5" fill="#A82848" />
    {/* Rose 3 - right */}
    <circle cx="105" cy="78" r="15" fill="#C94060" />
    <circle cx="105" cy="78" r="10" fill="#E0506E" />
    <circle cx="105" cy="78" r="5" fill="#CC3355" />
    {/* Rose 4 - top left */}
    <circle cx="62" cy="52" r="13" fill="#D04868" />
    <circle cx="62" cy="52" r="8" fill="#E86080" />
    <circle cx="62" cy="52" r="4" fill="#C04060" />
    {/* Rose 5 - top right */}
    <circle cx="98" cy="52" r="13" fill="#B83050" />
    <circle cx="98" cy="52" r="8" fill="#D04868" />
    <circle cx="98" cy="52" r="4" fill="#A82848" />
    {/* Sakura accent petals */}
    <ellipse cx="45" cy="60" rx="8" ry="5" fill="#FFB7C5" transform="rotate(-20 45 60)" />
    <ellipse cx="115" cy="60" rx="8" ry="5" fill="#FFB7C5" transform="rotate(20 115 60)" />
    <ellipse cx="80" cy="40" rx="7" ry="4" fill="#FFC8D6" transform="rotate(10 80 40)" />
    {/* Leaves */}
    <ellipse cx="38" cy="90" rx="12" ry="6" fill="#4A7A3A" transform="rotate(-30 38 90)" />
    <ellipse cx="122" cy="90" rx="12" ry="6" fill="#4A7A3A" transform="rotate(30 122 90)" />
    <ellipse cx="48" cy="95" rx="10" ry="5" fill="#5A8A4A" transform="rotate(-15 48 95)" />
    <ellipse cx="112" cy="95" rx="10" ry="5" fill="#5A8A4A" transform="rotate(15 112 95)" />
  </svg>
);

const FlowerSpinner = ({ className = '' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
    {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
      <ellipse
        key={angle}
        cx="40"
        cy="40"
        rx="14"
        ry="7"
        fill={angle % 90 === 0 ? '#FFB7C5' : '#FF8FAB'}
        transform={`rotate(${angle} 40 40) translate(0 -14)`}
        opacity="0.85"
      />
    ))}
    <circle cx="40" cy="40" r="8" fill="#E8B96A" />
    <circle cx="40" cy="40" r="5" fill="#D4A853" />
  </svg>
);

const StarBurst = ({ className = '', style = {} }: { className?: string; style?: React.CSSProperties }) => (
  <svg className={className} style={style} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2L13.5 9L20 7L15 12L20 17L13.5 15L12 22L10.5 15L4 17L9 12L4 7L10.5 9Z" fill="#D4A853" />
  </svg>
);

const HeartIcon = ({ className = '' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
  </svg>
);

const MusicNoteIcon = ({ className = '' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55C7.79 13 6 14.79 6 17s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
  </svg>
);

/* ---------- Play/Pause Icons ---------- */
const PlayIcon = ({ className = '' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M8 5v14l11-7z" />
  </svg>
);

const PauseIcon = ({ className = '' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
  </svg>
);

const PrevIcon = ({ className = '' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
  </svg>
);

const NextIcon = ({ className = '' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
  </svg>
);

const DiscIcon = ({ className = '' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

/* ---------- Fade In On Scroll Component ---------- */
function FadeInOnScroll({
  children,
  className = '',
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const [isVisible, setIsVisible] = useState(false);
  const domRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -30px 0px' }
    );

    const current = domRef.current;
    if (current) observer.observe(current);

    return () => {
      if (current) observer.unobserve(current);
    };
  }, []);

  return (
    <div
      ref={domRef}
      className={`transition-all duration-1000 ease-out transform ${isVisible
          ? 'opacity-100 translate-y-0 filter-none scale-100'
          : 'opacity-0 translate-y-12 blur-[3px] scale-[0.97]'
        } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

/* ---------- Playlist Data ---------- */
interface PlaylistSong {
  id: number;
  title: string;
  artist: string;
  url: string;
  coverImage?: string;
}

const DEFAULT_PLAYLIST: PlaylistSong[] = [
  { id: 1, title: 'Shape of My Heart', artist: 'Backstreet Boys', url: 'https://www.youtube.com/watch?v=fMLDOTZ_rjE' },
  { id: 2, title: 'Pelangi', artist: 'Hivi', url: 'https://www.youtube.com/watch?v=bBjENsfyvFs' },
  { id: 3, title: 'Romansa ke Masa Depan', artist: 'Glenn Fredly', url: 'https://www.youtube.com/watch?v=1MWVotVdHGg' },
];

/* ---------- Main Component ---------- */
export default function MaroonBirthdaySurprise({
  recipientName = 'Sayang',
  greetingText = '',
  photos = [],
  musicUrl = '',
  showBackButton = true,
  customPin = '111111',
  customHint = 'Hint: 111111',
  customPlaylist,
}: TemplateProps) {
  const [phase, setPhase] = useState<'loading' | 'pin' | 'gift' | 'letter'>('loading');
  const [pinValue, setPinValue] = useState('');
  const [pinError, setPinError] = useState(false);
  const [giftOpened, setGiftOpened] = useState(false);
  const [showPhoto, setShowPhoto] = useState(false);
  const pinInputRef = useRef<HTMLInputElement>(null);

  // Dynamic Playlist Construction (1 to 3 songs)
  const activePlaylist: PlaylistSong[] = useMemo(() => {
    if (customPlaylist && customPlaylist.length > 0) {
      return customPlaylist.slice(0, 3).map((item, idx) => ({
        id: idx + 1,
        title: item.title?.trim() || `Song ${idx + 1}`,
        artist: item.artist?.trim() || 'Favorite Song',
        url: item.url.trim(),
      }));
    }
    if (musicUrl && musicUrl.trim() && !musicUrl.includes('can-i-call-u-rose.mp3')) {
      return [
        { id: 1, title: 'Shape of My Heart', artist: 'Custom Backsound', url: musicUrl.trim() },
        { id: 2, title: 'Pelangi', artist: 'Hivi', url: 'https://www.youtube.com/watch?v=bBjENsfyvFs' },
        { id: 3, title: 'Romansa ke Masa Depan', artist: 'Glenn Fredly', url: 'https://www.youtube.com/watch?v=1MWVotVdHGg' },
      ];
    }
    return DEFAULT_PLAYLIST;
  }, [customPlaylist, musicUrl]);

  // Playlist & Vinyl State
  const [activeSongIndex, setActiveSongIndex] = useState<number>(0);
  const [isPlayingMusic, setIsPlayingMusic] = useState<boolean>(false);
  const [hasStartedAnySong, setHasStartedAnySong] = useState<boolean>(false);

  // Interactive Bouquet Flower Burst State
  const [bouquetParticles, setBouquetParticles] = useState<
    Array<{ id: number; x: number; y: number; vx: number; vy: number; scale: number; rot: number; color: string }>
  >([]);
  const [bouquetBouncing, setBouquetBouncing] = useState(false);

  // Clean custom PIN (ensure 6 digits if available or fallback to 111111)
  const cleanPin = (customPin || '').replace(/\D/g, '').slice(0, 6);
  const SECRET_PIN = cleanPin.length === 6 ? cleanPin : '111111';
  const PIN_HINT = customHint?.trim() ? customHint.trim() : `Hint: ${SECRET_PIN}`;

  const defaultPhoto = 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=800&auto=format&fit=crop';
  const displayPhoto = photos.length > 0 ? photos[0] : defaultPhoto;

  const defaultGreeting = `Hey ${recipientName},\n\nI know words will never be enough, tapi aku tetap mau coba...\n\nTerima kasih sudah hadir di hidupku, jadi alasan aku tersenyum setiap hari, dan selalu bikin hari-hariku lebih berwarna. You make everything better just by being you.\n\nDi hari spesialmu ini, aku cuma mau bilang — you deserve all the happiness in the world. Semoga tahun ini bawa lebih banyak tawa, lebih banyak kebahagiaan, dan lebih banyak momen indah yang bisa kita ciptakan bersama.\n\nHappy Birthday, my favorite person. I love you more than you know.`;

  const letterText = greetingText || defaultGreeting;

  // Deterministic Sakura petals config (prevents SSR hydration mismatch)
  const petals = [
    { id: 0, left: 5, delay: 0.2, duration: 7.5, size: 18, rotation: 45, swayAmount: 25 },
    { id: 1, left: 12, delay: 2.8, duration: 9.2, size: 14, rotation: 120, swayAmount: 35 },
    { id: 2, left: 19, delay: 5.1, duration: 6.8, size: 22, rotation: 210, swayAmount: 40 },
    { id: 3, left: 26, delay: 1.4, duration: 8.4, size: 16, rotation: 85, swayAmount: 30 },
    { id: 4, left: 33, delay: 3.9, duration: 7.1, size: 20, rotation: 310, swayAmount: 45 },
    { id: 5, left: 40, delay: 0.8, duration: 9.8, size: 13, rotation: 15, swayAmount: 20 },
    { id: 6, left: 47, delay: 6.2, duration: 8.0, size: 24, rotation: 190, swayAmount: 38 },
    { id: 7, left: 54, delay: 2.1, duration: 6.5, size: 15, rotation: 275, swayAmount: 28 },
    { id: 8, left: 61, delay: 4.7, duration: 8.9, size: 21, rotation: 60, swayAmount: 42 },
    { id: 9, left: 68, delay: 1.9, duration: 7.7, size: 17, rotation: 140, swayAmount: 32 },
    { id: 10, left: 75, delay: 5.8, duration: 9.5, size: 19, rotation: 230, swayAmount: 48 },
    { id: 11, left: 82, delay: 0.5, duration: 6.9, size: 14, rotation: 335, swayAmount: 22 },
    { id: 12, left: 89, delay: 3.4, duration: 8.6, size: 23, rotation: 95, swayAmount: 36 },
    { id: 13, left: 95, delay: 6.9, duration: 7.3, size: 16, rotation: 175, swayAmount: 50 },
    { id: 14, left: 8, delay: 4.1, duration: 8.2, size: 25, rotation: 260, swayAmount: 34 },
    { id: 15, left: 22, delay: 7.3, duration: 9.0, size: 12, rotation: 40, swayAmount: 26 },
    { id: 16, left: 37, delay: 2.5, duration: 6.4, size: 18, rotation: 115, swayAmount: 44 },
    { id: 17, left: 58, delay: 5.5, duration: 8.7, size: 15, rotation: 290, swayAmount: 30 },
    { id: 18, left: 71, delay: 1.1, duration: 7.9, size: 20, rotation: 165, swayAmount: 46 },
    { id: 19, left: 86, delay: 3.7, duration: 9.3, size: 17, rotation: 70, swayAmount: 24 },
  ];

  // Auto-advance from loading to PIN after 3s with smooth fade
  useEffect(() => {
    if (phase === 'loading') {
      const timer = setTimeout(() => setPhase('pin'), 2800);
      return () => clearTimeout(timer);
    }
  }, [phase]);

  // Focus PIN input when entering pin phase
  useEffect(() => {
    if (phase === 'pin') {
      setTimeout(() => pinInputRef.current?.focus(), 400);
    }
  }, [phase]);

  function handlePinSubmit(valToTest?: string) {
    const testedVal = valToTest ?? pinValue;
    if (testedVal === SECRET_PIN) {
      setPinError(false);
      setTimeout(() => {
        setPhase('gift');
      }, 400);
    } else {
      setPinError(true);
      setPinValue('');
      setTimeout(() => setPinError(false), 800);
    }
  }

  function handlePinKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && pinValue.length === 6) {
      handlePinSubmit();
    }
  }

  function handleOpenGift() {
    if (giftOpened) return;
    setGiftOpened(true);

    // Auto-play the 1st song in playlist as soon as gift opens
    setActiveSongIndex(0);
    setIsPlayingMusic(true);
    setHasStartedAnySong(true);

    setTimeout(() => {
      setPhase('letter');
    }, 1600);
  }

  // Playlist Handler
  function handlePlaySong(index: number) {
    if (activeSongIndex === index && isPlayingMusic) {
      setIsPlayingMusic(false);
    } else {
      setActiveSongIndex(index);
      setIsPlayingMusic(true);
      setHasStartedAnySong(true);
    }
  }

  function handleTogglePlayCurrent() {
    if (!hasStartedAnySong) {
      setHasStartedAnySong(true);
    }
    setIsPlayingMusic((prev) => !prev);
  }

  function handlePrevSong() {
    setActiveSongIndex((prev) => (prev > 0 ? prev - 1 : activePlaylist.length - 1));
    setIsPlayingMusic(true);
    setHasStartedAnySong(true);
  }

  function handleNextSong() {
    setActiveSongIndex((prev) => (prev < activePlaylist.length - 1 ? prev + 1 : 0));
    setIsPlayingMusic(true);
    setHasStartedAnySong(true);
  }

  const safeIndex = activeSongIndex >= activePlaylist.length ? 0 : activeSongIndex;
  const currentActiveSong = activePlaylist[safeIndex] || activePlaylist[0] || DEFAULT_PLAYLIST[0];

  return (
    <div className="min-h-screen w-full relative overflow-x-hidden" style={{ background: 'linear-gradient(180deg, #380808 0%, #540D0D 25%, #6B1515 50%, #4A0E0E 75%, #2B0505 100%)', fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif" }}>
      <style>{`
        @keyframes sakuraFall {
          0% { transform: translateY(-10vh) translateX(0px) rotate(0deg); opacity: 0; }
          10% { opacity: 0.9; }
          90% { opacity: 0.7; }
          100% { transform: translateY(110vh) translateX(var(--sway, 30px)) rotate(720deg); opacity: 0; }
        }
        @keyframes spinFlower {
          0% { transform: rotate(0deg) scale(0.95); }
          50% { transform: rotate(180deg) scale(1.08); }
          100% { transform: rotate(360deg) scale(0.95); }
        }
        @keyframes spinVinyl {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes fadeInUpSmooth {
          0% { opacity: 0; transform: translateY(40px) scale(0.96); filter: blur(4px); }
          100% { opacity: 1; transform: translateY(0) scale(1); filter: blur(0px); }
        }
        @keyframes fadeInScale {
          0% { opacity: 0; transform: scale(0.9); }
          100% { opacity: 1; transform: scale(1); }
        }
        @keyframes giftHeartbeat {
          0%, 100% { transform: scale(1) rotate(0deg); }
          15% { transform: scale(1.08) rotate(-4deg); }
          30% { transform: scale(1.04) rotate(4deg); }
          45% { transform: scale(1.09) rotate(-3deg); }
          60% { transform: scale(1) rotate(0deg); }
        }
        @keyframes giftUnveil {
          0% { transform: scale(1) rotate(0deg); opacity: 1; filter: brightness(1); }
          30% { transform: scale(1.2) rotate(-8deg); opacity: 0.95; filter: brightness(1.3); }
          60% { transform: scale(1.4) rotate(8deg); opacity: 0.7; filter: brightness(1.8); }
          100% { transform: scale(2.2) rotate(0deg); opacity: 0; filter: brightness(2.5) blur(10px); }
        }
        @keyframes pinShake {
          0%, 100% { transform: translateX(0); }
          20%, 60% { transform: translateX(-8px); }
          40%, 80% { transform: translateX(8px); }
        }
        @keyframes sparkleTwinkle {
          0%, 100% { opacity: 0.2; transform: scale(0.6) rotate(0deg); }
          50% { opacity: 1; transform: scale(1.2) rotate(180deg); }
        }
        @keyframes gentleFloat {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes pulseGlow {
          0%, 100% { box-shadow: 0 0 20px rgba(255, 183, 197, 0.2); }
          50% { box-shadow: 0 0 45px rgba(255, 183, 197, 0.45); }
        }
        @keyframes eqBounce {
          0%, 100% { height: 6px; }
          50% { height: 20px; }
        }

        .sakura-petal {
          animation: sakuraFall linear infinite;
          position: fixed;
          z-index: 5;
          pointer-events: none;
        }
        .spin-flower {
          animation: spinFlower 3s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }
        .spin-vinyl-disc {
          animation: spinVinyl 4.5s linear infinite;
        }
        .spin-vinyl-disc.paused {
          animation-play-state: paused;
        }
        .fade-in-up-smooth {
          animation: fadeInUpSmooth 0.9s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .fade-in-scale {
          animation: fadeInScale 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .gift-heartbeat {
          animation: giftHeartbeat 2.2s ease-in-out infinite;
        }
        .gift-unveil {
          animation: giftUnveil 1.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
        .pin-shake {
          animation: pinShake 0.5s ease-in-out;
        }
        .gentle-float {
          animation: gentleFloat 3.5s ease-in-out infinite;
        }
        .pulse-glow {
          animation: pulseGlow 3s ease-in-out infinite;
        }
        .serif-font {
          font-family: 'Playfair Display', Georgia, serif;
        }
        .eq-bar-1 { animation: eqBounce 0.8s ease-in-out infinite 0.1s; }
        .eq-bar-2 { animation: eqBounce 0.8s ease-in-out infinite 0.3s; }
        .eq-bar-3 { animation: eqBounce 0.8s ease-in-out infinite 0.2s; }
        .eq-bar-4 { animation: eqBounce 0.8s ease-in-out infinite 0.4s; }
      `}</style>

      {/* eslint-disable-next-line @next/next/no-page-custom-font */}
      <link
        href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap"
        rel="stylesheet"
      />

      {/* Background Music Player: automatically plays first song when gift is opened and updates with playlist */}
      <UniversalMusicPlayer
        musicUrl={currentActiveSong?.url || ''}
        isPlaying={isPlayingMusic}
        showControls={false}
      />

      {/* ---- Falling Sakura Petals (always visible) ---- */}
      {petals.map((p) => (
        <div
          key={p.id}
          className="sakura-petal"
          style={{
            left: `${p.left}%`,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            '--sway': `${p.swayAmount}px`,
          } as React.CSSProperties}
        >
          <SakuraPetal style={{ width: `${p.size}px`, height: `${p.size}px`, transform: `rotate(${p.rotation}deg)` }} />
        </div>
      ))}

      {/* ---- Top Nav Buttons ---- */}
      {showBackButton !== false && phase === 'letter' && (
        <div className="fixed top-4 left-4 z-50 flex items-center gap-2 fade-in-scale">
          <Link
            href="/plivin/gift"
            title="Kembali ke Beranda"
            className="p-2.5 rounded-2xl text-white/90 border border-white/15 hover:border-white/40 hover:text-white transition-all shadow-xl backdrop-blur-md flex items-center justify-center cursor-pointer active:scale-95"
            style={{ background: 'rgba(56,8,8,0.75)' }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </Link>
          <button
            type="button"
            onClick={() => { if (typeof window !== 'undefined') window.location.reload(); }}
            title="Muat Ulang"
            className="p-2.5 rounded-2xl text-white/90 border border-white/15 hover:border-white/40 hover:text-white transition-all shadow-xl backdrop-blur-md flex items-center justify-center cursor-pointer active:scale-95"
            style={{ background: 'rgba(56,8,8,0.75)' }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.3" />
            </svg>
          </button>
        </div>
      )}

      {/* ================================================================ */}
      {/* PHASE 1: LOADING — Flower Spinner                               */}
      {/* ================================================================ */}
      {phase === 'loading' && (
        <div className="fixed inset-0 z-40 flex flex-col items-center justify-center px-6 transition-opacity duration-700" style={{ background: 'radial-gradient(circle at center, #540D0D 0%, #2B0505 100%)' }}>
          <div className="flex flex-col items-center gap-8 fade-in-up-smooth">
            <div className="relative spin-flower">
              <div className="absolute inset-0 rounded-full blur-2xl bg-pink-500/20 pointer-events-none" />
              <FlowerSpinner className="w-24 h-24 sm:w-28 sm:h-28 relative z-10" />
            </div>

            <div className="text-center space-y-3">
              <p className="text-white/90 text-sm sm:text-base font-medium tracking-widest uppercase">
                Loading your surprise...
              </p>
              <div className="w-52 h-1.5 rounded-full overflow-hidden mx-auto" style={{ background: 'rgba(255,255,255,0.12)' }}>
                <div className="h-full rounded-full transition-all" style={{ background: 'linear-gradient(90deg, #FFB7C5, #E8B96A)', width: '100%', animation: 'progressBar 2.5s ease-in-out forwards' }} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================================================================ */}
      {/* PHASE 2: PIN ENTRY                                              */}
      {/* ================================================================ */}
      {phase === 'pin' && (
        <div className="fixed inset-0 z-40 flex flex-col items-center justify-center px-6 transition-all duration-700" style={{ background: 'radial-gradient(circle at center, #540D0D 0%, #250404 100%)' }}>
          <div className={`max-w-sm w-full flex flex-col items-center gap-5 fade-in-up-smooth ${pinError ? 'pin-shake' : ''}`}>
            {/* Lock icon with soft aura */}
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-pink-500/20 blur-xl pointer-events-none" />
              <div className="w-18 h-18 rounded-3xl flex items-center justify-center border border-white/20 backdrop-blur-xl shadow-2xl relative z-10" style={{ background: 'rgba(107,21,21,0.6)' }}>
                <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#FFB7C5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </div>
            </div>

            <div className="text-center space-y-1">
              <h2 className="serif-font text-2xl sm:text-3xl font-bold text-white tracking-wide">
                A Secret Awaits
              </h2>
              <p className="text-white/65 text-xs sm:text-sm font-light">
                Masukkan 6-digit PIN untuk membuka kado
              </p>
            </div>

            {/* PIN Dots Display */}
            <div className="flex items-center gap-3 my-1">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="w-3.5 h-3.5 rounded-full border-2 transition-all duration-300"
                  style={{
                    borderColor: pinError ? '#EF4444' : (i < pinValue.length ? '#FFB7C5' : 'rgba(255,255,255,0.25)'),
                    background: i < pinValue.length ? '#FFB7C5' : 'transparent',
                    transform: i < pinValue.length ? 'scale(1.2)' : 'scale(1)',
                    boxShadow: i < pinValue.length ? '0 0 10px rgba(255, 183, 197, 0.6)' : 'none',
                  }}
                />
              ))}
            </div>

            {/* Hidden actual input for keyboard desktop support */}
            <input
              ref={pinInputRef}
              type="tel"
              maxLength={6}
              value={pinValue}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, '').slice(0, 6);
                setPinValue(val);
                if (val.length === 6) {
                  handlePinSubmit(val);
                }
              }}
              onKeyDown={handlePinKeyDown}
              className="absolute opacity-0 w-0 h-0"
              inputMode="numeric"
              autoComplete="off"
            />

            {/* Interactive Touch Keypad for Mobile & Desktop */}
            <div className="grid grid-cols-3 gap-2.5 w-full max-w-[250px] my-1">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => {
                    if (pinValue.length < 6) {
                      const next = pinValue + num;
                      setPinValue(next);
                      if (next.length === 6) {
                        handlePinSubmit(next);
                      }
                    }
                  }}
                  className="h-12 rounded-2xl bg-white/[0.08] hover:bg-white/[0.18] active:scale-90 border border-white/10 text-white font-semibold text-base flex items-center justify-center transition-all cursor-pointer backdrop-blur-md shadow-md"
                >
                  {num}
                </button>
              ))}
              <div />
              <button
                type="button"
                onClick={() => {
                  if (pinValue.length < 6) {
                    const next = pinValue + '0';
                    setPinValue(next);
                    if (next.length === 6) {
                      handlePinSubmit(next);
                    }
                  }
                }}
                className="h-12 rounded-2xl bg-white/[0.08] hover:bg-white/[0.18] active:scale-90 border border-white/10 text-white font-semibold text-base flex items-center justify-center transition-all cursor-pointer backdrop-blur-md shadow-md"
              >
                0
              </button>
              <button
                type="button"
                onClick={() => setPinValue((prev) => prev.slice(0, -1))}
                className="h-12 rounded-2xl bg-white/[0.08] hover:bg-white/[0.18] active:scale-90 border border-white/10 text-white/75 text-sm flex items-center justify-center transition-all cursor-pointer backdrop-blur-md shadow-md"
                title="Hapus"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 4H8l-7 8 7 8h13a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z" />
                  <line x1="18" y1="9" x2="12" y2="15" />
                  <line x1="12" y1="9" x2="18" y2="15" />
                </svg>
              </button>
            </div>

            {/* Error message */}
            {pinError && (
              <p className="text-red-300 text-xs font-medium fade-in-scale">
                PIN salah, coba lagi ya...
              </p>
            )}

            {/* Hint */}
            <div className="flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10" style={{ background: 'rgba(255,183,197,0.08)' }}>
              <StarBurst className="w-3.5 h-3.5 flex-shrink-0" />
              <p className="text-white/60 text-xs font-light italic">
                {PIN_HINT}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ================================================================ */}
      {/* PHASE 3: GIFT BOX                                               */}
      {/* ================================================================ */}
      {phase === 'gift' && (
        <div className="fixed inset-0 z-40 flex flex-col items-center justify-center px-6 transition-all duration-700" style={{ background: 'radial-gradient(circle at center, #5A1212 0%, #2B0505 100%)' }}>
          <div className="flex flex-col items-center gap-6 fade-in-up-smooth relative">
            {/* Sparkle particles around gift */}
            {!giftOpened && (
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                <div className="w-72 h-72 rounded-full bg-amber-500/10 blur-3xl" />
                {[0, 1, 2, 3, 4, 5].map((i) => (
                  <StarBurst
                    key={i}
                    className="absolute w-4 h-4"
                    style={{
                      left: `${20 + Math.cos((i / 6) * Math.PI * 2) * 45}%`,
                      top: `${20 + Math.sin((i / 6) * Math.PI * 2) * 45}%`,
                      animation: `sparkleTwinkle 2s ease-in-out infinite`,
                      animationDelay: `${i * 0.3}s`,
                    } as React.CSSProperties}
                  />
                ))}
              </div>
            )}

            {/* Gift Box */}
            <button
              type="button"
              onClick={handleOpenGift}
              disabled={giftOpened}
              className={`cursor-pointer transition-all focus:outline-none ${giftOpened ? 'gift-unveil' : 'gift-heartbeat hover:scale-110 active:scale-95'}`}
              style={{ background: 'none', border: 'none', padding: 0 }}
            >
              <GiftBoxIcon className="w-44 h-44 sm:w-52 sm:h-52 drop-shadow-2xl" />
            </button>

            {!giftOpened && (
              <div className="text-center space-y-1.5 gentle-float">
                <p className="text-white/95 text-lg sm:text-xl font-bold tracking-wide">
                  Ada Kado Spesial Buat Kamu!
                </p>
                <div className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full bg-white/[0.08] border border-white/15 text-xs text-amber-200">
                  <span>Sentuh kado untuk membuka</span>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            )}

            {giftOpened && (
              <div className="text-center fade-in-scale">
                <p className="serif-font text-3xl sm:text-4xl font-bold text-white drop-shadow-lg">
                  Happy Birthday!
                </p>
                <p className="text-amber-200 text-xs sm:text-sm mt-2 font-light tracking-widest uppercase">
                  Unveiling your surprise...
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ================================================================ */}
      {/* PHASE 4: LETTER — Scrollable Content                            */}
      {/* ================================================================ */}
      {phase === 'letter' && (
        <main className="relative z-10 max-w-lg mx-auto px-4 sm:px-6 pt-20 pb-32 flex flex-col items-center">

          {/* ---------- SECTION A: HAPPY BIRTHDAY HEADER ---------- */}
          <FadeInOnScroll className="w-full text-center mb-10" delay={100}>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/15 text-xs font-light text-white/80 mb-6 backdrop-blur-md shadow-lg" style={{ background: 'rgba(255,183,197,0.1)' }}>
              <SakuraPetal style={{ width: 14, height: 14 }} />
              <span>A birthday message just for you</span>
            </div>

            <div className="space-y-3">
              <p className="text-amber-200/80 text-xs sm:text-sm tracking-[0.25em] uppercase font-semibold">
                Happy Birthday
              </p>
              <h1 className="serif-font text-4xl sm:text-5xl font-bold bg-gradient-to-r from-white via-pink-100 to-amber-200 bg-clip-text text-transparent leading-tight drop-shadow-md">
                {recipientName}
              </h1>
              <div className="flex items-center justify-center gap-3 pt-2">
                <div className="w-12 h-px bg-gradient-to-r from-transparent to-white/30" />
                <HeartIcon className="w-5 h-5 text-pink-400/90" />
                <div className="w-12 h-px bg-gradient-to-l from-transparent to-white/30" />
              </div>
            </div>
          </FadeInOnScroll>

          {/* ---------- SECTION B: BOUQUET WITH INTERACTIVE BURST ---------- */}
          <FadeInOnScroll className="w-full flex flex-col items-center mb-12 relative" delay={150}>
            {/* Floating Flower / Sakura Burst Particles */}
            {bouquetParticles.map((p) => (
              <div
                key={p.id}
                className="absolute pointer-events-none z-30 transition-all duration-1000 ease-out"
                style={{
                  left: `calc(50% + ${p.x}px)`,
                  top: `calc(40% + ${p.y}px)`,
                  transform: `scale(${p.scale}) rotate(${p.rot}deg)`,
                  opacity: Math.max(0, 1 - (Math.abs(p.y) + Math.abs(p.x)) / 220),
                }}
              >
                <SakuraPetal style={{ width: 26, height: 26 }} />
              </div>
            ))}

            {/* Clickable Bouquet with pop/bounce animation */}
            <div
              onClick={() => {
                setBouquetBouncing(true);
                setTimeout(() => setBouquetBouncing(false), 600);

                // Spawn 10 bursting flower petals in all directions
                const newParticles = Array.from({ length: 10 }, (_, i) => {
                  const angle = (i / 10) * Math.PI * 2 + (Math.random() * 0.4 - 0.2);
                  const distance = 70 + Math.random() * 70;
                  return {
                    id: Date.now() + i,
                    x: Math.cos(angle) * distance,
                    y: Math.sin(angle) * distance - 20,
                    vx: Math.cos(angle) * 3,
                    vy: Math.sin(angle) * 3 - 2,
                    scale: 0.8 + Math.random() * 0.7,
                    rot: Math.random() * 360,
                    color: i % 2 === 0 ? '#FFB7C5' : '#E8637A',
                  };
                });

                setBouquetParticles((prev) => [...prev.slice(-15), ...newParticles]);

                // Cleanup after 1.2s
                setTimeout(() => {
                  setBouquetParticles((prev) => prev.filter((p) => !newParticles.some((np) => np.id === p.id)));
                }, 1200);
              }}
              className={`cursor-pointer select-none transition-transform duration-300 active:scale-90 ${bouquetBouncing ? 'scale-110 -rotate-3' : 'gentle-float hover:scale-105'
                } relative w-56 h-72 sm:w-64 sm:h-80 drop-shadow-2xl group`}
            >
              <Image
                src="https://pngmagic.com/webp_images/pink-rose-bouquet-png-transparent_9KL.webp"
                alt="Flower Bouquet"
                fill
                unoptimized
                sizes="(max-width: 640px) 250px, 300px"
                className="object-contain drop-shadow-[0_20px_35px_rgba(0,0,0,0.5)] group-hover:brightness-110 transition-all"
              />

              {/* Click Hint Tooltip / Badge */}
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-black/60 hover:bg-black/80 backdrop-blur-md border border-white/20 px-3.5 py-1 rounded-full text-[11px] text-amber-200 shadow-lg flex items-center gap-1.5 whitespace-nowrap pointer-events-none group-hover:scale-105 transition-all">
                <SakuraPetal style={{ width: 12, height: 12 }} />
                <span>Sentuh buket untuk mekar ✨</span>
              </div>
            </div>

            <p className="text-white/60 text-xs font-light mt-6 italic tracking-wide">
              A bouquet of love, specially picked for you
            </p>
          </FadeInOnScroll>

          {/* ---------- SECTION C: LETTER ---------- */}
          <FadeInOnScroll className="w-full mb-12" delay={150}>
            <div
              className="w-full rounded-3xl p-6 sm:p-8 border border-white/15 backdrop-blur-xl shadow-2xl pulse-glow"
              style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.08), rgba(255,255,255,0.03))' }}
            >
              {/* Letter Header */}
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/10">
                <div className="w-10 h-10 rounded-2xl flex items-center justify-center border border-white/10" style={{ background: 'rgba(255,183,197,0.15)' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FFB7C5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">My Letter to You</p>
                  <p className="text-white/50 text-xs font-light">with all my heart</p>
                </div>
              </div>

              {/* Letter Content */}
              <div className="text-white/85 text-sm sm:text-base font-light leading-relaxed whitespace-pre-line space-y-4">
                {letterText}
              </div>

              {/* Letter Footer */}
              <div className="mt-8 pt-4 border-t border-white/10 flex items-center justify-between">
                <p className="text-white/50 text-xs font-light italic">
                  Forever yours
                </p>
                <HeartIcon className="w-4 h-4 text-pink-400/80" />
              </div>
            </div>
          </FadeInOnScroll>

          {/* ---------- SECTION D: PHOTO ---------- */}
          <FadeInOnScroll className="w-full mb-12" delay={150}>
            <div className="text-center mb-4">
              <p className="text-white/80 text-sm font-medium tracking-wide">Our Favorite Moment</p>
            </div>

            <div
              className="w-full rounded-3xl overflow-hidden border border-white/15 shadow-2xl cursor-pointer group transition-all hover:border-white/30"
              onClick={() => setShowPhoto(true)}
            >
              <div className="relative w-full aspect-[4/5]">
                <Image
                  src={displayPhoto}
                  alt={`Photo for ${recipientName}`}
                  fill
                  unoptimized
                  sizes="(max-width: 640px) 100vw, 500px"
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                  <p className="text-white/90 text-xs font-medium drop-shadow-lg">
                    Tap to view fullscreen
                  </p>
                  <div className="p-2 rounded-xl backdrop-blur-md border border-white/20" style={{ background: 'rgba(0,0,0,0.4)' }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </FadeInOnScroll>

          {/* ---------- SECTION E: BIRTHDAY PLAYLIST & VINYL PLAYER ---------- */}
          <FadeInOnScroll className="w-full mb-12" delay={150}>
            <div className="w-full rounded-3xl p-6 sm:p-7 border border-white/15 backdrop-blur-xl shadow-2xl space-y-6" style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.07), rgba(255,255,255,0.03))' }}>

              {/* Header Playlist */}
              <div className="text-center space-y-1">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.06] border border-white/10 text-xs text-amber-200">
                  <DiscIcon className="w-3.5 h-3.5" />
                  <span>Interactive Vinyl Record Player</span>
                </div>
                <h3 className="serif-font text-2xl font-bold text-white pt-1">
                  Playlist
                </h3>
              </div>

              {/* Turntable / Vinyl Player Visualization */}
              <div className="relative w-full py-4 flex flex-col items-center justify-center">
                {/* Turntable Deck */}
                <div className="relative w-56 h-56 sm:w-64 sm:h-64 rounded-full flex items-center justify-center shadow-[0_20px_50px_rgba(0,0,0,0.8)] border border-white/10" style={{ background: 'radial-gradient(circle, #250505 0%, #150202 100%)' }}>

                  {/* Outer Vinyl Rim with Grooves */}
                  <div className={`w-52 h-52 sm:w-60 sm:h-60 rounded-full flex items-center justify-center border-4 border-stone-900 bg-stone-950 relative shadow-2xl spin-vinyl-disc ${!isPlayingMusic ? 'paused' : ''}`}>
                    {/* Concentric Vinyl Grooves */}
                    <div className="absolute inset-2 rounded-full border border-white/[0.04]" />
                    <div className="absolute inset-5 rounded-full border border-white/[0.04]" />
                    <div className="absolute inset-8 rounded-full border border-white/[0.05]" />
                    <div className="absolute inset-12 rounded-full border border-white/[0.04]" />
                    <div className="absolute inset-16 rounded-full border border-white/[0.04]" />

                    {/* Vinyl Center Label */}
                    <div className="w-20 h-20 sm:w-22 sm:h-22 rounded-full flex flex-col items-center justify-center p-2 text-center border-2 border-amber-400/40 shadow-inner" style={{ background: 'linear-gradient(135deg, #7B1A2C, #D4A853)' }}>
                      <div className="w-4 h-4 rounded-full bg-stone-950 border border-stone-800 shadow-inner mb-1" />
                      <p className="text-[9px] font-bold text-stone-950 truncate max-w-[65px] leading-tight">
                        {currentActiveSong.title}
                      </p>
                    </div>
                  </div>

                  {/* Tonearm (Vinyl Needle) */}
                  <div
                    className="absolute -top-3 right-6 sm:right-8 w-12 h-28 origin-top-right transition-transform duration-700 pointer-events-none z-20"
                    style={{
                      transform: isPlayingMusic ? 'rotate(24deg)' : 'rotate(0deg)',
                    }}
                  >
                    {/* Arm base */}
                    <div className="w-6 h-6 rounded-full bg-stone-700 border-2 border-amber-300 shadow-md ml-auto" />
                    {/* Metal arm rod */}
                    <div className="w-1.5 h-20 bg-gradient-to-b from-stone-400 to-amber-200 ml-auto mr-2.5 shadow" />
                    {/* Stylus head */}
                    <div className="w-3.5 h-5 bg-amber-400 rounded-sm ml-auto mr-1.5 shadow-md" />
                  </div>
                </div>

                {/* Now Playing Title & Animated Equalizer */}
                <div className="text-center mt-4 space-y-2">
                  <div className="flex items-center justify-center gap-2">
                    {isPlayingMusic && (
                      <div className="flex items-end gap-1 h-5">
                        <span className="w-1 bg-amber-300 rounded-full eq-bar-1" />
                        <span className="w-1 bg-amber-300 rounded-full eq-bar-2" />
                        <span className="w-1 bg-amber-300 rounded-full eq-bar-3" />
                        <span className="w-1 bg-amber-300 rounded-full eq-bar-4" />
                      </div>
                    )}
                    <p className="text-white font-semibold text-sm sm:text-base">
                      {currentActiveSong.title}
                    </p>
                  </div>
                  <p className="text-white/50 text-xs">
                    {currentActiveSong.artist} • {isPlayingMusic ? 'Sedang Diputar 🎵' : 'Jeda / Siap Diputar'}
                  </p>
                </div>

                {/* Player Controls */}
                <div className="flex items-center justify-center gap-4 mt-3">
                  <button
                    type="button"
                    onClick={handlePrevSong}
                    className="p-2.5 rounded-full bg-white/[0.08] hover:bg-white/[0.18] text-white transition-all active:scale-90 border border-white/10"
                    title="Lagu Sebelumnya"
                  >
                    <PrevIcon className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={handleTogglePlayCurrent}
                    className="p-4 rounded-full bg-gradient-to-r from-amber-400 to-pink-400 text-stone-950 font-bold shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center justify-center"
                    title={isPlayingMusic ? 'Jeda' : 'Putar'}
                  >
                    {isPlayingMusic ? <PauseIcon className="w-5 h-5" /> : <PlayIcon className="w-5 h-5 ml-0.5" />}
                  </button>

                  <button
                    type="button"
                    onClick={handleNextSong}
                    className="p-2.5 rounded-full bg-white/[0.08] hover:bg-white/[0.18] text-white transition-all active:scale-90 border border-white/10"
                    title="Lagu Berikutnya"
                  >
                    <NextIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Dynamic Song Tracklist (1 to 3 songs) */}
              <div className="space-y-2.5 pt-2">
                {activePlaylist.map((song, idx) => {
                  const isCurrent = activeSongIndex === idx;
                  const isCurrentPlaying = isCurrent && isPlayingMusic;

                  return (
                    <div
                      key={song.id}
                      onClick={() => handlePlaySong(idx)}
                      className={`w-full flex items-center gap-3.5 p-3.5 rounded-2xl border transition-all cursor-pointer select-none active:scale-[0.98] ${isCurrent
                          ? 'bg-white/[0.12] border-amber-300/40 shadow-lg'
                          : 'bg-white/[0.04] border-white/10 hover:bg-white/[0.08]'
                        }`}
                    >
                      {/* Play / Pause indicator button */}
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform ${isCurrent
                            ? 'bg-gradient-to-br from-amber-400 to-pink-400 text-stone-950'
                            : 'bg-white/[0.08] text-white'
                          }`}
                      >
                        {isCurrentPlaying ? (
                          <PauseIcon className="w-4 h-4" />
                        ) : (
                          <PlayIcon className="w-4 h-4 ml-0.5" />
                        )}
                      </div>

                      {/* Song Title & Artist */}
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-semibold truncate ${isCurrent ? 'text-amber-200' : 'text-white/90'}`}>
                          {song.title}
                        </p>
                        <p className="text-white/50 text-xs font-light truncate">
                          {song.artist}
                        </p>
                      </div>

                      {/* Animated Bars or Track Number */}
                      <div className="flex items-center gap-1 flex-shrink-0">
                        {isCurrentPlaying ? (
                          <div className="flex items-end gap-0.5 h-4">
                            <span className="w-0.5 bg-amber-300 rounded-full eq-bar-1" />
                            <span className="w-0.5 bg-amber-300 rounded-full eq-bar-2" />
                            <span className="w-0.5 bg-amber-300 rounded-full eq-bar-3" />
                          </div>
                        ) : (
                          <span className="text-xs font-mono text-white/40">0{idx + 1}</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </FadeInOnScroll>

          {/* ---------- FOOTER ---------- */}
          <FadeInOnScroll className="w-full text-center space-y-4 pt-4" delay={150}>
            <div className="flex items-center justify-center gap-3">
              <div className="w-16 h-px bg-gradient-to-r from-transparent to-white/20" />
              <SakuraPetal style={{ width: 16, height: 16 }} />
              <div className="w-16 h-px bg-gradient-to-l from-transparent to-white/20" />
            </div>
            <p className="text-white/40 text-xs font-light tracking-wider">
              Made with love, just for {recipientName}
            </p>
            <button
              type="button"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="text-xs text-amber-200/80 hover:text-amber-200 transition-colors flex items-center gap-1.5 mx-auto cursor-pointer"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 19V5M5 12l7-7 7 7" />
              </svg>
              <span>Back to top</span>
            </button>
          </FadeInOnScroll>
        </main>
      )}

      {/* ---- Photo Lightbox Modal ---- */}
      {showPhoto && (
        <div
          onClick={() => setShowPhoto(false)}
          className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-lg flex items-center justify-center p-4 cursor-pointer fade-in-scale"
        >
          <div className="relative max-w-2xl max-h-[85vh] w-full h-full flex items-center justify-center">
            <Image
              src={displayPhoto}
              alt="Photo"
              fill
              unoptimized
              className="object-contain rounded-xl shadow-2xl"
            />
            <button
              onClick={() => setShowPhoto(false)}
              className="absolute top-4 right-4 p-2.5 rounded-full bg-black/70 text-white border border-white/20 hover:bg-black transition-all"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

