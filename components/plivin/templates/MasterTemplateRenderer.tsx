'use client';

import { TemplateProps } from '@type/gift';
import RomanticNeonPoetry from './RomanticNeonPoetry';
import PolaroidMemory from './PolaroidMemory';
import BouquetOfLove from './BouquetOfLove';
import DateInvitation from './DateInvitation';
import WindahGraduation from './WindahGraduation';
import FotoKitaBlur from './FotoKitaBlur';
import KicauMania from './KicauMania';
import PaperScrapbook from './PaperScrapbook';
import GoldenWisuda from './GoldenWisuda';
import Interactive3DBook from './Interactive3DBook';
import VintageCamera from './VintageCamera';
import LoveReceipt from './LoveReceipt';
import RetroDigicamY2K from './RetroDigicamY2K';
import JourneyTimeline from './JourneyTimeline';
import ClassicAcademic from './ClassicAcademic';
import LoveArcadeLetter from './LoveArcadeLetter';
import MaroonBirthdaySurprise from './MaroonBirthdaySurprise';
import BlueGinghamLoveNote from './BlueGinghamLoveNote';
import GenericTemplate from './GenericTemplate';
import Link from 'next/link';

interface MasterTemplateRendererProps extends TemplateProps {
  templateId: string;
}

export default function MasterTemplateRenderer({
  templateId,
  recipientName,
  greetingText,
  photos,
  musicUrl,
  orderNumber,
  showBackButton = true,
  customPin,
  customHint,
  customPlaylist,
}: MasterTemplateRendererProps) {
  const props: TemplateProps = {
    recipientName,
    greetingText,
    photos,
    musicUrl,
    orderNumber,
    showBackButton,
    customPin,
    customHint,
    customPlaylist,
  };

  const renderComponent = () => {
    switch (templateId) {
      case 'love-arcade-letter':
        return <LoveArcadeLetter {...props} musicUrl={musicUrl || '/music/can-i-call-u-rose.mp3'} />;

      case 'interactive-2d-wedding':
        return (
          <div className="min-h-screen bg-[#0F0F12] text-white flex flex-col items-center justify-center p-6 text-center">
            <div className="max-w-md bg-stone-900 border border-stone-800 rounded-3xl p-8 space-y-4 shadow-2xl">
              <span className="text-4xl">💍</span>
              <h2 className="text-2xl font-serif font-bold text-amber-200">Plivin Wedding Suite</h2>
              <p className="text-sm text-stone-300">
                Undangan pernikahan interaktif digital dengan personalisasi nama tamu, background music, dan RSVP live.
              </p>
              <Link
                href={`/wedding/raditya-adinda?to=${encodeURIComponent(recipientName || 'Tamu Spesial')}`}
                className="inline-block w-full py-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-sm transition"
              >
                Buka Demo Wedding Full Experience →
              </Link>
            </div>
          </div>
        );

      case 'romantic-neon-poetry':
        return <RomanticNeonPoetry {...props} />;

      case 'polaroid-memory':
        return <PolaroidMemory {...props} />;

      case 'bouquet-of-love':
        return <BouquetOfLove {...props} musicUrl={musicUrl || '/music/can-i-call-u-rose.mp3'} />;

      case 'date-invitation':
        return <DateInvitation {...props} musicUrl={musicUrl || '/music/kasih-putih.mp3'} />;

      case 'safe-and-sound-windah':
        return <WindahGraduation {...props} musicUrl={musicUrl || '/music/windah.mp3'} />;

      case 'foto-kita-blur':
        return <FotoKitaBlur {...props} musicUrl={musicUrl || '/music/foto-kita-blur.mp3'} />;

      case 'kicau-mania-spesial':
        return <KicauMania {...props} musicUrl={musicUrl || '/music/kicau-mania.mp3'} />;

      case 'paper-scrapbook-memory':
        return <PaperScrapbook {...props} musicUrl={musicUrl || '/music/hivi-remaja.mp3'} />;

      case 'golden-wisuda':
        return <GoldenWisuda {...props} musicUrl={musicUrl || '/music/tangga-hebat.mp3'} />;

      case 'interactive-3d-book':
        return <Interactive3DBook {...props} musicUrl={musicUrl || '/music/overjoyed.mp3'} />;

      case 'vintage-camera':
        return <VintageCamera {...props} musicUrl={musicUrl || 'https://www.youtube.com/watch?v=02Jw2b1BMYo'} />;

      case 'love-receipt':
        return <LoveReceipt {...props} musicUrl={musicUrl || 'https://youtu.be/rHvQakk1zMA?si=4AgngRhNJ_onV8St'} />;

      case 'retro-digicam-y2k':
        return <RetroDigicamY2K {...props} musicUrl={musicUrl || 'https://youtu.be/bY4kEuki5hM?si=WRSvMOw-xXwi7Pzq'} />;

      case 'journey-timeline':
        return <JourneyTimeline {...props} musicUrl={musicUrl || 'https://www.youtube.com/watch?v=1MWVotVdHGg'} />;

      case 'classic-academic':
        return <ClassicAcademic {...props} musicUrl={musicUrl || '/music/terbaik-bagimu.mp3'} />;

      case 'maroon-birthday-surprise':
        return <MaroonBirthdaySurprise {...props} musicUrl={musicUrl || '/music/can-i-call-u-rose.mp3'} />;

      case 'blue-gingham-love-note':
        return <BlueGinghamLoveNote {...props} musicUrl={musicUrl || '/music/can-i-call-u-rose.mp3'} />;

      default:
        return (
          <GenericTemplate
            title="Kado Digital Spesial 🎁"
            themeColor="bg-slate-900"
            emoji="🎁"
            {...props}
            musicUrl={musicUrl || '/music/sound.mp3'}
          />
        );
    }
  };

  return (
    <div className="relative w-full h-full min-h-screen flex flex-col flex-1 isolate overflow-x-hidden">
      {renderComponent()}
    </div>
  );
}
