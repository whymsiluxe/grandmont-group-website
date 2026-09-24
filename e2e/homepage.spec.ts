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
    const enLink = page.getByRole("link", { name: "EN" });
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
});
