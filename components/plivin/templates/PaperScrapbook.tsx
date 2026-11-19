'use client';

import { useState, useRef, useCallback } from 'react';
import { TemplateProps } from '@type/gift';
import UniversalMusicPlayer from '@components/plivin/common/UniversalMusicPlayer';
import UniversalVideoPlayer from '@components/plivin/common/UniversalVideoPlayer';
import Link from 'next/link';
import Image from 'next/image';

/* ============================================================
   Paper Scrapbook Memory — Interactive scrapbook template
   Migrated from template-paper.html
   ============================================================ */

export default function PaperScrapbook({
  recipientName = 'Sayang',
  greetingText = '',
  photos = [],
  musicUrl = '/music/hivi-remaja.mp3',
  showBackButton = true,
}: TemplateProps) {
  const [phase, setPhase] = useState<'cover' | 'intro' | 'board'>('cover');
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [letterText, setLetterText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [currentPhotoIdx, setCurrentPhotoIdx] = useState(0);
  const [musicPlaying, setMusicPlaying] = useState(false);
  const typingRef = useRef<boolean>(false);

  const isVideoMedia = (src?: string) => {
    if (!src) return false;
    return (
      src.includes('youtube.com') ||
      src.includes('youtu.be') ||
      src.includes('drive.google.com') ||
      src.startsWith('data:video/') ||
      src.endsWith('.mp4') ||
      src.endsWith('.mov') ||
      src.endsWith('.webm')
    );
  };

  const couplePhotos = photos.length > 0
    ? photos
    : [
        'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1494774157365-9e04c6720e47?q=80&w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?q=80&w=800&auto=format&fit=crop',
      ];

  const loveLetter = greetingText ||
    `${recipientName}, selamat ulang tahun ya... 🤍\n\nMakasih banyak ya sudah lahir ke dunia dan sudah memilih untuk bertahan serta tumbuh bersama aku. Aku tahu hidup ini kadang melelahkan, tapi tolong ingat kalau kamu gak pernah sendirian. Di pundakku, kamu selalu punya tempat untuk bersandar. Di hatiku, kamu selalu punya rumah untuk pulang.\n\nAku bersyukur untuk setiap tawa yang kita bagi, dan bahkan untuk setiap air mata yang mendewasakan kita. Semoga di tahun yang baru ini, kamu selalu dikelilingi kebahagiaan.\n\nAku sayang kamu, lebih dari yang bisa kuucapkan lewat kata-kata. Sehat selalu ya, duniaku. ❤️`;

  const typeWriterEffect = useCallback((text: string) => {
    if (isTyping) return;
    typingRef.current = true;
    setIsTyping(true);
    setLetterText('');
    let i = 0;
    function write() {
      if (i < text.length && typingRef.current) {
        setLetterText((prev) => prev + text.charAt(i));
        i++;
        setTimeout(write, 45);
      } else {
        setIsTyping(false);
      }
    }
    write();
  }, [isTyping]);

  const [isUnwrapping, setIsUnwrapping] = useState(false);
  const [isFlipping, setIsFlipping] = useState(false);

  function openCover() {
    if (isUnwrapping) return;
    setIsUnwrapping(true);
    setMusicPlaying(true);
    setTimeout(() => {
      setPhase('intro');
      setIsUnwrapping(false);
    }, 750);
  }

  function startBoard() {
    if (isFlipping) return;
    setIsFlipping(true);
    setMusicPlaying(true);
    setTimeout(() => {
      setPhase('board');
      setIsFlipping(false);
    }, 650);
  }

  function openModal(id: string) {
    setActiveModal(id);
    if (id === 'letter') {
      typeWriterEffect(loveLetter);
    }
  }

  function closeModal() {
    setActiveModal(null);
    typingRef.current = false;
    setIsTyping(false);
  }

  function toggleMusic() {
    setMusicPlaying((prev) => !prev);
  }

  return (
    <div className="paper-root">
      <style>{`
        .paper-root {
          background-color: #f5e6d3;
          color: #2b2b2b;
          font-family: 'Montserrat', sans-serif;
          min-height: 100vh; min-height: 100dvh;
          width: 100%; height: 100%; flex: 1;
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          position: relative; overflow-x: hidden; padding: 1rem;
        }

        .paper-texture {
          position: fixed; inset: 0; pointer-events: none; z-index: 999;
          opacity: 0.04;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
        }

        .paper-page {
          background-color: #fdfbf7; border-radius: 4px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.05), 0 1px 3px rgba(0,0,0,0.05), inset 0 0 40px rgba(0,0,0,0.02);
          border: 1px solid rgba(0,0,0,0.06); position: relative;
        }

        .paper-polaroid {
          background: white; padding: 10px 10px 24px 10px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.08);
          border: 1px solid rgba(0,0,0,0.05);
          transform: rotate(-3deg); transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); cursor: pointer;
        }
        .paper-polaroid:hover { transform: rotate(0deg) scale(1.06); box-shadow: 0 12px 28px rgba(0,0,0,0.15); }

        .paper-washi {
          position: absolute; width: 80px; height: 24px;
          background: rgba(224,93,93,0.25);
          border-left: 1px dashed rgba(224,93,93,0.4);
          border-right: 1px dashed rgba(224,93,93,0.4);
          transform: rotate(-10deg); top: -12px; left: 50%;
          margin-left: -40px; z-index: 10;
        }

        .paper-modal {
          position: fixed; inset: 0; z-index: 100;
          display: flex; align-items: center; justify-content: center;
          padding: 2rem; opacity: 0; visibility: hidden;
          transition: all 0.4s cubic-bezier(0.165,0.84,0.44,1);
          transform: scale(0.9) translateY(20px);
          background: rgba(0,0,0,0.4);
          backdrop-filter: blur(4px);
        }
        .paper-modal.active { opacity: 1; visibility: visible; transform: scale(1) translateY(0); }

        .paper-float { animation: paperFloat 4s infinite ease-in-out alternate; }
        .paper-float:nth-child(2) { animation-delay: 1.2s; }
        .paper-float:nth-child(3) { animation-delay: 2.4s; }
        @keyframes paperFloat { 0% { transform: translateY(0); } 100% { transform: translateY(-10px); } }

        .paper-cover, .paper-intro {
          position: fixed; inset: 0; z-index: 60;
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          padding: 1rem; transition: opacity 0.5s ease-out;
        }
        .paper-cover { background: #eae6df; }
        .paper-intro { background: #ebe7de; }

        /* Unwrapping Animations */
        .paper-unwrap-anim {
          animation: paperUnwrapEffect 0.75s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
        @keyframes paperUnwrapEffect {
          0% { transform: scale(1) rotate(0deg); opacity: 1; filter: blur(0); }
          25% { transform: scale(1.05) rotate(-2deg); }
          50% { transform: scale(1.15) rotate(4deg); opacity: 0.9; }
          100% { transform: scale(1.5) rotate(-8deg); opacity: 0; filter: blur(8px); }
        }

        /* Slide In for Intro */
        .paper-intro-enter {
          animation: paperIntroEnter 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
        @keyframes paperIntroEnter {
          0% { transform: translateY(40px) scale(0.9); opacity: 0; }
          100% { transform: translateY(0) scale(1); opacity: 1; }
        }

        /* Flip Exit for Intro */
        .paper-flip-exit {
          animation: paperFlipExit 0.65s cubic-bezier(0.55, 0.055, 0.675, 0.19) forwards;
        }
        @keyframes paperFlipExit {
          0% { transform: perspective(800px) rotateY(0deg) scale(1); opacity: 1; }
          50% { transform: perspective(800px) rotateY(-45deg) scale(0.95); opacity: 0.8; }
          100% { transform: perspective(800px) rotateY(-90deg) scale(0.85); opacity: 0; }
        }

        /* Board Entry Unfold */
        .paper-board-enter {
          animation: paperBoardUnfold 0.7s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
        @keyframes paperBoardUnfold {
          0% { transform: perspective(1000px) rotateX(15deg) scale(0.92); opacity: 0; }
          100% { transform: perspective(1000px) rotateX(0deg) scale(1); opacity: 1; }
        }

        /* Staggered Pop In for Items */
        .paper-item-pop-1 {
          animation: paperItemSpring 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) 0.1s both;
        }
        .paper-item-pop-2 {
          animation: paperItemSpring 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) 0.25s both;
        }
        .paper-item-pop-3 {
          animation: paperItemSpring 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) 0.4s both;
        }
        @keyframes paperItemSpring {
          0% { transform: translateY(30px) scale(0.7); opacity: 0; }
          100% { transform: translateY(0) scale(1); opacity: 1; }
        }

        .paper-btn {
          font-weight: bold; padding: 12px 32px;
          background: #e05d5d; color: white;
          border-radius: 8px; border: none;
          cursor: pointer; transition: all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
          box-shadow: 0 4px 12px rgba(224, 93, 93, 0.3);
          text-transform: uppercase; letter-spacing: 0.15em;
          font-size: 0.75rem;
          display: inline-flex; align-items: center; justify-content: center; gap: 8px;
        }
        .paper-btn:hover {
          background: #c74c4c;
          transform: translateY(-2px) scale(1.03);
          box-shadow: 0 8px 20px rgba(224, 93, 93, 0.4);
        }
        .paper-btn:active {
          transform: translateY(1px) scale(0.97);
        }

        .paper-btn-outline {
          width: 100%; padding: 8px; background: #f1f5f9;
          color: #1e293b; border-radius: 8px; border: none;
          cursor: pointer; font-weight: bold; font-size: 0.75rem;
          text-transform: uppercase; transition: all 0.3s;
        }
        .paper-btn-outline:hover { background: #e2e8f0; }

        .font-handwritten { font-family: 'Caveat', cursive; }

        .paper-back {
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
        .paper-back:hover { background: #333; }

        .paper-music-btn {
          position: fixed; top: 16px; right: 16px; z-index: 50;
          width: 48px; height: 48px; border-radius: 12px;
          display: flex; align-items: center; justify-content: center;
          font-weight: bold; font-size: 1.1rem;
          cursor: pointer; transition: all 0.3s;
          border: 1px solid #cbd5e1;
        }

        /* Cassette */
        .paper-cassette {
          width: 100%; aspect-ratio: 1.8/1;
          background: #0f172a; border: 4px solid #334155;
          border-radius: 8px; padding: 16px;
          display: flex; flex-direction: column;
          justify-content: space-between;
          margin-bottom: 24px; box-shadow: inset 0 2px 6px rgba(0,0,0,0.3);
          color: #94a3b8; font-family: monospace; font-size: 10px;
        }
        .paper-reel {
          width: 32px; height: 32px; border-radius: 50%;
          border: 4px dashed #475569;
          display: flex; align-items: center; justify-content: center;
        }
        .paper-reel.spinning { animation: kicauSpin 1s linear infinite; }
        @keyframes kicauSpin { 100% { transform: rotate(360deg); } }

        @media (max-width: 640px) {
          .paper-page { margin: 10px; padding: 1.5rem !important; }
        }
        @media (max-width: 480px) {
          .paper-page { padding: 1.25rem 1rem !important; }
          .paper-modal { padding: 1rem !important; }
        }
      `}</style>

      {/* eslint-disable-next-line @next/next/no-page-custom-font */}
      <link href="https://fonts.googleapis.com/css2?family=Caveat:wght@700&family=Montserrat:wght@300;400;600;700&display=swap" rel="stylesheet" />

      <div className="paper-texture" />
      <UniversalMusicPlayer musicUrl={musicUrl} isPlaying={phase !== 'cover' && musicPlaying} startTime={0} />

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

      {/* Cover Screen */}
      {phase === 'cover' && (
        <div className={`paper-cover ${isUnwrapping ? 'paper-unwrap-anim pointer-events-none' : ''}`}>
          <div className="paper-page" style={{ padding: '32px 48px', borderRadius: 12, maxWidth: 448, width: '100%', textAlign: 'center', position: 'relative', border: '1px solid #cbd5e1', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.15)' }}>
            <div className="paper-washi" style={{ background: 'rgba(93,173,224,0.35)' }} />
            <div style={{ fontSize: '3.5rem', marginBottom: 20 }} className="paper-float">
              {isUnwrapping ? '✨' : '💌'}
            </div>
            <h2 className="font-handwritten" style={{ fontSize: '2.5rem', color: '#e05d5d', marginBottom: 16 }}>Spesial Untuk Kamu</h2>
            <p style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: 32, lineHeight: 1.6, fontWeight: 300 }}>
              Sesuatu yang sederhana, tapi dibuat dengan seluruh hatiku untuk orang yang paling berharga. Buka kadonya yuk...
            </p>
            <button
              className="paper-btn"
              onClick={openCover}
              disabled={isUnwrapping}
            >
              {isUnwrapping ? 'Membuka Kado... ✨' : 'Buka Bungkus Kado 🎁'}
            </button>
          </div>
        </div>
      )}

      {/* Intro Screen */}
      {phase === 'intro' && (
        <div className={`paper-intro paper-intro-enter ${isFlipping ? 'paper-flip-exit pointer-events-none' : ''}`}>
          <div className="paper-page" style={{ padding: '32px 48px', borderRadius: 12, maxWidth: 448, width: '100%', textAlign: 'center', position: 'relative', border: '1px solid #cbd5e1' }}>
            <div className="paper-washi" />
            <div style={{ width: 192, height: 192, margin: '0 auto 24px', overflow: 'hidden', borderRadius: '50%', border: '4px solid white', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} className="paper-float">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/paper-cake.png" alt="Cake" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <h1 className="font-handwritten" style={{ fontSize: '2.5rem', color: '#e05d5d', marginBottom: 16 }}>Eh... Dengar-dengar...</h1>
            <p style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: 32, lineHeight: 1.6, fontWeight: 300 }}>
              Selamat bertambah dewasa ya, {recipientName}... Aku selalu bersyukur setiap hari karena semesta mengizinkan aku mengenal dan mencintaimu. Sini, aku punya beberapa kado kecil buat kamu...
            </p>
            <button
              className="paper-btn"
              onClick={startBoard}
              disabled={isFlipping}
            >
              {isFlipping ? 'Membuka Buku Kado... 📖' : 'Lihat Kado 👉'}
            </button>
          </div>
        </div>
      )}

      {/* Main Board */}
      {phase === 'board' && (
        <main className="paper-page paper-board-enter" style={{ maxWidth: 672, width: '100%', padding: '24px 40px', borderRadius: 12, position: 'relative', border: '1px solid #cbd5e1' }}>
          {/* Diagonal washi */}
          <div style={{ position: 'absolute', width: 70, height: 20, background: 'rgba(93,173,224,0.25)', borderLeft: '1px dashed rgba(93,173,224,0.4)', borderRight: '1px dashed rgba(93,173,224,0.4)', transform: 'rotate(45deg)', top: -5, right: -15, zIndex: 10 }} />

          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <h2 className="font-handwritten" style={{ fontSize: '2.5rem', color: '#e05d5d', marginBottom: 8 }}>Kado Buat {recipientName}</h2>
            <p style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: 600 }}>Ketuk barang-barang di bawah ini ya! 🌸</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 32, alignItems: 'center', justifyContent: 'center' }}>
            {/* Surat Cinta */}
            <div className="paper-float paper-item-pop-1" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
              <div style={{ width: 128, height: 128, marginBottom: 12, cursor: 'pointer', transition: 'transform 0.3s' }} onClick={() => openModal('letter')}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/images/paper-envelope.png" alt="Love Letter" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
              </div>
              <button className="font-handwritten" style={{ fontSize: '1.5rem', color: '#334155', background: 'none', border: 'none', cursor: 'pointer' }} onClick={() => openModal('letter')}>
                Surat Cinta ✉️
              </button>
            </div>

            {/* Media Kita */}
            <div className="paper-float paper-item-pop-2" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
              <div className="paper-polaroid" style={{ marginBottom: 12 }} onClick={() => openModal('photo')}>
                <div style={{ width: 96, height: 112, overflow: 'hidden', borderRadius: 4, background: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {isVideoMedia(couplePhotos[0]) ? (
                    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '10px', fontWeight: 'bold' }}>
                      <span style={{ fontSize: '1.5rem', marginBottom: 4 }}>📹</span>
                      <span>Video</span>
                    </div>
                  ) : (
                    <Image src={couplePhotos[0]} alt="Memory" width={96} height={112} style={{ width: '100%', height: '100%', objectFit: 'cover' }} unoptimized />
                  )}
                </div>
              </div>
              <button className="font-handwritten" style={{ fontSize: '1.5rem', color: '#334155', background: 'none', border: 'none', cursor: 'pointer' }} onClick={() => openModal('photo')}>
                Kenangan Kita 📸
              </button>
            </div>

            {/* Musik Kita */}
            <div className="paper-float paper-item-pop-3" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
              <div style={{ width: 128, height: 128, marginBottom: 12, cursor: 'pointer', transition: 'transform 0.3s' }} onClick={() => openModal('music')}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/images/paper-headphone.png" alt="Music" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
              </div>
              <button className="font-handwritten" style={{ fontSize: '1.5rem', color: '#334155', background: 'none', border: 'none', cursor: 'pointer' }} onClick={() => openModal('music')}>
                Musik Kita 🎧
              </button>
            </div>
          </div>
        </main>
      )}

      {/* Letter Modal */}
      <div className={`paper-modal ${activeModal === 'letter' ? 'active' : ''}`}>
        <div className="paper-page" style={{ padding: '24px 32px', borderRadius: 12, maxWidth: 448, width: '100%', position: 'relative', border: '1px solid #cbd5e1', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.15)' }}>
          <div className="paper-washi" />
          <h3 className="font-handwritten" style={{ fontSize: '1.8rem', color: '#e05d5d', textAlign: 'center', marginBottom: 16 }}>Pesan Dari Hatiku</h3>
          <p style={{ fontSize: '0.875rem', color: '#334155', lineHeight: 1.6, fontWeight: 300, marginBottom: 24, minHeight: 120, whiteSpace: 'pre-line' }}>{letterText}</p>
          <button className="paper-btn-outline" onClick={closeModal}>Tutup Pesan</button>
        </div>
      </div>

      {/* Photo / Video Modal */}
      <div className={`paper-modal ${activeModal === 'photo' ? 'active' : ''}`}>
        <div className="paper-page" style={{ padding: '24px 32px', borderRadius: 12, maxWidth: 448, width: '100%', textAlign: 'center', position: 'relative', border: '1px solid #cbd5e1', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.15)' }}>
          <div className="paper-washi" />
          <h3 className="font-handwritten" style={{ fontSize: '1.8rem', color: '#e05d5d', marginBottom: 16 }}>Galeri Kenangan Kita</h3>
          <div style={{ position: 'relative', width: '100%', minHeight: 220, borderRadius: 8, overflow: 'hidden', border: '1px solid #e2e8f0', marginBottom: 24, background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {isVideoMedia(couplePhotos[currentPhotoIdx]) ? (
              <div style={{ width: '100%', aspectRatio: '16/9', background: '#000' }}>
                <UniversalVideoPlayer videoUrl={couplePhotos[currentPhotoIdx]} />
              </div>
            ) : (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img src={couplePhotos[currentPhotoIdx]} alt="Memory" style={{ maxWidth: '100%', height: 'auto', maxHeight: '60vh', objectFit: 'contain', transition: 'all 0.3s' }} />
            )}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, marginBottom: 24 }}>
            <button className="paper-btn-outline" style={{ flex: 1 }} onClick={() => setCurrentPhotoIdx((prev) => (prev - 1 + couplePhotos.length) % couplePhotos.length)}>Sebelumnya</button>
            <span className="font-handwritten" style={{ fontSize: '1rem', color: '#64748b' }}>{currentPhotoIdx + 1} / {couplePhotos.length}</span>
            <button className="paper-btn-outline" style={{ flex: 1 }} onClick={() => setCurrentPhotoIdx((prev) => (prev + 1) % couplePhotos.length)}>Selanjutnya</button>
          </div>
          <button className="paper-btn-outline" onClick={closeModal}>Tutup Galeri</button>
        </div>
      </div>

      {/* Music Modal */}
      <div className={`paper-modal ${activeModal === 'music' ? 'active' : ''}`}>
        <div className="paper-page" style={{ padding: '24px 32px', borderRadius: 12, maxWidth: 384, width: '100%', textAlign: 'center', position: 'relative', border: '1px solid #cbd5e1', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.15)' }}>
          <div className="paper-washi" />
          <h3 className="font-handwritten" style={{ fontSize: '1.8rem', color: '#e05d5d', marginBottom: 16 }}>Tape Recorder</h3>

          {/* Cassette */}
          <div className="paper-cassette">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #1e293b', paddingBottom: 4 }}>
              <span>SIDE A</span>
              <span style={{ color: '#22d3ee', fontWeight: 'bold' }}>Lagu Kita</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 24, margin: '8px 0' }}>
              <div className={`paper-reel ${musicPlaying ? 'spinning' : ''}`}>
                <div style={{ width: 8, height: 8, background: '#334155', borderRadius: '50%' }} />
              </div>
              <div className={`paper-reel ${musicPlaying ? 'spinning' : ''}`}>
                <div style={{ width: 8, height: 8, background: '#334155', borderRadius: '50%' }} />
              </div>
            </div>
            <div style={{ textAlign: 'center', textTransform: 'uppercase', letterSpacing: '0.15em', fontSize: 8, color: musicPlaying ? '#22d3ee' : '#475569', fontWeight: musicPlaying ? 'bold' : 'normal' }}>
              {musicPlaying ? '[ PLAYING TAPE DECK ]' : '[ TAPE DECK STOPPED ]'}
            </div>
          </div>

          <p style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 500, marginBottom: 24 }}>Kelola musik pengiring petualangan cinta kita:</p>

          <button
            className="paper-btn"
            style={{ width: '100%', marginBottom: 24 }}
            onClick={toggleMusic}
          >
            {musicPlaying ? 'PAUSE TAPE ⏸' : 'PLAY TAPE ▶'}
          </button>

          <button className="paper-btn-outline" onClick={closeModal}>Tutup Tape</button>
        </div>
      </div>
    </div>
  );
}
