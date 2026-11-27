import { test, expect, type Page } from "@playwright/test";
async function fill(page: Page) {
  await page.goto("/kontakt");
  const form = page.locator("#contact-form");
  await form.locator('[name="name"]').fill("Synthetic");
  await form.locator('[name="email"]').fill("nobody@example.invalid");
  await form.locator('select[name="service"]').selectOption({ label: "Spletne strani / UI-UX" });
  await form.locator("textarea").fill("Local isolated fixture only");
  await form.getByRole("checkbox").check();
  return form;
}
test.beforeEach(async ({ context }) => {
  await context.addInitScript(() => {
    localStorage.setItem("ju-tan-ads-v1", "necessary");
    localStorage.setItem("ju-tan-analytics", "necessary");
  });
  await context.route("**/*", route => {
    const url = new URL(route.request().url());
    if (url.hostname !== "127.0.0.1" || url.pathname.startsWith("/api/")) return route.abort();
    return route.continue();
  });
});
test("two tabs queued for one origin lock cannot both create fresh deliveries", async ({ page, context }) => {
  const second = await context.newPage();
  let sends = 0;
  let release!: () => void;
  const hold = new Promise<void>(resolve => { release = resolve; });
  await context.route("**/api/contact", async route => {
    sends++;
    await hold;
    await route.fulfill({ json: { success: true, conversionId: "one-receipt" } });
  });
  const a = await fill(page);
  const b = await fill(second);
  await a.locator('[type="submit"]').click();
  await expect.poll(() => sends).toBe(1);
  await b.locator('[type="submit"]').click();
  await expect(b).toHaveAttribute("aria-busy", "true");
  release();
  await expect(page.getByRole("heading", { name: "Povpraševanje je oddano." })).toBeVisible();
  await expect(b.getByRole("alert")).toBeVisible();
  expect(sends).toBe(1);
});
test("unavailable safe storage never sends, including a repeated click", async ({ page, context }) => {
  let sends = 0;
  await context.route("**/api/contact", route => { sends++; return route.abort(); });
  await page.addInitScript(() => {
    const original = Storage.prototype.setItem;
    Storage.prototype.setItem = function(key, value) {
      if (key === "ju-tan-contact-pending-v1") throw new Error("isolated denied storage");
      return original.call(this, key, value);
    };
  });
  const form = await fill(page);
  for (let i = 0; i < 2; i++) {
    await form.locator('[type="submit"]').click();
    await expect(form.getByRole("alert")).toBeVisible();
    await expect(form).toHaveAttribute("aria-busy", "false");
  }
  expect(sends).toBe(0);
});
test("missing Web Locks fails closed instead of claiming atomic duplicate protection", async ({ page, context }) => {
  let sends = 0;
  await context.route("**/api/contact", route => { sends++; return route.abort(); });
  await page.addInitScript(() => Object.defineProperty(navigator, "locks", { value: undefined, configurable: true }));
  const form = await fill(page);
  await form.locator('[type="submit"]').click();
  await expect(form.getByRole("alert")).toBeVisible();
  expect(sends).toBe(0);
});
