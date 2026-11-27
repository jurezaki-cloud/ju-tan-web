import { test, expect, type Page } from "@playwright/test";
test.use({ hasTouch: true, reducedMotion: "reduce" });
const events = (page: Page) => page.evaluate(() => (window.dataLayer ?? []).map(v => Array.from(v as ArrayLike<unknown>)).filter(v => v[0] === "event" && v[1] === "conversion"));
async function fill(page: Page, guide: boolean) {
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
  return form;
}
test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem("ju-tan-ads-v1", "necessary");
    localStorage.setItem("ju-tan-analytics", "necessary");
  });
  await page.route("**/*", route => {
    const url = new URL(route.request().url());
    if (/google|doubleclick/.test(url.hostname)) return route.fulfill({ contentType: "application/javascript", body: "/* isolated stub */" });
    if (url.hostname !== "127.0.0.1" || url.pathname.startsWith("/api/")) return route.abort();
    return route.continue();
  });
});
for (const guide of [false, true]) {
  for (const state of ["accepted", "cancelled", "pending", "unavailable"]) {
    test(`${guide ? 'guide' : 'main'}: recover ${state} after lost response and refresh`, async ({ page }) => {
      let sends = 0;
      await page.route("**/api/contact", route => { sends++; return route.abort(); });
      await page.route("**/api/contact/status", route => route.fulfill({ status: state === "unavailable" ? 503 : 200, json: { state } }));
      await page.goto("/kontakt");
      let form = await fill(page, guide);
      await form.locator('[type="submit"]').click();
      await expect(form.getByRole("alert")).toBeVisible();
      expect(sends).toBe(1);
      const marker = await page.evaluate(() => localStorage.getItem("ju-tan-contact-pending-v1"));
      expect(marker).toMatch(/^\d{13}\./);
      expect(marker).not.toContain("nobody");
      await page.reload();
      form = await fill(page, guide);
      await form.locator('[type="submit"]').click();
      await expect(form.getByRole("alert")).toBeVisible();
      await form.getByRole("button", { name: "Preveri stanje prejšnje oddaje" }).click();
      const expected = { accepted: /Prejšnje povpraševanje je sprejeto/, cancelled: /Prejšnji poskus ni bil poslan/, pending: /Izid oddaje še ni potrjen/, unavailable: /Stanje trenutno ni dosegljivo/ }[state];
      await expect(form.getByText(expected!)).toBeVisible();
      expect(sends).toBe(1);
      expect(await events(page)).toEqual([]);
      const remaining = await page.evaluate(() => localStorage.getItem("ju-tan-contact-pending-v1"));
      expect(remaining).toBe(state === "cancelled" ? null : marker);
      if (state === "accepted") {
        await form.getByRole("button", { name: "Začni drugo povpraševanje" }).click();
        expect(await page.evaluate(() => localStorage.getItem("ju-tan-contact-pending-v1"))).toBeNull();
        expect(sends).toBe(1); // explicit reset does not send
      }
    });
  }
}
for (const width of [320, 390, 768]) {
  test(`guide real touch closes without overlay at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 844 });
    await page.goto("/kontakt");
    await page.getByRole("button", { name: "Odpri vodič storitev" }).tap();
    const dialog = page.getByRole("dialog", { name: "JU-TAN vodič" });
    await expect(dialog).toBeVisible();
    const close = dialog.getByRole("button", { name: "Zapri vodič storitev" });
    const d = await close.evaluate(node => {
      const r = node.getBoundingClientRect();
      const hit = document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2);
      return { width: r.width, height: r.height, within: r.top >= 0 && r.bottom <= innerHeight && r.left >= 0 && r.right <= innerWidth, hit: !!hit && node.contains(hit) };
    });
    expect(d.width).toBeGreaterThanOrEqual(44); expect(d.height).toBeGreaterThanOrEqual(44);
    expect(d.within).toBe(true); expect(d.hit).toBe(true);
    await close.tap(); // no Escape, forced click, or swallowed assertion
    await expect(dialog).not.toBeVisible();
  });
}
for (const analytics of [false, true]) {
  for (const ads of [false, true]) {
    test(`consent combination analytics=${analytics} ads=${ads}`, async ({ page }) => {
      await page.route("**/api/contact", route => route.fulfill({ json: { success: true, conversionId: "choice-receipt" } }));
      await page.goto("/kontakt");
      await page.getByRole("button", { name: "Nastavitve piškotkov" }).click();
      await page.getByLabel("Analitika obiska (Vercel)").setChecked(analytics);
      await page.getByLabel("Merjenje uspešnih povpraševanj iz oglasov (Google Ads)").setChecked(ads);
      await page.getByRole("button", { name: "Shrani izbiro" }).click();
      const form = await fill(page, false);
      await form.locator('[type="submit"]').click();
      await expect(page.getByRole("heading", { name: "Povpraševanje je oddano." })).toBeVisible();
      await expect.poll(async () => (await events(page)).length).toBe(ads ? 1 : 0);
      const consent = await page.evaluate(() => (window.dataLayer ?? []).map(v => Array.from(v as ArrayLike<unknown>)).filter(v => v[0] === "consent"));
      if (ads) {
        expect(consent.some(v => v[1] === "default" && (v[2] as Record<string, string>).ad_storage === "denied")).toBe(true);
        expect(consent.filter(v => v[1] === "update").at(-1)?.[2]).toEqual({ ad_storage: "granted", ad_user_data: "granted", ad_personalization: "denied", analytics_storage: "denied" });
      } else expect(await page.locator("#ju-tan-google-ads").count()).toBe(0);
    });
  }
}
test("Marko restores and saves notes with unchanged fields", async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem("marko-dobavnice", JSON.stringify([{ number: "SYN-1", date: "2026-11-27", place: "Ankaran", to: "Synthetic", lines: [{ qty: "1", unit: "kos", name: "Fixture" }] }])));
  await page.goto("/apk/marko");
  const select = page.getByRole("combobox");
  await expect(select).toBeVisible(); await select.selectOption("0");
  await expect(page.getByLabel("Številka dobavnice")).toHaveValue("SYN-1");
  await expect(page.getByLabel("Prejemnik", { exact: true })).toHaveValue("Synthetic");
  page.on("dialog", dialog => dialog.accept());
  await page.getByLabel("Številka dobavnice").fill("SYN-2");
  await page.getByRole("button", { name: "Shrani dobavnico", exact: true }).click();
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem("marko-dobavnice")!)[0].number)).toBe("SYN-2");
});
