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
});
