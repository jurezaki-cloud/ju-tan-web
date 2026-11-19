import { test, expect, type Page } from "@playwright/test";

async function fill(page: Page) {
  const form = page.locator("#contact-form");
  await form.locator('[name="name"]').fill("Test Visitor");
  await form.locator('[name="email"]').fill("test@example.com");
  await form
    .locator("select")
    .selectOption({ label: "Spletne strani / UI-UX" });
  await form.locator("textarea").fill("Testno povpraševanje za spletno stran.");
  await form.getByRole("checkbox").check();
}

const events = (page: Page) =>
  page.evaluate(() =>
    (window.dataLayer ?? [])
      .map((item) => Array.from(item as ArrayLike<unknown>))
      .filter((item) => item[0] === "event" && item[1] === "conversion"),
  );

test.beforeEach(async ({ page }) => {
  // Never send test conversions to Google, or real inquiries to the mail API.
  await page.route(/https:\/\/(.*google.*|.*doubleclick.*)/, (route) =>
    route.fulfill({
      contentType: "application/javascript",
      body: "/* Google stub */",
    }),
  );
});

test("one accepted submission emits once; failures and double submit do not", async ({
  page,
}) => {
  let requests = 0;
  let status = 500;
  let body: object = { success: false };
  await page.route("**/api/contact", async (route) => {
    requests++;
    await route.fulfill({ status, json: body });
  });
  await page.goto("/kontakt");
  await page
    .getByLabel("Merjenje uspešnih povpraševanj iz oglasov (Google Ads)")
    .check();
  await page.getByRole("button", { name: "Shrani izbiro" }).click();
  await expect.poll(() => page.locator("#ju-tan-google-ads").count()).toBe(1);
  expect(await events(page)).toEqual([]);
  await fill(page);
  await page.locator('#contact-form [type="submit"]').click();
  await expect(page.locator("#contact-form")).toHaveAttribute(
    "aria-busy",
    "false",
  );
  expect(await events(page)).toEqual([]);
  status = 200;
  body = { success: true, conversionId: "browser-receipt" };
  await page.locator("#contact-form").evaluate((form) => {
    form.dispatchEvent(
      new Event("submit", { bubbles: true, cancelable: true }),
    );
    form.dispatchEvent(
      new Event("submit", { bubbles: true, cancelable: true }),
    );
  });
  await expect(
    page.getByRole("heading", { name: "Povpraševanje je oddano." }),
  ).toBeVisible();
  expect(requests).toBe(2);
  expect(await events(page)).toEqual([
    [
      "event",
      "conversion",
      {
        send_to: "AW-18531808239/YQbkCOaJz7gdEO_n04RF",
        value: 1,
        currency: "EUR",
        transaction_id: "browser-receipt",
      },
    ],
  ]);
  await page.reload();
  expect(await events(page)).toEqual([]);
});

test("legacy analytics, necessary-only and honeypot receipts never convert", async ({
  page,
}) => {
  await page.addInitScript(() =>
    localStorage.setItem("ju-tan-analytics", "accepted"),
  );
  await page.route("**/api/contact", (route) =>
    route.fulfill({ json: { success: true } }),
  );
  await page.goto("/kontakt");
  await expect(page.getByRole("button", { name: "Samo nujno" })).toBeVisible();
  expect(await page.locator("#ju-tan-google-ads").count()).toBe(0);
  await page.getByRole("button", { name: "Samo nujno" }).click();
  await fill(page);
  await page.locator('#contact-form [type="submit"]').click();
  await expect(
    page.getByRole("heading", { name: "Povpraševanje je oddano." }),
  ).toBeVisible();
  expect(await events(page)).toEqual([]);
  await page.getByRole("button", { name: "Nastavitve piškotkov" }).click();
  await page
    .getByLabel("Merjenje uspešnih povpraševanj iz oglasov (Google Ads)")
    .check();
  await page.getByRole("button", { name: "Shrani izbiro" }).click();
  expect(await events(page)).toEqual([]);
  await page.reload();
  await fill(page);
  await page.locator('#contact-form [type="submit"]').click();
  await expect(
    page.getByRole("heading", { name: "Povpraševanje je oddano." }),
  ).toBeVisible();
  expect(await events(page)).toEqual([]);
});

test("ad landing page opens an immediately usable preselected contact form", async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem("ju-tan-analytics", "necessary");
    localStorage.setItem("ju-tan-ads-v1", "necessary");
  });
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/spletne-strani-in-ui-ux");
  const heading = page.getByRole("heading", {
    level: 1,
    name: "Izdelava spletnih strani za podjetja",
  });
  await expect(heading).toBeVisible();
  await expect(page.getByRole("link", { name: "Pridobite ponudbo" })).toBeVisible();

  await page.getByRole("link", { name: "Pridobite ponudbo" }).click();
  await expect(page).toHaveURL(/\/kontakt\?service=web$/);
  await expect(page.getByRole("heading", { level: 1, name: "Pošljite povpraševanje" })).toBeVisible();
  await expect(page.locator("#contact-form")).toBeVisible();
  await expect(page.locator("#contact-form select[name=service]")).toHaveValue("Spletne strani / UI-UX");
  expect(pageErrors).toEqual([]);
});

for (const width of [320, 375, 390, 768, 1024, 1440]) {
  test(`ad-to-contact layout stays usable at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 840 });
    await page.addInitScript(() => {
      localStorage.setItem("ju-tan-analytics", "necessary");
      localStorage.setItem("ju-tan-ads-v1", "necessary");
    });
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));

    await page.goto("/spletne-strani-in-ui-ux");
    await expect(page.getByRole("heading", {
      level: 1,
      name: "Izdelava spletnih strani za podjetja",
    })).toBeVisible();
    await expect.poll(() => page.evaluate(() =>
      document.documentElement.scrollWidth <= window.innerWidth
    )).toBe(true);

    await page.getByRole("link", { name: "Pridobite ponudbo" }).click();
    await expect(page).toHaveURL(/\/kontakt\?service=web$/);
    await expect(page.locator("#contact-form")).toBeVisible();
    await expect(page.locator("#contact-form select[name=service]"))
      .toHaveValue("Spletne strani / UI-UX");
    await expect.poll(() => page.evaluate(() =>
      document.documentElement.scrollWidth <= window.innerWidth
    )).toBe(true);
    expect(errors).toEqual([]);
  });
}
