import { test, expect, type Page, type Locator } from "@playwright/test";

const conversionEvents = (page: Page) => page.evaluate(() =>
  (window.dataLayer ?? []).map((v) => Array.from(v as ArrayLike<unknown>))
    .filter((v) => v[0] === "event" && v[1] === "conversion"));

async function consent(page: Page, ads: boolean) {
  await page.addInitScript((accepted) => {
    localStorage.setItem("ju-tan-analytics-v2", "necessary");
    localStorage.setItem("ju-tan-ads-v1", accepted ? "accepted" : "necessary");
  }, ads);
}
async function fillForm(page: Page, guide: boolean): Promise<Locator> {
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
async function doubleSubmit(form: Locator) {
  await form.evaluate((node) => {
    for (let i = 0; i < 2; i++) node.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
  });
}

test("main: without JavaScript fields cannot submit personal data into the URL", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.route("**/*", route => new URL(route.request().url()).hostname === "127.0.0.1" ? route.continue() : route.abort());
  await page.goto("http://127.0.0.1:3100/kontakt");
  const form = page.locator("#contact-form");
  await expect(form.locator('[name="name"]')).toBeDisabled();
  await expect(form.locator('[type="submit"]')).toBeDisabled();
  await expect(form).toHaveAttribute("method", "post");
  await expect(form).toHaveAttribute("action", "/api/contact");
  expect(new URL(page.url()).search).toBe("");
  await context.close();
});

test.beforeEach(async ({ page }) => {
  // Fail closed: ALL off-origin requests are stubbed/aborted. No provider or
  // Google request can leave the local browser test, even if tracking regresses.
  await page.route("**/*", (route) => {
    const url = new URL(route.request().url());
    if (url.hostname === "127.0.0.1") {
      if (url.pathname === "/api/contact") return route.abort();
      return route.continue();
    }
    if (/google|doubleclick/.test(url.hostname)) return route.fulfill({ contentType: "application/javascript", body: "/* isolated Google stub */" });
    return route.abort();
  });
});

for (const guide of [false, true]) {
  const label = guide ? "guide" : "main";
  test(`${label}: explicit success, one submission and one transaction`, async ({ page }) => {
    await consent(page, true);
    let count = 0;
    await page.route("**/api/contact", async (route) => {
      count++;
      expect(route.request().headers()["idempotency-key"]).toMatch(/^\d{13}\./);
      await route.fulfill({ json: { success: true, conversionId: `local-${label}` } });
    });
    await page.goto("/kontakt");
    const form = await fillForm(page, guide);
    await doubleSubmit(form);
    await expect.poll(async () => (await conversionEvents(page)).length).toBe(1);
    expect(count).toBe(1);
    const emitted = await conversionEvents(page);
    expect(emitted[0][2]).toEqual({ send_to: "AW-18531808239/YQbkCOaJz7gdEO_n04RF", value: 1, currency: "EUR", transaction_id: `local-${label}` });
    expect(JSON.stringify(emitted)).not.toContain("nobody@example.invalid");
    await page.reload();
    expect(await conversionEvents(page)).toEqual([]);
  });

  for (const bad of ["false", "malformed", "http", "missing-id"]) {
    test(`${label}: ${bad} cannot create a conversion`, async ({ page }) => {
      await consent(page, true);
      await page.route("**/api/contact", (route) => route.fulfill({
        status: bad === "http" ? 500 : 200,
        contentType: "application/json",
        body: bad === "malformed" ? "{broken" : JSON.stringify(bad === "missing-id" ? { success: true } : { success: false }),
      }));
      await page.goto("/kontakt");
      const form = await fillForm(page, guide);
      await form.locator('[type="submit"]').click();
      if (bad !== "missing-id") await expect(form.getByRole("alert")).toBeVisible();
      else if (!guide) await expect(page.getByRole("heading", { name: "Povpraševanje je oddano." })).toBeVisible();
      else await expect(page.getByText(/Hvala, Synthetic Visitor/)).toBeVisible();
      expect(await conversionEvents(page)).toEqual([]);
    });
  }

  test(`${label}: no Ads opt-in still allows inquiry and never replays`, async ({ page }) => {
    await consent(page, false);
    await page.route("**/api/contact", (route) => route.fulfill({ json: { success: true, conversionId: "denied-receipt" } }));
    await page.goto("/kontakt");
    const form = await fillForm(page, guide);
    await form.locator('[type="submit"]').click();
    if (!guide) await expect(page.getByRole("heading", { name: "Povpraševanje je oddano." })).toBeVisible();
    else await expect(page.getByText(/Hvala, Synthetic Visitor/)).toBeVisible();
    expect(await page.locator("#ju-tan-google-ads").count()).toBe(0);
    if (guide) {
      const dialog = page.getByRole("dialog", { name: "JU-TAN vodič" });
      // AgentWindow explicitly supports Escape. The previous pointer-click
      // failed because the existing sticky header overlays the close button.
      // Do not force-click or claim that unrelated layout defect is fixed.
      await page.keyboard.press("Escape");
      await expect(dialog).not.toBeVisible();
    }
    await page.getByRole("button", { name: "Nastavitve piškotkov" }).click();
    await page.getByLabel("Merjenje uspešnih povpraševanj iz oglasov (Google Ads)").check();
    await page.getByRole("button", { name: "Shrani izbiro" }).click();
    expect(await conversionEvents(page)).toEqual([]);
  });
}

test("main: uncertain network response retries same key without double-submit", async ({ page }) => {
  await consent(page, true);
  const keys: string[] = [];
  await page.route("**/api/contact", (route) => {
    keys.push(route.request().headers()["idempotency-key"]);
    return keys.length === 1 ? route.abort() : route.fulfill({ json: { success: true, conversionId: "retry-receipt" } });
  });
  await page.goto("/kontakt");
  const form = await fillForm(page, false);
  await form.locator('[type="submit"]').click();
  await expect(form.getByRole("alert")).toBeVisible();
  await doubleSubmit(form);
  await expect.poll(async () => (await conversionEvents(page)).length).toBe(1);
  expect(keys).toHaveLength(2);
  expect(keys[0]).toBe(keys[1]);
});
