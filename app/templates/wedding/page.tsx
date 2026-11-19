import { redirect } from "next/navigation";

export default async function TemplatesWeddingRedirectPage({
  searchParams,
}: {
  searchParams?: Promise<{ to?: string }>;
}) {
  const resolved = searchParams ? await searchParams : undefined;
  const toQuery = resolved?.to ? `?to=${encodeURIComponent(resolved.to)}` : "";
  redirect(`/wedding/raditya-adinda${toQuery}`);
}
