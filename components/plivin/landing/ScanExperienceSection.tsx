'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import QRCode from 'qrcode';
import { IPhoneMockup } from 'react-device-mockup';
import { QR_MODELS } from '@components/plivin/common/QRCodeGeneratorModal';

interface ScanExperienceSectionProps {
  onSelectTemplate?: (templateTitle: string) => void;
}

// Smooth bezier heart path for drawing frames and badges
function drawHeart(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) {
  ctx.beginPath();
  const topY = y + h * 0.2;
  const bottomY = y + h * 0.94;
  const midX = x + w / 2;

  ctx.moveTo(midX, topY + h * 0.12);
  // Left curve
  ctx.bezierCurveTo(midX, topY, x + w * 0.22, y + h * 0.02, x + w * 0.04, y + h * 0.26);
  ctx.bezierCurveTo(x - w * 0.04, y + h * 0.48, x + w * 0.12, y + h * 0.68, midX, bottomY);
  // Right curve
  ctx.bezierCurveTo(x + w * 0.88, y + h * 0.68, x + w * 1.04, y + h * 0.48, x + w * 0.96, y + h * 0.26);
  ctx.bezierCurveTo(x + w * 0.78, y + h * 0.02, midX, topY, midX, topY + h * 0.12);
  ctx.closePath();
}

import { useLanguage } from '@context/LanguageContext';
import Link from 'next/link';

export default function ScanExperienceSection({ onSelectTemplate }: ScanExperienceSectionProps) {
  const { language, t } = useLanguage();
  const [selectedFrameId, setSelectedFrameId] = useState<string>('qris_cat');
  const [compositeQrUrl, setCompositeQrUrl] = useState<string>('');
  const [isGeneratingQr, setIsGeneratingQr] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // The production URL scanned by phone cameras (ALWAYS production, never localhost)
  const productionScanUrl = 'https://plivin-digigift.vercel.app/demo/maroon-birthday-surprise';

  const selectedFrame = QR_MODELS.find((m) => m.id === selectedFrameId) || QR_MODELS[1]; // default to qris_cat

  // Generate composite QR code overlaid onto chosen frame
  const renderCompositeQR = useCallback(async () => {
    if (!canvasRef.current) return;
    setIsGeneratingQr(true);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    try {
      if (selectedFrame.id === 'plain') {
        canvas.width = 600;
        canvas.height = 600;
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, 600, 600);

        const qrCanvas = document.createElement('canvas');
        await QRCode.toCanvas(qrCanvas, productionScanUrl, {
          width: 500,
          margin: 2,
          errorCorrectionLevel: 'H',
          color: { dark: '#000000', light: '#ffffff' },
        });

        ctx.drawImage(qrCanvas, 50, 50, 500, 500);
        ctx.fillStyle = '#64748b';
        ctx.font = 'bold 16px Montserrat, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Scan untuk membuka kado digital ✨', 300, 580);
      } else if (selectedFrame.id === 'qris_love') {
        // HEART LOVE FRAME DESIGN (100% Guaranteed Fast & Reliable Scanning)
        canvas.width = 600;
        canvas.height = 600;

        // 1. Romantic soft pastel gradient card background
        const grad = ctx.createLinearGradient(0, 0, 600, 600);
        grad.addColorStop(0, '#fff1f2');
        grad.addColorStop(0.4, '#ffe4e6');
        grad.addColorStop(1, '#fecdd3');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 600, 600);

        // Decorative background elements
        ctx.font = '24px sans-serif';
        ctx.fillText('✨', 40, 60);
        ctx.fillText('🌸', 540, 80);
        ctx.fillText('💖', 50, 540);
        ctx.fillText('✨', 530, 530);

        // 2. Large Outer Heart Frame
        const hX = 35;
        const hY = 25;
        const hW = 530;
        const hH = 530;

        // White glowing heart backdrop
        ctx.save();
        ctx.shadowColor = 'rgba(244, 63, 94, 0.35)';
        ctx.shadowBlur = 20;
        drawHeart(ctx, hX, hY, hW, hH);
        ctx.fillStyle = '#ffffff';
        ctx.fill();
        ctx.restore();

        // Heart border
        ctx.save();
        ctx.strokeStyle = '#f43f5e';
        ctx.lineWidth = 6;
        drawHeart(ctx, hX, hY, hW, hH);
        ctx.stroke();
        ctx.restore();

        // 3. Card Header inside Heart
        ctx.fillStyle = '#e11d48';
        ctx.font = '900 22px Montserrat, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('SPESIAL BUAT KAMU', 300, 135);

        // 4. Generate High-Contrast, Error-Corrected QR Code
        const qrCanvas = document.createElement('canvas');
        const qrSize = 310;
        await QRCode.toCanvas(qrCanvas, productionScanUrl, {
          width: qrSize,
          margin: 2,
          errorCorrectionLevel: 'H',
          color: {
            dark: '#be123c', // Deep crisp rose-red with 100% contrast for fast camera detection
            light: '#ffffff',
          },
        });

        // Center the QR code inside the heart
        const qrX = Math.round((600 - qrSize) / 2);
        const qrY = 160;

        // Draw QR background pill/card with subtle border
        ctx.fillStyle = '#ffffff';
        ctx.strokeStyle = '#fecdd3';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(qrX - 8, qrY - 8, qrSize + 16, qrSize + 16, 16);
        ctx.fill();
        ctx.stroke();

        // Draw QR Code
        ctx.drawImage(qrCanvas, qrX, qrY, qrSize, qrSize);

        // Draw heart center badge in middle of QR (supported seamlessly by High Error Correction Level 'H')
        const badgeSize = 56;
        const badgeX = 300 - badgeSize / 2;
        const badgeY = qrY + qrSize / 2 - badgeSize / 2;

        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(300, qrY + qrSize / 2, 28, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#e11d48';
        ctx.lineWidth = 3;
        ctx.stroke();

        ctx.font = '28px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('💖', 300, qrY + qrSize / 2 + 1);

        // 5. Card Footer
        ctx.textBaseline = 'alphabetic';
        ctx.fillStyle = '#9f1239';
        ctx.font = 'bold 14px Montserrat, sans-serif';
        ctx.textAlign = 'center';
      } else {
        const baseImg = new window.Image();
        baseImg.crossOrigin = 'anonymous';
        baseImg.src = selectedFrame.imagePath;

        await new Promise<void>((resolve, reject) => {
          baseImg.onload = () => resolve();
          baseImg.onerror = (err) => reject(err);
        });

        const imgWidth = baseImg.naturalWidth || 800;
        const imgHeight = baseImg.naturalHeight || 800;
        canvas.width = imgWidth;
        canvas.height = imgHeight;

        // Draw frame background image from /public/images/qrcode/
        ctx.drawImage(baseImg, 0, 0, imgWidth, imgHeight);

        // Calculate target QR placement
        const { xPct, yPct, wPct, hPct } = selectedFrame.targetBox;
        const targetX = (xPct / 100) * imgWidth;
        const targetY = (yPct / 100) * imgHeight;
        const targetW = (wPct / 100) * imgWidth;
        const targetH = (hPct / 100) * imgHeight;

        // Generate QR code for productionScanUrl with High Error Correction
        const qrCanvas = document.createElement('canvas');
        await QRCode.toCanvas(qrCanvas, productionScanUrl, {
          width: Math.round(targetW),
          margin: 1,
          errorCorrectionLevel: 'H',
          color: {
            dark: '#000000',
            light: '#ffffff',
          },
        });

        if (selectedFrame.rotationDeg) {
          ctx.save();
          const centerX = targetX + targetW / 2;
          const centerY = targetY + targetH / 2;
          ctx.translate(centerX, centerY);
          ctx.rotate((selectedFrame.rotationDeg * Math.PI) / 180);
          ctx.drawImage(qrCanvas, -targetW / 2, -targetH / 2, targetW, targetH);
          ctx.restore();
        } else {
          ctx.drawImage(qrCanvas, targetX, targetY, targetW, targetH);
        }
      }

      setCompositeQrUrl(canvas.toDataURL('image/png'));
    } catch (err) {
      console.error('Error generating composite QR:', err);
    } finally {
      setIsGeneratingQr(false);
    }
  }, [productionScanUrl, selectedFrame]);

  useEffect(() => {
    renderCompositeQR();
  }, [renderCompositeQR]);

  const handleTogglePlay = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
        setIsPlaying(true);
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  const handleReplayVideo = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  return (
    <div id="pengalaman-scan" className="max-w-6xl mx-auto scroll-mt-24 py-4 sm:py-6">
      {/* Hidden offscreen canvas for composite generation */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Header */}
      <div className="text-center mb-8 sm:mb-12 space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-100 border-2 border-black text-rose-800 font-black text-xs uppercase tracking-wider shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
          <span>{t.scan.tag}</span>
        </div>
        <h2 className="text-2xl sm:text-3xl md:text-5xl font-black text-black tracking-tight leading-tight">
          {t.scan.title}
        </h2>
        <p className="text-slate-700 font-bold max-w-2xl mx-auto text-xs sm:text-sm md:text-base leading-relaxed">
          {t.scan.subtitle}
        </p>
      </div>

      {/* Main Interactive Showcase Grid */}
      <div className="bg-white border-3 sm:border-4 border-black rounded-2xl sm:rounded-3xl p-5 sm:p-7 md:p-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] md:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden">
        {/* Background Subtle Glows */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-rose-200/30 rounded-full blur-3xl pointer-events-none -z-0" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-200/30 rounded-full blur-3xl pointer-events-none -z-0" />

        {/* Dual Column Layout */}
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 items-start">
          {/* LEFT COLUMN: QR Frame Options & Live Scan Target (6 Cols) */}
          <div className="lg:col-span-6 flex flex-col justify-between h-full space-y-4">
            <div className="bg-gradient-to-br from-pink-50/90 via-rose-50/70 to-amber-50/80 border-3 border-black rounded-2xl p-5 sm:p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] space-y-4 flex-1">
              <div className="flex items-center justify-between gap-2 pb-2 border-b border-black/10">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border-2 border-black rounded-full text-black font-black text-[10px] uppercase">
                  <span>{language === 'en' ? 'Choose QR Frame' : 'Pilih frame kado'}</span>
                </div>
                <span className="text-[11px] font-extrabold text-slate-500">
                  {language === 'en' ? 'Frame Designs:' : 'Pilih Desain Frame:'}
                </span>
              </div>

              {/* Frame Model Switcher with balanced wrap */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {QR_MODELS.filter((m) => m.id !== 'plain').map((model) => (
                  <button
                    key={model.id}
                    type="button"
                    onClick={() => setSelectedFrameId(model.id)}
                    className={`px-2.5 py-2 rounded-xl text-xs font-black border-2 border-black transition cursor-pointer flex items-center justify-center gap-1.5 ${
                      selectedFrameId === model.id
                        ? 'bg-black text-white shadow-[2px_2px_0px_0px_rgba(244,63,94,1)] -translate-y-0.5'
                        : 'bg-white text-black hover:bg-slate-100 shadow-xs'
                    }`}
                  >
                    <span>{model.emoji}</span>
                    <span className="truncate">{model.name}</span>
                  </button>
                ))}
              </div>

              {/* Generated Composite Frame Image */}
              <div className="bg-white border-2 border-black rounded-2xl p-3 sm:p-4 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] max-w-[280px] sm:max-w-[300px] mx-auto space-y-2 text-center">
                <div className="relative aspect-square w-full rounded-xl overflow-hidden flex items-center justify-center bg-slate-50 border border-slate-100">
                  {compositeQrUrl && !isGeneratingQr ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={compositeQrUrl}
                      alt="Model Frame QR Code"
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-xs font-bold text-slate-400">
                      <span className="animate-spin text-lg">🔄</span>
                      <span>{language === 'en' ? 'Rendering Frame...' : 'Merender Frame...'}</span>
                    </div>
                  )}
                </div>

                <div className="text-[10px] text-slate-600 font-bold leading-tight pt-1">
                  {t.scan.directScan}:{' '}
                  <span className="font-mono text-pink-600 font-extrabold break-all">
                    {productionScanUrl}
                  </span>
                </div>
              </div>

              {/* Step instructions */}
              <div className="space-y-2 text-left bg-white/90 p-3.5 rounded-xl border border-black/15 text-xs font-bold text-slate-700">
                <div className="flex items-center gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-rose-600 text-white flex items-center justify-center text-[10px] font-black shrink-0">1</span>
                  <span>{t.scan.step1}</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-rose-600 text-white flex items-center justify-center text-[10px] font-black shrink-0">2</span>
                  <span>{t.scan.step2}</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-rose-600 text-white flex items-center justify-center text-[10px] font-black shrink-0">3</span>
                  <span>{t.scan.step3}</span>
                </div>
              </div>
            </div>

            {/* Test Helper Card */}
            <div className="bg-slate-100 border-2 border-black rounded-xl p-3.5 flex items-center justify-between gap-3 text-left">
              <div>
                <span className="text-[10px] font-black text-slate-500 uppercase block">{t.scan.testPrompt}</span>
                <span className="text-xs font-black text-black">{t.scan.testSub}</span>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Real Smartphone Mockup with Video Demonstration (6 Cols) */}
          <div className="lg:col-span-6 flex flex-col items-center justify-between h-full space-y-4">
            {/* Live Interactive Phone Mockup */}
            <div className="w-full flex justify-center pl-3.5 py-1 max-w-[300px] sm:max-w-[320px]">
              <IPhoneMockup
                screenWidth={260}
                screenType="island"
                frameColor="#1c1917"
                hideStatusBar={true}
                transparentNavBar={true}
                className="drop-shadow-2xl transition-all duration-300 w-full"
              >
                <div className="w-full h-full bg-black overflow-hidden relative flex flex-col justify-center items-center">
                  {/* Real MP4 Video inside iPhone */}
                  <video
                    ref={videoRef}
                    src="/images/scan_experience.MP4"
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover cursor-pointer"
                    onClick={handleTogglePlay}
                  />

                  {/* Video Overlay Action Controls */}
                  <div className="absolute bottom-3 right-3 z-20 flex items-center gap-1.5 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/20">
                    <button
                      type="button"
                      onClick={handleTogglePlay}
                      className="text-white text-xs font-bold hover:scale-110 transition cursor-pointer p-0.5"
                      title={isPlaying ? 'Jeda Video' : 'Putar Video'}
                    >
                      {isPlaying ? '⏸️' : '▶️'}
                    </button>
                  </div>
                </div>
              </IPhoneMockup>
            </div>

            {/* Bottom Actions underneath Phone Mockup */}
            <div className="w-full max-w-[340px] space-y-2.5 pt-1">
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={handleReplayVideo}
                  className="w-full py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-black font-extrabold text-xs rounded-xl border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition cursor-pointer flex items-center justify-center gap-1"
                >
                  <span>🔄</span> Putar Ulang
                </button>
                <Link
                  href="/katalog"
                  className="w-full py-2.5 px-3 bg-white hover:bg-slate-50 text-black font-extrabold text-xs rounded-xl border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition cursor-pointer flex items-center justify-center gap-1"
                >
                  <span>👀</span> Katalog
                </Link>
              </div>
              <button
                type="button"
                onClick={() => {
                  onSelectTemplate?.('Secret Maroon Birthday');
                }}
                className="w-full py-3 px-4 bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xs sm:text-sm rounded-xl border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition cursor-pointer flex items-center justify-center gap-2"
              >
                <span>🚀</span> Bikin Kado Sekarang (Rp 21.200)
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
