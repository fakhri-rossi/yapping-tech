'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import QRCode from 'qrcode';

export interface QRModelOption {
  id: string;
  name: string;
  emoji: string;
  imagePath: string; // relative to public/
  rotationDeg?: number; // optional rotation in degrees (positive = rotate right/clockwise)
  // Target QR placement box on frame image (percentage of image width/height)
  targetBox: {
    xPct: number;
    yPct: number;
    wPct: number;
    hPct: number;
  };
}

export const QR_MODELS: QRModelOption[] = [
  {
    id: 'qris',
    name: 'Stand Frame Classic',
    emoji: '📄',
    imagePath: '/images/qrcode/qris.png',
    targetBox: { xPct: 22.5, yPct: 30.5, wPct: 52, hPct: 52 },
  },
  {
    id: 'qris_cat',
    name: 'Kucing Paw',
    emoji: '🐾',
    imagePath: '/images/qrcode/qris_cat.png',
    targetBox: { xPct: 9.5, yPct: 17.5, wPct: 29.5, hPct: 29.5 },
    rotationDeg: 6.5, // Rotated slightly to the right (clockwise) to match cat paw sign angle
  },
  {
    id: 'qris_cat_2',
    name: 'Kucing Troli',
    emoji: '🛒',
    imagePath: '/images/qrcode/qris_cat_2.png',
    targetBox: { xPct: 10, yPct: 35, wPct: 32, hPct: 32 },
  },
  {
    id: 'qris_dog',
    name: 'Anjing Lucu',
    emoji: '🐶',
    imagePath: '/images/qrcode/qris_dog.png',
    targetBox: { xPct: 44.2, yPct: 53.8, wPct: 35.8, hPct: 35.8 },
  },
  {
    id: 'qris_love',
    name: 'Heart Love',
    emoji: '💖',
    imagePath: '/images/qrcode/qris_love.png',
    targetBox: { xPct: 10, yPct: 10, wPct: 80, hPct: 80 },
  },
  {
    id: 'plain',
    name: 'QR Standard',
    emoji: '📱',
    imagePath: '',
    targetBox: { xPct: 0, yPct: 0, wPct: 100, hPct: 100 },
  },
];

// Smooth bezier heart path for canvas clipping and drawing
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

interface QRCodeGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  url: string;
  title?: string;
  recipientName?: string;
  initialModelId?: string;
}

export default function QRCodeGeneratorModal({
  isOpen,
  onClose,
  url,
  title = 'QR Code Link Kado',
  recipientName,
  initialModelId = 'qris',
}: QRCodeGeneratorModalProps) {
  const [selectedModelId, setSelectedModelId] = useState<string>(initialModelId);
  const [prevInitialModelId, setPrevInitialModelId] = useState<string>(initialModelId);
  const [qrColor, setQrColor] = useState<string>('#000000');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedToast, setCopiedToast] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  if (initialModelId !== prevInitialModelId) {
    setPrevInitialModelId(initialModelId);
    setSelectedModelId(initialModelId);
  }

  const selectedModel = QR_MODELS.find((m) => m.id === selectedModelId) || QR_MODELS[0];

  const renderCompositeQR = useCallback(async () => {
    if (!canvasRef.current || !url) return;
    setIsGenerating(true);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    try {
      if (selectedModel.id === 'plain') {
        // Render Plain standalone QR code
        canvas.width = 600;
        canvas.height = 600;
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, 600, 600);

        // Generate QR code onto temporary canvas
        const qrCanvas = document.createElement('canvas');
        await QRCode.toCanvas(qrCanvas, url, {
          width: 500,
          margin: 2,
          errorCorrectionLevel: 'H',
          color: { dark: qrColor, light: '#ffffff' },
        });

        // Center on canvas
        ctx.drawImage(qrCanvas, 50, 50, 500, 500);

        // Add subtle bottom text
        ctx.fillStyle = '#64748b';
        ctx.font = 'bold 16px Montserrat, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Scan untuk membuka kado digital ✨', 300, 580);
      } else if (selectedModel.id === 'qris_love') {
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
        const recipientTitle = recipientName ? `SPESIAL BUAT ${recipientName.toUpperCase()}` : 'SPESIAL BUAT KAMU';
        ctx.fillText(recipientTitle, 300, 135);

        // 4. Generate High-Contrast, Error-Corrected QR Code
        const qrCanvas = document.createElement('canvas');
        const qrSize = 310;
        await QRCode.toCanvas(qrCanvas, url, {
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

        // Draw QR background card with subtle border
        ctx.fillStyle = '#ffffff';
        ctx.strokeStyle = '#fecdd3';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(qrX - 8, qrY - 8, qrSize + 16, qrSize + 16, 16);
        ctx.fill();
        ctx.stroke();

        // Draw QR Code
        ctx.drawImage(qrCanvas, qrX, qrY, qrSize, qrSize);

        // Draw heart center badge in middle of QR
        const badgeSize = 56;
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
        // Render Frame Image Overlay
        const baseImg = new Image();
        baseImg.crossOrigin = 'anonymous';
        baseImg.src = selectedModel.imagePath;

        await new Promise<void>((resolve, reject) => {
          baseImg.onload = () => resolve();
          baseImg.onerror = (err) => reject(err);
        });

        const imgWidth = baseImg.naturalWidth || 800;
        const imgHeight = baseImg.naturalHeight || 800;
        canvas.width = imgWidth;
        canvas.height = imgHeight;

        // 1. Draw frame background
        ctx.drawImage(baseImg, 0, 0, imgWidth, imgHeight);

        // 2. Target box calculation
        const { xPct, yPct, wPct, hPct } = selectedModel.targetBox;
        const targetX = (xPct / 100) * imgWidth;
        const targetY = (yPct / 100) * imgHeight;
        const targetW = (wPct / 100) * imgWidth;
        const targetH = (hPct / 100) * imgHeight;

        // 3. Generate QR Code image
        const qrCanvas = document.createElement('canvas');
        await QRCode.toCanvas(qrCanvas, url, {
          width: Math.round(targetW),
          margin: 1,
          errorCorrectionLevel: 'H',
          color: {
            dark: qrColor,
            light: '#ffffff',
          },
        });

        // Draw overlay (with optional rotation degrees)
        if (selectedModel.rotationDeg) {
          ctx.save();
          const centerX = targetX + targetW / 2;
          const centerY = targetY + targetH / 2;
          ctx.translate(centerX, centerY);
          ctx.rotate((selectedModel.rotationDeg * Math.PI) / 180);
          ctx.drawImage(qrCanvas, -targetW / 2, -targetH / 2, targetW, targetH);
          ctx.restore();
        } else {
          ctx.drawImage(qrCanvas, targetX, targetY, targetW, targetH);
        }
      }
    } catch (err) {
      console.error('Failed to generate composite QR:', err);
    } finally {
      setIsGenerating(false);
    }
  }, [url, selectedModel, qrColor, recipientName]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        renderCompositeQR();
      }, 50);
    }
  }, [isOpen, renderCompositeQR]);

  if (!isOpen) return null;

  const handleDownload = () => {
    if (!canvasRef.current) return;
    const link = document.createElement('a');
    link.download = `qrcode-kado-${selectedModel.id}-${recipientName || 'plivin'}.png`;
    link.href = canvasRef.current.toDataURL('image/png');
    link.click();
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedToast(true);
      setTimeout(() => setCopiedToast(false), 2000);
    } catch {
      // fallback
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-3xl max-w-lg w-full p-6 sm:p-7 relative max-h-[92vh] overflow-y-auto">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-100 hover:bg-rose-100 text-black hover:text-rose-600 border-2 border-black flex items-center justify-center font-black text-sm transition cursor-pointer"
        >
          ✕
        </button>

        {/* Header */}
        <div className="text-center mb-5">
          <span className="px-3 py-1 bg-yellow-200 border-2 border-black text-black font-black text-[11px] uppercase tracking-wider rounded-full inline-block mb-2">
            🏷️ Cetak Stand / Kartu Kado
          </span>
          <h3 className="text-xl sm:text-2xl font-black text-black">{title}</h3>
          <p className="text-xs text-slate-600 font-bold mt-1">
            Pilih model frame desain untuk dicetak di kartu kado atau akrilik!
          </p>
        </div>

        {/* Model Selector Tabs */}
        <div className="grid grid-cols-3 gap-2 mb-5">
          {QR_MODELS.map((model) => (
            <button
              key={model.id}
              type="button"
              onClick={() => setSelectedModelId(model.id)}
              className={`p-2.5 rounded-xl border-2 border-black text-xs font-black transition flex flex-col items-center gap-1 cursor-pointer ${
                selectedModelId === model.id
                  ? 'bg-black text-white shadow-[3px_3px_0px_0px_rgba(244,63,94,1)] -translate-y-0.5'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-800 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
              }`}
            >
              <span className="text-lg">{model.emoji}</span>
              <span className="truncate w-full text-center text-[11px]">{model.name}</span>
            </button>
          ))}
        </div>

        {/* Color Palette (for Plain model) */}
        {selectedModelId === 'plain' && (
          <div className="mb-4 flex items-center justify-center gap-2">
            <span className="text-xs font-black text-slate-600">Warna QR:</span>
            {['#000000', '#e11d48', '#2563eb', '#7c3aed', '#059669'].map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setQrColor(c)}
                style={{ backgroundColor: c }}
                className={`w-6 h-6 rounded-full border-2 border-black transition cursor-pointer ${
                  qrColor === c ? 'scale-125 ring-2 ring-black' : ''
                }`}
              />
            ))}
          </div>
        )}

        {/* QR Canvas Display */}
        <div className="bg-slate-50 border-2 border-black rounded-2xl p-4 flex flex-col items-center justify-center relative min-h-[280px]">
          {isGenerating && (
            <div className="absolute inset-0 bg-white/80 backdrop-blur-xs flex items-center justify-center rounded-2xl z-10">
              <span className="text-xs font-black text-slate-700 animate-pulse">
                Merender Frame... 🎨
              </span>
            </div>
          )}
          <canvas
            ref={canvasRef}
            className="max-w-[260px] max-h-[260px] w-auto h-auto rounded-xl border border-slate-200 shadow-sm object-contain"
          />
          <div className="text-[10px] text-slate-500 font-mono mt-3 truncate max-w-xs text-center">
            {url}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-5 space-y-2.5">
          <button
            type="button"
            onClick={handleDownload}
            className="w-full py-3 px-4 bg-emerald-500 hover:bg-emerald-400 text-black font-black text-sm uppercase tracking-wider rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] transition cursor-pointer flex items-center justify-center gap-2"
          >
            <span>⬇️</span> Download Gambar HD (Siap Cetak)
          </button>

          <button
            type="button"
            onClick={handleCopyLink}
            className="w-full py-2.5 px-4 bg-white hover:bg-slate-100 text-black font-bold text-xs rounded-xl border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition cursor-pointer flex items-center justify-center gap-2"
          >
            <span>{copiedToast ? '✅ Tersalin!' : '📋 Salin Tautan Langsung'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
