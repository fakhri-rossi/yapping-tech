'use client';

import { useState } from 'react';
import { IPhoneMockup, IPadMockup } from 'react-device-mockup';
import MasterTemplateRenderer from '@components/plivin/templates/MasterTemplateRenderer';
import { TEMPLATE_DATA } from '@config/gifts';

interface PhoneMockupShowcaseProps {
  onSelectTemplate?: (templateTitle: string) => void;
}

export default function PhoneMockupShowcase({ onSelectTemplate }: PhoneMockupShowcaseProps) {
  const featuredIds = [
    'maroon-birthday-surprise',
    'bouquet-of-love',
    'safe-and-sound-windah',
    'date-invitation',
    'kicau-mania-spesial',
    'interactive-3d-book',
    'romantic-neon-poetry',
  ];

  const featuredTemplates = TEMPLATE_DATA.filter((t) => featuredIds.includes(t.id));

  const [activeTemplateId, setActiveTemplateId] = useState(featuredTemplates[0]?.id || 'bouquet-of-love');
  const [deviceFrame, setDeviceFrame] = useState<'mobile' | 'tablet'>('mobile');
  const [refreshKey, setRefreshKey] = useState(0);

  const selectedTemplateData = TEMPLATE_DATA.find((t) => t.id === activeTemplateId) || featuredTemplates[0];

  const handleChooseTemplate = () => {
    if (onSelectTemplate && selectedTemplateData) {
      onSelectTemplate(selectedTemplateData.title);
    }
  };

  return (
    <section id="simulator" className="my-20 scroll-mt-24">
      {/* Header Badge & Title */}
      <div className="text-center mb-10">
        <span className="px-4 py-1.5 bg-black text-white font-extrabold text-xs uppercase tracking-widest rounded-full border-2 border-black inline-block mb-3 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
          📱 Interactive Live Simulator
        </span>
        <h2 className="text-3xl md:text-5xl font-black text-black tracking-tight mb-3">
          Cobain Tampilan Live Template
        </h2>
        <p className="text-slate-600 font-bold text-sm max-w-xl mx-auto">
          Klik pilihan template di bawah ini untuk melihat contoh tampilan responsif secara langsung di dalam simulator smartphone!
        </p>
      </div>

      {/* Template Selector Pills */}
      <div className="flex flex-wrap justify-center gap-2.5 mb-10 max-w-4xl mx-auto px-4">
        {featuredTemplates.map((tpl) => {
          const isActive = tpl.id === activeTemplateId;
          return (
            <button
              key={tpl.id}
              onClick={() => {
                setActiveTemplateId(tpl.id);
                setRefreshKey((k) => k + 1);
              }}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs md:text-sm border-2 border-black transition-all flex items-center gap-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] cursor-pointer ${
                isActive
                  ? 'bg-black text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] -translate-y-1'
                  : 'bg-white text-black hover:bg-slate-100'
              }`}
            >
              <span>{tpl.emoji}</span>
              <span>{tpl.title}</span>
            </button>
          );
        })}
      </div>

      {/* Main Showcase Layout: Device Mockup + Info Side Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center max-w-5xl mx-auto px-4">
        {/* Left Side: React Device Mockup Shell */}
        <div className="lg:col-span-7 flex flex-col items-center">
          {/* View Device & Refresh Control */}
          <div className="flex items-center gap-2 mb-6 bg-white border-2 border-black rounded-xl p-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            <button
              onClick={() => setDeviceFrame('mobile')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-extrabold transition cursor-pointer ${
                deviceFrame === 'mobile' ? 'bg-black text-white' : 'text-black hover:bg-slate-100'
              }`}
            >
              📱 iPhone View
            </button>
            <button
              onClick={() => setDeviceFrame('tablet')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-extrabold transition cursor-pointer ${
                deviceFrame === 'tablet' ? 'bg-black text-white' : 'text-black hover:bg-slate-100'
              }`}
            >
              💻 iPad View
            </button>
            <div className="w-[1px] h-4 bg-black/20" />
            <button
              onClick={() => setRefreshKey((k) => k + 1)}
              className="px-3.5 py-1.5 rounded-lg text-xs font-extrabold text-black hover:bg-slate-100 transition flex items-center gap-1 cursor-pointer"
            >
              🔄 Reset Preview
            </button>
          </div>

          {/* react-device-mockup Container */}
          <div className="relative flex justify-center items-center overflow-x-auto max-w-full drop-shadow-2xl py-2 w-full">
            <div className="transform scale-[0.88] sm:scale-100 origin-center transition-transform">
              {deviceFrame === 'mobile' ? (
                <IPhoneMockup
                  screenWidth={300}
                  screenType="island"
                  frameColor="#0f172a"
                  hideStatusBar
                  hideNavBar
                >
                  <div className="w-full h-[650px] bg-slate-900 overflow-hidden relative">
                    <MasterTemplateRenderer
                      key={`${selectedTemplateData.id}-${refreshKey}`}
                      templateId={selectedTemplateData.id}
                      recipientName="Sayangku"
                      greetingText="Ini adalah contoh ucapan romantis spesial yang kamu buat..."
                      photos={[]}
                      musicUrl={selectedTemplateData.demoUrl || ''}
                      orderNumber="DEMO-PREVIEW"
                      showBackButton={false}
                    />
                  </div>
                </IPhoneMockup>
              ) : (
                <IPadMockup
                  screenWidth={typeof window !== 'undefined' && window.innerWidth < 640 ? 320 : 480}
                  screenType="modern"
                  frameColor="#0f172a"
                  hideStatusBar
                  hideNavBar
                >
                  <div className="w-full h-[640px] bg-slate-900 overflow-hidden relative">
                    <MasterTemplateRenderer
                      key={`${selectedTemplateData.id}-${refreshKey}`}
                      templateId={selectedTemplateData.id}
                      recipientName="Sayangku"
                      greetingText="Ini adalah contoh ucapan romantis spesial yang kamu buat..."
                      photos={[]}
                      musicUrl={selectedTemplateData.demoUrl || ''}
                      orderNumber="DEMO-PREVIEW"
                      showBackButton={false}
                    />
                  </div>
                </IPadMockup>
              )}
            </div>
          </div>
        </div>

        {/* Right Side: Selected Template Details & Order CTA */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white border-4 border-black rounded-3xl p-6 md:p-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] space-y-5">
            <div className="flex items-center justify-between">
              <span className="text-4xl p-3 bg-slate-100 rounded-2xl border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                {selectedTemplateData.emoji}
              </span>
              <span className="px-3 py-1 bg-pink-100 text-pink-700 font-extrabold text-xs rounded-full border-2 border-black">
                {selectedTemplateData.category}
              </span>
            </div>

            <div>
              <h3 className="text-2xl font-black text-black mb-2">{selectedTemplateData.title}</h3>
              <p className="text-slate-600 text-xs font-semibold leading-relaxed">
                {selectedTemplateData.description}
              </p>
            </div>

            <div className="border-t-2 border-black pt-4 space-y-2">
              <div className="flex justify-between items-center text-xs font-bold text-slate-700">
                <span>📸 Kebutuhan Foto:</span>
                <span className="font-extrabold text-black">
                  {selectedTemplateData.photosRequired > 0
                    ? `${selectedTemplateData.photosRequired} Foto Utama`
                    : 'Bebas Foto (Teks Focused)'}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs font-bold text-slate-700">
                <span>🎵 Musik Backsound:</span>
                <span className="font-extrabold text-black">YouTube / MP3 Custom</span>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={handleChooseTemplate}
                className="w-full py-4 bg-black hover:bg-slate-800 text-white font-extrabold text-xs uppercase tracking-wider rounded-2xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>✨ Pakai Template Ini</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
