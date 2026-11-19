'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { TemplateProps } from '@type/gift';
import UniversalMusicPlayer from '@components/plivin/common/UniversalMusicPlayer';
import Image from 'next/image';

export default function JourneyTimeline({
  recipientName = 'Keke & Farhan',
  greetingText = '',
  photos = [],
  musicUrl = 'https://www.youtube.com/watch?v=1MWVotVdHGg',
  showBackButton = true,
}: TemplateProps) {
  const [started, setStarted] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeChapter, setActiveChapter] = useState(0);
  const [zoomedPhoto, setZoomedPhoto] = useState<{ url: string; title: string; chapter: string } | null>(null);

  const timelineRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const defaultPhotos = [
    'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1494774157365-9e04c6720e47?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?q=80&w=800&auto=format&fit=crop',
  ];

  const storyPhotos = photos.length > 0 ? photos : defaultPhotos;

  const chapters = [
    {
      id: 'bab-1',
      chapter: 'Bab 1',
      title: 'Awal Bertemu',
      subtitle: 'Ketika Takdir Mempertemukan Dua Jiwa',
      icon: '✨',
      body: greetingText ? greetingText.split('\n')[0] || 'Masih jelas di ingatanku, hari di mana tatapan kita pertama kali bertemu. Kamu hadir membawa secercah cahaya di saat duniaku sedang redup.' : 'Masih jelas di ingatanku, hari di mana tatapan kita pertama kali bertemu. Kamu hadir membawa secercah cahaya di saat duniaku sedang redup. Walau awalnya penuh keraguan, senyummu perlahan meyakinkanku bahwa ada cinta yang pantas untuk diperjuangkan.',
      image: storyPhotos[0] || defaultPhotos[0],
      quote: '“Tatapan pertama yang mengubah alur hidupku selamanya.”',
    },
    {
      id: 'bab-2',
      chapter: 'Bab 2',
      title: 'Melewati Badai',
      subtitle: 'Kuat Bersama di Tengah Gelombang',
      icon: '⛈️',
      body: greetingText ? greetingText.split('\n')[1] || 'Kita tidak selalu berjalan di jalan yang mulus. Ada hari-hari di mana ego kita saling bertabrakan. Tapi dari semua rasa sakit itu, aku belajar bahwa aku lebih memilih menangis bersamamu.' : 'Kita tidak selalu berjalan di jalan yang mulus. Ada hari-hari di mana ego kita saling bertabrakan, ada malam-malam yang dihabiskan dengan tangisan dan kesunyian. Tapi dari semua rasa sakit itu, aku belajar satu hal: seberat apapun ujiannya, aku lebih memilih menangis bersamamu daripada harus tertawa dengan orang lain.',
      image: storyPhotos[1] || defaultPhotos[1],
      quote: '“Setiap badai justru membuat akar cinta kita tertancap semakin dalam.”',
    },
    {
      id: 'bab-3',
      chapter: 'Bab 3',
      title: 'Titik Terendah',
      subtitle: 'Penerimaan Tanpa Syarat',
      icon: '🥺',
      body: greetingText ? greetingText.split('\n')[2] || 'Pernah ada waktu di mana aku merasa tidak pantas untukmu. Tapi kamu menatap mataku dan mencintaiku tanpa syarat.' : 'Pernah ada waktu di mana aku merasa tidak pantas untukmu. Aku melihat semua kekuranganku dan berpikir kamu layak mendapatkan yang lebih baik. Tapi kamu menatap mataku, menghapus air mataku, dan berkata bahwa kamu mencintaiku tanpa syarat.',
      image: storyPhotos[2] || defaultPhotos[2],
      quote: '“Di saat duniaku hancur, pelukanmu adalah tempat paling aman di bumi.”',
    },
    {
      id: 'bab-4',
      chapter: 'Hari Ini',
      title: 'Kasih Putih',
      subtitle: 'Melangkah Bersama Selamanya',
      icon: '🤍',
      body: greetingText ? greetingText.split('\n')[3] || `Hari ini, melihat sejauh apa kita telah melangkah untuk ${recipientName}, hatiku dipenuhi rasa syukur yang tak terhingga. Berjanjilah untuk selalu ada.` : `Hari ini, melihat sejauh apa kita telah melangkah untuk ${recipientName}, hatiku dipenuhi rasa syukur yang tak terhingga. Semua luka, tawa, air mata, dan kebahagiaan telah membentuk kita menjadi sepasang manusia yang tak terpisahkan. Berjanjilah untuk selalu ada.`,
      image: storyPhotos[3] || defaultPhotos[3],
      quote: '“Untuk kemarin, hari ini, dan setiap esok yang belum kita lewati... aku memilihmu.”',
    },
  ];

  // Physics-based Pink Love Confetti Blast shooting from bottom up!
  const launchPinkLoveConfetti = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const colors = ['#f52a65', '#ff5c8a', '#ff9cb3', '#fda4af', '#f43f5e', '#fb7185', '#e11d48', '#ffffff'];
    const loveEmojis = ['💖', '💕', '❤️', '🌹', '🌸', '✨', '💘', '💓', '💗', '💌'];

    // 150 pink confetti particles + 25 love emojis shooting UP from the bottom!
    const particles = Array.from({ length: 175 }, (_, i) => {
      const isEmoji = i < 25;
      return {
        x: Math.random() * canvas.width,
        y: canvas.height + Math.random() * 40,
        w: isEmoji ? 26 : Math.random() * 10 + 6,
        h: isEmoji ? 26 : Math.random() * 14 + 8,
        color: colors[Math.floor(Math.random() * colors.length)],
        emoji: isEmoji ? loveEmojis[Math.floor(Math.random() * loveEmojis.length)] : null,
        vx: (Math.random() - 0.5) * 14,
        vy: Math.random() * -12 - 14, // Shoot upwards!
        gravity: 0.3,
        rotation: Math.random() * 360,
        rotSpeed: (Math.random() - 0.5) * 12,
        opacity: 1,
        shape: Math.random() > 0.4 ? 'rect' : 'circle',
      };
    });

    const startTime = Date.now();

    const render = () => {
      const elapsed = Date.now() - startTime;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      let alive = false;
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += p.gravity;
        p.vx *= 0.985;
        p.rotation += p.rotSpeed;

        if (elapsed > 2200) {
          p.opacity -= 0.02;
        }

        if (p.opacity > 0 && p.y < canvas.height + 60) {
          alive = true;
          ctx.save();
          ctx.globalAlpha = Math.max(0, p.opacity);
          ctx.translate(p.x, p.y);
          ctx.rotate((p.rotation * Math.PI) / 180);

          if (p.emoji) {
            ctx.font = `${p.w}px sans-serif`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(p.emoji, 0, 0);
          } else {
            ctx.fillStyle = p.color;
            if (p.shape === 'rect') {
              ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
            } else {
              ctx.beginPath();
              ctx.arc(0, 0, p.w / 2, 0, Math.PI * 2);
              ctx.fill();
            }
          }
          ctx.restore();
        }
      });

      if (alive && elapsed < 4500) {
        requestAnimationFrame(render);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    };

    render();
  }, []);

  const handleStart = () => {
    setStarted(true);
    launchPinkLoveConfetti();
  };

  const scrollToChapter = (idx: number) => {
    setActiveChapter(idx);
    const elem = document.getElementById(`chapter-${idx}`);
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  useEffect(() => {
    if (!started) return;
    function handleScroll() {
      if (!timelineRef.current) return;
      const rect = timelineRef.current.getBoundingClientRect();
      const windowH = window.innerHeight;
      const totalH = rect.height;
      const scrolled = windowH / 2 - rect.top;
      const pct = Math.max(0, Math.min(100, (scrolled / totalH) * 100));
      setScrollProgress(pct);

      // Determine active chapter based on scroll position
      chapters.forEach((_, i) => {
        const elem = document.getElementById(`chapter-${i}`);
        if (elem) {
          const eRect = elem.getBoundingClientRect();
          if (eRect.top <= windowH * 0.6 && eRect.bottom >= windowH * 0.3) {
            setActiveChapter(i);
          }
        }
      });
    }
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [started]);

  return (
    <div className="jt-root">
      <style>{`
        .jt-root {
          min-height: 100vh; min-height: 100dvh;
          width: 100%; height: 100%; flex: 1;
          display: flex; flex-direction: column;
          background-color: #fffdfd; color: #334155;
          overflow-x: hidden; position: relative; font-family: 'Plus Jakarta Sans', sans-serif;
        }

        .jt-mesh {
          position: fixed; inset: 0; width: 100%; height: 100%; z-index: 0; pointer-events: none;
          background-image: 
            radial-gradient(at 0% 0%, rgba(255,156,179,0.18) 0px, transparent 50%),
            radial-gradient(at 100% 0%, rgba(245,42,101,0.12) 0px, transparent 50%),
            radial-gradient(at 100% 100%, rgba(255,156,179,0.18) 0px, transparent 50%),
            radial-gradient(at 0% 100%, rgba(245,42,101,0.12) 0px, transparent 50%);
        }

        .jt-title-grad {
          background: linear-gradient(135deg, #ff5c8a, #f52a65, #d9114d);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
        }

        .jt-glass {
          background: rgba(255,255,255,0.85);
          backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(255,156,179,0.45);
          box-shadow: 0 12px 35px rgba(245,42,101,0.08);
          border-radius: 28px; padding: 2.2rem; transition: all 0.4s ease;
        }
        .jt-glass:hover {
          transform: translateY(-4px);
          box-shadow: 0 22px 45px rgba(245,42,101,0.14);
          border-color: rgba(245,42,101,0.6);
        }

        .jt-polaroid {
          background: white; padding: 12px 12px 28px 12px;
          box-shadow: 0 12px 30px rgba(0,0,0,0.12);
          transform: rotate(-2.5deg); border: 1px solid #f1f5f9;
          border-radius: 8px; transition: all 0.3s ease;
          cursor: pointer;
        }
        .jt-polaroid:hover {
          transform: rotate(0deg) scale(1.03);
          box-shadow: 0 16px 36px rgba(245,42,101,0.2);
        }

        .jt-intro {
          position: fixed; inset: 0; z-index: 50;
          display: flex; align-items: center; justify-content: center;
          background: rgba(255,255,255,0.95); backdrop-filter: blur(16px);
          transition: opacity 1s; padding: 1.5rem;
        }
        .jt-intro.hidden { opacity: 0; pointer-events: none; }

        .jt-start-btn {
          padding: 18px 44px; background: linear-gradient(135deg, #f52a65, #d9114d);
          color: white; font-weight: 700; font-size: 1.15rem; border-radius: 9999px;
          border: none; cursor: pointer; transition: all 0.3s;
          box-shadow: 0 12px 25px rgba(245,42,101,0.35);
        }
        .jt-start-btn:hover { transform: scale(1.06); box-shadow: 0 16px 32px rgba(245,42,101,0.45); }

        /* Fixed Timeline Line Position (Always on the left, clear of cards) */
        .jt-timeline-line {
          position: absolute; top: 0; bottom: 0; left: 24px;
          width: 3px; background: rgba(245,42,101,0.15); z-index: 0;
          border-radius: 4px;
        }
        .jt-timeline-prog {
          position: absolute; top: 0; left: 24px;
          width: 4px; background: linear-gradient(to bottom, #ff9cb3, #f52a65);
          box-shadow: 0 0 15px rgba(245,42,101,0.4);
          border-radius: 4px; z-index: 1; transition: height 0.1s ease-out;
          transform: translateX(-0.5px);
        }

        @media (min-width: 768px) {
          .jt-timeline-line, .jt-timeline-prog { left: 32px; }
        }
      `}</style>

      {/* eslint-disable-next-line @next/next/no-page-custom-font */}
      <link href="https://fonts.googleapis.com/css2?family=Playfair Display:ital,wght@0,600;0,700;1,400&family=Plus+Jakarta+Sans:wght@400;600;700&display=swap" rel="stylesheet" />

      {/* Real HTML5 Canvas Physics Pink Confetti + Love Emoji Burst */}
      <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-[100] w-full h-full" />

      {/* Mesh gradient background */}
      <div className="jt-mesh" />

      {/* Universal YouTube Music Player with StartTime 49s */}
      <UniversalMusicPlayer musicUrl={musicUrl} isPlaying={started} startTime={49} />

      {/* Fullscreen Photo Zoom Modal */}
      {zoomedPhoto && (
        <div
          className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setZoomedPhoto(null)}
        >
          <div
            className="max-w-xl w-full bg-white p-4 rounded-3xl shadow-2xl relative flex flex-col items-center animate-fade-in"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setZoomedPhoto(null)}
              className="absolute top-3 right-3 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-lg cursor-pointer"
            >
              ✕
            </button>
            <div className="w-full aspect-[4/3] relative rounded-2xl overflow-hidden mb-3 border border-slate-100">
              <Image src={zoomedPhoto.url} alt={zoomedPhoto.title} fill className="object-cover" unoptimized />
            </div>
            <span className="text-pink-600 font-bold text-xs uppercase tracking-widest mb-1">{zoomedPhoto.chapter}</span>
            <h3 style={{ fontFamily: "'Playfair Display', serif" }} className="text-xl font-bold text-slate-800 mb-2">
              {zoomedPhoto.title}
            </h3>
            <p className="text-xs text-slate-500 italic text-center px-4">“Momen berharga yang terpatri abadi di memori kita.”</p>
          </div>
        </div>
      )}

      {/* Navigation Buttons (Kembali & Refresh) */}
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

      {/* Sticky Chapter Quick Navigation Pills (When Started) */}
      {started && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-white/85 backdrop-blur-md border border-pink-200/80 px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1 max-w-[92vw] overflow-x-auto">
          {chapters.map((ch, i) => (
            <button
              key={i}
              type="button"
              onClick={() => scrollToChapter(i)}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                activeChapter === i
                  ? 'bg-pink-600 text-white shadow-md scale-105'
                  : 'text-slate-600 hover:bg-pink-50 hover:text-pink-600'
              }`}
            >
              {ch.icon} {ch.chapter}
            </button>
          ))}
          <button
            type="button"
            onClick={launchPinkLoveConfetti}
            className="ml-1 px-2.5 py-1 rounded-full bg-pink-100 text-pink-600 hover:bg-pink-200 text-xs font-bold cursor-pointer transition-all flex items-center gap-1"
            title="Sebar Cinta"
          >
            ❤️
          </button>
        </div>
      )}

      {/* Intro Screen */}
      <div className={`jt-intro ${started ? 'hidden' : ''}`}>
        <div className="text-center max-w-md mx-auto">
          <div className="text-6xl mb-6 animate-bounce">💌</div>
          <h2 style={{ fontFamily: "'Playfair Display', serif" }} className="text-3xl font-bold text-slate-800 mb-3">
            Kisah Perjalanan
          </h2>
          <p className="text-slate-500 text-sm mb-8 leading-relaxed">
            Pesan dan kenangan indah spesial disajikan untuk <span className="text-pink-600 font-bold">{recipientName}</span>.
          </p>
          <button className="jt-start-btn" onClick={handleStart}>
            ✨ Buka Lembaran Kisah
          </button>
        </div>
      </div>

      {started && (
        <>
          {/* Hero Section */}
          <section className="min-h-screen flex flex-col justify-center items-center text-center px-6 relative z-10">
            <span className="text-xs font-bold tracking-widest text-pink-600 uppercase mb-3 bg-pink-50 px-4 py-1.5 rounded-full border border-pink-200">
              MEMORI TERINDAH
            </span>
            <h1
              className="jt-title-grad"
              style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(2.5rem, 8vw, 5rem)', fontWeight: 700, marginBottom: 24, lineHeight: 1.15 }}
            >
              Perjalanan Kita
            </h1>
            <p
              style={{ fontFamily: "'Playfair Display', serif", fontStyle: 'italic', fontSize: 'clamp(1.1rem, 3vw, 1.5rem)', color: '#64748b', maxWidth: 672, margin: '0 auto', lineHeight: 1.6 }}
            >
              &ldquo;Setiap tetes air mata dan senyuman bersamamu adalah puisi yang tak pernah selesai kutulis...&rdquo;
            </p>
            <div className="mt-12 flex items-center gap-3">
              <button
                type="button"
                onClick={launchPinkLoveConfetti}
                className="px-5 py-2.5 rounded-full bg-pink-500 hover:bg-pink-600 text-white font-bold text-xs tracking-wider shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center gap-2"
              >
                ❤️ SEBAR CINTA
              </button>
              <button
                type="button"
                onClick={() => scrollToChapter(0)}
                className="px-5 py-2.5 rounded-full bg-white border border-pink-200 hover:border-pink-400 text-pink-600 font-bold text-xs tracking-wider shadow-sm transition-all cursor-pointer"
              >
                MULAI BACA ↓
              </button>
            </div>
          </section>

          {/* Timeline Section */}
          <section ref={timelineRef} className="relative z-10 max-w-4xl mx-auto px-4 md:px-8 py-20">
            {/* Vertical Timeline Progress Bar */}
            <div className="jt-timeline-line" />
            <div className="jt-timeline-prog" style={{ height: `${scrollProgress}%` }} />

            {chapters.map((ch, i) => (
              <div
                key={i}
                id={`chapter-${i}`}
                className="flex flex-col mb-16 md:mb-24 relative pl-12 md:pl-16"
              >
                {/* Node Icon Circle Badge on the left timeline line */}
                <div className="absolute left-[24px] md:left-[32px] top-6 -translate-x-1/2 w-10 h-10 rounded-full bg-white border-2 border-pink-500 shadow-md flex items-center justify-center text-base z-10">
                  {ch.icon}
                </div>

                {/* Chapter Card Content Box */}
                <div className="jt-glass w-full">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-pink-600 font-extrabold tracking-widest text-xs uppercase bg-pink-100/70 px-3 py-1 rounded-full">
                      {ch.chapter}
                    </span>
                    <span className="text-xs font-semibold text-slate-400 font-mono">STEP {i + 1}/4</span>
                  </div>

                  <h2 style={{ fontFamily: "'Playfair Display', serif" }} className="text-2xl md:text-3xl font-bold text-slate-800 mb-1">
                    {ch.title}
                  </h2>
                  <p className="text-xs font-semibold text-pink-500 mb-4">{ch.subtitle}</p>

                  <p className="text-slate-600 leading-relaxed text-sm md:text-base mb-6 font-normal">
                    {ch.body}
                  </p>

                  {/* Quote highlight card */}
                  <div className="bg-pink-50/70 border-l-4 border-pink-500 p-3 rounded-r-xl mb-6 text-xs md:text-sm text-pink-900 italic font-medium">
                    {ch.quote}
                  </div>

                  {/* Interactive Polaroid Photo Frame */}
                  <div
                    className="jt-polaroid w-full max-w-sm mx-auto"
                    onClick={() => setZoomedPhoto({ url: ch.image, title: ch.title, chapter: ch.chapter })}
                    title="Klik untuk memperbesar foto"
                  >
                    <div className="w-full aspect-[4/3] relative overflow-hidden rounded-md group">
                      <Image
                        src={ch.image}
                        alt={ch.title}
                        width={360}
                        height={270}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        unoptimized
                      />
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold gap-1 backdrop-blur-[2px]">
                        🔍 Klik untuk perbesar
                      </div>
                    </div>
                    <p className="text-center text-xs font-bold text-slate-500 mt-2 font-mono">{ch.title}</p>
                  </div>
                </div>
              </div>
            ))}
          </section>

          <footer className="text-center py-16 relative z-10 text-slate-400 text-xs font-medium">
            Dibuat dengan segenap cinta untuk {recipientName} 🤍
          </footer>
        </>
      )}
    </div>
  );
}
