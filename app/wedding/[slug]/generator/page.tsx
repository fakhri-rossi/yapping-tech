import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getWeddingConfig } from "@config/wedding";
import { WeddingGuestLinkGenerator } from "@components/templates/wedding/WeddingGuestLinkGenerator";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const config = getWeddingConfig(slug);

  if (!config) {
    return { title: "Generator Tidak Ditemukan — Plivin" };
  }

  return {
    title: `Generator Link Undangan — ${config.groom.name} & ${config.bride.name}`,
    description: `Alat buat link undangan personal dan template chat WhatsApp per tamu.`,
  };
}

export default async function WeddingGeneratorPage({ params }: PageProps) {
  const { slug } = await params;
  const config = getWeddingConfig(slug);

  if (!config) notFound();

  return <WeddingGuestLinkGenerator config={config} />;
}
