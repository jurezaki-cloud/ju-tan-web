import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import sitemap from "../app/sitemap";
import robots from "../app/robots";
import { defaultDescription, defaultKeywords, faqPageJsonLd, sitewideJsonLdGraph } from "../lib/seo";
import { offerCatalog, contactServiceOptions } from "../lib/data/service-catalog";
import { projectStudies } from "../lib/data/project-studies";

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

assert.match(defaultDescription, /Cerknica/);
assert.match(defaultDescription, /promocijskih videov/i);
assert.ok(offerCatalog.some((group) => group.name === "Videoprodukcija"));
assert.ok(contactServiceOptions.includes("Videoprodukcija"));

const requiredStudies = [
  "veli-joze",
  "kampradar",
  "tanjina-lucka-upanja",
  "ju-tan-office",
] as const;

for (const slug of requiredStudies) {
  const study = projectStudies.find((project) => project.slug === slug);
  if (!study) {
    throw new Error(`missing project study ${slug}`);
  }
  assert.equal(study.screenshot.src.startsWith("/"), true);
  assert.equal(
    existsSync(`public${study.screenshot.src}`),
    true,
    `missing screenshot ${study.screenshot.src}`,
  );
  assert.equal(
    existsSync(`app/reference/[slug]/page.tsx`),
    true,
    "case study route must stay in place",
  );
  assert.ok(
    urls.includes(`/reference/${slug}`),
    `sitemap missing /reference/${slug}`,
  );
}

const veliJoze = projectStudies.find((project) => project.slug === "veli-joze");
assert.equal(veliJoze?.name, "Veli Jože");
assert.equal(veliJoze?.screenshot.src, "/reference/veli-joze.webp");
assert.equal(veliJoze?.href, "https://www.veli-joze.eu/");

const referencesSource = readFileSync("components/sections/References.tsx", "utf8");
assert.match(referencesSource, /\/reference\/veli-joze/);
assert.match(referencesSource, /study\.screenshot\.src/);
assert.equal(referencesSource.includes("portfolioProjects"), false);
assert.equal(existsSync("lib/data/portfolio.ts"), false);

const caseStudySource = readFileSync("app/reference/[slug]/page.tsx", "utf8");
assert.match(caseStudySource, /project\.screenshot/);
assert.match(caseStudySource, /project\.href/);

const webUiSource = readFileSync("components/web-ui-page/WebUiPage.tsx", "utf8");
assert.match(webUiSource, /\/reference\/veli-joze/);

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
