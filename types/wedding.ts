/** Wedding-specific configuration and types for Plivin Wedding Suite */

export interface WeddingPerson {
  name: string;
  fullName: string;
  parentNames: string;
  photo: string;
  instagram?: string;
}

export interface WeddingEvent {
  title: string;
  date: string; // ISO date string
  timeStart: string;
  timeEnd: string;
  venue: string;
  address: string;
  mapsUrl: string;
}

export interface WeddingBankAccount {
  bank: string;
  accountNumber: string;
  accountName: string;
  logo?: string;
}

export interface WeddingLoveStoryChapter {
  year: string;
  title: string;
  description: string;
}

export interface WeddingWish {
  id: string;
  name: string;
  message: string;
  attendance: "hadir" | "tidak" | "ragu";
  timestamp: number;
  timeAgo?: string;
}

export interface WeddingConfig {
  slug: string;
  groomInitial: string;
  brideInitial: string;
  groom: WeddingPerson;
  bride: WeddingPerson;
  quote: { text: string; source: string };
  events: WeddingEvent[];
  loveStory: WeddingLoveStoryChapter[];
  gallery: { src: string; alt: string }[];
  bankAccounts: WeddingBankAccount[];
  giftAddress?: string;
  audioSrc: string;
  theme: {
    primary: string;
    primaryMuted: string;
    background: string;
    surface: string;
    text: string;
    textMuted: string;
    accent: string;
    fontSerif: string;
    fontSans: string;
  };
  dressCode?: { label: string; colors: string[] };
}
