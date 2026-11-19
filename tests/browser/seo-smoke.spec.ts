import { expect, test } from "@playwright/test";

test("mobile homepage keeps its primary inquiry path within the viewport", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await expect(page.locator("main h1")).toHaveCount(1);
  await expect(page.locator("main h1")).toBeVisible();
  const inquiry = page.locator('main a[href="/kontakt"]').first();
  await expect(inquiry).toBeVisible();
  await expect.poll(() =>
    page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1),
  ).toBe(true);
});

test("hero respects reduced motion without hiding the main message", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await expect(page.locator("main h1")).toBeVisible();
  const reveal = page.locator("main div[class*='HeroReveal_enter']").first();
  await expect(reveal).toBeVisible();
  const animationName = await reveal.evaluate((element) => getComputedStyle(element).animationName);
  expect(animationName).toBe("none");
});

test("contact and web service pages expose concise metadata and a single H1", async ({ page }) => {
  for (const path of ["/kontakt", "/spletne-strani-in-ui-ux"]) {
    await page.goto(path);
    await expect(page.locator("main h1")).toHaveCount(1);
    const content = await page.locator('meta[name="description"]').getAttribute("content");
    expect(content, `Missing meta description on ${path}`).toBeTruthy();
    expect(content!.length).toBeGreaterThanOrEqual(70);
    expect(content!.length).toBeLessThanOrEqual(160);
  }
});
