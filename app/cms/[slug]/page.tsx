import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { NICHES, NICHE_MAP } from "@/config/niches";
import { getManagementSystemTitle } from "@/lib/cms";
import { ShowcaseProvider } from "@/context/ShowcaseContext";
import { CmsWorkspace } from "@/components/cms/CmsWorkspace";
import type { NicheId } from "@/types/landing";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  return NICHES.map((niche) => ({
    slug: niche.id,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const niche = NICHE_MAP[slug as NicheId];

  if (!niche) {
    return {
      title: "CMS Not Found — Yapping Techflow",
    };
  }

  const systemTitle = getManagementSystemTitle(niche.brand);
  return {
    title: `${systemTitle} — Live CMS Dashboard | Yapping Techflow`,
    description: `Kelola katalog produk, harga, banner promo, dan WhatsApp ${niche.brand} secara instan dengan Live Preview melalui ${systemTitle}.`,
    icons: {
      icon: [
        { url: `/favicon-${slug}.png`, type: "image/png" },
        { url: `/favicon-${slug}.svg`, type: "image/svg+xml" },
        { url: niche.logo || `/favicon-${slug}.png` },
      ],
      apple: [
        { url: `/favicon-${slug}.png` },
      ],
    },
  };
}

export default async function CmsBySlugPage({ params }: PageProps) {
  const { slug } = await params;
  const niche = NICHE_MAP[slug as NicheId];

  if (!niche) {
    notFound();
  }

  return (
    <ShowcaseProvider initialNiche={slug as NicheId} basePath="/cms">
      <CmsWorkspace />
    </ShowcaseProvider>
  );
}

