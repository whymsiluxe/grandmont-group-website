import { isLocale } from "@/i18n/config";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/JsonLd";
import { faqSchema, localBusinessSchema, organizationSchema } from "@/lib/seo/structured-data";
import { Hero, type HeroImage } from "@/components/home/Hero";
import { TrustStrip } from "@/components/home/TrustStrip";
import { ServicesGrid } from "@/components/home/ServicesGrid";
import { FeaturedProject } from "@/components/home/FeaturedProject";
import { Advantages } from "@/components/home/Advantages";
import { listApprovedServices, listPublishedProjects } from "@/lib/cms/content-source";
import { ProjectGallery } from "@/components/home/ProjectGallery";
import { getProjectService } from "@/lib/projects/projects";
import { Process } from "@/components/home/Process";
import { FAQ, homeFaqItems } from "@/components/home/FAQ";
import { ContactCTA } from "@/components/home/ContactCTA";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const [services, projects] = await Promise.all([listApprovedServices(), listPublishedProjects()]);
  const [featuredProject, ...remainingProjects] = projects;

  // The hero image slot is wired to the same featured project the page
  // spotlights lower down, so it becomes real photography the moment one
  // exists — no separate "hero image" content type to manage, and no
  // fabricated placeholder in the meantime (falls back to the existing
  // abstract scene, per Hero.tsx).
  let heroImage: HeroImage | undefined;
  if (featuredProject) {
    const cover = featuredProject.media.find((item) => item.kind === "cover") ?? featuredProject.media[0];
    if (cover) {
      const service = getProjectService(featuredProject);
      heroImage = {
        src: cover.src,
        alt: cover.alt[locale],
        meta: [featuredProject.location, service?.title[locale]].filter(Boolean).join(" — "),
      };
    }
  }

  return (
    <main>
      <JsonLd data={localBusinessSchema()} />
      <JsonLd data={organizationSchema()} />
      <JsonLd data={faqSchema(homeFaqItems[locale].map((item) => ({ question: item.q, answer: item.a })))} />

      <Hero locale={locale} image={heroImage} />
      <TrustStrip locale={locale} />
      <ServicesGrid locale={locale} services={services} />
      {featuredProject ? <FeaturedProject locale={locale} project={featuredProject} /> : null}
      <Advantages locale={locale} />
      <ProjectGallery locale={locale} projects={remainingProjects} />
      <Process locale={locale} />
      <FAQ locale={locale} />
      <ContactCTA locale={locale} services={services} />
    </main>
  );
}
