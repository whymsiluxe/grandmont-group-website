import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/JsonLd";
import { Container } from "@/components/layout/Container";
import { FadeIn } from "@/components/motion/FadeIn";
import { isLocale, locales, type Locale } from "@/i18n/config";
import { getArticleService } from "@/lib/articles/articles";
import { findPublishedArticle, listPublishedArticles } from "@/lib/cms/content-source";
import { articleSchema, breadcrumbSchema } from "@/lib/seo/structured-data";
import { siteConfig } from "@/lib/seo/site-config";

const COPY: Record<
  Locale,
  {
    back: string;
    service: string;
    ctaTitle: string;
    cta: string;
  }
> = {
  de: {
    back: "Alle Ratgeber",
    service: "Passende Leistung",
    ctaTitle: "Direkt ein Angebot anfragen?",
    cta: "Anfrage senden",
  },
  en: {
    back: "All guides",
    service: "Related service",
    ctaTitle: "Want to request a quote?",
    cta: "Send request",
  },
};

export async function generateStaticParams() {
  const articles = await listPublishedArticles();
  return locales.flatMap((locale) => articles.map((article) => ({ locale, slug: article.slug })));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};
  const article = await findPublishedArticle(slug);
  if (!article) return {};

  return {
    title: article.title[locale],
    description: article.description[locale],
    alternates: {
      canonical: `/${locale}/ratgeber/${article.slug}`,
      languages: {
        de: `/de/ratgeber/${article.slug}`,
        en: `/en/ratgeber/${article.slug}`,
        "x-default": `/de/ratgeber/${article.slug}`,
      },
    },
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();

  const article = await findPublishedArticle(slug);
  if (!article) notFound();

  const copy = COPY[locale];
  const service = getArticleService(article);
  const url = `${siteConfig.url}/${locale}/ratgeber/${article.slug}`;

  return (
    <main>
      <JsonLd
        data={articleSchema({
          headline: article.title[locale],
          description: article.description[locale],
          url,
          datePublished: article.publishedAt,
          dateModified: article.updatedAt,
        })}
      />
      <JsonLd
        data={breadcrumbSchema([
          { name: siteConfig.name, url: siteConfig.url },
          { name: copy.back, url: `${siteConfig.url}/${locale}/ratgeber` },
          { name: article.title[locale], url },
        ])}
      />

      <section className="bg-(--color-bg-primary) py-24 text-(--color-text-primary) lg:py-36">
        <Container>
          <FadeIn>
            <Link href={`/${locale}/ratgeber`} className="text-sm font-medium text-(--color-accent)">
              ← {copy.back}
            </Link>
            <h1 className="mt-10 max-w-5xl text-5xl font-light leading-[1.02] lg:text-8xl">
              {article.title[locale]}
            </h1>
            <p className="mt-8 max-w-3xl text-base leading-7 text-(--color-text-muted) lg:text-xl">
              {article.description[locale]}
            </p>
          </FadeIn>
        </Container>
      </section>

      <section className="bg-(--color-bg-light) py-20 text-(--color-text-on-light) lg:py-28">
        <Container>
          <FadeIn>
            <div className="grid gap-6 lg:grid-cols-[0.75fr_1.25fr]">
              <aside className="rounded-lg border border-black/10 bg-white p-6">
                <dl className="space-y-4">
                  {service ? (
                    <div>
                      <dt className="text-xs font-medium tracking-[0.08em] text-black/40 uppercase">
                        {copy.service}
                      </dt>
                      <dd className="mt-2">
                        <Link
                          href={`/${locale}/leistungen/${service.slug}`}
                          className="text-lg text-(--color-accent)"
                        >
                          {service.title[locale]}
                        </Link>
                      </dd>
                    </div>
                  ) : null}
                </dl>
              </aside>

              <article className="rounded-lg border border-black/10 bg-white p-8 lg:p-10">
                <div className="space-y-6">
                  {/* Payload's ratgeber.body is a single Lexical richText blob with no
                      heading/body structure — each entry here is one flattened block of
                      the document (see lib/cms/lexical-to-paragraphs.ts), not a titled
                      section, so there's no stable heading text to key on; index is
                      stable because this list is only ever rendered once per page. */}
                  {article.paragraphs[locale].map((paragraph, index) => (
                    <p key={index} className="text-base leading-8 text-black/65">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </article>
            </div>
          </FadeIn>

          <FadeIn delay={0.15}>
            <div className="mt-16 rounded-lg bg-(--color-bg-primary) p-8 text-(--color-text-primary) lg:p-10">
              <h2 className="text-3xl font-light">{copy.ctaTitle}</h2>
              <Link
                href={`/${locale}/kontakt${article.serviceSlug ? `?service=${article.serviceSlug}` : ""}`}
                className="mt-8 inline-flex rounded-full bg-(--color-accent) px-8 py-4 text-sm font-medium text-(--color-bg-primary) transition-transform hover:scale-[1.03]"
              >
                {copy.cta}
              </Link>
            </div>
          </FadeIn>
        </Container>
      </section>
    </main>
  );
}
