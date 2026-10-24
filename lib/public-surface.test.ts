import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import sitemap from "../app/sitemap";
import robots from "../app/robots";
import { defaultDescription, defaultKeywords, faqPageJsonLd, sitewideJsonLdGraph } from "../lib/seo";
import { offerCatalog, contactServiceOptions } from "../lib/data/services";
import { portfolioProjects } from "../lib/data/portfolio";

const entries = sitemap();
const urls = entries.map((entry) => new URL(entry.url).pathname);
const required = [
  "/",
  "/ju-tan-office",
  "/razvoj-programske-opreme",
  "/spletne-strani-in-ui-ux",
  "/reference",
  "/graficno-oblikovanje",
  "/videoprodukcija",
  "/kontakt",
  "/politika-zasebnosti",
  "/politika-piskotkov",
];

for (const path of required) {
  assert.ok(urls.includes(path), `sitemap missing ${path}`);
  assert.equal(existsSync(`app${path === "/" ? "" : path}/page.tsx`), true, `missing page ${path}`);
}

assert.equal(urls.includes("/booking"), false, "noindex booking must stay out of the sitemap");
assert.equal(urls.includes("/admin"), false);
assert.equal(new Set(urls).size, urls.length, "sitemap urls must be unique");

const robotRules = robots();
const rules = Array.isArray(robotRules.rules) ? robotRules.rules[0] : robotRules.rules;
const disallow = Array.isArray(rules?.disallow) ? rules.disallow : [rules?.disallow];
for (const prefix of ["/api/", "/admin/", "/login", "/dashboard"]) {
  assert.ok(disallow.includes(prefix), `robots should disallow ${prefix}`);
}
assert.match(String(robotRules.sitemap), /\/sitemap\.xml$/);

for (const phrase of [
  "izdelava spletnih strani",
  "grafično oblikovanje",
  "izdelava logotipa",
  "celostna grafična podoba",
  "videoprodukcija",
  "izdelava promocijskih videov",
  "razvoj programske opreme po meri",
  "poslovni program za podjetja",
  "AI rešitve za podjetja",
  "izdelava spletnih aplikacij",
  "Cerknica",
  "Notranjska",
]) {
  assert.ok(defaultKeywords.includes(phrase as (typeof defaultKeywords)[number]), phrase);
}

assert.match(defaultDescription, /Cerknice/);
assert.match(defaultDescription, /promocijski videi/i);
assert.ok(offerCatalog.some((group) => group.name === "Videoprodukcija"));
assert.ok(contactServiceOptions.includes("Videoprodukcija"));

const titles = portfolioProjects.map((project) => project.title);
assert.deepEqual(titles, [
  "Tanjina lučka upanja",
  "KampRadar",
  "JU-TAN Office",
  "JU-TAN Creative",
]);
assert.equal(titles.includes("Veli Jože"), false);

const faq = faqPageJsonLd(
  [{ question: "Test?", answer: "Odgovor." }],
  "public-surface-faq",
);
assert.equal(faq["@type"], "FAQPage");
assert.equal(faq.mainEntity[0]?.acceptedAnswer.text, "Odgovor.");

const graph = JSON.stringify(sitewideJsonLdGraph());
assert.match(graph, /LocalBusiness/);
assert.match(graph, /Cerknica/);
assert.match(graph, /Notranjska/);
assert.match(graph, /Videoprodukcija/);

const videoSource = readFileSync("app/videoprodukcija/page.tsx", "utf8");
assert.equal(videoSource.includes("index: false"), false);
assert.match(videoSource, /canonical|createPageMetadata/);
assert.match(videoSource, /BreadcrumbList|breadcrumbJsonLd/);
assert.match(videoSource, /"@type": "Service"/);

console.log("public surface checks passed");
