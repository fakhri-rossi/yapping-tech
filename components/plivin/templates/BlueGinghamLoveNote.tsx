'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { TemplateProps } from '@type/gift';
import UniversalMusicPlayer from '@components/plivin/common/UniversalMusicPlayer';

export default function BlueGinghamLoveNote({
  recipientName = 'Sayangku',
  greetingText = '',
  photos = [],
  musicUrl = '/music/can-i-call-u-rose.mp3',
  showBackButton = true,
}: TemplateProps) {
  const [phase, setPhase] = useState<'envelope' | 'opening' | 'scrapbook'>('envelope');
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [envelopeFlapped, setEnvelopeFlapped] = useState(false);
  const [heartParticles, setHeartParticles] = useState<Array<{ id: number; x: number; y: number }>>([]);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Default romantic couple photos matching the reference aesthetic
  const defaultPhotos = [
    'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=800&auto=format&fit=crop', // Kening dicium mesra
    'https://images.unsplash.com/photo-1494774157365-9e04c6720e47?q=80&w=800&auto=format&fit=crop', // Gandengan tangan di pantai
    'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?q=80&w=800&auto=format&fit=crop', // Tangan bentuk hati sunset
    'https://images.unsplash.com/photo-1513279922550-250c2129b13a?q=80&w=800&auto=format&fit=crop', // Ketawa lepas berdua
    'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?q=80&w=800&auto=format&fit=crop', // Kencan cafe santai
    'https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?q=80&w=800&auto=format&fit=crop', // Pelukan senja
  ];

  const displayPhotos = photos && photos.length > 0 ? photos : defaultPhotos;
  const filmStripPhotos = displayPhotos.slice(0, 5); // 5 frames for the 35mm film strip
  const mainPolaroidPhoto = displayPhotos[0];

  const defaultGreeting = greetingText ||
    `Hai ${recipientName}... 💌✨\n\nSelamat hari spesial ya! Terima kasih banyak sudah hadir di hidupku, selalu mendengarkan ceritaku, dan membuat setiap hari terasa jauh lebih berarti dan indah.\n\nAku bersyukur banget bisa melewati banyak tawa, obrolan kecil, dan momen manis bareng kamu. Semoga kamu selalu diliputi kebahagiaan, kesehatan, dan impian-impianmu tercapai satu per satu. I love you more than words can say! 🤍`;

  // Synthetic paper rustle / gentle chime sound on open
  const playEnvelopeSound = () => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!audioContextRef.current) {
        audioContextRef.current = new AudioCtx();
      }
      const ctx = audioContextRef.current;
      if (ctx.state === 'suspended') ctx.resume();

      // Soft melodic chime chord (C5 - E5 - G5 - C6)
      const freqs = [523.25, 659.25, 783.99, 1046.5];
      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.08);

        gain.gain.setValueAtTime(0.001, ctx.currentTime + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.15, ctx.currentTime + idx * 0.08 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + idx * 0.08 + 0.9);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(ctx.currentTime + idx * 0.08);
        osc.stop(ctx.currentTime + idx * 0.08 + 0.95);
      });
    } catch {
      // Audio autoplay policy fallback
    }
  };

  const handleOpenEnvelope = () => {
    if (phase !== 'envelope') return;
    playEnvelopeSound();
    setEnvelopeFlapped(true);
    setPhase('opening');
    setIsPlaying(true);

    // Spawn tiny floating hearts
    const newHearts = Array.from({ length: 12 }).map((_, i) => ({
      id: Date.now() + i,
      x: 35 + Math.random() * 30,
      y: 40 + Math.random() * 20,
    }));
    setHeartParticles(newHearts);

    setTimeout(() => {
      setPhase('scrapbook');
    }, 1100);
  };

  return (
    <div className="relative min-h-screen w-full select-none overflow-x-hidden font-sans text-slate-800 antialiased">
      {/* Dynamic Background: Pastel Baby Blue Gingham Pattern */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          backgroundColor: '#eff6ff',
          backgroundImage: `
            linear-gradient(45deg, rgba(147, 197, 253, 0.35) 25%, transparent 25%),
            linear-gradient(-45deg, rgba(147, 197, 253, 0.35) 25%, transparent 25%),
            linear-gradient(45deg, transparent 75%, rgba(147, 197, 253, 0.35) 75%),
            linear-gradient(-45deg, transparent 75%, rgba(147, 197, 253, 0.35) 75%)
          `,
          backgroundSize: '40px 40px',
          backgroundPosition: '0 0, 0 20px, 20px -20px, -20px 0px',
        }}
      />

      {/* Floating Sparkles & Soft Glow */}
      <div className="fixed inset-0 pointer-events-none z-0 bg-radial from-white/40 via-transparent to-blue-200/20" />

      {/* Navigation / Back Button */}
      {showBackButton && (
        <div className="fixed top-4 left-4 z-50">
          <Link
            href="/plivin/gift"
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/85 backdrop-blur-md border border-blue-200 text-xs font-semibold text-slate-700 shadow-sm hover:bg-white hover:text-blue-600 transition-all hover:scale-105 active:scale-95"
          >
            <span>←</span>
            <span>Kembali</span>
          </Link>
        </div>
      )}

      {/* Music Player */}
      <UniversalMusicPlayer
        musicUrl={musicUrl}
        isPlaying={isPlaying}
        volume={0.75}
        showControls={true}
      />

      {/* ======================================================== */}
      {/* SCREEN 1: ENVELOPE COVER (Click to Open) */}
      {/* ======================================================== */}
      {phase !== 'scrapbook' && (
        <div
          className={`relative z-10 flex min-h-screen flex-col items-center justify-center p-4 transition-all duration-1000 ${
            phase === 'opening' ? 'opacity-0 scale-95 pointer-events-none' : 'opacity-100 scale-100'
          }`}
        >
          {/* Main Envelope Composition */}
          <div
            onClick={handleOpenEnvelope}
            className="group relative cursor-pointer flex flex-col items-center justify-center max-w-sm sm:max-w-md w-full mx-auto p-4 transition-transform duration-300 hover:scale-[1.02] active:scale-[0.98]"
          >
            {/* Ambient Shadow */}
            <div className="absolute inset-x-8 bottom-6 h-12 bg-blue-900/10 rounded-full blur-xl transform group-hover:scale-105 transition-all" />

            {/* Container for Envelope + Camera + Bouquet */}
            <div className="relative w-full aspect-[4/3] flex items-center justify-center">
              
              {/* 1. Envelope Body (Beige Linen / Kraft Texture) */}
              <div className="relative w-64 sm:w-72 h-44 sm:h-48 rounded-xl bg-[#fdfbf7] border-2 border-[#e6decb] shadow-[0_15px_35px_rgba(30,58,138,0.12)] flex items-center justify-center overflow-visible">
                
                {/* Envelope Flap Back (Inside texture) */}
                <div
                  className={`absolute -top-16 inset-x-0 h-20 origin-bottom transition-transform duration-700 ${
                    envelopeFlapped ? 'rotate-x-180 -z-10' : 'rotate-x-0 z-20'
                  }`}
                  style={{
                    clipPath: 'polygon(0% 100%, 50% 0%, 100% 100%)',
                    backgroundColor: '#f5efe0',
                    borderTop: '2px solid #dfd4bf',
                  }}
                />

                {/* Inside Greeting Card sliding out slightly */}
                <div
                  className={`absolute z-10 w-52 sm:w-56 h-36 sm:h-40 bg-white rounded-lg border border-[#ede3cf] shadow-md flex flex-col items-center justify-center p-4 transition-all duration-700 ${
                    envelopeFlapped ? '-translate-y-16 scale-105 shadow-xl' : 'translate-y-0'
                  }`}
                  style={{
                    backgroundImage: 'radial-gradient(#e2e8f0 1px, transparent 1px)',
                    backgroundSize: '12px 12px',
                  }}
                >
                  <p className="font-serif italic text-2xl sm:text-3xl text-slate-800 font-bold tracking-tight text-center">
                    Happy Birthday
                  </p>
                  <p className="text-[11px] sm:text-xs text-slate-500 font-medium mt-1">
                    special note for you
                  </p>
                </div>

                {/* Envelope Bottom Triangle Flaps */}
                <div
                  className="absolute inset-0 z-20 pointer-events-none rounded-xl"
                  style={{
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.4) 0%, transparent 60%)',
                  }}
                />

                {/* Tiny Heart Stickers on Envelope */}
                <div className="absolute right-4 bottom-4 z-30 flex flex-col items-center gap-1 rotate-12">
                  <span className="text-red-500 text-sm filter drop-shadow">❤️</span>
                  <span className="text-red-400 text-xs filter drop-shadow">❤️</span>
                </div>
                <div className="absolute right-12 bottom-5 z-30 -rotate-6">
                  <span className="text-red-500 text-xs filter drop-shadow">❤️</span>
                </div>
              </div>

              {/* 2. Vintage Pocket Camera (Canon G7X style illustration/badge) */}
              <div className="absolute -left-2 sm:-left-6 bottom-4 sm:bottom-6 z-30 w-28 sm:w-32 h-20 sm:h-24 bg-gradient-to-b from-[#fbfbfb] to-[#ececec] rounded-xl border-2 border-slate-300 shadow-[0_8px_20px_rgba(0,0,0,0.12)] p-1.5 flex flex-col justify-between -rotate-6 transition-transform group-hover:-rotate-3">
                {/* Camera Top Details */}
                <div className="flex items-center justify-between px-1">
                  <span className="text-[8px] font-black tracking-widest text-slate-700 uppercase">Canon</span>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-rose-500/80 animate-pulse" />
                    <span className="text-[7px] font-bold text-slate-500">G7X</span>
                  </div>
                </div>

                {/* Camera Big Center Lens */}
                <div className="relative mx-auto w-12 sm:w-14 h-12 sm:h-14 rounded-full bg-gradient-to-br from-slate-800 to-black border-2 border-slate-300 shadow-inner flex items-center justify-center">
                  <div className="w-8 sm:w-9 h-8 sm:h-9 rounded-full bg-gradient-to-tr from-cyan-950 via-slate-900 to-sky-700 flex items-center justify-center border border-cyan-400/40">
                    <div className="w-3 h-3 rounded-full bg-white/30 backdrop-blur-sm shadow-sm" />
                  </div>
                  <span className="absolute bottom-0 text-[5px] text-slate-400 tracking-tighter">ZOOM 4.2x</span>
                </div>

                {/* Shutter Button Mock */}
                <div className="flex justify-between items-center px-1">
                  <div className="w-4 h-1 bg-slate-300 rounded-full" />
                  <div className="w-2.5 h-2.5 bg-slate-400 rounded-full border border-slate-500 shadow-sm" />
                </div>
              </div>

              {/* 3. Blue & Sunflower Bouquet of Flowers */}
              <div className="absolute -right-2 sm:-right-6 bottom-3 sm:bottom-4 z-30 w-32 sm:w-36 h-36 sm:h-40 rotate-12 transition-transform group-hover:rotate-6 filter drop-shadow-[0_10px_20px_rgba(59,130,246,0.2)] pointer-events-none">
                <svg viewBox="0 0 160 160" className="w-full h-full">
                  {/* Blue Wrapping Paper */}
                  <path
                    d="M 40 90 L 80 155 L 120 90 Q 80 110 40 90 Z"
                    fill="#93c5fd"
                    stroke="#60a5fa"
                    strokeWidth="2"
                  />
                  <path
                    d="M 30 75 L 80 155 L 130 75 Q 80 100 30 75 Z"
                    fill="#bfdbfe"
                    opacity="0.8"
                  />
                  {/* Ribbon Bow */}
                  <circle cx="80" cy="115" r="5" fill="#2563eb" />
                  <path d="M 80 115 Q 65 105 60 115 Q 70 125 80 115" fill="#3b82f6" />
                  <path d="M 80 115 Q 95 105 100 115 Q 90 125 80 115" fill="#3b82f6" />
                  <path d="M 77 118 L 70 140 M 83 118 L 90 140" stroke="#2563eb" strokeWidth="2.5" />

                  {/* Foliage / Green Leaves */}
                  <ellipse cx="60" cy="65" rx="12" ry="6" fill="#86efac" transform="rotate(-30 60 65)" />
                  <ellipse cx="100" cy="65" rx="12" ry="6" fill="#86efac" transform="rotate(30 100 65)" />
                  <ellipse cx="80" cy="50" rx="14" ry="7" fill="#4ade80" />

                  {/* Center Big Sunflower */}
                  <g transform="translate(80, 70)">
                    {/* Sunflower Yellow Petals */}
                    {Array.from({ length: 12 }).map((_, idx) => (
                      <ellipse
                        key={idx}
                        cx="0"
                        cy="-16"
                        rx="4"
                        ry="9"
                        fill="#fbbf24"
                        stroke="#f59e0b"
                        strokeWidth="0.5"
                        transform={`rotate(${idx * 30})`}
                      />
                    ))}
                    {/* Brown Seed Center */}
                    <circle cx="0" cy="0" r="10" fill="#78350f" stroke="#451a03" strokeWidth="1" />
                    <circle cx="0" cy="0" r="7" fill="#92400e" strokeDasharray="2 2" stroke="#b45309" strokeWidth="1" />
                  </g>

                  {/* Surrounding Blue & White Baby's Breath Flowers */}
                  <circle cx="55" cy="55" r="7" fill="#60a5fa" stroke="#3b82f6" strokeWidth="1" />
                  <circle cx="55" cy="55" r="2.5" fill="#eff6ff" />

                  <circle cx="105" cy="55" r="7" fill="#93c5fd" stroke="#3b82f6" strokeWidth="1" />
                  <circle cx="105" cy="55" r="2.5" fill="#eff6ff" />

                  <circle cx="80" cy="40" r="6" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" />
                  <circle cx="80" cy="40" r="2" fill="#fbbf24" />

                  <circle cx="65" cy="85" r="5" fill="#bfdbfe" />
                  <circle cx="95" cy="85" r="5" fill="#bfdbfe" />
                </svg>
              </div>
            </div>

            {/* Click Me Text & Cursor Helper */}
            <div className="mt-6 flex flex-col items-center gap-1.5 animate-bounce">
              <span className="font-serif italic text-sm sm:text-base text-slate-600 font-semibold tracking-wide">
                click me! ✨
              </span>
              <div className="w-12 h-1 rounded-full bg-blue-300/60" />
            </div>
          </div>

          {/* Floating Heart Particles during click */}
          {heartParticles.map((h) => (
            <div
              key={h.id}
              className="absolute pointer-events-none animate-float-heart text-rose-500 font-bold"
              style={{
                left: `${h.x}%`,
                top: `${h.y}%`,
              }}
            >
              💖
            </div>
          ))}
        </div>
      )}

      {/* ======================================================== */}
      {/* SCREEN 2: SCRAPBOOK LOVE NOTE CONTENT */}
      {/* ======================================================== */}
      {phase === 'scrapbook' && (
        <main className="relative z-10 w-full max-w-4xl mx-auto px-4 py-12 sm:py-16 space-y-12 animate-fade-in">
          
          {/* Header Title / Tag */}
          <header className="text-center space-y-2">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-blue-100 border border-blue-300 text-blue-700 text-xs font-semibold tracking-wider uppercase shadow-sm">
              <span>💌</span> Special Love Scrapbook
            </span>
            <h1 className="font-serif italic text-3xl sm:text-4xl text-slate-800 font-bold">
              For You, {recipientName}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
              Setiap foto dan kata kecil ini dirangkum khusus untuk merayakan hari bahagiamu.
            </p>
          </header>

          {/* 1. Letter Note & Featured Polaroid Row */}
          <section className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            
            {/* Romantic Handwritten Letter with Washi Tape */}
            <div className="md:col-span-7 relative bg-white/95 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border-2 border-slate-200/90 shadow-[0_12px_30px_rgba(59,130,246,0.08)] transform -rotate-1 hover:rotate-0 transition-transform duration-300">
              
              {/* Top Washi Tape Decoration (Yellow Kraft) */}
              <div
                className="absolute -top-3 left-1/2 -translate-x-1/2 w-28 h-6 bg-amber-200/90 border-l-2 border-r-2 border-dashed border-amber-400 shadow-sm rotate-1"
                style={{ clipPath: 'polygon(0% 0%, 100% 0%, 98% 100%, 2% 100%)' }}
              />

              {/* Lined notebook paper background feel */}
              <div
                className="space-y-4 pt-2 font-medium text-slate-700 text-sm sm:text-base leading-relaxed"
                style={{
                  backgroundImage: 'repeating-linear-gradient(transparent, transparent 31px, #f1f5f9 31px, #f1f5f9 32px)',
                  lineHeight: '32px',
                }}
              >
                {defaultGreeting.split('\n\n').map((para, i) => (
                  <p key={i} className="whitespace-pre-line">
                    {para}
                  </p>
                ))}
              </div>

              {/* Bottom Stamp / Seal */}
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                <span className="italic font-serif">Always & Forever ❤️</span>
                <span className="font-mono text-[11px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded border border-blue-200">
                  VERIFIED WITH LOVE
                </span>
              </div>
            </div>

            {/* Featured Polaroid Photo Card */}
            <div className="md:col-span-5 flex flex-col items-center">
              <div
                onClick={() => setSelectedPhoto(mainPolaroidPhoto)}
                className="group relative cursor-pointer bg-white p-3.5 pb-6 rounded-xl border border-slate-200 shadow-[0_15px_35px_rgba(0,0,0,0.1)] rotate-3 hover:rotate-0 hover:scale-105 transition-all duration-300 max-w-xs w-full"
              >
                {/* Washi Tape Corner */}
                <div className="absolute -top-3 right-6 w-16 h-5 bg-blue-200/80 -rotate-12 border border-blue-300/70 shadow-xs" />

                {/* Photo Frame */}
                <div className="relative aspect-[4/5] w-full overflow-hidden rounded bg-slate-100">
                  <img
                    src={mainPolaroidPhoto}
                    alt={recipientName}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-2">
                    <span className="text-[11px] text-white font-medium bg-black/50 px-2 py-0.5 rounded-full backdrop-blur-xs">
                      🔍 Klik untuk zoom
                    </span>
                  </div>
                </div>

                {/* Handwritten Polaroid Caption */}
                <p className="mt-3 text-center font-serif italic text-sm text-slate-600 font-semibold">
                  my favorite human 🤍
                </p>
              </div>
            </div>
          </section>

          {/* 2. 35mm Film Roll Strip (Horizontal Roll Klise Kenangan) */}
          <section className="relative space-y-4 pt-4">
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-2">
                <span className="text-xl">🎞️</span>
                <h2 className="font-serif italic text-xl sm:text-2xl text-slate-800 font-bold">
                  Roll Klise 35mm Kenangan
                </h2>
              </div>
              <span className="text-xs text-slate-500 hidden sm:inline-block">
                Tap tiap frame untuk melihat detail foto
              </span>
            </div>

            {/* 35mm Film Strip Container */}
            <div className="relative w-full rounded-2xl bg-neutral-900 border-2 border-neutral-700 p-4 sm:p-5 shadow-[0_20px_40px_rgba(0,0,0,0.35)] overflow-hidden">
              
              {/* Pink Ribbon & Gold Star Corner Stickers */}
              <div className="absolute -top-1 -left-1 z-20 pointer-events-none">
                <svg width="48" height="48" viewBox="0 0 48 48">
                  {/* Pink Ribbon Bow */}
                  <path d="M 12 12 Q 24 8 28 20 Q 18 24 12 12" fill="#f472b6" stroke="#db2777" strokeWidth="1.5" />
                  <path d="M 12 12 Q 8 24 20 28 Q 24 18 12 12" fill="#f472b6" stroke="#db2777" strokeWidth="1.5" />
                  <circle cx="12" cy="12" r="3" fill="#ec4899" />
                  <path d="M 12 12 L 4 32 M 12 12 L 32 4" stroke="#db2777" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>

              <div className="absolute -bottom-1 -right-1 z-20 pointer-events-none text-2xl filter drop-shadow">
                ⭐
              </div>

              {/* Top Film Sprocket Holes */}
              <div className="flex justify-between items-center pb-3 overflow-hidden border-b border-neutral-800">
                {Array.from({ length: 24 }).map((_, idx) => (
                  <div
                    key={idx}
                    className="w-3 sm:w-4 h-2 sm:h-2.5 rounded-xs bg-neutral-950 border border-neutral-700/80 mx-1 shrink-0"
                  />
                ))}
              </div>

              {/* Frames Gallery */}
              <div className="flex gap-3 sm:gap-4 py-4 overflow-x-auto no-scrollbar scroll-smooth">
                {filmStripPhotos.map((photo, index) => (
                  <div
                    key={index}
                    onClick={() => setSelectedPhoto(photo)}
                    className="group relative flex-shrink-0 w-44 sm:w-52 cursor-pointer flex flex-col items-center bg-black rounded border border-neutral-800 p-2 hover:border-blue-400 transition-all hover:scale-[1.03]"
                  >
                    {/* Frame Aspect */}
                    <div className="relative aspect-[4/3] w-full overflow-hidden rounded bg-neutral-900">
                      <img
                        src={photo}
                        alt={`Memori ${index + 1}`}
                        className="w-full h-full object-cover filter contrast-[1.05] brightness-95 group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>

                    {/* Film Code Info */}
                    <div className="w-full flex justify-between items-center pt-2 px-1 text-[9px] font-mono text-neutral-400 tracking-wider">
                      <span>PLV-400</span>
                      <span className="text-amber-400">FRAME 0{index + 1}</span>
                      <span>35MM</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Bottom Film Sprocket Holes */}
              <div className="flex justify-between items-center pt-3 overflow-hidden border-t border-neutral-800">
                {Array.from({ length: 24 }).map((_, idx) => (
                  <div
                    key={idx}
                    className="w-3 sm:w-4 h-2 sm:h-2.5 rounded-xs bg-neutral-950 border border-neutral-700/80 mx-1 shrink-0"
                  />
                ))}
              </div>
            </div>
          </section>

          {/* 3. Sweet Bottom Note / Interactive Wishes */}
          <section className="bg-blue-50/80 border-2 border-blue-200/80 rounded-2xl p-6 sm:p-8 text-center space-y-4 shadow-sm">
            <span className="text-3xl">🌻💌📸</span>
            <h3 className="font-serif italic text-xl sm:text-2xl text-slate-800 font-bold">
              Terima Kasih Telah Menjadi Bagian Terindah
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto leading-relaxed">
              Semoga hari ini dan hari-hari berikutnya selalu membawa senyuman di wajahmu. Kado digital ini akan aktif selamanya agar bisa dibuka kapan pun kamu rindu.
            </p>
            <div className="pt-2">
              <button
                type="button"
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-blue-600 text-white font-semibold text-xs shadow-md hover:bg-blue-700 hover:scale-105 active:scale-95 transition-all"
              >
                <span>↑</span>
                <span>Kembali ke Atas</span>
              </button>
            </div>
          </section>
        </main>
      )}

      {/* ======================================================== */}
      {/* PHOTO ZOOM MODAL */}
      {/* ======================================================== */}
      {selectedPhoto && (
        <div
          onClick={() => setSelectedPhoto(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-lg w-full bg-white rounded-2xl p-3 shadow-2xl overflow-hidden animate-scale-up"
          >
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center text-sm font-bold hover:bg-black transition-colors"
            >
              ✕
            </button>
            <div className="relative aspect-[4/5] w-full rounded-xl overflow-hidden bg-slate-100">
              <img
                src={selectedPhoto}
                alt="Kenangan"
                className="w-full h-full object-cover"
              />
            </div>
            <p className="mt-3 text-center text-xs text-slate-500 font-medium font-serif italic">
              Kenangan Indah Bersamamu 🤍
            </p>
          </div>
        </div>
      )}

      {/* Custom Keyframe Animations */}
      <style jsx global>{`
        @keyframes floatHeart {
          0% {
            opacity: 1;
            transform: translateY(0) scale(0.8) rotate(0deg);
          }
          50% {
            opacity: 0.9;
            transform: translateY(-40px) scale(1.2) rotate(15deg);
          }
          100% {
            opacity: 0;
            transform: translateY(-90px) scale(1.5) rotate(-15deg);
          }
        }
        .animate-float-heart {
          animation: floatHeart 1.2s ease-out forwards;
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}

