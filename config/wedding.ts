import type { WeddingConfig } from "@type/wedding";

export const WEDDING_TEMPLATES: Record<string, WeddingConfig> = {
  "raditya-adinda": {
    slug: "raditya-adinda",
    groomInitial: "R",
    brideInitial: "A",
    groom: {
      name: "Raditya",
      fullName: "Raditya Putra Mahendra",
      parentNames: "Putra dari Bapak Hendra Mahendra & Ibu Siti Nurhaliza",
      photo: "/images/wedding/groom.jpg",
      instagram: "@raditya.pm",
    },
    bride: {
      name: "Adinda",
      fullName: "Adinda Sari Pramesti",
      parentNames: "Putri dari Bapak Pramono Sari & Ibu Dewi Kartini",
      photo: "/images/wedding/bride.jpg",
      instagram: "@adinda.sp",
    },
    quote: {
      text: "Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu pasangan hidup dari jenismu sendiri, supaya kamu merasa tenteram kepadanya, dan dijadikan-Nya di antaramu rasa kasih dan sayang.",
      source: "QS. Ar-Rum: 21",
    },
    events: [
      {
        title: "Akad Nikah",
        date: "2027-03-15",
        timeStart: "08:00",
        timeEnd: "10:00",
        venue: "Masjid Agung Al-Azhar",
        address: "Jl. Sisingamangaraja, Kebayoran Baru, Jakarta Selatan",
        mapsUrl: "https://maps.app.goo.gl/example-akad",
      },
      {
        title: "Resepsi",
        date: "2027-03-15",
        timeStart: "11:00",
        timeEnd: "14:00",
        venue: "The Dharmawangsa Jakarta",
        address: "Jl. Brawijaya Raya No.26, Kebayoran Baru, Jakarta Selatan",
        mapsUrl: "https://maps.app.goo.gl/example-resepsi",
      },
    ],
    loveStory: [
      {
        year: "2019",
        title: "Pertama Bertemu",
        description:
          "Pertemuan kami bermula dari bangku kuliah yang sama di kampus UI. Sebuah senyuman di lorong perpustakaan yang mengubah segalanya.",
      },
      {
        year: "2021",
        title: "Membangun Komitmen",
        description:
          "Dua tahun mengenal, kami semakin yakin bahwa rumah bukan soal tempat, melainkan tentang siapa yang ada di sisimu.",
      },
      {
        year: "2024",
        title: "Lamaran",
        description:
          "Di bawah langit senja Labuan Bajo, Raditya berlutut dan mengucapkan janji yang telah lama tersimpan di hati.",
      },
      {
        year: "2027",
        title: "Hari Bahagia",
        description:
          "Hari di mana dua keluarga bersatu dalam satu doa, satu ikatan suci, dan satu cinta yang abadi.",
      },
    ],
    gallery: [
      { src: "/images/wedding/gallery-1.jpg", alt: "Prewedding portrait studio" },
      { src: "/images/wedding/gallery-2.jpg", alt: "Prewedding outdoor sunset" },
      { src: "/images/wedding/gallery-3.jpg", alt: "Prewedding intimate candid" },
      { src: "/images/wedding/gallery-4.jpg", alt: "Prewedding bouquet detail" },
      { src: "/images/wedding/gallery-5.jpg", alt: "Prewedding black and white" },
      { src: "/images/wedding/gallery-6.jpg", alt: "Prewedding fine art" },
    ],
    bankAccounts: [
      {
        bank: "Bank Central Asia (BCA)",
        accountNumber: "8720456789",
        accountName: "Raditya Putra Mahendra",
      },
      {
        bank: "Bank Mandiri",
        accountNumber: "1300012345678",
        accountName: "Adinda Sari Pramesti",
      },
    ],
    giftAddress:
      "Jl. Kemang Selatan VIII No. 12, RT 01/RW 05, Bangka, Mampang Prapatan, Jakarta Selatan 12730",
    audioSrc: "https://audio.jukehost.co.uk/01a1ed48-4427-7292-857e-f1f5fc65d1cf",
    theme: {
      primary: "#C5A880",
      primaryMuted: "#D4C5A9",
      background: "#FAF8F5",
      surface: "#FFFFFF",
      text: "#1C1917",
      textMuted: "#78716C",
      accent: "#D4AF37",
      fontSerif: "var(--font-cormorant)",
      fontSans: "var(--font-jakarta)",
    },
    dressCode: {
      label: "Formal / Semi-Formal · Earth Tone & Champagne",
      colors: ["#C5A880", "#A8947A", "#E8DED1", "#78716C", "#1C1917"],
    },
  },
};

export function getWeddingConfig(slug: string): WeddingConfig | null {
  return WEDDING_TEMPLATES[slug] ?? null;
}
