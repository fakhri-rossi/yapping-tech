import { notFound } from 'next/navigation';
import { DEMO_DATA } from '@config/gifts';
import MasterTemplateRenderer from '@components/plivin/templates/MasterTemplateRenderer';
import type { Metadata } from 'next';

interface PageProps {
  params: Promise<{ templateId: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { templateId } = await params;
  const demo = DEMO_DATA[templateId];
  if (!demo) return { title: 'Demo Not Found — plivin.co' };

  return {
    title: `Demo: ${demo.title} — plivin.co`,
    description: `Preview demo template ${demo.title} kado digital estetik`,
  };
}

export default async function PlivinDemoPage({ params }: PageProps) {
  const { templateId } = await params;
  const demo = DEMO_DATA[templateId];

  if (!demo) {
    notFound();
  }

  return (
    <main className="w-full min-h-screen bg-black">
      <MasterTemplateRenderer
        templateId={demo.id}
        recipientName={demo.recipientName}
        greetingText={demo.greetingText}
        photos={demo.photos}
        musicUrl={demo.musicUrl}
        orderNumber={demo.orderNumber}
        showBackButton={true}
      />
    </main>
  );
}
