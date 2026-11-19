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

test("web service SEO metadata and real project references stay consistent", () => {
  const webPage = read("app/spletne-strani-in-ui-ux/page.tsx");
  const webContent = read("components/web-ui-page/WebUiPage.tsx");
  const references = read("app/reference/page.tsx");
  const contact = read("app/kontakt/page.tsx");
  const description = webPage.split("const pageDescription =")[1]?.match(/"([^"]+)"/)?.[1];
  assert.ok(description, "Web service meta description missing");
  assert.ok(description.length <= 160, "Web service description should be concise");
  assert.ok(webPage.includes('path,'));
  assert.equal((webContent.match(/<h1\b/g) ?? []).length, 1);
  for (const route of ["/reference/instalacije-the-end", "/reference/veli-joze", "/kontakt?service=web"]) {
    assert.ok(webContent.includes(route), "Missing web service conversion link: " + route);
  }
  const referencesTitle = references.split("const pageTitle =")[1]?.match(/"([^"]+)"/)?.[1];
  assert.ok(referencesTitle, "Reference title missing");
  assert.ok(referencesTitle.length <= 50, "Reference title plus brand suffix is too long");
  const contactDescription = contact.split("description:")[1]?.match(/"([^"]+)"/)?.[1];
  assert.ok(contactDescription, "Contact description missing");
  assert.ok(contactDescription.length <= 160, "Contact description should be concise");
  assert.ok(webContent.includes('title: "Inštalacije THE END"'), "Case study name should match portfolio data");
  assert.ok(read("lib/data/project-studies.ts").includes('slug: "instalacije-the-end"'), "Referenced case study must exist");
  assert.ok(references.includes("Reference spletnih strani in poslovnih rešitev"));
  assert.ok(contact.includes("Kontaktirajte JU-TAN Studio v Cerknici za izdelavo spletnih strani"));
});

test("preview deployments stay noindex while production keeps crawl directives", () => {
  const rootMetadata = read("lib/metadata.ts");
  const sharedSeo = read("lib/seo.ts");
  assert.ok(rootMetadata.includes('process.env.VERCEL_ENV !== "preview"'), "Preview indexing safeguard is missing");
  assert.ok(rootMetadata.includes("index: process.env.VERCEL_ENV !== \"preview\""), "Preview index should be disabled");
  assert.ok(rootMetadata.includes('template: `%s | ${company.name}`'), "Shared page title template changed");
  assert.ok(sharedSeo.includes('alternates: {'), "Canonical metadata missing");
  assert.ok(sharedSeo.includes('canonical: url'), "Canonical URL must be absolute");
});
