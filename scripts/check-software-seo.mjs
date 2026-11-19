import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const read = (path) => readFileSync(new URL("../" + path, import.meta.url), "utf8");
const page = read("app/razvoj-programske-opreme/page.tsx");
const hero = read("components/software-dev-page/SoftwareDevPage.tsx");
const seo = read("lib/seo.ts");
const sitemap = read("app/sitemap.ts");
const robots = read("app/robots.ts");

test("software SEO metadata and canonical helper", () => {
  assert.ok(page.includes('const pageTitle = "Razvoj programske opreme po meri za podjetja | JU-TAN"'));
  assert.ok(page.includes('"Razvoj poslovne programske opreme po meri:'));
  assert.ok(page.includes("title: { absolute: pageTitle }"));
  assert.ok(page.includes("createPageMetadata({"));
  assert.ok(seo.includes("canonical: url"));
});

test("exactly one H1 and service-related internal links", () => {
  assert.equal((hero.match(/<h1\b/g) ?? []).length, 1);
  assert.equal((page.match(/<h1\b/g) ?? []).length, 0);
  for (const route of ["/ju-tan-office", "/reference", "/kontakt?service=software"]) {
    assert.ok(page.includes('href="' + route + '"'), "Missing internal link: " + route);
  }
});

test("service URL in sitemap and public crawling allowed", () => {
  assert.ok(sitemap.includes("/razvoj-programske-opreme"));
  assert.ok(robots.includes('allow: "/"'));
  assert.ok(!robots.includes('"/razvoj-programske-opreme"'));
});

test("structured service and breadcrumb declarations", () => {
  for (const token of ['"@type": "WebPage"', '"@type": "Service"', "breadcrumbJsonLd(", "serializeJsonLd("]) {
    assert.ok(page.includes(token), "Missing structured data: " + token);
  }
});

test("software implementation wording, CTA, and FAQ remain aligned", () => {
  assert.ok(hero.includes("in implementaciji programske opreme po meri"));
  assert.ok(hero.includes("integracij z obstoječimi sistemi"));
  assert.ok(hero.includes("Kako poteka implementacija programske opreme v obstoječe podjetje?"));
  assert.ok(hero.includes("Pošljite povpraševanje za razvoj"));
  assert.ok(hero.includes('href="/kontakt?service=software"'));
});


test("contact and website service meta descriptions stay concise", () => {
  const contactPage = read("app/kontakt/page.tsx");
  const webPage = read("app/spletne-strani-in-ui-ux/page.tsx");
  const contactDescription = contactPage.match(/description:\s*"([^"]+)"/)?.[1];
  const webDescription = webPage.match(/const pageDescription\s*=\s*"([^"]+)"/)?.[1];

  for (const [route, description] of [
    ["/kontakt", contactDescription],
    ["/spletne-strani-in-ui-ux", webDescription],
  ]) {
    assert.ok(description, `Missing description for ${route}`);
    assert.ok(description.length >= 70, `Description too short for ${route}`);
    assert.ok(description.length <= 160, `Description too long for ${route}`);
    assert.ok(description.includes("JU-TAN"), `Missing branding for ${route}`);
  }
});
