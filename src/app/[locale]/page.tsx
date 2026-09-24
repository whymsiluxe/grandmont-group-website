import { isLocale } from "@/i18n/config";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/JsonLd";
import { localBusinessSchema } from "@/lib/seo/structured-data";
import { Hero } from "@/components/home/Hero";
import { Services } from "@/components/home/Services";
import { Advantages } from "@/components/home/Advantages";
import { Work } from "@/components/home/Work";
import { Process } from "@/components/home/Process";
import { ServiceArea } from "@/components/home/ServiceArea";
import { Testimonials } from "@/components/home/Testimonials";
import { FAQ } from "@/components/home/FAQ";
import { ContactCTA } from "@/components/home/ContactCTA";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  return (
    <main>
      <JsonLd data={localBusinessSchema()} />
      <Hero locale={locale} />
      <Services locale={locale} />
      <Advantages locale={locale} />
      <Work locale={locale} />
      <Process locale={locale} />
      <ServiceArea locale={locale} />
      <Testimonials locale={locale} />
      <FAQ locale={locale} />
      <ContactCTA locale={locale} />
    </main>
  );
}
