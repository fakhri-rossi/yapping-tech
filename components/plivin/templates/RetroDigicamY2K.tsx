'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { TemplateProps } from '@type/gift';
import UniversalMusicPlayer from '@components/plivin/common/UniversalMusicPlayer';

interface HeartConfetti {
  id: number;
  x: number;
  y: number;
  scale: number;
  rot: number;
  emoji: string;
}

export default function RetroDigicamY2K({
  recipientName = 'My Bestie',
  greetingText = '',
  photos = [],
  musicUrl = 'https://youtu.be/bY4kEuki5hM?si=WRSvMOw-xXwi7Pzq',
  showBackButton = true,
}: TemplateProps) {
  const [currentPhotoIdx, setCurrentPhotoIdx] = useState(0);
  const [isFlashActive, setIsFlashActive] = useState(false);
  const [filterMode, setFilterMode] = useState<'vivid' | 'bw' | 'cyber' | 'warm'>('vivid');
  const [isZoomed, setIsZoomed] = useState(false);
  const [batteryLevel, setBatteryLevel] = useState('1%');
  const [isPowerOn, setIsPowerOn] = useState(false);
  const [chargeProgress, setChargeProgress] = useState(1);
  const [isCharging, setIsCharging] = useState(false);
  const [wrongAnswerFlash, setWrongAnswerFlash] = useState(false);
  const [quizAnswered, setQuizAnswered] = useState(false);
  const [memoryLeft, setMemoryLeft] = useState('420 MB');
  const [showLetter, setShowLetter] = useState(false);
  const [letterStep, setLetterStep] = useState<'closed' | 'opening' | 'unfolded'>('closed');
  const [hearts, setHearts] = useState<HeartConfetti[]>([]);
  const [typedChars, setTypedChars] = useState(0);

  const defaultMsg = greetingText ||
    `Hai ${recipientName}... 📸✨

Setiap momen yang kita lewatin bareng selalu jadi memori favoritku. Makasih ya udah selalu nemenin dan bikin hari-hariku jauh lebih hidup dan berwarna.

Semoga kamu selalu sehat, bahagia, dan selalu dikelilingi hal-hal baik. Aku bakal selalu ada di sini buat kamu. Happy special day! ❤️`;

  // Demo photos
  const displayPhotos = photos.length > 0 ? photos : [
    'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1494774157365-9e04c6720e47?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1513279922550-250c2129b13a?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?q=80&w=800&auto=format&fit=crop',
  ];

  // Sound effects generator
  const playBeep = useCallback((freq = 800, duration = 0.08) => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch {}
  }, []);

  const triggerShutter = useCallback(() => {
    playBeep(1200, 0.05);
    setIsFlashActive(true);
    setTimeout(() => {
      setIsFlashActive(false);
    }, 180);
  }, [playBeep]);

  const handleNextPhoto = () => {
    triggerShutter();
    setCurrentPhotoIdx((prev) => (prev + 1) % displayPhotos.length);
  };

  const handlePrevPhoto = () => {
    triggerShutter();
    setCurrentPhotoIdx((prev) => (prev - 1 + displayPhotos.length) % displayPhotos.length);
  };

  // Video check helper
  const isVideoUrl = (url: string) => {
    if (!url) return false;
    return (
      url.startsWith('data:video/') ||
      url.endsWith('.mp4') ||
      url.endsWith('.webm') ||
      url.endsWith('.mov') ||
      url.includes('/video/')
    );
  };

  const getFilterStyle = () => {
    switch (filterMode) {
      case 'bw':
        return 'grayscale contrast-125';
      case 'cyber':
        return 'hue-rotate-90 saturate-150 contrast-110';
      case 'warm':
        return 'sepia-[0.35] saturate-125 contrast-105';
      default:
        return 'saturate-125 contrast-110';
    }
  };

  // Y2K Letter Opening Chime
  const playLetterChime = useCallback(() => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6 chord
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.08);
        gain.gain.setValueAtTime(0.18, ctx.currentTime + i * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.08 + 0.35);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + i * 0.08);
        osc.stop(ctx.currentTime + i * 0.08 + 0.36);
      });
    } catch {}
  }, []);

  const openLetterEnvelope = () => {
    playLetterChime();
    setShowLetter(true);
    setLetterStep('opening');
    setTypedChars(0);
    setHearts([]);

    setTimeout(() => {
      setLetterStep('unfolded');
    }, 350);
  };

  const closeLetterEnvelope = () => {
    playBeep(600, 0.06);
    setLetterStep('closed');
    setTimeout(() => {
      setShowLetter(false);
      setHearts([]);
    }, 280);
  };

  // Typewriter effect when unfolded - smooth and gentle typing pace
  useEffect(() => {
    if (letterStep !== 'unfolded') return;
    if (typedChars < defaultMsg.length) {
      const timeout = setTimeout(() => {
        setTypedChars((prev) => Math.min(prev + 1, defaultMsg.length));
      }, 45);
      return () => clearTimeout(timeout);
    }
  }, [letterStep, typedChars, defaultMsg.length]);

  // Reset / Replay experience
  const handleReset = () => {
    playBeep(450, 0.1);
    setIsPowerOn(false);
    setIsCharging(false);
    setChargeProgress(1);
    setBatteryLevel('1%');
    setQuizAnswered(false);
    setWrongAnswerFlash(false);
    setShowLetter(false);
    setLetterStep('closed');
    setCurrentPhotoIdx(0);
    setTypedChars(0);
  };

  // Handle Quiz Battery Power Charge
  const wrongTimerRef = useRef<NodeJS.Timeout | null>(null);

  const handleSelectAnswer = (isCorrect: boolean) => {
    if (!isCorrect) {
      playBeep(350, 0.2);
      setWrongAnswerFlash(true);
      if (wrongTimerRef.current) clearTimeout(wrongTimerRef.current);
      wrongTimerRef.current = setTimeout(() => {
        setWrongAnswerFlash(false);
      }, 3000);
      return;
    }

    if (wrongTimerRef.current) clearTimeout(wrongTimerRef.current);
    setWrongAnswerFlash(false);

    // Correct answer! Start charging sequence (precisely 3 seconds duration)
    playBeep(987.77, 0.1);
    setQuizAnswered(true);
    setIsCharging(true);

    const startTime = Date.now();
    const durationMs = 3000;

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(100, Math.floor((elapsed / durationMs) * 100));

      setChargeProgress(progress);
      setBatteryLevel(`${progress}%`);

      if (progress % 10 === 0) {
        playBeep(550 + progress * 6, 0.03);
      }

      if (elapsed >= durationMs) {
        clearInterval(interval);
        setChargeProgress(100);
        setBatteryLevel('100%');
        playLetterChime(); // Celebratory chime
        setTimeout(() => {
          setIsPowerOn(true);
          setIsCharging(false);
          triggerShutter();
        }, 400);
      }
    }, 50);
  };

  // Timestamp format Y2K: 24/10/'26
  const dateStr = "24/10/'26";
  const [timeStr, setTimeStr] = useState('12:00:00');

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setTimeStr(now.toTimeString().split(' ')[0]);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-[#1c1c22] text-slate-100 font-sans flex flex-col items-center justify-center p-3 sm:p-6 relative overflow-x-hidden">
      {/* Flash Effect Overlay */}
      {isFlashActive && (
        <div className="fixed inset-0 bg-white z-50 pointer-events-none animate-ping opacity-90" />
      )}

      {/* Top Bar: Back button & Replay button */}
      <div className="w-full max-w-lg flex justify-between items-center mb-3 z-20">
        {showBackButton ? (
          <Link
            href="/plivin/gift"
            className="px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs border border-white/20 backdrop-blur-sm transition-all flex items-center gap-1.5"
          >
            <span>←</span> Beranda
          </Link>
        ) : (
          <span />
        )}

        <div className="flex items-center gap-2">
          {/* Ulangi Pengalaman / Reset Button */}
          {isPowerOn && (
            <button
              type="button"
              onClick={handleReset}
              title="Ulangi dari awal"
              className="px-3 py-1.5 rounded-full bg-white/15 hover:bg-white/25 active:scale-95 text-white text-xs border border-white/20 backdrop-blur-sm transition-all flex items-center gap-1.5 cursor-pointer shadow-sm font-semibold"
            >
              <svg className="w-3.5 h-3.5 text-pink-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>Ulangi</span>
            </button>
          )}

          <span className="text-[11px] font-mono text-pink-400 tracking-wider">
            Y2K DIGICAM OPTICAL 3.2MP
          </span>
        </div>
      </div>

      {/* DIGICAM BODY (Silver Chrome Metallic Finish) */}
      <div className="w-full max-w-lg bg-gradient-to-b from-slate-200 via-slate-300 to-slate-400 p-5 sm:p-7 rounded-[36px] border-4 border-slate-600 shadow-[0_25px_60px_rgba(0,0,0,0.8),inset_0_2px_4px_rgba(255,255,255,0.8)] relative text-slate-900">
        {/* Top Metallic Details / Brand */}
        <div className="flex items-center justify-between mb-3 px-1">
          <div className="flex items-center gap-2">
            <span className="font-black text-sm tracking-widest text-slate-700 italic">PLIVIN-CAM</span>
            <span className="text-[9px] bg-slate-800 text-white font-bold px-1.5 py-0.5 rounded">Cyber-shot 2000</span>
          </div>

          <div className="flex items-center gap-3">
            {/* Flash LED Indicator */}
            <div className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 border border-slate-600 shadow-inner animate-pulse" />
              <span className="text-[9px] font-black text-slate-600">READY</span>
            </div>
            {/* Shutter Button on Top */}
            <button
              type="button"
              onClick={handleNextPhoto}
              title="Shutter"
              className="w-10 h-7 bg-gradient-to-b from-slate-100 to-slate-400 border-2 border-slate-600 rounded-full shadow-[0_3px_0_0_#475569] active:translate-y-0.5 active:shadow-none cursor-pointer flex items-center justify-center font-black text-[10px] text-slate-800"
            >
              SNAP
            </button>
          </div>
        </div>

        {/* LCD VIEWFINDER SCREEN BEZEL */}
        <div className="bg-[#0b0c10] p-3 sm:p-4 rounded-2xl border-4 border-slate-700 shadow-inner relative overflow-hidden">
          {/* LCD Screen Display Area */}
          <div
            className={`w-full aspect-[4/3] bg-black rounded-lg relative overflow-hidden border border-zinc-800 transition-all ${
              isZoomed ? 'scale-105' : 'scale-100'
            }`}
          >
            {/* Scanlines / CRT overlay */}
            <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px] z-10 opacity-40" />

            {/* Photo or Video Screen Media */}
            {isVideoUrl(displayPhotos[currentPhotoIdx]) ? (
              <video
                src={displayPhotos[currentPhotoIdx]}
                autoPlay
                loop
                muted
                playsInline
                className={`w-full h-full object-cover transition-all duration-300 ${getFilterStyle()}`}
              />
            ) : (
              <img
                src={displayPhotos[currentPhotoIdx]}
                alt={`Capture ${currentPhotoIdx + 1}`}
                className={`w-full h-full object-cover transition-all duration-300 ${getFilterStyle()}`}
              />
            )}

            {/* OSD (On Screen Display) - Top Bar */}
            <div className="absolute top-2 left-2 right-2 flex items-center justify-between z-20 font-mono text-[10px] sm:text-xs text-emerald-400 drop-shadow-[0_1px_2px_rgba(0,0,0,1)]">
              <div className="flex items-center gap-2">
                <span className="bg-red-600 text-white text-[9px] font-black px-1.5 py-0.2 rounded animate-pulse">
                  REC ●
                </span>
                <span>ISO 400</span>
                <span>F2.8</span>
              </div>
              <div className="flex items-center gap-2">
                <span>[⚡AUTO]</span>
                <span className="text-amber-300">🔋 {batteryLevel}</span>
              </div>
            </div>

            {/* Center Focus Reticle */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
              <div className="w-20 h-20 sm:w-28 sm:h-28 border border-white/60 rounded-sm relative opacity-70">
                <div className="absolute -top-1 -left-1 w-2.5 h-2.5 border-t-2 border-l-2 border-green-400" />
                <div className="absolute -top-1 -right-1 w-2.5 h-2.5 border-t-2 border-r-2 border-green-400" />
                <div className="absolute -bottom-1 -left-1 w-2.5 h-2.5 border-b-2 border-l-2 border-green-400" />
                <div className="absolute -bottom-1 -right-1 w-2.5 h-2.5 border-b-2 border-r-2 border-green-400" />
                <div className="w-1.5 h-1.5 bg-green-400 rounded-full mx-auto my-auto" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }} />
              </div>
            </div>

            {/* OSD - Bottom Bar: Timestamp and Index */}
            <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between z-20 font-mono text-[10px] sm:text-xs text-amber-300 drop-shadow-[0_1px_2px_rgba(0,0,0,1)]">
              <div>
                <span className="mr-2">{dateStr}</span>
                <span>{timeStr}</span>
              </div>
              <div>
                <span>{currentPhotoIdx + 1} / {displayPhotos.length}</span>
              </div>
            </div>

            {/* INITIAL LOW-BATTERY SWEET QUIZ OVERLAY (When Camera is NOT yet Powered On) */}
            {!isPowerOn && (
              <div className="absolute inset-0 z-30 bg-black/94 backdrop-blur-md p-3 sm:p-4 flex flex-col justify-between text-white font-sans overflow-hidden">
                {/* Top Warning Bar */}
                <div className="flex items-center justify-between border-b border-red-500/30 pb-1.5 shrink-0">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                    <span className="text-[10px] sm:text-xs font-mono font-black text-red-400 tracking-wider">
                      ⚠️ BATTERY CRITICAL: {batteryLevel}
                    </span>
                  </div>
                  <span className="text-[8px] sm:text-[9px] font-mono bg-red-950 text-red-300 border border-red-700/60 px-1.5 py-0.5 rounded font-bold">
                    LOW POWER
                  </span>
                </div>

                {/* Charging Progress State */}
                {isCharging ? (
                  <div className="my-auto text-center space-y-3 py-6 px-2">
                    <div className="text-3xl sm:text-4xl animate-bounce">⚡💖</div>
                    <h4 className="text-xs sm:text-sm font-black text-pink-300 tracking-wide">
                      CHARGING DENGAN ENERGI CINTA...
                    </h4>
                    <div className="w-full bg-zinc-800 rounded-full h-3 p-0.5 border border-zinc-700">
                      <div
                        className="bg-gradient-to-r from-pink-500 to-emerald-400 h-full rounded-full transition-all duration-75"
                        style={{ width: `${chargeProgress}%` }}
                      />
                    </div>
                    <p className="text-[11px] font-mono text-emerald-400 font-bold">
                      POWER LEVEL: {chargeProgress}%
                    </p>
                  </div>
                ) : (
                  /* Sweet Quiz / Question prompt with smooth vertical scrollable body */
                  <div className="flex-1 overflow-y-auto overscroll-contain py-2 pr-1 space-y-2 scrollbar-thin">
                    <div className="text-center space-y-0.5 px-1">
                      <p className="text-[10px] sm:text-[11px] text-pink-200/90 font-medium leading-snug">
                        Kamera kehabisan daya nih! Jawab dulu yuk biar kameranya nyala:
                      </p>
                      <h4 className="text-[11px] sm:text-xs font-black text-white px-1 leading-snug pt-0.5">
                        &quot;Apa sih sumber energi & alasan tersenyum terbaikku setiap hari?&quot;
                      </h4>
                    </div>

                    {/* Wrong Answer Feedback Message (3s duration) */}
                    {wrongAnswerFlash && (
                      <div className="p-1.5 rounded-lg bg-red-950/80 border border-red-500/60 text-center animate-shake my-1">
                        <p className="text-[10px] font-bold text-red-300 leading-tight">
                          ❌ Ups, masa itu jawabannya? Coba pilih yang paling benar! 😜
                        </p>
                      </div>
                    )}

                    {/* Quiz Choice Options */}
                    <div className="space-y-1.5 pt-0.5">
                      <button
                        type="button"
                        onClick={() => handleSelectAnswer(false)}
                        className="w-full py-2 px-2.5 sm:py-2.5 sm:px-3 bg-zinc-900/90 hover:bg-zinc-800 active:scale-[0.98] border border-zinc-700/80 rounded-xl text-left text-[11px] sm:text-xs font-semibold text-slate-300 flex items-center justify-between transition cursor-pointer"
                      >
                        <span className="pr-1">A. Kopi Kenangan / Boba manis</span>
                        <span className="text-[10px] text-zinc-500 font-mono shrink-0">☕</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleSelectAnswer(true)}
                        className="w-full py-2 px-2.5 sm:py-2.5 sm:px-3 bg-gradient-to-r from-pink-950/80 to-purple-950/80 hover:from-pink-900 hover:to-purple-900 active:scale-[0.98] border border-pink-500/50 rounded-xl text-left text-[11px] sm:text-xs font-bold text-pink-200 flex items-center justify-between transition cursor-pointer shadow-[0_0_15px_rgba(236,72,153,0.2)]"
                      >
                        <span className="pr-1">B. Senyuman & Kehadiran Kamu 🤍</span>
                        <span className="text-xs shrink-0">✨</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleSelectAnswer(false)}
                        className="w-full py-2 px-2.5 sm:py-2.5 sm:px-3 bg-zinc-900/90 hover:bg-zinc-800 active:scale-[0.98] border border-zinc-700/80 rounded-xl text-left text-[11px] sm:text-xs font-semibold text-slate-300 flex items-center justify-between transition cursor-pointer"
                      >
                        <span className="pr-1">C. Tidur nyenyak 10 jam</span>
                        <span className="text-[10px] text-zinc-500 font-mono shrink-0">😴</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Bottom hint */}
                <div className="pt-1.5 border-t border-zinc-800/80 text-center text-[8px] sm:text-[9px] font-mono text-zinc-500 shrink-0">
                  PLIVIN OPTICAL SECURITY SYSTEM • V2.0
                </div>
              </div>
            )}

          </div>

          {/* LCD Controls Bar underneath screen */}
          <div className="flex items-center justify-between pt-3 px-1 text-slate-300 text-xs font-bold">
            <span className="text-[10px] font-mono text-zinc-400">DISP: 4:3 TFT LCD</span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  playBeep(900);
                  const modes: ('vivid' | 'bw' | 'cyber' | 'warm')[] = ['vivid', 'bw', 'cyber', 'warm'];
                  const nextIdx = (modes.indexOf(filterMode) + 1) % modes.length;
                  setFilterMode(modes[nextIdx]);
                }}
                className="px-2 py-1 bg-zinc-800 hover:bg-zinc-700 text-[10px] text-pink-300 rounded border border-zinc-700 cursor-pointer"
              >
                FILTER: {filterMode.toUpperCase()}
              </button>
              <button
                type="button"
                onClick={() => {
                  playBeep(700);
                  setIsZoomed(!isZoomed);
                }}
                className="px-2 py-1 bg-zinc-800 hover:bg-zinc-700 text-[10px] text-emerald-300 rounded border border-zinc-700 cursor-pointer"
              >
                ZOOM {isZoomed ? '2X' : '1X'}
              </button>
            </div>
          </div>
        </div>

        {/* BOTTOM CAMERA BUTTON CONSOLE */}
        <div className="mt-4 flex items-center justify-between px-2">
          {/* Left Arrow Button */}
          <button
            type="button"
            onClick={handlePrevPhoto}
            className="w-12 h-12 bg-gradient-to-b from-slate-100 to-slate-300 border-2 border-slate-600 rounded-full shadow-[0_3px_0_0_#475569] active:translate-y-0.5 active:shadow-none cursor-pointer flex items-center justify-center font-black text-sm text-slate-800"
          >
            ◀
          </button>

          {/* Center: Open Letter Button or Locked Badge */}
          {isPowerOn ? (
            <button
              type="button"
              onClick={() => {
                if (showLetter) {
                  closeLetterEnvelope();
                } else {
                  openLetterEnvelope();
                }
              }}
              className="px-5 py-2.5 bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white font-black text-xs sm:text-sm rounded-full border-2 border-slate-700 shadow-[0_3px_0_0_#475569] active:translate-y-0.5 active:shadow-none transition-all cursor-pointer flex items-center gap-1.5 animate-bounce-subtle"
            >
              <span>💌</span>
              <span>{showLetter ? 'Lipat Surat' : 'Buka Surat Kado'}</span>
            </button>
          ) : (
            <div className="px-4 py-2 bg-slate-400/50 text-slate-600 font-bold text-xs rounded-full border border-slate-500/60 flex items-center gap-1.5 cursor-not-allowed select-none opacity-80">
              <span>🔒</span>
              <span>Kamera Mati</span>
            </div>
          )}

          {/* Right Arrow Button */}
          <button
            type="button"
            onClick={handleNextPhoto}
            className="w-12 h-12 bg-gradient-to-b from-slate-100 to-slate-300 border-2 border-slate-600 rounded-full shadow-[0_3px_0_0_#475569] active:translate-y-0.5 active:shadow-none cursor-pointer flex items-center justify-center font-black text-sm text-slate-800"
          >
            ▶
          </button>
        </div>

        {/* Thumb Grip & Mic dots decoration */}
        <div className="flex justify-between items-center mt-3 pt-2 border-t border-slate-400/50 px-2 text-[10px] text-slate-600 font-mono">
          <div className="flex gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-500" />
            <span className="w-1.5 h-1.5 rounded-full bg-slate-500" />
            <span className="w-1.5 h-1.5 rounded-full bg-slate-500" />
            <span className="text-[9px] ml-1">MIC</span>
          </div>
          <span className="text-[10px]">TAP SCREEN OR SNAP BUTTON</span>
        </div>
      </div>

      {/* Music Player */}
      <UniversalMusicPlayer
        musicUrl={musicUrl}
        isPlaying={isPowerOn}
        showControls={isPowerOn}
      />

      {/* Google Fonts for Sweet Vintage Handwritten & Serif Typography */}
      <link
        href="https://fonts.googleapis.com/css2?family=Caveat:wght@600;700&family=Playfair+Display:ital,wght@0,600;1,400;1,600&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap"
        rel="stylesheet"
      />

      {/* Animation styles matching Secret Maroon Birthday's smooth luxury fade-in */}
      <style>{`
        @keyframes digicamFadeInUp {
          0% { opacity: 0; transform: translateY(32px) scale(0.96); filter: blur(6px); }
          100% { opacity: 1; transform: translateY(0) scale(1); filter: blur(0px); }
        }
        .digicam-fade-in-up {
          animation: digicamFadeInUp 0.85s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>

      {/* SWEET VINTAGE LETTER POPUP MODAL OVERLAY */}
      {showLetter && (
        <div
          className={`fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 transition-all duration-700 ease-out ${
            letterStep === 'closed'
              ? 'opacity-0 pointer-events-none backdrop-blur-none'
              : 'opacity-100 backdrop-blur-md'
          } bg-black/80`}
          onClick={closeLetterEnvelope}
        >
          {/* Letter Container (stops backdrop click propagation) with Secret Maroon Birthday Fade-in-up */}
          <div
            onClick={(e) => e.stopPropagation()}
            className={`w-full max-w-md relative transition-all duration-700 ease-out transform ${
              letterStep === 'opening'
                ? 'opacity-0 translate-y-8 scale-95 blur-xs'
                : 'opacity-100 translate-y-0 scale-100 blur-none digicam-fade-in-up'
            }`}
          >
            {/* Vintage Cream Paper Body with Natural Real Paper Texture & Border */}
            <div className="bg-[#fbf7ee] text-stone-800 rounded-3xl p-6 sm:p-8 pt-7 border border-[#e8dec8] shadow-[0_25px_60px_rgba(0,0,0,0.6),0_2px_8px_rgba(0,0,0,0.08),inset_0_0_80px_rgba(215,195,155,0.18)] relative overflow-hidden">
              {/* Subtle Real Paper Texture Grain & Ruled Lines */}
              <div className="absolute inset-0 pointer-events-none opacity-25 bg-[radial-gradient(#8c7853_0.75px,transparent_0.75px)] [background-size:12px_12px]" />
              <div className="absolute inset-0 pointer-events-none opacity-30 bg-[linear-gradient(rgba(180,160,130,0.15)_1px,transparent_1px)] bg-[length:100%_30px]" />

              {/* Close Icon Button (Top Right) */}
              <button
                type="button"
                onClick={closeLetterEnvelope}
                aria-label="Tutup Surat"
                className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-stone-200/80 hover:bg-rose-100 text-stone-600 hover:text-rose-600 border border-stone-300/80 transition-all flex items-center justify-center cursor-pointer active:scale-90"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Vintage Mail Stamp Tag (Top Left or below close) */}
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md border border-dashed border-rose-300 bg-rose-50/70 text-[9px] font-mono font-bold tracking-wider text-rose-500 uppercase mb-3">
                <span>💌</span>
                <span>SPECIAL AIRMAIL • 2000s</span>
              </div>

              {/* Salutation with Sweet Script & Serif Font */}
              <div className="relative z-10 mb-3">
                <p
                  style={{ fontFamily: "'Caveat', cursive" }}
                  className="text-rose-500 text-2xl sm:text-3xl font-bold tracking-wide"
                >
                  Dear Sweetheart,
                </p>
                <h3
                  style={{ fontFamily: "'Playfair Display', serif" }}
                  className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight mt-0.5"
                >
                  {recipientName}
                </h3>
              </div>

              {/* Letter Message Body with Realistic Handwritten Feel */}
              <div className="relative z-10 my-3 max-h-[50vh] overflow-y-auto pr-2 space-y-3 scrollbar-thin">
                <p
                  style={{ fontFamily: "'Caveat', cursive" }}
                  className="text-stone-800 text-xl sm:text-2xl leading-[1.6] font-semibold whitespace-pre-wrap select-text"
                >
                  {defaultMsg.slice(0, typedChars)}
                  {typedChars < defaultMsg.length && (
                    <span className="inline-block w-2 h-5 bg-rose-400 ml-1 animate-pulse align-middle" />
                  )}
                </p>
              </div>

              {/* Letter Footer: Sign-off & Date */}
              <div className="relative z-10 mt-5 pt-3 border-t border-[#e5dcce] flex items-center justify-between">
                <div>
                  <p
                    style={{ fontFamily: "'Caveat', cursive" }}
                    className="text-rose-600 text-lg sm:text-xl font-bold"
                  >
                    Forever & Always ✨
                  </p>
                  <p className="text-[10px] font-mono text-stone-400 tracking-wider">
                    {dateStr} • CAPTURED WITH LOVE 📸
                  </p>
                </div>

                <div className="text-xl">
                  <span>🌸</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
