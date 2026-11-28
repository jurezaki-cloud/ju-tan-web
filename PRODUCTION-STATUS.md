# ACTIVE TASK — SEO growth, 28 November 2026

Branch: feature/seo-growth-20261128. Base main: 069e5c976370158b2f4d8fba38bab93df29a558a.

- [x] Reuse owner-confirmed 311 impressions / 0 clicks; one scoped GSC page read, no repeated full audit.
- [x] Refine software-development snippet and implementation content; preserve premium design and Office/Ads code.
- [x] Prepare CSS-only progressive reveals and targeted SEO assertions (5/5 local PASS).
- [x] Targeted CI PASS 46099661283 and three-run paired mobile comparison completed.
- [x] PR #94 prepared; results in docs/seo-growth-20261128.md: score 100→100, LCP 909→1061 ms (worse), transfer −8.8%; inherited no-JS streaming limitation disclosed.
- [ ] Owner approval before any merge or production deployment.

Details: docs/seo-growth-20261128.md. No cosmetic or unrelated changes.

## Previous PR93 status (historical, retained for operational gates)

PR93 was merged externally into main 069e5c9; this agent did not merge or deploy it. Its final targeted hydration check passed: https://github.com/jurezaki-cloud/ju-tan-web/actions/runs/46062499412. Older candidate/CI entries below are historical, not current failures. Missing production resources and external alarms are not resolved by a merge alone.

# PRODUCTION STATUS — JU-TAN WEB PR #93

Updated: 2026-11-27 (Europe/Ljubljana). Decision: **NO-GO**. No merge or production deployment approved/performed.

## Completed

- [x] Owner-confirmed Preview: email, private Blob, worker healthy, Neon 3, pending/projectionPending/counterLag 0. Do not repeat submissions.
- [x] Production Vercel Cron prepared: /api/cron/contact-worker every 5 minutes.
- [x] Office license backup preserved: /api/cron/license-backup, 15 2 * * * UTC. Licensing/download runtime unchanged.
- [x] Protected cron + production guard + independent Healthchecks.io heartbeat/failure ping. No contact data in pings.
- [x] New cron/runner tests pass; security handler checks pass.
- [x] Runtime candidate 6e23a91630db4a7f7d0565e88facf78bcf250dd9 is in PR93.
- [x] Full CI run 46061690805: 12/13 jobs passed, including build, typecheck, lint, inbox, isolated PostgreSQL, security review and npm audit (0 vulnerabilities).
- [x] Read-only production/test environment inventory and rollback runbook prepared.
- [x] VPS/radio.ju-tan.com untouched; no paid service ordered; automatic Git deploy disabled.

## Current correction and verification

Browser CI had 49 passes and 1 failure: main form submitted native GET before hydration, putting synthetic contact fields into the URL. Treat as a privacy/reliability bug, not a flaky-test dismissal.
Correction: disable main form controls until hydrated and set explicit POST /api/contact on both forms. Add no-JavaScript regression.
Targeted workflow: .github/workflows/pr93-targeted.yml (P0 contact tests for affected forms, scoped lint, typecheck). Await result; do not repeat successful unrelated jobs.
Full CI and legacy verification are manually dispatched; no new full-repository runs for status-only edits.

## Remaining release blockers

- [ ] Finish targeted hydration/form checks and review their result.
- [ ] Configure Production-only CONTACT_DATABASE_URL, dedicated database/role and additive schema. Existing production Neon is ju-tan-licenses; do not repurpose it. Test Neon is not production.
- [ ] Configure distinct private production contact Blob/token, encryption key, worker/monitor keys, recipient, and CONTACT_DURABLE_INBOX=1. Do not copy test credentials.
- [ ] Create/arm Healthchecks.io free check (5-minute period, 5-minute grace), verify alerts to jurezaki@gmail.com and set sensitive CONTACT_HEARTBEAT_URL. No new paid subscription.
- [ ] Verify existing Pro cron allowance, actual production build Ads environment and separate Resend/test credential scope. Existing generic resources have shared scopes; complete isolation is not yet proven.
- [ ] Confirm usable contact-only emergency block/routing access for rollback; preserve Office cron and all inbox/receipt/key data. Prior production 908a06f predates durable inbox and is not a safe blind contact rollback.
- [ ] Explicit owner approval for merge and production deploy.
- [ ] After approved deploy: verify three real scheduled runs and zero lag; no synthetic Ads conversion without a separately approved target.

## Evidence

- Full CI: https://github.com/jurezaki-cloud/ju-tan-web/actions/runs/46061690805
- Release settings and rollback: docs/pr93-production-release.md
- PR: https://github.com/jurezaki-cloud/ju-tan-web/pull/93
- Durable report: https://app.notion.com/p/42504575274d815f86c0da637353185d

## Work constraints

Only remaining production blockers. No cosmetic changes or broad repository analysis. Run tests only for changed behavior or a concrete unresolved failure. Keep this file and Git progress current. Never expose secret values.
