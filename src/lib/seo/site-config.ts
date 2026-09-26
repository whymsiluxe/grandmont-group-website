export const siteConfig = {
  name: "Grandmont Group",
  // REGISTRATION_PENDING: target legal name/form prepared for Impressum/Datenschutz/footer.
  // Official Handelsregister registration of this legal name is NOT yet confirmed —
  // verify against the actual registration before production launch.
  legalName: "Grandmont Group UG (haftungsbeschränkt)",
  legalForm: "Unternehmergesellschaft (haftungsbeschränkt)",
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
  // DOMAIN_COMPAT_PENDING: placeholder — реальный домен Grandmont Group не выбран/не зарегистрирован,
  // заменить перед production-запуском. Staging живёт на grandmont.promonta.fun (намеренно не canonical).
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

export const siteDescriptions = {
  de: "Grandmont Group bietet Montage, Möbelmontage, Küchenmontage und Objektservice in Chemnitz und Umgebung.",
  en: "Grandmont Group provides assembly, furniture assembly, kitchen installation and property services in Chemnitz and the surrounding region.",
} as const;
