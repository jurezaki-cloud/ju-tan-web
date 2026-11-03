# JU-TAN FREE LAB — platform foundation

Status: review preview, 2026-11-03. Production release requires explicit owner approval.

## Existing architecture

Next.js 16.3.5 App Router, React 19, TypeScript, Tailwind 4, existing local Geist/Syne fonts and JU-TAN brand assets. Root providers supply theme and consent-gated analytics. Existing Header/Footer and global reduced-motion behavior are reused. The platform/identity and licensing surfaces remain separate; `/free` is public through the existing proxy rules.

Vercel: existing `ju-tan-web` project, JU-TAN Studio team, Next.js framework, Node 24, GitHub integration. Existing CSP/security headers and preview noindex remain in force. `vercel.json` retains the existing license-backup cron; no hosting settings or secrets changed.

## Module boundaries

- `lib/free-lab/catalog.ts`: typed registry, status/action discriminated union, category and accent-insensitive search. No runtime dependencies added.
- `components/free-lab/ToolCatalog.tsx`: small client boundary for search and filters; initial catalog is server-rendered. No network search, uploads, storage or tracking added.
- `app/free`: static landing page, shared layout and isolated CSS module, generated OG image.
- `app/free/[slug]`: six static introduction pages. These are noindex and omitted from the sitemap until substantive tool releases. Unknown slugs return 404.
- Existing `/magic` is reused for greeting cards, clearly named Magic Surprise. PDF, QR, image processing, quiz and site analysis are planned, not implemented by this foundation.

When implementing a tool, keep its runtime out of the catalog bundle, add a dedicated route/module and functional tests, and only change its available status once the action works. Review indexing and schema at that point. Do not advertise local file processing until verified. Website Doctor requires URL/SSRF protections, rate limits and caching before enabling requests.

## Verification

Commands: `npm run test:free-lab`, `npm run test:seo`, `npm run test:hardening`, `npm run typecheck`; scoped ESLint on `app/free`, `components/free-lab`, `lib/free-lab`.

2026-11-03 results:

- All 3 catalog tests, 4 existing SEO tests, existing hardening suite, TypeScript and scoped ESLint passed.
- Vercel Turbopack preview build succeeded for commit `89812dd80c76431d110616ad7c43c887f6da9128`.
- Preview HTTP 200, prerendered response, one H1, canonical `https://ju-tan.com/free`, descriptive title/description, structured CollectionPage/breadcrumb and preview `X-Robots-Tag: noindex, nofollow` verified.
- Browser: search without accents, zero results, reset, category filtering, PDF introduction/back navigation, light/dark theme, mobile menu Escape/focus restoration. No horizontal overflow at 320, 390 or 768 CSS px. Desktop also visually inspected. Browser emulation is not real iOS/Android testing.
- Local Windows builds were blocked by junction/mkdir permissions affecting existing server output. Vercel build provides the successful full-build verification.
- Full lint has an existing `react-hooks/set-state-in-effect` failure in `components/contact/ContactForm.tsx:58`; this PR does not change that component.
- `npm audit --omit=dev` reported 2 critical, 7 high and 6 moderate advisories in existing dependencies. This is the package audit severity count, not a confirmed exploitability assessment. Lockfile/dependency versions are unchanged. Remediate separately before production.
- Lighthouse CLI could not connect to its local browser debugging endpoint in this environment. No numeric performance/accessibility scores or Core Web Vitals claim is made. Run a mobile Lighthouse audit on the final preview before production; aim for Performance >=90, LCP <=2.5s, CLS <=0.1, and validate keyboard/screen-reader behavior and real mobile devices.

## Review

PR: https://github.com/jurezaki-cloud/ju-tan-web/pull/75

Initial verified preview: https://ju-tan-4x1283w46-ju-tan-studio.vercel.app/free

No merge or production deployment is authorized.
