# JU-TAN FREE LAB — platform foundation

Status: review preview, 2026-11-03. Production release requires explicit owner approval.

## Existing architecture

Next.js 16.3.5 App Router, React 19, TypeScript, Tailwind 4, existing local Geist/Syne fonts and JU-TAN brand assets. Root providers supply theme and consent-gated analytics. Existing Header/Footer and global reduced-motion behavior are reused. The platform/identity and licensing surfaces remain separate; `/free` is public through the existing proxy rules.

Vercel: existing `ju-tan-web` project, JU-TAN Studio team, Next.js framework, Node 24, GitHub integration. Existing CSP/security headers and preview noindex remain in force. `vercel.json` retains the existing license-backup cron; no hosting settings or secrets changed.

## Module boundaries

- `lib/free-lab/catalog.ts`: typed registry, status/action discriminated union, category and accent-insensitive search.
- `components/free-lab/ToolCatalog.tsx`: small client boundary for search and filters; initial catalog is server-rendered. No network search, uploads, storage or tracking added.
- `app/free`: static landing page, shared layout and isolated CSS module, generated OG image.
- `app/free/[slug]`: five static introduction pages, excluding the dedicated QR Studio route. These are noindex and omitted from the sitemap until substantive tool releases. Unknown slugs return 404.
- Existing `/magic` is reused for greeting cards, clearly named Magic Surprise. PDF, image processing, quiz and site analysis remain planned.
- `app/free/qr-studio`: dedicated static page with metadata, WebApplication schema, sitemap inclusion and a browser-only editor. QR encoding is loaded on demand and never imported by the catalog.

## QR Studio first release

Six payloads: HTTP(S) link, WPA/WPA2 Personal or open Wi-Fi, mailto, telephone, SMS and vCard 3.0. Six tested dark palettes on white; exports are PNG/SVG at 512, 1024 or 2048px. The fixed four-module quiet zone and integer PNG module sizes protect readability. Logos, arbitrary colors, dynamic redirects, scan tracking and Enterprise Wi-Fi are not implemented.

`lib/free-lab/qr/payload.ts` validates/escapes input, normalizes telephone numbers, folds vCard lines on UTF-8 boundaries, and limits encoded content to 1000 bytes. `render.ts` accepts only approved export colors/sizes; SVG contains numeric module geometry rather than interpolated user content. Changing inputs invalidates the previous download until the matching preview is ready; pending encoder work is canceled on edit/unmount.

No QR payload goes to a server, URL, local/session storage or logging. Sentry, Vercel browser analytics/speed insights and the site visit tracker are excluded from QR Studio; the assistant button is hidden there. Fields are cleared on reload or with the clear button. Downloaded codes themselves contain the data, including Wi-Fi passwords, which is explained in the UI. Consent settings outside this route are preserved.

Dependencies: pinned `qrcode` 1.5.4 (MIT); dev-only `@types/qrcode` and independent `jsqr` decoder. Sources: [encoder documentation](https://github.com/soldair/node-qrcode), [Wi-Fi payload parser reference](https://github.com/zxing/zxing/blob/master/core/src/main/java/com/google/zxing/client/result/WifiResultParser.java), [independent decoder](https://github.com/cozmo/jsQR).

Tests: all six payload types decoded independently in every palette; SVG and PNG raster round-trips at each export size; Unicode/escaping, open-network password omission, injection rejection, vCard line folding, maximum-size payload and telemetry path exclusions. `npm run test:free-lab` now contains 11 passing tests. TypeScript, scoped lint, existing SEO and hardening suites also pass. New browser checks and preview build are recorded in PR #75. Real-camera/device interoperability still needs release QA; a software decoder is not a guarantee for all camera apps.

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
