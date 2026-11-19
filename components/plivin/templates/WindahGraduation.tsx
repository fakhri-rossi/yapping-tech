'use client';

import { useState, useRef, useCallback } from 'react';
import { TemplateProps } from '@type/gift';
import UniversalMusicPlayer from '@components/plivin/common/UniversalMusicPlayer';
import Link from 'next/link';
import Image from 'next/image';

/* ============================================================
   Good Ending Windah — Cyberpunk RPG Gamer Console Concept
   Non-sliding interactive arcade dashboard & soundboard deck!
   ============================================================ */

export default function WindahGraduation({
  recipientName = 'Brader',
  greetingText = '',
  photos = [],
  musicUrl = '/music/windah.mp3',
  showBackButton = true,
}: TemplateProps) {
  const [started, setStarted] = useState(false);
  const [activeTab, setActiveTab] = useState<number>(0);
  const [soundReaction, setSoundReaction] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const photoUrl = photos.length > 0 ? photos[0] : 'https://i.pinimg.com/originals/31/76/71/317671bab29f28b964a7766665e8b3e9.jpg';

  const finalMsg = greetingText || `Akhirnya kelar juga revisian dari dosen pembimbing tercinta! Welcome to the real world, calon orang sukses! 🎉\n\n"Ga sia-sia begadang mulu demi ngejar ACC. Sekarang waktunya healing tanpa beban!"`;

  // Real Canvas Confetti Particle Generator
  const launchRealConfetti = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const colors = ['#00F0FF', '#FF007F', '#FBBF24', '#22C55E', '#A855F7', '#EC4899', '#3B82F6', '#FFFFFF'];
    const particles = Array.from({ length: 150 }, () => ({
      x: canvas.width / 2 + (Math.random() * 240 - 120),
      y: canvas.height / 2 + (Math.random() * 100 - 150),
      w: Math.random() * 10 + 6,
      h: Math.random() * 14 + 8,
      color: colors[Math.floor(Math.random() * colors.length)],
      vx: (Math.random() - 0.5) * 18,
      vy: Math.random() * -15 - 6,
      gravity: 0.22,
      rotation: Math.random() * 360,
      rotSpeed: (Math.random() - 0.5) * 14,
      opacity: 1,
      shape: Math.random() > 0.35 ? 'rect' : 'circle',
    }));

    const startTime = Date.now();

    const render = () => {
      const elapsed = Date.now() - startTime;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      let alive = false;
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += p.gravity;
        p.vx *= 0.98;
        p.rotation += p.rotSpeed;

        if (elapsed > 2200) {
          p.opacity -= 0.025;
        }

        if (p.opacity > 0 && p.y < canvas.height + 50) {
          alive = true;
          ctx.save();
          ctx.globalAlpha = Math.max(0, p.opacity);
          ctx.translate(p.x, p.y);
          ctx.rotate((p.rotation * Math.PI) / 180);
          ctx.fillStyle = p.color;

          if (p.shape === 'rect') {
            ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
          } else {
            ctx.beginPath();
            ctx.arc(0, 0, p.w / 2, 0, Math.PI * 2);
            ctx.fill();
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

  // Synthetic Arcade Web Audio Sound Generator
  const playArcadeSound = useCallback((type: 'beep' | 'coin' | 'fanfare' | 'laser') => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === 'beep') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(600, ctx.currentTime);
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);
        osc.start();
        osc.stop(ctx.currentTime + 0.09);
      } else if (type === 'coin') {
        osc.type = 'square';
        osc.frequency.setValueAtTime(987.77, ctx.currentTime);
        osc.frequency.setValueAtTime(1318.51, ctx.currentTime + 0.08);
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);
        osc.start();
        osc.stop(ctx.currentTime + 0.26);
      } else if (type === 'laser') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(850, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.15);
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
        osc.start();
        osc.stop(ctx.currentTime + 0.16);
      } else if (type === 'fanfare') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(523.25, ctx.currentTime);
        osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.1);
        osc.frequency.setValueAtTime(783.99, ctx.currentTime + 0.2);
        osc.frequency.setValueAtTime(1046.50, ctx.currentTime + 0.3);
        gain.gain.setValueAtTime(0.25, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
        osc.start();
        osc.stop(ctx.currentTime + 0.52);
      }
    } catch {}
  }, []);

  function handleStart() {
    playArcadeSound('fanfare');
    launchRealConfetti();
    setStarted(true);
    setActiveTab(0);
  }

  const handleTabChange = (idx: number) => {
    playArcadeSound('beep');
    setActiveTab(idx);
  };

  const handleReaction = (msg: string, soundType: 'coin' | 'laser' | 'fanfare') => {
    playArcadeSound(soundType);
    setSoundReaction(msg);
    if (soundType === 'fanfare') {
      launchRealConfetti();
    }
    setTimeout(() => setSoundReaction(null), 2000);
  };

  return (
    <div className="windah-root">
      <style>{`
        .windah-root {
          width: 100%; height: 100%; min-height: 100vh; min-height: 100dvh; flex: 1;
          display: flex; flex-direction: column;
          background-color: #0B0C10; color: #fff;
          overflow-x: hidden; position: relative;
          font-family: 'Orbitron', 'Montserrat', sans-serif;
        }

        /* Cyberpunk Grid Background */
        .windah-grid {
          background-size: 40px 40px;
          background-image:
            linear-gradient(to right, rgba(0,240,255,0.08) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,0,127,0.08) 1px, transparent 1px);
          position: absolute; inset: 0; z-index: 0;
          pointer-events: none;
          transform: perspective(500px) rotateX(60deg) translateY(-100px) translateZ(-200px);
          animation: windahGridMove 20s linear infinite;
        }
        @keyframes windahGridMove {
          0% { transform: perspective(500px) rotateX(60deg) translateY(0) translateZ(-200px); }
          100% { transform: perspective(500px) rotateX(60deg) translateY(40px) translateZ(-200px); }
        }

        .windah-text-gradient {
          background: linear-gradient(90deg, #00F0FF, #FF007F);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
        }

        .windah-glass {
          background: rgba(11,12,16,0.9);
          backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
          border: 2px solid rgba(0,240,255,0.3);
          box-shadow: 0 0 35px rgba(0,240,255,0.15);
          border-radius: 24px; position: relative; overflow: hidden;
        }

        /* Floating Windah BG Watermark */
        .windah-bg-img {
          position: absolute; z-index: 1; pointer-events: none;
          opacity: 0.2; border-radius: 16px; mix-blend-mode: screen;
        }
        .windah-bg-1 { top: 10%; left: 5%; width: 140px; animation: windahF1 12s ease-in-out infinite; filter: drop-shadow(0 0 10px #FF007F); }
        .windah-bg-2 { bottom: 15%; right: 5%; width: 160px; animation: windahF2 15s ease-in-out infinite; filter: drop-shadow(0 0 10px #00F0FF); }
        @keyframes windahF1 { 0%,100% { transform: translate(0,0) rotate(0deg); } 50% { transform: translate(25px,-35px) rotate(8deg); } }
        @keyframes windahF2 { 0%,100% { transform: translate(0,0) rotate(0deg); } 50% { transform: translate(-25px,40px) rotate(-8deg); } }

        .windah-btn-cyber {
          border: 2px solid #00F0FF; background: transparent; color: #fff;
          font-family: 'Orbitron', sans-serif; text-transform: uppercase;
          letter-spacing: 0.15em; transition: all 0.3s;
          box-shadow: 0 0 10px rgba(0,240,255,0.2);
          padding: 12px 28px; border-radius: 12px; font-size: 0.75rem; font-weight: 700;
          cursor: pointer; position: relative; z-index: 20;
        }
        .windah-btn-cyber:hover { background: #00F0FF; color: #000; box-shadow: 0 0 20px #00F0FF; transform: translateY(-2px); }

        .windah-intro {
          position: absolute; inset: 0; z-index: 50;
          display: flex; align-items: center; justify-content: center;
          background: #0B0C10; transition: opacity 0.8s; padding: 1rem;
        }
        .windah-intro.hidden { opacity: 0; pointer-events: none; }

        .windah-start-btn {
          position: relative; padding: 18px 36px;
          background: transparent; border: 2px solid #FF007F;
          color: white; font-family: 'Orbitron', sans-serif;
          letter-spacing: 0.2em; text-transform: uppercase;
          font-size: 1rem; cursor: pointer; font-weight: 900;
          transition: all 0.3s; box-shadow: 0 0 20px #FF007F;
          border-radius: 16px;
        }
        .windah-start-btn:hover { background: #FF007F; color: white; transform: scale(1.05); }

        .windah-glow-pulse { animation: windahGlow 2s ease-in-out infinite alternate; }
        @keyframes windahGlow {
          0% { box-shadow: 0 0 10px #00F0FF, 0 0 20px #00F0FF; }
          100% { box-shadow: 0 0 20px #FF007F, 0 0 40px #FF007F; }
        }

        /* Sound Reaction Popup Floating */
        @keyframes popUpFade {
          0% { opacity: 0; transform: translate(-50%, -50%) scale(0.5); }
          20% { opacity: 1; transform: translate(-50%, -60%) scale(1.2); }
          80% { opacity: 1; transform: translate(-50%, -65%) scale(1); }
          100% { opacity: 0; transform: translate(-50%, -80%) scale(0.8); }
        }
      `}</style>

      {/* eslint-disable-next-line @next/next/no-page-custom-font */}
      <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Montserrat:ital,wght@0,400;0,700;1,400&display=swap" rel="stylesheet" />

      {/* Real HTML5 Canvas Physics Confetti Burst */}
      <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-[100] w-full h-full" />

      {/* Music Player */}
      <UniversalMusicPlayer musicUrl={musicUrl} isPlaying={started} startTime={2} />

      {/* Top Left Navigation Buttons (Kembali & Refresh) */}
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

      {/* Grid BG */}
      <div className="windah-grid" />

      {/* Outer Floating Windah Images */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="https://pbs.twimg.com/media/FTVWvfTVEAAjcGi.jpg" className="windah-bg-img windah-bg-1" alt="Windah" />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="https://i.pinimg.com/originals/31/76/71/317671bab29f28b964a7766665e8b3e9.jpg" className="windah-bg-img windah-bg-2" alt="Windah" />

      {/* Sound Reaction Floating Overlay */}
      {soundReaction && (
        <div
          className="fixed top-1/2 left-1/2 z-[100] px-6 py-3 rounded-2xl bg-black/90 border-2 border-cyan-400 text-cyan-300 font-mono font-bold text-sm md:text-lg shadow-[0_0_40px_#00F0FF] pointer-events-none text-center"
          style={{ animation: 'popUpFade 2s ease-out forwards' }}
        >
          {soundReaction}
        </div>
      )}

      {/* Intro Screen */}
      <div className={`windah-intro ${started ? 'hidden' : ''}`}>
        <div style={{ textAlign: 'center', position: 'relative', zIndex: 10 }}>
          <div style={{ marginBottom: '2rem', position: 'relative', display: 'inline-block' }}>
            <div style={{ position: 'absolute', inset: 0, background: '#00F0FF', opacity: 0.3, filter: 'blur(25px)', borderRadius: '50%' }} />
            <div style={{ width: 110, height: 110, border: '3px solid #00F0FF', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', background: 'rgba(11,12,16,0.7)', backdropFilter: 'blur(8px)', boxShadow: '0 0 25px #00F0FF' }}>
              <span style={{ fontSize: '3rem' }}>🎮</span>
            </div>
          </div>
          <br />
          <h1 className="font-mono text-xl md:text-2xl font-extrabold text-cyan-400 mb-2 tracking-widest uppercase">
            WINDAH ARCADE CONSOLE
          </h1>
          <p className="font-mono text-xs text-slate-400 mb-6">
            [ SKRIPSI COMPLETED EDITION ]
          </p>
          <button className="windah-start-btn" onClick={handleStart}>
            🚀 MULAI PETUALANGAN
          </button>
        </div>
      </div>

      {/* Main Interactive Arcade Dashboard (Centered Responsive Layout) */}
      {started && (
        <div className="w-full max-w-4xl mx-auto my-auto p-4 flex flex-col items-center justify-center relative z-20">
          {/* Top Arcade HUD Header */}
          <div className="w-full bg-black/80 border border-cyan-500/40 backdrop-blur-md rounded-2xl p-4 mb-4 shadow-[0_0_20px_rgba(0,240,255,0.15)] flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-cyan-400 animate-ping" />
              <span className="text-cyan-400 font-bold tracking-wider">PLAYER: {recipientName.toUpperCase()}</span>
            </div>
            <div className="flex items-center gap-4 text-[11px] text-slate-300">
              <div>HP: <span className="text-emerald-400 font-bold">100% MAX</span></div>
              <div>EXP: <span className="text-pink-400 font-bold">100% ACC</span></div>
              <div>RANK: <span className="text-amber-400 font-bold">LVL 99 WISUDAWAN</span></div>
            </div>
          </div>

          {/* Interactive Windah Soundboard / Reaction Deck */}
          <div className="w-full flex flex-wrap items-center justify-center gap-2 mb-4">
            <button
              type="button"
              onClick={() => handleReaction('🔥 ACC SKRIPSI REVISI KELAR! +9999 EXP!', 'laser')}
              className="px-3 py-1.5 rounded-xl bg-cyan-950/80 border border-cyan-400/50 text-cyan-300 hover:bg-cyan-900 transition-all text-xs font-mono font-bold cursor-pointer hover:scale-105 active:scale-95"
            >
              🔥 ACC SKRIPSI!
            </button>
            <button
              type="button"
              onClick={() => handleReaction('👑 GOOD ENDING ACHIEVED BRADER!', 'fanfare')}
              className="px-3 py-1.5 rounded-xl bg-pink-950/80 border border-pink-400/50 text-pink-300 hover:bg-pink-900 transition-all text-xs font-mono font-bold cursor-pointer hover:scale-105 active:scale-95"
            >
              👑 GOOD ENDING!
            </button>
            <button
              type="button"
              onClick={() => handleReaction('🎮 MANTAAP GUYS! WINNER WINNER!', 'coin')}
              className="px-3 py-1.5 rounded-xl bg-amber-950/80 border border-amber-400/50 text-amber-300 hover:bg-amber-900 transition-all text-xs font-mono font-bold cursor-pointer hover:scale-105 active:scale-95"
            >
              🎮 MANTAAP GUYS!
            </button>
            <button
              type="button"
              onClick={() => handleReaction('💥 NAGA REVISI BERHASIL DIBASMI!', 'laser')}
              className="px-3 py-1.5 rounded-xl bg-emerald-950/80 border border-emerald-400/50 text-emerald-300 hover:bg-emerald-900 transition-all text-xs font-mono font-bold cursor-pointer hover:scale-105 active:scale-95"
            >
              💥 BASMI REVISI!
            </button>
          </div>

          {/* Interactive Quest Navigation Tabs */}
          <div className="w-full flex items-center justify-between gap-1 sm:gap-2 mb-3 bg-black/60 p-1.5 rounded-2xl border border-white/15 backdrop-blur-md">
            <button
              type="button"
              onClick={() => handleTabChange(0)}
              className={`flex-1 py-2 px-2 sm:px-3 rounded-xl font-mono text-[10px] sm:text-xs font-bold transition-all cursor-pointer text-center ${
                activeTab === 0
                  ? 'bg-cyan-500 text-black shadow-[0_0_15px_#00F0FF]'
                  : 'text-slate-400 hover:text-white hover:bg-white/10'
              }`}
            >
              🛡️ QUEST 1
            </button>
            <button
              type="button"
              onClick={() => handleTabChange(1)}
              className={`flex-1 py-2 px-2 sm:px-3 rounded-xl font-mono text-[10px] sm:text-xs font-bold transition-all cursor-pointer text-center ${
                activeTab === 1
                  ? 'bg-pink-500 text-black shadow-[0_0_15px_#FF007F]'
                  : 'text-slate-400 hover:text-white hover:bg-white/10'
              }`}
            >
              ⚔️ QUEST 2
            </button>
            <button
              type="button"
              onClick={() => handleTabChange(2)}
              className={`flex-1 py-2 px-2 sm:px-3 rounded-xl font-mono text-[10px] sm:text-xs font-bold transition-all cursor-pointer text-center ${
                activeTab === 2
                  ? 'bg-cyan-500 text-black shadow-[0_0_15px_#00F0FF]'
                  : 'text-slate-400 hover:text-white hover:bg-white/10'
              }`}
            >
              📜 QUEST 3
            </button>
            <button
              type="button"
              onClick={() => handleTabChange(3)}
              className={`flex-1 py-2 px-2 sm:px-3 rounded-xl font-mono text-[10px] sm:text-xs font-bold transition-all cursor-pointer text-center ${
                activeTab === 3
                  ? 'bg-amber-400 text-black shadow-[0_0_15px_#f59e0b]'
                  : 'text-slate-400 hover:text-white hover:bg-white/10'
              }`}
            >
              🏆 HALL OF FAME
            </button>
          </div>

          {/* Main Quest Content Glass Box */}
          <div className="w-full windah-glass p-6 md:p-8 min-h-[360px] flex flex-col justify-between">
            {/* Quest 1 Content */}
            {activeTab === 0 && (
              <div className="w-full flex flex-col items-center text-center animate-fade-in my-auto">
                {/* Background Windah Watermark */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://pbs.twimg.com/media/FTVWvfTVEAAjcGi.jpg"
                  alt="Windah Watermark"
                  style={{ position: 'absolute', right: -10, bottom: -10, width: 200, height: 200, objectFit: 'contain', opacity: 0.2, pointerEvents: 'none', mixBlendMode: 'screen' }}
                />
                <span className="text-4xl mb-3">🎓</span>
                <h2 className="font-mono text-xl md:text-2xl text-cyan-400 font-extrabold mb-3">
                  QUEST 1: LEVEL UP!
                </h2>
                <p className="font-sans text-sm md:text-base text-slate-300 max-w-lg leading-relaxed mb-6">
                  Perjuangan panjang melawan naga revisi dosen pembimbing akhirnya selesai. Petualangan baru menuju dunia nyata akan segera dimulai!
                </p>
                <button
                  type="button"
                  onClick={() => handleTabChange(1)}
                  className="windah-btn-cyber"
                >
                  LANJUT KE QUEST 2 ⚔️
                </button>
              </div>
            )}

            {/* Quest 2 Content */}
            {activeTab === 1 && (
              <div className="w-full flex flex-col items-center text-center animate-fade-in my-auto">
                {/* Background Windah Watermark */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://i.pinimg.com/originals/31/76/71/317671bab29f28b964a7766665e8b3e9.jpg"
                  alt="Windah Watermark"
                  style={{ position: 'absolute', left: -10, bottom: -10, width: 200, height: 200, objectFit: 'contain', opacity: 0.2, pointerEvents: 'none', mixBlendMode: 'screen' }}
                />
                <span className="text-4xl mb-3">⚔️</span>
                <h2 className="font-mono text-xl md:text-2xl text-pink-400 font-extrabold mb-3">
                  QUEST 2: UJIAN ACC SKRIPSI
                </h2>
                <p className="font-sans text-sm md:text-base text-slate-300 max-w-lg leading-relaxed mb-6">
                  Begadang mengejar lembaran lembaran ACC dari dosen pembimbing tercinta memang melelahkan. Namun, setiap tetesan keringat itu terbayar lunas hari ini saat namamu dinyatakan lulus.
                </p>
                <button
                  type="button"
                  onClick={() => handleTabChange(2)}
                  className="windah-btn-cyber"
                >
                  LANJUT KE QUEST 3 📜
                </button>
              </div>
            )}

            {/* Quest 3 Content */}
            {activeTab === 2 && (
              <div className="w-full flex flex-col items-center text-center animate-fade-in my-auto">
                {/* Background Windah Watermark */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://pbs.twimg.com/media/FTVWvfTVEAAjcGi.jpg"
                  alt="Windah Watermark"
                  style={{ position: 'absolute', right: -10, top: -10, width: 200, height: 200, objectFit: 'contain', opacity: 0.2, pointerEvents: 'none', mixBlendMode: 'screen' }}
                />
                <span className="text-4xl mb-3">👑</span>
                <h2 className="font-mono text-xl md:text-2xl text-cyan-400 font-extrabold mb-3">
                  QUEST 3: SARJANA BERJAYA
                </h2>
                <p className="font-sans text-sm md:text-base text-slate-300 max-w-lg leading-relaxed mb-6">
                  Selamat menyandang gelar barumu! Angkat kepalamu tinggi-tinggi, kalahkan boss terakhir di luar sana, dan jadilah pemenang utama di petualangan hidupmu berikutnya!
                </p>
                <button
                  type="button"
                  onClick={() => handleTabChange(3)}
                  className="windah-btn-cyber"
                >
                  SINGKAP HALL OF FAME 🏆
                </button>
              </div>
            )}

            {/* Quest 4 Content: Hall of Fame Victory Reveal */}
            {activeTab === 3 && (
              <div className="w-full flex flex-col items-center text-center animate-fade-in relative z-10 py-2">
                {/* Background Windah Watermark */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://i.pinimg.com/originals/31/76/71/317671bab29f28b964a7766665e8b3e9.jpg"
                  alt="Windah Watermark"
                  style={{ position: 'absolute', left: 10, bottom: 10, width: 220, height: 220, objectFit: 'contain', opacity: 0.18, pointerEvents: 'none', mixBlendMode: 'screen' }}
                />

                <div className="inline-block px-4 py-1 rounded-full border border-cyan-400/50 bg-cyan-400/10 font-mono text-cyan-400 text-xs tracking-widest mb-4 font-bold">
                  SKRIPSI COMPLETED
                </div>

                <h1 className="font-mono text-2xl md:text-4xl font-extrabold text-white mb-2 uppercase">
                  Cie Lulus <span className="windah-text-gradient">Sidang</span>
                </h1>

                <h2 className="font-sans text-lg md:text-xl font-bold text-slate-200 mb-4">
                  {recipientName}
                </h2>

                {/* Recipient Photo Frame */}
                <div className="windah-glow-pulse w-48 md:w-56 h-60 md:h-72 rounded-2xl overflow-hidden mb-6 border-2 border-cyan-400 p-1 relative">
                  <Image src={photoUrl} alt="Graduation" fill className="object-cover rounded-xl" unoptimized />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none rounded-xl" />
                </div>

                {/* Custom Message */}
                <div className="max-w-lg mx-auto mb-6 text-slate-300 font-sans text-xs md:text-sm leading-relaxed">
                  {finalMsg.split('\n').filter(l => l.trim()).map((line, i) => (
                    <p key={i} className={`mb-2 ${i === 1 ? 'text-cyan-400 font-bold text-sm md:text-base' : ''}`}>
                      {line}
                    </p>
                  ))}
                </div>

                {/* Interactive Celebration Action Button */}
                <button
                  type="button"
                  onClick={() => handleReaction('🎉 CONGRATULATIONS! GOOD ENDING ACHIEVED!', 'fanfare')}
                  className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-pink-500 hover:from-cyan-400 hover:to-pink-400 text-black font-mono font-extrabold text-xs uppercase tracking-widest rounded-xl transition-all shadow-[0_0_25px_rgba(0,240,255,0.6)] cursor-pointer hover:scale-105 active:scale-95"
                >
                  🎊 RAYAKAN GOOD ENDING (CONFETTI)
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
