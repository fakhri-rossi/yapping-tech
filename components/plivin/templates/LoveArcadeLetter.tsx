'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { TemplateProps } from '@type/gift';
import UniversalMusicPlayer from '@components/plivin/common/UniversalMusicPlayer';

interface FallingFlower {
  id: number;
  x: number; // 15 to 85%
  y: number; // 0 to 100%
  speed: number;
  emoji: string;
  points: number;
  name: string;
}

interface FloatingScore {
  id: number;
  x: number;
  y: number;
  text: string;
}

interface HugParticle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  emoji: string;
}

const FLOWER_TYPES = [
  { emoji: '🌸', name: 'Sakura', points: 10, speed: 0.95 },
  { emoji: '🌹', name: 'Mawar', points: 10, speed: 0.92 },
  { emoji: '🌻', name: 'Matahari', points: 10, speed: 0.96 },
  { emoji: '🌷', name: 'Tulip', points: 10, speed: 0.94 },
  { emoji: '🌺', name: 'Kembang Sepatu', points: 10, speed: 0.93 },
  { emoji: '🌼', name: 'Daisy', points: 10, speed: 0.95 },
  { emoji: '💐', name: 'Buket Spesial', points: 20, speed: 1.05 },
];

export default function LoveArcadeLetter({
  recipientName = 'Sayangku',
  greetingText = `Hai cintaku tersayang... 🤍\n\nMakasih ya sudah mau kumpulin bunga-bunga cantik bareng Loopy tadi! Tapi tahu gak? Bunga-bunga itu cuma simbol kecil dibanding betapa bersyukurnya aku bisa memiliki kamu di hidupku.\n\nSetiap hari bersamamu selalu terasa spesial. Dari tawa-tawa random kita, perhatian kecilmu yang selalu bikin tenang, sampai pelukanmu yang selalu jadi tempat pulang ternyaman buat aku.\n\nSemoga kita bisa terus sama-sama, saling jaga, dan terus melangkah bareng ya. I love you so much, more than words could ever say! 💖✨`,
  photos = [],
  musicUrl = '/music/can-i-call-u-rose.mp3',
  showBackButton = true,
}: TemplateProps) {
  // Game & View Phases: 'welcome' | 'playing' | 'result' | 'letter'
  const [phase, setPhase] = useState<'welcome' | 'playing' | 'result' | 'letter'>('welcome');

  // Game state
  const [score, setScore] = useState(0);
  const [flowersCaught, setFlowersCaught] = useState(0);
  const [lives, setLives] = useState(3);
  const [timeLeft, setTimeLeft] = useState(10);
  const [basketX, setBasketX] = useState(50); // percentage 10-90%
  const [currentFlower, setCurrentFlower] = useState<FallingFlower | null>(null);
  const [floatingScores, setFloatingScores] = useState<FloatingScore[]>([]);
  const [missFlash, setMissFlash] = useState(false);
  const [activePhoto, setActivePhoto] = useState<string | null>(null);
  const [hugCount, setHugCount] = useState(0);
  const [hugParticles, setHugParticles] = useState<HugParticle[]>([]);

  // Sound effects generator using Web Audio API
  const playChime = (frequency = 587.33) => {
    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(frequency, ctx.currentTime);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.35);
    } catch {
      // Audio policy fallback
    }
  };

  const defaultPhotos = [
    'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1494774157365-9e04c6720e47?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?q=80&w=800&auto=format&fit=crop',
  ];

  const photoList = photos.length > 0 ? photos : defaultPhotos;

  // Mini-game references
  const gameLoopRef = useRef<number | null>(null);
  const activeFlowerRef = useRef<FallingFlower | null>(null);
  const nextItemIdRef = useRef(1);
  const gameAreaRef = useRef<HTMLDivElement | null>(null);
  const basketXRef = useRef(50);
  const livesRef = useRef(3);
  const keysPressedRef = useRef<Set<string>>(new Set());
  const touchDirectionRef = useRef<'left' | 'right' | null>(null);

  // Sync lives ref
  useEffect(() => {
    livesRef.current = lives;
  }, [lives]);

  // Helper to spawn a new single flower
  const spawnNewFlower = useCallback(() => {
    const selected = FLOWER_TYPES[Math.floor(Math.random() * FLOWER_TYPES.length)];
    const newFlower: FallingFlower = {
      id: nextItemIdRef.current++,
      x: 15 + Math.random() * 70, // safely within play area
      y: -6,
      speed: selected.speed,
      emoji: selected.emoji,
      points: selected.points,
      name: selected.name,
    };
    activeFlowerRef.current = newFlower;
    setCurrentFlower(newFlower);
  }, []);

  // Start mini game
  const startGame = () => {
    setScore(0);
    setFlowersCaught(0);
    setLives(3);
    livesRef.current = 3;
    basketXRef.current = 50;
    setBasketX(50);
    setTimeLeft(10);
    activeFlowerRef.current = null;
    setCurrentFlower(null);
    keysPressedRef.current.clear();
    touchDirectionRef.current = null;
    setPhase('playing');
    playChime(659.25);
    setTimeout(() => {
      spawnNewFlower();
    }, 400);
  };

  // Timer countdown
  useEffect(() => {
    if (phase !== 'playing') return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setPhase('result');
          playChime(880);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [phase]);

  // Main game animation loop: moves ONE flower at a time at a smooth medium tempo & smooth continuous Loopy movement
  useEffect(() => {
    if (phase !== 'playing') return;

    let spawnTimeout: NodeJS.Timeout | null = null;

    const updateLoop = () => {
      // 1. Smooth continuous basket movement via Keyboard or Touch Buttons (60fps glide)
      let moved = false;
      const keys = keysPressedRef.current;
      const touchDir = touchDirectionRef.current;

      if (keys.has('ArrowLeft') || keys.has('a') || keys.has('A') || touchDir === 'left') {
        basketXRef.current = Math.max(12, basketXRef.current - 1.4);
        moved = true;
      } else if (keys.has('ArrowRight') || keys.has('d') || keys.has('D') || touchDir === 'right') {
        basketXRef.current = Math.min(88, basketXRef.current + 1.4);
        moved = true;
      }

      if (moved) {
        setBasketX(basketXRef.current);
      }

      const flower = activeFlowerRef.current;
      const currentBasketX = basketXRef.current;
      const currentLives = livesRef.current;

      if (flower) {
        // Move single flower downward with medium tempo
        flower.y += flower.speed;

        // Check catch collision at basket height (80% - 91%)
        if (flower.y >= 80 && flower.y <= 91) {
          const inRange = Math.abs(flower.x - currentBasketX) < 16;
          if (inRange) {
            // CAUGHT FLOWER!
            setScore((s) => s + flower.points);
            setFlowersCaught((c) => c + 1);
            playChime(523.25 + flower.points * 12);

            // Floating score popup
            const scoreId = Date.now();
            setFloatingScores((fs) => [
              ...fs,
              { id: scoreId, x: flower.x, y: 78, text: `+${flower.points} ${flower.emoji}` },
            ]);
            setTimeout(() => {
              setFloatingScores((fs) => fs.filter((f) => f.id !== scoreId));
            }, 750);

            // Clear current flower and spawn next flower after 350ms pause
            activeFlowerRef.current = null;
            setCurrentFlower(null);

            spawnTimeout = setTimeout(() => {
              spawnNewFlower();
            }, 350);

            gameLoopRef.current = requestAnimationFrame(updateLoop);
            return;
          }
        }

        // Flower missed (dropped past bottom > 98%)
        if (flower.y >= 98) {
          playChime(220); // low miss sound
          setMissFlash(true);
          setTimeout(() => setMissFlash(false), 300);

          const nextLives = currentLives - 1;
          setLives(nextLives);
          livesRef.current = nextLives;

          // Clear current flower
          activeFlowerRef.current = null;
          setCurrentFlower(null);

          if (nextLives <= 0) {
            // GAME OVER - Transition to result screen
            setPhase('result');
            playChime(440);
            return;
          }

          // Spawn next single flower after 400ms pause
          spawnTimeout = setTimeout(() => {
            spawnNewFlower();
          }, 400);

          gameLoopRef.current = requestAnimationFrame(updateLoop);
          return;
        }

        // Update state position
        setCurrentFlower({ ...flower });
      }

      gameLoopRef.current = requestAnimationFrame(updateLoop);
    };

    gameLoopRef.current = requestAnimationFrame(updateLoop);

    return () => {
      if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
      if (spawnTimeout) clearTimeout(spawnTimeout);
    };
  }, [phase, spawnNewFlower]);

  // Touch & Mouse direct position handler (Instant, 0 latency)
  const handlePointerMove = useCallback((clientX: number) => {
    if (!gameAreaRef.current) return;
    const rect = gameAreaRef.current.getBoundingClientRect();
    const relativeX = clientX - rect.left;
    const pct = Math.max(12, Math.min(88, (relativeX / rect.width) * 100));
    basketXRef.current = pct;
    setBasketX(pct);
  }, []);

  // Keyboard Continuous Left / Right Support
  useEffect(() => {
    if (phase !== 'playing') return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowLeft', 'ArrowRight', 'a', 'A', 'd', 'D'].includes(e.key)) {
        keysPressedRef.current.add(e.key);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressedRef.current.delete(e.key);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [phase]);

  // Hug button particle explosion
  const handleHugClick = () => {
    setHugCount((c) => c + 1);
    playChime(783.99);

    const newParticles: HugParticle[] = Array.from({ length: 8 }).map((_, i) => ({
      id: Date.now() + i,
      x: 30 + Math.random() * 40,
      y: 50 + Math.random() * 20,
      vx: Math.random(),
      vy: Math.random(),
      emoji: ['🌸', '💖', '🌷', '✨', '💐', '🤍'][Math.floor(Math.random() * 6)],
    }));

    setHugParticles((prev) => [...prev, ...newParticles]);
    setTimeout(() => {
      setHugParticles((prev) => prev.filter((p) => !newParticles.find((np) => np.id === p.id)));
    }, 1200);
  };

  return (
    <div className="min-h-screen w-full bg-[#fdf2f4] text-slate-800 font-sans relative overflow-x-hidden flex flex-col items-center">
      {/* Dynamic Embedded CSS */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@700&family=Plus+Jakarta+Sans:wght@400;600;700;800&family=Press+Start+2P&display=swap');

        .font-pixel { font-family: 'Press Start 2P', monospace; }
        .font-handwritten { font-family: 'Caveat', cursive; }
        .font-modern { font-family: 'Plus Jakarta Sans', sans-serif; }

        @keyframes loopyBounce {
          0% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(2deg) scale(1.02); }
          100% { transform: translateY(0px) rotate(0deg); }
        }

        .loopy-bounce { animation: loopyBounce 3s ease-in-out infinite; }

        @keyframes unwrapLetter {
          0% { transform: scale(0.9) translateY(40px); opacity: 0; }
          100% { transform: scale(1) translateY(0); opacity: 1; }
        }

        .letter-enter { animation: unwrapLetter 0.7s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }

        @keyframes floatUpFade {
          0% { transform: translateY(0) scale(1); opacity: 1; }
          100% { transform: translateY(-40px) scale(1.3); opacity: 0; }
        }

        .floating-score-anim { animation: floatUpFade 0.8s ease-out forwards; }

        @keyframes particleBurst {
          0% { transform: translate(0, 0) scale(0.5); opacity: 1; }
          100% { transform: translate(calc((var(--vx) - 0.5) * 140px), calc((var(--vy) - 0.5) * 140px)) scale(1.4); opacity: 0; }
        }

        .particle-burst { animation: particleBurst 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      `}</style>

      {/* Pastel Loopy Hearts & Polka Background */}
      <div
        className="fixed inset-0 pointer-events-none opacity-25 z-0"
        style={{
          backgroundImage: `radial-gradient(#f472b6 1px, transparent 1px), radial-gradient(#fb7185 0.75px, #fdf2f4 0.75px)`,
          backgroundSize: '28px 28px',
          backgroundPosition: '0 0, 14px 14px',
        }}
      />

      <UniversalMusicPlayer musicUrl={musicUrl} isPlaying={phase === 'letter'} startTime={0} />

      {/* Navigation Buttons for Demo View */}
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

      {/* ======================================================== */}
      {/* 1. STAGE 1: WELCOME & LOOPY FLOWER QUEST SCREEN */}
      {/* ======================================================== */}
      {phase === 'welcome' && (
        <div className="min-h-screen w-full flex items-center justify-center p-4 z-10">
          <div className="max-w-md w-full bg-white border-4 border-black rounded-3xl p-6 sm:p-8 shadow-[8px_8px_0px_0px_rgba(244,63,94,1)] text-center space-y-5 relative overflow-hidden">
            {/* Top Loopy Arcade Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-rose-500 text-white font-pixel text-[10px] rounded-full border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <span>🌸</span> LOOPY FLOWER QUEST
            </div>

            {/* Loopy Mascot 3D Sticker Avatar */}
            <div className="relative w-36 h-36 sm:w-40 sm:h-40 mx-auto loopy-bounce select-none">
              <div className="absolute inset-0 bg-pink-200 rounded-full blur-xl opacity-60 -z-10" />
              <Image
                src="/images/loopy/loopy-mascot.jpg"
                alt="Zanmang Loopy"
                fill
                sizes="(max-width: 640px) 144px, 160px"
                className="object-contain rounded-3xl drop-shadow-xl"
                priority
              />
            </div>

            {/* Title & Romantic Subtitle */}
            <div className="space-y-1.5">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-black font-modern">
                Kado Bunga Untuk <span className="text-rose-500 font-handwritten text-4xl block sm:inline">{recipientName}</span> 🌸
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 font-semibold leading-relaxed">
                Bantu Loopy mengumpulkan bunga-bunga cantik satu per satu sebelum kamu membuka surat cinta rahasia dari aku! 🌷
              </p>
            </div>

            {/* Rules Card */}
            <div className="bg-pink-50 border-2 border-dashed border-rose-400 rounded-2xl p-4 text-left space-y-2 text-xs font-semibold text-slate-700">
              <div className="font-extrabold text-rose-700 flex items-center justify-between">
                <span className="flex items-center gap-1.5"><span>🎮</span> Aturan Main:</span>
                <span className="text-rose-600 font-bold">3 Nyawa (❤️❤️❤️)</span>
              </div>
              <ul className="list-disc pl-5 space-y-1 text-[11px] text-slate-600">
                <li>Bunga akan jatuh <strong>satu per satu</strong> dengan tempo sedang.</li>
                <li>Geser keranjang Loopy ke kiri/kanan untuk menangkap bunga.</li>
                <li>Jika bunga terjatuh ke lantai tanpa tertangkap, nyawa berkurang 1!</li>
              </ul>
            </div>

            {/* Start Button */}
            <button
              type="button"
              onClick={startGame}
              className="w-full py-4 px-6 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 active:scale-95 text-white font-black text-sm uppercase tracking-wider rounded-2xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <span>🌸</span>
              <span>Kumpulkan Bunga Bareng Loopy!</span>
            </button>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 2. STAGE 2: PLAYABLE MINI GAME (SINGLE FLOWER DROP & 3 LIVES) */}
      {/* ======================================================== */}
      {phase === 'playing' && (
        <div className="min-h-screen w-full flex flex-col items-center justify-center p-3 sm:p-4 z-10">
          <div
            ref={gameAreaRef}
            onPointerDown={(e) => {
              try {
                e.currentTarget.setPointerCapture(e.pointerId);
              } catch {}
              handlePointerMove(e.clientX);
            }}
            onPointerMove={(e) => {
              if (e.buttons > 0 || e.pointerType === 'touch' || e.pointerType === 'mouse') {
                handlePointerMove(e.clientX);
              }
            }}
            className={`max-w-lg w-full h-[520px] sm:h-[560px] bg-gradient-to-b from-pink-100 via-rose-50 to-pink-200 border-4 border-black rounded-3xl relative overflow-hidden shadow-[8px_8px_0px_0px_rgba(244,63,94,1)] select-none touch-none cursor-pointer transition-colors ${
              missFlash ? 'bg-red-200/90' : ''
            }`}
          >
            {/* Top Game HUD Bar (Score, Lives, Timer) */}
            <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-30 pointer-events-none">
              {/* Score */}
              <div className="px-3 py-1.5 bg-white border-2 border-black rounded-xl shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex items-center gap-1.5 font-pixel text-[10px] sm:text-[11px] text-rose-600">
                <span>🌸</span>
                <span>{score} PTS</span>
              </div>

              {/* 3 Lives Heart Display */}
              <div className="px-3 py-1.5 bg-rose-50 border-2 border-black rounded-xl shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex items-center gap-1 text-base">
                {Array.from({ length: 3 }).map((_, i) => (
                  <span
                    key={i}
                    className={`transition-transform duration-300 ${
                      i < lives ? 'scale-100 opacity-100' : 'scale-75 opacity-30 grayscale'
                    }`}
                  >
                    {i < lives ? '❤️' : '🖤'}
                  </span>
                ))}
              </div>

              {/* Time */}
              <div className="px-3 py-1.5 bg-black text-white border-2 border-black rounded-xl shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex items-center gap-1.5 font-pixel text-[10px] sm:text-[11px]">
                <span>⏳</span>
                <span>{timeLeft}s</span>
              </div>
            </div>

            {/* Hint for Controls */}
            <div className="absolute top-14 left-1/2 -translate-x-1/2 text-center pointer-events-none opacity-70 text-[10px] font-bold text-rose-700 bg-white/85 px-3.5 py-1 rounded-full border border-pink-300 shadow-xs whitespace-nowrap">
              👈 Sentuh / Geser Loopy untuk Menangkap Bunga 👉
            </div>

            {/* Single Falling Flower (Only ONE at a time) */}
            {currentFlower && (
              <div
                style={{
                  left: `${currentFlower.x}%`,
                  top: `${currentFlower.y}%`,
                  transform: 'translate(-50%, -50%)',
                }}
                className="absolute text-4xl sm:text-5xl pointer-events-none drop-shadow-md animate-pulse"
              >
                {currentFlower.emoji}
              </div>
            )}

            {/* Floating Score Popups */}
            {floatingScores.map((fs) => (
              <div
                key={fs.id}
                style={{
                  left: `${fs.x}%`,
                  top: `${fs.y}%`,
                }}
                className="absolute font-pixel text-rose-600 text-xs sm:text-sm font-black pointer-events-none floating-score-anim bg-white/95 px-2 py-1 rounded-lg border-2 border-rose-400 shadow-md whitespace-nowrap"
              >
                {fs.text}
              </div>
            ))}

            {/* Loopy Player Basket Character (Instant zero latency 60fps) */}
            <div
              style={{
                left: `${basketX}%`,
                bottom: '18px',
                transform: 'translateX(-50%)',
              }}
              className="absolute z-20 flex flex-col items-center pointer-events-none will-change-transform transform-gpu"
            >
              {/* Loopy Mascot Avatar + Basket */}
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 drop-shadow-xl">
                <Image
                  src="/images/loopy/loopy-mascot.jpg"
                  alt="Loopy Player"
                  fill
                  sizes="(max-width: 640px) 64px, 80px"
                  className="object-contain rounded-2xl border-2 border-black"
                />
                <span className="absolute -top-3 -right-2 text-2xl animate-bounce">🧺</span>
              </div>
              <div className="px-3 py-0.5 bg-rose-600 text-white text-[10px] font-bold rounded-full border-2 border-black mt-1 shadow-sm font-modern whitespace-nowrap">
                Loopy &amp; {recipientName}
              </div>
            </div>
          </div>

          {/* Arcade Touch Buttons (For Mobile & Tablet) */}
          <div className="max-w-lg w-full flex items-center justify-between gap-3 mt-3 px-1">
            <button
              type="button"
              onPointerDown={() => {
                touchDirectionRef.current = 'left';
              }}
              onPointerUp={() => {
                touchDirectionRef.current = null;
              }}
              onPointerLeave={() => {
                touchDirectionRef.current = null;
              }}
              className="flex-1 py-3.5 bg-white hover:bg-rose-50 active:bg-rose-200 text-rose-700 font-black text-xs uppercase tracking-wider rounded-2xl border-3 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 transition-all select-none touch-none flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span className="text-base">⬅️</span>
              <span>Geser Kiri</span>
            </button>
            <button
              type="button"
              onPointerDown={() => {
                touchDirectionRef.current = 'right';
              }}
              onPointerUp={() => {
                touchDirectionRef.current = null;
              }}
              onPointerLeave={() => {
                touchDirectionRef.current = null;
              }}
              className="flex-1 py-3.5 bg-white hover:bg-rose-50 active:bg-rose-200 text-rose-700 font-black text-xs uppercase tracking-wider rounded-2xl border-3 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 transition-all select-none touch-none flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>Geser Kanan</span>
              <span className="text-base">➡️</span>
            </button>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 3. STAGE 2.5: GAME RESULTS & UNLOCK LETTER MODAL */}
      {/* ======================================================== */}
      {phase === 'result' && (
        <div className="min-h-screen w-full flex items-center justify-center p-4 z-10">
          <div className="max-w-md w-full bg-white border-4 border-black rounded-3xl p-6 sm:p-8 shadow-[8px_8px_0px_0px_rgba(244,63,94,1)] text-center space-y-6 animate-scaleUp">
            {/* Mascot on Result */}
            <div className="relative w-24 h-24 mx-auto select-none loopy-bounce">
              <Image
                src="/images/loopy/loopy-mascot.jpg"
                alt="Loopy Mascot"
                fill
                sizes="96px"
                className="object-contain rounded-2xl border-2 border-black shadow-md"
              />
            </div>

            <div className="space-y-1">
              <div className="inline-block px-3 py-1 bg-pink-100 text-pink-900 border-2 border-black rounded-full font-black text-xs uppercase tracking-wider">
                {lives > 0 ? '🎉 Bunga Berhasil Terkumpul!' : '🥺 Misi Selesai!'}
              </div>
              <h2 className="text-3xl font-black text-black font-pixel text-rose-500 pt-2">
                {flowersCaught} BUNGA!
              </h2>
              <p className="font-mono text-xs font-bold text-slate-500">Total Skor: {score} Poin</p>
            </div>

            <p className="text-xs sm:text-sm text-slate-700 font-semibold leading-relaxed">
              {lives > 0
                ? `Hebat banget pacar aku! Loopy dan aku udah kumpulin bunga terindah buat kamu. Sekarang saatnya kamu buka surat cinta rahasia dari aku ya... 🌸💕`
                : `Meskipun bunganya ada yang jatuh, tapi cinta aku ke kamu gak akan pernah jatuh dan pudar selamanya! Buka surat cintamu yuk... 🥺🤍`}
            </p>

            <button
              type="button"
              onClick={() => {
                setPhase('letter');
                playChime(659.25);
              }}
              className="w-full py-4 px-6 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 active:scale-95 text-white font-black text-xs sm:text-sm uppercase tracking-wider rounded-2xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <span>💌</span>
              <span>Buka Surat Cinta &amp; Hadiahmu ✨</span>
            </button>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 4. STAGE 3: SCROLLABLE SECRET MAIL & PHOTO MEMORIES */}
      {/* ======================================================== */}
      {phase === 'letter' && (
        <main className="w-full max-w-3xl mx-auto px-4 py-20 z-10 space-y-12 letter-enter font-modern">
          {/* Header Banner */}
          <div className="text-center space-y-3">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-pink-100 text-pink-700 border-2 border-black rounded-full font-black text-xs uppercase tracking-widest shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <span>🎀</span> Loopy Special Delivery
            </div>
            <h1 className="text-3xl sm:text-5xl font-black text-black tracking-tight">
              Untuk Kesayanganku, <span className="text-rose-600 font-handwritten text-4xl sm:text-6xl">{recipientName}</span> 🤍
            </h1>
            <p className="text-slate-600 font-semibold text-xs sm:text-sm max-w-lg mx-auto">
              Scroll ke bawah perlahan ya, ada surat cinta dan kenangan manis yang kusimpan khusus untuk kamu...
            </p>
          </div>

          {/* SECTION A: LOVE LETTER SCROLL CARD */}
          <div className="bg-[#fffdf9] border-4 border-black rounded-3xl p-6 sm:p-10 shadow-[8px_8px_0px_0px_rgba(244,63,94,1)] relative space-y-6">
            {/* Washi Tape Header */}
            <div
              className="absolute -top-3 left-1/2 -translate-x-1/2 w-36 h-7 bg-rose-200/90 border border-black/10 shadow-xs -rotate-2"
              style={{ clipPath: 'polygon(0 0, 100% 5%, 98% 95%, 2% 100%)' }}
            />

            {/* Postage Stamp with Loopy */}
            <div className="flex justify-between items-start border-b-2 border-slate-200 pb-4">
              <div>
                <span className="text-xs font-bold text-slate-400 font-mono">DATE: SPECIAL LOVE DAY</span>
                <h3 className="text-lg font-black text-rose-600 font-handwritten text-2xl">Dari Hatiku Yang Terdalam</h3>
              </div>
              <div className="flex items-center gap-2 border-2 border-dashed border-rose-400 rounded-xl p-2 bg-rose-50 text-rose-700">
                <div className="relative w-8 h-8 rounded-lg overflow-hidden border border-black flex-shrink-0">
                  <Image src="/images/loopy/loopy-mascot.jpg" alt="Loopy Stamp" fill sizes="32px" className="object-cover" />
                </div>
                <div className="text-[9px] font-mono font-bold leading-tight">
                  LOOPY POST
                  <br />
                  WITH LOVE 💖
                </div>
              </div>
            </div>

            {/* Letter Body Text */}
            <div className="text-slate-700 text-sm sm:text-base font-medium leading-relaxed space-y-4 whitespace-pre-line">
              {greetingText}
            </div>

            <div className="pt-4 border-t-2 border-slate-100 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400">Selalu menyayangimu,</span>
              <span className="font-handwritten text-3xl text-rose-600 font-black">🤍 Your Favorite Person</span>
            </div>
          </div>

          {/* SECTION B: MEMORY PHOTO GALLERY */}
          <div className="space-y-6">
            <div className="text-center space-y-1">
              <h2 className="text-2xl sm:text-3xl font-black text-black flex items-center justify-center gap-2">
                <span>📸</span> Potret Kenangan Manis Kita
              </h2>
              <p className="text-xs font-semibold text-slate-500">Klik foto untuk melihat dalam ukuran penuh</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {photoList.map((url, idx) => {
                const rotations = ['-rotate-2', 'rotate-2', '-rotate-1', 'rotate-3'];
                const rot = rotations[idx % rotations.length];
                return (
                  <div
                    key={idx}
                    onClick={() => setActivePhoto(url)}
                    className={`bg-white border-3 border-black rounded-2xl p-4 pb-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:scale-[1.03] transition-all cursor-pointer ${rot} group`}
                  >
                    <div className="relative w-full aspect-square bg-slate-100 rounded-xl overflow-hidden border-2 border-black mb-3">
                      <Image
                        src={url}
                        alt={`Kenangan ${idx + 1}`}
                        fill
                        sizes="(max-width: 640px) 100vw, 320px"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        unoptimized
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                        <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 text-black text-[10px] font-black px-3 py-1 rounded-full shadow-md">
                          🔍 Perbesar
                        </span>
                      </div>
                    </div>
                    <div className="text-center font-handwritten text-2xl text-slate-700 font-bold">
                      #{idx + 1} ✨
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* SECTION C: REASONS WHY I LOVE YOU CARDS */}
          <div className="space-y-6">
            <div className="text-center space-y-1">
              <h2 className="text-2xl sm:text-3xl font-black text-black flex items-center justify-center gap-2">
                <span>🌸</span> Hal Kecil Yang Bikin Aku Sayang Kamu
              </h2>
              <p className="text-xs font-semibold text-slate-500">Sentuh kartu di bawah ini untuk melihat alasannya</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { title: 'Senyum Manismu ✨', desc: 'Bikin semua hari-hariku yang berat dan melelahkan terasa ringan seketika.' },
                { title: 'Perhatian Kecilmu 🤍', desc: 'Caramu nanyain kabarku dan peduli selalu bikin hatiku hangat.' },
                { title: 'Tawa Lepasmu 🌸', desc: 'Suara tawamu adalah musik paling indah yang gak pernah bikin bosan.' },
                { title: 'Ketulusan Hatimu 🧸', desc: 'Terima kasih sudah memilih bertahan dan tumbuh bersama aku.' },
              ].map((reason, i) => (
                <div
                  key={i}
                  className="bg-white border-2 border-black rounded-2xl p-5 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-all space-y-2"
                >
                  <div className="flex items-center gap-2 font-black text-sm text-rose-600 font-modern">
                    <span className="w-6 h-6 rounded-full bg-rose-100 border border-black flex items-center justify-center text-xs font-pixel">
                      {i + 1}
                    </span>
                    <span>{reason.title}</span>
                  </div>
                  <p className="text-xs text-slate-600 font-medium leading-relaxed pl-8">
                    {reason.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* SECTION D: INTERACTIVE HUG / LOVE TRIGGER WITH LOOPY */}
          <div className="bg-gradient-to-r from-rose-500 via-pink-500 to-rose-400 border-4 border-black rounded-3xl p-8 text-center text-white space-y-4 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden">
            {/* Particle Burst Spawner */}
            {hugParticles.map((p) => (
              <span
                key={p.id}
                style={
                  {
                    left: `${p.x}%`,
                    top: `${p.y}%`,
                    '--vx': p.vx,
                    '--vy': p.vy,
                  } as React.CSSProperties
                }
                className="absolute text-3xl pointer-events-none particle-burst"
              >
                {p.emoji}
              </span>
            ))}

            <div className="relative w-16 h-16 mx-auto select-none loopy-bounce">
              <Image src="/images/loopy/loopy-mascot.jpg" alt="Loopy Hug" fill className="object-contain rounded-2xl border-2 border-white shadow-lg" />
            </div>

            <h3 className="text-2xl sm:text-3xl font-black">
              Kirim Peluk Virtual Bareng Loopy! 🤗💖
            </h3>
            <p className="text-xs sm:text-sm font-medium text-rose-100 max-w-md mx-auto">
              Tekan tombol di bawah ini sesering mungkin untuk mengirimkan pelukan hangat balik ke aku!
            </p>

            <div className="pt-2">
              <button
                type="button"
                onClick={handleHugClick}
                className="py-4 px-8 bg-white hover:bg-slate-50 text-rose-600 font-black text-sm sm:text-base rounded-2xl border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:scale-95 transition-all cursor-pointer inline-flex items-center gap-2"
              >
                <span>🥰</span>
                <span>Kirim Peluk ({hugCount}x) 💖</span>
              </button>
            </div>
          </div>
        </main>
      )}

      {/* PHOTO ZOOM LIGHTBOX MODAL */}
      {activePhoto && (
        <div
          className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 cursor-pointer animate-fadeIn"
          onClick={() => setActivePhoto(null)}
        >
          <div
            className="bg-white border-4 border-black rounded-3xl p-4 sm:p-6 max-w-lg w-full shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative cursor-default transform animate-scaleUp"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setActivePhoto(null)}
              className="absolute -top-3 -right-3 w-10 h-10 rounded-full bg-rose-500 hover:bg-rose-600 text-white font-black text-sm border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center cursor-pointer transition"
            >
              ✕
            </button>
            <div className="relative w-full aspect-square rounded-2xl overflow-hidden border-2 border-black bg-slate-900 mb-3">
              <Image
                src={activePhoto}
                alt="Kenangan Penuh"
                fill
                sizes="(max-width: 768px) 100vw, 512px"
                className="object-contain"
                unoptimized
              />
            </div>
            <p className="text-center font-handwritten text-2xl text-slate-800 font-black">
              Momen Kenangan Terindah Kita ✨
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
