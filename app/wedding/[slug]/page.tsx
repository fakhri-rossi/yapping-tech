import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { WEDDING_TEMPLATES, getWeddingConfig } from "@config/wedding";
import { WeddingExperience } from "@components/experiences/WeddingExperience";

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{ to?: string }>;
}

export function generateStaticParams() {
  return Object.keys(WEDDING_TEMPLATES).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const config = getWeddingConfig(slug);

  if (!config) {
    return { title: "Undangan Tidak Ditemukan — Plivin" };
  }

  return {
    title: `The Wedding of ${config.groom.name} & ${config.bride.name}`,
    description: `Undangan pernikahan digital ${config.groom.fullName} & ${config.bride.fullName}. Powered by Plivin.co`,
    openGraph: {
      title: `${config.groom.name} & ${config.bride.name} — Wedding Invitation`,
      description: `Anda diundang untuk merayakan pernikahan ${config.groom.name} & ${config.bride.name}.`,
      type: "website",
    },
  };
}

export default async function WeddingPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const guestName = resolvedSearchParams?.to?.replace(/\+/g, " ") || "";

  const config = getWeddingConfig(slug);
  if (!config) notFound();

  return <WeddingExperience config={config} guestName={guestName} />;
}
