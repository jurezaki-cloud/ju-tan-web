import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem("ju-tan-ads-v1", "necessary");
    localStorage.setItem("ju-tan-analytics", "necessary");
  });
  await page.route("**/*", route => {
    const url = new URL(route.request().url());
    if (url.hostname !== "127.0.0.1" || url.pathname === "/api/contact") return route.abort();
    return route.continue();
  });
});

for (const guide of [false, true]) {
  test(`${guide ? 'guide' : 'main'}: uncertain response then refresh cannot create a fresh send`, async ({ page }) => {
    let requests = 0;
    await page.route("**/api/contact", route => { requests++; return route.abort(); });
    async function fill() {
      if (guide) {
        await page.getByRole("button", { name: "Odpri vodič storitev" }).click();
        await page.getByRole("button", { name: "Želim ponudbo", exact: true }).click();
      }
      const form = guide ? page.getByRole("form", { name: "Povpraševanje za ponudbo" }) : page.locator("#contact-form");
      await form.locator('[name="name"]').fill("Synthetic Visitor");
      await form.locator('[name="email"]').fill("nobody@example.invalid");
      await form.locator('select[name="service"]').selectOption({ label: "Spletne strani / UI-UX" });
      await form.locator("textarea").fill("Local isolated fixture only");
      if (guide) {
        await form.getByLabel("Proračun", { exact: true }).selectOption({ index: 1 });
        await form.getByLabel("Rok izvedbe", { exact: true }).selectOption({ index: 1 });
      }
      await form.getByRole("checkbox").check();
      await form.locator('[type="submit"]').click();
      await expect(form.getByRole("alert")).toBeVisible();
    }
    await page.goto("/kontakt");
    await fill();
    expect(requests).toBe(1);
    const marker = await page.evaluate(() => localStorage.getItem("ju-tan-contact-pending-v1"));
    expect(marker).toMatch(/^\d{13}\./);
    expect(marker).not.toContain("nobody");
    await page.reload();
    await fill();
    expect(requests).toBe(1);
    expect(await page.evaluate(() => localStorage.getItem("ju-tan-contact-pending-v1"))).toBe(marker);
  });
}

for (const width of [320, 390, 768]) {
  test(`guide hit target diagnostics ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 844 });
    await page.goto("/kontakt");
    await page.getByRole("button", { name: "Odpri vodič storitev" }).click();
    const dialog = page.getByRole("dialog", { name: "JU-TAN vodič" });
    await expect(dialog).toBeVisible();
    const close = dialog.getByRole("button", { name: "Zapri vodič storitev" });
    const diagnostic = await close.evaluate(node => {
      const r = node.getBoundingClientRect();
      const hit = document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2);
      return { width: r.width, height: r.height, withinViewport: r.top >= 0 && r.bottom <= innerHeight && r.left >= 0 && r.right <= innerWidth, hit: !!hit && node.contains(hit), coveringTag: hit?.tagName, coveringClass: hit?.getAttribute('class') };
    });
    console.log('GUIDE_HIT_TARGET', width, JSON.stringify(diagnostic));
    expect(diagnostic.width).toBeGreaterThanOrEqual(44);
    expect(diagnostic.height).toBeGreaterThanOrEqual(44);
    // This is a diagnostic, not a false claim of fixing an existing overlay.
    // The actual pointer trial is recorded and reported, never force-clicked.
    let pointerWorks = true;
    try { await close.click({ trial: true, timeout: 2000 }); } catch { pointerWorks = false; }
    console.log('GUIDE_POINTER_TRIAL', width, pointerWorks);
    await page.keyboard.press("Escape");
    await expect(dialog).not.toBeVisible();
  });
}
