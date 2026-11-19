"use client";

import Image from "next/image";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useShowcase } from "@context/ShowcaseContext";
import { InteractiveShowcaseSlider } from "@components/templates/InteractiveShowcaseSlider";
import { FaqAccordion } from "@components/templates/FaqAccordion";
import { SiteFooter } from "@components/templates/SiteFooter";
import { CircularGallery } from "@components/templates/CircularGallery";
import { Magnetic } from "@components/ui/Magnetic";
import { cn, formatIDR } from "@lib/format";
import { DEFAULT_REVIEWS_BY_NICHE } from "@lib/cms";

const RUMAH_PHONE = "6285966514774";

const CATEGORIES = [
  {
    id: "money",
    tag: "Paling Populer",
    name: "Money Bouquet (Buket Uang)",
    desc: "Buket uang susun kipas atau tarik. Uang baru asli disusun rapi tanpa dilem atau dirusak. Nominal & lembaran bebas request.",
    image: "/images/florist/money-bouquet.jpg",
    priceRange: "Mulai Rp150.000",
  },
  {
    id: "wisuda",
    tag: "Spesial Kelulusan",
    name: "Buket Wisuda & Sidang",
    desc: "Bunga lili pastel berpadu boneka wisuda bertoga dan selempang custom nama. Hadiah paling berkesan untuk momen wisuda.",
    image: "/images/florist/graduation-bouquet.jpg",
    priceRange: "Mulai Rp85.000",
  },
  {
    id: "soap",
    tag: "Awet Bertahun-tahun",
    name: "Bunga Sabun (Soap Flower)",
    desc: "Terbuat dari bahan sabun wangi lembut aromatik yang mekar abadi tanpa layu. Praktis dan indah dipajang di kamar.",
    image: "/images/florist/soap-flower-real.jpg",
    priceRange: "Mulai Rp75.000",
  },
  {
    id: "fresh",
    tag: "Romantis & Harum",
    name: "Fresh Flower Bouquet",
    desc: "Mawar merah beludru segar, lily, dan bunga matahari cerah dengan wrapping matte ala Korea. Segar dan wangi alami.",
    image: "/images/florist/fresh-rose.jpg",
    priceRange: "Mulai Rp120.000",
  },
];

const ORDER_STEPS = [
  {
    number: "01",
    action: "Pilih Model & Request Budget",
    detail: "Kirim foto referensi buket atau sebutkan budget yang kamu punya (mulai Rp50.000). Kami sesuaikan isian terbaik.",
  },
  {
    number: "02",
    action: "Tulis Kartu Ucapan Free",
    detail: "Setiap pesanan sudah free kartu ucapan custom tulisan tangan rapi untuk orang tersayang.",
  },
  {
    number: "03",
    action: "Kirim Cepat / Ambil Sendiri",
    detail: "Bisa kirim instan Grab/Gojek se-Jabodetabek atau langsung self-pickup ke studio Pondok Kelapa, Jakarta Timur.",
  },
];

const NAFILA_CATEGORIES = [
  {
    id: "holo-pink",
    tag: "Best Seller",
    name: "Pink Hologram Bouquet",
    desc: "Buket hologram warna pink pastel berkilau mewah dengan aksen bunga premium dan pita satin lembut.",
    image: "/images/florist/nafila-florist/pinkholo.png",
    priceRange: "Rp75.000",
  },
  {
    id: "holo-blue",
    tag: "Signature",
    name: "Blue Hologram Bouquet",
    desc: "Buket hologram nuansa biru estetik dengan pantulan kilau prismatik yang memikat untuk momen spesial.",
    image: "/images/florist/nafila-florist/blueholonew.jpg",
    priceRange: "Rp75.000",
  },
  {
    id: "holo-black",
    tag: "Elegant",
    name: "Black Hologram Series",
    desc: "Balutan warna hitam tegas berpadu kilau hologram futuristik nan berkelas untuk graduation atau cowok.",
    image: "/images/florist/nafila-florist/blackholo.png",
    priceRange: "Rp75.000",
  },
  {
    id: "holo-purple",
    tag: "Pastel Dream",
    name: "Purple Hologram Series",
    desc: "Nuansa ungu lilac mempesona dengan wrapping hologram berkilau ala aesthetic Korean florist.",
    image: "/images/florist/nafila-florist/purpleholo.png",
    priceRange: "Rp75.000",
  },
  {
    id: "holo-green",
    tag: "Fresh Mint",
    name: "Green Emerald Holo",
    desc: "Kombinasi hijau segar dengan wrapping hologram berkilauan yang ceria dan menyejukkan.",
    image: "/images/florist/nafila-florist/greenholo.png",
    priceRange: "Rp75.000",
  },
  {
    id: "fairytopia",
    tag: "Fantasy Series",
    name: "Fairytopia Butterfly Fairy",
    desc: "Koleksi buket tematik dunia peri impian berhias sayap kupu-kupu berkilau dan nuansa bunga dreamland.",
    image: "/images/florist/nafila-florist/fairytopia.png",
    priceRange: "Rp105.000",
  },
  {
    id: "thumbelina",
    tag: "Whimsical",
    name: "Thumbelina Petal Bloom",
    desc: "Rangkaian buket kelopak bunga memikat dengan ornamen peri kecil yang anggun dan magis.",
    image: "/images/florist/nafila-florist/thumbelina.png",
    priceRange: "Rp95.000",
  },
  {
    id: "boneka-wisuda",
    tag: "Favorit Wisuda",
    name: "Buket Boneka Wisuda Teddy",
    desc: "Boneka beruang berbalut jubah & toga wisuda lengkap dengan paper wrap pastel Korea dan bunga manis.",
    image: "/images/florist/nafila-florist/boneka_bucket_1.png",
    priceRange: "Rp95.000",
  },
  {
    id: "boneka-cute",
    tag: "Kado Ultah",
    name: "Buket Boneka Karakter Cute",
    desc: "Kombinasi boneka imut favorit dengan hiasan bunga senada dan paper bag jinjing eksklusif.",
    image: "/images/florist/nafila-florist/boneka_bucket_2.png",
    priceRange: "Rp85.000",
  },
  {
    id: "trophy-guru",
    tag: "Spesial Apresiasi",
    name: "Trophy Flowers Hari Guru",
    desc: "Piala akrilik berhias mahkota bunga mawar dan kartu apresiasi tulus untuk pendidik tercinta.",
    image: "/images/florist/nafila-florist/kado-hari-guru-1.jpg",
    priceRange: "Rp50.000",
  },
  {
    id: "guru-pink",
    tag: "Best Teacher",
    name: "Trophy Box Floral Pastel",
    desc: "Box kado cantik berpadu miniatur trophy kejuaraan dan kartu personal tanda terima kasih jasa guru.",
    image: "/images/florist/nafila-florist/kado-hari-guru-2.png",
    priceRange: "Rp55.000",
  },
  {
    id: "guru-blue",
    tag: "Signature Edition",
    name: "Kado Hari Guru Signature",
    desc: "Kombinasi piala penghargaan dan rangkaian bunga elegan dalam kemasan display mika bening.",
    image: "/images/florist/nafila-florist/kado-hari-guru-3.png",
    priceRange: "Rp65.000",
  },
];

const NAFILA_ORDER_STEPS = [
  {
    number: "01",
    action: "Pilih Desain di Katalog",
    detail: "Pilih buket hologram 7 warna, boneka wisuda, atau trophy flowers favoritmu di katalog 3D bawah.",
  },
  {
    number: "02",
    action: "Klik Keranjang / Chat WA",
    detail: "Tulis pesan kartu ucapan (free kartu tulisan tangan!) & tentukan warna wrapping favoritmu.",
  },
  {
    number: "03",
    action: "Duduk Manis & Siap Antar",
    detail: "Kami rangkai rapi, dipacking kardus tebal anti-penyok, siap kirim instan Semarang atau ekspedisi aman se-Indonesia.",
  },
];

const FLORIST_REVIEWS = [
  {
    id: "f-rev-1",
    category: "wisuda",
    name: "Siti Nurhaliza",
    location: "Duren Sawit, Jakarta Timur",
    avatar: "SN",
    stars: 5,
    tag: "Buket Wisuda & Boneka Toga · Self-Pickup",
    date: "2 hari yang lalu",
    review:
      "Pagi jam 9 panik temen sidang jam 1 siang belum ada kado. Hubungi admin Rumah Bouquet via WA langsung dibikinin buket boneka toga + lily. Jam 11.30 udah self-pickup di studio Pondok Kelapa. Kartu ucapannya tulisan tangan rapi banget!",
  },
  {
    id: "f-rev-2",
    category: "money",
    name: "Bagas Triputra",
    location: "Tebet, Jakarta Selatan",
    avatar: "BT",
    stars: 5,
    tag: "Money Bouquet Royal Blue · Grab Instant",
    date: "5 hari yang lalu",
    review:
      "Pesen buket uang susun kipas 30 lembar buat ulang tahun Ibu. Uangnya beneran rapi tanpa dilem atau dirusak sama sekali, bisa dipakai lagi. Ibu saya sampe nangis terharu. Pelayanan 24 jam fast response banget.",
  },
  {
    id: "f-rev-3",
    category: "soap",
    name: "Amanda Putri",
    location: "Rawamangun, Jakarta Timur",
    avatar: "AP",
    stars: 5,
    tag: "Everlasting Soap Flower · COD Ready",
    date: "1 minggu yang lalu",
    review:
      "Beli everlasting soap flower warna pastel. Udah 6 bulan dipajang di kamar masih wangi dan bentuk bunganya tetep mekar sempurna! Buat yang mau kado awet bertahun-tahun rekomen banget ini.",
  },
  {
    id: "f-rev-4",
    category: "urgent",
    name: "Reza Firmansyah",
    location: "Kelapa Gading, Jakarta Utara",
    avatar: "RF",
    stars: 5,
    tag: "Request Budget Buket Medium · Delivery Same-Day",
    date: "2 minggu yang lalu",
    review:
      "Budget pas-pasan 100 ribuan tapi pengen kasih buket cantik buat wisuda adik. Adminnya ramah banget ngebantu sesuaikan bunga dan wrapping-nya biar tetep keliatan mewah. Terima kasih Rumah Bouquet!",
  },
];

export function FloristExperience() {
  const { activeNiche, openCart, cartLineCount, addToCart } = useShowcase();
  const { brand, brandSuffix, hero, story, announcement, footer, cms } = activeNiche;
  const isNafila = activeNiche.id === "nafila-florist";
  const visibility = cms?.visibility ?? {
    showAnnouncement: !isNafila,
    showCustomizer: true,
    showStory: true,
    showReviews: true,
    showFaq: true,
  };
  const displayCategories = isNafila ? NAFILA_CATEGORIES : CATEGORIES;
  const displayOrderSteps = isNafila ? NAFILA_ORDER_STEPS : ORDER_STEPS;
  const reviews =
    cms?.reviews ??
    (isNafila
      ? (DEFAULT_REVIEWS_BY_NICHE["nafila-florist"] ?? FLORIST_REVIEWS)
      : FLORIST_REVIEWS);
  const clientWa =
    cms?.whatsappOrderNumber?.replace(/[^0-9]/g, "") ||
    footer.phone.replace(/[^0-9]/g, "") ||
    (isNafila ? "6282156569916" : RUMAH_PHONE);
  const displayWa = footer.phone || (isNafila ? "0821-5656-9916" : "0859-6651-4774");

  const [selectedProduct, setSelectedProduct] = useState(
    isNafila ? (activeNiche.products[0]?.name ?? "Pink Holo - Trophy Flowers") : "Buket Bunga"
  );
  const [customerName, setCustomerName] = useState("");
  const [customerWa, setCustomerWa] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [selectedDelivery, setSelectedDelivery] = useState(
    isNafila ? "Kirim Kurir Instan Semarang" : "Kirim Kurir Instan Jabodetabek"
  );
  const [greetingText, setGreetingText] = useState("Happy Graduation! Semoga ilmunya berkah & sukses selalu ♡");
  const [activeFloristFilter, setActiveFloristFilter] = useState("all");

  const chosenProductObj = activeNiche.products.find((p) => p.name === selectedProduct) ?? activeNiche.products[0];
  const orderPrice = chosenProductObj?.price ?? 125000;

  const directOrderHref = `https://wa.me/${clientWa}?text=${encodeURIComponent(
    `Halo ${brand}, saya ingin memesan buket melalui website:\n\n` +
    `— DETAIL PESANAN —\n` +
    `• Varian: ${selectedProduct}\n` +
    `• Harga: ${formatIDR(orderPrice)}\n` +
    `• Opsi Kirim: ${selectedDelivery}\n\n` +
    `— DATA PEMESAN & TUJUAN —\n` +
    `• Nama Pemesan: ${customerName || "-"}\n` +
    `• No. WhatsApp: ${customerWa || "-"}\n` +
    `• Alamat Lengkap: ${customerAddress || "-"}\n\n` +
    `— KARTU UCAPAN (FREE) —\n` +
    `"${greetingText || "Tanpa kartu ucapan"}"\n\n` +
    `Mohon info ketersediaan slot hari ini dan total akhirnya. Terima kasih!`
  )}`;

  const mainHeroImg = hero.images[0] ?? {
    src: isNafila ? "/images/florist/nafila-florist/hero.jpg" : "/images/florist/hero.jpg",
    alt: `Signature Florist Collection ${brand}`,
    caption: isNafila ? "Nafila Signature Bouquet" : "Buket Wisuda & Hadiah",
  };
  const leftHeroImg = hero.images[1] ?? {
    src: isNafila ? "/images/florist/nafila-florist/pinkholo.png" : "/images/florist/money-bouquet-real.jpg",
    alt: isNafila ? "Pink Hologram Bouquet" : "Money Bouquet Kipas",
    caption: isNafila ? "Pink Hologram Series" : "Money Bouquet",
  };
  const rightTopImg = hero.images[2] ?? {
    src: isNafila ? "/images/florist/nafila-florist/boneka_bucket_1.png" : "/images/florist/graduation-bouquet.jpg",
    alt: isNafila ? "Buket Boneka Wisuda" : "Buket Wisuda Boneka Toga",
    caption: isNafila ? "Buket Boneka Karakter" : "Buket Boneka & Selempang",
  };
  const rightBottomImg = hero.images[3] ?? {
    src: isNafila ? "/images/florist/nafila-florist/fairytopia.png" : "/images/florist/fresh-rose.jpg",
    alt: isNafila ? "Fairytopia Series" : "Fresh Red Roses Velvet Mawar Segar",
    caption: isNafila ? "Fairytopia Fantasy" : "Classic Velvet Roses",
  };

  return (
    <div className="min-h-screen bg-canvas text-ink">
      {/* 1. BRAND HEADER & MASTHEAD WITH DIRECT WHATSAPP HOTLINE */}
      <header className="border-b border-line bg-canvas sticky top-0 z-30 shadow-2xs">
        {visibility.showAnnouncement && Boolean(announcement?.messages?.length) && (
          <div className="mx-auto max-w-[1400px] px-6 py-2.5 border-b border-line/60 flex items-center justify-between text-[9px] font-ui uppercase tracking-[0.24em] text-muted">
            <span className="flex items-center gap-2 font-medium text-ink">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
              </span>
              {announcement.status ? `${announcement.status}: ` : ""}{announcement.messages[0]}
            </span>
            <span className="hidden sm:inline">{announcement.messages[1] || footer.address}</span>
            <span className="hidden md:inline font-semibold text-accent">
              {isNafila ? "Kirim Cepat Semarang & Ekspedisi Seluruh Indonesia" : "Standby 24 Jam · COD & Instant Delivery"}
            </span>
          </div>
        )}

        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 md:px-10 py-3 sm:py-3.5 flex items-center justify-between">
          <a href="#top" className="flex items-center gap-2.5 sm:gap-3 group cursor-pointer">
            {activeNiche.logo && !cms?.useTextLogo ? (
              <Image
                src={activeNiche.logo}
                alt={brand}
                width={150}
                height={65}
                priority
                unoptimized={activeNiche.logo.startsWith("data:") || activeNiche.logo.startsWith("http")}
                className="h-9 sm:h-11 md:h-12 w-auto object-contain transition-transform duration-300 group-hover:scale-[1.03]"
              />
            ) : (
              <div>
                <div className="font-heading text-[20px] sm:text-[26px] md:text-[28px] font-light leading-none tracking-[0.08em] text-ink">
                  {brand}
                </div>
                <div className="mt-1 text-[7.5px] sm:text-[8px] uppercase tracking-[0.22em] sm:tracking-[0.26em] text-muted">
                  {brandSuffix}
                </div>
              </div>
            )}
          </a>

          <nav className="hidden lg:flex items-center gap-7 font-ui text-[10.5px] uppercase tracking-[0.16em] text-ink/85 font-medium">
            {!isNafila && (
              <a href="#collection" className="hover:text-[var(--accent)] transition-colors cursor-pointer">
                Koleksi Buket
              </a>
            )}
            <a href="#categories" className="hover:text-[var(--accent)] transition-colors cursor-pointer">
              {isNafila ? "Pilih Buket" : "Katalog"}
            </a>
            <a href="#order-form" className="hover:text-[var(--accent)] transition-colors cursor-pointer text-accent font-bold">
              Form Pesan
            </a>
            {!isNafila && visibility.showCustomizer && (
              <a href="#budget-builder" className="hover:text-[var(--accent)] transition-colors cursor-pointer">
                Request Budget
              </a>
            )}
            {visibility.showStory && (
              <a href="#studio" className="hover:text-[var(--accent)] transition-colors cursor-pointer">
                {isNafila ? "Cara Order" : "Studio & Pengiriman"}
              </a>
            )}
            {visibility.showReviews && (
              <a href="#reviews" className="hover:text-[var(--accent)] transition-colors cursor-pointer">
                Testimoni
              </a>
            )}
            {visibility.showFaq && (
              <a href="#faq" className="hover:text-[var(--accent)] transition-colors cursor-pointer">
                FAQ
              </a>
            )}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <a
              href={`https://wa.me/${clientWa}?text=${encodeURIComponent(
                isNafila
                  ? `Halo ${brand}, saya ingin tanya rekomendasi buket & slot order hari ini.`
                  : `Halo ${brand}, saya ingin pesan/konsultasi buket urgent hari ini.`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 sm:gap-2 rounded-full bg-accent px-3 py-1.5 sm:px-4 sm:py-2 font-ui text-[9px] sm:text-[10px] font-semibold uppercase tracking-[0.12em] sm:tracking-[0.14em] text-[var(--accent-contrast)] hover:opacity-90 transition-opacity shadow-xs cursor-pointer"
            >
              <span>{isNafila ? "Chat Admin WA" : `WA ${displayWa}`}</span>
              <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
            </a>

            <button
              type="button"
              onClick={openCart}
              className="flex items-center gap-1.5 sm:gap-2 rounded-full border border-line bg-surface px-3 py-1.5 sm:px-4 sm:py-2 font-ui text-[9.5px] sm:text-[10.5px] font-medium uppercase tracking-[0.14em] sm:tracking-[0.16em] text-ink hover:border-[var(--accent)] transition-colors shadow-sm cursor-pointer"
            >
              <span>Keranjang</span>
              <span className="flex h-4.5 w-4.5 sm:h-5 sm:w-5 items-center justify-center rounded-full bg-accent text-[9px] sm:text-[9.5px] font-semibold text-[var(--accent-contrast)]">
                {cartLineCount}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* 2. CENTERED ARCHITECTURAL MAGAZINE COVER SHOWCASE HERO */}
      <section id="top" className="relative border-b border-line bg-canvas px-4 sm:px-6 md:px-10 pt-10 pb-16 sm:pt-16 sm:pb-24 overflow-hidden">
        <div className="mx-auto max-w-[1360px] text-center">
          {/* Top Centered Kicker (Clean Text, No Badge Container) */}
          <div className="inline-flex items-center justify-center gap-2 text-[10px] sm:text-[11px] font-ui uppercase tracking-[0.24em] text-accent font-semibold">
            <Image
              src="/images/emojis/flower-3d.png"
              alt="Florist"
              width={16}
              height={16}
              className="object-contain"
            />
            <span>{hero.kicker}</span>
          </div>

          {/* Quick Category Badges Row */}
          {Boolean(hero.badges?.length) && (
            <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
              {hero.badges.map((badge) => (
                <span
                  key={badge}
                  className="rounded-full border border-line bg-surface px-3 py-1 font-ui text-[9.5px] font-semibold text-ink shadow-2xs"
                >
                  {badge}
                </span>
              ))}
            </div>
          )}

          {/* Centered Bold Headline */}
          <h1 className="mt-5 sm:mt-6 font-heading text-[clamp(2.1rem,6vw,5.2rem)] leading-[1.02] sm:leading-[0.98] tracking-[-0.03em] text-ink">
            {hero.titleLead} <br className="sm:hidden" />
            <span className="text-accent italic font-light font-serif">{hero.titleAccent}</span> <br />
            {hero.titleTail}
          </h1>

          <p className="mt-4 sm:mt-5 max-w-[640px] mx-auto font-body text-[13px] sm:text-[14.5px] leading-[1.75] sm:leading-[1.8] text-muted px-2">
            {hero.description}
          </p>

          {/* Centered Actions */}
          <div className="mt-7 sm:mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 max-w-sm sm:max-w-none mx-auto w-full px-2">
            <Magnetic>
              <a
                href={isNafila ? "#categories" : "#collection"}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-full bg-accent px-8 py-3.5 font-ui text-[10.5px] font-semibold uppercase tracking-[0.16em] text-[var(--accent-contrast)] hover:opacity-90 transition-all shadow-md cursor-pointer"
              >
                <span>{isNafila ? "Pilih Buket di Katalog" : hero.primaryCta}</span>
                <svg viewBox="0 0 14 14" fill="none" className="h-3.5 w-3.5" aria-hidden="true">
                  <path d="M7 2v10M3 8l4 4 4-4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
            </Magnetic>
            <a
              href={`https://wa.me/${clientWa}?text=${encodeURIComponent(
                isNafila
                  ? `Halo ${brand}, saya ingin konsultasi buket untuk kado spesial.`
                  : `Halo ${brand}, saya mau tanya slot urgent order buket hari ini.`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full border border-line bg-surface px-7 py-3.5 font-ui text-[10.5px] font-semibold uppercase tracking-[0.16em] text-ink hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors shadow-sm cursor-pointer"
            >
              <span>{isNafila ? "Konsultasi Cepat WA ↗" : hero.secondaryCta}</span>
            </a>
          </div>

          {/* Marketplace Fast Links (TikTok Shop & Shopee) */}
          {(footer.tiktok || footer.shopee) && (
            <div className="mt-5 flex items-center justify-center gap-3">
              <span className="font-ui text-[9px] uppercase tracking-[0.2em] text-muted font-bold mr-1">
                Bisa Order Lewat Marketplace:
              </span>
              {footer.tiktok && (
                <a
                  href={footer.tiktok}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="TikTok Shop (Trophy Flowers)"
                  aria-label="TikTok Shop"
                  className="relative h-7 w-7 transition-transform hover:scale-115 active:scale-95"
                >
                  <Image
                    src="/images/logo/tiktok-official.png"
                    alt="TikTok Shop"
                    fill
                    unoptimized
                    className="object-contain"
                  />
                </a>
              )}
              {footer.shopee && (
                <a
                  href={footer.shopee}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Shopee Store"
                  aria-label="Shopee Store"
                  className="relative h-7 w-7 transition-transform hover:scale-115 active:scale-95"
                >
                  <Image
                    src="/images/logo/shopee-bag.svg"
                    alt="Shopee Store"
                    fill
                    unoptimized
                    className="object-contain"
                  />
                </a>
              )}
            </div>
          )}

          {/* 3-COLUMN ASYMMETRIC PHOTO MASONRY GALLERY */}
          <div className="mt-14 relative max-w-[1240px] mx-auto">
            {/* Floating Floral Pills around the Masonry */}
            <div className="hidden lg:flex absolute -top-5 left-4 z-20 items-center gap-2 rounded-full border border-line bg-surface px-4 py-2 shadow-lg">
              <span className="h-2 w-2 rounded-full bg-rose-500 animate-pulse" />
              <span className="font-ui text-[9px] uppercase tracking-[0.18em] font-bold text-ink">
                {hero.stats[0]?.value} · {hero.stats[0]?.label}
              </span>
            </div>

            <div className="hidden lg:flex absolute -top-5 right-4 z-20 items-center gap-2 rounded-full border border-line bg-surface px-4 py-2 shadow-lg">
              <Image
                src="/images/emojis/lightning-3d.png"
                alt="Express"
                width={15}
                height={15}
                className="object-contain inline-block"
              />
              <span className="font-ui text-[9px] uppercase tracking-[0.18em] font-bold text-ink">
                {hero.stats[1]?.value} · {hero.stats[1]?.label}
              </span>
            </div>

            {/* Masonry Columns Grid */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
              {/* Left Column: Money Bouquet Feature */}
              <div className="md:col-span-3 text-left">
                <div className="group relative aspect-[3.5/4.5] rounded-3xl overflow-hidden border border-line bg-surface p-2 shadow-xl transition-all duration-500 hover:shadow-2xl">
                  <div className="relative h-full w-full rounded-2xl overflow-hidden">
                    <Image
                      src={leftHeroImg.src}
                      alt={leftHeroImg.alt}
                      fill
                      unoptimized={leftHeroImg.src.startsWith("data:") || leftHeroImg.src.startsWith("http")}
                      sizes="(max-width: 768px) 100vw, 320px"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                    <div className="absolute bottom-3 left-3 right-3 text-white">
                      <span className="font-ui text-[8px] uppercase tracking-[0.2em] text-white/80 block font-semibold">
                        Paling Laris
                      </span>
                      <span className="font-heading text-[17px] font-normal block">
                        {leftHeroImg.caption || "Money Bouquet"}
                      </span>
                      <span className="font-ui text-[9px] text-white/90 block mt-0.5">
                        Bebas Request Lembaran Uang
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Center Column: Elevated Focal Signature Bouquet */}
              <div className="md:col-span-6">
                <div className="group relative aspect-[4/4.8] rounded-3xl overflow-hidden border-2 border-[var(--accent)]/30 bg-surface p-2.5 shadow-2xl transition-all duration-500 hover:border-[var(--accent)]">
                  <div className="relative h-full w-full rounded-2xl overflow-hidden">
                    <Image
                      src={mainHeroImg.src}
                      alt={mainHeroImg.alt}
                      fill
                      priority
                      unoptimized={mainHeroImg.src.startsWith("data:") || mainHeroImg.src.startsWith("http")}
                      sizes="(max-width: 1024px) 100vw, 620px"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/25" />

                    <div className="absolute top-4 right-4 rounded-full bg-black/70 px-3.5 py-1 text-white border border-white/20 font-ui text-[9.5px] font-semibold tracking-wider flex items-center gap-1.5 shadow-sm">
                      <Image
                        src="/images/emojis/card-3d.png"
                        alt="Free Card"
                        width={15}
                        height={15}
                        className="object-contain inline-block"
                      />
                      <span>Free Kartu Ucapan Custom</span>
                    </div>

                    <div className="absolute bottom-5 left-5 right-5 text-left text-white flex items-end justify-between">
                      <div>
                        <span className="font-ui text-[9px] uppercase tracking-[0.24em] text-rose-200 block font-semibold">
                          Signature Studio Showcase
                        </span>
                        <span className="font-heading text-[24px] sm:text-[28px] font-light leading-tight block mt-1">
                          {brand}
                        </span>
                        <span className="font-ui text-[10px] text-white/80 block mt-1">
                          {brandSuffix}
                        </span>
                      </div>
                      <span className="rounded-full bg-accent px-4 py-1.5 font-ui text-[9.5px] font-bold uppercase tracking-[0.14em] text-[var(--accent-contrast)] shadow-md">
                        Mulai {formatIDR(activeNiche.products[0]?.price ?? 50000)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Stacked Graduation & Fresh Roses */}
              <div className="md:col-span-3 space-y-4 text-left">
                {/* Top Stack: Graduation Bouquet */}
                <div className="group relative aspect-[16/11] rounded-2xl overflow-hidden border border-line bg-surface p-1.5 shadow-lg transition-all duration-500 hover:shadow-xl">
                  <div className="relative h-full w-full rounded-xl overflow-hidden">
                    <Image
                      src={rightTopImg.src}
                      alt={rightTopImg.alt}
                      fill
                      unoptimized={rightTopImg.src.startsWith("data:") || rightTopImg.src.startsWith("http")}
                      sizes="(max-width: 768px) 100vw, 320px"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />
                    <div className="absolute bottom-2.5 left-2.5 right-2.5 text-white">
                      <span className="font-ui text-[7.5px] uppercase tracking-[0.18em] text-rose-200 font-semibold block">
                        Spesial Wisuda
                      </span>
                      <span className="font-heading text-[15px] font-normal block">
                        {rightTopImg.caption || "Buket Boneka & Selempang"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Bottom Stack: Signature/Fresh Bouquet */}
                <div className="group relative aspect-[16/11] rounded-2xl overflow-hidden border border-line bg-surface p-1.5 shadow-lg transition-all duration-500 hover:shadow-xl">
                  <div className="relative h-full w-full rounded-xl overflow-hidden">
                    <Image
                      src={rightBottomImg.src}
                      alt={rightBottomImg.alt}
                      fill
                      unoptimized={rightBottomImg.src.startsWith("data:") || rightBottomImg.src.startsWith("http")}
                      sizes="(max-width: 768px) 100vw, 320px"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />
                    <div className="absolute bottom-2.5 left-2.5 right-2.5 text-white">
                      <span className="font-ui text-[7.5px] uppercase tracking-[0.18em] text-rose-200 font-semibold block">
                        {isNafila ? "Fantasy Series" : "Romantis & Harum"}
                      </span>
                      <span className="font-heading text-[15px] font-normal block">
                        {rightBottomImg.caption || (isNafila ? "Fairytopia Series" : "Classic Velvet Roses")}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. KATALOG SECTION (Smooth 2D Swipeable Showcase) */}
      <section id="categories" className="relative border-t border-line px-4 sm:px-6 md:px-10 pt-14 pb-16 sm:pt-20 sm:pb-24 bg-canvas overflow-hidden">
        {/* Subtle decorative background blur glow */}
        <div className="pointer-events-none absolute -top-24 left-1/2 h-[380px] w-[600px] -translate-x-1/2 rounded-full bg-[var(--accent)]/10 blur-[120px]" />

        <div className="relative mx-auto max-w-[1400px]">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="max-w-[620px]">
              <div className="inline-flex items-center gap-2 text-[9.5px] font-ui uppercase tracking-[0.24em] text-accent font-semibold">
                <Image
                  src="/images/emojis/flower-3d.png"
                  alt="Katalog"
                  width={14}
                  height={14}
                  className="object-contain inline-block"
                />
                <span>Katalog Buket Spesial · Geser &amp; Pilih</span>
              </div>
              <h2 className="mt-2.5 font-heading text-[clamp(2rem,4vw,3.4rem)] leading-[1.04] text-ink">
                {isNafila ? "Pilih Model Buket Impianmu." : "Katalog Rangkaian Spesial."}
              </h2>
              <p className="mt-2 font-body text-[13px] sm:text-[13.5px] text-muted">
                {isNafila
                  ? "Geser ke samping untuk melihat koleksi buket pilihan. Langsung klik keranjang atau pesan via WA!"
                  : "Geser ke samping untuk menjelajahi katalog rangkaian bunga dan temukan pilihan favoritmu."}
              </p>
            </div>

            <div className="hidden sm:flex items-center gap-2 font-ui text-[10px] text-muted uppercase tracking-[0.16em]">
              <span>Geser Untuk Melihat Koleksi Lainnya</span>
            </div>
          </div>

          {/* Clean 2D Swipeable Gallery View */}
          <div className="mt-8 relative w-full overflow-hidden">
            <CircularGallery
              title={isNafila ? "" : ""}
              subtitle=""
              radius={620}
              onAddToCart={(item) => {
                const product =
                  item.originalProduct ||
                  activeNiche.products.find((p) => p.id === item.id);
                if (product) {
                  addToCart(product, 1);
                  openCart();
                }
              }}
              items={activeNiche.products.map((p) => ({
                id: p.id,
                name: p.name,
                subtitle: p.subtitle,
                price: p.price,
                image: p.image,
                badge: p.badge,
                originalProduct: p,
                whatsappUrl: `https://wa.me/${clientWa}?text=${encodeURIComponent(
                  `Halo ${brand}, saya ingin konsultasi / pesan buket "${p.name}" (${formatIDR(p.price)}). Apakah slot & variannya masih ready? Terima kasih!`
                )}`,
              }))}
            />
          </div>
        </div>
      </section>

      {/* 5.1 FORM PEMESANAN CEPAT & PRAKTIS */}
      <section id="order-form" className="border-t border-line px-4 sm:px-6 md:px-10 py-16 sm:py-24 bg-surface">
        <div className="mx-auto max-w-[1200px]">
          <div className="text-center max-w-[680px] mx-auto">
            <div className="inline-flex items-center gap-2 text-[9.5px] font-ui uppercase tracking-[0.24em] text-accent font-semibold">
              <Image
                src="/images/emojis/flower-3d.png"
                alt="Form"
                width={14}
                height={14}
                className="object-contain inline-block"
              />
              <span>Formulir Pemesanan Cepat</span>
            </div>
            <h2 className="mt-2.5 font-heading text-[clamp(2.1rem,4.2vw,3.4rem)] leading-[1.04] text-ink">
              Pesan Buket Impianmu Tanpa Ribet.
            </h2>
            <p className="mt-2.5 font-body text-[13px] sm:text-[14px] leading-relaxed text-muted">
              Isi data di bawah ini, admin {brand} akan langsung menerima detail pesananmu via WhatsApp dan segera memproses rangkaiannya!
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Form Inputs (Left Column) */}
            <div className="lg:col-span-7 bg-canvas rounded-3xl border border-line p-6 sm:p-9 shadow-sm space-y-6">
              {/* Varian Buket Dropdown */}
              <div>
                <label className="block font-ui text-[9.5px] font-bold uppercase tracking-[0.18em] text-ink mb-2">
                  1. Pilih Varian Buket
                </label>
                <div className="relative">
                  <select
                    value={selectedProduct}
                    onChange={(e) => setSelectedProduct(e.target.value)}
                    className="w-full rounded-2xl border border-line bg-surface px-4 py-3 font-ui text-[13px] text-ink focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent cursor-pointer appearance-none pr-10"
                  >
                    {activeNiche.products.map((p) => (
                      <option key={p.id} value={p.name}>
                        {p.name} — {formatIDR(p.price)}
                      </option>
                    ))}
                  </select>
                  <svg
                    viewBox="0 0 12 12"
                    fill="none"
                    className="pointer-events-none absolute right-4 top-1/2 h-3 w-3 -translate-y-1/2 text-muted"
                    aria-hidden="true"
                  >
                    <path d="M2 4.5 6 8.5l4-4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>

              {/* Data Pemesan: Nama & WhatsApp */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-ui text-[9.5px] font-bold uppercase tracking-[0.18em] text-ink mb-2">
                    2. Nama Pemesan
                  </label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Nama lengkap Anda"
                    className="w-full rounded-2xl border border-line bg-surface px-4 py-3 font-ui text-[13px] text-ink placeholder:text-muted/60 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                  />
                </div>
                <div>
                  <label className="block font-ui text-[9.5px] font-bold uppercase tracking-[0.18em] text-ink mb-2">
                    3. No. WhatsApp
                  </label>
                  <input
                    type="tel"
                    value={customerWa}
                    onChange={(e) => setCustomerWa(e.target.value)}
                    placeholder="Contoh: 08123456789"
                    className="w-full rounded-2xl border border-line bg-surface px-4 py-3 font-ui text-[13px] text-ink placeholder:text-muted/60 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                  />
                </div>
              </div>

              {/* Opsi Kirim */}
              <div>
                <label className="block font-ui text-[9.5px] font-bold uppercase tracking-[0.18em] text-ink mb-2">
                  4. Opsi Pengiriman / Penyerahan
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {(isNafila
                    ? [
                        "Kirim Kurir Instan Semarang",
                        "Ekspedisi Aman Se-Indonesia",
                        "Self-Pickup Workshop BSB Mijen",
                      ]
                    : [
                        "Kirim Kurir Instan Jabodetabek",
                        "Self-Pickup Studio",
                      ]
                  ).map((opt) => {
                    const isSel = selectedDelivery === opt;
                    return (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => setSelectedDelivery(opt)}
                        className={cn(
                          "px-3.5 py-3 rounded-2xl border text-center font-ui text-[11px] font-semibold transition-all cursor-pointer",
                          isSel
                            ? "border-accent bg-surface text-ink ring-1 ring-accent shadow-xs"
                            : "border-line bg-surface/60 text-muted hover:border-accent/50"
                        )}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Alamat Lengkap Tujuan */}
              <div>
                <label className="block font-ui text-[9.5px] font-bold uppercase tracking-[0.18em] text-ink mb-2">
                  5. Alamat Lengkap Tujuan
                </label>
                <textarea
                  value={customerAddress}
                  onChange={(e) => setCustomerAddress(e.target.value)}
                  rows={2}
                  placeholder={
                    isNafila
                      ? "Jalan, No. Rumah, RT/RW, Kelurahan, Kecamatan, Kota (Contoh: Mijen, Semarang)"
                      : "Alamat lengkap pengiriman"
                  }
                  className="w-full rounded-2xl border border-line bg-surface px-4 py-3 font-ui text-[12.5px] text-ink placeholder:text-muted/60 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent resize-none"
                />
              </div>

              {/* Pesan Kartu Ucapan Free */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="font-ui text-[9.5px] font-bold uppercase tracking-[0.18em] text-ink flex items-center gap-1.5">
                    <Image
                      src="/images/emojis/card-3d.png"
                      alt="Card"
                      width={14}
                      height={14}
                      className="object-contain inline-block"
                    />
                    6. Pesan Kartu Ucapan (Gratis Tulisan Tangan)
                  </label>
                  <span className="text-[9px] font-ui text-accent font-semibold">FREE</span>
                </div>
                <textarea
                  value={greetingText}
                  onChange={(e) => setGreetingText(e.target.value)}
                  rows={2}
                  placeholder="Tulis pesan ucapan tulus untuk orang tersayang..."
                  className="w-full rounded-2xl border border-line bg-surface px-4 py-3 font-ui text-[12.5px] text-ink placeholder:text-muted/60 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent resize-none"
                />
              </div>
            </div>

            {/* Order Summary & WhatsApp Action (Right Column) */}
            <div className="lg:col-span-5 bg-canvas rounded-3xl border border-line p-6 sm:p-8 shadow-sm lg:sticky lg:top-[100px]">
              <span className="font-ui text-[8.5px] uppercase tracking-[0.24em] text-accent font-bold block">
                Ringkasan Pemesanan
              </span>

              {/* Selected Item Preview */}
              <div className="mt-4 flex items-center gap-3.5 pb-4 border-b border-line">
                {chosenProductObj?.image && (
                  <div className="relative h-16 w-16 rounded-xl overflow-hidden shrink-0 border border-line">
                    <Image
                      src={chosenProductObj.image}
                      alt={chosenProductObj.name}
                      fill
                      unoptimized
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="min-w-0">
                  <div className="font-heading text-[18px] text-ink font-semibold truncate">
                    {chosenProductObj?.name ?? selectedProduct}
                  </div>
                  <div className="font-ui text-[11px] text-accent font-bold mt-0.5">
                    {formatIDR(orderPrice)}
                  </div>
                  <div className="font-body text-[10.5px] text-muted truncate mt-0.5">
                    {selectedDelivery}
                  </div>
                </div>
              </div>

              {/* Greeting Card Envelope Preview */}
              <div className="mt-4 p-4 rounded-2xl bg-surface border border-line shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="font-ui text-[8px] uppercase tracking-[0.18em] text-accent font-bold">
                    Preview Kartu Ucapan
                  </span>
                  <span className="font-ui text-[8.5px] text-muted">Tulisan Tangan Rapi</span>
                </div>
                <p className="mt-2 font-heading italic text-[13.5px] text-ink leading-relaxed line-clamp-3">
                  “{greetingText || "Belum ada ucapan..."}”
                </p>
              </div>

              {/* Price & Delivery Notice */}
              <div className="mt-5 space-y-2 text-[12px] font-ui border-b border-line pb-4">
                <div className="flex justify-between text-muted">
                  <span>Harga Buket</span>
                  <span className="font-bold text-ink">{formatIDR(orderPrice)}</span>
                </div>
                <div className="flex justify-between text-muted">
                  <span>Kartu Ucapan Custom</span>
                  <span className="font-semibold text-emerald-600">GRATIS</span>
                </div>
                <div className="flex justify-between text-muted">
                  <span>Ongkos Kirim</span>
                  <span className="text-[11px] italic text-muted">Dihitung oleh Admin via WA</span>
                </div>
              </div>

              <div className="mt-4 flex items-baseline justify-between">
                <span className="font-ui text-[11px] uppercase tracking-[0.16em] text-muted font-medium">
                  Total Estimasi
                </span>
                <span className="font-heading text-[26px] font-bold text-accent">
                  {formatIDR(orderPrice)}
                </span>
              </div>

              {/* Big Direct WhatsApp Order Button */}
              <a
                href={directOrderHref}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 w-full rounded-full bg-accent py-4 font-ui text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--accent-contrast)] hover:opacity-90 transition-opacity shadow-md flex items-center justify-center gap-2 text-center cursor-pointer active:scale-95"
              >
                <span>Kirim Pesanan ke WhatsApp</span>
                <span>↗</span>
              </a>

              <p className="mt-3 text-center font-body text-[10.5px] text-muted leading-relaxed">
                Respon cepat admin {brand} · Langsung dikonfirmasi ketersediaan & jadwal kirim hari ini.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. STUDIO PONDOK KELAPA & STORY */}
      {visibility.showStory && (
        <section id="studio" className="border-t border-line px-6 py-16 sm:px-10 sm:py-24 bg-surface">
          <div className="mx-auto max-w-[1400px]">
            <div className="rounded-3xl border border-line bg-canvas p-8 sm:p-14">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
                <div className="lg:col-span-7">
                  <span className="inline-block rounded-full bg-surface border border-line text-accent px-3.5 py-1 font-ui text-[9px] uppercase tracking-[0.2em] font-bold">
                    {story.kicker}
                  </span>
                  <h3 className="mt-3 font-heading text-[28px] sm:text-[38px] text-ink leading-tight">
                    {story.title}
                  </h3>
                  <div className="mt-3 space-y-2.5 font-body text-[13.5px] leading-relaxed text-muted">
                    {story.paragraphs.map((p, idx) => (
                      <p key={idx}>{p}</p>
                    ))}
                  </div>

                  <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-line pt-5">
                    {displayOrderSteps.map((s) => (
                      <div key={s.number}>
                        <span className="font-ui text-[8.5px] uppercase tracking-[0.16em] text-accent font-bold block">
                          Langkah {s.number}
                        </span>
                        <span className="font-ui text-[12px] font-semibold text-ink mt-1 block">
                          {s.action}
                        </span>
                        <span className="font-body text-[10.5px] text-muted mt-0.5 block">
                          {s.detail}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
                    <a
                      href={`https://wa.me/${clientWa}?text=${encodeURIComponent(
                        `Halo ${brand}, saya ingin pesan buket untuk pengiriman hari ini / self pickup.`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-ink px-7 py-3.5 font-ui text-[10.5px] font-semibold uppercase tracking-[0.16em] text-surface hover:bg-[var(--accent)] transition-colors cursor-pointer text-center"
                    >
                      <span>Hubungi WA Sekarang</span>
                      <span>↗</span>
                    </a>
                    <span className="font-body text-[11px] text-muted text-center sm:text-left">
                      {footer.address}
                    </span>
                  </div>
                </div>

                <div className="lg:col-span-5 relative">
                  <div className="relative aspect-square rounded-2xl overflow-hidden border border-line">
                    <Image
                      src={story.images[0]?.src || "/images/florist/hero.jpg"}
                      alt={story.images[0]?.alt || `${brand} Studio`}
                      fill
                      unoptimized={(story.images[0]?.src || "").startsWith("data:") || (story.images[0]?.src || "").startsWith("http")}
                      className="object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 7. AUTHENTIC SOCIAL PROOF & CUSTOMER REVIEWS */}
      {visibility.showReviews && (
        <section id="reviews" className="border-t border-line bg-canvas px-6 py-16 sm:px-10 sm:py-24">
          <div className="mx-auto max-w-[1400px]">
            {/* Section Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-line pb-8">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-surface border border-line px-3.5 py-1 font-ui text-[9px] uppercase tracking-[0.2em] font-bold text-accent shadow-2xs">
                  <span className="flex items-center gap-1.5">
                    <Image
                      src="/images/emojis/star-3d.png"
                      alt="Rating"
                      width={14}
                      height={14}
                      className="object-contain inline-block"
                    />
                    4.98 / 5.0
                  </span>
                  <span className="h-1 w-1 rounded-full bg-accent" />
                  <span>8.500+ Buket Terangkai</span>
                </div>
                <h2 className="mt-3 font-heading text-[clamp(2.2rem,4vw,3.6rem)] leading-[1.04] text-ink">
                  Momen Bahagia Bersama <br />
                  <span className="italic font-light text-accent">{brand}.</span>
                </h2>
              </div>

              {/* Quick Proof Pills */}
              <div className="flex items-center gap-6">
                <div className="text-right">
                  <div className="font-heading text-[24px] font-bold text-accent">8.500+</div>
                  <div className="font-ui text-[8.5px] uppercase tracking-[0.16em] text-muted">
                    Buket Terkirim
                  </div>
                </div>
                <div className="h-8 w-px bg-[var(--border)]" />
                <div className="text-right">
                  <div className="font-heading text-[24px] font-bold text-emerald-600">24 Jam</div>
                  <div className="font-ui text-[8.5px] uppercase tracking-[0.16em] text-muted">
                    Fast Response WA
                  </div>
                </div>
              </div>
            </div>

            {/* Review Cards Grid */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {reviews.filter(
                (r) => activeFloristFilter === "all" || r.category === activeFloristFilter
              ).map((rev) => (
                <div
                  key={rev.id}
                  className="rounded-3xl border border-line bg-surface p-5 flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:border-[var(--accent)]/50"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <div className="flex text-amber-500 text-xs tracking-wider">
                        {"★".repeat(rev.stars)}
                      </div>
                      <span className="font-ui text-[8px] text-muted uppercase tracking-wider">
                        {rev.date}
                      </span>
                    </div>

                    <p className="mt-3 font-body text-[12.5px] leading-relaxed text-ink/90 italic">
                      &ldquo;{rev.review}&rdquo;
                    </p>
                  </div>

                  <div className="mt-5 pt-4 border-t border-line">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-canvas border border-line font-ui text-[10px] font-bold text-accent">
                        {rev.avatar}
                      </div>
                      <div>
                        <div className="font-ui text-[11px] font-bold text-ink">
                          {rev.name}
                        </div>
                        <div className="font-ui text-[9px] text-muted">
                          {rev.location}
                        </div>
                      </div>
                    </div>
                    <div className="mt-2 font-ui text-[8.5px] text-accent font-medium bg-canvas px-2 py-0.5 rounded-full border border-line inline-block">
                      {rev.tag}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 8. FAQ ACCORDION */}
      {visibility.showFaq && <FaqAccordion />}

      {/* 9. FOOTER */}
      <SiteFooter />
    </div>
  );
}
