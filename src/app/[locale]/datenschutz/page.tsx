import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/layout/Container";
import { FadeIn } from "@/components/motion/FadeIn";
import { isLocale, type Locale } from "@/i18n/config";
import { siteConfig } from "@/lib/seo/site-config";

const COPY: Record<
  Locale,
  { title: string; sub: string; sections: { title: string; body: string[] }[] }
> = {
  de: {
    title: "Datenschutz",
    sub: "Informationen gemäß Art. 13 DSGVO zur Verarbeitung personenbezogener Daten auf dieser Website.",
    sections: [
      {
        title: "Verantwortlicher",
        body: [`${siteConfig.legalName}. Vollständige Kontaktdaten siehe Impressum.`],
      },
      {
        title: "Kontakt-/Angebotsformular",
        body: [
          "Wenn Sie über das Formular eine Anfrage stellen, verarbeiten wir die von Ihnen eingegebenen Daten: Kontaktangabe (Telefon oder E-Mail), Postleitzahl/Ort, gewünschte Leistung, Freitextbeschreibung sowie mindestens ein hochgeladenes Foto (bis zu 10 Fotos).",
          "Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO (vorvertragliche Maßnahme auf Ihre Anfrage hin).",
          "Hochgeladene Fotos werden serverseitig neu kodiert; dabei werden Metadaten (u. a. EXIF/GPS-Standortdaten) entfernt. Die Dateien werden nicht öffentlich zugänglich abgelegt, sondern in einem privaten Speicherbereich mit eingeschränkten Zugriffsrechten.",
          "Anfragedaten werden für die Dauer der Bearbeitung sowie eine Aufbewahrungsfrist von 90 Tagen gespeichert und danach automatisiert gelöscht, sofern keine gesetzliche Aufbewahrungspflicht entgegensteht.",
          "Zur internen Benachrichtigung über neue Anfragen kann eine Übermittlung an einen Messenger-Dienst (Telegram) erfolgen. Es werden dabei nur die von Ihnen im Formular angegebenen Daten übertragen.",
        ],
      },
      {
        title: "Hosting",
        body: [
          "Diese Website wird auf einem selbst verwalteten Server (VPS) innerhalb der EU betrieben. Es findet keine Übermittlung von Formulardaten an Drittanbieter-Hosting statt.",
        ],
      },
      {
        title: "Cookies & Tracking",
        body: [
          "Diese Website setzt aktuell keine Analyse- oder Marketing-Cookies ein. Technisch notwendige Session-Mechanismen (z. B. Formularschutz) können eingesetzt werden. Sollte künftig Analyse-/Werbe-Tracking hinzukommen, wird vorab eine Consent-Lösung eingebunden und diese Erklärung entsprechend aktualisiert.",
        ],
      },
      {
        title: "Ihre Rechte",
        body: [
          "Sie haben das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung der Verarbeitung, Datenübertragbarkeit und Widerspruch gegen die Verarbeitung Ihrer personenbezogenen Daten sowie das Recht auf Beschwerde bei einer Aufsichtsbehörde.",
        ],
      },
    ],
  },
  en: {
    title: "Privacy policy",
    sub: "Information pursuant to Art. 13 GDPR on the processing of personal data on this website.",
    sections: [
      {
        title: "Controller",
        body: [`${siteConfig.legalName}. Full contact details in the legal notice (Impressum).`],
      },
      {
        title: "Contact / quote request form",
        body: [
          "When you submit a request via the form, we process the data you provide: contact detail (phone or email), postcode/location, requested service, free-text description, and at least one uploaded photo (up to 10 photos).",
          "The legal basis is Art. 6(1)(b) GDPR (pre-contractual measures taken at your request).",
          "Uploaded photos are re-encoded server-side, which strips metadata (including EXIF/GPS location data). Files are not stored in a publicly accessible location, but in a private storage area with restricted access.",
          "Request data is retained for the duration of processing plus a 90-day retention period, after which it is automatically deleted unless a legal retention obligation applies.",
          "For internal notification of new requests, data may be forwarded to a messaging service (Telegram). Only the data you provided in the form is transmitted.",
        ],
      },
      {
        title: "Hosting",
        body: [
          "This website runs on a self-managed server (VPS) within the EU. Form data is not transmitted to third-party hosting providers.",
        ],
      },
      {
        title: "Cookies & tracking",
        body: [
          "This website currently does not use analytics or marketing cookies. Technically necessary session mechanisms (e.g. form protection) may be used. Should analytics/advertising tracking be added in the future, a consent solution will be implemented beforehand and this policy updated accordingly.",
        ],
      },
      {
        title: "Your rights",
        body: [
          "You have the right to access, rectify, erase, restrict processing of, port your data, and object to the processing of your personal data, as well as the right to lodge a complaint with a supervisory authority.",
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
      canonical: `/${locale}/datenschutz`,
      languages: { de: "/de/datenschutz", en: "/en/datenschutz", "x-default": "/de/datenschutz" },
    },
  };
}

export default async function DatenschutzPage({ params }: { params: Promise<{ locale: string }> }) {
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
                <div key={section.title} className="max-w-3xl">
                  <h2 className="mb-3 text-2xl font-light">{section.title}</h2>
                  {section.body.map((paragraph) => (
                    <p key={paragraph.slice(0, 40)} className="mb-3 text-sm text-black/70 last:mb-0">
                      {paragraph}
                    </p>
                  ))}
                </div>
              ))}
            </div>
          </FadeIn>
        </Container>
      </section>
    </main>
  );
}
