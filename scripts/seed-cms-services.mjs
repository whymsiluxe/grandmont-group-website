// One-time migration: seed Payload `services` collection from the static
// approved-services TS data. Run locally against the CMS via SSH tunnel:
//   ssh -f -N -L 3010:localhost:3010 promonta@162.55.53.147
//   node scripts/seed-cms-services.mjs <jwt-token>
//
// Idempotent-ish: re-running creates duplicates (no upsert-by-slug), so
// only run once against a clean `services` table.

import { approvedServices } from "../src/lib/services/approved-services.ts";

const API = "http://localhost:3010/api/services";
const token = process.argv[2];
if (!token) {
  console.error("Usage: node scripts/seed-cms-services.mjs <jwt-token>");
  process.exit(1);
}

async function seedOne(service) {
  const base = {
    slug: service.slug,
    group: service.group,
    status: "published",
    ownerApproved: true,
    legalApproved: true,
    eyebrow: service.eyebrow.de,
    title: service.title.de,
    statement: service.statement.de,
    scopeNote: service.scopeNote.de,
    pricing: service.pricing.de,
    included: service.included.de.map((value) => ({ value })),
    forWhom: service.forWhom.de.map((value) => ({ value })),
    outcomes: service.outcomes.de.map((value) => ({ value })),
    faq: service.faq.de.map((f) => ({ question: f.question, answer: f.answer })),
  };

  const createRes = await fetch(`${API}?locale=de`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `JWT ${token}` },
    body: JSON.stringify(base),
  });
  const created = await createRes.json();
  if (!createRes.ok) {
    console.error(`FAILED create ${service.slug}:`, JSON.stringify(created));
    return;
  }
  const id = created.doc.id;

  const enPayload = {
    eyebrow: service.eyebrow.en,
    title: service.title.en,
    statement: service.statement.en,
    scopeNote: service.scopeNote.en,
    pricing: service.pricing.en,
    included: service.included.en.map((value) => ({ value })),
    forWhom: service.forWhom.en.map((value) => ({ value })),
    outcomes: service.outcomes.en.map((value) => ({ value })),
    faq: service.faq.en.map((f) => ({ question: f.question, answer: f.answer })),
  };

  const updateRes = await fetch(`${API}/${id}?locale=en`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", Authorization: `JWT ${token}` },
    body: JSON.stringify(enPayload),
  });
  const updated = await updateRes.json();
  if (!updateRes.ok) {
    console.error(`FAILED en-update ${service.slug}:`, JSON.stringify(updated));
    return;
  }

  console.log(`OK  ${service.slug}  id=${id}`);
}

for (const service of approvedServices) {
  await seedOne(service);
}
