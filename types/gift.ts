// ============================================================
// Plivin Digital Gift Type Definitions
// Sourced from plivin-digital-gift
// ============================================================

export interface TemplateData {
  id: string;
  title: string;
  category: string;
  categories: string[];
  price: number;
  originalPrice?: number;
  photosRequired: number;
  description: string;
  emoji: string;
  colorTheme: string;
  note: string;
  demoUrl?: string;
  isFeatured?: boolean;
  isActive?: boolean;
  isHidden?: boolean;
}

export interface CustomPlaylistItem {
  title: string;
  artist: string;
  url: string;
}

export interface TemplateProps {
  recipientName: string;
  greetingText: string;
  photos: string[];
  musicUrl: string;
  orderNumber: string;
  showBackButton?: boolean;
  customPin?: string;
  customHint?: string;
  customPlaylist?: CustomPlaylistItem[];
}

export interface DemoTemplateConfig extends TemplateProps {
  id: string;
  title: string;
}

export const FILTER_CATEGORIES = ['Semua', 'Ulang Tahun', 'Kelulusan / Wisuda', 'Anniversary'] as const;
export type FilterCategory = (typeof FILTER_CATEGORIES)[number];
