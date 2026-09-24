import type { Locale } from "@/i18n/config";

export type ServiceGroupId = "montage" | "objektservice";

export type ApprovedService = {
  slug: string;
  updatedAt?: string;
  group: ServiceGroupId;
  eyebrow: Record<Locale, string>;
  title: Record<Locale, string>;
  statement: Record<Locale, string>;
  included: Record<Locale, string[]>;
  scopeNote: Record<Locale, string>;
  forWhom: Record<Locale, string[]>;
  outcomes: Record<Locale, string[]>;
  pricing: Record<Locale, string>;
  faq: Record<Locale, { question: string; answer: string }[]>;
};

export const serviceGroups: Record<
  ServiceGroupId,
  { label: Record<Locale, string>; description: Record<Locale, string> }
> = {
  montage: {
    label: { de: "Montage", en: "Assembly" },
    description: {
      de: "Saubere Montagearbeiten mit klar begrenztem, rechtlich geprüftem Leistungsumfang.",
      en: "Clean assembly work with a clearly scoped, legally checked service range.",
    },
  },
  objektservice: {
    label: { de: "Objektservice", en: "Property Services" },
    description: {
      de: "Unterstützung rund um Wohnung, Objekt, Umzug, Räumung und Reinigung.",
      en: "Support for apartments, properties, moving, clearance and cleaning.",
    },
  },
};

export const approvedServices: ApprovedService[] = [
  {
    slug: "kuechenmontage",
    group: "montage",
    eyebrow: { de: "Montage — Chemnitz", en: "Assembly — Chemnitz" },
    title: { de: "Küchenmontage", en: "Kitchen Assembly" },
    statement: {
      de: "Wir montieren Küchenmöbel, richten Elemente sauber aus und bereiten die Küche strukturiert für die Übergabe vor — ohne Elektro-, Wasser- oder Gasanschlüsse.",
      en: "We assemble kitchen furniture, align units cleanly and prepare the kitchen for handover — without electrical, water or gas connections.",
    },
    included: {
      de: ["Montage fertiger Küchenelemente", "Ausrichtung von Schränken und Fronten", "Befestigung nach Absprache", "Saubere Übergabe"],
      en: ["Assembly of ready-made kitchen units", "Alignment of cabinets and fronts", "Fixing by agreement", "Clean handover"],
    },
    scopeNote: {
      de: "Wichtig: Keine Elektro-, Wasser- oder Gasanschlüsse. Diese Arbeiten müssen durch qualifizierte Fachbetriebe erfolgen.",
      en: "Important: no electrical, water or gas connections. These works must be handled by qualified specialists.",
    },
    forWhom: {
      de: ["Privatkunden", "Vermieter", "Küchenstudios", "Hausverwaltungen"],
      en: ["Private clients", "Landlords", "Kitchen studios", "Property managers"],
    },
    outcomes: {
      de: ["Klare Abstimmung", "Strukturierter Aufbau", "Professionelles Werkzeug", "Rechnung"],
      en: ["Clear coordination", "Structured assembly", "Professional tools", "Invoice"],
    },
    pricing: {
      de: "Der Preis richtet sich nach Küchenumfang, Anzahl der Elemente, Zugänglichkeit und Aufwand vor Ort. Nach Fotos und Beschreibung erhalten Sie ein transparentes Angebot.",
      en: "Pricing depends on kitchen scope, number of units, access and on-site effort. After photos and a short description, you receive a transparent quote.",
    },
    faq: {
      de: [
        { question: "Schließen Sie Herd, Spüle oder Geräte an?", answer: "Nein. Anschlüsse für Strom, Wasser oder Gas sind nicht Teil dieser Leistung." },
        { question: "Kann ich Fotos vorab senden?", answer: "Ja, Fotos helfen uns, Umfang und Aufwand realistisch einzuschätzen." },
        { question: "Montieren Sie auch einzelne Küchenschränke?", answer: "Ja, auch einzelne Elemente oder Ergänzungen sind möglich." },
      ],
      en: [
        { question: "Do you connect stoves, sinks or appliances?", answer: "No. Electrical, water or gas connections are not part of this service." },
        { question: "Can I send photos in advance?", answer: "Yes, photos help us estimate scope and effort realistically." },
        { question: "Do you assemble single kitchen cabinets?", answer: "Yes, individual units or additions are possible." },
      ],
    },
  },
  {
    slug: "moebelmontage",
    group: "montage",
    eyebrow: { de: "Montage — Chemnitz", en: "Assembly — Chemnitz" },
    title: { de: "Möbelmontage", en: "Furniture Assembly" },
    statement: {
      de: "Wir montieren Ihre Möbel schnell, sauber und ohne Kopfschmerzen — vom Kleiderschrank bis zur kompletten Zimmereinrichtung, für Privat- und Gewerbekunden in Chemnitz.",
      en: "We assemble your furniture quickly, cleanly and without the hassle — from a single wardrobe to a full room setup, for private and business clients in Chemnitz.",
    },
    included: {
      de: ["Aufbau von Möbeln aus fertigen Bausätzen", "Ausrichtung und Befestigung", "Kleinere Anpassungen im Rahmen des Aufbaus", "Entsorgung von Verpackungsmaterial"],
      en: ["Assembly of furniture from ready-made kits", "Alignment and fixing", "Minor adjustments as part of assembly", "Disposal of packaging material"],
    },
    scopeNote: {
      de: "Wichtig: Wir montieren fertige Möbel — keine Tischlerarbeiten oder Möbelherstellung.",
      en: "Important: we assemble ready-made furniture — not custom carpentry or furniture manufacturing.",
    },
    forWhom: {
      de: ["Privatkunden", "Vermieter", "Hausverwaltungen", "Unternehmen", "Möbelhäuser", "Küchenstudios"],
      en: ["Private clients", "Landlords", "Property managers", "Businesses", "Furniture stores", "Kitchen studios"],
    },
    outcomes: {
      de: ["Klare Kommunikation", "Saubere Ausführung", "Abgestimmte Termine", "Professionelle Werkzeuge", "Saubere Übergabe", "Rechnung"],
      en: ["Clear communication", "Clean execution", "Agreed schedules", "Professional tools", "Tidy handover", "Invoice"],
    },
    pricing: {
      de: "Der Preis richtet sich nach Umfang, Anzahl der Möbelstücke und Aufwand vor Ort. Nach Ihrer Anfrage erhalten Sie ein transparentes Angebot, bevor wir starten.",
      en: "The price depends on scope, number of items and on-site effort. After your request, you receive a transparent quote before we start.",
    },
    faq: {
      de: [
        { question: "Montieren Sie auch Küchen?", answer: "Küchenmontage ist eine eigene Leistung — ohne Elektro-, Wasser- oder Gasanschlüsse." },
        { question: "Muss ich beim Aufbau anwesend sein?", answer: "Nicht zwingend, aber für Absprachen vor Ort hilfreich." },
        { question: "Entsorgen Sie die Verpackung?", answer: "Ja, nach Absprache nehmen wir Verpackungsmaterial mit." },
      ],
      en: [
        { question: "Do you also assemble kitchens?", answer: "Kitchen assembly is a separate service — without electrical, water or gas connections." },
        { question: "Do I need to be present during assembly?", answer: "Not required, but helpful for on-site coordination." },
        { question: "Do you dispose of packaging?", answer: "Yes, by agreement we can take packaging material away." },
      ],
    },
  },
  {
    slug: "demontage",
    group: "montage",
    eyebrow: { de: "Demontage — Chemnitz", en: "Disassembly — Chemnitz" },
    title: { de: "Möbeldemontage", en: "Furniture Disassembly" },
    statement: {
      de: "Wir demontieren Möbel sorgfältig für Umzug, Austausch oder Entsorgung — mit klarer Sortierung, sauberem Arbeitsplatz und nachvollziehbarer Übergabe.",
      en: "We carefully disassemble furniture for moving, replacement or disposal — with clear sorting, a clean workspace and structured handover.",
    },
    included: {
      de: ["Demontage von Möbeln", "Sortierung von Beschlägen und Teilen", "Vorbereitung für Transport oder Entsorgung", "Sauberes Verlassen des Arbeitsbereichs"],
      en: ["Furniture disassembly", "Sorting of fittings and parts", "Preparation for transport or disposal", "Clean work area handover"],
    },
    scopeNote: {
      de: "Wichtig: Diese Leistung betrifft Möbel. Baulicher Rückbau oder konstruktiver Abbruch ist nicht enthalten.",
      en: "Important: this service covers furniture. Structural dismantling or demolition is not included.",
    },
    forWhom: {
      de: ["Privatkunden", "Vermieter", "Hausverwaltungen", "Umzugskunden"],
      en: ["Private clients", "Landlords", "Property managers", "Moving clients"],
    },
    outcomes: {
      de: ["Sorgfältige Demontage", "Klare Teileordnung", "Termintreue", "Rechnung"],
      en: ["Careful disassembly", "Clear parts organization", "Reliable scheduling", "Invoice"],
    },
    pricing: {
      de: "Der Preis hängt von Möbeltyp, Größe, Zugänglichkeit, Etage und gewünschter Weiterverwendung ab.",
      en: "Pricing depends on furniture type, size, access, floor level and whether the furniture will be reused.",
    },
    faq: {
      de: [
        { question: "Bauen Sie Möbel später wieder auf?", answer: "Ja, wenn Transport und Zustand der Teile das zulassen." },
        { question: "Beschriften Sie Teile?", answer: "Bei komplexeren Möbeln sortieren und kennzeichnen wir relevante Teile nach Absprache." },
        { question: "Ist baulicher Abbruch enthalten?", answer: "Nein, diese Seite betrifft Möbeldemontage." },
      ],
      en: [
        { question: "Can you reassemble furniture later?", answer: "Yes, if transport and part condition allow it." },
        { question: "Do you label parts?", answer: "For more complex furniture, we sort and label relevant parts by agreement." },
        { question: "Is structural demolition included?", answer: "No, this page covers furniture disassembly." },
      ],
    },
  },
  {
    slug: "umzug-moebeltransport",
    group: "objektservice",
    eyebrow: { de: "Transport — Chemnitz", en: "Transport — Chemnitz" },
    title: { de: "Umzug & Möbeltransport", en: "Moving & Furniture Transport" },
    statement: {
      de: "Wir unterstützen bei Möbeltransporten und Umzügen im Raum Chemnitz — planbar, vorsichtig und mit klarer Kommunikation vor dem Termin.",
      en: "We support furniture transport and moves around Chemnitz — planned, careful and clearly coordinated before the appointment.",
    },
    included: {
      de: ["Möbeltransport", "Tragen nach Absprache", "Schutz empfindlicher Teile", "Koordination von Termin und Zugang"],
      en: ["Furniture transport", "Carrying by agreement", "Protection of sensitive parts", "Coordination of appointment and access"],
    },
    scopeNote: {
      de: "Transportumfang, Fahrzeugbedarf und Versicherung werden vor dem Auftrag geklärt.",
      en: "Transport scope, vehicle requirements and insurance are clarified before the job.",
    },
    forWhom: {
      de: ["Privatkunden", "Vermieter", "Büros", "Hausverwaltungen"],
      en: ["Private clients", "Landlords", "Offices", "Property managers"],
    },
    outcomes: {
      de: ["Planbare Termine", "Sorgfältiger Umgang", "Klare Absprachen", "Rechnung"],
      en: ["Predictable appointments", "Careful handling", "Clear agreements", "Invoice"],
    },
    pricing: {
      de: "Der Preis richtet sich nach Volumen, Strecke, Etage, Trageweg, Helferbedarf und gewünschtem Zeitfenster.",
      en: "Pricing depends on volume, distance, floor level, carrying distance, staffing needs and requested time window.",
    },
    faq: {
      de: [
        { question: "Übernehmen Sie auch kleine Transporte?", answer: "Ja, auch einzelne Möbelstücke können angefragt werden." },
        { question: "Muss alles verpackt sein?", answer: "Empfindliche Teile sollten geschützt sein; Details klären wir vorab." },
        { question: "Arbeiten Sie kurzfristig?", answer: "Je nach Verfügbarkeit sind kurzfristige Termine möglich." },
      ],
      en: [
        { question: "Do you handle small transports?", answer: "Yes, single furniture items can also be requested." },
        { question: "Does everything need to be packed?", answer: "Sensitive items should be protected; details are clarified in advance." },
        { question: "Do you work on short notice?", answer: "Depending on availability, short-notice appointments are possible." },
      ],
    },
  },
  {
    slug: "entruempelung",
    group: "objektservice",
    eyebrow: { de: "Objektservice — Chemnitz", en: "Property Services — Chemnitz" },
    title: { de: "Entrümpelung", en: "Clearance" },
    statement: {
      de: "Wir räumen Wohnungen, Keller, Garagen und Objekte strukturiert frei — mit sauberer Planung, klarer Abstimmung und geordneten Entsorgungswegen.",
      en: "We clear apartments, basements, garages and properties in a structured way — with clean planning, clear coordination and organized disposal routes.",
    },
    included: {
      de: ["Besichtigung oder Foto-Einschätzung", "Räumung nach Absprache", "Sortierung relevanter Gegenstände", "Übergabe des geräumten Bereichs"],
      en: ["Viewing or photo-based assessment", "Clearance by agreement", "Sorting of relevant items", "Handover of the cleared area"],
    },
    scopeNote: {
      de: "Entsorgung erfolgt nach vorheriger Klärung über passende Wege oder Partner. Sondermüll wird separat bewertet.",
      en: "Disposal is clarified in advance via suitable routes or partners. Hazardous waste is assessed separately.",
    },
    forWhom: {
      de: ["Privatkunden", "Vermieter", "Hausverwaltungen", "Nachlassfälle"],
      en: ["Private clients", "Landlords", "Property managers", "Estate situations"],
    },
    outcomes: {
      de: ["Strukturierte Räumung", "Klare Abstimmung", "Saubere Übergabe", "Rechnung"],
      en: ["Structured clearance", "Clear coordination", "Clean handover", "Invoice"],
    },
    pricing: {
      de: "Der Preis hängt von Volumen, Etage, Zugänglichkeit, Sortieraufwand und Entsorgungsart ab.",
      en: "Pricing depends on volume, floor level, access, sorting effort and disposal type.",
    },
    faq: {
      de: [
        { question: "Reicht eine Foto-Anfrage?", answer: "Für eine erste Einschätzung meistens ja. Bei größerem Umfang kann eine Besichtigung sinnvoll sein." },
        { question: "Nehmen Sie Sondermüll mit?", answer: "Sondermüll muss vorab separat geklärt werden." },
        { question: "Räumen Sie auch Keller?", answer: "Ja, Keller, Garagen und einzelne Räume sind möglich." },
      ],
      en: [
        { question: "Is a photo request enough?", answer: "Usually yes for an initial estimate. For larger scopes, a viewing may be useful." },
        { question: "Do you handle hazardous waste?", answer: "Hazardous waste must be clarified separately in advance." },
        { question: "Do you clear basements?", answer: "Yes, basements, garages and individual rooms are possible." },
      ],
    },
  },
  {
    slug: "reinigung",
    group: "objektservice",
    eyebrow: { de: "Reinigung — Chemnitz", en: "Cleaning — Chemnitz" },
    title: { de: "Reinigung", en: "Cleaning" },
    statement: {
      de: "Wir übernehmen Reinigungsarbeiten für Wohnungen, Objekte und Übergaben — zuverlässig, ordentlich und passend zum vereinbarten Umfang.",
      en: "We handle cleaning work for apartments, properties and handovers — reliably, neatly and according to the agreed scope.",
    },
    included: {
      de: ["Wohnungs- und Objektpflege", "Reinigung nach Auszug oder Arbeitseinsatz", "Abgestimmte Prioritäten", "Saubere Übergabe"],
      en: ["Apartment and property cleaning", "Cleaning after move-out or work", "Agreed priorities", "Clean handover"],
    },
    scopeNote: {
      de: "Der genaue Umfang wird vorab festgelegt, damit Aufwand und Erwartung zusammenpassen.",
      en: "The exact scope is agreed in advance so effort and expectations match.",
    },
    forWhom: {
      de: ["Privatkunden", "Vermieter", "Hausverwaltungen", "Gewerbekunden"],
      en: ["Private clients", "Landlords", "Property managers", "Commercial clients"],
    },
    outcomes: {
      de: ["Klare Checkliste", "Ordentliche Ausführung", "Terminsichere Übergabe", "Rechnung"],
      en: ["Clear checklist", "Neat execution", "Reliable handover", "Invoice"],
    },
    pricing: {
      de: "Der Preis richtet sich nach Fläche, Zustand, gewünschter Tiefe, Zeitfenster und Zusatzaufwand.",
      en: "Pricing depends on area, condition, desired depth, time window and additional effort.",
    },
    faq: {
      de: [
        { question: "Reinigen Sie nach Umzug?", answer: "Ja, Übergaben nach Umzug oder Räumung können angefragt werden." },
        { question: "Kann ich Prioritäten festlegen?", answer: "Ja, der Umfang wird vorab abgestimmt." },
        { question: "Arbeiten Sie auch für Hausverwaltungen?", answer: "Ja, wiederkehrende oder objektbezogene Anfragen sind möglich." },
      ],
      en: [
        { question: "Do you clean after moving?", answer: "Yes, handover cleaning after moving or clearance can be requested." },
        { question: "Can I set priorities?", answer: "Yes, the scope is agreed in advance." },
        { question: "Do you work for property managers?", answer: "Yes, recurring or property-specific requests are possible." },
      ],
    },
  },
];

export function getApprovedService(slug: string) {
  return approvedServices.find((service) => service.slug === slug);
}

export function getGroupedApprovedServices() {
  return (Object.keys(serviceGroups) as ServiceGroupId[])
    .map((groupId) => ({
      id: groupId,
      ...serviceGroups[groupId],
      services: approvedServices.filter((service) => service.group === groupId),
    }))
    .filter((group) => group.services.length > 0);
}
