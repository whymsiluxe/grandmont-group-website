export const siteConfig = {
  name: "Promonta",
  legalName: "Promonta",
  defaultLocale: "de" as const,
  locales: ["de", "en"] as const,
  city: "Chemnitz",
  region: "Sachsen",
  country: "DE",
  serviceArea: [
    "Chemnitz",
    "Limbach-Oberfrohna",
    "Frankenberg",
    "Zschopau",
    "Mittweida",
    "Burgstädt",
    "Annaberg-Buchholz",
    "Freiberg",
  ],
  // placeholder — canonical phone TBD, see SEO_PLAN.md FINDING (multiple numbers on old site)
  phone: "",
  email: "",
  url: "https://promonta-bau.de",
} as const;

export const titleTemplates = {
  de: {
    template: "%s | Promonta",
    default: "Promonta — Montage & Handwerksleistungen in Chemnitz",
  },
  en: {
    template: "%s | Promonta",
    default: "Promonta — Assembly & Craft Services in Chemnitz, Germany",
  },
} as const;
