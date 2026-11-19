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

test("reference SEO title stays concise without changing the visible heading", () => {
  const projectPage = read("app/reference/[slug]/page.tsx");
  const data = read("lib/data/project-studies.ts");
  const title = data.match(/seoTitle: "([^"]+)"/)?.[1];
  assert.ok(title, "The END metadata title must be set");
  assert.ok(title.length + " | JU-TAN".length <= 60, "The END full search title is too long");
  assert.ok(projectPage.includes("title: project.seoTitle ?? project.title"), "SEO title fallback is missing");
  assert.ok(projectPage.includes("{project.title}"), "Visible project title must remain unchanged");
});

test("APK catalog gives practical instructions and links to real app pages", () => {
  const apk = read("app/free-apk-za-podjetja/page.tsx");
  assert.ok(apk.includes('aria-labelledby="apk-guide-title"'), "APK installation guide missing");
  assert.ok(apk.includes('href: "/prejeti-racuni"'), "Received invoices app link missing");
  assert.ok(apk.includes('href: "/potni-nalogi"'), "Travel orders app link missing");
  assert.ok(apk.includes('href="/kontakt"'), "Support contact link missing");
});

test("homepage defers the below-fold interactive hero without dropping its content", () => {
  const homeHero = read("components/hero/Hero.tsx");
  const deferred = read("components/hero/HeroStageDeferred.tsx");
  assert.ok(homeHero.includes("HeroStageDeferred"), "Homepage must use deferred stage");
  assert.ok(deferred.includes('dynamic(() => import("./HeroStage")'), "Interactive stage must be code-split");
  assert.ok(deferred.includes("IntersectionObserver"), "Stage must load when seen");
  assert.ok(deferred.includes("min-h-[440px]"), "Mobile stage must reserve layout height");
});

test("cookie consent overlay stays above CTAs and floating assistant", () => {
  const cookie = read("components/legal/CookieBanner.tsx");
  const providers = read("components/common/Providers.tsx");
  const agent = read("components/ai/JuTanAgentLazy.tsx");
  assert.ok(cookie.includes("z-[70]"), "Cookie banner needs an explicit stacking layer");
  assert.ok(providers.includes("z-[70]"), "Cookie preferences control needs the same layer");
  assert.ok(agent.includes("z-[60]"), "Floating assistant must stay beneath cookie consent");
});

test("marketing sections do not load the animation library in the critical path", () => {
  const fade = read("components/animations/FadeIn.tsx");
  const office = read("components/sections/JuTanOffice.tsx");
  const deferred = read("components/sections/office/OfficeProductStageDeferred.tsx");
  assert.ok(!fade.includes("framer-motion"), "Common reveals must stay lightweight");
  assert.ok(fade.includes("IntersectionObserver"), "Marketing reveals need visibility observation");
  assert.ok(office.includes("OfficeProductStageDeferred"), "Office stage must be deferred");
  assert.ok(deferred.includes('dynamic(() => import("./OfficeProductStage")'), "Office animation must be code split");
  assert.ok(deferred.includes("rootMargin"), "Office showcase should load before it enters view");
});

test("above-fold brand only preloads the default visible variant", () => {
  const logo = read("components/common/BrandLogo.tsx");
  const light = logo.split("src={sources.light}")[1];
  assert.ok(light, "Theme-aware logo variant missing");
  assert.ok(light.includes('loading="lazy"'), "Hidden light logo must avoid eager preloading");
  assert.ok(light.includes('fetchPriority="low"'), "Hidden light logo should have low fetch priority");
  const cookie = read("components/legal/CookieBanner.tsx");
  assert.ok(cookie.includes('href="/politika-piskotkov"\n              prefetch={false}'), "Cookie policy link should not prefetch");
});

test("mobile navigation does not eagerly hydrate the animation framework", () => {
  const menu = read("components/layout/MobileNavigation.tsx");
  assert.ok(!menu.includes("framer-motion"), "Closed mobile menu must not load Framer Motion");
  assert.ok(menu.includes("mobile-nav-enter"), "Menu keeps its entrance animation");
  assert.ok(menu.includes('z-[60]'), "Menu must be above header and below consent");
  assert.ok(menu.includes('event.key === "Escape"'), "Escape close must be preserved");
  assert.ok(menu.includes("querySelectorAll<HTMLElement>(FOCUSABLE)"), "Focus trap must be preserved");
});


test("Office marketing section stays server-rendered while interactions remain deferred", () => {
  const office = read("components/sections/JuTanOffice.tsx");
  assert.ok(!office.startsWith('"use client"'), "Static Office marketing content should not hydrate as a full client component");
  assert.ok(office.includes("OfficeProductStageDeferred"), "Interactive Office stage must remain lazy");
  assert.ok(office.includes("<FadeIn"), "Section entrance transitions should remain available");
});


test("open mobile navigation stays above the floating assistant", () => {
  const header = read("components/layout/Header.tsx");
  const agent = read("components/ai/JuTanAgentLazy.tsx");
  const mobile = read("components/layout/MobileNavigation.tsx");
  assert.ok(header.includes("style={menuOpen ? { zIndex: 65 } : undefined}"), "Open header must outrank assistant layer");
  assert.ok(agent.includes("z-[60]"), "Assistant layer must remain below open navigation");
  assert.ok(mobile.includes("z-[60]"), "Mobile panel layer must remain set");
});

test("contact form explains missing consent without submitting data", () => {
  const form = read("components/contact/ContactForm.tsx");
  assert.ok(form.includes("disabled={loading}"), "Visitors need an enabled submit button to see validation errors");
  assert.ok(form.includes("contactSchema.safeParse"), "Contact submission must still require schema validation");
  assert.ok(form.includes("if (!parsed.success)"), "Invalid contact submissions must be rejected before fetch");
  assert.ok(!form.includes("disabled={loading || !consent}"), "Consent must not silently lock the submit button");
});

test("contact consent validation shows one actionable error", () => {
  const contact = read("components/contact/ContactForm.tsx");
  assert.ok(contact.includes("if (!consent) delete fieldErrors.consentAt"), "Do not show duplicate missing consent and timestamp warnings");
  assert.ok(contact.includes("contactSchema.safeParse"), "Keep strict server-compatible schema");
});

test("paid-search service page renders content without hydration-dependent reveal", () => {
  const page = read("components/web-ui-page/WebUiPage.tsx");
  assert.ok(page.includes("function StaticReveal("), "Landing-page content must remain server rendered");
  assert.ok(!page.includes('import { FadeIn }'), "Avoid client-side reveal animations on this landing page");
  assert.ok(page.includes('href="/kontakt?service=web"'), "Keep fast conversion path");
  assert.ok(page.includes("prefetch={false}"), "Offscreen project links must avoid eager RSC fetch");
  assert.ok(page.includes('prefetch={link.href === "/kontakt"}'), "Retain intentional contact prefetch");
});
test("marketing navigation avoids unintended background prefetch", () => {
  assert.ok(read("components/layout/HeaderLogo.tsx").includes("prefetch={false}"), "Header logo should not prefetch home on landing pages");
  assert.ok(read("components/layout/FooterColumns.tsx").includes("prefetch={false}"), "Footer service links should not prefetch every service");
  assert.ok(read("components/layout/Footer.tsx").includes("prefetch={false}"), "Legal links should not prefetch");
});

test("contact form remains visible immediately and keeps working", () => {
  const page = read("components/sections/Contact.tsx");
  assert.ok(!page.includes("FadeIn"), "Contact form must not wait for a scroll reveal animation");
  assert.ok(page.includes("<ContactForm />"), "Contact form remains available");
  assert.ok(page.includes("Pošljite povpraševanje"), "Keep conversion CTA heading");
});

test("brand SVG logos remain pixel-accurate lossless and below 25 kB", () => {
  for (const mode of ["dark", "light"]) {
    const svg = read(`public/brand/logo-horizontal-${mode}.svg`);
    assert.match(svg, /<svg[^>]+viewBox="0 0 1995 397"/);
    assert.match(svg, /data:image\/webp;base64,/);
    assert.ok(Buffer.byteLength(svg, "utf8") < 25000, `${mode} header logo should be under 25 kB`);
  }
});
