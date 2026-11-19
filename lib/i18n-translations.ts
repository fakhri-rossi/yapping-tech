// ============================================================
// plivin.co — Internationalization (i18n) Translations (ID / EN)
// ============================================================

export type Language = 'id' | 'en';
export type Currency = 'IDR' | 'USD';

export interface Translations {
  nav: {
    guide: string;
    howItWorks: string;
    catalog: string;
    faq: string;
    whatsappAdmin: string;
    orderNow: string;
  };
  hero: {
    viralBadge: string;
    headlinePart1: string;
    headlineHighlight: string;
    headlinePart2: string;
    subheadline: string;
    badge1Min: string;
    badgeMusic: string;
    badgeMedia: string;
    badgeCustomLink: string;
    badgeForever: string;
    ctaOrder: string;
    ctaExplore: string;
    trust1Title: string;
    trust1Desc: string;
    trust2Title: string;
    trust2Desc: string;
  };
  guide: {
    tag: string;
    title: string;
    subtitle: string;
    birthdayTitle: string;
    birthdayDesc: string;
    anniversaryTitle: string;
    anniversaryDesc: string;
    gradTitle: string;
    gradDesc: string;
    btnExplore: string;
  };
  scan: {
    tag: string;
    title: string;
    subtitle: string;
    step1: string;
    step2: string;
    step3: string;
    testPrompt: string;
    testSub: string;
    directScan: string;
  };
  catalog: {
    featuredTag: string;
    featuredTitle: string;
    featuredSub: string;
    allTemplates: string;
    tryDemo: string;
    selectTemplate: string;
    filterAll: string;
    filterBirthday: string;
    filterGraduation: string;
    filterAnniversary: string;
    filterOther: string;
  };
  order: {
    title: string;
    subtitle: string;
    tabInstant: string;
    tabWhatsApp: string;
    waInfoTitle: string;
    waInfoDesc: string;
    waAdv1: string;
    waAdv2: string;
    waAdv3: string;
    yourName: string;
    recipientName: string;
    yourWhatsapp: string;
    selectTemplatePrompt: string;
    occasionPrompt: string;
    occasionBirthday: string;
    occasionAnniversary: string;
    occasionGraduation: string;
    occasionOther: string;
    greetingTextLabel: string;
    musicUrlLabel: string;
    musicUrlHint: string;
    mediaUploadLabel: string;
    mediaUploadBtn: string;
    mediaUploadHint: string;
    paymentMethodTitle: string;
    paymentAutoVerify: string;
    paymentDescId: string;
    paymentDescEn: string;
    payWithPaypal: string;
    payWithDoku: string;
    notesLabel: string;
    notesPlaceholder: string;
    btnSubmit: string;
    btnSubmitSubmitting: string;
    btnSendWa: string;
    waPreviewTitle: string;
    countryCodeLabel: string;
    paymentSuccessTitle: string;
    paymentSuccessDesc: string;
    manageGiftBtn: string;
  };
}

export const TRANSLATIONS: Record<Language, Translations> = {
  id: {
    nav: {
      guide: 'Panduan',
      howItWorks: 'Cara Kerja (QR)',
      catalog: 'Katalog',
      faq: 'FAQ',
      whatsappAdmin: 'WhatsApp Admin',
      orderNow: 'Pesan Sekarang',
    },
    hero: {
      viralBadge: 'Kado Ucapan Digital yang Lagi Viral!',
      headlinePart1: 'Bikin Dia & Sahabat',
      headlineHighlight: 'Bahagia',
      headlinePart2: 'Pakai Website Kado Spesial!',
      subheadline: 'Gak perlu bingung lagi nyari kado ultah, anniversary, atau wisuda. Tinggal masukan foto & lagu favoritmu, website kado sinematik langsung kelar kurang dari 1 menit!',
      badge1Min: '1 Menit Langsung Jadi',
      badgeMusic: 'Bebas Pakai Lagu Favorit',
      badgeMedia: 'Bisa Foto & Video Memori',
      badgeCustomLink: 'Link Kustom Suka-Suka',
      badgeForever: 'Simpan Selamanya',
      ctaOrder: 'Bikin Kado Sekarang (Mulai Rp 25rb)',
      ctaExplore: 'Intip Katalog Dulu',
      trust1Title: 'Serba Otomatis',
      trust1Desc: 'Langsung Jadi Gak Pake Lama',
      trust2Title: 'Link Aktif Selamanya',
      trust2Desc: 'Bisa Diakses Kapan Aja',
    },
    guide: {
      tag: 'Kado Pilihan',
      title: 'Pilih Kategori Momen Spesialmu 🎁',
      subtitle: 'Tiap momen punya cerita unik. Temukan gaya website kado digital yang paling pas buat orang tersayang:',
      birthdayTitle: 'Ulang Tahun (Birthday)',
      birthdayDesc: 'Kejutan ultah interaktif dengan game tebak-tebakan, mini puzzle, dan putar lagu favorit.',
      anniversaryTitle: 'Anniversary & Romantic',
      anniversaryDesc: 'Surat cinta rahasia, timeline kenangan kencan berdua, hingga amplop sakura virtual.',
      gradTitle: 'Kelulusan / Wisuda',
      gradDesc: 'Apresiasi kelulusan prestisius bertabur confetti, piagam ucapan, dan galeri foto perjuangan.',
      btnExplore: 'Lihat Template',
    },
    scan: {
      tag: 'Pengalaman Fisik & Digital',
      title: 'Cetak QR di Kartu / Akrilik, Scan Langsung Buka Kado! 📱',
      subtitle: 'Gabungkan kado fisik dan kejutan digital modern. Cukup arahkan kamera smartphone tanpa perlu install aplikasi apapun!',
      step1: 'Cetak frame QR di kartu ucapan / akrilik kado',
      step2: 'Penerima scan pakai kamera HP tanpa install aplikasi',
      step3: 'Website kado interaktif langsung terbuka otomatis!',
      testPrompt: 'Mau tes pakai kamera HP kamu?',
      testSub: 'Arahkan kamera HP ke QR Code di atas 📱',
      directScan: 'Direct Scan Link',
    },
    catalog: {
      featuredTag: 'Paling Populer',
      featuredTitle: 'Featured Gift Spotlight 🌟',
      featuredSub: 'Pilihan template kado digital paling viral dan paling banyak disukai minggu ini.',
      allTemplates: 'Katalog Lengkap Template',
      tryDemo: 'Coba',
      selectTemplate: 'Pilih',
      filterAll: 'Semua',
      filterBirthday: 'Ulang Tahun',
      filterGraduation: 'Kelulusan / Wisuda',
      filterAnniversary: 'Anniversary',
      filterOther: 'Lainnya',
    },
    order: {
      title: 'Formulir Pemesanan Kado',
      subtitle: 'Pilih metode pemesanan otomatis (Instant Web) atau dibantu langsung oleh Admin via WhatsApp.',
      tabInstant: 'Pesan Otomatis (Instant Web)',
      tabWhatsApp: 'Pesan via WhatsApp Admin',
      waInfoTitle: 'Pemesanan Manual via WhatsApp Admin',
      waInfoDesc: 'Cocok untuk Anda yang ingin konsultasi desain kustom, dibantu pemilihan lagu/foto, atau pembayaran internasional (PayPal / Wise / Bank Transfer).',
      waAdv1: '✅ Dibantu Isi Foto & Musik',
      waAdv2: '✅ Pembayaran Fleksibel (Bank / Wise / PayPal)',
      waAdv3: '✅ Fast Response 24/7',
      yourName: 'Nama Kamu',
      recipientName: 'Nama Penerima',
      yourWhatsapp: 'No. WhatsApp Kamu',
      selectTemplatePrompt: 'Pilihan Template',
      occasionPrompt: 'Tujuan Ucapan',
      occasionBirthday: 'Ulang Tahun',
      occasionAnniversary: 'Anniversary / Pacaran',
      occasionGraduation: 'Wisuda / Kelulusan',
      occasionOther: 'Lainnya / Surprise Spesial',
      greetingTextLabel: 'Kata Ucapan / Paragraf Cerita',
      musicUrlLabel: 'Link Lagu YouTube / Audio Backsound',
      musicUrlHint: '💡 Masukkan link video/musik dari YouTube. Lagu otomatis berputar saat kado dibuka!',
      mediaUploadLabel: 'Unggah Foto / Video Memori',
      mediaUploadBtn: '📹 / 📸 Pilih File Foto / Video dari HP / Laptop',
      mediaUploadHint: 'Mendukung format foto (JPG, PNG, HEIC) dan format video (MP4, MOV, WEBM).',
      paymentMethodTitle: 'Metode Pembayaran',
      paymentAutoVerify: '⚡ Verifikasi Otomatis',
      paymentDescId: 'Mendukung Transfer Bank (VA BCA/BRI/BNI/Mandiri), Minimarket (Alfamart/Indomaret), & PayLater.',
      paymentDescEn: 'Mendukung PayPal Express, International Credit Card (Visa/Mastercard), & Wise Transfer.',
      payWithPaypal: 'Bayar via PayPal / Kartu Kredit',
      payWithDoku: 'Bayar via DOKU (VA / Minimarket)',
      notesLabel: 'Catatan Tambahan (Opsional)',
      notesPlaceholder: 'Misal: Mau request lagu khusus, minta dibantu buatkan puisi, dll...',
      btnSubmit: 'Proses Pesanan & Buka Kado 🎁',
      btnSubmitSubmitting: 'Memproses Pesanan...',
      btnSendWa: 'Kirim Pesan ke WhatsApp Admin',
      waPreviewTitle: '📄 Pratinjau Pesan WhatsApp:',
      countryCodeLabel: 'Kode Negara',
      paymentSuccessTitle: 'Kado Digital Kamu Telah Aktif! 🔓',
      paymentSuccessDesc: 'Pembayaran telah lunas. Sekarang Anda dapat mengedit teks, mengunggah foto, dan membagikan link kado ini!',
      manageGiftBtn: '⚙️ Kelola & Hias Kado Sekarang',
    },
  },
  en: {
    nav: {
      guide: 'Occasion Guide',
      howItWorks: 'How it Works (QR)',
      catalog: 'Catalog',
      faq: 'FAQ',
      whatsappAdmin: 'WhatsApp Support',
      orderNow: 'Order Now',
    },
    hero: {
      viralBadge: 'Trending Digital Gift Websites!',
      headlinePart1: 'Make Your Loved Ones',
      headlineHighlight: 'Smile & Happy',
      headlinePart2: 'With a Personalized Gift Website! 🎁',
      subheadline: 'No more boring physical cards. Add your favorite photos, romantic love letters & playlist — your cinematic interactive gift website is ready in less than 1 minute!',
      badge1Min: 'Instant 1-Min Creation',
      badgeMusic: 'Any Song & Playlist',
      badgeMedia: 'Photos & Videos',
      badgeCustomLink: 'Custom Link URL',
      badgeForever: 'Lifetime Access',
      ctaOrder: 'Create Gift Now (From $1.99)',
      ctaExplore: 'Explore Templates',
      trust1Title: '100% Automated',
      trust1Desc: 'Instant Delivery & Live Edit',
      trust2Title: 'Lifetime Active Link',
      trust2Desc: 'Access Anytime, Anywhere',
    },
    guide: {
      tag: 'Curated Gifts',
      title: 'Choose by Special Occasion 🎁',
      subtitle: 'Every story is special. Find the perfect interactive digital gift website template for your loved ones:',
      birthdayTitle: 'Birthday Surprise',
      birthdayDesc: 'Interactive birthday reveal with fun mini-games, secret PIN unlock, and background playlist.',
      anniversaryTitle: 'Anniversary & Romance',
      anniversaryDesc: 'Secret love letters, romantic relationship timeline, memory scrapbook & virtual sakura bouquets.',
      gradTitle: 'Graduation / Achievement',
      gradDesc: 'Prestigious academic tribute complete with celebratory confetti, certificate diploma & photo gallery.',
      btnExplore: 'Browse Templates',
    },
    scan: {
      tag: 'Physical Meets Digital',
      title: 'Print QR on Gift Card or Acrylic, Scan to Reveal! 📱',
      subtitle: 'Blend physical gifts with modern interactive digital experiences. Simply point your smartphone camera without installing any apps!',
      step1: 'Print the custom QR design on your gift card or frame',
      step2: 'Recipient scans the QR with their smartphone camera',
      step3: 'Personalized interactive gift website opens instantly!',
      testPrompt: 'Want to test with your phone camera?',
      testSub: 'Point your smartphone camera at the QR code above 📱',
      directScan: 'Direct Scan Link',
    },
    catalog: {
      featuredTag: 'Most Popular',
      featuredTitle: 'Featured Gift Spotlight 🌟',
      featuredSub: 'The most loved and viral interactive digital gift templates worldwide.',
      allTemplates: 'Complete Template Catalog',
      tryDemo: 'Live Demo',
      selectTemplate: 'Select',
      filterAll: 'All',
      filterBirthday: 'Birthday',
      filterGraduation: 'Graduation',
      filterAnniversary: 'Anniversary',
      filterOther: 'Special Occasions',
    },
    order: {
      title: 'Order Your Digital Gift',
      subtitle: 'Choose instant automated web order or assisted concierge order via WhatsApp.',
      tabInstant: 'Instant Automated Order',
      tabWhatsApp: 'Order via WhatsApp Concierge',
      waInfoTitle: 'Assisted WhatsApp Order Concierge',
      waInfoDesc: 'Perfect if you need custom design guidance, help picking music/photos, or international payment methods (PayPal, Wise, International Cards).',
      waAdv1: '✅ Assisted Music & Photo Curation',
      waAdv2: '✅ Global Payment Support (PayPal, Wise, Cards)',
      waAdv3: '✅ 24/7 Fast Response Support',
      yourName: 'Your Name',
      recipientName: 'Recipient Name',
      yourWhatsapp: 'Your WhatsApp / Phone Number',
      selectTemplatePrompt: 'Selected Template',
      occasionPrompt: 'Gift Occasion',
      occasionBirthday: 'Birthday',
      occasionAnniversary: 'Anniversary / Relationship',
      occasionGraduation: 'Graduation / Academic',
      occasionOther: 'Special Surprise / Other',
      greetingTextLabel: 'Love Note / Story Text',
      musicUrlLabel: 'YouTube Song Link / Background Audio',
      musicUrlHint: '💡 Paste any YouTube music or video link. It will automatically play when the gift opens!',
      mediaUploadLabel: 'Upload Photo & Video Memories',
      mediaUploadBtn: '📹 / 📸 Choose Photos or Video Files',
      mediaUploadHint: 'Supports images (JPG, PNG, HEIC) and video files (MP4, MOV, WEBM).',
      paymentMethodTitle: 'Payment Methods',
      paymentAutoVerify: '⚡ Instant Auto-Verification',
      paymentDescId: 'Supports Bank Transfer (VA BCA/BRI/BNI/Mandiri), Convenience Stores, & PayLater.',
      paymentDescEn: 'Supports PayPal Express, International Credit/Debit Cards (Visa/Mastercard/Amex), and Wise Transfer.',
      payWithPaypal: 'Pay with PayPal / International Card',
      payWithDoku: 'Pay with Local Bank Transfer (VA)',
      notesLabel: 'Special Requests / Notes (Optional)',
      notesPlaceholder: 'E.g., custom song request, help writing a poem, specific date...',
      btnSubmit: 'Proceed to Payment & Unlock Gift 🎁',
      btnSubmitSubmitting: 'Processing Order...',
      btnSendWa: 'Send Message to WhatsApp Support',
      waPreviewTitle: '📄 WhatsApp Message Preview:',
      countryCodeLabel: 'Country Code',
      paymentSuccessTitle: 'Your Digital Gift is Live! 🔓',
      paymentSuccessDesc: 'Payment confirmed. You can now edit text, upload photos, and share your gift link!',
      manageGiftBtn: '⚙️ Manage & Decorate Gift Now',
    },
  },
};

// Pricing helper in USD
export function getPriceInUsd(idrPrice: number): number {
  if (idrPrice <= 20000) return 1.99;
  if (idrPrice <= 30000) return 2.49;
  if (idrPrice <= 50000) return 3.49;
  return 6.99;
}

export function formatPriceByCurrency(amountInIdr: number, currency: Currency): string {
  if (currency === 'USD') {
    const usd = getPriceInUsd(amountInIdr);
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(usd);
  }

  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amountInIdr);
}
