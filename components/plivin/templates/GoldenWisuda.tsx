'use client';

import { useState, useRef, useEffect } from 'react';
import { TemplateProps } from '@type/gift';
import UniversalMusicPlayer from '@components/plivin/common/UniversalMusicPlayer';
import Link from 'next/link';
import Image from 'next/image';
import { fadeInAudio } from '@lib/audio-utils';

/* ============================================================
   Golden Wisuda — Elegant graduation ceremony template
   Migrated from template-graduation.html
   ============================================================ */

interface PageData {
  title: string;
  subtitle: string;
  paragraph: string;
  photo: string;
}

export default function GoldenWisuda({
  recipientName = 'Nadia, S.Kom.',
  greetingText = '',
  photos = [],
  musicUrl = '/music/overjoyed.mp3',
  showBackButton = true,
}: TemplateProps) {
  const [started, setStarted] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const photoUrl = photos.length > 0 ? photos[0] : 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=600';

  const message = greetingText ||
    `Akhirnya sampai juga di hari ini. Setelah semua tugas, revisi, begadang, dan momen-momen yang kadang bikin pengen nyerah, semuanya terbayar dengan melihat kamu berdiri pakai toga hari ini.\n\nAku ikut senang dan bangga banget sama pencapaianmu. Semoga apa yang sudah kamu pelajari bisa jadi bekal yang baik untuk langkah-langkah berikutnya, dan semoga semua hal yang kamu cita-citakan pelan-pelan bisa terwujud.\n\nSelamat ya, kamu keren. ❤️`;

  function handleStart() {
    fadeInAudio(audioRef.current, 0.8, 2500, 17);
    setStarted(true);
    setTimeout(() => setRevealed(true), 300);
  }

  // Simple confetti effect
  useEffect(() => {
    if (!started) return;
    const canvas = document.createElement('canvas');
    canvas.id = 'golden-confetti';
    canvas.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:100;';
    document.body.appendChild(canvas);
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const colors = ['#FBBF24', '#F59E0B', '#ffffff', '#E0A96D', '#D97706'];
    const particles: Array<{x:number;y:number;vx:number;vy:number;s:number;c:string;r:number;vr:number;life:number}> = [];

    function spawnBurst() {
      for (let i = 0; i < 60; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height * 0.5,
          vx: (Math.random() - 0.5) * 4,
          vy: Math.random() * 2 + 1,
          s: Math.random() * 6 + 3,
          c: colors[Math.floor(Math.random() * colors.length)],
          r: Math.random() * 360,
          vr: (Math.random() - 0.5) * 10,
          life: 200 + Math.random() * 200,
        });
      }
    }

    let animId: number;
    let frame = 0;
    function animate() {
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.03;
        p.r += p.vr;
        p.life--;
        if (p.life <= 0 || p.y > canvas.height) {
          particles.splice(i, 1);
          continue;
        }
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.r * Math.PI) / 180);
        ctx.fillStyle = p.c;
        ctx.globalAlpha = Math.min(p.life / 50, 1);
        ctx.fillRect(-p.s / 2, -p.s / 2, p.s, p.s);
        ctx.restore();
      }
      frame++;
      if (frame < 600 && frame % 40 === 0) spawnBurst();
      if (particles.length > 0 || frame < 600) {
        animId = requestAnimationFrame(animate);
      }
    }

    spawnBurst();
    animate();

    return () => {
      cancelAnimationFrame(animId);
      const el = document.getElementById('golden-confetti');
      if (el) el.remove();
    };
  }, [started]);

  return (
    <div className="gw-root">
      <style>{`
        .gw-root {
          min-height: 100vh; min-height: 100dvh;
          width: 100%; height: 100%; flex: 1;
          display: flex; flex-direction: column;
          background-color: #ffffff; color: #18181b;
          overflow-x: hidden; position: relative;
          font-family: 'Montserrat', sans-serif;
        }

        .gw-gold-gradient {
          background: linear-gradient(to right, #FBBF24, #F59E0B, #D97706);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
        }
        .gw-gold-border { border-image: linear-gradient(to bottom right, #FBBF24, #D97706) 1; }

        .gw-reveal { opacity: 0; transform: translateY(30px); transition: all 1.2s cubic-bezier(0.165,0.84,0.44,1); }
        .gw-reveal.active { opacity: 1; transform: translateY(0); }

        /* Aurora BG */
        .gw-aurora { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; z-index: 0; pointer-events: none; overflow: hidden; }
        .gw-aurora-blob { position: absolute; border-radius: 50%; filter: blur(100px); opacity: 0.25; animation: gwAurora 25s infinite alternate ease-in-out; }
        .gw-aurora-1 { top: -10%; left: -10%; width: 70vw; height: 70vw; background: radial-gradient(circle, rgba(251,191,36,0.45) 0%, rgba(217,119,6,0) 70%); animation-duration: 20s; }
        .gw-aurora-2 { bottom: -15%; right: -10%; width: 80vw; height: 80vw; background: radial-gradient(circle, rgba(245,158,11,0.4) 0%, rgba(251,191,36,0) 70%); animation-duration: 28s; animation-delay: -5s; }
        .gw-aurora-3 { top: 35%; left: 20%; width: 60vw; height: 60vw; background: radial-gradient(circle, rgba(251,191,36,0.3) 0%, rgba(245,158,11,0) 70%); animation-duration: 24s; animation-delay: -10s; }
        @keyframes gwAurora {
          0% { transform: translate(0,0) scale(1) rotate(0deg); }
          50% { transform: translate(8%,12%) scale(1.15) rotate(180deg); }
          100% { transform: translate(-5%,-8%) scale(0.9) rotate(360deg); }
        }

        .gw-intro {
          position: fixed; inset: 0; z-index: 50;
          display: flex; align-items: center; justify-content: center;
          background: white; transition: opacity 1s;
        }
        .gw-intro.hidden { opacity: 0; pointer-events: none; }

        .gw-start-btn {
          position: relative; border: 2px solid #F59E0B;
          color: #D97706; padding: 20px 40px;
          background: transparent; font-family: 'Cinzel', serif;
          letter-spacing: 0.3em; text-transform: uppercase;
          font-size: 0.875rem; font-weight: 700;
          cursor: pointer; transition: all 0.5s;
        }
        .gw-start-btn:hover { background: #F59E0B; color: white; }

        .gw-music-btn {
          position: fixed; top: 24px; right: 24px; z-index: 50;
          background: rgba(255,255,255,0.9);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(245,158,11,0.3);
          color: #D97706; padding: 10px 20px;
          border-radius: 999px; font-weight: 500;
          box-shadow: 0 0 20px rgba(245,158,11,0.15);
          cursor: pointer; transition: all 0.3s;
          font-family: 'Cinzel', serif;
          font-size: 0.75rem; letter-spacing: 0.1em; text-transform: uppercase;
          display: flex; align-items: center; gap: 8px;
        }
        .gw-music-btn:hover { background: #F59E0B; color: white; }

        .gw-back {
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
        .gw-back:hover { background: #333; }

        .gw-corner { position: absolute; width: 40px; height: 40px; }
        .gw-corner-tl { top: 16px; left: 16px; border-top: 1px solid #F59E0B; border-left: 1px solid #F59E0B; }
        .gw-corner-tr { top: 16px; right: 16px; border-top: 1px solid #F59E0B; border-right: 1px solid #F59E0B; }
        .gw-corner-bl { bottom: 16px; left: 16px; border-bottom: 1px solid #F59E0B; border-left: 1px solid #F59E0B; }
        .gw-corner-br { bottom: 16px; right: 16px; border-bottom: 1px solid #F59E0B; border-right: 1px solid #F59E0B; }

        @media (max-width: 640px) {
          .gw-cert { padding: 1.5rem !important; }
        }
      `}</style>

      {/* eslint-disable-next-line @next/next/no-page-custom-font */}
      <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Montserrat:wght@300;400;500;600&display=swap" rel="stylesheet" />

      <UniversalMusicPlayer musicUrl={musicUrl} isPlaying={started} startTime={17} />

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

      {/* Aurora BG */}
      <div className="gw-aurora">
        <div className="gw-aurora-blob gw-aurora-1" />
        <div className="gw-aurora-blob gw-aurora-2" />
        <div className="gw-aurora-blob gw-aurora-3" />
      </div>

      {/* Intro Screen */}
      <div className={`gw-intro ${started ? 'hidden' : ''}`}>
        <div style={{ textAlign: 'center', position: 'relative' }}>
          <div style={{ position: 'absolute', inset: -40, background: 'rgba(245,158,11,0.2)', filter: 'blur(48px)', borderRadius: '50%' }} />
          <button className="gw-start-btn" onClick={handleStart}>
            Buka Dong
          </button>
        </div>
      </div>

      {/* Main Content */}
      <main style={{ opacity: started ? 1 : 0, transition: 'opacity 1s' }}>
        {/* Hero Section */}
        <section style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: '0 24px', position: 'relative' }}>
          {/* Corner decorations */}
          <div style={{ position: 'absolute', top: 40, left: 40, width: 80, height: 80, borderTop: '2px solid rgba(245,158,11,0.3)', borderLeft: '2px solid rgba(245,158,11,0.3)' }} />
          <div style={{ position: 'absolute', bottom: 40, right: 40, width: 80, height: 80, borderBottom: '2px solid rgba(245,158,11,0.3)', borderRight: '2px solid rgba(245,158,11,0.3)' }} />

          <p className={`gw-reveal ${revealed ? 'active' : ''}`} style={{ fontFamily: "'Cinzel', serif", color: '#D97706', letterSpacing: '0.4em', textTransform: 'uppercase', fontSize: '0.875rem', marginBottom: 24, fontWeight: 700 }}>
            Class of 2026
          </p>
          <h1 className={`gw-reveal ${revealed ? 'active' : ''} gw-gold-gradient`} style={{ fontFamily: "'Cinzel', serif", fontSize: 'clamp(2.5rem, 7vw, 5rem)', marginBottom: 24, fontWeight: 700, lineHeight: 1.15 }}>
            Happy Sidang Skripsi
          </h1>
          <p className={`gw-reveal ${revealed ? 'active' : ''}`} style={{ color: '#52525b', maxWidth: 512, fontSize: '1.1rem', fontWeight: 500, lineHeight: 1.6 }}>
            &ldquo;Keberhasilan bukanlah akhir dari perjalanan, melainkan awal dari babak baru yang lebih besar.&rdquo;
          </p>

          <div style={{ position: 'absolute', bottom: 40, fontSize: '1.5rem', color: '#F59E0B', animation: 'gwBounce 1s infinite alternate' }}>↓</div>
          <style>{`@keyframes gwBounce { from { transform: translateY(0); } to { transform: translateY(-10px); } }`}</style>
        </section>

        {/* Certificate Section */}
        <section style={{ minHeight: '100vh', padding: '80px 16px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', zIndex: 10 }}>
          <div className="gw-cert" style={{ width: '100%', maxWidth: 896, background: '#fafaf9', borderWidth: 3, borderStyle: 'solid', borderImage: 'linear-gradient(to bottom right, #FBBF24, #D97706) 1', padding: '24px 40px', textAlign: 'center', position: 'relative', boxShadow: '0 0 50px rgba(245,158,11,0.15)' }}>
            {/* Corners */}
            <div className="gw-corner gw-corner-tl" />
            <div className="gw-corner gw-corner-tr" />
            <div className="gw-corner gw-corner-bl" />
            <div className="gw-corner gw-corner-br" />

            <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: 'clamp(1.5rem, 4vw, 2.5rem)', color: '#D97706', marginBottom: 40, letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 700 }}>
              Certificate of Pride
            </h2>

            {/* Photo */}
            <div style={{ margin: '0 auto 40px', width: '100%', maxWidth: 256, aspectRatio: '3/4', padding: 8, border: '1px solid rgba(245,158,11,0.5)', background: 'white', position: 'relative' }}>
              <Image src={photoUrl} alt="Graduation" fill style={{ objectFit: 'cover' }} unoptimized />
            </div>

            <h3 style={{ fontFamily: "'Cinzel', serif", fontSize: 'clamp(1.8rem, 5vw, 3rem)', color: '#18181b', marginBottom: 16, fontWeight: 700 }}>
              {recipientName}
            </h3>

            <div style={{ height: 1, width: 256, background: 'rgba(245,158,11,0.5)', margin: '0 auto 32px' }} />

            <div style={{ maxWidth: 672, margin: '0 auto' }}>
              {message.split('\n').filter(l => l.trim()).map((para, i) => (
                <p key={i} style={{ color: '#3f3f46', lineHeight: 2, fontWeight: 500, fontSize: 'clamp(0.875rem, 2vw, 1.1rem)', marginBottom: 16 }}>
                  {para}
                </p>
              ))}
            </div>
          </div>
        </section>

        <footer style={{ padding: '40px 0', textAlign: 'center', color: '#a1a1aa', fontFamily: "'Cinzel', serif", fontSize: '0.875rem', letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 700 }}>
          Plivinco ✦ 2026
        </footer>
      </main>
    </div>
  );
}
