import { test, expect } from "@playwright/test";
import path from "path";

const TEST_PHOTO = path.join(__dirname, "fixtures", "test-photo.jpg");

test.describe("lead form", () => {
  test("service preselected from ?service= query param", async ({ page }) => {
    await page.goto("/de/kontakt?service=moebelmontage");
    const select = page.locator('select[name="service"]');
    await expect(select).toHaveValue("moebelmontage");
  });

  test("links to Datenschutzerklärung near submit", async ({ page }) => {
    await page.goto("/de/kontakt");
    const link = page.locator('a[href="/de/datenschutz"]').filter({ hasText: "Datenschutzerklärung" });
    await expect(link).toBeVisible();
  });

  test("rejects submission with no photo (required attribute)", async ({ page }) => {
    await page.goto("/de/kontakt");
    await page.locator('select[name="service"]').selectOption("moebelmontage");
    await page.locator('input[name="postcode"]').fill("09111 Chemnitz");
    await page
      .locator('textarea[name="description"]')
      .fill("Kleiderschrank im Schlafzimmer aufbauen, drei Elemente, kein Aufzug.");
    await page.locator('input[name="contact"]').fill("test@example.com");
    // No photo attached — browser-native required-field validation should
    // block submission; the request should never reach the network.
    let requestFired = false;
    page.on("request", (req) => {
      if (req.url().includes("/api/leads")) requestFired = true;
    });
    await page.locator('button[type="submit"]').click();
    await page.waitForTimeout(500);
    expect(requestFired).toBe(false);
  });

  test("full valid submission reaches the API and returns a lead id or a clear storage-not-configured message", async ({
    page,
  }) => {
    await page.goto("/de/kontakt");
    await page.locator('select[name="service"]').selectOption("moebelmontage");
    await page.locator('input[name="postcode"]').fill("09111 Chemnitz");
    await page
      .locator('textarea[name="description"]')
      .fill("Kleiderschrank im Schlafzimmer aufbauen, drei Elemente, kein Aufzug.");
    await page.locator('input[name="photos"]').setInputFiles(TEST_PHOTO);
    await page.locator('input[name="contact"]').fill("test-e2e@example.com");

    const responsePromise = page.waitForResponse((res) => res.url().includes("/api/leads"));
    await page.locator('button[type="submit"]').click();
    const response = await responsePromise;

    // 200 (stored) if LEAD_STORAGE_DIR is configured in this environment,
    // 503 (fail-closed, not a fake success) if it isn't — both are correct
    // behavior; what must NOT happen is a 200 with status:"validated"
    // pretending to be a successful store.
    expect([200, 503]).toContain(response.status());
    const body = await response.json();
    if (response.status() === 200) {
      expect(body.status).toBe("stored");
      expect(body.leadId).toBeTruthy();
    } else {
      expect(body.ok).toBe(false);
    }
  });
});
