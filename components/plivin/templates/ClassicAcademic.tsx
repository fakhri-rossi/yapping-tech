'use client';

import { useState } from 'react';
import Link from 'next/link';
import { TemplateProps } from '@type/gift';
import UniversalMusicPlayer from '@components/plivin/common/UniversalMusicPlayer';
import Image from 'next/image';

export default function ClassicAcademic({
  recipientName = 'Eleanor Vance, S.Kom',
  greetingText = '',
  photos = [],
  musicUrl = '/music/waltz-of-the-flowers.mp3',
  showBackButton = true,
}: TemplateProps) {
  const [started, setStarted] = useState(false);

  const photoUrl = photos.length > 0 ? photos[0] : 'https://i.pinimg.com/736x/30/1a/79/301a792e0b30c12670cd8cc10aacda7f.jpg';

  const bodyText = greetingText ||
    `Dari yang tiap malam ngeluh soal dosen pembimbing yang susah ditemuin, sampai akhirnya kamu berdiri membawa draft yang udah di-ACC. Bangga banget liat perjuangan kamu dari mahasiswa baru polos jadi orang keren seperti sekarang!\n\nIngat ya, walau sekarang sudah sah jadi sarjana, jangan sok sibuk kalau diajakin nongkrong. Sukses terus di dunia kerja yang sesungguhnya!`;

  const handleStart = () => {
    setStarted(true);
  };

  return (
    <div className="ca-root">
      <style>{`
        .ca-root {
          min-height: 100vh; min-height: 100dvh;
          width: 100%; height: 100%; flex: 1;
          display: flex; flex-direction: column;
          background-color: #FDFBF7; color: #0A192F;
          font-family: 'Lora', serif; overflow-x: hidden; position: relative;
        }

        .ca-intro {
          position: fixed; inset: 0; z-index: 50;
          display: flex; align-items: center; justify-content: center;
          background: #0A192F; transition: opacity 1s;
        }
        .ca-intro.hidden { opacity: 0; pointer-events: none; }

        .ca-start-btn {
          padding: 16px 40px; background: transparent;
          border: 2px solid #C5A059; color: #C5A059;
          font-family: 'Playfair Display', serif;
          letter-spacing: 0.2em; text-transform: uppercase;
          font-size: 0.875rem; cursor: pointer; transition: all 0.5s;
        }
        .ca-start-btn:hover { background: #C5A059; color: #0A192F; }

        .ca-ribbon {
          position: absolute; top: -10px; right: -10px;
          width: 150px; height: 150px; overflow: hidden; z-index: 20;
        }
        .ca-ribbon::before {
          content: 'CLASS OF 2026';
          position: absolute; display: block; width: 225px; padding: 10px 0;
          background: #C5A059; color: #fff; font-size: 12px; font-weight: 700;
          font-family: 'Playfair Display', serif; letter-spacing: 2px;
          text-align: center; top: 30px; right: -55px; transform: rotate(45deg);
        }

        .ca-music-btn {
          position: fixed; top: 24px; right: 24px; z-index: 50;
          background: rgba(255,255,255,0.8); backdrop-filter: blur(8px);
          border: 1px solid #C5A059; color: #0A192F;
          padding: 8px 20px; border-radius: 9999px;
          font-family: 'Playfair Display', serif; font-size: 0.75rem;
          letter-spacing: 0.1em; text-transform: uppercase; cursor: pointer;
        }

        .ca-back {
          position: fixed; top: 16px; left: 16px; z-index: 99999;
          background-color: #000; color: #fff; padding: 8px 12px;
          border-radius: 8px; font-weight: bold; font-size: 14px;
          box-shadow: 0 4px 6px rgba(0,0,0,0.3); border: 2px solid #fff;
          display: flex; align-items: center; gap: 6px;
          text-decoration: none; font-family: sans-serif; cursor: pointer;
        }
      `}</style>

      {/* eslint-disable-next-line @next/next/no-page-custom-font */}
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;0,900;1,400&family=Lora:ital,wght@0,400;0,500;1,400&display=swap" rel="stylesheet" />

      <UniversalMusicPlayer musicUrl={musicUrl} isPlaying={started} startTime={5} />

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

      {/* Intro Screen */}
      <div className={`ca-intro ${started ? 'hidden' : ''}`}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: 24 }}>🎓</div>
          <button className="ca-start-btn" onClick={handleStart}>
            Buka Kartu Kelulusan
          </button>
        </div>
      </div>

      {/* Main Content */}
      {started && (
        <main style={{ padding: '40px 16px', zIndex: 10, position: 'relative' }}>
          <div style={{ maxWidth: 960, margin: '0 auto', background: 'white', minHeight: '90vh', boxShadow: '0 20px 60px -15px rgba(10,25,47,0.1)', position: 'relative', border: '1px solid #e2e8f0', padding: '64px 32px' }}>
            <div className="ca-ribbon" />

            {/* Borders */}
            <div style={{ position: 'absolute', inset: 32, border: '1px solid rgba(197,160,89,0.5)', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', inset: 36, border: '3px solid rgba(197,160,89,0.2)', pointerEvents: 'none' }} />

            {/* Hero */}
            <section style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', paddingTop: 40, paddingBottom: 48 }}>
              <div style={{ width: 64, height: 64, marginBottom: 24 }}>
                <svg style={{ width: '100%', height: '100%', color: '#C5A059', opacity: 0.8 }} fill="currentColor" viewBox="0 0 24 24"><path d="M12 3L1 9L5 11.18V17.18L12 21L19 17.18V11.18L21 10.09V17H23V9L12 3ZM18.82 9L12 12.72L5.18 9L12 5.28L18.82 9ZM17 15.99L12 18.72L7 15.99V12.27L12 15L17 12.27V15.99Z" /></svg>
              </div>

              <p style={{ letterSpacing: '0.3em', textTransform: 'uppercase', fontSize: '0.85rem', color: '#0A192F', marginBottom: 24, fontWeight: 700 }}>
                Merayakan Bebasnya Dari Dosen Pembimbing
              </p>
              <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', marginBottom: 24, color: '#0A192F', lineHeight: 1.15 }}>
                {recipientName}
              </h1>
              <p style={{ color: '#C5A059', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', fontSize: '0.875rem', marginBottom: 48 }}>
                Selamat Atas Kelulusannya 🎓
              </p>

              <div style={{ width: 1, height: 96, background: 'rgba(197,160,89,0.5)', margin: '0 auto 48px' }} />
            </section>

            {/* Photo & Letter */}
            <section style={{ padding: '32px 0', textAlign: 'center' }}>
              <div style={{ margin: '0 auto 48px', width: 220, height: 290, padding: 12, background: 'white', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', transform: 'rotate(2deg)', border: '1px solid #f1f5f9' }}>
                <div style={{ width: '100%', height: '100%', overflow: 'hidden' }}>
                  <Image src={photoUrl} alt="Graduation" width={220} height={290} style={{ width: '100%', height: '100%', objectFit: 'cover' }} unoptimized />
                </div>
              </div>

              <div style={{ maxWidth: 672, margin: '0 auto', textAlign: 'center' }}>
                {bodyText.split('\n').filter(l => l.trim()).map((para, i) => (
                  <p key={i} style={{ fontSize: '1.1rem', lineHeight: 2, color: '#0A192F', marginBottom: 24 }}>
                    {para}
                  </p>
                ))}
                <p style={{ fontFamily: "'Playfair Display', serif", fontStyle: 'italic', color: '#C5A059', fontSize: '1.5rem', marginTop: 32 }}>
                  Dari Temen Seperjuangan,<br />
                  Yang Masih Revisian
                </p>
              </div>
            </section>

            <footer style={{ paddingTop: 40, textAlign: 'center', fontSize: '0.75rem', color: 'rgba(10,25,47,0.5)', textTransform: 'uppercase', letterSpacing: '0.2em' }}>
              Plivinco Classics © 2026
            </footer>
          </div>
        </main>
      )}
    </div>
  );
}
