import { test, expect, type Page } from "@playwright/test";
async function fill(page: Page, guide: boolean) {
  if (guide) {
    await page.getByRole("button", { name: "Odpri vodič storitev" }).click();
    await page.getByRole("button", { name: "Želim ponudbo", exact: true }).click();
  }
  const form = guide ? page.getByRole("form", { name: "Povpraševanje za ponudbo" }) : page.locator("#contact-form");
  await form.locator('[name="name"]').fill("Synthetic PR93");
  await form.locator('[name="email"]').fill("test@example.com");
  if (guide) {
    await form.getByLabel("Storitev", { exact: true }).selectOption({ index: 1 });
    await form.getByLabel("Proračun", { exact: true }).selectOption({ index: 1 });
    await form.getByLabel("Rok izvedbe", { exact: true }).selectOption({ index: 1 });
  } else await form.locator("select").selectOption({ index: 1 });
  await form.locator("textarea").fill("Sintetični test trajnega sprejema, brez resničnega naročnika.");
  await form.getByRole("checkbox").check();
  return form;
}
for (const guide of [false, true]) for (const analytics of [false, true]) for (const ads of [false, true]) {
  test(`durable queue does not count delivery: guide=${guide}, analytics=${analytics}, ads=${ads}`, async ({ page }) => {
    await page.addInitScript(({ analytics, ads }) => {
      localStorage.setItem("ju-tan-analytics-v2", analytics ? "accepted" : "necessary");
      localStorage.setItem("ju-tan-ads-v1", ads ? "accepted" : "necessary");
    }, { analytics, ads });
    await page.route(/https:\/\/(.*google.*|.*doubleclick.*)/, route => route.fulfill({ contentType: "application/javascript", body: "/* isolated test */" }));
    let sends = 0;
    await page.route("**/api/contact", route => { sends++; return route.fulfill({ status: 202, json: { success: true, queued: true } }); });
    await page.goto("/kontakt");
    const form = await fill(page, guide);
    await form.locator('[type="submit"]').click();
    if (guide) await expect(page.getByText(/Povzetek povpraševanja/)).toBeVisible();
    else await expect(page.getByRole("heading", { name: "Povpraševanje je oddano." })).toBeVisible();
    expect(sends).toBe(1);
    const conversions = await page.evaluate(() => (window.dataLayer ?? []).map(x => Array.from(x as ArrayLike<unknown>)).filter(x => x[0] === "event" && x[1] === "conversion"));
    expect(conversions).toEqual([]);
    await page.reload();
    expect(await page.evaluate(() => localStorage.getItem("ju-tan-contact-pending-v1"))).toBeNull();
    expect(sends).toBe(1);
  });
}
