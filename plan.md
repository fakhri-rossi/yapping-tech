# 💍 Master Plan (Revisi): Template Wedding Landing Page "Plivin Wedding"

Rencana pembuatan **Template Undangan Pernikahan Digital Gaya Landing Page Sinematik** untuk produk in-house venture **Plivin** (`plivin.co`), ringan, interaktif, cepat, dan patuh pada [GUARD.md](./GUARD.md).

---

## 1. Penyesuaian Sesuai Arahan User

1. **Gaya Landing Page (Non-3D Berat):**
   * Tidak memakai elemen 3D berat agar loading instan di HP dan scroll sangat halus (*sub-1 second performance*).
   * Desain mengusung **Editorial Luxury Minimalist** (foto prewedding sinematik hasil AI, tipografi elegan, glassy overlay, dan animasi CSS/Framer Motion ringan).
2. **Opening Cover Personal ("Kepada Yth. [Nama Tamu]"):**
   * Saat link dibuka (contoh: `/templates/wedding?to=Budi+Santoso`), muncul layar cover eksklusif:
     * Logo Plivin & Monogram inisial pasangan.
     * Teks *"Kepada Yth. Bapak/Ibu/Saudara/i:"* dilanjutkan nama tamu dari URL yang bold & estetik.
     * Tombol interaktif **"Buka Undangan"** dengan animasi transisi smooth (curtain reveal / zoom out) langsung masuk ke isi undangan, sekaligus memicu musik otomatis berputar.
3. **Sticky/Floating Music Player:**
   * Begitu undangan dibuka, lagu langsung play dengan piringan vinyl berputar di pojok bawah layar + tombol Mute/Pause.
4. **Kirim Hadiah Langsung ke Rekening Pasangan:**
   * Section Digital Gift: Kartu rekening mempelai (BCA, Mandiri, atau QRIS) lengkap dengan nomor rekening, nama pemilik, dan tombol **"Salin Nomor Rekening"** (dengan animasi toast "Nomor rekening berhasil disalin!").
   * Konfirmasi kirim hadiah langsung via WhatsApp mempelai.
5. **Dinding Seluruh Ucapan Tamu (Live Wishes Wall):**
   * Menampilkan form kirim ucapan & doa restu.
   * Di bawahnya langsung ada daftar/feed seluruh ucapan dari tamu-tamu yang diundang secara live & interaktif.

---

## 2. Alur Halaman (Single-Page Seamless Landing)

```text
┌─────────────────────────────────────────────────────────────┐
│ 1. OPENING COVER (Fullscreen Gate)                          │
│    - The Wedding of Raditya & Adinda                        │
│    - "Kepada Yth. [Nama Tamu dari URL]"                     │
│    - Tombol "Buka Undangan" (Animasi Buka + Audio Play)     │
└──────────────────────────────┬──────────────────────────────┘
                               │ (Smooth Reveal Animation)
                               ▼
┌─────────────────────────────────────────────────────────────┐
│ 2. MAIN LANDING PAGE                                        │
│    ├── Floating Music Player (Vinyl berputar di sudut)       │
│    ├── Hero Section (Foto Pasangan AI + Countdown Timer)    │
│    ├── Profile Mempelai Pria & Wanita (Foto & Bio Singkat)   │
│    ├── Rangkaian Acara (Akad Nikah & Resepsi + Google Maps) │
│    ├── Galeri Foto Prewedding (AI Editorial Photography)    │
│    ├── Love Story Singkat (Perjalanan Cinta)                │
│    ├── Hadiah Pernikahan / Rekening Pasangan (Copy Instan)  │
│    ├── Form Ucapan & Dinding Seluruh Doa Tamu (Live Feed)   │
│    └── Penutup & Plivin Signature Branding                  │
└─────────────────────────────────────────────────────────────┘
```

---

## 3. Rencana Komponen & File

Sesuai aturan [GUARD.md](./GUARD.md):

* **Komponen Orchestrator:**
  * `components/experiences/WeddingExperience.tsx`
* **Sub-komponen Modular:**
  * `components/templates/wedding/OpeningCover.tsx` (Layar cover Yth nama tamu + trigger audio)
  * `components/templates/wedding/MusicPlayer.tsx` (Floating music player vinyl interaktif)
  * `components/templates/wedding/WeddingHero.tsx` (Hero banner + countdown live)
  * `components/templates/wedding/CoupleSection.tsx` (Profil mempelai pria & wanita)
  * `components/templates/wedding/EventDetails.tsx` (Jadwal akad, resepsi, button maps)
  * `components/templates/wedding/WeddingGift.tsx` (Rekening pasangan + copy button)
  * `components/templates/wedding/WishesWall.tsx` (Form doa + daftar seluruh ucapan tamu)
* **Config & Types:**
  * Tambahkan `wedding` di `NicheId` ([types/landing.ts](./types/landing.ts)).
  * Daftarkan data lengkap di [config/niches.ts](./config/niches.ts).
* **Aset:**
  * `public/audio/wedding-song.mp3` (Instrumental akustik romantis).
  * `public/images/wedding/` (Foto pasangan prewedding editorial hasil AI).

---

## 4. Tahapan Pengerjaan

1. **Step 1:** Setup konfigurasi data niche `wedding` di `@config/niches.ts` dan tipe data di `@type/landing.ts`.
2. **Step 2:** Generate foto prewedding AI yang estetik & siapkan audio background music.
3. **Step 3:** Buat komponen Opening Cover ("Kepada Yth"), Music Player, Digital Gift Rekening, dan Wishes Wall.
4. **Step 4:** Rakit di `WeddingExperience.tsx`, sambungkan routing `/templates/wedding`, lalu validasi `npx tsc --noEmit`.
