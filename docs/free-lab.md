# JU-TAN FREE LAB — platform foundation

Status: review preview, 2026-11-03. Production release requires explicit owner approval.

## Existing architecture

Next.js 16.4.5 App Router (updated from 16.3.5 during release hardening), React 19, TypeScript, Tailwind 4, existing local Geist/Syne fonts and JU-TAN brand assets. Root providers supply theme and consent-gated analytics. Existing Header/Footer and global reduced-motion behavior are reused. The platform/identity and licensing surfaces remain separate; `/free` is public through the existing proxy rules.

Vercel: existing `ju-tan-web` project, JU-TAN Studio team, Next.js framework, Node 24, GitHub integration. Existing CSP/security headers and preview noindex remain in force. `vercel.json` retains the existing license-backup cron; no hosting settings or secrets changed.

## Module boundaries

- `lib/free-lab/catalog.ts`: typed registry, status/action discriminated union, category and accent-insensitive search.
- `components/free-lab/ToolCatalog.tsx`: small client boundary for search and filters; initial catalog is server-rendered. No network search, uploads, storage or tracking added.
- `app/free`: static landing page, shared layout and isolated CSS module, generated OG image.
- `app/free/[slug]`: one static introduction page for the existing greeting tool, excluding dedicated PDF Master, QR Studio, Image Magic, Website Doctor and quiz routes. These are noindex and omitted from the sitemap until substantive tool releases. Unknown slugs return 404.
- Existing `/magic` is reused for greeting cards, clearly named Magic Surprise. Website Doctor now offers a local HTML review; automatic URL fetching remains deferred.
- `app/free/qr-studio`: dedicated static page with metadata, WebApplication schema, sitemap inclusion and a browser-only editor. QR encoding is loaded on demand and never imported by the catalog.

## QR Studio first release

Six payloads: HTTP(S) link, WPA/WPA2 Personal or open Wi-Fi, mailto, telephone, SMS and vCard 3.0. Six tested dark palettes on white; exports are PNG/SVG at 512, 1024 or 2048px. The fixed four-module quiet zone and integer PNG module sizes protect readability. Logos, arbitrary colors, dynamic redirects, scan tracking and Enterprise Wi-Fi are not implemented.

`lib/free-lab/qr/payload.ts` validates/escapes input, normalizes telephone numbers, folds vCard lines on UTF-8 boundaries, and limits encoded content to 1000 bytes. `render.ts` accepts only approved export colors/sizes; SVG contains numeric module geometry rather than interpolated user content. Changing inputs invalidates the previous download until the matching preview is ready; pending encoder work is canceled on edit/unmount.

No QR payload goes to a server, URL, local/session storage or logging. Sentry, Vercel browser analytics/speed insights and the site visit tracker are excluded from QR Studio; the assistant button is hidden there. Fields are cleared on reload or with the clear button. Downloaded codes themselves contain the data, including Wi-Fi passwords, which is explained in the UI. Consent settings outside this route are preserved.

Dependencies: pinned `qrcode` 1.5.4 (MIT); dev-only `@types/qrcode` and independent `jsqr` decoder. Sources: [encoder documentation](https://github.com/soldair/node-qrcode), [Wi-Fi payload parser reference](https://github.com/zxing/zxing/blob/master/core/src/main/java/com/google/zxing/client/result/WifiResultParser.java), [independent decoder](https://github.com/cozmo/jsQR).

Tests: all six payload types decoded independently in every palette; SVG and PNG raster round-trips at each export size; Unicode/escaping, open-network password omission, injection rejection, vCard line folding, maximum-size payload and telemetry path exclusions. `npm run test:free-lab` now contains 11 passing tests. TypeScript, scoped lint, existing SEO and hardening suites also pass. New browser checks and preview build are recorded in PR #75. Real-camera/device interoperability still needs release QA; a software decoder is not a guarantee for all camera apps.

When implementing a tool, keep its runtime out of the catalog bundle, add a dedicated route/module and functional tests, and only change its available status once the action works. Review indexing and schema at that point. Do not advertise local file processing until verified. Any future Website Doctor URL-fetching service requires DNS-pinned SSRF protections, shared rate limits and caching before enabling requests. The current local HTML review makes no such requests.

## Verification

### PDF Master first release

`/free/pdf-master` supports one output PDF assembled from up to ten source PDFs (20 MiB and 200 source/output pages in total). Blank range selects all pages; comma lists and ascending/descending ranges preserve requested order and permit duplicates. Documents can be moved up/down or removed. Rotation is added to source rotation without accumulating for repeated pages. There are no page thumbnails, text editing, OCR, compression or ZIP splitting. Extracting different ranges requires separate exports.

Pinned MIT dependency `pdf-lib` 1.17.1 is imported only by a separate module worker, created on selection/export. Each job has a 30-second timeout; cancellation/replacement/unmount terminates the worker and stale replies cannot restore old results. Files remain in browser memory and downloadable URLs are revoked on replacement/unmount. The route uses the same analytics, Sentry, assistant and visit-tracker exclusions as Image Magic. No API or storage service was added.

Encrypted PDFs and AcroForm fields are rejected. This is not a PDF sanitizer. The output does not preserve document outlines, accessibility tags or signature validity; the UI states these limitations and requests users keep originals. Existing annotations/content may be copied with pages. Bounds reduce resource risk, but are not a guarantee for every adversarial compressed PDF; use the cancellation/timeout and test real devices before release.

Tests cover page ranges/order/duplicates, reconstruction/rotation, source immutability, forms, encryption, malformed headers, size and output limits. The library's downlevel Error subclass does not reliably pass instanceof, so encrypted errors are matched against the exact pinned-library error message. Production audit after installing reports the same 15 advisories, none for the added PDF packages. Browser worker/download checks are recorded in PR #75.

API reference: [PDFDocument copyPages/load/save](https://pdf-lib.js.org/docs/api/classes/pdfdocument), [PDFPage rotation](https://pdf-lib.js.org/docs/api/classes/pdfpage).

### Slovenia Quiz Battle first release

`/free/kviz-slovenija` is explicitly a solo quiz, not a multiplayer service. Each round samples ten of twelve sourced questions and shuffles options on the start/replay event, avoiding hydration randomness. Each correct answer earns 100 points, independent of speed; there is no timer, account, public ranking, result persistence or backend. A reducer rejects skipped questions, invalid/double answers and actions after completion; score is derived from recorded answers. Feedback uses text as well as color, a live status region, and focus moves to the next question/result or returns to Start after reset. The final review includes every answer, explanation and source link.

Question facts verified 2026-11-03 against [GOV.SI](https://www.gov.si/podrocja/drzava-in-druzba/o-sloveniji/) and the [Slovenian Tourist Board](https://www.slovenia.info/en/places-to-go/attractions/postojna-cave). No third-party quiz questions are copied. Pure-state tests cover full mixed-score rounds, answer locking, reset, no duplicates and bank integrity. Browser completion and preview checks are recorded in PR #75. The small initial bank repeats between games; more categories, multiplayer and durable personal scores are not implemented. No dependencies added.

### Image Magic first release

`/free/image-magic` processes one static JPG/PNG/WebP locally with native browser APIs and no new dependencies. It preserves aspect ratio, never upscales, and offers 640/1280/1920/2560/4096px maximum edges and JPG/PNG/WebP export. JPEG uses a white background; PNG/WebP preserve alpha. Quality applies to JPEG/WebP. Actual output MIME is checked to prevent unsupported-format fallback from creating mislabeled files. Output size is shown honestly even if larger than the source.

Bounded header inspection precedes bitmap decoding: maximum 20 MiB, 24 MP and 12000px per edge. Animated PNG/WebP, SVG, GIF and HEIC are rejected. Browser decoding is still the authoritative validity check. Canvas export does not copy source EXIF; the browser handles orientation/color conversion. Output URLs and decoded bitmaps are released when replaced or unmounted; version counters discard stale asynchronous results after replacement/reset. The route shares private-tool telemetry exclusions. No image/name is sent to a service or stored in app storage.

Tests cover real JPEG, PNG and lossy/lossless WebP headers, bounds, truncated files, unsupported content, animation rejection, aspect ratio/no upscaling, safe filenames and private route recognition. Browser conversion/download validation is recorded in PR #75. HEIC, batch processing, cropping, real-device coverage and a full accessibility/performance audit remain outside this release.

API references: [createImageBitmap](https://developer.mozilla.org/en-US/docs/Web/API/Window/createImageBitmap), [Canvas toBlob and format fallback](https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/toBlob).

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

### Accessibility follow-up (2026-11-03)

The shared keyboard focus treatment now includes selects and textareas. QR input/select borders, mode buttons and the secondary download button, plus the catalog search border, use a dedicated control token instead of decorative divider colors. Calculated contrast against the adjacent panel/input backgrounds is 4.24–4.60:1 in dark mode and 3.65–3.83:1 in light mode. Color choices switch to three columns below 600px and retain a 44px minimum width. These targeted fixes do not constitute a full WCAG audit; screen-reader and real-device checks remain required.

PR: https://github.com/jurezaki-cloud/ju-tan-web/pull/75

Initial verified preview: https://ju-tan-4x1283w46-ju-tan-studio.vercel.app/free

No merge or production deployment is authorized.

## Website Doctor first release

`/free/website-doctor` reviews pasted full HTML locally using pinned MIT `htmlparser2` 12.0.0 in a disposable module worker. It does not mount the input in a DOM, execute scripts, load resources or send input to a server. Limits: 500 KiB UTF-8, 30,000 elements, 256 levels and an eight-second worker timeout. Edits, clear and unmount terminate pending jobs; old replies cannot restore a report. Download URLs are revoked. The route shares private-tool telemetry exclusions. No backend, credentials or paid service was added.

Eleven advisory checks cover title, description, language shape, H1 count, heading levels, viewport/zoom, canonical URL shape, meta robots, img alt presence, basic Open Graph metadata and charset. Findings contain only fixed explanations/counts, never source HTML, URLs or scripts. Missing/duplicate metadata is flagged; deliberate noindex, empty decorative alt and multiple H1s are explained rather than treated as definitive SEO/accessibility failures. Output is a plain-text report, not a quality percentage. The parser is forgiving, not a standards validator; malformed HTML, CSS visibility, HTTP headers, robots.txt, dynamically rendered content, resource availability, performance and WCAG conformity are outside this review. Script/style/template/noscript/SVG/MathML subtrees are excluded.

This first release intentionally accepts pasted HTML instead of automatically fetching arbitrary URLs. That avoids introducing server request abuse and recurring analysis costs. The separate Google PageSpeed Insights link opens a blank external tool; no HTML or URL is forwarded automatically. Automatic URL analysis remains a future feature, so this is not the full originally envisioned site audit.

Tests exercise known findings, complete basic metadata, entities, duplicate tags, zoom restrictions, unsafe canonical schemes, noindex, excluded subtrees, malicious content, UTF-8 size/depth/element bounds and privacy paths. Current build/browser verification is recorded in PR #75. References: https://github.com/fb55/htmlparser2 and https://developers.google.com/speed/docs/insights/v5/about .

## Release hardening (2026-11-04)

Next.js and eslint-config-next are pinned to 16.4.5. Compatible dependency refreshes resolve Sentry 10.78.0, Vercel Blob 2.8.2 and Zod 4.6.7. A scoped override updates @vercel/oidc's pinned @vercel/cli-config to 0.3.6, which consumes patched Zod. This avoids the audit tool's suggested Blob downgrade and leaves application/storage APIs unchanged. No forced major upgrades or hosting/environment changes were made.

Production audit fell from 15 affected packages (2 critical, 7 high, 6 moderate) to 5 moderate findings, with zero high/critical. Remaining production-tree findings are the Sentry bundler-plugin chain through glob and minimatch; these are tooling dependencies, not proof of a reachable runtime exploit. A compatible upstream resolution remains pending; blanket major-version overrides were not applied. The full development tree still reports 26 findings (24 moderate, 2 low). These are advisory counts, not a comprehensive security assessment.

The contact form's service-link preselection now reads browser location through useSyncExternalStore with an empty hydration snapshot. Only own whitelist entries are accepted. An untouched service field derives its value from the link; manual selections, including an explicit empty value, take precedence. This removes the synchronous setState-in-effect lint error without suppressing the rule or changing message delivery. Browser preselection/override and final build results are recorded in PR #75.

Repository-wide ESLint, typecheck, all 28 FREE LAB tests, four SEO checks and the existing hardening suite passed after the dependency update. Mobile speed and full screen-reader/physical-device audits remain release requirements; no numeric performance claim is made.

Sources: https://github.com/advisories/GHSA-2464-fhr4-w9xw , https://github.com/advisories/GHSA-mchm-gjx6-7h55 , https://github.com/advisories/GHSA-mrhx-c7xc-m3w5 , https://react.dev/reference/react/useSyncExternalStore .
