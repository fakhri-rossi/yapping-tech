'use client';

import { useState, useRef, useEffect } from 'react';
import { TemplateProps } from '@type/gift';
import UniversalMusicPlayer from '@components/plivin/common/UniversalMusicPlayer';
import Link from 'next/link';
import { fadeInAudio } from '@lib/audio-utils';

/* ============================================================
   Kicau Mania Spesial — Rainbow Alay Theme
   Migrated from template-kicaumania.html
   ============================================================ */

export default function KicauMania({
  recipientName = 'Kicau Mania',
  greetingText = '',
  photos = [],
  musicUrl = '/music/kicau-mania.mp3',
  showBackButton = true,
}: TemplateProps) {
  const [started, setStarted] = useState(false);
  const [currentPage, setCurrentPage] = useState(-1);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const TOTAL_PAGES = 4;

  const birdImgs = photos.length > 0
    ? photos
    : [
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR76PrmVC_p4Hm0Fgi8h5q4U5j9qX9msnYIWock0EmJDanVz4efHWSHSYSu&s=10',
      'https://media.tenor.com/UkshIJcvqR0AAAAe/kicau-mania-scuba-kicau.png',
    ];

  const finalMessages = greetingText
    ? greetingText.split('\n').filter(l => l.trim())
    : [
      `Semoga panjang umur, sehat selalu, rezeki lancar jaya kayak burung kicau juara gantangan! Aminnn!`,
      `Sehat jasmani dan rohani selalu, tenaganya jos gandos pantang menyerah seperti Murai Batu legendaris!`,
      `Rezeki mengalir deras tanpa batas, dan bisa beli pakan voer impor premium kelas atas setiap hari!`,
    ];

  // Scattered background birds GIF generator
  const [floatingBirds] = useState<Array<{
    id: number;
    top: number;
    left: number;
    size: number;
    duration: number;
    delay: number;
    rotation: number;
    animType: 'float' | 'spin' | 'bounce';
  }>>(() =>
    Array.from({ length: 24 }, (_, i) => ({
      id: i,
      top: Math.floor(Math.random() * 90),
      left: Math.floor(Math.random() * 90),
      size: Math.floor(Math.random() * 65) + 60, // 60px to 125px
      duration: Math.random() * 3.5 + 2.5, // 2.5s to 6s
      delay: Math.random() * 2,
      rotation: Math.floor(Math.random() * 360),
      animType: (['float', 'spin', 'bounce'] as const)[i % 3],
    }))
  );

  // Rainbow flash
  useEffect(() => {
    if (!started) return;
    const colors = ['#ff00ff', '#00ffff', '#00ff00', '#ffff00', '#ff0000', '#0000ff'];
    const interval = setInterval(() => {
      document.body.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    }, 180);
    return () => {
      clearInterval(interval);
      document.body.style.backgroundColor = '';
    };
  }, [started]);

  function handleStart() {
    setStarted(true);
    fadeInAudio(audioRef.current, 0.7, 2500, 42);
    setTimeout(() => goToPage(0), 500);
  }

  function goToPage(idx: number) {
    if (idx < 0 || idx >= TOTAL_PAGES) return;
    setCurrentPage(idx);
  }

  // Keyboard & Touch navigation
  useEffect(() => {
    let touchStartX = 0;
    let touchStartY = 0;

    const ts = (e: TouchEvent) => {
      touchStartX = e.changedTouches[0].screenX;
      touchStartY = e.changedTouches[0].screenY;
    };

    const te = (e: TouchEvent) => {
      const dx = touchStartX - e.changedTouches[0].screenX;
      const dy = touchStartY - e.changedTouches[0].screenY;
      if (Math.abs(dx) < 50 || Math.abs(dx) < Math.abs(dy)) return;
      if (currentPage < 0) return;
      if (dx > 0 && currentPage < TOTAL_PAGES - 1) goToPage(currentPage + 1);
      else if (dx < 0 && currentPage > 0) goToPage(currentPage - 1);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)) return;
      if (!started) return;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        goToPage(Math.min(currentPage + 1, TOTAL_PAGES - 1));
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        goToPage(Math.max(currentPage - 1, 0));
      }
    };

    document.addEventListener('touchstart', ts, { passive: true });
    document.addEventListener('touchend', te, { passive: true });
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('touchstart', ts);
      document.removeEventListener('touchend', te);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [started, currentPage]);

  const pc = (idx: number) => currentPage === idx ? 'kicau-page active' : 'kicau-page';

  return (
    <div className="kicau-root">
      <style>{`
        .kicau-root {
          min-height: 100vh; min-height: 100dvh;
          width: 100%; height: 100%; flex: 1;
          display: flex; flex-direction: column;
          background: linear-gradient(45deg, #ff00ff, #00ffff, #00ff00, #ffff00, #ff0000);
          background-size: 400% 400%;
          animation: kicauRainbow 1.5s ease infinite;
          font-family: 'Comic Sans MS', 'Chalkboard SE', 'Comic Neue', sans-serif;
          overflow-x: hidden; color: #fff;
          position: relative;
        }
        @keyframes kicauRainbow {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        .kicau-bg-birds {
          position: absolute; inset: 0; width: 100%; height: 100%;
          pointer-events: none; overflow: hidden; z-index: 0;
        }
        .kicau-floating-bird {
          position: absolute;
          object-fit: contain;
          filter: drop-shadow(0 0 12px rgba(0, 255, 0, 0.9));
          user-select: none;
        }
        @keyframes birdFloat {
          0% { transform: translateY(0px) rotate(0deg) scale(1); }
          50% { transform: translateY(-25px) rotate(15deg) scale(1.1); }
          100% { transform: translateY(0px) rotate(0deg) scale(1); }
        }
        @keyframes birdBounce {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-40px) scale(1.2) rotate(-10deg); }
        }
        @keyframes birdSpinFloat {
          0% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-30px) rotate(180deg) scale(1.15); }
          100% { transform: translateY(0) rotate(360deg); }
        }

        .kicau-spin { animation: kicauSpin 0.6s linear infinite; }
        .kicau-shake { animation: kicauShake 0.12s linear infinite; }
        @keyframes kicauSpin { 100% { transform: rotate(360deg); } }
        @keyframes kicauShake {
          0% { transform: translate(4px,2px) rotate(0deg); }
          20% { transform: translate(-4px,0px) rotate(1deg); }
          40% { transform: translate(0px,4px) rotate(0deg); }
          60% { transform: translate(-4px,2px) rotate(0deg); }
          80% { transform: translate(-2px,-2px) rotate(1deg); }
          100% { transform: translate(2px,-4px) rotate(-1deg); }
        }

        .alay-text {
          text-transform: uppercase;
          text-shadow: 4px 4px 0 #000, -2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000;
          color: #00ff00; font-weight: 900;
        }

        .kicau-marquee {
          width: 100%; overflow: hidden; white-space: nowrap;
          font-size: 2.2rem; font-weight: bold;
          padding: 10px;
        }
        .kicau-marquee span {
          display: inline-block; padding-left: 100%;
          animation: kicauScroll 7s linear infinite;
        }
        @keyframes kicauScroll {
          0% { transform: translate(0,0); }
          100% { transform: translate(-100%,0); }
        }

        .kicau-page {
          position: absolute; inset: 0; width: 100%; height: 100%;
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          padding: 2rem; opacity: 0; visibility: hidden;
          transition: opacity 0.8s, visibility 0.8s, transform 0.8s, filter 0.8s;
          transform: scale(0.7) translateZ(-500px);
          filter: blur(10px); z-index: 10;
        }
        .kicau-page.active { opacity: 1; visibility: visible; transform: scale(1) translateZ(0); filter: blur(0); }

        .kicau-box {
          border: 15px ridge #ff00ff;
          background: rgba(0,0,0,0.85);
          padding: 30px; max-width: 480px; width: 100%;
          border-radius: 40px; text-align: center;
          box-shadow: 0 0 40px #00ff00;
        }
        .kicau-ending-box {
          border: 15px ridge #00ffff;
          background: rgba(0,0,0,0.9);
          padding: 25px 15px; max-width: 600px; width: 100%;
          height: 85vh; height: 85dvh;
          border-radius: 30px; text-align: center;
          box-shadow: 0 0 50px #ff00ff;
          display: flex; flex-direction: column;
          justify-content: space-between;
          overflow-y: auto;
        }

        .kicau-swipe { font-size: 0.8rem; color: yellow; margin-top: 1rem; text-shadow: 1px 1px black; animation: kicauBlink 1s infinite alternate; }
        @keyframes kicauBlink { from { opacity: 0.5; } to { opacity: 1; } }

        .kicau-dots { position: fixed; bottom: 2rem; left: 50%; transform: translateX(-50%); display: flex; gap: 8px; z-index: 99; }
        .kicau-dot { width: 10px; height: 10px; border-radius: 50%; background: rgba(255,255,255,0.4); border: 2px solid black; }
        .kicau-dot.active { background: #00ff00; width: 28px; border-radius: 99px; }

        .kicau-gacor-btn {
          padding: 12px 30px; font-size: 1.3rem; font-weight: bold;
          background-color: red; color: yellow;
          border: 4px solid green; border-radius: 20px;
          cursor: pointer; animation: kicauShake 0.2s infinite;
          box-shadow: 0 0 20px yellow;
        }

        .kicau-intro {
          position: absolute; inset: 0; width: 100%; height: 100%; z-index: 50;
          display: flex; align-items: center; justify-content: center;
          background: black; transition: all 1s; padding: 1rem;
        }
        .kicau-intro.hidden { opacity: 0; pointer-events: none; }

        .kicau-intro-btn {
          padding: 16px 32px; background: #e60000;
          color: #ffff00; font-weight: bold; font-size: clamp(2rem, 5vw, 3rem);
          border: 8px solid #00ff00; border-radius: 30px;
          cursor: pointer; transition: all 0.3s;
        }
        .kicau-intro-btn:hover { transform: scale(1.1); }

        .kicau-back {
          position: fixed; top: 16px; left: 16px; z-index: 99999;
          background-color: #000; color: #fff;
          padding: 8px 12px; border-radius: 8px;
          font-weight: bold; font-size: 14px;
          box-shadow: 0 4px 6px rgba(0,0,0,0.3);
          border: 2px solid #fff;
          display: flex; align-items: center; gap: 6px;
          text-decoration: none; font-family: sans-serif;
          cursor: pointer; transition: background-color 0.2s;
        }
        .kicau-back:hover { background: #333; }
      `}</style>

      {/* Scattered Floating Kicau Mania GIFs Background */}
      <div className="kicau-bg-birds">
        {floatingBirds.map((bird) => (
          <img
            key={bird.id}
            src="https://media.tenor.com/1MCucyOSJ54AAAAj/kicau-maniaa.gif"
            alt="Kicau Mania"
            className="kicau-floating-bird"
            style={{
              top: `${bird.top}%`,
              left: `${bird.left}%`,
              width: `${bird.size}px`,
              height: `${bird.size}px`,
              animation: `${bird.animType === 'float' ? 'birdFloat' : bird.animType === 'bounce' ? 'birdBounce' : 'birdSpinFloat'} ${bird.duration}s infinite ease-in-out ${bird.delay}s`,
              transform: `rotate(${bird.rotation}deg)`,
            }}
          />
        ))}
      </div>

      <UniversalMusicPlayer musicUrl={musicUrl} isPlaying={started} startTime={42} />

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

      {started && (
        <div className="kicau-dots">
          {Array.from({ length: TOTAL_PAGES }).map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => goToPage(i)}
              className={`kicau-dot cursor-pointer border-none outline-none transition-all hover:scale-125 ${currentPage === i ? 'active' : ''}`}
              title={`Ke Halaman ${i + 1}`}
            />
          ))}
        </div>
      )}

      {/* Intro Screen */}
      <div className={`kicau-intro ${started ? 'hidden' : ''}`} onClick={handleStart}>
        <button className="kicau-intro-btn kicau-shake" onClick={handleStart}>
          KLIK DISINI BOS! 🦜✨
        </button>
      </div>

      {/* Page 1 */}
      <div className={pc(0)}>
        <div className="kicau-box">
          <h1 className="alay-text kicau-shake" style={{ fontSize: 'clamp(2.2rem, 5vw, 3.5rem)', color: '#ffff00', marginBottom: 15 }}>
            SALAM KICAU MANIA! 🦜🔥
          </h1>
          <p style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#fff', textShadow: '2px 2px #000', marginBottom: 20 }}>
            Spesial buat sahabat gacor kita: <span style={{ color: '#00ffff', textDecoration: 'underline' }}>{recipientName}</span>!
          </p>
          <img
            src={birdImgs[0]}
            alt="Burung Kicau"
            className="kicau-spin"
            style={{ width: 140, height: 140, borderRadius: '50%', border: '6px solid #00ff00', margin: '0 auto 20px', display: 'block' }}
          />
          <button className="kicau-gacor-btn" onClick={() => goToPage(1)}>
            LANJUT GACOR! ➡️
          </button>
          <div className="kicau-swipe">👉 Geser / Klik panah kanan untuk lanjut</div>
        </div>
      </div>

      {/* Page 2 */}
      <div className={pc(1)}>
        <div className="kicau-box">
          <h2 className="alay-text kicau-shake" style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', color: '#00ffff', marginBottom: 15 }}>
            SPEK GANTANGAN NO 1! 🏆
          </h2>
          <p style={{ fontSize: '1.1rem', color: '#ffff00', textShadow: '2px 2px #000', marginBottom: 20 }}>
            Suara lantang, isian variasi roll tembak, mental juara bertahan tanpa ada lawan!
          </p>
          <img
            src={birdImgs[1] || birdImgs[0]}
            alt="Meme Kicau"
            className="kicau-shake"
            style={{ width: 160, height: 160, borderRadius: 20, border: '6px solid #ff00ff', margin: '0 auto 20px', display: 'block' }}
          />
          <button className="kicau-gacor-btn" onClick={() => goToPage(2)}>
            CEK DOA GACOR! ➡️
          </button>
        </div>
      </div>

      {/* Page 3 */}
      <div className={pc(2)}>
        <div className="kicau-box">
          <h2 className="alay-text kicau-shake" style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', color: '#ff00ff', marginBottom: 15 }}>
            DOA & HARAPAN 🤲🔥
          </h2>
          <div style={{ fontSize: '1rem', background: '#000', padding: 15, borderRadius: 15, border: '3px dashed #00ff00', marginBottom: 20, textAlign: 'left' }}>
            <p style={{ color: '#00ff00', marginBottom: 10 }}>✅ Panjang Umur & Sehat Selalu</p>
            <p style={{ color: '#ffff00', marginBottom: 10 }}>✅ Rezeki Gacor Tanpa Batas</p>
            <p style={{ color: '#00ffff' }}>✅ Selalu Jadi Sang Juara!</p>
          </div>
          <button className="kicau-gacor-btn" onClick={() => goToPage(3)}>
            LIHAT UCAPAN UTAMA! 🎬
          </button>
        </div>
      </div>

      {/* Page 4: Final Messages */}
      <div className={pc(3)}>
        <div className="kicau-ending-box">
          <div className="kicau-marquee">
            <span>
              🎉 HAPPY BIRTHDAY {recipientName.toUpperCase()}! 🦜 SALAM SATU HOBI KICAU MANIA GACOR PARAH! 🏆
            </span>
          </div>

          <div style={{ padding: '10px 0' }}>
            <h2 className="alay-text kicau-shake" style={{ fontSize: '1.8rem', color: '#ffff00', marginBottom: 15 }}>
              SEBUAH PESAN:
            </h2>
            {finalMessages.map((msg, i) => (
              <p
                key={i}
                style={{
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  color: i % 2 === 0 ? '#00ffff' : '#ff00ff',
                  textShadow: '2px 2px #000',
                  background: 'rgba(255,255,255,0.1)',
                  padding: 10,
                  borderRadius: 12,
                  marginBottom: 10,
                }}
              >
                {msg}
              </p>
            ))}
          </div>

          <div style={{ marginTop: 15 }}>
            <button
              className="kicau-gacor-btn"
              onClick={() => goToPage(0)}
              style={{ fontSize: '1rem', padding: '10px 20px' }}
            >
              🔄 ULANGI DARI AWAL
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
