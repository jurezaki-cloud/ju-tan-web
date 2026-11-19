import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const read = (path) => readFileSync(new URL("../" + path, import.meta.url), "utf8");

const routes = [
  ["/", "app/page.tsx"],
  ["/spletne-strani-in-ui-ux", "app/spletne-strani-in-ui-ux/page.tsx"],
  ["/razvoj-programske-opreme", "app/razvoj-programske-opreme/page.tsx"],
  ["/graficno-oblikovanje", "app/graficno-oblikovanje/page.tsx"],
  ["/reference", "app/reference/page.tsx"],
  ["/kontakt", "app/kontakt/page.tsx"],
];

test("core public routes use the shared canonical metadata helper", () => {
  const seo = read("lib/seo.ts");
  assert.ok(seo.includes("canonical: url"));
  for (const [route, file] of routes) {
    const source = read(file);
    assert.ok(source.includes("createPageMetadata("), file + " is missing page metadata");
    if (route !== "/") {
      assert.ok(source.includes(route), file + " does not reference its canonical path");
    }
  }
});

test("core service and contact destinations are listed in sitemap", () => {
  const sitemap = read("app/sitemap.ts");
  for (const [route] of routes) {
    if (route === "/") continue;
    assert.ok(sitemap.includes("${origin}" + route), "Missing sitemap route: " + route);
  }
});

test("homepage services connect to the correct landing pages", () => {
  const services = read("components/sections/Services.tsx");
  for (const route of ["/spletne-strani-in-ui-ux", "/razvoj-programske-opreme", "/graficno-oblikovanje", "/kontakt"]) {
    assert.ok(services.includes('href: "' + route + '"') || services.includes('href="' + route + '"'), "Missing services destination " + route);
  }
});

test("contact CTA service parameters remain supported by the contact form", () => {
  const form = read("components/contact/ContactForm.tsx");
  const pages = [
    ["components/web-ui-page/WebUiPage.tsx", "web"],
    ["components/software-dev-page/SoftwareDevPage.tsx", "software"],
  ];
  for (const [file, key] of pages) {
    assert.ok(read(file).includes("/kontakt?service=" + key), "Service CTA missing in " + file);
    assert.ok(form.includes(key + ': "'), "Contact form does not recognize service " + key);
  }
});

test("preview and missing pages are excluded from indexing", () => {
  const config = read("next.config.ts");
  const metadata = read("lib/metadata.ts");
  const notFound = read("app/not-found.tsx");
  assert.ok(config.includes('key: "X-Robots-Tag", value: "noindex, nofollow"'));
  assert.ok(metadata.includes('process.env.VERCEL_ENV !== "preview"'));
  assert.ok(notFound.includes("index: false"));
});

test("homepage ecosystem modules navigate to relevant public service pages", () => {
  const stage = read("components/hero/HeroStage.tsx");
  assert.ok(stage.includes('import Link from "next/link"'));
  assert.ok(stage.includes("href={module.href}"));
  for (const destination of ["/graficno-oblikovanje", "/razvoj-programske-opreme", "/ju-tan-office"]) {
    assert.ok(stage.includes('href: "' + destination + '"'), "Missing ecosystem destination: " + destination);
  }
  assert.ok(!stage.includes("<button"), "Inactive decorative button remains in ecosystem");
});

test("reference inquiry CTA retains readable contrast and visible keyboard focus", () => {
  const page = read("app/reference/[slug]/page.tsx");
  assert.ok(page.includes('bg-emerald-500 px-6 py-3 text-sm font-semibold text-slate-950'));
  assert.ok(page.includes("focus-visible:ring-2 focus-visible:ring-emerald-300"));
  assert.ok(page.includes('href={inquiryHref}'));
});

test("graphic-design inquiry buttons use legible contrast and keyboard focus", () => {
  const page = read("app/graficno-oblikovanje/page.tsx");
  const ctas = page.match(/bg-emerald-500 px-6 py-3 text-sm font-semibold text-slate-950/g) ?? [];
  assert.equal(ctas.length, 2, "Both graphic inquiry CTAs should use dark text");
  assert.equal((page.match(/focus-visible:ring-2 focus-visible:ring-emerald-300/g) ?? []).length, 2);
  assert.equal((page.match(/href="\/kontakt\?service=graphic"/g) ?? []).length, 2);
});

test("reference card labels and links have light-theme contrast overrides", () => {
  const cards = read("components/sections/References.tsx");
  assert.ok(cards.includes("light:text-emerald-700 light:hover:text-emerald-800"));
  assert.ok((cards.match(/light:text-emerald-700/g) ?? []).length >= 3);
});
