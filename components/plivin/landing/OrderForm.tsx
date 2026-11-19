/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect } from 'react';
import { TEMPLATE_DATA, WHATSAPP_NUMBER } from '@config/gifts';
import ParagraphEditor from '@components/plivin/common/ParagraphEditor';
import QRCodeGeneratorModal from '@components/plivin/common/QRCodeGeneratorModal';
import SelectField from '@components/plivin/common/SelectField';
import {
  getDefaultGreetingForTemplate,
  GREETING_PRESETS,
  POPULAR_MUSIC_PRESETS,
  DEMO_DATA,
} from '@config/gifts';
import { compressImage } from '@lib/image-utils';
import { useLanguage } from '@context/LanguageContext';
import Link from 'next/link';

interface OrderFormProps {
  preselectedTemplate?: string;
}

interface FormErrors {
  clientName?: string;
  clientWhatsapp?: string;
  partnerName?: string;
  greetingType?: string;
  selectedTemplate?: string;
  greetingText?: string;
  photos?: string;
  paymentMethod?: string;
}

const COUNTRY_CODES = [
  { code: '+62', label: '🇮🇩 Indonesia (+62)' },
  { code: '+1', label: '🇺🇸 USA / Canada (+1)' },
  { code: '+60', label: '🇲🇾 Malaysia (+60)' },
  { code: '+65', label: '🇸🇬 Singapore (+65)' },
  { code: '+61', label: '🇦🇺 Australia (+61)' },
  { code: '+44', label: '🇬🇧 UK (+44)' },
  { code: '+49', label: '🇩🇪 Germany (+49)' },
  { code: '+81', label: '🇯🇵 Japan (+81)' },
  { code: '+82', label: '🇰🇷 South Korea (+82)' },
  { code: '+63', label: '🇵🇭 Philippines (+63)' },
  { code: '+971', label: '🇦🇪 UAE (+971)' },
  { code: '+966', label: '🇸🇦 Saudi Arabia (+966)' },
  { code: '+91', label: '🇮🇳 India (+91)' },
  { code: '+31', label: '🇳🇱 Netherlands (+31)' },
];

export default function OrderForm({ preselectedTemplate }: OrderFormProps) {
  const { language, currency, formatPrice, t } = useLanguage();

  const [orderMode, setOrderMode] = useState<'instant' | 'whatsapp' | null>(null);
  const [countryCode, setCountryCode] = useState('+62');
  const [paymentGateway, setPaymentGateway] = useState<'qris' | 'doku' | 'paypal'>('qris');
  const [clientName, setClientName] = useState('');
  const [clientWhatsapp, setClientWhatsapp] = useState('');
  const [partnerName, setPartnerName] = useState('');
  const [greetingType, setGreetingType] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [greetingText, setGreetingText] = useState('');
  const [selectedGreetingPreset, setSelectedGreetingPreset] = useState<string | null>(null);
  const [musicUrl, setMusicUrl] = useState('/music/can-i-call-u-rose.mp3');
  const [selectedMusicPreset, setSelectedMusicPreset] = useState<string>('can-i-call-you-rose');
  const [customMusicMode, setCustomMusicMode] = useState<boolean>(false);
  const [photos, setPhotos] = useState<string[]>([]);
  const [videoUrlInput, setVideoUrlInput] = useState('');
  const [notes, setNotes] = useState('');
  const [customPin, setCustomPin] = useState('111111');
  const [customHint, setCustomHint] = useState('Hint: 111111');
  const [customPlaylist, setCustomPlaylist] = useState<
    Array<{ title: string; artist: string; url: string }>
  >([
    { title: 'Happy Birthday to You', artist: 'Special Birthday Song', url: 'https://www.youtube.com/watch?v=inS9gAgSENE' },
    { title: 'Count On Me', artist: 'Bruno Mars', url: 'https://www.youtube.com/watch?v=Cdm3fHmNBBM' },
    { title: 'Perfect', artist: 'Ed Sheeran', url: 'https://www.youtube.com/watch?v=2Vv-BfVoq4g' },
  ]);
  const [loading, setLoading] = useState(false);
  const [createdOrderNumber, setCreatedOrderNumber] = useState('');
  const [isPaid, setIsPaid] = useState(false);
  const [dokuPaymentUrl, setDokuPaymentUrl] = useState('');
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  // Sync default payment gateway with language / currency
  useEffect(() => {
    if (language === 'en' || currency === 'USD') {
      setPaymentGateway('paypal');
    } else {
      setPaymentGateway('qris');
    }
  }, [language, currency]);

  // Auto-poll order payment status every 3s when waiting for payment
  useEffect(() => {
    if (!createdOrderNumber || isPaid) return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/payment/check-status?identifier=${encodeURIComponent(createdOrderNumber)}`);
        const data = await res.json();
        if (data.success && (data.paymentStatus === 'PAID' || data.order?.payment_status === 'PAID')) {
          setIsPaid(true);
        }
      } catch (err) {
        console.warn('Status polling error:', err);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [createdOrderNumber, isPaid]);

  // Set preselected template
  useEffect(() => {
    if (preselectedTemplate) {
      const template = TEMPLATE_DATA.find((tmpl) => tmpl.title === preselectedTemplate);
      if (template) {
        setTimeout(() => {
          setSelectedTemplate(template.title);
          if (!greetingType && template.categories.length > 0) {
            setGreetingType(template.categories[0]);
          }
        }, 0);
      }
    }
  }, [preselectedTemplate, greetingType]);

  // Auto-populate default kata ucapan when template is selected
  useEffect(() => {
    if (selectedTemplate) {
      const tmpl = TEMPLATE_DATA.find((tmplItem) => tmplItem.title === selectedTemplate || tmplItem.id === selectedTemplate);
      if (tmpl) {
        setTimeout(() => {
          if (!selectedGreetingPreset) {
            setGreetingText(getDefaultGreetingForTemplate(tmpl.id));
          }
          const demoMusic = DEMO_DATA[tmpl.id]?.musicUrl;
          if (demoMusic && !customMusicMode && selectedMusicPreset === 'can-i-call-you-rose') {
            setMusicUrl(demoMusic);
          }
        }, 0);
      }
    }
  }, [selectedTemplate, selectedGreetingPreset, customMusicMode, selectedMusicPreset]);

  const filteredTemplates = TEMPLATE_DATA.filter((tmpl) => {
    if (!greetingType || greetingType === 'Lainnya') return true;
    return tmpl.categories.includes(greetingType);
  });

  const currentTemplate = TEMPLATE_DATA.find((tmpl) => tmpl.title === selectedTemplate);
  const isVideoSupported =
    currentTemplate?.id === 'retro-digicam-y2k' ||
    selectedTemplate === 'Retro Digicam Y2K 📸' ||
    currentTemplate?.id === 'vintage-camera' ||
    selectedTemplate === 'Vintage Camera' ||
    currentTemplate?.id === 'paper-scrapbook-memory' ||
    selectedTemplate === 'Paper Scrapbook Memory';

  // Upload photo or video files directly from form with automatic compression/conversion
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      const results: string[] = [];

      for (const file of Array.from(files)) {
        if (file.type.startsWith('video/')) {
          // Process video file directly using DataURL / FileReader
          const videoUrl = await new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onload = (evt) => resolve((evt.target?.result as string) || '');
            reader.onerror = () => resolve('');
            reader.readAsDataURL(file);
          });
          if (videoUrl) results.push(videoUrl);
        } else {
          // Process image file
          const compressed = await compressImage(file);
          if (compressed) results.push(compressed);
        }
      }

      if (results.length > 0) {
        setPhotos((prev) => [...prev, ...results]);
        setFormErrors((prev) => ({ ...prev, photos: undefined }));
      }
    } catch (err) {
      console.error('File upload error:', err);
      alert('Gagal memproses file media');
    } finally {
      e.target.value = '';
    }
  };

  const handleAddVideoUrl = () => {
    if (!videoUrlInput.trim()) return;
    setPhotos((prev) => [videoUrlInput.trim(), ...prev]);
    setVideoUrlInput('');
    setFormErrors((prev) => ({ ...prev, photos: undefined }));
  };

  const handleRemovePhoto = (idx: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSelectGreetingPreset = (presetId: string) => {
    setSelectedGreetingPreset(presetId);
    const found = GREETING_PRESETS.find((p) => p.id === presetId);
    if (found) {
      setGreetingText(found.text);
    }
  };

  const handleResetGreeting = () => {
    setSelectedGreetingPreset(null);
    if (currentTemplate) {
      setGreetingText(getDefaultGreetingForTemplate(currentTemplate.id));
    }
  };

  const handleSelectMusicPreset = (presetId: string) => {
    setSelectedMusicPreset(presetId);
    if (presetId === 'custom') {
      setCustomMusicMode(true);
      setMusicUrl('');
    } else {
      setCustomMusicMode(false);
      const found = POPULAR_MUSIC_PRESETS.find((p) => p.id === presetId);
      if (found) {
        setMusicUrl(found.url);
      }
    }
  };

  // Form Validation Logic
  const validateForm = (): boolean => {
    const errors: FormErrors = {};

    if (!clientName.trim()) {
      errors.clientName = language === 'en' ? 'Your name is required!' : 'Nama pemesan wajib diisi!';
    }
    if (!clientWhatsapp.trim()) {
      errors.clientWhatsapp = language === 'en' ? 'Phone/WhatsApp number is required!' : 'Nomor WhatsApp wajib diisi!';
    } else if (clientWhatsapp.trim().length < 6) {
      errors.clientWhatsapp = language === 'en' ? 'Please enter a valid phone number!' : 'Nomor WhatsApp minimal 6 digit!';
    }
    if (!partnerName.trim()) {
      errors.partnerName = language === 'en' ? 'Recipient name is required!' : 'Nama penerima wajib diisi!';
    }
    if (!greetingType) {
      errors.greetingType = language === 'en' ? 'Please select occasion!' : 'Tujuan ucapan wajib dipilih!';
    }
    if (!selectedTemplate) {
      errors.selectedTemplate = language === 'en' ? 'Please select a template!' : 'Pilihan template wajib dipilih!';
    }
    if (currentTemplate && currentTemplate.photosRequired > 0) {
      if (photos.length < currentTemplate.photosRequired) {
        errors.photos = language === 'en'
          ? `Template ${currentTemplate.title} requires at least ${currentTemplate.photosRequired} ${isVideoSupported ? 'videos/photos' : 'photos'}. Uploaded: ${photos.length}.`
          : `Template ${currentTemplate.title} membutuhkan minimal ${currentTemplate.photosRequired} ${isVideoSupported ? 'video/foto' : 'foto'}. Terpilih baru ${photos.length}.`;
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const triggerDokuCheckout = (url: string) => {
    if (typeof document !== 'undefined') {
      document.querySelectorAll('[id*="jokul"], [class*="jokul"]').forEach((el) => {
        if (el.tagName !== 'SCRIPT') {
          el.remove();
        }
      });
    }

    setTimeout(() => {
      if (typeof (window as any).loadJokulCheckout === 'function') {
        try {
          (window as any).loadJokulCheckout(url);
        } catch {
          window.location.assign(url);
        }
      } else {
        window.location.assign(url);
      }
    }, 50);
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!validateForm()) {
      const activeErrors = Object.keys(formErrors).filter((k) => !!formErrors[k as keyof FormErrors]);
      const firstErrorKey = activeErrors[0];
      const errorElem = document.getElementById(firstErrorKey || 'orderSection');
      if (errorElem) {
        errorElem.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    if (!currentTemplate) return;

    setLoading(true);

    try {
      const isMaroon = currentTemplate.id === 'maroon-birthday-surprise';
      const validPlaylist = customPlaylist
        .filter((s) => s.url && s.url.trim())
        .slice(0, 3);

      const finalNotes = isMaroon
        ? JSON.stringify({
          pin: customPin.replace(/\D/g, '').slice(0, 6) || '111111',
          hint: customHint || `Hint: ${customPin.replace(/\D/g, '').slice(0, 6) || '111111'}`,
          playlist: validPlaylist.length > 0 ? validPlaylist : undefined,
        })
        : notes;

      const fullCustomerPhone = `${countryCode} ${clientWhatsapp}`.trim();

      // 1. Create order in system
      const res = await fetch('/api/order/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: clientName,
          customerWhatsapp: fullCustomerPhone,
          recipientName: partnerName,
          templateId: currentTemplate.id,
          greetingText: greetingText.trim() || getDefaultGreetingForTemplate(currentTemplate.id),
          musicUrl: isMaroon && validPlaylist.length > 0 ? validPlaylist[0].url : musicUrl,
          photos: photos,
          additionalNotes: finalNotes,
          amount: currentTemplate.price,
        }),
      });

      const data = await res.json();

      if (data.success && data.orderNumber) {
        setCreatedOrderNumber(data.orderNumber);
        setIsPaid(false);

        // 2. Request Payment Checkout URL based on chosen gateway
        try {
          if (paymentGateway === 'qris') {
            // QRIS mode: Stay on page to display QRIS image and WA confirmation button
          } else if (paymentGateway === 'paypal' || currency === 'USD') {
            const payRes = await fetch('/api/payment/paypal/create', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ orderIdentifier: data.orderNumber }),
            });
            const payData = await payRes.json();
            if (payData.success && payData.paymentUrl) {
              setDokuPaymentUrl(payData.paymentUrl);
              window.location.assign(payData.paymentUrl);
            }
          } else {
            const payRes = await fetch('/api/payment/create', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ orderIdentifier: data.orderNumber }),
            });
            const payData = await payRes.json();

            if (payData.success && payData.paymentUrl) {
              setDokuPaymentUrl(payData.paymentUrl);
              triggerDokuCheckout(payData.paymentUrl);
            }
          }
        } catch (payErr) {
          console.warn('Auto-checkout init note:', payErr);
        }
      } else {
        alert(`Gagal membuat pesanan: ${data.error}`);
      }
    } catch (err) {
      console.error(err);
      alert('Terjadi kesalahan koneksi saat memproses pesanan.');
    } finally {
      setLoading(false);
    }
  }

  const getWhatsAppOrderUrl = () => {
    const tmpl = TEMPLATE_DATA.find((tmplItem) => tmplItem.title === selectedTemplate);
    const priceStr = tmpl ? ` (${formatPrice(tmpl.price)})` : '';
    const fullPhone = `${countryCode} ${clientWhatsapp}`.trim();

    if (language === 'en' || countryCode !== '+62') {
      const message = `Hello Admin plivin.co! 👋
I would like to order a Digital Gift Website:

• Template: ${selectedTemplate || 'Not selected'}${priceStr}
• Occasion: ${greetingType || 'Birthday / Anniversary / Special'}
• Sender Name: ${clientName || '-'}
• Recipient Name: ${partnerName || '-'}
• Contact / WhatsApp: ${fullPhone || '-'}
• Preferred Payment: PayPal / Wise / Credit Card
• Special Requests: ${notes || '-'}

Please assist me with the order process and payment instructions. Thank you! ✨`;

      return `https://api.whatsapp.com/send?phone=${WHATSAPP_NUMBER}&text=${encodeURIComponent(message)}`;
    }

    const message = `Halo Admin plivin.co! 👋
Saya ingin memesan Website Digital Gift nih:

• Pilihan Template: ${selectedTemplate || 'Belum dipilih'}${priceStr}
• Kategori Acara: ${greetingType || 'Ulang Tahun / Anniversary / Wisuda'}
• Nama Pemesan: ${clientName || '-'}
• Nama Penerima: ${partnerName || '-'}
• No WhatsApp: ${fullPhone || '-'}
• Metode Bayar: Transfer Bank / QRIS / Wise / PayPal
• Catatan Tambahan: ${notes || '-'}

Mohon dibantu proses pemesanan & info nomor rekeningnya ya admin! Terima kasih ✨`;

    return `https://api.whatsapp.com/send?phone=${WHATSAPP_NUMBER}&text=${encodeURIComponent(message)}`;
  };

  const activeErrorMessages = Object.values(formErrors).filter(Boolean);

  return (
    <div id="orderSection" className="max-w-5xl mx-auto scroll-mt-24">
      {createdOrderNumber ? (
        isPaid ? (
          /* 1. SUCCESS SCREEN — Only shows when payment is PAID */
          <div className="bg-white border-4 border-black rounded-2xl p-8 md:p-10 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-center space-y-6 animate-fade-in">
            <span className="text-6xl block animate-bounce">🎉</span>
            <div className="space-y-1">
              <span className="px-3 py-1 bg-emerald-100 text-emerald-950 border-2 border-black rounded-full font-black text-xs uppercase tracking-wider inline-block">
                ✅ {language === 'en' ? 'Payment Confirmed!' : 'Pembayaran Berhasil Lunas!'}
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-black">{t.order.paymentSuccessTitle}</h2>
            </div>
            <p className="text-slate-700 font-medium text-xs sm:text-sm">
              {t.order.paymentSuccessDesc} (Order #{createdOrderNumber})
            </p>

            {/* Clickable Order Link Card */}
            <div className="bg-pink-50 border-2 border-black rounded-xl p-4 text-center space-y-1">
              <p className="text-xs font-bold text-slate-700">
                🔗 {language === 'en' ? 'Your Gift Dashboard Link (Click to Open):' : 'Link Dashboard Kelola Kado Anda (Klik untuk Buka):'}
              </p>
              <a
                href={`${typeof window !== 'undefined' ? window.location.origin : ''}/order/${createdOrderNumber}`}
                target="_blank"
                rel="noreferrer"
                className="text-pink-600 font-mono font-extrabold text-xs sm:text-sm underline hover:text-pink-800 break-all inline-block cursor-pointer"
              >
                {typeof window !== 'undefined' ? window.location.origin : ''}/order/{createdOrderNumber}
              </a>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Link
                href={`/order/${createdOrderNumber}`}
                className="flex-1 py-4 px-6 bg-pink-600 hover:bg-pink-500 text-white font-bold rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-xs uppercase tracking-wider text-center"
              >
                {t.order.manageGiftBtn}
              </Link>
              <button
                type="button"
                onClick={() => setIsQRModalOpen(true)}
                className="flex-1 py-4 px-6 bg-black hover:bg-slate-800 text-white font-bold rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-xs uppercase tracking-wider text-center flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>📱</span> Generate QR &amp; Frame
              </button>
            </div>
          </div>
        ) : (
          /* 2. PENDING PAYMENT SCREEN */
          <div className="bg-white border-4 border-black rounded-3xl p-6 sm:p-10 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] text-center space-y-6 max-w-xl mx-auto">
            {paymentGateway === 'qris' ? (
              /* QRIS PLIVIN DISPLAY & CONFIRMATION */
              <div className="space-y-6">
                <div className="space-y-2">
                  <span className="px-3.5 py-1 bg-rose-100 text-rose-900 border-2 border-black rounded-full font-black text-xs uppercase tracking-wider inline-block">
                    📱 PEMBAYARAN VIA QRIS RESMI
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-black text-black">
                    Scan &amp; Transfer QRIS
                  </h2>
                  <p className="text-slate-600 font-medium text-xs sm:text-sm">
                    No. Order: <strong className="font-mono font-black text-black">{createdOrderNumber}</strong>
                  </p>
                </div>

                {/* QRIS Frame Card */}
                <div className="bg-slate-50 border-3 border-black rounded-2xl p-4 sm:p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col items-center gap-3">
                  <div className="w-full max-w-[280px] bg-white p-2 border-2 border-black rounded-xl shadow-xs overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/qris-plivin.jpg"
                      alt="QRIS Plivin Official"
                      className="w-full h-auto object-contain rounded-lg"
                    />
                  </div>

                  <div className="w-full bg-white border-2 border-black rounded-xl p-3 text-center">
                    <span className="text-[11px] text-slate-500 font-bold uppercase block">Total yang Harus Ditransfer:</span>
                    <span className="text-2xl font-black text-rose-600 font-mono">
                      {formatPrice(currentTemplate?.price || 20000)}
                    </span>
                    <span className="text-[10px] text-slate-500 block mt-0.5">
                      (Bisa di-scan dari BCA, Mandiri, BRI, BNI, GoPay, OVO, Dana, ShopeePay)
                    </span>
                  </div>
                </div>

                {/* Steps */}
                <div className="bg-amber-50 border-2 border-black rounded-xl p-3.5 text-left text-xs font-medium text-amber-950 space-y-1.5">
                  <div className="font-black text-black flex items-center gap-1.5">
                    <span>📌</span> CARA PEMBAYARAN &amp; AKTIVASI:
                  </div>
                  <ol className="list-decimal list-inside space-y-1 text-slate-700 font-semibold text-[11px] sm:text-xs">
                    <li>Buka aplikasi m-Banking atau E-Wallet kamu, lalu <strong>Scan QRIS</strong> di atas.</li>
                    <li>Ketikkan nominal pas sebesar <strong>{formatPrice(currentTemplate?.price || 20000)}</strong>.</li>
                    <li>Screenshot / simpan bukti transfer berhasil.</li>
                    <li>Klik tombol hijau di bawah untuk kirim bukti ke WhatsApp Admin agar di-ACC!</li>
                  </ol>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col gap-3 pt-2">
                  <a
                    href={`https://api.whatsapp.com/send?phone=${WHATSAPP_NUMBER}&text=${encodeURIComponent(
                      `Halo Admin plivin.co! 👋\nSaya sudah melakukan transfer via QRIS untuk Order *#${createdOrderNumber}* atas nama *${clientName}* sebesar *${formatPrice(
                        currentTemplate?.price || 20000
                      )}*.\n\nBerikut bukti transfernya, mohon segera di-ACC ya min agar link & dashboard kado saya aktif! Terima kasih ✨`
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-4 px-6 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-2xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-xs sm:text-sm uppercase tracking-wider text-center cursor-pointer flex items-center justify-center gap-2 hover:-translate-y-0.5 transition-all"
                  >
                    <span>💬</span>
                    <span>Konfirmasi Bukti Transfer via WhatsApp</span>
                  </a>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={async () => {
                        try {
                          const res = await fetch(`/api/payment/check-status?identifier=${encodeURIComponent(createdOrderNumber)}`);
                          const data = await res.json();
                          if (data.success && (data.paymentStatus === 'PAID' || data.order?.payment_status === 'PAID')) {
                            setIsPaid(true);
                          } else {
                            alert('Pesanan masih menunggu konfirmasi/ACC dari Admin. Pastikan Kakak sudah kirim bukti transfer ke WhatsApp ya!');
                          }
                        } catch {
                          alert('Gagal memeriksa status');
                        }
                      }}
                      className="flex-1 py-3 px-4 bg-white hover:bg-slate-100 text-black font-extrabold rounded-xl border-2 border-black text-xs uppercase tracking-wider cursor-pointer shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center gap-1.5"
                    >
                      <span>🔄</span>
                      <span>Cek ACC Admin</span>
                    </button>

                    <Link
                      href={`/order/${createdOrderNumber}`}
                      className="py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold rounded-xl border-2 border-black text-xs uppercase tracking-wider cursor-pointer shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center"
                    >
                      Buka Dashboard ↗
                    </Link>
                  </div>
                </div>
              </div>
            ) : (
              /* DOKU / PAYPAL DEFAULT PENDING SCREEN */
              <>
                <span className="text-6xl block">⏳</span>
                <div className="space-y-1">
                  <span className="px-3 py-1 bg-amber-100 text-amber-950 border-2 border-black rounded-full font-black text-xs uppercase tracking-wider inline-block">
                    {language === 'en' ? 'Awaiting Payment' : 'Menunggu Pembayaran'}
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-black text-black">
                    {paymentGateway === 'paypal' ? 'Complete PayPal / Card Checkout 💳' : 'Selesaikan Pembayaran 💳'}
                  </h2>
                </div>
                <p className="text-slate-700 font-medium text-xs sm:text-sm">
                  Order #: <span className="font-mono font-bold text-black">{createdOrderNumber}</span>
                  <br />
                  {language === 'en'
                    ? 'Your gift dashboard and link will activate immediately upon payment.'
                    : 'Sistem akan otomatis mengaktifkan dashboard kado begitu Anda selesai membayar.'}
                </p>

                <div className="p-4 bg-slate-50 border-2 border-black rounded-xl space-y-2 text-xs font-medium text-slate-700 text-left">
                  <div className="flex items-center gap-2 font-bold text-black">
                    <span className="animate-spin text-sm">🔄</span>
                    <span>
                      {language === 'en'
                        ? 'Detecting payment status automatically (real-time)...'
                        : 'Mendeteksi status pembayaran secara otomatis (real-time)...'}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    {language === 'en'
                      ? 'If the checkout popup closed, click the button below to resume payment.'
                      : 'Jika popup pembayaran tertutup, klik tombol di bawah untuk membuka kembali.'}
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <button
                    type="button"
                    onClick={async () => {
                      if (dokuPaymentUrl) {
                        if (paymentGateway === 'paypal') {
                          window.location.assign(dokuPaymentUrl);
                        } else {
                          triggerDokuCheckout(dokuPaymentUrl);
                        }
                      } else {
                        const endpoint = paymentGateway === 'paypal' ? '/api/payment/paypal/create' : '/api/payment/create';
                        const payRes = await fetch(endpoint, {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ orderIdentifier: createdOrderNumber }),
                        });
                        const payData = await payRes.json();
                        if (payData.success && payData.paymentUrl) {
                          setDokuPaymentUrl(payData.paymentUrl);
                          if (paymentGateway === 'paypal') {
                            window.location.assign(payData.paymentUrl);
                          } else {
                            triggerDokuCheckout(payData.paymentUrl);
                          }
                        }
                      }
                    }}
                    className="flex-1 py-4 px-6 bg-rose-600 hover:bg-rose-500 text-white font-black rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-xs uppercase tracking-wider text-center cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span>💳</span>
                    <span>
                      {paymentGateway === 'paypal'
                        ? language === 'en'
                          ? 'Pay with PayPal / Card'
                          : 'Bayar via PayPal / Kartu'
                        : 'Buka Pembayaran'}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={async () => {
                      try {
                        const res = await fetch(`/api/payment/check-status?identifier=${encodeURIComponent(createdOrderNumber)}`);
                        const data = await res.json();
                        if (data.success && (data.paymentStatus === 'PAID' || data.order?.payment_status === 'PAID')) {
                          setIsPaid(true);
                        } else {
                          alert(language === 'en' ? 'Payment still pending.' : 'Status masih menunggu pembayaran.');
                        }
                      } catch {
                        alert('Gagal memeriksa status');
                      }
                    }}
                    className="py-4 px-6 bg-white hover:bg-slate-100 text-black font-bold rounded-xl border-2 border-black text-xs uppercase tracking-wider cursor-pointer shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                  >
                    🔄 {language === 'en' ? 'Check Status' : 'Cek Status'}
                  </button>
                </div>
              </>
            )}
          </div>
        )
      ) : orderMode === null ? (
        /* STANDALONE STEP 1: METHOD SELECTION (Clean, premium, NO form container yet) */
        <div className="max-w-4xl mx-auto space-y-8 animate-fade-in py-4">
          <div className="text-center space-y-3">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-rose-300 font-extrabold text-xs uppercase tracking-wider backdrop-blur-sm">
              <span>{language === 'en' ? 'Start Your Order' : 'Mulai Pesan Kado'}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
              {language === 'en' ? 'Choose How You Want to Order' : 'Pilih Cara Pemesanan Kado'}
            </h2>
            <p className="text-slate-300 font-medium text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
              {language === 'en'
                ? 'Create and pay instantly online, or relax and let our Admin handle everything via WhatsApp.'
                : 'Bisa langsung dibuat dan bayar serba otomatis dalam hitungan menit, atau santai dipandu admin via WhatsApp.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            {/* OPSI 1: INSTANT WEB (OTOMATIS) */}
            <div
              onClick={() => {
                setOrderMode('instant');
                setTimeout(() => {
                  document.getElementById('activeOrderBox')?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }}
              className="group relative bg-white text-black rounded-3xl p-7 sm:p-8 border-4 border-black shadow-[6px_6px_0px_0px_rgba(244,63,94,1)] hover:shadow-[10px_10px_0px_0px_rgba(244,63,94,1)] hover:-translate-y-1.5 transition-all duration-200 cursor-pointer flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-14 h-14 bg-black text-white rounded-2xl flex items-center justify-center p-2.5 border-2 border-black shadow-[3px_3px_0px_0px_rgba(244,63,94,1)] group-hover:scale-105 transition-transform">
                    <img
                      src="/images/emoji-lightning-3d.png"
                      alt="Instant Lightning"
                      className="w-full h-full object-contain filter drop-shadow-[0_2px_4px_rgba(251,191,36,0.5)]"
                    />
                  </div>
                  <span className="px-3 py-1 bg-rose-600 text-white font-black text-[11px] uppercase tracking-wider rounded-full shadow-xs">
                    Instant
                  </span>
                </div>

                <div>
                  <h3 className="text-xl sm:text-2xl font-black text-black group-hover:text-rose-600 transition-colors">
                    Pesan Otomatis (via Web)
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 font-medium mt-2 leading-relaxed">
                    Langsung isi formulir online, upload foto kenangan &amp; link lagu favorit, bayar via QRIS/VA/PayPal, link website kado langsung aktif detik itu juga!
                  </p>
                </div>

                <div className="pt-2 border-t-2 border-slate-100">
                  <ul className="space-y-2 text-xs font-extrabold text-slate-800">
                    <li className="flex items-center gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-[11px] shrink-0 font-black">✓</span>
                      <span>Website kado jadi instan tanpa menunggu</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-[11px] shrink-0 font-black">✓</span>
                      <span>QR Code &amp; frame akrilik langsung siap cetak</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-[11px] shrink-0 font-black">✓</span>
                      <span>Bayar fleksibel (E-Wallet dan VA bank)</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="pt-7">
                <button
                  type="button"
                  className="w-full py-4 px-6 bg-black group-hover:bg-rose-600 text-white font-black text-sm rounded-2xl border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Mulai Isi Form Otomatis</span>
                  <span className="text-base group-hover:translate-x-1 transition-transform">➔</span>
                </button>
              </div>
            </div>

            {/* OPSI 2: WHATSAPP ADMIN */}
            <div
              onClick={() => {
                setOrderMode('whatsapp');
                setTimeout(() => {
                  document.getElementById('activeOrderBox')?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }}
              className="group relative bg-white text-black rounded-3xl p-7 sm:p-8 border-4 border-black shadow-[6px_6px_0px_0px_rgba(16,185,129,1)] hover:shadow-[10px_10px_0px_0px_rgba(16,185,129,1)] hover:-translate-y-1.5 transition-all duration-200 cursor-pointer flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-14 h-14 bg-emerald-600 text-white rounded-2xl flex items-center justify-center p-2 border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] group-hover:scale-105 transition-transform">
                    <img
                      src="/images/emoji-chat-3d.png"
                      alt="WhatsApp Chat"
                      className="w-full h-full object-contain filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.2)]"
                    />
                  </div>
                  <span className="px-3 py-1 bg-emerald-600 text-white font-black text-[11px] uppercase tracking-wider rounded-full shadow-xs">
                    Manual
                  </span>
                </div>

                <div>
                  <h3 className="text-xl sm:text-2xl font-black text-black group-hover:text-emerald-700 transition-colors">
                    Pesan via WhatsApp
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 font-medium mt-2 leading-relaxed">
                    Mau konsultasi dulu? Kirim rincian kado santai via WhatsApp, admin kami yang bantu upload foto, backsound lagu, dan beri rekening transfer bank langsung.
                  </p>
                </div>

                <div className="pt-2 border-t-2 border-slate-100">
                  <ul className="space-y-2 text-xs font-extrabold text-slate-800">
                    <li className="flex items-center gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-[11px] shrink-0 font-black">✓</span>
                      <span>Admin yang bantu input foto &amp; pilihkan lagu</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-[11px] shrink-0 font-black">✓</span>
                      <span>Bisa request ucapan kustom atau revisi</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-[11px] shrink-0 font-black">✓</span>
                      <span>Transfer lewat QRIS, Bank, atau PayPal</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="pt-7">
                <button
                  type="button"
                  className="w-full py-4 px-6 bg-emerald-600 group-hover:bg-emerald-500 text-white font-black text-sm rounded-2xl border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Chat WhatsApp Admin</span>
                  <span className="text-base group-hover:translate-x-1 transition-transform">➔</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* FORM CONTAINER (Only rendered AFTER user chooses an order method) */
        <div id="activeOrderBox" className="max-w-2xl mx-auto bg-white border-4 border-black rounded-3xl p-6 sm:p-8 md:p-10 shadow-[6px_6px_0px_0px_rgba(244,63,94,1)] relative animate-fade-in text-black">
          {/* Back / Switch Method Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 bg-slate-100 border-2 border-black rounded-2xl mb-8">
            <button
              type="button"
              onClick={() => {
                setOrderMode(null);
                setTimeout(() => {
                  document.getElementById('orderSection')?.scrollIntoView({ behavior: 'smooth' });
                }, 50);
              }}
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-black text-slate-800 hover:text-rose-600 transition cursor-pointer"
            >
              <span>←</span>
              <span className="underline underline-offset-2">Ganti Cara Pemesanan</span>
            </button>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500">Metode:</span>
              <span
                className={`px-3 py-1 rounded-full text-xs font-black border border-black ${orderMode === 'instant'
                  ? 'bg-black text-white shadow-[1px_1px_0px_0px_rgba(244,63,94,1)]'
                  : 'bg-emerald-600 text-white'
                  }`}
              >
                {orderMode === 'instant' ? '⚡ Pesan Otomatis' : '💬 Via WhatsApp'}
              </span>
            </div>
          </div>

          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-black mb-2 text-black tracking-tight">
              {orderMode === 'instant' ? 'Formulir Kado Otomatis' : 'Formulir WhatsApp Admin'}
            </h2>
            <p className="text-slate-600 font-bold text-xs sm:text-sm">
              {orderMode === 'instant'
                ? 'Lengkapi rincian kado Anda di bawah untuk mengaktifkan website kado secara instan.'
                : 'Isi data singkat di bawah agar format chat pesanan Anda langsung siap dikirim ke Admin WhatsApp.'}
            </p>
          </div>

          {/* MODE 1: WHATSAPP ORDER VIEW (Opsi 3 with PayPal, Wise, Country Codes) */}
          {orderMode === 'whatsapp' ? (
            <div className="space-y-6 animate-fade-in">
              {/* Info Box */}
              <div className="p-4 sm:p-5 bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-emerald-600 rounded-2xl space-y-2 text-slate-800">
                <div className="flex items-center gap-2 font-black text-emerald-900 text-sm">
                  <span className="text-xl">💬</span>
                  <span>{t.order.waInfoTitle}</span>
                </div>
                <p className="text-xs font-semibold text-slate-700 leading-relaxed">
                  {t.order.waInfoDesc}
                </p>
                <div className="flex flex-wrap gap-2 pt-1 text-[11px] font-bold text-emerald-800">
                  <span className="px-2.5 py-1 bg-white border border-emerald-400 rounded-lg">{t.order.waAdv1}</span>
                  <span className="px-2.5 py-1 bg-white border border-emerald-400 rounded-lg">{t.order.waAdv2}</span>
                  <span className="px-2.5 py-1 bg-white border border-emerald-400 rounded-lg">{t.order.waAdv3}</span>
                </div>
              </div>

              {/* Quick Input fields to populate WA text */}
              <div className="space-y-4 bg-slate-50 border-2 border-black rounded-2xl p-5">
                <span className="text-xs font-black text-black uppercase tracking-wider block">
                  {language === 'en' ? '1. Fill in Quick Details:' : '1. Isi Rincian Singkat:'}
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-700">{t.order.yourName}</label>
                    <input
                      type="text"
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      placeholder={language === 'en' ? 'Your name...' : 'Nama kamu...'}
                      className="w-full bg-white border-2 border-black rounded-xl px-3.5 py-2.5 text-xs text-black font-medium focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-700">{t.order.recipientName}</label>
                    <input
                      type="text"
                      value={partnerName}
                      onChange={(e) => setPartnerName(e.target.value)}
                      placeholder={language === 'en' ? 'Recipient name...' : 'Nama pasangan / sahabat...'}
                      className="w-full bg-white border-2 border-black rounded-xl px-3.5 py-2.5 text-xs text-black font-medium focus:outline-none"
                    />
                  </div>
                </div>

                {/* Country Code & Phone input */}
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700">{t.order.yourWhatsapp}</label>
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
                    <select
                      value={countryCode}
                      onChange={(e) => setCountryCode(e.target.value)}
                      className="sm:col-span-5 bg-white border-2 border-black rounded-xl px-3 py-2.5 text-xs text-black font-bold focus:outline-none"
                    >
                      {COUNTRY_CODES.map((c) => (
                        <option key={c.code} value={c.code}>
                          {c.label}
                        </option>
                      ))}
                    </select>
                    <input
                      type="tel"
                      value={clientWhatsapp}
                      onChange={(e) => setClientWhatsapp(e.target.value.replace(/[^0-9]/g, ''))}
                      placeholder={countryCode === '+62' ? '8123456789' : '123456789'}
                      className="sm:col-span-7 bg-white border-2 border-black rounded-xl px-3.5 py-2.5 text-xs text-black font-medium focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-700">{t.order.selectTemplatePrompt}</label>
                    <select
                      value={selectedTemplate}
                      onChange={(e) => setSelectedTemplate(e.target.value)}
                      className="w-full bg-white border-2 border-black rounded-xl px-3.5 py-2.5 text-xs text-black font-bold focus:outline-none"
                    >
                      <option value="">-- {t.order.selectTemplatePrompt} --</option>
                      {TEMPLATE_DATA.map((tmpl) => (
                        <option key={tmpl.id} value={tmpl.title}>
                          {tmpl.title} — {formatPrice(tmpl.price)}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-700">{t.order.occasionPrompt}</label>
                    <select
                      value={greetingType}
                      onChange={(e) => setGreetingType(e.target.value)}
                      className="w-full bg-white border-2 border-black rounded-xl px-3.5 py-2.5 text-xs text-black font-bold focus:outline-none"
                    >
                      <option value="">-- {t.order.occasionPrompt} --</option>
                      <option value="Ulang Tahun">🎂 {t.order.occasionBirthday}</option>
                      <option value="Anniversary">💖 {t.order.occasionAnniversary}</option>
                      <option value="Kelulusan / Wisuda">🎓 {t.order.occasionGraduation}</option>
                      <option value="Lainnya">✨ {t.order.occasionOther}</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700">{t.order.notesLabel}</label>
                  <textarea
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder={t.order.notesPlaceholder}
                    className="w-full bg-white border-2 border-black rounded-xl px-3.5 py-2 text-xs text-black font-medium focus:outline-none"
                  />
                </div>
              </div>

              {/* WhatsApp Message Preview Card */}
              <div className="bg-emerald-950 text-white border-2 border-black rounded-2xl p-4 sm:p-5 space-y-2">
                <span className="text-[10px] font-black uppercase text-emerald-400 tracking-wider block">
                  {t.order.waPreviewTitle}
                </span>
                <pre className="text-[11px] sm:text-xs font-mono bg-black/40 p-3.5 rounded-xl border border-white/10 text-emerald-100 whitespace-pre-wrap leading-relaxed overflow-x-auto">
                  {language === 'en' || countryCode !== '+62' ? `Hello Admin plivin.co! 👋
I would like to order a Digital Gift Website:

• Template: ${selectedTemplate || 'Not selected'}${currentTemplate ? ` (${formatPrice(currentTemplate.price)})` : ''}
• Occasion: ${greetingType || 'Birthday / Anniversary / Special'}
• Sender Name: ${clientName || '-'}
• Recipient Name: ${partnerName || '-'}
• Contact / Phone: ${countryCode} ${clientWhatsapp || '-'}
• Preferred Payment: PayPal / Wise / International Cards
• Special Requests: ${notes || '-'}

Please assist me with the order process and payment details. Thank you! ✨`
                    : `Halo Admin plivin.co! 👋
Saya ingin memesan Website Digital Gift nih:

• Pilihan Template: ${selectedTemplate || 'Belum dipilih'}${currentTemplate ? ` (${formatPrice(currentTemplate.price)})` : ''}
• Kategori Acara: ${greetingType || 'Ulang Tahun / Anniversary / Wisuda'}
• Nama Pemesan: ${clientName || '-'}
• Nama Penerima: ${partnerName || '-'}
• No WhatsApp: ${countryCode} ${clientWhatsapp || '-'}
• Metode Bayar: Transfer Bank / QRIS / Wise / PayPal
• Catatan Khusus: ${notes || '-'}

Mohon dibantu proses pemesanan & info nomor rekeningnya ya admin! Terima kasih ✨`}
                </pre>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-2">
                <a
                  href={getWhatsAppOrderUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-4 px-6 rounded-xl font-black bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center gap-2.5 hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all border-2 border-black cursor-pointer text-sm sm:text-base uppercase tracking-wider shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
                >
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                  </svg>
                  <span>{t.order.btnSendWa} (+62 811-1001-0324)</span>
                </a>
              </div>
            </div>
          ) : (
            /* MODE 2: INSTANT WEB FORM (Opsi 2 with PayPal / DOKU auto-switching) */
            <>
              {activeErrorMessages.length > 0 && (
                <div className="mb-6 p-4 bg-rose-100 border-2 border-black rounded-xl text-xs font-bold text-rose-900 space-y-1">
                  <p className="font-extrabold flex items-center gap-1.5 text-sm">
                    <span>⚠️</span> Mohon lengkapi bagian yang wajib diisi:
                  </p>
                  <ul className="list-disc list-inside space-y-0.5 font-medium text-rose-800">
                    {activeErrorMessages.map((errMsg, idx) => (
                      <li key={idx}>{errMsg}</li>
                    ))}
                  </ul>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                {/* Name & Whatsapp fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="clientName" className="block text-sm font-bold text-black">
                      {t.order.yourName} <span className="text-rose-600 font-bold">*</span>
                    </label>
                    <input
                      type="text"
                      id="clientName"
                      value={clientName}
                      onChange={(e) => {
                        setClientName(e.target.value);
                        if (e.target.value.trim()) setFormErrors((prev) => ({ ...prev, clientName: undefined }));
                      }}
                      className={`w-full bg-white border-2 rounded-xl px-4 py-3.5 text-black font-medium placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-black/10 transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${formErrors.clientName ? 'border-rose-500 bg-rose-50/50' : 'border-black'
                        }`}
                      placeholder="Galih / John"
                    />
                    {formErrors.clientName && (
                      <p className="text-[11px] font-bold text-rose-600">{formErrors.clientName}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="partnerName" className="block text-sm font-bold text-black">
                      {t.order.recipientName} <span className="text-rose-600 font-bold">*</span>
                    </label>
                    <input
                      type="text"
                      id="partnerName"
                      value={partnerName}
                      onChange={(e) => {
                        setPartnerName(e.target.value);
                        if (e.target.value.trim()) setFormErrors((prev) => ({ ...prev, partnerName: undefined }));
                      }}
                      className={`w-full bg-white border-2 rounded-xl px-4 py-3.5 text-black font-medium placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-black/10 transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${formErrors.partnerName ? 'border-rose-500 bg-rose-50/50' : 'border-black'
                        }`}
                      placeholder="Ratna / Sarah"
                    />
                    {formErrors.partnerName && (
                      <p className="text-[11px] font-bold text-rose-600">{formErrors.partnerName}</p>
                    )}
                  </div>
                </div>

                {/* Country Code & WhatsApp */}
                <div className="space-y-2">
                  <label htmlFor="clientWhatsapp" className="block text-sm font-bold text-black">
                    {t.order.yourWhatsapp} <span className="text-rose-600 font-bold">*</span>
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex rounded-xl border-2 border-black bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] overflow-hidden focus-within:ring-4 focus-within:ring-black/10 transition-all">
                      {/* Country Code Prefix */}
                      <div className="relative group shrink-0 border-r-2 border-black bg-slate-50 hover:bg-slate-100 transition-colors">
                        <select
                          value={countryCode}
                          onChange={(e) => setCountryCode(e.target.value)}
                          className="h-full bg-transparent pl-3 pr-7 py-3.5 text-xs text-black font-extrabold focus:outline-none appearance-none cursor-pointer"
                        >
                          {COUNTRY_CODES.map((c) => (
                            <option key={c.code} value={c.code}>
                              {c.code}
                            </option>
                          ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2 text-black">
                          <svg className="w-3.5 h-3.5 stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>

                      {/* Phone Input */}
                      <input
                        type="tel"
                        id="clientWhatsapp"
                        value={clientWhatsapp}
                        onChange={(e) => {
                          const clean = e.target.value.replace(/[^0-9]/g, '');
                          setClientWhatsapp(clean);
                          if (clean.trim()) setFormErrors((prev) => ({ ...prev, clientWhatsapp: undefined }));
                        }}
                        className={`w-full bg-white px-4 py-3.5 text-black font-medium text-sm sm:text-base placeholder-slate-400 focus:outline-none ${
                          formErrors.clientWhatsapp ? 'bg-rose-50/50 text-rose-950' : ''
                        }`}
                        placeholder={countryCode === '+62' ? '8123456789' : '123456789'}
                      />
                    </div>

                    {/* Right column helper note for perfect symmetry */}
                    <div className="hidden md:flex items-center text-xs text-slate-500 font-medium px-1">
                      <span>💡 Link preview kado &amp; QR invoice otomatis dikirimkan ke nomor WhatsApp ini.</span>
                    </div>
                  </div>
                  {formErrors.clientWhatsapp && (
                    <p className="text-[11px] font-bold text-rose-600">{formErrors.clientWhatsapp}</p>
                  )}
                </div>

                {/* Greeting type & template selection */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <SelectField
                    id="greetingType"
                    label={t.order.occasionPrompt}
                    required
                    value={greetingType}
                    placeholder={`-- ${t.order.occasionPrompt} --`}
                    error={formErrors.greetingType}
                    options={[
                      { value: 'Ulang Tahun', label: `🎂 ${t.order.occasionBirthday}` },
                      { value: 'Kelulusan / Wisuda', label: `🎓 ${t.order.occasionGraduation}` },
                      { value: 'Anniversary', label: `💖 ${t.order.occasionAnniversary}` },
                      { value: 'Lainnya', label: `✨ ${t.order.occasionOther}` },
                    ]}
                    onChange={(val) => {
                      setGreetingType(val);
                      if (val) setFormErrors((prev) => ({ ...prev, greetingType: undefined }));
                      const template = TEMPLATE_DATA.find((tmpl) => tmpl.title === selectedTemplate);
                      if (
                        template &&
                        val &&
                        val !== 'Lainnya' &&
                        !template.categories.includes(val)
                      ) {
                        setSelectedTemplate('');
                      }
                    }}
                  />

                  <SelectField
                    id="selectedTemplate"
                    label={t.order.selectTemplatePrompt}
                    required
                    value={selectedTemplate}
                    placeholder={`-- ${t.order.selectTemplatePrompt} --`}
                    error={formErrors.selectedTemplate}
                    options={filteredTemplates.map((tItem) => ({
                      value: tItem.title,
                      label: `${tItem.title} - ${formatPrice(tItem.price)}${
                        tItem.originalPrice ? ` (Promo: ${formatPrice(tItem.originalPrice)})` : ''
                      }`,
                    }))}
                    onChange={(val) => {
                      setSelectedTemplate(val);
                      if (val) setFormErrors((prev) => ({ ...prev, selectedTemplate: undefined }));
                    }}
                  />
                </div>

                {/* Template Highlight & Guidance Banner */}
                {currentTemplate && (
                  <div className="bg-gradient-to-r from-pink-50 via-rose-50 to-amber-50 border-2 border-black rounded-2xl p-4 sm:p-5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] space-y-2">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">✨</span>
                        <h4 className="font-black text-black text-sm sm:text-base">
                          {currentTemplate.title}
                        </h4>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="px-3 py-1 bg-black text-white rounded-full font-mono font-black text-xs">
                          {formatPrice(currentTemplate.price)}
                        </span>
                        {currentTemplate.originalPrice && (
                          <span className="text-xs line-through text-slate-400 font-bold">
                            {formatPrice(currentTemplate.originalPrice)}
                          </span>
                        )}
                      </div>
                    </div>
                    <p className="text-xs text-slate-700 font-medium leading-relaxed">
                      {currentTemplate.description}
                    </p>
                    <div className="flex flex-wrap gap-2 pt-1 text-[11px] font-bold">
                      <span className="px-2.5 py-1 bg-white border border-black/20 rounded-lg text-slate-800">
                        📸 {currentTemplate.photosRequired > 0 ? `Minimal ${currentTemplate.photosRequired} Foto` : 'Tanpa Wajib Foto'}
                      </span>
                      {isVideoSupported && (
                        <span className="px-2.5 py-1 bg-purple-100 text-purple-900 border border-purple-400 rounded-lg">
                          📹 Mendukung Video Pendek
                        </span>
                      )}
                      {currentTemplate.id === 'maroon-birthday-surprise' && (
                        <span className="px-2.5 py-1 bg-rose-100 text-rose-900 border border-rose-400 rounded-lg">
                          🔒 Kunci 6-Digit PIN Rahasia
                        </span>
                      )}
                      {currentTemplate.id === 'love-receipt' && (
                        <span className="px-2.5 py-1 bg-emerald-100 text-emerald-900 border border-emerald-400 rounded-lg">
                          🧾 Download Struk Foto Otentik
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Kata Ucapan Anti-Bingung (Quick Preset Picker + Live Textarea) */}
                <div className="space-y-3 bg-slate-50 border-2 border-black rounded-2xl p-4 sm:p-5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                  <div className="flex flex-wrap items-center justify-between gap-1">
                    <label htmlFor="greetingText" className="block text-sm font-black text-black">
                      💌 Kata Ucapan Kado
                    </label>
                    <span className="text-[11px] text-slate-500 font-semibold">
                      Bisa diedit lagi di dashboard
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 font-medium leading-relaxed">
                    Bingung mau nulis apa? Klik preset mood di bawah agar langsung terisi otomatis, atau ketik sendiri dari hati:
                  </p>

                  {/* Preset Chips */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {GREETING_PRESETS.map((preset) => {
                      const isActive = selectedGreetingPreset === preset.id;
                      return (
                        <button
                          key={preset.id}
                          type="button"
                          onClick={() => handleSelectGreetingPreset(preset.id)}
                          className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 active:scale-95 ${
                            isActive
                              ? 'bg-rose-600 text-white border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                              : 'bg-white text-slate-800 border-slate-300 hover:border-black hover:bg-slate-100'
                          }`}
                        >
                          <span>{preset.emoji}</span>
                          <span>{preset.label}</span>
                        </button>
                      );
                    })}

                    <button
                      type="button"
                      onClick={handleResetGreeting}
                      title="Reset ke ucapan bawaan template"
                      className="px-2.5 py-1.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-slate-600 hover:text-black text-xs font-bold transition-all cursor-pointer flex items-center gap-1 active:scale-95"
                    >
                      <span>↺</span>
                      <span>Bawaan Template</span>
                    </button>
                  </div>

                  {/* Textarea */}
                  <div className="pt-2">
                    <textarea
                      id="greetingText"
                      rows={5}
                      value={greetingText}
                      onChange={(e) => {
                        setGreetingText(e.target.value);
                        setSelectedGreetingPreset(null);
                      }}
                      placeholder="Tuliskan pesan cinta atau ucapan tulusmu di sini..."
                      className="w-full bg-white border-2 border-black rounded-xl p-3.5 text-black font-medium text-xs sm:text-sm leading-relaxed placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-black/10 transition-all shadow-inner"
                    />
                    <div className="flex justify-between items-center text-[10px] text-slate-400 pt-1 px-1">
                      <span>💡 Tambahkan nama panggilan / tanggal spesial agar makin berkesan</span>
                      <span>{greetingText.length} karakter</span>
                    </div>
                  </div>
                </div>

                {/* Backsound Musik Favorit (Quick 1-Click Music Picker) */}
                <div className="space-y-3 bg-slate-50 border-2 border-black rounded-2xl p-4 sm:p-5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                  <div className="flex flex-wrap items-center justify-between gap-1">
                    <label className="block text-sm font-black text-black">
                      🎵 Backsound Musik Romantis
                    </label>
                    <span className="text-[11px] text-emerald-700 font-bold bg-emerald-100 px-2 py-0.5 rounded-md border border-emerald-300">
                      Auto-play saat dibuka
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 font-medium leading-relaxed">
                    Pilih lagu pengiring favorit yang langsung diputar otomatis ketika penerima membuka kado:
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                    {POPULAR_MUSIC_PRESETS.map((m) => {
                      const isActive = selectedMusicPreset === m.id && !customMusicMode;
                      return (
                        <button
                          key={m.id}
                          type="button"
                          onClick={() => handleSelectMusicPreset(m.id)}
                          className={`p-3 rounded-xl border-2 text-left transition-all cursor-pointer flex flex-col gap-0.5 active:scale-[0.98] ${
                            isActive
                              ? 'bg-black text-white border-black shadow-[3px_3px_0px_0px_rgba(244,63,94,1)]'
                              : 'bg-white text-slate-800 border-slate-300 hover:border-black hover:bg-slate-100'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-black text-xs">{m.title}</span>
                            <span className="text-[10px] opacity-80">{m.tag}</span>
                          </div>
                          <span className={`text-[10px] ${isActive ? 'text-white/80' : 'text-slate-500'}`}>
                            {m.artist}
                          </span>
                        </button>
                      );
                    })}

                    {/* Custom Song Option */}
                    <button
                      type="button"
                      onClick={() => handleSelectMusicPreset('custom')}
                      className={`p-3 rounded-xl border-2 text-left transition-all cursor-pointer flex flex-col gap-0.5 active:scale-[0.98] ${
                        customMusicMode
                          ? 'bg-rose-600 text-white border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]'
                          : 'bg-white text-slate-800 border-slate-300 hover:border-black hover:bg-slate-100'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-black text-xs">🔗 Lagu Sendiri</span>
                        <span className="text-[10px] opacity-80">YouTube / MP3</span>
                      </div>
                      <span className={`text-[10px] ${customMusicMode ? 'text-white/80' : 'text-slate-500'}`}>
                        Ketik link YouTube atau file audio sendiri
                      </span>
                    </button>
                  </div>

                  {/* Input field if custom song is selected */}
                  {customMusicMode && (
                    <div className="pt-2 animate-fade-in space-y-1">
                      <label className="block text-[11px] font-bold text-slate-700">
                        Link YouTube atau URL Audio MP3:
                      </label>
                      <input
                        type="text"
                        value={musicUrl}
                        onChange={(e) => setMusicUrl(e.target.value)}
                        placeholder="Contoh: https://www.youtube.com/watch?v=..."
                        className="w-full bg-white border-2 border-black rounded-xl px-3.5 py-2.5 text-xs text-black font-mono focus:outline-none focus:ring-4 focus:ring-black/10 shadow-inner"
                      />
                    </div>
                  )}
                </div>

                {/* Khusus Template Secret Maroon: Pengaturan Kunci PIN Rahasia */}
                {currentTemplate?.id === 'maroon-birthday-surprise' && (
                  <div className="bg-rose-950 text-white border-2 border-black rounded-2xl p-4 sm:p-5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] space-y-3 animate-fade-in">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">🔒</span>
                      <h4 className="font-black text-sm sm:text-base text-rose-200">
                        Pengaturan Kunci PIN Kado Rahasia
                      </h4>
                    </div>
                    <p className="text-xs text-rose-200/80 leading-relaxed font-medium">
                      Penerima harus memasukkan 6-digit PIN ini untuk membuka kado. Bisa tanggal jadian, tanggal lahir, atau angka favorit kalian!
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                      <div className="space-y-1">
                        <label className="block text-[11px] font-bold text-rose-300">
                          6-Digit PIN Rahasia:
                        </label>
                        <input
                          type="tel"
                          maxLength={6}
                          value={customPin}
                          onChange={(e) => setCustomPin(e.target.value.replace(/\D/g, '').slice(0, 6))}
                          placeholder="Contoh: 241022"
                          className="w-full bg-black/50 border border-rose-500/50 rounded-xl px-3.5 py-2.5 text-center text-sm font-mono font-black text-rose-100 tracking-widest focus:outline-none focus:border-rose-400"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="block text-[11px] font-bold text-rose-300">
                          Petunjuk / Hint PIN:
                        </label>
                        <input
                          type="text"
                          value={customHint}
                          onChange={(e) => setCustomHint(e.target.value)}
                          placeholder="Contoh: Tanggal pertama kali kita ketemu"
                          className="w-full bg-black/50 border border-rose-500/50 rounded-xl px-3.5 py-2.5 text-xs text-rose-100 focus:outline-none focus:border-rose-400"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Photo & Video Upload */}
                <div className="space-y-3">
                  <label className="block text-sm font-bold text-black">
                    {t.order.mediaUploadLabel} ({photos.length} {currentTemplate && currentTemplate.photosRequired > 0 ? `/ ${currentTemplate.photosRequired}` : ''} files)
                  </label>

                  <div className="border-2 border-dashed border-black rounded-2xl p-6 text-center bg-slate-50">
                    <input
                      type="file"
                      id="landingPhotoUpload"
                      multiple
                      accept="video/*,image/*,.mp4,.mov,.webm,.heic,.heif"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <label
                      htmlFor="landingPhotoUpload"
                      className="px-5 py-3 bg-black text-white font-black rounded-xl text-xs cursor-pointer inline-block transition hover:bg-slate-800 border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
                    >
                      {t.order.mediaUploadBtn}
                    </label>
                    <p className="text-[11px] text-slate-500 mt-2 font-medium">
                      {t.order.mediaUploadHint}
                    </p>
                  </div>

                  {photos.length > 0 && (
                    <div className="flex flex-wrap gap-2.5 pt-2">
                      {photos.map((src, idx) => (
                        <div
                          key={idx}
                          className="relative w-16 h-16 rounded-xl border-2 border-black overflow-hidden group shadow-xs bg-slate-900 flex items-center justify-center text-white"
                        >
                          {src.includes('youtube.com') || src.includes('youtu.be') || src.startsWith('data:video/') ? (
                            <span className="text-xl">📹</span>
                          ) : (
                            /* eslint-disable-next-line @next/next/no-img-element */
                            <img
                              src={src}
                              alt="Uploaded photo"
                              className="w-full h-full object-cover"
                            />
                          )}
                          <button
                            type="button"
                            onClick={() => handleRemovePhoto(idx)}
                            className="absolute top-0.5 right-0.5 w-5 h-5 bg-rose-600 text-white font-black text-[10px] rounded-full flex items-center justify-center opacity-90 group-hover:opacity-100 cursor-pointer"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  {formErrors.photos && (
                    <p className="text-[11px] font-bold text-rose-600">{formErrors.photos}</p>
                  )}
                </div>

                {/* Payment Gateway Choice: QRIS vs VA vs PayPal */}
                <div className="bg-slate-50 border-2 border-black rounded-2xl p-4 sm:p-5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-1.5">
                    <span className="text-xs sm:text-sm font-black text-black flex items-center gap-2">
                      <img
                        src="/images/emoji-card-3d.png"
                        alt="Payment"
                        className="w-5 h-5 object-contain"
                      />
                      <span>{t.order.paymentMethodTitle}</span>
                    </span>
                    <span className="px-2.5 py-0.5 bg-rose-100 text-rose-900 border border-rose-400 rounded-full font-black text-[9px] sm:text-[10px] uppercase tracking-wider">
                      {paymentGateway === 'qris' ? 'Scan & Konfirmasi WA' : t.order.paymentAutoVerify}
                    </span>
                  </div>

                  {/* Payment Gateway Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
                    {/* OPSI 1: QRIS PLIVIN */}
                    <button
                      type="button"
                      onClick={() => setPaymentGateway('qris')}
                      className={`p-3.5 rounded-xl border-2 transition text-left cursor-pointer flex flex-col gap-1 relative ${paymentGateway === 'qris'
                        ? 'bg-rose-600 text-white border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]'
                        : 'bg-white text-slate-800 border-slate-300 hover:bg-slate-50'
                        }`}
                    >
                      <div className="flex items-center gap-2">
                        <img
                          src="/images/emoji-qris-3d.png"
                          alt="QRIS"
                          className="w-6 h-6 object-contain shrink-0"
                        />
                        <span className="font-black text-xs">QRIS (Semua E-Wallet)</span>
                      </div>
                      <span className={`text-[10px] leading-snug pl-8 ${paymentGateway === 'qris' ? 'text-white/90' : 'text-slate-500'}`}>
                        BCA, Mandiri, GoPay, OVO, Dana, ShopeePay
                      </span>
                    </button>

                    {/* OPSI 2: DOKU VA / RETAIL */}
                    <button
                      type="button"
                      onClick={() => setPaymentGateway('doku')}
                      className={`p-3.5 rounded-xl border-2 transition text-left cursor-pointer flex flex-col gap-1 ${paymentGateway === 'doku'
                        ? 'bg-black text-white border-black shadow-[3px_3px_0px_0px_rgba(244,63,94,1)]'
                        : 'bg-white text-slate-800 border-slate-300 hover:bg-slate-50'
                        }`}
                    >
                      <div className="flex items-center gap-2">
                        <img
                          src="/images/emoji-bank-3d.png"
                          alt="VA Bank"
                          className="w-6 h-6 object-contain shrink-0"
                        />
                        <span className="font-black text-xs">Virtual Account</span>
                      </div>
                      <span className={`text-[10px] leading-snug pl-8 ${paymentGateway === 'doku' ? 'text-white/80' : 'text-slate-500'}`}>
                        BCA, BRI, BNI, Mandiri, Jago, Alfamart, dll
                      </span>
                    </button>

                    {/* OPSI 3: PAYPAL */}
                    <button
                      type="button"
                      onClick={() => setPaymentGateway('paypal')}
                      className={`p-3.5 rounded-xl border-2 transition text-left cursor-pointer flex flex-col gap-1 ${paymentGateway === 'paypal'
                        ? 'bg-blue-600 text-white border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]'
                        : 'bg-white text-slate-800 border-slate-300 hover:bg-slate-50'
                        }`}
                    >
                      <div className="flex items-center gap-2">
                        <img
                          src="/images/emoji-globe-3d.png"
                          alt="PayPal Global"
                          className="w-6 h-6 object-contain shrink-0"
                        />
                        <span className="font-black text-xs">PayPal &amp; Cards</span>
                      </div>
                      <span className={`text-[10px] leading-snug pl-8 ${paymentGateway === 'paypal' ? 'text-white/90' : 'text-slate-500'}`}>
                        Visa, Mastercard, Wise (USD)
                      </span>
                    </button>
                  </div>
                </div>

                {/* Notes */}
                <div className="space-y-2">
                  <label htmlFor="notes" className="block text-sm font-bold text-black">
                    {t.order.notesLabel}
                  </label>
                  <textarea
                    id="notes"
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full bg-white border-2 border-black rounded-lg px-4 py-3 text-black font-medium focus:outline-none"
                    placeholder={t.order.notesPlaceholder}
                  />
                </div>

                {/* Live Order Summary Card */}
                {currentTemplate && (
                  <div className="bg-white border-2 border-black rounded-2xl p-4 sm:p-5 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] space-y-3">
                    <div className="flex items-center justify-between border-b-2 border-slate-100 pb-2">
                      <span className="text-xs font-black uppercase text-slate-500 tracking-wider">
                        📋 Ringkasan Pesanan Kamu
                      </span>
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-bold text-[10px]">
                        Siap Dibuat Instan
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase font-bold">Model Kado:</span>
                        <strong className="text-black font-extrabold truncate block">
                          {currentTemplate.title}
                        </strong>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase font-bold">Penerima Kado:</span>
                        <strong className="text-rose-600 font-extrabold truncate block">
                          {partnerName.trim() || '(Nama belum diisi)'}
                        </strong>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase font-bold">Backsound Lagu:</span>
                        <span className="text-slate-800 font-bold truncate block">
                          {customMusicMode
                            ? musicUrl ? '🔗 Link Kustom' : '⚠️ Belum isi link'
                            : (POPULAR_MUSIC_PRESETS.find((p) => p.id === selectedMusicPreset)?.title || 'Can I Call You Rose?')}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase font-bold">Total Pembayaran:</span>
                        <span className="text-rose-600 font-black text-sm sm:text-base font-mono">
                          {formatPrice(currentTemplate.price)}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 px-6 rounded-xl font-black bg-rose-600 hover:bg-rose-500 text-white flex items-center justify-center gap-2 hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all border-2 border-black cursor-pointer text-sm sm:text-base uppercase tracking-wider shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] disabled:opacity-50"
                >
                  <span>{loading ? '⏳' : '🎁'}</span>
                  <span>{loading ? t.order.btnSubmitSubmitting : t.order.btnSubmit}</span>
                </button>
              </form>
            </>
          )}
        </div>
      )
      }

      {/* QR Code Generator Modal */}
      {createdOrderNumber && (
        <QRCodeGeneratorModal
          isOpen={isQRModalOpen}
          onClose={() => setIsQRModalOpen(false)}
          url={`${typeof window !== 'undefined' ? window.location.origin : ''}/${createdOrderNumber}`}
          recipientName={partnerName}
          title="QR Code &amp; Frame Model Kado"
        />
      )}
    </div>
  );
}
