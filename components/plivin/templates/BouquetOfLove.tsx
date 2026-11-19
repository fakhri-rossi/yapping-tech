'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { TemplateProps } from '@type/gift';
import UniversalMusicPlayer from '@components/plivin/common/UniversalMusicPlayer';
import Link from 'next/link';
import Image from 'next/image';
import { fadeInAudio } from '@lib/audio-utils';

/* ============================================================
   Bouquet of Love — Multi-page romantic story template
   Migrated from template-bouquet.html
   ============================================================ */

interface Petal {
  id: number;
  emoji: string;
  left: number;
  dur: number;
  delay: number;
  rot: number;
  size: number;
}

interface BgPetal {
  id: number;
  emoji: string;
  left: number;
  dur: number;
  delay: number;
}

export default function BouquetOfLove({
  recipientName = 'Sayangku',
  greetingText = '',
  photos = [],
  musicUrl = '/music/can-i-call-u-rose.mp3',
  showBackButton = true,
}: TemplateProps) {
  const [phase, setPhase] = useState<'splash' | 'pages'>('splash');
  const [currentPage, setCurrentPage] = useState(-1);
  const [splashPetals, setSplashPetals] = useState<Petal[]>([]);
  const [bgPetals, setBgPetals] = useState<BgPetal[]>([]);
  const [finalText, setFinalText] = useState('');
  const [isTypingDone, setIsTypingDone] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const typingRef = useRef<boolean>(false);

  const TOTAL_PAGES = 8;
  const photoUrl = photos.length > 0 ? photos[0] : 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=800&auto=format&fit=crop';

  const finalMessage = greetingText ||
    `Bunga ini mungkin bakal layu, tapi rasa sayangku ke kamu gak akan pernah berkurang. Makasih ya udah selalu sabar, nemenin dari hal-hal kecil, dan selalu jadi alasan aku tersenyum. You really mean the world to me, ${recipientName}... I love you! 🌸🤍`;

  // Generate petals on mount
  useEffect(() => {
    const petalEmojis = ['🌸', '🌷', '💮', '🌺', '🪷'];
    const sPlts: Petal[] = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      emoji: petalEmojis[Math.floor(Math.random() * petalEmojis.length)],
      left: Math.random() * 100,
      dur: 4 + Math.random() * 4,
      delay: Math.random() * 3,
      rot: Math.random() * 360,
      size: 1 + Math.random() * 1.5,
    }));
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSplashPetals(sPlts);

    const bgPetalEmojis = ['🌸', '🌷', '💮', '🪷', '✿'];
    const bPlts: BgPetal[] = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      emoji: bgPetalEmojis[Math.floor(Math.random() * bgPetalEmojis.length)],
      left: Math.random() * 100,
      dur: 12 + Math.random() * 10,
      delay: Math.random() * 8,
    }));
    setBgPetals(bPlts);
  }, []);

  // Typewriter effect for final page
  const typeText = useCallback((text: string) => {
    typingRef.current = true;
    setFinalText('');
    setIsTypingDone(false);
    let i = 0;
    function write() {
      if (i < text.length && typingRef.current) {
        setFinalText((prev) => prev + text.charAt(i));
        i++;
        setTimeout(write, 50);
      } else {
        setIsTypingDone(true);
      }
    }
    setTimeout(write, 1200);
  }, []);

  function startMusic() {
    fadeInAudio(audioRef.current, 0.8, 2500);
  }

  function openEnvelope() {
    setPhase('pages');
    startMusic();
    setTimeout(() => setCurrentPage(0), 800);
  }

  const goToPage = useCallback((idx: number) => {
    setCurrentPage(idx);
    if (idx === TOTAL_PAGES - 1) {
      typeText(finalMessage);
    }
  }, [finalMessage, typeText]);

  // Keyboard & Swipe support
  useEffect(() => {
    let touchStartX = 0;
    let touchStartY = 0;

    function handleTouchStart(e: TouchEvent) {
      touchStartX = e.changedTouches[0].screenX;
      touchStartY = e.changedTouches[0].screenY;
    }

    function handleTouchEnd(e: TouchEvent) {
      const diffX = touchStartX - e.changedTouches[0].screenX;
      const diffY = touchStartY - e.changedTouches[0].screenY;
      if (Math.abs(diffX) < 50 || Math.abs(diffX) < Math.abs(diffY)) return;
      if (currentPage < 0) return;
      if (diffX > 0 && currentPage < TOTAL_PAGES - 1) goToPage(currentPage + 1);
      else if (diffX < 0 && currentPage > 0) goToPage(currentPage - 1);
    }

    function handleKeyDown(e: KeyboardEvent) {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)) return;
      if (phase !== 'pages' || currentPage < 0) return;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        goToPage(Math.min(currentPage + 1, TOTAL_PAGES - 1));
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        goToPage(Math.max(currentPage - 1, 0));
      }
    }

    document.addEventListener('touchstart', handleTouchStart, { passive: true });
    document.addEventListener('touchend', handleTouchEnd, { passive: true });
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [phase, currentPage, goToPage]);

  const pageClass = (idx: number) => {
    if (currentPage === idx) return 'bouquet-page active';
    return 'bouquet-page';
  };

  return (
    <div className="bouquet-root">
      <style>{`
        .bouquet-root {
          font-family: 'Inter', sans-serif;
          min-height: 100vh; min-height: 100dvh;
          width: 100%; height: 100%; flex: 1;
          overflow: hidden; position: relative;
          background: linear-gradient(135deg, #fce7f3, #fdf2f8, #ffe4e6);
          display: flex; flex-direction: column;
        }

        /* Video BG */
        .bouquet-video-bg {
          position: absolute; top: 0; left: 0;
          width: 100%; height: 100%;
          z-index: 0; object-fit: cover; opacity: 0.6;
        }

        /* Splash Screen */
        .bouquet-splash {
          position: absolute; inset: 0; width: 100%; height: 100%; z-index: 1000;
          background: linear-gradient(135deg, #fce7f3, #fdf2f8, #ffe4e6);
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          transition: opacity 1s cubic-bezier(0.4,0,0.2,1), transform 1s cubic-bezier(0.4,0,0.2,1), filter 1s ease-in-out;
        }
        .bouquet-splash.zoomed {
          transform: scale(2.5); filter: brightness(2.5) blur(10px); opacity: 0;
          pointer-events: none;
        }

        .envelope-card {
          background: rgba(255,255,255,0.25);
          backdrop-filter: blur(15px); -webkit-backdrop-filter: blur(15px);
          border: 1px solid rgba(255,255,255,0.35);
          border-radius: 28px; padding: 40px 30px;
          max-width: 400px; width: 90%;
          box-shadow: 0 20px 50px rgba(220,39,119,0.15);
          display: flex; flex-direction: column;
          align-items: center; text-align: center;
          z-index: 10;
          animation: bouquetFadeUp 1s 0.3s forwards;
          opacity: 0;
        }
        .envelope-img-wrap {
          width: 220px; height: 160px; margin-bottom: 24px;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer;
        }
        .envelope-img-wrap img {
          width: 100%; height: 100%; object-fit: contain;
          transition: transform 0.5s ease;
          filter: drop-shadow(0 8px 16px rgba(220,39,119,0.1));
        }
        .envelope-img-wrap:hover img { transform: scale(1.06) rotate(1.5deg); }
        .envelope-tap {
          font-size: 1.2rem; font-family: 'Playfair Display', serif;
          color: #be185d; margin-bottom: 24px; font-weight: 600;
        }

        /* Petal */
        .splash-petal {
          position: absolute; pointer-events: none;
          opacity: 0;
          animation: bouquetPetalFall var(--dur) var(--delay) ease-in forwards;
        }
        @keyframes bouquetPetalFall {
          0% { opacity: 0; transform: translateY(-30px) rotate(0deg) scale(0.8); }
          10% { opacity: 1; }
          100% { opacity: 0; transform: translateY(110vh) rotate(var(--rot)) scale(1); }
        }

        /* Background floating petals */
        .bouquet-bg-petals {
          position: absolute; inset: 0; z-index: 0;
          pointer-events: none; overflow: hidden;
        }
        .bouquet-bg-petal {
          position: absolute; font-size: 1.2rem; opacity: 0.15;
          animation: bouquetBgFloat var(--dur) var(--delay) linear infinite;
        }
        @keyframes bouquetBgFloat {
          0% { transform: translateY(110vh) rotate(0deg); opacity: 0; }
          10% { opacity: 0.15; }
          90% { opacity: 0.15; }
          100% { transform: translateY(-10vh) rotate(360deg); opacity: 0; }
        }

        /* Page system */
        .bouquet-page {
          position: absolute; inset: 0; width: 100%; height: 100%;
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          padding: 2rem; opacity: 0; visibility: hidden;
          transition: opacity 0.9s cubic-bezier(0.34,1.56,0.64,1),
                      visibility 0.9s,
                      transform 0.9s cubic-bezier(0.34,1.56,0.64,1),
                      filter 0.9s ease;
          transform: scale(0.3) rotateY(25deg) rotateX(12deg) translateZ(-600px);
          overflow-y: auto; perspective: 1800px; filter: blur(8px);
        }
        .bouquet-page.active {
          opacity: 1; visibility: visible;
          transform: scale(1) rotateY(0deg) rotateX(0deg) translateZ(0);
          filter: blur(0px);
        }

        .page-inner { max-width: 500px; width: 100%; text-align: center; }

        /* Theme pages */
        .page-intro, .page-question, .page-message, .page-photo, .page-final {
          backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px);
        }
        .page-intro { background: linear-gradient(180deg, rgba(253,242,248,0.45), rgba(255,250,245,0.45)); }
        .page-question { background: linear-gradient(180deg, rgba(255,250,245,0.45), rgba(253,242,248,0.45)); }
        .page-message { background: linear-gradient(180deg, rgba(253,242,248,0.45), rgba(255,241,242,0.45)); }
        .page-photo { background: linear-gradient(180deg, rgba(255,250,245,0.45), rgba(253,242,248,0.45)); }
        .page-final { background: linear-gradient(180deg, rgba(252,231,243,0.45), rgba(255,228,230,0.45), rgba(253,242,248,0.45)); }

        .intro-emoji { font-size: 4rem; margin-bottom: 1.5rem; animation: bouquetFloat 3s ease-in-out infinite; }
        @keyframes bouquetFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-12px); }
        }
        .intro-heading {
          font-family: 'Playfair Display', serif;
          font-size: 2rem; color: #be185d;
          margin-bottom: 1rem; line-height: 1.3;
          font-style: italic; font-weight: 700;
        }
        .intro-sub {
          color: #be185d; font-size: 1rem;
          line-height: 1.7; margin-bottom: 2.5rem;
        }

        /* Question tag */
        .question-tag {
          display: inline-block;
          font-size: 0.7rem; font-weight: 700;
          text-transform: uppercase; letter-spacing: 0.15em;
          color: #ec4899; background: #fce7f3;
          padding: 0.4rem 1rem; border-radius: 999px;
          margin-bottom: 1.5rem;
        }
        .question-text {
          font-family: 'Playfair Display', serif;
          font-size: 1.6rem; color: #be185d;
          margin-bottom: 2rem; line-height: 1.4;
          font-style: italic;
        }

        /* Choice cards */
        .choice-card {
          display: flex; align-items: center;
          width: 100%; padding: 1rem 0;
          background: transparent; border: none;
          border-bottom: 1px dashed #fbcfe8;
          font-size: 1.15rem; font-weight: 500; font-style: italic;
          color: #be185d; cursor: pointer;
          transition: all 0.4s ease;
          margin-bottom: 0.5rem; text-align: left;
          font-family: 'Playfair Display', serif;
        }
        .choice-card:last-child { border-bottom: none; }
        .choice-card:hover { transform: translateX(10px); color: #ec4899; }
        .choice-card:active { transform: scale(0.98) translateX(5px); opacity: 0.7; }
        .choice-emoji { font-size: 1.5rem; margin-right: 1rem; }

        /* Message */
        .msg-icon { font-size: 3rem; margin-bottom: 1.5rem; }
        .msg-text {
          font-family: 'Playfair Display', serif;
          font-size: 1.3rem; color: #be185d;
          line-height: 1.8; margin-bottom: 2.5rem;
          font-style: italic;
        }

        /* Photo frame */
        .photo-frame {
          width: 80%; max-width: 320px;
          aspect-ratio: 3/4; background: white;
          border-radius: 1rem; padding: 0.75rem;
          margin: 0 auto 1.5rem;
          box-shadow: 0 10px 40px rgba(190,24,93,0.15);
          transform: rotate(-2deg);
          transition: transform 0.5s ease;
        }
        .photo-frame:hover { transform: rotate(1deg) scale(1.02); }
        .photo-frame img {
          width: 100%; height: 100%;
          object-fit: cover; border-radius: 0.5rem;
        }
        .photo-caption {
          font-family: 'Playfair Display', serif;
          font-style: italic; color: #ec4899;
          font-size: 1.1rem; margin-bottom: 2rem;
        }

        /* Buttons */
        .btn-next {
          display: inline-flex; align-items: center; gap: 0.5rem;
          padding: 0.5rem 1rem; background: transparent;
          color: #db2777; font-weight: 500; font-style: italic;
          font-family: 'Playfair Display', serif;
          border: none; border-bottom: 1px solid #f9a8d4;
          cursor: pointer; font-size: 1.1rem;
          transition: all 0.4s ease;
        }
        .btn-next:hover {
          transform: translateY(-2px) translateX(5px);
          color: #ec4899; border-bottom-color: #ec4899;
          letter-spacing: 0.05em;
        }

        /* Bouquet container */
        .bouquet-container {
          position: relative; width: 280px; height: 320px;
          margin: 0 auto 2rem;
          opacity: 0; transform: scale(0.6) translateY(40px);
          transition: all 1s cubic-bezier(0.34,1.56,0.64,1);
        }
        .bouquet-page.active .bouquet-container {
          opacity: 1; transform: scale(1) translateY(0);
        }
        .bouquet-img {
          width: 100%; height: 100%; object-fit: contain;
          filter: drop-shadow(0 10px 20px rgba(190,24,93,0.2));
          transition: all 0.5s cubic-bezier(0.34,1.56,0.64,1);
          cursor: pointer; position: relative; z-index: 2;
        }
        .bouquet-container:hover .bouquet-img {
          transform: scale(1.08) rotate(-3deg);
          filter: drop-shadow(0 15px 30px rgba(236,72,153,0.5)) brightness(1.05);
        }
        .bouquet-glow {
          position: absolute; top: 50%; left: 50%;
          transform: translate(-50%, -50%);
          width: 180px; height: 180px;
          background: radial-gradient(circle, rgba(244,114,182,0.5) 0%, rgba(253,242,248,0) 70%);
          border-radius: 50%; z-index: 1;
          animation: bouquetPulseGlow 2s infinite alternate;
        }
        @keyframes bouquetPulseGlow {
          from { transform: translate(-50%, -50%) scale(1); opacity: 0.5; }
          to { transform: translate(-50%, -50%) scale(1.3); opacity: 1; }
        }

        .final-heading {
          font-family: 'Playfair Display', serif;
          font-size: 1.8rem; color: #be185d;
          margin-bottom: 1rem; line-height: 1.3;
          font-style: italic;
          animation: bouquetFadeUp 1s 1.2s forwards;
          opacity: 0;
        }
        .final-text {
          font-family: 'Playfair Display', serif;
          font-style: italic; font-size: 1.1rem;
          color: #ec4899; line-height: 1.8;
          max-width: 420px; margin: 0 auto;
        }
        .final-signature {
          margin-top: 2rem;
          font-weight: 700; font-size: 0.85rem;
          color: #f472b6;
          letter-spacing: 0.1em; text-transform: uppercase;
          animation: bouquetFadeUp 1s 2s forwards;
          opacity: 0;
        }

        /* Back button */
        .bouquet-back {
          position: fixed; top: 16px; left: 16px; z-index: 99999;
          background: white; color: #db2777;
          padding: 8px 14px; border-radius: 999px;
          font-weight: 700; font-size: 13px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.08);
          border: 2px solid #fbcfe8;
          display: flex; align-items: center; gap: 6px;
          text-decoration: none; cursor: pointer;
          transition: all 0.2s;
          font-family: 'Inter', sans-serif;
        }
        .bouquet-back:hover { background: #fdf2f8; border-color: #f472b6; }

        /* Music button */
        .bouquet-music-btn {
          position: fixed; top: 16px; right: 16px; z-index: 99999;
          background: white; color: #ec4899;
          width: 44px; height: 44px; border-radius: 50%;
          border: 2px solid #fbcfe8;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; font-size: 1.2rem;
          box-shadow: 0 2px 10px rgba(0,0,0,0.08);
          transition: all 0.2s;
        }
        .bouquet-music-btn:hover { background: #fdf2f8; border-color: #f472b6; }

        @keyframes bouquetFadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .splash-bg-img {
          position: absolute; inset: 0;
          width: 100%; height: 100%;
          object-fit: cover; opacity: 0.35; z-index: 1;
        }

        @media (max-width: 480px) {
          .intro-heading, .question-text { font-size: 1.4rem; }
          .intro-sub, .msg-text { font-size: 1rem; }
          .final-heading { font-size: 1.5rem; }
          .final-text { font-size: 1rem; }
          .bouquet-container { width: 220px; height: 260px; }
          .photo-frame { width: 90%; }
          .bouquet-page { padding: 1.5rem; }
        }
      `}</style>

      {/* Google Fonts */}
      {/* eslint-disable-next-line @next/next/no-page-custom-font */}
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />

      {/* Video Background */}
      <video autoPlay muted loop playsInline className="bouquet-video-bg">
        <source src="/images/elegant-flowers.mp4" type="video/mp4" />
      </video>

      {/* Universal Audio/YouTube Player */}
      <UniversalMusicPlayer musicUrl={musicUrl} isPlaying={phase === 'pages'} />

      {/* Navigation Buttons (Kembali & Refresh) - Icon Only for Demo */}
      {showBackButton !== false && (
        <div className="fixed top-4 left-4 z-50 flex items-center gap-2">
          <Link
            href="/plivin/gift"
            title="Kembali ke Beranda"
            className="p-2.5 rounded-xl bg-black/80 text-white border border-white/20 hover:border-white hover:bg-black transition-all shadow-lg backdrop-blur-md flex items-center justify-center cursor-pointer"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </Link>
          <button
            type="button"
            onClick={() => {
              if (typeof window !== 'undefined') window.location.reload();
            }}
            title="Muat Ulang"
            className="p-2.5 rounded-xl bg-black/80 text-white border border-white/20 hover:border-white hover:bg-black transition-all shadow-lg backdrop-blur-md flex items-center justify-center cursor-pointer"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.3" />
            </svg>
          </button>
        </div>
      )}

      {/* Background Floating Petals */}
      <div className="bouquet-bg-petals">
        {bgPetals.map((p) => (
          <div
            key={p.id}
            className="bouquet-bg-petal"
            style={{
              left: `${p.left}%`,
              '--dur': `${p.dur}s`,
              '--delay': `${p.delay}s`,
            } as React.CSSProperties}
          >
            {p.emoji}
          </div>
        ))}
      </div>

      {/* Splash Screen */}
      <div className={`bouquet-splash ${phase === 'pages' ? 'zoomed' : ''}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/flower-pink.gif" alt="Background" className="splash-bg-img" />
        {splashPetals.map((p) => (
          <div
            key={p.id}
            className="splash-petal"
            style={{
              left: `${p.left}%`,
              fontSize: `${p.size}rem`,
              '--dur': `${p.dur}s`,
              '--delay': `${p.delay}s`,
              '--rot': `${p.rot}deg`,
            } as React.CSSProperties}
          >
            {p.emoji}
          </div>
        ))}
        <div className="envelope-card">
          <div className="envelope-img-wrap" onClick={openEnvelope}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/envelope-closed.webp" alt="Envelope" />
          </div>
          <p className="envelope-tap">Sentuh amplop untuk membuka pesan 🌸</p>
        </div>
      </div>

      {/* ===== PAGES ===== */}

      {/* Page 0: Intro */}
      <div className={`${pageClass(0)} page-intro`}>
        <div className="page-inner">
          <div className="intro-emoji">🌸</div>
          <h1 className="intro-heading">Hai, {recipientName}...</h1>
          <p className="intro-sub">
            Kamu tahu gak? Menit demi menit tanpamu rasanya kayak abad yang hampa. Aku bikin ini sambil senyum-senyum sendiri nahan kangen. Sini, buka pelan-pelan ya kesayangan aku...
          </p>
          <button className="btn-next" onClick={() => goToPage(1)}>
            Buka Pintu Hatiku 🌷
          </button>
        </div>
      </div>

      {/* Page 1: Question 1 */}
      <div className={`${pageClass(1)} page-question`}>
        <div className="page-inner">
          <div className="question-tag">Teka-Teki Rindu</div>
          <h2 className="question-text">Coba tebak, kenapa detik ini aku cuma bisa mikirin kamu terus-terusan?</h2>
          <button className="choice-card" onClick={() => goToPage(2)}>
            <span className="choice-emoji">💌</span> Karena rindu ini udah gak ada obatnya!
          </button>
          <button className="choice-card" onClick={() => goToPage(2)}>
            <span className="choice-emoji">😭</span> Karena hatiku rewel pengen manja-manjaan sama kamu
          </button>
          <button className="choice-card" onClick={() => goToPage(2)}>
            <span className="choice-emoji">💖</span> Karena tiap napas yang kuhela isinya cuma namamu
          </button>
        </div>
      </div>

      {/* Page 2: Message 1 */}
      <div className={`${pageClass(2)} page-message`}>
        <div className="page-inner">
          <div className="msg-icon">✨</div>
          <p className="msg-text">
            Nangis gak kalau aku bilang semuanya benar? Aku kangen kamu setengah mati, rindu ini udah meluber kemana-mana. Aku bener-bener gak bisa kalau gak ada kamu di hidupku. Kamu tuh detak jantungku tahu!
          </p>
          <button className="btn-next" onClick={() => goToPage(3)}>Bisikin Lagi Dong →</button>
        </div>
      </div>

      {/* Page 3: Question 2 */}
      <div className={`${pageClass(3)} page-question`}>
        <div className="page-inner">
          <div className="question-tag">Ujian Cinta</div>
          <h2 className="question-text">Tahu gak bagian dari diri kamu yang paling bikin aku candu banget?</h2>
          <button className="choice-card" onClick={() => goToPage(4)}>
            <span className="choice-emoji">🥺</span> Tatapan mata kamu yang bikin hatiku meleleh
          </button>
          <button className="choice-card" onClick={() => goToPage(4)}>
            <span className="choice-emoji">🫠</span> Suara manja kamu pas lagi telfonan
          </button>
          <button className="choice-card" onClick={() => goToPage(4)}>
            <span className="choice-emoji">💖</span> Seluruh jiwa ragamu adalah candu terbesarku!
          </button>
        </div>
      </div>

      {/* Page 4: Message 2 */}
      <div className={`${pageClass(4)} page-message`}>
        <div className="page-inner">
          <div className="msg-icon">🌙</div>
          <p className="msg-text">
            Jawabannya: Semuanya! Gak ada satupun sudut dari dirimu yang gak bikin aku jatuh cinta berkali-kali setiap harinya.
          </p>
          <button className="btn-next" onClick={() => goToPage(5)}>Lihat Foto Kita →</button>
        </div>
      </div>

      {/* Page 5: Photo */}
      <div className={`${pageClass(5)} page-photo`}>
        <div className="page-inner">
          <div className="question-tag">Momen Kita</div>
          <div className="photo-frame">
            <Image src={photoUrl} alt="Our moment" width={320} height={420} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '0.5rem' }} unoptimized />
          </div>
          <p className="photo-caption">&ldquo;Di setiap jengkal semesta, cuma di sampingmu aku merasa utuh.&rdquo;</p>
          <button className="btn-next" onClick={() => goToPage(6)}>Lanjut ke yang paling penting →</button>
        </div>
      </div>

      {/* Page 6: Question 3 */}
      <div className={`${pageClass(6)} page-question`}>
        <div className="page-inner">
          <div className="question-tag">Pelabuhan Terakhir</div>
          <h2 className="question-text">Kalau suatu hari nanti semesta nanya, siapa pelabuhan terakhirku, boleh kan aku sebut namamu untuk selamanya?</h2>
          <button className="choice-card" onClick={() => goToPage(7)}>
            <span className="choice-emoji">🥹</span> Iya, aku mau mengarungi sisa hidup bersamamu
          </button>
          <button className="choice-card" onClick={() => goToPage(7)}>
            <span className="choice-emoji">😭</span> Selamanya kita gak boleh pisah ya!
          </button>
          <button className="choice-card" onClick={() => goToPage(7)}>
            <span className="choice-emoji">💍</span> Pokoknya wajib nikah sama aku!
          </button>
        </div>
      </div>

      {/* Page 7: Final — Bouquet */}
      <div className={`${pageClass(7)} page-final`}>
        <div className="page-inner">
          <div className="bouquet-container">
            <div className="bouquet-glow" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/bouquet.png" alt="Bouquet" className="bouquet-img" />
          </div>
          <h2 className="final-heading">Ini buket bunga untuk {recipientName} 💐</h2>
          <p className="final-text">{finalText}{!isTypingDone && <span style={{ display: 'inline-block', width: 2, height: '1.1em', background: '#ec4899', marginLeft: 2, verticalAlign: 'text-bottom', animation: 'bouquetBlink 0.7s step-end infinite' }} />}</p>
          <div className="final-signature">— Dari orang yang paling sayang kamu ❤️</div>
        </div>
      </div>

      {/* Progress Dots Bar */}
      {phase === 'pages' && currentPage >= 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-50 bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-pink-300/30 shadow-lg">
          {Array.from({ length: TOTAL_PAGES }).map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => goToPage(i)}
              className={`h-2 rounded-full transition-all cursor-pointer border-none outline-none ${
                currentPage === i ? 'w-6 bg-pink-500 shadow-[0_0_8px_#ec4899]' : 'w-2 bg-white/40 hover:bg-white/70'
              }`}
              title={`Ke Halaman ${i + 1}`}
            />
          ))}
        </div>
      )}

      <style>{`
        @keyframes bouquetBlink { 50% { opacity: 0; } }
      `}</style>
    </div>
  );
}
