'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { TemplateProps } from '@type/gift';
import UniversalMusicPlayer from '@components/plivin/common/UniversalMusicPlayer';

export default function LoveReceipt({
  recipientName = 'Sayangku',
  greetingText = '',
  photos = [],
  musicUrl = 'https://youtu.be/rHvQakk1zMA?si=4AgngRhNJ_onV8St',
  orderNumber = 'PLV-2026-LOVE',
  showBackButton = true,
}: TemplateProps) {
  const [introPhase, setIntroPhase] = useState<'checkout' | 'processing' | 'fading_out' | 'printing_done'>('checkout');
  const [printStage, setPrintStage] = useState<'standby' | 'printing' | 'completed'>('standby');
  const [printProgress, setPrintProgress] = useState(0); // 0 to 100%
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [stampTapped, setStampTapped] = useState(false);
  const [activePhotoModal, setActivePhotoModal] = useState<string | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [checkoutStepText, setCheckoutStepText] = useState('Menggeser kartu cinta...');
  const [isExporting, setIsExporting] = useState(false);
  const [receiptDateTime, setReceiptDateTime] = useState({
    date: '24 OKT 2026',
    time: '12:00:00',
  });
  const receiptPrintAreaRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Set realistic client locale timestamp once mounted to avoid hydration mismatch
    const now = new Date();
    setReceiptDateTime({
      date: now.toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }).toUpperCase(),
      time: now.toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      }),
    });
  }, []);

  // Audio synthesis for thermal printer buzz/crackle sound
  const audioCtxRef = useRef<AudioContext | null>(null);

  const defaultMsg = greetingText ||
    `Makasih ya udah selalu sabar sama sifat random-ku, selalu dengerin cerita gak jelas, dan jadi alasan aku pulang paling tenang. Gak ada diskon untuk rasa sayangku ke kamu, karena kamu berhak mendapatkan yang terbaik tanpa syarat. Happy special day, my favorite person! ❤️`;

  // Photos
  const displayPhotos = photos.length > 0 ? photos : [
    'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?q=80&w=800&auto=format&fit=crop', // Tangan bentuk hati sunset
    'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=800&auto=format&fit=crop', // Cium kening hangat
    'https://images.unsplash.com/photo-1494774157365-9e04c6720e47?q=80&w=800&auto=format&fit=crop', // Gandengan tangan di pantai
  ];

  // Helper function to play mechanical thermal printer sound
  const playPrinterChirp = () => {
    if (!soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioCtx();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      // Generate a rapid mechanical stepper motor sound with noise burst
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(140 + Math.random() * 30, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(70, ctx.currentTime + 0.04);

      gain.gain.setValueAtTime(0.06, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.045);
    } catch {
      // Audio context might fail or be blocked by policy, fail silently
    }
  };

  // Helper function for stamp thud sound
  const playStampSound = () => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioCtx();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(180, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(30, ctx.currentTime + 0.15);

      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.16);
    } catch {
      // ignore
    }
  };

  // Run the realistic print sequence
  const startPrintingAnimation = () => {
    setIntroPhase('printing_done');
    setPrintStage('printing');
    setPrintProgress(0);

    // Progressive ejection in steps
    let current = 0;
    const interval = setInterval(() => {
      current += 2;
      if (current % 6 === 0) {
        playPrinterChirp();
      }
      if (current >= 100) {
        setPrintProgress(100);
        clearInterval(interval);
        setTimeout(() => {
          setPrintStage('completed');
          setIsMusicPlaying(true);
        }, 300);
      } else {
        setPrintProgress(current);
      }
    }, 45); // ~2.25 seconds total realistic smooth feed
  };

  // Trigger Checkout Transition from Intro to Printing
  const handleStartCheckout = () => {
    playStampSound();
    setIntroPhase('processing');
    setCheckoutStepText('Memproses transaksi cinta tanpa syarat...');

    setTimeout(() => {
      setCheckoutStepText('Pembayaran BERHASIL! Mencetak struk...');
    }, 1200);

    setTimeout(() => {
      // Smooth fade-out before opening the printer view
      setIntroPhase('fading_out');
      setTimeout(() => {
        startPrintingAnimation();
      }, 700);
    }, 2200);
  };

  useEffect(() => {
    return () => {
      if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
        audioCtxRef.current.close().catch(() => { });
      }
    };
  }, []);

  const handleReprint = () => {
    setStampTapped(false);
    startPrintingAnimation();
  };

  const handleResetIntro = () => {
    setStampTapped(false);
    setIsMusicPlaying(false);
    setPrintStage('standby');
    setPrintProgress(0);
    setIntroPhase('checkout');
  };

  // Export receipt as High Quality Image (PNG) with identical look to the website receipt
  const handleDownloadImage = async () => {
    setIsExporting(true);

    try {
      const width = 800;
      const padding = 52;
      const contentWidth = width - padding * 2;

      // First pass: measure text wrapping for message box
      const dummyCanvas = document.createElement('canvas');
      const dCtx = dummyCanvas.getContext('2d');
      const msgWords = defaultMsg.split(' ');
      const msgLines: string[] = [];
      if (dCtx) {
        dCtx.font = '15px "Plus Jakarta Sans", sans-serif';
        let currentL = '';
        const maxTextW = contentWidth - 36;
        for (let i = 0; i < msgWords.length; i++) {
          const testL = currentL + msgWords[i] + ' ';
          if (dCtx.measureText(testL).width > maxTextW && i > 0) {
            msgLines.push(currentL.trim());
            currentL = msgWords[i] + ' ';
          } else {
            currentL = testL;
          }
        }
        if (currentL) msgLines.push(currentL.trim());
      }
      const msgBoxHeight = Math.max(90, 48 + msgLines.length * 24 + 16);

      // Estimate needed canvas height dynamically
      const approxHeight = 2200 + msgBoxHeight;

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = approxHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        setIsExporting(false);
        return;
      }

      // Helper for rounded rect
      const roundRect = (
        c: CanvasRenderingContext2D,
        x: number,
        y: number,
        w: number,
        h: number,
        r: number
      ) => {
        c.beginPath();
        c.moveTo(x + r, y);
        c.lineTo(x + w - r, y);
        c.quadraticCurveTo(x + w, y, x + w, y + r);
        c.lineTo(x + w, y + h - r);
        c.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
        c.lineTo(x + r, y + h);
        c.quadraticCurveTo(x, y + h, x, y + h - r);
        c.lineTo(x, y + r);
        c.quadraticCurveTo(x, y, x + r, y);
        c.closePath();
      };

      // 1. Thermal Paper Background with Authentic Subtle Warm Gradient
      const bgGrad = ctx.createLinearGradient(0, 0, 0, approxHeight);
      bgGrad.addColorStop(0, '#fcfbfa');
      bgGrad.addColorStop(1, '#f7f6f1');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, approxHeight);

      // Fine subtle paper noise pattern
      ctx.fillStyle = 'rgba(0, 0, 0, 0.015)';
      for (let dotX = 12; dotX < width; dotX += 14) {
        for (let dotY = 12; dotY < approxHeight; dotY += 14) {
          ctx.fillRect(dotX, dotY, 1.2, 1.2);
        }
      }

      // Outer Paper Left & Right Border Edge
      ctx.strokeStyle = 'rgba(212, 212, 216, 0.8)';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(1, 0, width - 2, approxHeight);

      let y = 60;

      // ================= HEADER SECTION =================
      // Official Love Voucher Badge
      ctx.textAlign = 'center';
      ctx.font = '900 13px monospace';
      ctx.fillStyle = '#09090b';
      ctx.strokeStyle = '#09090b';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(width / 2 - 125, y - 18, 250, 30);
      ctx.fillText('OFFICIAL LOVE VOUCHER', width / 2, y + 2);

      // Plivin & Co. Title
      y += 50;
      ctx.font = '900 36px monospace';
      ctx.letterSpacing = '4px';
      ctx.fillStyle = '#09090b';
      ctx.fillText('PLIVIN & CO.', width / 2, y);
      ctx.letterSpacing = '0px';

      // Kementerian Perasaan
      y += 28;
      ctx.font = '600 14px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = '#52525b';
      ctx.fillText('Kementerian Perasaan • Cabang Hatiku No. 01', width / 2, y);

      // Sub-address
      y += 22;
      ctx.font = 'italic 12px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = '#71717a';
      ctx.fillText('Jl. Menuju Hatimu Selamanya No. 143, Bahagia Selalu', width / 2, y);

      // Dashed Separator between header & meta
      y += 28;
      ctx.beginPath();
      ctx.setLineDash([6, 5]);
      ctx.strokeStyle = '#d4d4d8';
      ctx.lineWidth = 1.5;
      ctx.moveTo(padding, y);
      ctx.lineTo(width - padding, y);
      ctx.stroke();
      ctx.setLineDash([]);

      // Metadata Table (WAKTU, ORDER, KASIR)
      y += 26;
      ctx.font = '600 13px monospace';
      ctx.fillStyle = '#3f3f46';
      ctx.textAlign = 'left';
      ctx.fillText(`WAKTU : ${formattedDate}`, padding, y);
      ctx.textAlign = 'right';
      ctx.fillText(formattedTime, width - padding, y);

      y += 24;
      ctx.textAlign = 'left';
      ctx.fillText(`ORDER : #${receiptOrderCode}`, padding, y);
      ctx.textAlign = 'right';
      ctx.fillText('POS : 01 (CINTA)', width - padding, y);

      y += 24;
      ctx.textAlign = 'left';
      ctx.fillText('KASIR : Aku', padding, y);
      ctx.textAlign = 'right';
      ctx.fillText('STATUS : LUNAS LENGKAP', width - padding, y);

      // Thick Dashed Line separating Header & Customer
      y += 25;
      ctx.beginPath();
      ctx.setLineDash([8, 6]);
      ctx.strokeStyle = '#a1a1aa';
      ctx.lineWidth = 2;
      ctx.moveTo(padding, y);
      ctx.lineTo(width - padding, y);
      ctx.stroke();
      ctx.setLineDash([]);

      // ================= CUSTOMER VIP CALLOUT =================
      y += 30;
      const vipBoxH = 76;
      ctx.fillStyle = 'rgba(244, 244, 245, 0.95)';
      ctx.strokeStyle = '#d4d4d8';
      ctx.lineWidth = 1.5;
      roundRect(ctx, padding, y, contentWidth, vipBoxH, 10);
      ctx.fill();
      ctx.stroke();

      ctx.textAlign = 'center';
      ctx.font = 'bold 12px monospace';
      ctx.fillStyle = '#71717a';
      ctx.fillText('CUSTOMER TERFAVORIT (VIP) :', width / 2, y + 26);
      ctx.font = '900 24px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = '#e11d48';
      ctx.fillText(recipientName.toUpperCase(), width / 2, y + 56);

      y += vipBoxH + 30;

      // ================= ITEMIZED RECEIPT TABLE =================
      // Column Headers
      ctx.textAlign = 'left';
      ctx.font = 'bold 13px monospace';
      ctx.fillStyle = '#71717a';
      ctx.fillText('DESKRIPSI ITEM', padding, y);
      ctx.textAlign = 'right';
      ctx.fillText('JUMLAH', width - padding, y);

      y += 10;
      ctx.beginPath();
      ctx.strokeStyle = '#e4e4e7';
      ctx.lineWidth = 1.5;
      ctx.moveTo(padding, y);
      ctx.lineTo(width - padding, y);
      ctx.stroke();

      const items = [
        { title: '1x Senyuman Manis Setiap Hari', desc: 'Bikin hari-hari capek langsung adem lagi' },
        { title: '365x Pelukan & Teman Cerita', desc: 'Siap sedia kapan pun kamu butuh sandaran' },
        { title: '1x Kesabaran Ekstra Tanpa Batas', desc: 'Anti ngambek lama, selalu dengerin kamu' },
        { title: '1x Tempat Pulang Paling Nyaman', desc: 'Kepemilikan permanen khusus buat kamu' },
        { title: '∞x Doa Terbaik & Kasih Sayang Tulus', desc: 'Biar kita berdua bahagia & langgeng terus' },
      ];

      items.forEach((item) => {
        y += 34;
        ctx.textAlign = 'left';
        ctx.font = 'bold 16px monospace';
        ctx.fillStyle = '#09090b';
        ctx.fillText(item.title, padding, y);
        ctx.textAlign = 'right';
        ctx.font = 'bold 16px monospace';
        ctx.fillText('Rp 0', width - padding, y);

        y += 20;
        ctx.textAlign = 'left';
        ctx.font = '500 12px "Plus Jakarta Sans", sans-serif';
        ctx.fillStyle = '#71717a';
        ctx.fillText(item.desc, padding, y);
        y += 8;
      });

      // Dashed Separator
      y += 18;
      ctx.beginPath();
      ctx.setLineDash([8, 6]);
      ctx.strokeStyle = '#a1a1aa';
      ctx.lineWidth = 2;
      ctx.moveTo(padding, y);
      ctx.lineTo(width - padding, y);
      ctx.stroke();
      ctx.setLineDash([]);

      // ================= TOTALS & SUMMARY =================
      y += 32;
      ctx.font = '600 14px monospace';
      ctx.fillStyle = '#3f3f46';
      ctx.textAlign = 'left';
      ctx.fillText('SUBTOTAL (5 ITEMS)', padding, y);
      ctx.textAlign = 'right';
      ctx.fillText('Rp 0', width - padding, y);

      y += 24;
      ctx.fillStyle = '#52525b';
      ctx.textAlign = 'left';
      ctx.fillText('DISKON SPESIAL (100%)', padding, y);
      ctx.textAlign = 'right';
      ctx.fillText('-Rp 999.999.999', width - padding, y);

      y += 24;
      ctx.textAlign = 'left';
      ctx.fillText('PAJAK KASIH SAYANG', padding, y);
      ctx.textAlign = 'right';
      ctx.fillText('IKHLAS 100%', width - padding, y);

      // Line above Total
      y += 16;
      ctx.beginPath();
      ctx.strokeStyle = '#d4d4d8';
      ctx.lineWidth = 1.5;
      ctx.moveTo(padding, y);
      ctx.lineTo(width - padding, y);
      ctx.stroke();

      y += 26;
      ctx.font = '900 18px monospace';
      ctx.fillStyle = '#09090b';
      ctx.textAlign = 'left';
      ctx.fillText('TOTAL PEMBAYARAN:', padding, y);
      ctx.fillStyle = '#e11d48';
      ctx.textAlign = 'right';
      ctx.fillText('PRICELESS ❤️', width - padding, y);

      y += 24;
      ctx.font = 'italic 12px monospace';
      ctx.fillStyle = '#71717a';
      ctx.textAlign = 'left';
      ctx.fillText('METODE BAYAR:', padding, y);
      ctx.textAlign = 'right';
      ctx.fillText('CINTA MATI (SEUMUR HIDUP)', width - padding, y);

      // Dashed Separator
      y += 24;
      ctx.beginPath();
      ctx.setLineDash([8, 6]);
      ctx.strokeStyle = '#a1a1aa';
      ctx.lineWidth = 2;
      ctx.moveTo(padding, y);
      ctx.lineTo(width - padding, y);
      ctx.stroke();
      ctx.setLineDash([]);

      // ================= SPECIAL NOTE / MESSAGE BOX =================
      y += 32;
      ctx.fillStyle = '#fffbeb';
      ctx.strokeStyle = '#fde68a';
      ctx.lineWidth = 1.5;
      roundRect(ctx, padding, y, contentWidth, msgBoxHeight, 10);
      ctx.fill();
      ctx.stroke();

      ctx.textAlign = 'left';
      ctx.font = 'bold 12px monospace';
      ctx.fillStyle = '#78350f';
      ctx.fillText('📝 PESAN KASIR UNTUKMU: [CONFIDENTIAL]', padding + 18, y + 26);

      let msgY = y + 54;
      ctx.font = '500 14px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = '#27272a';
      msgLines.forEach((l) => {
        ctx.fillText(l, padding + 18, msgY);
        msgY += 24;
      });

      y += msgBoxHeight + 35;

      // ================= PHOTO EVIDENCE SECTION =================
      ctx.textAlign = 'left';
      ctx.font = 'bold 13px monospace';
      ctx.fillStyle = '#18181b';
      ctx.fillText(`📸 LAMPIRAN MEMORI (${Math.min(3, displayPhotos.length)} BUKTI FOTO)`, padding, y);

      y += 18;
      const gap = 14;
      const photoSize = Math.floor((contentWidth - gap * 2) / 3);
      for (let i = 0; i < Math.min(3, displayPhotos.length); i++) {
        const pX = padding + i * (photoSize + gap);
        ctx.fillStyle = '#ffffff';
        ctx.strokeStyle = '#d4d4d8';
        ctx.lineWidth = 1.5;
        roundRect(ctx, pX, y, photoSize, photoSize + 32, 6);
        ctx.fill();
        ctx.stroke();

        try {
          const photoImg = new Image();
          photoImg.crossOrigin = 'anonymous';
          await new Promise<void>((resolve) => {
            photoImg.onload = () => {
              // Draw photo in grayscale with contrast
              ctx.save();
              ctx.filter = 'grayscale(100%) contrast(115%)';
              ctx.drawImage(photoImg, pX + 5, y + 5, photoSize - 10, photoSize - 10);
              ctx.restore();
              resolve();
            };
            photoImg.onerror = () => {
              ctx.fillStyle = '#f4f4f5';
              ctx.fillRect(pX + 5, y + 5, photoSize - 10, photoSize - 10);
              ctx.fillStyle = '#71717a';
              ctx.font = 'bold 11px monospace';
              ctx.textAlign = 'center';
              ctx.fillText('FOTO MEMORI', pX + photoSize / 2, y + photoSize / 2);
              resolve();
            };
            photoImg.src = displayPhotos[i];
          });
        } catch { }

        // Small badge #1, #2, #3
        ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
        roundRect(ctx, pX + 8, y + 8, 22, 16, 3);
        ctx.fill();
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 10px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(`#${i + 1}`, pX + 19, y + 20);

        ctx.fillStyle = '#71717a';
        ctx.font = 'bold 11px "Plus Jakarta Sans", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(`BUKTI-${i + 1}.JPG`, pX + photoSize / 2, y + photoSize + 22);
      }

      // ================= TAP-ABLE STAMP BADGE =================
      y += photoSize + 65;
      ctx.save();
      ctx.translate(width / 2, y);
      ctx.rotate((-4 * Math.PI) / 180);

      const stampW = 340;
      const stampH = 76;
      ctx.fillStyle = '#ecfdf5';
      ctx.strokeStyle = '#059669';
      ctx.lineWidth = 2.5;
      ctx.setLineDash([7, 5]);
      roundRect(ctx, -stampW / 2, -stampH / 2, stampW, stampH, 14);
      ctx.fill();
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.textAlign = 'center';
      ctx.fillStyle = '#065f46';
      ctx.font = '900 15px monospace';
      ctx.fillText('✓ TELAH DISTEMPEL LUNAS', 0, -12);

      ctx.font = '500 11px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = '#047857';
      ctx.fillText('Sah & Mengikat Selamanya di Lubuk Hati', 0, 6);

      ctx.beginPath();
      ctx.strokeStyle = '#6ee7b7';
      ctx.lineWidth = 1;
      ctx.moveTo(-stampW / 2 + 20, 16);
      ctx.lineTo(stampW / 2 - 20, 16);
      ctx.stroke();

      ctx.font = '600 10px monospace';
      ctx.fillStyle = '#047857';
      ctx.fillText(`VERIFIED BY LOVE-DEPT • ${formattedDate}`, 0, 28);
      ctx.restore();

      // ================= BARCODE & FOOTER =================
      y += 85;
      ctx.beginPath();
      ctx.setLineDash([8, 6]);
      ctx.strokeStyle = '#a1a1aa';
      ctx.lineWidth = 2;
      ctx.moveTo(padding, y);
      ctx.lineTo(width - padding, y);
      ctx.stroke();
      ctx.setLineDash([]);

      y += 28;
      // Barcode with authentic heights & spaces
      const barCount = 44;
      const barPatterns = [
        2, 1, 3, 1, 4, 1, 2, 1, 3, 2, 1, 4, 1, 2, 3, 1, 2, 4, 1, 1, 3, 2,
        1, 4, 2, 1, 3, 1, 2, 4, 1, 3, 2, 1, 2, 3, 1, 4, 2, 1, 3, 1, 2, 1,
      ];
      const barStep = contentWidth / barCount;
      for (let b = 0; b < barCount; b++) {
        const bW = (barPatterns[b % barPatterns.length] || 2) * 1.4;
        ctx.fillStyle = '#18181b';
        ctx.fillRect(padding + b * barStep + 4, y, bW, 52);
      }

      y += 75;
      ctx.textAlign = 'center';
      ctx.font = 'bold 13px monospace';
      ctx.fillStyle = '#52525b';
      ctx.fillText(`*${receiptOrderCode}*`, width / 2, y);

      y += 28;
      ctx.font = '900 15px monospace';
      ctx.fillStyle = '#18181b';
      ctx.fillText('TERIMA KASIH TELAH MEMILIHKU! ✨', width / 2, y);

      y += 22;
      ctx.font = 'italic 12px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = '#71717a';
      ctx.fillText('Barang yang sudah dibeli (hatiku) tidak dapat ditukar atau dikembalikan lagi.', width / 2, y);

      y += 20;
      ctx.font = '11px monospace';
      ctx.fillStyle = '#a1a1aa';
      ctx.fillText('Dicetak otomatis oleh Plivin Thermal Love Engine • plivin.co', width / 2, y);

      // Realistic Serrated / Zigzag tear cutter edge at the bottom
      y += 35;
      const teeth = 40;
      const toothW = width / teeth;
      const toothH = 16;
      ctx.fillStyle = '#f7f6f1';
      ctx.beginPath();
      ctx.moveTo(0, y);
      for (let t = 0; t < teeth; t++) {
        ctx.lineTo(t * toothW + toothW / 2, y + toothH);
        ctx.lineTo((t + 1) * toothW, y);
      }
      ctx.lineTo(width, y + toothH + 20);
      ctx.lineTo(0, y + toothH + 20);
      ctx.closePath();
      ctx.fill();

      // Crop canvas to real used height with serrated bottom margin
      const finalHeight = y + toothH + 10;
      const finalCanvas = document.createElement('canvas');
      finalCanvas.width = width;
      finalCanvas.height = finalHeight;
      const finalCtx = finalCanvas.getContext('2d');
      if (finalCtx) {
        finalCtx.drawImage(canvas, 0, 0, width, finalHeight, 0, 0, width, finalHeight);
        const dataUrl = finalCanvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.download = `struk-cinta-${recipientName.toLowerCase().replace(/\s+/g, '-')}-${orderNumber || '2026'}.png`;
        link.href = dataUrl;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }

      setIsExporting(false);
    } catch (err) {
      console.error('Export error:', err);
      setIsExporting(false);
    }
  };

  const formattedDate = receiptDateTime.date;
  const formattedTime = receiptDateTime.time;

  const receiptOrderCode = orderNumber || 'PLV-2026-LOVE';

  return (
    <div className="min-h-screen bg-[#0e0e11] text-zinc-900 font-mono flex flex-col items-center justify-start p-3 sm:p-6 md:p-8 relative selection:bg-rose-500 selection:text-white overflow-x-hidden">
      {/* Background Ambience Texture */}
      <div className="fixed inset-0 pointer-events-none opacity-20 bg-[radial-gradient(#ffffff_1.2px,transparent_1.2px)] [background-size:20px_20px]" />
      <div className="fixed -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-rose-500/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Top Header Navigation */}
      <div className="w-full max-w-md flex justify-between items-center mb-3 sm:mb-4 z-20">
        {showBackButton ? (
          <Link
            href="/plivin/gift"
            className="px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs border border-white/15 backdrop-blur-md transition-all flex items-center gap-1.5 active:scale-95"
          >
            <span>←</span> Beranda
          </Link>
        ) : (
          <span className="text-[11px] text-zinc-400 tracking-wider">PLIVIN RECEIPT</span>
        )}

        <div className="flex items-center gap-2">
          {/* Reset / Ulangi Button */}
          {introPhase === 'printing_done' && (
            <button
              type="button"
              onClick={handleResetIntro}
              title="Kembali ke layar kasir awal"
              className="px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-zinc-300 hover:text-white text-[11px] transition-all flex items-center gap-1 active:scale-95"
            >
              <span>↺</span>
              <span>Kasir</span>
            </button>
          )}

          {/* Sound Toggle */}
          <button
            type="button"
            onClick={() => setSoundEnabled(!soundEnabled)}
            title={soundEnabled ? 'Mute sfx printer' : 'Unmute sfx printer'}
            className="px-2.5 py-1 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 text-white text-[11px] transition-all"
          >
            {soundEnabled ? '🔊 SFX' : '🔇 SFX'}
          </button>

          {/* Re-Print Action Button */}
          <button
            type="button"
            onClick={handleReprint}
            disabled={printStage === 'printing' || introPhase !== 'printing_done'}
            className="px-3 py-1 rounded-full bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/30 text-rose-300 hover:text-white text-[11px] font-sans font-medium transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1"
          >
            <span>🖨️</span>
            <span>{printStage === 'printing' ? 'Printing...' : 'Print Ulang'}</span>
          </button>
        </div>
      </div>

      {/* Animation styles matching Secret Maroon Birthday's smooth luxury fade-in */}
      <style>{`
        @keyframes posFadeInUpSmooth {
          0% { opacity: 0; transform: translateY(36px) scale(0.97); filter: blur(6px); }
          100% { opacity: 1; transform: translateY(0) scale(1); filter: blur(0px); }
        }
        .pos-fade-in-up-smooth {
          animation: posFadeInUpSmooth 0.85s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>

      {/* PRINTER HARDWARE CASING & RECEIPT WRAPPER */}
      <div className={`w-full flex flex-col items-center ${introPhase === 'printing_done' ? 'pos-fade-in-up-smooth' : ''}`}>
        {/* PRINTER HARDWARE CASING (REALISTIC POS TERMINAL SLOT) */}
        <div className="w-full max-w-sm sm:max-w-md bg-gradient-to-b from-zinc-800 via-zinc-900 to-zinc-950 border-2 border-zinc-700/80 rounded-t-3xl p-3 sm:p-4 shadow-[0_25px_50px_rgba(0,0,0,0.9)] relative z-20 flex flex-col items-center">
          {/* Screw accents */}
          <div className="absolute top-2 left-3 w-1.5 h-1.5 rounded-full bg-zinc-600 shadow-inner flex items-center justify-center">
            <div className="w-1 h-[0.5px] bg-zinc-800 rotate-45" />
          </div>
          <div className="absolute top-2 right-3 w-1.5 h-1.5 rounded-full bg-zinc-600 shadow-inner flex items-center justify-center">
            <div className="w-1 h-[0.5px] bg-zinc-800 -rotate-45" />
          </div>

          {/* Machine Status Bar */}
          <div className="flex items-center justify-between w-full px-2 text-zinc-400 text-[10px] sm:text-[11px] font-mono tracking-wider mb-2">
            <div className="flex items-center gap-2">
              <span
                className={`w-2.5 h-2.5 rounded-full shadow-sm transition-all duration-300 ${printStage === 'printing'
                    ? 'bg-amber-400 animate-ping'
                    : 'bg-emerald-400 shadow-[0_0_8px_#34d399]'
                  }`}
              />
              <span className="font-bold text-zinc-300 tracking-wider">
                {printStage === 'printing' ? 'PRINTING RECEIPT...' : 'PLIVIN THERMAL POS-80'}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="bg-zinc-800/80 px-2 py-0.5 rounded text-[9px] text-zinc-400 border border-zinc-700">
                {printStage === 'printing' ? `${printProgress}%` : 'ONLINE'}
              </span>
              <span className="text-[9px] text-emerald-400 font-bold hidden sm:inline">PAPER READY</span>
            </div>
          </div>

          {/* The Guillotine Metal Blade Cutter Bar */}
          <div className="w-full h-1.5 bg-gradient-to-r from-zinc-700 via-zinc-400 to-zinc-700 rounded-sm mb-1.5 shadow-sm opacity-90" />

          {/* The Paper Ejection Slot Cavity */}
          <div className="w-full h-3 sm:h-3.5 bg-black rounded-full border border-zinc-950 shadow-[inset_0_4px_8px_rgba(0,0,0,0.95)] relative overflow-hidden flex items-center justify-center">
            {/* Subtle roller bar inside slot */}
            <div className="w-full h-[2px] bg-zinc-800 opacity-60" />
          </div>
        </div>

        {/* RECEIPT PAPER WRAPPER WITH ANIMATED PRINT REVEAL */}
        <div
          className="w-full max-w-sm sm:max-w-md relative z-10 -mt-1 transition-all"
          style={{
            // Realistic thermal paper reveal via clip-path
            clipPath: `inset(0 0 ${100 - printProgress}% 0)`,
            transition: printStage === 'printing' ? 'clip-path 0.05s linear' : 'clip-path 0.4s ease-out',
          }}
        >
          {/* THERMAL PAPER CONTAINER */}
          <div
            ref={receiptPrintAreaRef}
            className="w-full bg-[#fcfbfa] text-zinc-800 font-mono shadow-[0_30px_70px_rgba(0,0,0,0.85)] relative border-x border-zinc-300/80 pt-4 pb-6 px-4 sm:px-7 select-text"
            style={{
              backgroundImage: `
              radial-gradient(rgba(0,0,0,0.02) 1px, transparent 0),
              linear-gradient(to bottom, #fcfbfa, #f7f6f1)
            `,
              backgroundSize: '8px 8px, 100% 100%',
            }}
          >
            {/* Paper Texture Top Edge subtle curl shadow */}
            <div className="absolute top-0 left-0 right-0 h-3 bg-gradient-to-b from-black/10 to-transparent pointer-events-none" />

            {/* ================= HEADER SECTION ================= */}
            <div className="text-center space-y-2 border-b-2 border-dashed border-zinc-400/90 pb-4">
              {/* Merchant Brand */}
              <div className="inline-block px-3 py-0.5 border border-zinc-900 text-xs font-black tracking-widest uppercase mb-1">
                OFFICIAL LOVE VOUCHER
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-widest text-zinc-950 leading-none">
                PLIVIN &amp; CO.
              </h1>
              <p className="text-[10px] sm:text-[11px] uppercase tracking-wider text-zinc-600 font-semibold">
                Kementerian Perasaan &bull; Cabang Hatiku No. 01
              </p>
              <p className="text-[9px] text-zinc-500 italic">
                Jl. Menuju Hatimu Selamanya No. 143, Bahagia Selalu
              </p>

              {/* Metadata Table */}
              <div className="pt-2 text-[10px] sm:text-[11px] text-zinc-700 font-medium space-y-0.5 border-t border-dotted border-zinc-300">
                <div className="flex justify-between">
                  <span>WAKTU : {formattedDate}</span>
                  <span>{formattedTime}</span>
                </div>
                <div className="flex justify-between">
                  <span>ORDER : #{receiptOrderCode}</span>
                  <span>POS : 01 (CINTA)</span>
                </div>
                <div className="flex justify-between">
                  <span>KASIR : Aku</span>
                  <span>STATUS : LUNAS LENGKAP</span>
                </div>
              </div>
            </div>

            {/* ================= CUSTOMER CALLOUT ================= */}
            <div className="my-3 py-2 px-3 bg-zinc-100/80 border border-zinc-300 rounded text-center">
              <span className="text-[9px] text-zinc-500 uppercase tracking-widest block font-bold">
                CUSTOMER TERFAVORIT (VIP) :
              </span>
              <span className="text-base sm:text-lg font-black text-rose-600 tracking-wide uppercase">
                {recipientName}
              </span>
            </div>

            {/* ================= ITEMIZED RECEIPT TABLE ================= */}
            <div className="space-y-2 text-left text-xs sm:text-[13px] border-b-2 border-dashed border-zinc-400/90 pb-3">
              <div className="flex justify-between font-bold text-zinc-500 text-[10px] uppercase border-b border-zinc-300 pb-1">
                <span>DESKRIPSI ITEM</span>
                <span>JUMLAH</span>
              </div>

              {/* Item 1 */}
              <div className="flex justify-between items-start pt-1">
                <div className="pr-2">
                  <p className="font-bold text-zinc-900 leading-tight">1x Senyuman Manis Setiap Hari</p>
                  <p className="text-[10px] text-zinc-500 font-sans">Bikin hari-hari capek langsung adem lagi</p>
                </div>
                <span className="font-bold whitespace-nowrap">Rp 0</span>
              </div>

              {/* Item 2 */}
              <div className="flex justify-between items-start">
                <div className="pr-2">
                  <p className="font-bold text-zinc-900 leading-tight">365x Pelukan &amp; Teman Cerita</p>
                  <p className="text-[10px] text-zinc-500 font-sans">Siap sedia kapan pun kamu butuh sandaran</p>
                </div>
                <span className="font-bold whitespace-nowrap">Rp 0</span>
              </div>

              {/* Item 3 */}
              <div className="flex justify-between items-start">
                <div className="pr-2">
                  <p className="font-bold text-zinc-900 leading-tight">1x Kesabaran Ekstra Tanpa Batas</p>
                  <p className="text-[10px] text-zinc-500 font-sans">Anti ngambek lama, selalu dengerin kamu</p>
                </div>
                <span className="font-bold whitespace-nowrap">Rp 0</span>
              </div>

              {/* Item 4 */}
              <div className="flex justify-between items-start">
                <div className="pr-2">
                  <p className="font-bold text-zinc-900 leading-tight">1x Tempat Pulang Paling Nyaman</p>
                  <p className="text-[10px] text-zinc-500 font-sans">Kepemilikan permanen khusus buat kamu</p>
                </div>
                <span className="font-bold whitespace-nowrap">Rp 0</span>
              </div>

              {/* Item 5 */}
              <div className="flex justify-between items-start">
                <div className="pr-2">
                  <p className="font-bold text-zinc-900 leading-tight">∞x Doa Terbaik &amp; Kasih Sayang Tulus</p>
                  <p className="text-[10px] text-zinc-500 font-sans">Biar kita berdua bahagia &amp; langgeng terus</p>
                </div>
                <span className="font-bold whitespace-nowrap">Rp 0</span>
              </div>
            </div>

            {/* ================= TOTALS & SUMMARY ================= */}
            <div className="py-2.5 space-y-1 text-xs border-b-2 border-dashed border-zinc-400/90 text-zinc-700">
              <div className="flex justify-between">
                <span>SUBTOTAL (5 ITEMS)</span>
                <span>Rp 0</span>
              </div>
              <div className="flex justify-between text-zinc-600">
                <span>DISKON SPESIAL (100%)</span>
                <span>-Rp 999.999.999</span>
              </div>
              <div className="flex justify-between text-zinc-600">
                <span>PAJAK KASIH SAYANG</span>
                <span>IKHLAS 100%</span>
              </div>
              <div className="flex justify-between font-black text-sm sm:text-base text-zinc-950 pt-2 border-t border-zinc-300">
                <span>TOTAL PEMBAYARAN:</span>
                <span className="text-rose-600">PRICELESS ❤️</span>
              </div>
              <div className="flex justify-between text-[10px] text-zinc-500 italic">
                <span>METODE BAYAR:</span>
                <span>CINTA MATI (SEUMUR HIDUP)</span>
              </div>
            </div>

            {/* ================= SPECIAL NOTE / MESSAGE ================= */}
            <div className="my-3.5 bg-amber-50/70 p-3.5 rounded border border-amber-200/90 text-left space-y-1.5 shadow-xs">
              <div className="flex items-center justify-between text-[10px] font-bold text-amber-900 uppercase tracking-wider">
                <span className="flex items-center gap-1">
                  <span>📝</span> PESAN KASIR UNTUKMU:
                </span>
                <span className="text-amber-700/80 font-normal">CONFIDENTIAL</span>
              </div>
              <p className="text-xs sm:text-[13px] text-zinc-800 leading-relaxed font-sans whitespace-pre-wrap">
                {defaultMsg}
              </p>
            </div>

            {/* ================= PHOTO EVIDENCE SECTION ================= */}
            <div className="my-4 pt-1 space-y-2.5">
              <div className="flex items-center justify-between text-left">
                <span className="text-[10px] sm:text-[11px] font-bold text-zinc-800 uppercase tracking-wider flex items-center gap-1.5">
                  <span>📸</span> LAMPIRAN MEMORI ({displayPhotos.length} BUKTI FOTO)
                </span>
                <span className="text-[9px] text-zinc-500 font-sans">KLIK FOTO</span>
              </div>

              {/* Grid of photos resembling thermal paper dither/black & white proof */}
              <div className="grid grid-cols-3 gap-2">
                {displayPhotos.slice(0, 3).map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActivePhotoModal(img)}
                    className="group text-left bg-white p-1 border border-zinc-300 shadow-sm rounded-sm hover:-translate-y-1 hover:shadow-md transition-all duration-200 cursor-pointer overflow-hidden"
                  >
                    <div className="relative aspect-square w-full overflow-hidden bg-zinc-200">
                      <img
                        src={img}
                        alt={`Memori ${idx + 1}`}
                        className="w-full h-full object-cover grayscale contrast-125 group-hover:scale-105 group-hover:grayscale-0 transition-all duration-300"
                      />
                      <div className="absolute top-1 left-1 bg-black/70 text-white text-[8px] font-mono px-1 rounded">
                        #{idx + 1}
                      </div>
                    </div>
                    <span className="block text-[8px] sm:text-[9px] text-center text-zinc-500 mt-1 font-sans font-semibold">
                      BUKTI-{idx + 1}.JPG
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* ================= TAP-ABLE STAMP BUTTON ================= */}
            <div className="my-3 flex flex-col items-center justify-center">
              <button
                type="button"
                onClick={() => {
                  if (!stampTapped) {
                    playStampSound();
                    setStampTapped(true);
                  }
                }}
                className={`p-3 rounded-xl border-2 border-dashed transition-all cursor-pointer relative max-w-xs w-full text-center active:scale-95 ${stampTapped
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-800 rotate-[-4deg] shadow-md scale-102'
                    : 'border-rose-400 bg-rose-50/60 text-rose-600 hover:border-rose-500 hover:bg-rose-100/60 animate-bounce'
                  }`}
              >
                {/* Stamp Ink Edge Look */}
                <div className="text-xs sm:text-sm font-black uppercase tracking-widest">
                  {stampTapped ? '✓ TELAH DISTEMPEL LUNAS' : '❤️ TAP UNTUK STEMPEL RESMI'}
                </div>
                <div className="text-[10px] font-sans font-medium mt-0.5">
                  {stampTapped
                    ? 'Sah &amp; Mengikat Selamanya di Lubuk Hati'
                    : 'Klik di sini untuk membubuhkan cap cinta'}
                </div>

                {stampTapped && (
                  <div className="text-[9px] text-emerald-700 font-mono mt-1 pt-1 border-t border-emerald-300">
                    VERIFIED BY LOVE-DEPT &bull; {formattedDate}
                  </div>
                )}
              </button>
            </div>

            {/* ================= BARCODE & FOOTER ================= */}
            <div className="space-y-2 pt-3 border-t-2 border-dashed border-zinc-400/90 text-center">
              {/* Visual Barcode with irregular thermal receipt lines */}
              <div className="flex justify-center items-center h-12 sm:h-14 gap-[2px] opacity-85 overflow-hidden px-4">
                {[
                  2, 1, 3, 1, 4, 1, 2, 1, 3, 2, 1, 4, 1, 2, 3, 1, 2, 4, 1, 1, 3, 2,
                  1, 4, 2, 1, 3, 1, 2, 4, 1, 3, 2, 1, 2, 3, 1, 4, 2, 1, 3, 1, 2, 1,
                ].map((w, i) => (
                  <div
                    key={i}
                    className="bg-zinc-900 h-full"
                    style={{ width: `${w}px` }}
                  />
                ))}
              </div>

              <p className="text-[10px] sm:text-[11px] text-zinc-600 font-mono tracking-widest font-semibold">
                *{receiptOrderCode}*
              </p>

              <div className="pt-1 space-y-0.5">
                <p className="text-[11px] sm:text-xs font-black text-zinc-800 tracking-wider">
                  TERIMA KASIH TELAH MEMILIHKU! ✨
                </p>
                <p className="text-[9px] sm:text-[10px] text-zinc-500 font-sans italic">
                  Barang yang sudah dibeli (hatiku) tidak dapat ditukar atau dikembalikan lagi.
                </p>
                <p className="text-[8px] text-zinc-400 font-mono pt-1">
                  Dicetak otomatis oleh Plivin Thermal Love Engine &bull; plivin.co
                </p>
              </div>
            </div>
          </div>

          {/* REALISTIC ZIG-ZAG TEAR / SERRATED CUTTER EDGE */}
          <div
            className="w-full h-4 bg-[#f7f6f1] shadow-[0_15px_25px_rgba(0,0,0,0.5)] -mt-[1px]"
            style={{
              clipPath:
                'polygon(0% 0%, 2.5% 100%, 5% 0%, 7.5% 100%, 10% 0%, 12.5% 100%, 15% 0%, 17.5% 100%, 20% 0%, 22.5% 100%, 25% 0%, 27.5% 100%, 30% 0%, 32.5% 100%, 35% 0%, 37.5% 100%, 40% 0%, 42.5% 100%, 45% 0%, 47.5% 100%, 50% 0%, 52.5% 100%, 55% 0%, 57.5% 100%, 60% 0%, 62.5% 100%, 65% 0%, 67.5% 100%, 70% 0%, 72.5% 100%, 75% 0%, 77.5% 100%, 80% 0%, 82.5% 100%, 85% 0%, 87.5% 100%, 90% 0%, 92.5% 100%, 95% 0%, 97.5% 100%, 100% 0%)',
            }}
          />

          {/* BOTTOM FLOATING DOWNLOAD BUTTON */}
          {printStage === 'completed' && (
            <div className="mt-4 flex items-center justify-center z-30">
              <button
                type="button"
                onClick={handleDownloadImage}
                disabled={isExporting}
                className="px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-500/20 via-teal-500/20 to-emerald-500/20 hover:from-emerald-500/30 hover:to-teal-500/30 active:scale-95 text-emerald-300 hover:text-white border border-emerald-500/40 backdrop-blur-md text-xs sm:text-sm font-sans font-black flex items-center justify-center gap-2 cursor-pointer shadow-[0_8px_25px_rgba(16,185,129,0.2)] transition-all"
              >
                <span className="text-base">📥</span>
                <span>{isExporting ? 'Sedang Memproses Gambar...' : 'Download Struk (Foto)'}</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* MODAL PREVIEW FOR PHOTO EVIDENCE */}
      {activePhotoModal && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setActivePhotoModal(null)}
        >
          <div
            className="bg-white p-3 sm:p-4 rounded-xl max-w-sm sm:max-w-md w-full shadow-2xl relative animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-2 pb-1 border-b border-zinc-200">
              <span className="text-xs font-bold text-zinc-700 font-mono">
                📸 BUKTI MEMORI BERSAMA
              </span>
              <button
                type="button"
                onClick={() => setActivePhotoModal(null)}
                className="text-zinc-500 hover:text-black text-sm px-2 py-0.5 rounded-full hover:bg-zinc-100"
              >
                ✕
              </button>
            </div>
            <div className="rounded overflow-hidden bg-zinc-100 aspect-square sm:aspect-4/3 w-full">
              <img
                src={activePhotoModal}
                alt="Bukti Memori Detail"
                className="w-full h-full object-cover"
              />
            </div>
            <p className="text-[11px] text-zinc-500 text-center mt-2 font-mono">
              Tersimpan selamanya di arsip cinta kami ❤️
            </p>
          </div>
        </div>
      )}

      {/* Floating Universal Music Player */}
      <UniversalMusicPlayer
        musicUrl={musicUrl}
        isPlaying={isMusicPlaying}
        showControls={introPhase === 'printing_done'}
      />

      {/* ================= INTRO CASHIER CHECKOUT OVERLAY ================= */}
      {introPhase !== 'printing_done' && (
        <div
          className={`fixed inset-0 z-50 bg-[#0a0a0d]/90 flex items-center justify-center p-4 sm:p-6 transition-all duration-700 font-sans ${introPhase === 'fading_out'
              ? 'opacity-0 scale-105 pointer-events-none backdrop-blur-none'
              : 'opacity-100 scale-100 backdrop-blur-md'
            }`}
        >
          <div
            className={`w-full max-w-sm sm:max-w-md bg-[#fdfbf7] text-zinc-800 rounded-3xl p-6 sm:p-8 border border-[#e5decb] shadow-[0_25px_60px_rgba(0,0,0,0.6),inset_0_0_80px_rgba(215,195,155,0.18)] text-center relative overflow-hidden transition-all duration-700 ease-out transform ${introPhase === 'fading_out'
                ? 'scale-95 opacity-0 blur-sm translate-y-4'
                : introPhase === 'processing'
                  ? 'scale-95 opacity-90'
                  : 'scale-100 opacity-100 translate-y-0'
              }`}
            style={{
              backgroundImage: `
                radial-gradient(rgba(140,120,83,0.15) 1px, transparent 1px),
                linear-gradient(to bottom, #fdfbf7, #f7f3e8)
              `,
              backgroundSize: '14px 14px, 100% 100%',
            }}
          >
            {/* Top Merchant Brand Badge on Paper */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-100 border border-stone-300 text-[10px] font-mono tracking-widest text-stone-600 uppercase mb-3 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>KASIR PLIVIN &bull; TERMINAL 01</span>
            </div>

            {/* Customer Greeting */}
            <h2 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight mb-1">
              Pesanan Cinta Untukmu 🧾✨
            </h2>
            <p className="text-xs sm:text-[13px] text-stone-600 font-medium mb-5">
              Hai <span className="text-rose-600 font-bold">{recipientName}</span>, satu transaksi kado spesial telah disiapkan dan siap dicetak!
            </p>

            {/* Paper Slip Item Invoice Box */}
            <div className="bg-white/90 border border-stone-300/80 rounded-2xl p-4 sm:p-5 text-left mb-6 shadow-xs relative overflow-hidden">
              <div className="flex items-center justify-between pb-2.5 border-b border-dashed border-stone-300 mb-3">
                <span className="text-[10px] font-mono text-stone-500 tracking-wider uppercase font-semibold">
                  TICKET LOVE VOUCHER
                </span>
                <span className="text-xs">💌</span>
              </div>

              <div className="space-y-1 font-mono">
                <div className="text-[10px] text-stone-500 uppercase tracking-widest font-semibold">RINCIAN PESANAN:</div>
                <div className="text-xs sm:text-sm font-bold text-stone-900">
                  Paket Cinta &bull; Seumur Hidup Bersama
                </div>
                <div className="flex justify-between items-end pt-3 border-t border-dotted border-stone-200 mt-2">
                  <div>
                    <span className="text-[9px] text-stone-500 uppercase block font-semibold">TOTAL BIAYA:</span>
                    <span className="text-xs sm:text-sm font-black text-rose-600">
                      Rp 0 (PRICELESS / TAK TERNILAI)
                    </span>
                  </div>
                  <span className="text-[10px] bg-rose-50 text-rose-700 border border-rose-300 px-2 py-0.5 rounded font-black tracking-wider">
                    LUNAS 100%
                  </span>
                </div>
              </div>
            </div>

            {/* Dynamic Button / Processing State without solid bg */}
            {introPhase === 'processing' ? (
              <div className="py-3 space-y-2.5">
                <div className="w-8 h-8 border-2 border-stone-700 border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-xs sm:text-[13px] font-bold text-stone-800 font-mono tracking-wide animate-pulse">
                  {checkoutStepText}
                </p>
                <div className="w-40 bg-stone-200 h-1.5 rounded-full mx-auto overflow-hidden">
                  <div className="bg-stone-700 h-full w-full animate-pulse" />
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={handleStartCheckout}
                  className="w-full py-3 px-4 bg-transparent hover:bg-stone-100/80 active:scale-95 text-stone-900 font-black text-xs sm:text-sm rounded-2xl border-2 border-dashed border-stone-600 transition-all cursor-pointer flex items-center justify-center gap-2 group"
                >
                  <span className="text-base group-hover:scale-110 transition-transform">🖨️</span>
                  <span className="tracking-wide">Cetak Struk Cinta Sekarang!</span>
                </button>
                <p className="text-[10px] text-stone-500 font-mono">
                  Ketuk tombol di atas untuk menjalankan mesin kasir thermal
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
