# PROJECT ARCHITECTURE & GUARD RULES

Dokumen ini berisi panduan dan aturan ketat (guardrails) bagi AI dan developer saat menambahkan fitur baru, memodifikasi kode, atau membuat file baru di project ini.

---

## 1. Aturan Penempatan Folder (Folder Structure Guidelines)

DILARANG membuat file komponen baru langsung di root folder `components/`. Semua komponen baru WAJIB ditempatkan di subfolder yang sesuai dengan peruntukannya:

```text
components/
├── ui/              # Primitif UI, atoms, shared interactive elements (contoh: Button, Modal, Magnetic, Logo, ScrollToTop)
├── landing/         # Komponen khusus halaman Company Profile & Landing Page utama (Hero, Faq, Timeline, Story, dll)
├── templates/       # Komponen katalog showcase template, dock, cart, card template, client stage
├── experiences/     # Komponen live demo/preview interaktif per niche (Florist, Catering, Patisserie, dll)
├── cms/             # Komponen internal/demo editor CMS (Workspace, preview frame, image picker, field form)
├── komose/          # Komponen khusus ekosistem/landing Komose
└── plivin/          # Komponen khusus ekosistem/landing Plivin (Wedding & Digital Gifting Suite)
```

### Folder Lainnya:
* `app/`: Routing Next.js App Router (page, layout, API route). Jangan letakkan komponen kompleks inline jika bisa diekstrak ke `components/<subfolder>`.
* `config/`: Konfigurasi statis, data mock awal, list niche, kontak WhatsApp, metadata bisnis.
* `lib/`: Fungsi utilitas murni, formatters, storage helpers, math/geometry helpers, custom hooks umum.
* `context/`: State management global React Context (contoh: `ShowcaseContext`).
* `types/`: Type definition TypeScript (`.ts`).
* `public/`: Asset gambar statis, favicon, font lokal, svg.

---

## 2. Aturan Path Alias (DILARANG MENGGUNAKAN `@/`)

Project ini menggunakan alias spesifik tanpa `@/`. Saat melakukan import, WAJIB menggunakan alias berikut sesuai `tsconfig.json`:

| Alias | Target Direktori | Contoh Pemakaian |
|---|---|---|
| `@components/*` | `./components/*` | `import { Magnetic } from "@components/ui/Magnetic";` |
| `@config/*` | `./config/*` | `import { WHATSAPP_NUMBER } from "@config/niches";` |
| `@lib/*` | `./lib/*` | `import { formatIDR } from "@lib/format";` |
| `@context/*` | `./context/*` | `import { useShowcase } from "@context/ShowcaseContext";` |
| `@type/*` | `./types/*` | `import type { Product } from "@type/landing";` |
| `@app/*` | `./app/*` | `import ... from "@app/...";` |

> **Catatan Penting:** Gunakan `@type/*` (bukan `@types/*`) untuk file type definisi guna mencegah konflik resolusi TypeScript dengan `@types/` bawaan npm.

---

## 3. Checklist Sebelum Menulis Kode Baru

1. **Identifikasi Domain:** Apakah komponen ini atom/primitif (`ui`), landing compro (`landing`), katalog template (`templates`), atau demo live niche (`experiences`)?
2. **Gunakan Subfolder yang Tepat:** Jangan pernah membuat file baru di `components/MyComponent.tsx`. Letakkan di `components/<domain>/MyComponent.tsx`.
3. **Cek Path Alias:** Pastikan tidak ada import `from "@/components/..."` atau `from "../../../..."` yang terlalu dalam jika alias tersedia.
4. **Validasi Type & Build:**
   * Jalankan `npx tsc --noEmit` untuk memastikan tidak ada import error atau type clash.
   * Jalankan `npm run lint` untuk menjaga konsistensi kode.

---

## 4. Aturan Penambahan Niche / Template Baru

Jika menambahkan template niche bisnis baru (contoh: barbershop, cafe, interior):
1. **Definisi Config & Types:**
   * Daftarkan ID dan data awal di `@config/niches.ts` (`NICHES`, `NICHE_MAP`).
   * Pastikan tipe data sesuai kontrak di `@type/landing.ts`.
2. **Preview Experience:**
   * Buat file komponen live preview baru di `components/experiences/<NamaNiche>Experience.tsx`.
   * Sambungkan ke `components/experiences/NicheExperience.tsx`.
3. **Data Mock & Assets:**
   * Letakkan asset gambar di `public/images/<nama-niche>/`.
   * Selalu gunakan `WHATSAPP_NUMBER` dari `@config/niches` (jangan pernah hardcode nomor WA).

---

## 5. Konvensi State & Flow Pemesanan

* **CMS Sync:** Komponen yang mendukung customisasi CMS wajib membaca state dari `useShowcase()` (`@context/ShowcaseContext`), bukan mengandalkan state lokal terisolasi jika nilai tersebut bisa diatur via CMS.
* **Flow Pesanan:** Fitur keranjang/katalog pesanan (`CartDrawer`, catalog card) wajib mengarahkan user ke Form Pemesanan (`#order-form` / section form khusus) terlebih dahulu untuk mengisi detail sebelum checkout ke WhatsApp.

---

## 6. Standar Performa & Styling

1. **Responsif & Mobile First:**
   * Selalu uji scroll horizontal dan overflow di layar mobile/tablet (`overflow-x-hidden` jika diperlukan).
   * Hindari layout shift (CLS) dengan selalu menyertakan `width` & `height` atau `fill` pada `next/image`.
2. **Animasi (Framer Motion / Lucide):**
   * Gunakan animasi ringan. Jangan tambahkan heavy library baru jika bisa diselesaikan dengan Tailwind CSS atau motion yang sudah ada.
3. **Clean Code & Purity:**
   * Hindari pemanggilan fungsi impure (seperti `Date.now()`, `Math.random()`) langsung di fase render component; gunakan saat event handler atau `useEffect`.
