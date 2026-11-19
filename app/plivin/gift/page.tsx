import type { Metadata } from 'next';
import DigitalGiftLanding from '@components/plivin/landing/DigitalGiftLanding';

export const metadata: Metadata = {
  title: 'Plivin.co — Web Kado Digital Interaktif Estetik',
  description:
    'Kirim kado digital interaktif untuk orang tersayang dalam 1 menit. Dilengkapi lagu romantis, amplop surat cinta, efek transisi visual, galeri foto, dan aktif selamanya.',
  icons: {
    icon: [
      { url: '/favicon-plivin.svg', type: 'image/svg+xml' },
      { url: '/favicon-plivin.png', type: 'image/png' },
    ],
    apple: [
      { url: '/favicon-plivin.png' },
    ],
  },
};

export default function PlivinGiftPage() {
  return <DigitalGiftLanding />;
}
