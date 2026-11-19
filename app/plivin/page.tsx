import type { Metadata } from "next";
import { PlivinNavbar } from "@components/plivin/PlivinNavbar";
import { PlivinHero } from "@components/plivin/PlivinHero";
import { PlivinWeddingSuiteSection } from "@components/plivin/PlivinWeddingSuiteSection";
import { PlivinPricingSection } from "@components/plivin/PlivinPricingSection";
import { PlivinFaqSection } from "@components/plivin/PlivinFaqSection";
import { PlivinFooter } from "@components/plivin/PlivinFooter";

export const metadata: Metadata = {
  title: "Plivin — Haute-Couture Digital Wedding Suite & Moments",
  description:
    "Platform undangan pernikahan digital sinematik dan digital gifting suite eksklusif dari Plivin. Desain editorial haute-couture, opening cover personal nama tamu, pemutar musik vinyl, dan 0% potongan hadiah langsung ke rekening pengantin.",
  icons: {
    icon: [
      { url: "/favicon-plivin.svg", type: "image/svg+xml" },
      { url: "/favicon-plivin.png", type: "image/png" },
    ],
    apple: [
      { url: "/favicon-plivin.png" },
    ],
  },
  openGraph: {
    title: "Plivin — Haute-Couture Digital Wedding Suite",
    description:
      "Undangan pernikahan digital sinematik & berkelas. Preview template interaktif dengan cover personal per tamu.",
    type: "website",
  },
};

export default function PlivinLandingPage() {
  return (
    <div className="relative min-h-screen bg-[#FAF8F5] text-stone-900 selection:bg-stone-900 selection:text-white font-sans overflow-x-hidden">
      {/* Floating Navbar */}
      <PlivinNavbar />

      {/* Hero Section */}
      <PlivinHero />

      {/* Wedding Suite Showcase */}
      <PlivinWeddingSuiteSection />

      {/* Pricing & Packages */}
      <PlivinPricingSection />

      {/* FAQ */}
      <PlivinFaqSection />

      {/* Footer */}
      <PlivinFooter />
    </div>
  );
}
