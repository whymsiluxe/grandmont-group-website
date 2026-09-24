import { test, expect } from "@playwright/test";

// Regression guard for the legal publication gate (SERVICE_MATRIX.md) —
// a service must never become publicly reachable just by existing as a
// CMS row. This is the invariant re-checked manually after every design/
// CMS change throughout Phase 2/3; codifying it here so it can't silently
// regress.

const APPROVED_SLUGS = [
  "kuechenmontage",
  "moebelmontage",
  "demontage",
  "umzug-moebeltransport",
  "entruempelung",
  "reinigung",
];

// Never approved in SERVICE_MATRIX.md — must 404 regardless of CMS state.
const NEVER_APPROVED_SLUGS = ["innenausbau", "malerarbeiten", "parkett"];

test.describe("service publication gate", () => {
  for (const slug of APPROVED_SLUGS) {
    test(`${slug} is publicly reachable`, async ({ page }) => {
      const response = await page.goto(`/de/leistungen/${slug}`);
      expect(response?.status()).toBe(200);
      await expect(page.locator("h1")).toBeVisible();
    });
  }

  for (const slug of NEVER_APPROVED_SLUGS) {
    test(`${slug} 404s`, async ({ page }) => {
      const response = await page.goto(`/de/leistungen/${slug}`);
      expect(response?.status()).toBe(404);
    });
  }

  test("sitemap contains only approved services, never a non-approved one", async ({ request }) => {
    const response = await request.get("/sitemap.xml");
    const body = await response.text();
    for (const slug of APPROVED_SLUGS) {
      expect(body).toContain(`/leistungen/${slug}`);
    }
    for (const slug of NEVER_APPROVED_SLUGS) {
      expect(body).not.toContain(`/leistungen/${slug}`);
    }
  });
});
