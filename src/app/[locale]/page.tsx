import { isLocale } from "@/i18n/config";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/JsonLd";
import { faqSchema, localBusinessSchema, organizationSchema } from "@/lib/seo/structured-data";
import { Hero } from "@/components/home/Hero";
import { ServiceStory } from "@/components/home/ServiceStory";
import { Advantages } from "@/components/home/Advantages";
import { listApprovedServices } from "@/lib/cms/content-source";
import { Work } from "@/components/home/Work";
import { Process } from "@/components/home/Process";
import { ServiceArea } from "@/components/home/ServiceArea";
import { FAQ, homeFaqItems } from "@/components/home/FAQ";
import { ContactCTA } from "@/components/home/ContactCTA";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const approvedServices = await listApprovedServices();
  const storyServices = approvedServices.slice(0, 4);

  return (
    <main>
      <JsonLd data={localBusinessSchema()} />
      <JsonLd data={organizationSchema()} />
      <JsonLd data={faqSchema(homeFaqItems[locale].map((item) => ({ question: item.q, answer: item.a })))} />
      <Hero locale={locale} />
      <ServiceStory locale={locale} services={storyServices} />
      <Advantages locale={locale} />
      <Work locale={locale} />
      <Process locale={locale} />
      <ServiceArea locale={locale} />
      <FAQ locale={locale} />
      <ContactCTA locale={locale} />
    </main>
  );
}
