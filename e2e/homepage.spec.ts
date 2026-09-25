import { test, expect } from "@playwright/test";

test.describe("homepage smoke", () => {
  test("DE homepage renders with correct lang and single h1-equivalent structure", async ({ page }) => {
    const response = await page.goto("/de");
    expect(response?.status()).toBe(200);
    await expect(page.locator("html")).toHaveAttribute("lang", "de");
    // Hero is the only <h1>; sections below use <h2>.
    await expect(page.locator("h1")).toHaveCount(1);
  });

  test("EN homepage renders with correct lang", async ({ page }) => {
    const response = await page.goto("/en");
    expect(response?.status()).toBe(200);
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
  });

  test("locale switcher preserves the current path", async ({ page }) => {
    await page.goto("/de/leistungen/moebelmontage");
    // Text is lowercase "en" in markup (uppercase is CSS text-transform).
    // Desktop and mobile nav both render in the DOM (mobile hidden via CSS,
    // not unmounted) — two matches, take the visible one.
    const enLink = page.locator('a[hreflang="en"]').first();
    await enLink.click();
    await expect(page).toHaveURL(/\/en\/leistungen\/moebelmontage/);
  });

  test("no horizontal overflow at mobile viewport", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/de");
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
    );
    expect(overflow).toBe(false);
  });

  test("mobile menu closes after selecting a link", async ({ page }) => {
    // Header is outside {children} in the locale layout, so it never
    // remounts on client-side navigation — the native <details> menu used
    // to stay open (covering the destination page) after tapping a link.
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/de");
    const details = page.locator("header details");
    await details.locator("summary").click();
    await expect(details).toHaveJSProperty("open", true);

    await details.getByRole("link", { name: "Leistungen", exact: true }).click();
    await expect(page).toHaveURL(/\/de\/leistungen$/);
    await expect(details).toHaveJSProperty("open", false);
  });

  test("no horizontal overflow at 375px viewport (embedded contact form)", async ({ page }) => {
    // Regression: <fieldset>/<select> UA-default min-width: min-content
    // forced the embedded ContactForm wider than its column at narrow
    // viewports, making the whole page horizontally scrollable.
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/de");
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
    );
    expect(overflow).toBe(false);
  });

  test("trust strip renders factual propositions", async ({ page }) => {
    await page.goto("/de");
    await expect(page.getByText("Chemnitz & Region")).toBeVisible();
  });

  test("FAQ accordion reveals an answer on click", async ({ page }) => {
    await page.goto("/de");
    // Scoped to the FAQ section specifically — the header's mobile-nav
    // menu is also a <details> element earlier in the DOM.
    const faqSection = page.locator("section", { hasText: "Häufige Fragen" });
    const firstItem = faqSection.locator("details").first();
    await expect(firstItem).not.toHaveJSProperty("open", true);
    await firstItem.locator("summary").click();
    await expect(firstItem).toHaveJSProperty("open", true);
    await expect(firstItem.locator("p")).toBeVisible();
  });

  test("lead form is embedded directly on the homepage", async ({ page }) => {
    await page.goto("/de");
    const kontaktSection = page.locator("#kontakt");
    await kontaktSection.scrollIntoViewIfNeeded();
    await expect(kontaktSection.locator('select[name="service"]')).toBeVisible();
    await expect(kontaktSection.locator('button[type="submit"]')).toBeVisible();
  });

  test("hero secondary CTA links to services", async ({ page }) => {
    await page.goto("/de");
    await page.getByRole("link", { name: "Leistungen ansehen" }).click();
    await expect(page).toHaveURL(/\/de\/leistungen$/);
  });
});
