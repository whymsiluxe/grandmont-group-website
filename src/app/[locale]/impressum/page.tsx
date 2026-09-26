import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/layout/Container";
import { FadeIn } from "@/components/motion/FadeIn";
import { isLocale, type Locale } from "@/i18n/config";
import { siteConfig } from "@/lib/seo/site-config";

const PLACEHOLDER = "—";

const COPY: Record<
  Locale,
  {
    title: string;
    sub: string;
    sections: { title: string; rows: { label: string; value: string }[] }[];
  }
> = {
  de: {
    title: "Impressum",
    sub: "Angaben gemäß § 5 DDG (Digitale-Dienste-Gesetz).",
    sections: [
      {
        title: "Anbieter",
        rows: [
          { label: "Firma", value: siteConfig.legalName },
          { label: "Rechtsform", value: siteConfig.legalForm },
          { label: "Anschrift", value: PLACEHOLDER },
          { label: "Vertretungsberechtigt", value: PLACEHOLDER },
        ],
      },
      {
        title: "Kontakt",
        rows: [
          { label: "Telefon", value: PLACEHOLDER },
          { label: "E-Mail", value: PLACEHOLDER },
        ],
      },
      {
        title: "Register",
        rows: [
          { label: "Registergericht", value: PLACEHOLDER },
          { label: "Registernummer", value: PLACEHOLDER },
          { label: "Umsatzsteuer-ID (§ 27a UStG)", value: PLACEHOLDER },
        ],
      },
      {
        title: "Streitschlichtung",
        rows: [
          {
            label: "Verbraucherstreitbeilegung (§ 36 VSBG)",
            value:
              "Wir sind nicht verpflichtet und nicht bereit, an einem Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.",
          },
        ],
      },
    ],
  },
  en: {
    title: "Legal notice",
    sub: "Information pursuant to § 5 DDG (German Digital Services Act).",
    sections: [
      {
        title: "Provider",
        rows: [
          { label: "Company", value: siteConfig.legalName },
          { label: "Legal form", value: siteConfig.legalForm },
          { label: "Address", value: PLACEHOLDER },
          { label: "Represented by", value: PLACEHOLDER },
        ],
      },
      {
        title: "Contact",
        rows: [
          { label: "Phone", value: PLACEHOLDER },
          { label: "Email", value: PLACEHOLDER },
        ],
      },
      {
        title: "Register",
        rows: [
          { label: "Register court", value: PLACEHOLDER },
          { label: "Register number", value: PLACEHOLDER },
          { label: "VAT ID (§ 27a UStG)", value: PLACEHOLDER },
        ],
      },
      {
        title: "Dispute resolution",
        rows: [
          {
            label: "Consumer dispute resolution (§ 36 VSBG)",
            value:
              "We are not obliged and not willing to participate in dispute resolution proceedings before a consumer arbitration board.",
          },
        ],
      },
    ],
  },
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return {
    title: COPY[locale].title,
    description: COPY[locale].sub,
    robots: { index: false, follow: false },
    alternates: {
      canonical: `/${locale}/impressum`,
      languages: { de: "/de/impressum", en: "/en/impressum", "x-default": "/de/impressum" },
    },
  };
}

export default async function ImpressumPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const copy = COPY[locale];

  return (
    <main>
      <section className="bg-(--color-bg-primary) py-28 lg:py-40">
        <Container>
          <FadeIn>
            <p className="mb-6 text-xs font-medium tracking-[0.08em] text-(--color-accent) uppercase">
              Grandmont Group
            </p>
            <h1 className="max-w-4xl text-5xl font-light leading-[1.02] text-(--color-text-primary) lg:text-8xl">
              {copy.title}
            </h1>
            <p className="mt-8 max-w-3xl text-base text-(--color-text-muted) lg:text-xl">{copy.sub}</p>
          </FadeIn>
        </Container>
      </section>

      <section className="bg-(--color-bg-light) py-20 text-(--color-text-on-light) lg:py-28">
        <Container>
          <FadeIn>
            <div className="space-y-10">
              {copy.sections.map((section) => (
                <div key={section.title}>
                  <h2 className="mb-4 text-2xl font-light">{section.title}</h2>
                  <dl className="grid gap-px overflow-hidden rounded-lg bg-black/10">
                    {section.rows.map((row) => (
                      <div key={row.label} className="grid gap-1 bg-(--color-bg-light) p-5 sm:grid-cols-[220px_1fr] sm:gap-6">
                        <dt className="text-sm font-medium text-black/50">{row.label}</dt>
                        <dd className="text-sm text-black/70">{row.value}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              ))}
            </div>
          </FadeIn>
        </Container>
      </section>
    </main>
  );
}
