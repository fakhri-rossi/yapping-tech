'use client';

import { useState, useCallback, useEffect } from 'react';
import SplashScreen from '@components/plivin/landing/SplashScreen';
import Navbar from '@components/plivin/landing/Navbar';
import HeroSection from '@components/plivin/landing/HeroSection';
import ScanExperienceSection from '@components/plivin/landing/ScanExperienceSection';
import FeaturedTemplates from '@components/plivin/landing/FeaturedTemplates';
import OrderForm from '@components/plivin/landing/OrderForm';
import Footer from '@components/plivin/landing/Footer';
import FloatingWhatsAppButton from '@components/plivin/common/FloatingWhatsAppButton';
import ScrollReveal from '@components/plivin/landing/ScrollReveal';
import { LanguageProvider } from '@context/LanguageContext';

function DigitalGiftLandingContent() {
  const [preselectedTemplate, setPreselectedTemplate] = useState('');

  // Check URL query param for template (e.g. redirected from /katalog or banner)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const templateFromUrl = urlParams.get('template');
      if (templateFromUrl) {
        setPreselectedTemplate(templateFromUrl);
        setTimeout(() => {
          document.getElementById('orderSection')?.scrollIntoView({ behavior: 'smooth' });
        }, 300);
      }
    }
  }, []);

  const handleSelectTemplate = useCallback((templateTitle: string) => {
    setPreselectedTemplate(templateTitle);
    setTimeout(() => {
      document.getElementById('orderSection')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  }, []);

  return (
    <div className="min-h-screen bg-white text-black plivin-root font-montserrat overflow-x-hidden">
      <SplashScreen />
      <Navbar />

      {/* SECTION 1: HERO (Gradient Pink/Rose Soft Background) */}
      <section className="bg-gradient-to-b from-rose-100/60 via-pink-50/40 to-white border-b-2 border-black/10">
        <HeroSection />
      </section>

      {/* SECTION 2: FEATURED GIFT SPOTLIGHT (Clean White Background) */}
      <section className="bg-white py-16 md:py-20 border-b-2 border-black/10">
        <div className="container mx-auto px-4 md:px-6 max-w-6xl">
          <ScrollReveal>
            <FeaturedTemplates onSelectTemplate={handleSelectTemplate} />
          </ScrollReveal>
        </div>
      </section>

      {/* SECTION 3: SCAN QR EXPERIENCE SHOWCASE (Clean Light Gradient Background) */}
      <section id="pengalaman-scan" className="bg-gradient-to-b from-pink-50/70 via-rose-50/40 to-white py-16 md:py-20 border-b-2 border-black/10">
        <div className="container mx-auto px-4 md:px-6 max-w-6xl">
          <ScrollReveal>
            <ScanExperienceSection onSelectTemplate={handleSelectTemplate} />
          </ScrollReveal>
        </div>
      </section>

      {/* SECTION 4: FORMULIR PESANAN (High Contrast Dark Luxury Section Background) */}
      <section id="orderSection" className="bg-gradient-to-b from-slate-950 via-slate-900 to-black py-20 md:py-24 text-white scroll-mt-20">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <ScrollReveal>
            <OrderForm preselectedTemplate={preselectedTemplate} />
          </ScrollReveal>
        </div>
      </section>

      <Footer />
      <FloatingWhatsAppButton />
    </div>
  );
}

export default function DigitalGiftLanding() {
  return (
    <LanguageProvider>
      <DigitalGiftLandingContent />
    </LanguageProvider>
  );
}
