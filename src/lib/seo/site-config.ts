export const siteConfig = {
  name: "Grandmont Group",
  legalName: "Grandmont Group UG",
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
  whatsapp: "",
  email: "",
  // placeholder — реальный домен не зарегистрирован, заменить перед деплоем
  url: "https://grandmont-group.de",
} as const;

export const titleTemplates = {
  de: {
    template: "%s | Grandmont Group",
    default: "Grandmont Group — Montage & Handwerksleistungen in Chemnitz",
  },
  en: {
    template: "%s | Grandmont Group",
    default: "Grandmont Group — Assembly & Craft Services in Chemnitz, Germany",
  },
} as const;
