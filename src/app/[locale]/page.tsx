import { isLocale } from "@/i18n/config";
import { notFound } from "next/navigation";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  return (
    <main className="flex-1 flex items-center justify-center p-8">
      <p className="text-sm text-neutral-500">
        Promonta — foundation scaffold ({locale}). Homepage: Phase 2.
      </p>
    </main>
  );
}
