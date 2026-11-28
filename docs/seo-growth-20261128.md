# SEO growth — 28 November 2026

Branch: feature/seo-growth-20261128. Exact main baseline: 069e5c976370158b2f4d8fba38bab93df29a558a. No merge or production deployment authorized.

## Evidence reused and scoped read

Owner supplied confirmed GSC Wizard baseline: software development page 311 impressions, 0 clicks; its date range was not supplied.
No full SEO audit was repeated. No saved shared GSC reports were available. One page-filtered GSC Wizard query retrieved page/query rows for https://ju-tan.com/razvoj-programske-opreme, property https://ju-tan.com/, web search, 29 October–25 November 2026 (settled date 25 November; API source).
Filtered page total: 338 impressions, 0 clicks, CTR 0%, average position 27.44. This is a newer window, not a correction claiming that the owner's 311 was wrong.
22 visible query rows cover 84.32% of page impressions; the remainder is not visible at query level. Do not sum visible rows as page totals.

Relevant rows:
- implementacija programske opreme v proizvodnjo podjetje: 76 impressions, 0 clicks, position 4.04.
- razvoj poslovne programske opreme: 26 impressions, 0 clicks, position 10.42.
- implementacija programske opreme za veleprodajna podjetja: 19 impressions, 0 clicks, position 11.68.
- razvoj programske opreme: 38 impressions, 0 clicks, position 36.32.

Inference: align the snippet and visible service explanation with implementation intent. This is an experiment, not a guarantee of ranking or CTR improvement. No invented completed projects, clients, prices or public-sector expertise were added.

## Changes

- Title and description now mention development and implementation, production/order/stock integration and a concrete next step. Canonical, URL and existing structured-data IDs unchanged; OG/Twitter and WebPage/Service descriptions share the same metadata.
- Keep the existing H1, premium layout/classes, palette, assets and software contact CTA. Refine introductory copy and the existing implementation paragraph; add manufacturing/wholesale FAQs rendered and serialized from the same data.
- Replace page-local hydrated reveal wrappers/IntersectionObservers with progressive CSS view-timeline reveals. Reduced-motion/unsupported browsers get visible content without JavaScript. No global animation component changes.
- Disable unnecessary prefetch on the below-fold Office marketing link; Office functionality untouched.
- No contact, consent, Google Ads, license, cron, dependency lockfile or application runtime configuration changes.

## Verification

Five targeted source SEO checks passed locally. The dedicated seo-growth workflow builds the exact baseline and candidate, runs scoped lint/typecheck and page regressions, then uses Lighthouse 13.6.0 on the same Linux runner and Chrome with default mobile simulation.
Three fresh browser measurements each, report median score/FCP/LCP/TBT/CLS/transfer bytes. Both servers use production builds and Preview analytics guards; external HTTPS requests are blocked consistently. No real form submission or Ads conversion.
The page checks verify canonical, one H1, schema parsing, software CTA, responsive overflow, server-rendered content, the inherited no-JavaScript shell limitation and identical premium hero typography. Dark/light mobile screenshots are artifacts.
This is a local laboratory comparison, not hosted CDN speed, field CWV or post-release organic growth. See the final evidence below.

## Release

Prepare PR with complete changes and evidence. Do not merge or deploy. The pre-existing PR93 operational gates remain separate; a successful SEO test does not establish production inbox/heartbeat readiness.
## Final evidence — 28 November 2026

CI PASS: https://github.com/jurezaki-cloud/ju-tan-web/actions/runs/46099661283 on 7af33fcecb12855c6de00de4c8fb976036c694db. Five targeted SEO assertions, scoped ESLint, TypeScript, both production builds and browser page regressions passed. Later changes are documentation only.

| Median mobile metric (3 runs each) | Main before | Candidate after |
|---|---:|---:|
| Lighthouse performance | 100 | 100 |
| FCP / LCP | 909.10 ms | 1060.84 ms |
| TBT | 46.5 ms | 51 ms |
| CLS | 0 | 0 |
| Transfer bytes | 511274 | 466291 |

Transfer fell 44983 bytes (8.8%). LCP increased 151.75 ms (16.7%); TBT increased 4.5 ms. This demonstrates less transfer, NOT a measured speed improvement. No additional tuning or repeated runs to select a more favorable result. The tradeoff is explicitly submitted for review.

No-JavaScript investigation: both exact main and candidate place content inside Next streaming hidden ancestor S:0 (heading height 0). Server text and the candidate reveal wrapper opacity are correct, but whole-page no-JavaScript usability does NOT pass. This is a reproduced baseline limitation, not introduced by the SEO change; it is outside this scoped change. Earlier benchmark failures came from incorrectly assuming baseline no-script usability. The final check compares both shells and records the limitation rather than claiming it fixed.

Dark mobile screenshots were visually compared: premium header, hero typography, colors and consent banner retained. Light screenshots are diagnostic only because the baseline capture includes a theme-transition frame. Automated checks confirm no horizontal overflow in either theme; they are not a full pixel-perfect visual audit.

Decision: GO for SEO code review, with the measured LCP tradeoff disclosed. NO-GO for production publication until owner approval and the separate PR93 production-resource/heartbeat gates are resolved. PR: https://github.com/jurezaki-cloud/ju-tan-web/pull/94. No merge, deployment, paid service, Ads campaign or consent configuration change performed.
