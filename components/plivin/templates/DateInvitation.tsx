'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { TemplateProps } from '@type/gift';
import UniversalMusicPlayer from '@components/plivin/common/UniversalMusicPlayer';
import Link from 'next/link';
import Image from 'next/image';
import { fadeInAudio } from '@lib/audio-utils';

/* ============================================================
   Date Invitation — Multi-page romantic date invitation
   Migrated from template-date-invitation.html
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

export default function DateInvitation({
  recipientName = 'Kekasihku',
  greetingText = '',
  photos = [],
  musicUrl = '/music/kasih-putih.mp3',
  showBackButton = true,
}: TemplateProps) {
  const [phase, setPhase] = useState<'splash' | 'pages'>('splash');
  const [currentPage, setCurrentPage] = useState(-1);
  const [finalText, setFinalText] = useState('');
  const [isTypingDone, setIsTypingDone] = useState(false);
  const [revealedLines, setRevealedLines] = useState<number[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const typingRef = useRef<boolean>(false);

  const TOTAL_PAGES = 8;
  const photoUrl = photos.length > 0 ? photos[0] : 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?q=80&w=800&auto=format&fit=crop';

  const finalMessage = greetingText ||
    `Aku gak sabar buat ketemu kamu, ${recipientName}. Bersamamu, tiap detik terasa istimewa. Sampai ketemu di hari spesial kita ya, sayang...`;

  const [splashPetals] = useState<Petal[]>(() => {
    const petalEmojis = ['🌸', '🌷', '💮', '🌺', '🪷'];
    return Array.from({ length: 30 }, (_, i) => ({
      id: i,
      emoji: petalEmojis[Math.floor(Math.random() * petalEmojis.length)],
      left: Math.random() * 100,
      dur: 4 + Math.random() * 4,
      delay: Math.random() * 3,
      rot: Math.random() * 360,
      size: 1 + Math.random() * 1.5,
    }));
  });

  // Animated reveal for date details
  useEffect(() => {
    if (currentPage === 6) {
      const timers: ReturnType<typeof setTimeout>[] = [];
      const resetTimer = setTimeout(() => {
        setRevealedLines([]);
        for (let i = 0; i < 6; i++) {
          timers.push(setTimeout(() => {
            setRevealedLines((prev) => [...prev, i]);
          }, 500 + i * 600));
        }
      }, 0);
      return () => {
        clearTimeout(resetTimer);
        timers.forEach(clearTimeout);
      };
    }
  }, [currentPage]);

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

  function goToPage(idx: number) {
    setCurrentPage(idx);
    if (idx === TOTAL_PAGES - 1) {
      typeText(finalMessage);
    }
  }

  // Swipe support
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
  }, [phase, currentPage]);

  const pageClass = (idx: number) => currentPage === idx ? 'di-page active' : 'di-page';

  return (
    <div className="di-root">
      <style>{`
        .di-root {
          font-family: 'Inter', sans-serif;
          min-height: 100vh; min-height: 100dvh;
          width: 100%; height: 100%; flex: 1;
          overflow: hidden; position: relative;
          background: linear-gradient(135deg, #fce7f3, #fdf2f8, #ffe4e6);
          display: flex; flex-direction: column;
        }
        .di-video-bg {
          position: absolute; top: 0; left: 0;
          width: 100%; height: 100%;
          z-index: 0; object-fit: cover; opacity: 0.6;
        }

        /* Splash */
        .di-splash {
          position: absolute; inset: 0; width: 100%; height: 100%; z-index: 1000;
          background: linear-gradient(135deg, #fce7f3, #fdf2f8, #ffe4e6);
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          transition: opacity 1s, transform 1s, filter 1s;
        }
        .di-splash.zoomed {
          transform: scale(2.5); filter: brightness(2.5) blur(10px); opacity: 0;
          pointer-events: none;
        }
        .di-splash-bg {
          position: absolute; inset: 0;
          width: 100%; height: 100%;
          object-fit: cover; opacity: 0.35; z-index: 1;
        }
        .di-envelope-card {
          background: rgba(255,255,255,0.25);
          backdrop-filter: blur(15px); -webkit-backdrop-filter: blur(15px);
          border: 1px solid rgba(255,255,255,0.35);
          border-radius: 28px; padding: 40px 30px;
          max-width: 400px; width: 90%;
          box-shadow: 0 20px 50px rgba(220,39,119,0.15);
          display: flex; flex-direction: column;
          align-items: center; text-align: center;
          z-index: 10; animation: diFadeUp 1s 0.3s forwards; opacity: 0;
        }
        .di-envelope-img { width: 220px; height: 160px; margin-bottom: 24px; cursor: pointer; display: flex; align-items: center; justify-content: center; }
        .di-envelope-img img { width: 100%; height: 100%; object-fit: contain; transition: transform 0.5s; filter: drop-shadow(0 8px 16px rgba(220,39,119,0.1)); }
        .di-envelope-img:hover img { transform: scale(1.06) rotate(1.5deg); }
        .di-envelope-subtitle { font-family: 'Dancing Script', cursive; font-size: 1.4rem; color: #db2777; margin-bottom: 8px; font-weight: 600; }
        .di-envelope-title { font-family: 'Playfair Display', serif; font-size: 1.6rem; font-weight: 700; color: #be185d; margin-bottom: 16px; }
        .di-envelope-tap { font-family: 'Playfair Display', serif; font-size: 1.2rem; color: #be185d; font-weight: 600; }

        .di-splash-petal { position: absolute; pointer-events: none; opacity: 0; animation: diPetalFall var(--dur) var(--delay) ease-in forwards; }
        @keyframes diPetalFall {
          0% { opacity: 0; transform: translateY(-30px) rotate(0deg) scale(0.8); }
          10% { opacity: 1; }
          100% { opacity: 0; transform: translateY(110vh) rotate(var(--rot)) scale(1); }
        }

        /* Page system */
        .di-page {
          position: absolute; inset: 0; width: 100%; height: 100%;
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          padding: 2rem; opacity: 0; visibility: hidden;
          transition: opacity 0.8s cubic-bezier(0.4,0,0.2,1), visibility 0.8s, transform 0.8s cubic-bezier(0.4,0,0.2,1), filter 0.8s;
          transform: scale(0.7) translateZ(-500px);
          overflow-y: auto; perspective: 1000px; filter: blur(10px);
        }
        .di-page.active {
          opacity: 1; visibility: visible;
          transform: scale(1) translateZ(0); filter: blur(0);
        }
        .di-page-inner { max-width: 500px; width: 100%; text-align: center; }

        /* Staggered animations */
        .di-anim { opacity: 0; transform: translateY(30px); transition: opacity 0.6s ease, transform 0.6s ease; }
        .di-page.active .di-anim { opacity: 1; transform: translateY(0); }
        .di-page.active .di-anim:nth-child(1) { transition-delay: 0.2s; }
        .di-page.active .di-anim:nth-child(2) { transition-delay: 0.5s; }
        .di-page.active .di-anim:nth-child(3) { transition-delay: 0.8s; }
        .di-page.active .di-anim:nth-child(4) { transition-delay: 1.1s; }
        .di-page.active .di-anim:nth-child(5) { transition-delay: 1.4s; }
        .di-page.active .di-anim:nth-child(6) { transition-delay: 1.7s; }

        .di-page-intro { background: linear-gradient(180deg, rgba(253,242,248,0.45), rgba(255,250,245,0.45)); backdrop-filter: blur(8px); }
        .di-page-question { background: linear-gradient(180deg, rgba(255,250,245,0.45), rgba(253,242,248,0.45)); backdrop-filter: blur(8px); }
        .di-page-message { background: linear-gradient(180deg, rgba(253,242,248,0.45), rgba(255,241,242,0.45)); backdrop-filter: blur(8px); }
        .di-page-photo { background: linear-gradient(180deg, rgba(255,250,245,0.45), rgba(253,242,248,0.45)); backdrop-filter: blur(8px); }
        .di-page-reveal { background: linear-gradient(180deg, rgba(253,242,248,0.45), rgba(255,241,242,0.45)); backdrop-filter: blur(8px); }
        .di-page-final { background: linear-gradient(180deg, rgba(252,231,243,0.45), rgba(255,228,230,0.45), rgba(253,242,248,0.45)); backdrop-filter: blur(8px); }

        .di-intro-emoji { font-size: 4rem; margin-bottom: 1.5rem; animation: diFloat 3s ease-in-out infinite; }
        @keyframes diFloat { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-12px); } }
        .di-intro-heading { font-family: 'Playfair Display', serif; font-size: 2rem; color: #be185d; margin-bottom: 1rem; line-height: 1.3; }
        .di-intro-sub { color: #be185d; font-size: 1rem; line-height: 1.7; margin-bottom: 2.5rem; }

        .di-qtag { display: inline-block; font-size: 0.7rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.15em; color: #ec4899; background: #fce7f3; padding: 0.4rem 1rem; border-radius: 999px; margin-bottom: 1.5rem; }
        .di-qtext { font-family: 'Playfair Display', serif; font-size: 1.6rem; color: #be185d; margin-bottom: 2rem; line-height: 1.4; }

        .di-choice {
          display: flex; align-items: center; width: 100%; padding: 1rem 0;
          background: transparent; border: none; border-bottom: 1px dashed #fbcfe8;
          font-size: 1.15rem; font-weight: 500; font-style: italic;
          color: #be185d; cursor: pointer; transition: all 0.4s;
          margin-bottom: 0.5rem; text-align: left; font-family: 'Playfair Display', serif;
          position: relative; overflow: hidden;
        }
        .di-choice:last-child { border-bottom: none; }
        .di-choice:hover { transform: translateX(10px); color: #ec4899; }
        .di-choice-emoji { font-size: 1.5rem; margin-right: 1rem; }

        .di-msg-icon { font-size: 3rem; margin-bottom: 1.5rem; }
        .di-msg-text { font-family: 'Playfair Display', serif; font-size: 1.3rem; color: #be185d; line-height: 1.8; margin-bottom: 2rem; font-style: italic; }

        .di-photo-frame {
          width: 80%; max-width: 280px; aspect-ratio: 3/4; background: white;
          border-radius: 1rem; padding: 0.75rem; margin: 0 auto 1.5rem;
          box-shadow: 0 10px 40px rgba(190,24,93,0.15);
          transform: rotate(-2deg); transition: transform 0.5s; position: relative;
        }
        .di-photo-frame:hover { transform: rotate(1deg) scale(1.02); }
        .di-photo-caption { font-family: 'Playfair Display', serif; font-style: italic; color: #ec4899; font-size: 1.1rem; margin-bottom: 2rem; }

        .di-btn {
          display: inline-flex; align-items: center; gap: 0.5rem;
          padding: 0.5rem 1rem; background: transparent;
          color: #db2777; font-weight: 500; font-style: italic;
          font-family: 'Playfair Display', serif;
          border: none; border-bottom: 1px solid #f9a8d4;
          cursor: pointer; font-size: 1.1rem; transition: all 0.4s;
        }
        .di-btn:hover { transform: translateY(-2px) translateX(5px); color: #ec4899; letter-spacing: 0.05em; }

        .di-back {
          position: fixed; top: 16px; left: 16px; z-index: 99999;
          background: white; color: #db2777;
          padding: 8px 14px; border-radius: 999px;
          font-weight: 700; font-size: 13px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.08);
          border: 2px solid #fbcfe8;
          display: flex; align-items: center; gap: 6px;
          text-decoration: none; cursor: pointer; transition: all 0.2s;
          font-family: 'Inter', sans-serif;
        }
        .di-back:hover { background: #fdf2f8; border-color: #f472b6; }

        /* Reveal cards */
        .di-reveal-line {
          opacity: 0; clip-path: inset(0 50% 0 50%); transform: translateY(20px);
          transition: opacity 1s ease, clip-path 1.2s cubic-bezier(0.25,1,0.5,1), transform 1s ease;
          margin-bottom: 1.5rem;
        }
        .di-reveal-line.visible { opacity: 1; clip-path: inset(0 0% 0 0%); transform: translateY(0); }
        .di-reveal-emoji { font-size: 2.5rem; display: block; margin-bottom: 0.3rem; animation: diFloat 3s ease-in-out infinite; }
        .di-reveal-label { font-size: 0.7rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.15em; color: #f472b6; margin-bottom: 0.2rem; }
        .di-reveal-value { font-family: 'Playfair Display', serif; font-size: 1.4rem; color: #be185d; font-weight: 700; line-height: 1.3; }
        .di-reveal-value.highlight {
          font-family: 'Dancing Script', cursive; font-size: 1.8rem; color: #db2777;
          background: linear-gradient(135deg, #db2777, #f43f5e);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
        }
        .di-reveal-divider { width: 40px; height: 2px; background: linear-gradient(90deg, transparent, #f9a8d4, transparent); margin: 0 auto 1.5rem; }

        /* Final page */
        .di-final-emoji { font-size: 5rem; margin-bottom: 1rem; opacity: 0; transform: scale(0); transition: all 1s cubic-bezier(0.34,1.56,0.64,1); }
        .di-page.active .di-final-emoji { opacity: 1; transform: scale(1); }
        .di-final-heading { font-family: 'Playfair Display', serif; font-size: 1.8rem; color: #be185d; margin-bottom: 1rem; animation: diFadeUp 1s 0.8s forwards; opacity: 0; }
        .di-final-text { font-family: 'Playfair Display', serif; font-style: italic; font-size: 1.1rem; color: #ec4899; line-height: 1.8; max-width: 420px; margin: 0 auto; min-height: 100px; }
        .di-final-sig { margin-top: 2rem; font-weight: 700; font-size: 0.85rem; color: #f472b6; letter-spacing: 0.1em; text-transform: uppercase; animation: diFadeUp 1s 2s forwards; opacity: 0; }

        .di-tap-hint { font-size: 0.8rem; color: #f472b6; font-style: italic; margin-top: 1rem; opacity: 0; animation: diFadeUp 0.8s 1.5s forwards; }
        .di-cursor { display: inline-block; width: 2px; height: 1.1em; background: #ec4899; margin-left: 2px; vertical-align: text-bottom; animation: diBlink 0.7s step-end infinite; }

        @keyframes diFadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes diBlink { 50% { opacity: 0; } }

        @media (max-width: 480px) {
          .di-intro-heading, .di-qtext { font-size: 1.4rem; }
          .di-intro-sub, .di-msg-text { font-size: 0.95rem; line-height: 1.6; }
          .di-final-heading { font-size: 1.4rem; }
          .di-final-text { font-size: 0.95rem; }
          .di-photo-frame { width: 85%; max-width: 220px; }
          .di-page { padding: 1.25rem 1rem; }
          .di-reveal-value { font-size: 1.1rem; }
          .di-reveal-value.highlight { font-size: 1.35rem; }
          .di-final-emoji { font-size: 3.5rem; }
          .di-choice { font-size: 1rem; }
        }
      `}</style>

      {/* eslint-disable-next-line @next/next/no-page-custom-font */}
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Inter:wght@400;500;600;700&family=Dancing+Script:wght@400;500;600;700&display=swap" rel="stylesheet" />

      <video autoPlay muted loop playsInline className="di-video-bg">
        <source src="/images/sakura-flower.mp4" type="video/mp4" />
      </video>

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

      {/* Splash */}
      <div className={`di-splash ${phase === 'pages' ? 'zoomed' : ''}`}>
        <video autoPlay muted loop playsInline className="di-splash-bg">
          <source src="/images/sakura-flower.mp4" type="video/mp4" />
        </video>
        {splashPetals.map((p) => (
          <div key={p.id} className="di-splash-petal" style={{ left: `${p.left}%`, fontSize: `${p.size}rem`, '--dur': `${p.dur}s`, '--delay': `${p.delay}s`, '--rot': `${p.rot}deg` } as React.CSSProperties}>{p.emoji}</div>
        ))}
        <div className="di-envelope-card">
          <div className="di-envelope-img" onClick={openEnvelope}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/envelope-closed.webp" alt="Envelope" />
          </div>
          <p className="di-envelope-subtitle">Ada sesuatu spesial untukmu 💌</p>
          <h1 className="di-envelope-title">Sentuh untuk membuka</h1>
          <p className="di-envelope-tap">Sentuh amplop untuk mulai 🌸</p>
        </div>
      </div>

      {/* Page 0: Intro */}
      <div className={`${pageClass(0)} di-page-intro`}>
        <div className="di-page-inner">
          <div className="di-anim di-intro-emoji">💌</div>
          <h1 className="di-anim di-intro-heading">Hai, {recipientName}...</h1>
          <p className="di-anim di-intro-sub">
            Aku punya sesuatu yang udah lama pengen aku sampein ke kamu. Bukan lewat chat, bukan lewat telepon — tapi lewat sesuatu yang lebih spesial. Yuk, buka pelan-pelan ya...
          </p>
          <button className="di-anim di-btn" onClick={() => goToPage(1)}>Buka Pelan-pelan 🌷</button>
        </div>
      </div>

      {/* Page 1: Question 1 */}
      <div className={`${pageClass(1)} di-page-question`}>
        <div className="di-page-inner">
          <div className="di-anim di-qtag">Pertanyaan Pertama</div>
          <h2 className="di-anim di-qtext">Tau ga, kenapa aku bikin ini buat kamu?</h2>
          <button className="di-anim di-choice" onClick={() => goToPage(2)}>
            <span className="di-choice-emoji">💌</span> Karena kamu mau ngajak aku pergi?
          </button>
          <button className="di-anim di-choice" onClick={() => goToPage(2)}>
            <span className="di-choice-emoji">🤔</span> Hmm, gak tau deh... kasih tau dong!
          </button>
          <button className="di-anim di-choice" onClick={() => goToPage(2)}>
            <span className="di-choice-emoji">🥰</span> Pasti ada sesuatu yang manis ya?
          </button>
        </div>
      </div>

      {/* Page 2: Message 1 */}
      <div className={`${pageClass(2)} di-page-message`}>
        <div className="di-page-inner" onClick={() => goToPage(3)}>
          <div className="di-anim di-msg-icon" style={{ animation: 'diFloat 2s ease-in-out infinite' }}>✨</div>
          <p className="di-anim di-msg-text">Jawaban yang bener sebenernya... semua jawaban di atas itu bener.</p>
          <p className="di-anim di-msg-text" style={{ fontStyle: 'normal', fontFamily: "'Inter', sans-serif", fontSize: '0.95rem' }}>
            Karena waktu bareng kamu itu selalu terasa kurang, aku pengen bikin satu momen yang bener-bener cuma milik kita berdua...
          </p>
          <button className="di-anim di-btn">Lanjut yuk →</button>
          <p className="di-tap-hint">ketuk di mana saja untuk lanjut</p>
        </div>
      </div>

      {/* Page 3: Question 2 */}
      <div className={`${pageClass(3)} di-page-question`}>
        <div className="di-page-inner">
          <div className="di-anim di-qtag">Coba Tebak</div>
          <h2 className="di-anim di-qtext">Apa yang paling kamu suka kalau kita lagi bareng?</h2>
          <button className="di-anim di-choice" onClick={() => goToPage(4)}>
            <span className="di-choice-emoji">🍽️</span> Makan bareng sambil ngobrol~
          </button>
          <button className="di-anim di-choice" onClick={() => goToPage(4)}>
            <span className="di-choice-emoji">🎬</span> Nonton film sambil gandeng tangan
          </button>
          <button className="di-anim di-choice" onClick={() => goToPage(4)}>
            <span className="di-choice-emoji">🫶</span> Apapun asal sama kamu udah cukup
          </button>
        </div>
      </div>

      {/* Page 4: Message 2 */}
      <div className={`${pageClass(4)} di-page-message`}>
        <div className="di-page-inner" onClick={() => goToPage(5)}>
          <div className="di-anim di-msg-icon" style={{ animation: 'diFloat 2s ease-in-out infinite' }}>🌙</div>
          <p className="di-anim di-msg-text">Sebenernya, semua itu bener. Apapun yang kita lakuin bareng, semuanya terasa istimewa.</p>
          <p className="di-anim di-msg-text">Dan karena itu... aku mau ngajak kamu ke suatu tempat. Tempat yang spesial.</p>
          <button className="di-anim di-btn">Mau tau kemana? →</button>
          <p className="di-tap-hint">ketuk di mana saja untuk lanjut</p>
        </div>
      </div>

      {/* Page 5: Photo */}
      <div className={`${pageClass(5)} di-page-photo`}>
        <div className="di-page-inner">
          <div className="di-anim di-qtag">Momen Kita</div>
          <div className="di-anim di-photo-frame">
            <Image src={photoUrl} alt="Our moment" width={280} height={370} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '0.5rem' }} unoptimized />
          </div>
          <p className="di-anim di-photo-caption">&ldquo;Foto favoritku. Karena ada kamu di dalamnya.&rdquo;</p>
          <button className="di-anim di-btn" onClick={() => goToPage(6)}>Lanjut ke yang paling penting →</button>
        </div>
      </div>

      {/* Page 6: Date Reveal */}
      <div className={`${pageClass(6)} di-page-reveal`}>
        <div className="di-page-inner">
          <div className={`di-reveal-line ${revealedLines.includes(0) ? 'visible' : ''}`}>
            <span className="di-reveal-emoji">📅</span>
            <div className="di-reveal-label">Tanggal</div>
            <div className="di-reveal-value highlight">Sabtu, 12 Juli 2026</div>
          </div>
          <div className={`di-reveal-line ${revealedLines.includes(1) ? 'visible' : ''}`}>
            <span className="di-reveal-emoji">⏰</span>
            <div className="di-reveal-label">Jam</div>
            <div className="di-reveal-value">17:00 WIB</div>
          </div>
          <div className="di-reveal-divider" />
          <div className={`di-reveal-line ${revealedLines.includes(2) ? 'visible' : ''}`}>
            <span className="di-reveal-emoji">📍</span>
            <div className="di-reveal-label">Kita Ketemu di</div>
            <div className="di-reveal-value highlight">Tempat Favorit Kita</div>
          </div>
          <div className={`di-reveal-line ${revealedLines.includes(3) ? 'visible' : ''}`}>
            <span className="di-reveal-emoji">🍽️</span>
            <div className="di-reveal-label">Rencana Kita</div>
            <div className="di-reveal-value">Dinner & Movie Night</div>
          </div>
          <div className={`di-reveal-line ${revealedLines.includes(4) ? 'visible' : ''}`}>
            <span className="di-reveal-emoji">👗</span>
            <div className="di-reveal-label">Dress Code</div>
            <div className="di-reveal-value">Smart Casual</div>
          </div>
          <div className={`di-reveal-line ${revealedLines.includes(5) ? 'visible' : ''}`} style={{ marginTop: '1rem' }}>
            <button className="di-btn" onClick={() => goToPage(7)}>Aku siap! Lanjut → 🌸</button>
          </div>
        </div>
      </div>

      {/* Page 7: Final */}
      <div className={`${pageClass(7)} di-page-final`}>
        <div className="di-page-inner">
          <div className="di-final-emoji"><span style={{ display: 'inline-block', animation: 'diFloat 1.5s ease-in-out infinite' }}>💕</span></div>
          <h2 className="di-final-heading">Aku tunggu kamu ya, {recipientName}...</h2>
          <p className="di-final-text">{finalText}{!isTypingDone && <span className="di-cursor" />}</p>
          <div className="di-final-sig">— Dengan cinta yang tak terbatas ❤️</div>
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
    </div>
  );
}
