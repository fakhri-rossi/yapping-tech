'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { TemplateProps } from '@type/gift';
import UniversalMusicPlayer from '@components/plivin/common/UniversalMusicPlayer';
import UniversalVideoPlayer from '@components/plivin/common/UniversalVideoPlayer';

export default function VintageCamera({
  recipientName = 'My Favorite Person',
  greetingText = '',
  photos = [],
  musicUrl = 'https://www.youtube.com/watch?v=02Jw2b1BMYo',
  showBackButton = true,
}: TemplateProps) {
  const [started, setStarted] = useState(false);
  const [currentPage, setCurrentPage] = useState(-1);
  const [musicPlaying, setMusicPlaying] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [filterMode, setFilterMode] = useState<'vhs' | 'noir' | 'neon' | 'normal'>('vhs');
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [flashBlink, setFlashBlink] = useState(false);
  const [focusPos, setFocusPos] = useState<{ x: number; y: number } | null>(null);

  const TOTAL_PAGES = 4;
  const targetVideo = photos.length > 0 ? photos[0] : 'https://www.youtube.com/watch?v=02Jw2b1BMYo';

  const finalMsg = greetingText ||
    `Dunia ini penuh dengan jutaan keindahan yang samar, namun hanya wajahmu yang selalu tertangkap dengan fokus sempurna dalam pikiranku. Setiap detik bersamamu adalah adegan favoritku. Aku sayang kamu, ${recipientName}! ❤️`;

  // Timecode counter state
  const [timecode, setTimecode] = useState('00:00:00:00');
  useEffect(() => {
    if (!started || currentPage !== 3) return;
    let frames = 0, seconds = 0, minutes = 0, hours = 0;
    const interval = setInterval(() => {
      frames++;
      if (frames >= 60) { frames = 0; seconds++; }
      if (seconds >= 60) { seconds = 0; minutes++; }
      if (minutes >= 60) { minutes = 0; hours++; }
      const h = hours.toString().padStart(2, '0');
      const m = minutes.toString().padStart(2, '0');
      const s = seconds.toString().padStart(2, '0');
      const f = frames.toString().padStart(2, '0');
      setTimecode(`${h}:${m}:${s}:${f}`);
    }, 1000 / 60);
    return () => clearInterval(interval);
  }, [started, currentPage]);

  const [bootProgress, setBootProgress] = useState(0);

  // Auto-booting loading effect
  useEffect(() => {
    if (started) return;

    const interval = setInterval(() => {
      setBootProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 4;
      });
    }, 60);

    return () => clearInterval(interval);
  }, [started]);

  // Audio shutter & beep synthesis
  const triggerShutter = useCallback(() => {
    setFlashBlink(true);
    setTimeout(() => setFlashBlink(false), 150);
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(700, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(120, ctx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.25, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.09);
    } catch {}
  }, []);

  const handleStart = () => {
    triggerShutter();
    setStarted(true);
    setMusicPlaying(true);
    setCurrentPage(0);
  };

  const goToPage = useCallback((idx: number) => {
    if (idx < 0 || idx >= TOTAL_PAGES) return;
    triggerShutter();
    setCurrentPage(idx);
  }, [triggerShutter]);

  const handleViewfinderClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setFocusPos({ x, y });
    setTimeout(() => setFocusPos(null), 1200);

    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1200, ctx.currentTime);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.05);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.06);
    } catch {}
  };

  // Keyboard & Swipe support
  useEffect(() => {
    let sx = 0, sy = 0;
    function ts(e: TouchEvent) { sx = e.changedTouches[0].screenX; sy = e.changedTouches[0].screenY; }
    function te(e: TouchEvent) {
      const dx = sx - e.changedTouches[0].screenX;
      const dy = sy - e.changedTouches[0].screenY;
      if (Math.abs(dx) < 50 || Math.abs(dx) < Math.abs(dy)) return;
      if (currentPage < 0) return;
      if (dx > 0 && currentPage < TOTAL_PAGES - 1) goToPage(currentPage + 1);
      else if (dx < 0 && currentPage > 0) goToPage(currentPage - 1);
    }

    function handleKeyDown(e: KeyboardEvent) {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)) return;
      if (!started) return;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        goToPage(Math.min(currentPage + 1, TOTAL_PAGES - 1));
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        goToPage(Math.max(currentPage - 1, 0));
      }
    }

    document.addEventListener('touchstart', ts, { passive: true });
    document.addEventListener('touchend', te, { passive: true });
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('touchstart', ts);
      document.removeEventListener('touchend', te);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [started, currentPage, goToPage]);

  const pc = (idx: number) => currentPage === idx ? 'cam-page active' : 'cam-page';

  return (
    <div className="cam-root">
      <style>{`
        .cam-root {
          min-height: 100vh; min-height: 100dvh;
          width: 100%; height: 100%; flex: 1;
          background-color: #050505; color: #fff;
          overflow: hidden; position: relative;
          font-family: 'Inter', sans-serif;
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
        }

        .cam-noise {
          position: absolute; inset: 0; width: 100%; height: 100%; pointer-events: none; z-index: 5; opacity: 0.05;
          background: url('data:image/svg+xml,%3Csvg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"%3E%3Cfilter id="noiseFilter"%3E%3CfeTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch"/%3E%3C/filter%3E%3Crect width="100%25" height="100%25" filter="url(%23noiseFilter)"/%3E%3C/svg%3E');
        }

        .cam-page {
          position: absolute; inset: 0; width: 100%; height: 100%;
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          padding: 1.5rem; opacity: 0; visibility: hidden;
          transition: opacity 0.8s, visibility 0.8s, transform 0.8s, filter 0.8s;
          transform: scale(0.7) translateZ(-500px);
          filter: blur(10px); z-index: 10; overflow-y: auto;
        }
        .cam-page.active { opacity: 1; visibility: visible; transform: scale(1) translateZ(0); filter: blur(0); }

        .cam-glass {
          background: rgba(15,15,15,0.75);
          backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255,255,255,0.18);
          box-shadow: 0 20px 50px rgba(0,0,0,0.7);
          border-radius: 24px; padding: 2.5rem 2rem;
          max-width: 480px; width: 100%; text-align: center;
          position: relative; overflow: hidden;
          margin: auto;
        }

        .cam-btn-red {
          width: 100%; padding: 14px 24px;
          background: #ef4444; color: white;
          font-weight: 700; font-size: 0.875rem;
          letter-spacing: 0.15em; text-transform: uppercase;
          border-radius: 9999px; border: none; cursor: pointer;
          transition: all 0.3s;
          box-shadow: 0 4px 15px rgba(239, 68, 68, 0.4);
        }
        .cam-btn-red:hover { background: #dc2626; transform: translateY(-2px); box-shadow: 0 6px 20px rgba(239, 68, 68, 0.6); }

        /* Viewfinder UI Overlay */
        .corner-tl { position: absolute; top: 5%; left: 5%; border-top: 3px solid rgba(255,255,255,0.8); border-left: 3px solid rgba(255,255,255,0.8); width: 36px; height: 36px; pointer-events: none; }
        .corner-tr { position: absolute; top: 5%; right: 5%; border-top: 3px solid rgba(255,255,255,0.8); border-right: 3px solid rgba(255,255,255,0.8); width: 36px; height: 36px; pointer-events: none; }
        .corner-bl { position: absolute; bottom: 5%; left: 5%; border-bottom: 3px solid rgba(255,255,255,0.8); border-left: 3px solid rgba(255,255,255,0.8); width: 36px; height: 36px; pointer-events: none; }
        .corner-br { position: absolute; bottom: 5%; right: 5%; border-bottom: 3px solid rgba(255,255,255,0.8); border-right: 3px solid rgba(255,255,255,0.8); width: 36px; height: 36px; pointer-events: none; }

        .crosshair {
          position: absolute; top: 50%; left: 50%;
          transform: translate(-50%, -50%);
          width: 50px; height: 50px; pointer-events: none; z-index: 20;
        }
        .crosshair::before { content: ''; position: absolute; top: 50%; left: -8px; right: -8px; height: 1px; background: rgba(255,255,255,0.5); }
        .crosshair::after { content: ''; position: absolute; left: 50%; top: -8px; bottom: -8px; width: 1px; background: rgba(255,255,255,0.5); }

        .rec-dot { animation: recBlink 1.2s infinite; }
        @keyframes recBlink { 0%, 49% { opacity: 1; } 50%, 100% { opacity: 0; } }

        .cam-intro {
          position: absolute; inset: 0; width: 100%; height: 100%; z-index: 50;
          display: flex; align-items: center; justify-content: center;
          background: #050505; transition: opacity 1s;
        }
        .cam-intro.hidden { opacity: 0; pointer-events: none; }

        .cam-dots { position: fixed; bottom: 1.5rem; left: 50%; transform: translateX(-50%); display: flex; gap: 8px; z-index: 99; }
        .cam-dot { width: 8px; height: 8px; border-radius: 50%; background: rgba(255,255,255,0.25); transition: all 0.3s; }
        .cam-dot.active { background: #ef4444; width: 24px; border-radius: 999px; }

        /* Filter Styles */
        .filter-vhs { filter: sepia(0.35) contrast(1.15) saturate(1.2) hue-rotate(-10deg); }
        .filter-noir { filter: grayscale(1) contrast(1.3) brightness(0.9); }
        .filter-neon { filter: contrast(1.25) saturate(1.8) hue-rotate(20deg); }
        .filter-normal { filter: none; }

        /* Focus Animation */
        @keyframes focusPulse {
          0% { transform: translate(-50%, -50%) scale(1.6); opacity: 0; }
          50% { transform: translate(-50%, -50%) scale(1); opacity: 1; border-color: #22c55e; }
          100% { transform: translate(-50%, -50%) scale(1); opacity: 0.8; border-color: #eab308; }
        }
      `}</style>

      {/* eslint-disable-next-line @next/next/no-page-custom-font */}
      <link href="https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Inter:wght@300;400;600;800&family=Playfair+Display:ital,wght@0,600;1,400&family=Dancing+Script:wght@400;700&display=swap" rel="stylesheet" />

      {/* Flash Effect Overlay */}
      {flashBlink && (
        <div className="fixed inset-0 bg-white z-[100] pointer-events-none transition-opacity duration-150" />
      )}

      {/* Universal Audio/Music Player */}
      <UniversalMusicPlayer musicUrl={musicUrl} isPlaying={started && musicPlaying} />

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

      {/* Top Right Floating Controls: Maximize Button */}
      {started && (
        <div className="fixed top-4 right-16 z-50 flex items-center gap-2">
          {currentPage === 3 && (
            <button
              type="button"
              onClick={() => setIsMaximized(!isMaximized)}
              className="p-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white border border-white/30 transition-all shadow-lg backdrop-blur-md flex items-center justify-center cursor-pointer"
              title={isMaximized ? 'Minimize Viewfinder' : 'Maximize Fullscreen'}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                {isMaximized ? (
                  <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3" />
                ) : (
                  <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
                )}
              </svg>
            </button>
          )}
        </div>
      )}

      {/* Navigation Progress Dots */}
      {started && (
        <div className="cam-dots">
          {Array.from({ length: TOTAL_PAGES }).map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => goToPage(i)}
              className={`cam-dot cursor-pointer border-none outline-none transition-all hover:scale-125 ${currentPage === i ? 'active' : ''}`}
              title={`Ke Halaman ${i + 1}`}
            />
          ))}
        </div>
      )}

      {/* Booting Loading Intro Screen */}
      <div className={`cam-intro ${started ? 'hidden' : ''}`} onClick={handleStart}>
        <div style={{ textAlign: 'center', maxWidth: 360, width: '100%', padding: '0 20px' }}>
          <div style={{ width: 96, height: 96, margin: '0 auto 24px', border: '2px solid rgba(255,255,255,0.2)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }} className="animate-pulse">
            <span style={{ fontSize: '2.5rem' }}>🎥</span>
          </div>
          <div className="font-mono text-xs uppercase tracking-widest text-slate-200 mb-3 font-bold">
            {bootProgress < 100 ? `[ BOOTING VINTAGE TAPE... ${bootProgress}% ]` : '[ VINTAGE TAPE READY! ]'}
          </div>
          <div className="w-full bg-slate-900/90 rounded-full h-2.5 overflow-hidden border border-white/20 p-0.5 shadow-inner mb-5">
            <div
              className="bg-red-500 h-full rounded-full transition-all duration-100 ease-out shadow-[0_0_12px_#ef4444]"
              style={{ width: `${bootProgress}%` }}
            />
          </div>
          <button
            type="button"
            onClick={handleStart}
            className="w-full py-3.5 px-6 bg-red-600 hover:bg-red-700 text-white font-mono font-bold text-xs uppercase tracking-widest rounded-full transition-all duration-300 shadow-[0_0_20px_rgba(239,68,68,0.6)] cursor-pointer hover:scale-105 active:scale-95"
          >
            {bootProgress < 100 ? '[ KLIK UNTUK MEMUTAR REKAMAN ]' : '[ 🔴 TAP UNTUK PUTAR REKAMAN ]'}
          </button>
        </div>
      </div>

      {/* Step 1 */}
      <div className={pc(0)}>
        <div className="cam-glass">
          <span style={{ fontSize: '2.5rem', marginBottom: 16, display: 'block' }}>📼</span>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.75rem', color: '#ef4444', fontWeight: 700, marginBottom: 16 }}>Memulai Rekaman...</h2>
          <p style={{ fontSize: '0.875rem', color: '#cbd5e1', lineHeight: 1.6, marginBottom: 24 }}>
            Ada satu pita memori berharga yang ingin kuputar kembali bersamamu. Setiap frame, setiap tawa, dan setiap detik yang terlewat bersamamu adalah bagian terindah dalam hidupku.
          </p>
          <button className="cam-btn-red" onClick={() => goToPage(1)}>Putar Pita Memori →</button>
        </div>
      </div>

      {/* Step 2 */}
      <div className={pc(1)}>
        <div className="cam-glass">
          <span style={{ fontSize: '2.5rem', marginBottom: 16, display: 'block' }}>💫</span>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.75rem', color: 'white', fontWeight: 700, marginBottom: 16 }}>Di Balik Lensa</h2>
          <p style={{ fontSize: '0.875rem', color: '#cbd5e1', lineHeight: 1.6, marginBottom: 24 }}>
            Dunia ini penuh dengan jutaan keindahan yang samar, namun hanya wajahmu yang selalu tertangkap dengan fokus sempurna dalam pikiranku. Bersamamu, hal-hal sederhana berubah menjadi adegan sinematik penuh kehangatan.
          </p>
          <button className="cam-btn-red" onClick={() => goToPage(2)}>Lihat Adegan Terfavorit →</button>
        </div>
      </div>

      {/* Step 3 */}
      <div className={pc(2)}>
        <div className="cam-glass">
          <span style={{ fontSize: '2.5rem', marginBottom: 16, display: 'block' }}>❤️</span>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.75rem', color: '#ef4444', fontWeight: 700, marginBottom: 16 }}>Selamanya Terekam</h2>
          <p style={{ fontSize: '0.875rem', color: '#cbd5e1', lineHeight: 1.6, marginBottom: 24 }}>
            Hari ini adalah hari istimewamu. Hari di mana semesta menghadiahkan senyuman terindahmu untuk duniaku. Kuharap kita akan terus merekam ribuan memori indah lainnya di tahun-tahun mendatang.
          </p>
          <button className="cam-btn-red" onClick={() => goToPage(3)}>Putar Proyektor Utama 🎬</button>
        </div>
      </div>

      {/* Step 4: Camera Viewfinder */}
      <div className={pc(3)}>
        <div className="w-full max-w-4xl flex flex-col items-center justify-center mx-auto my-auto py-4 px-2">
          <div style={{ textAlign: 'center', marginBottom: 16 }}>
            <h1 style={{ fontSize: 'clamp(1.4rem, 4vw, 2.25rem)', fontWeight: 900, color: 'white', textTransform: 'uppercase' }}>
              Happy Birthday {recipientName} ❤️
            </h1>
            <p style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '0.75rem', color: '#ef4444', letterSpacing: '0.15em', marginTop: 4 }}>
              [ RECORDING THE DEAREST MOMENTS ]
            </p>
          </div>

          {/* Viewfinder Frame Container */}
          <div
            onClick={handleViewfinderClick}
            style={{
              width: '100%',
              position: 'relative',
              background: 'black',
              borderRadius: 16,
              border: '4px solid #1e293b',
              overflow: 'hidden',
              aspectRatio: '16/9',
              boxShadow: '0 0 50px rgba(0,0,0,0.9)',
              cursor: 'crosshair',
            }}
          >
            {/* Video Player with Scale Zoom and Filter Effects */}
            <div
              className={`w-full h-full transition-transform duration-300 ease-out filter-${filterMode}`}
              style={{ transform: `scale(${zoomLevel})` }}
            >
              <UniversalVideoPlayer videoUrl={targetVideo} muted={true} controls={false} pointerEventsNone={true} />
            </div>

            {/* Tap-to-Focus Indicator */}
            {focusPos && (
              <div
                className="absolute w-12 h-12 border-2 border-green-400 rounded-sm pointer-events-none z-30"
                style={{
                  left: focusPos.x,
                  top: focusPos.y,
                  animation: 'focusPulse 1.2s ease-out forwards',
                }}
              />
            )}

            {/* Viewfinder Overlay HUD */}
            <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 20 }}>
              <div className="corner-tl" />
              <div className="corner-tr" />
              <div className="corner-bl" />
              <div className="corner-br" />
              <div className="crosshair" />

              {/* Top Bar HUD */}
              <div style={{ position: 'absolute', top: 12, left: 16, right: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: "'Share Tech Mono', monospace", fontSize: 11, color: 'rgba(255,255,255,0.9)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{ width: 10, height: 10, background: '#ef4444', borderRadius: '50%' }} className="rec-dot" />
                  <span style={{ color: '#ef4444', fontWeight: 'bold', letterSpacing: '0.15em' }}>REC</span>
                </div>
                <div>FILTER: {filterMode.toUpperCase()}</div>
                <div>ZOOM: {zoomLevel}x</div>
              </div>

              {/* Bottom Bar HUD */}
              <div style={{ position: 'absolute', bottom: 12, left: 16, right: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', fontFamily: "'Share Tech Mono', monospace", fontSize: 11, color: 'rgba(255,255,255,0.9)' }}>
                <div>
                  <div>F2.8</div>
                  <div>ISO 800</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '1.1rem', fontWeight: 'bold', letterSpacing: '0.15em' }}>{timecode}</div>
                  <div style={{ fontSize: 8, opacity: 0.6 }}>TIMECODE</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div>4K 60FPS</div>
                  <div>AF-C</div>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Controls Toolbar Below Viewfinder */}
          <div className="w-full flex flex-wrap items-center justify-between gap-3 mt-4 px-2">
            {/* Filter Selector */}
            <div className="flex items-center gap-1 bg-black/60 backdrop-blur-md p-1.5 rounded-xl border border-white/20 text-xs font-mono">
              <span className="text-[10px] text-slate-400 px-2 font-bold">MODE:</span>
              <button
                type="button"
                onClick={() => setFilterMode('vhs')}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${filterMode === 'vhs' ? 'bg-red-600 text-white font-bold' : 'text-slate-300 hover:text-white'}`}
              >
                📼 VHS
              </button>
              <button
                type="button"
                onClick={() => setFilterMode('noir')}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${filterMode === 'noir' ? 'bg-red-600 text-white font-bold' : 'text-slate-300 hover:text-white'}`}
              >
                🎞️ NOIR
              </button>
              <button
                type="button"
                onClick={() => setFilterMode('neon')}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${filterMode === 'neon' ? 'bg-red-600 text-white font-bold' : 'text-slate-300 hover:text-white'}`}
              >
                🔴 NEON
              </button>
              <button
                type="button"
                onClick={() => setFilterMode('normal')}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${filterMode === 'normal' ? 'bg-red-600 text-white font-bold' : 'text-slate-300 hover:text-white'}`}
              >
                ✨ ORIGINAL
              </button>
            </div>

            {/* Zoom Controls & Fullscreen Trigger */}
            <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md p-1.5 rounded-xl border border-white/20 text-xs font-mono">
              <span className="text-[10px] text-slate-400 px-2 font-bold">ZOOM:</span>
              <button
                type="button"
                onClick={() => setZoomLevel(1)}
                className={`px-2 py-1 rounded-lg transition-all cursor-pointer ${zoomLevel === 1 ? 'bg-white text-black font-bold' : 'text-slate-300 hover:text-white'}`}
              >
                1x
              </button>
              <button
                type="button"
                onClick={() => setZoomLevel(1.5)}
                className={`px-2 py-1 rounded-lg transition-all cursor-pointer ${zoomLevel === 1.5 ? 'bg-white text-black font-bold' : 'text-slate-300 hover:text-white'}`}
              >
                1.5x
              </button>
              <button
                type="button"
                onClick={() => setZoomLevel(2)}
                className={`px-2 py-1 rounded-lg transition-all cursor-pointer ${zoomLevel === 2 ? 'bg-white text-black font-bold' : 'text-slate-300 hover:text-white'}`}
              >
                2x
              </button>
              <button
                type="button"
                onClick={() => setIsMaximized(true)}
                className="ml-2 px-3 py-1 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1"
                title="Perbesar Layar Viewfinder"
              >
                <span>🗖</span> MAXIMIZE
              </button>
            </div>
          </div>

          <p style={{ textAlign: 'center', marginTop: 20, fontFamily: "'Dancing Script', cursive", fontSize: '1.5rem', color: '#e2e8f0' }}>
            {finalMsg}
          </p>
        </div>
      </div>

      {/* Fullscreen Maximize Viewfinder Modal Popup */}
      {isMaximized && (
        <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-2xl flex flex-col items-center justify-center p-4 md:p-8 animate-fade-in">
          {/* Close / Minimize Button */}
          <div className="w-full max-w-5xl flex justify-between items-center mb-3 text-white font-mono">
            <div className="flex items-center gap-2 text-xs font-bold text-red-500">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
              <span>FULLSCREEN RECORDING MODE</span>
            </div>
            <button
              type="button"
              onClick={() => setIsMaximized(false)}
              className="px-4 py-2 bg-white text-black hover:bg-slate-200 font-extrabold text-xs rounded-xl border border-white transition-all cursor-pointer flex items-center gap-2 shadow-lg"
            >
              <span>🗗</span> MINIMIZE VIEW
            </button>
          </div>

          {/* Big Viewfinder Container */}
          <div
            onClick={handleViewfinderClick}
            className={`w-full max-w-5xl relative bg-black rounded-2xl border-4 border-slate-800 overflow-hidden aspectRatio-16/9 shadow-[0_0_80px_rgba(239,68,68,0.3)] filter-${filterMode}`}
            style={{ aspectRatio: '16/9' }}
          >
            <div
              className="w-full h-full transition-transform duration-300 ease-out"
              style={{ transform: `scale(${zoomLevel})` }}
            >
              <UniversalVideoPlayer videoUrl={targetVideo} muted={true} controls={false} pointerEventsNone={true} />
            </div>

            {/* Tap-to-Focus Indicator */}
            {focusPos && (
              <div
                className="absolute w-14 h-14 border-2 border-green-400 rounded-sm pointer-events-none z-30"
                style={{
                  left: focusPos.x,
                  top: focusPos.y,
                  animation: 'focusPulse 1.2s ease-out forwards',
                }}
              />
            )}

            {/* Viewfinder HUD */}
            <div className="absolute inset-0 pointer-events-none z-20">
              <div className="corner-tl" />
              <div className="corner-tr" />
              <div className="corner-bl" />
              <div className="corner-br" />
              <div className="crosshair" />

              <div className="absolute top-4 left-6 right-6 flex justify-between items-center font-mono text-xs text-white/90 font-bold">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full rec-dot" />
                  <span className="text-red-500 tracking-widest">REC</span>
                </div>
                <div>4K CINEMATIC — 60FPS</div>
                <div>BAT 100%</div>
              </div>

              <div className="absolute bottom-4 left-6 right-6 flex justify-between items-end font-mono text-xs text-white/90">
                <div>
                  <div>F2.8</div>
                  <div>ISO 800</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold tracking-widest text-red-500">{timecode}</div>
                  <div className="text-[9px] opacity-60">TIMECODE</div>
                </div>
                <div className="text-right">
                  <div>AWB</div>
                  <div>AF-C</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
