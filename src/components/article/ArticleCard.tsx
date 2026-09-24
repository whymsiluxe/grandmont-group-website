import Link from "next/link";
import type { Locale } from "@/i18n/config";
import { getArticleService, type Article } from "@/lib/articles/articles";

export function ArticleCard({ article, locale }: { article: Article; locale: Locale }) {
  const service = getArticleService(article);

  return (
    <article className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
      {service ? (
        <div className="flex flex-wrap gap-2 text-xs text-black/50">
          <span className="rounded-full bg-black/[0.04] px-3 py-1">{service.title[locale]}</span>
        </div>
      ) : null}
      <h2 className="mt-5 text-2xl font-light text-black">{article.title[locale]}</h2>
      <p className="mt-4 text-sm leading-6 text-black/60">{article.description[locale]}</p>
      <Link
        href={`/${locale}/ratgeber/${article.slug}`}
        className="mt-6 inline-flex text-sm font-medium text-(--color-accent)"
      >
        {locale === "de" ? "Artikel lesen" : "Read article"} →
      </Link>
    </article>
  );
}
