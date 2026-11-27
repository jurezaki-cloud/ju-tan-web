# PR93 production release gate — 27 November 2026

Status: NO-GO until the operational gates below are evidenced. This document does not authorize merge or deployment.

## Candidate and verified baseline

Build on 09b527f7e7065d7c380b3212726aaa7f6ac0699c, descendant of PR93 head 2e889bb729f03ca092572a982f5f3eaff4519855.
The owner confirmed Preview form/email/private Blob, healthy worker and three Neon inquiries with pending/projectionPending/counterLag all zero. Do not repeat those submissions.
Prior full CI: https://github.com/jurezaki-cloud/ju-tan-web/actions/runs/46055114875 (13 jobs); new operational code requires CI on its own SHA.

## Scheduling and independent supervision

The production vercel.json preserves /api/cron/license-backup at 15 2 * * * UTC, and adds /api/cron/contact-worker at */5 * * * * UTC. Git auto-deployment remains disabled.
Use the owner's existing Vercel Pro plan, with no plan upgrade. Cron/function/Blob usage is subject to existing metered allowances; this is not a promise of zero incremental usage.
Vercel cron sends the existing CRON_SECRET. The new handler checks it in constant time, accepts production only, and invokes the existing protected drain internally with a separate CONTACT_WORKER_SECRET. It never sends Office secrets externally. Missing/invalid config fails closed.
Maximum function duration is 240 seconds, below the five-minute interval. No automatic retries are added; existing durable receipt/idempotency logic handles duplicate invocations. Whole-history replay remains a capacity risk: observe duration and storage calls; stop release if the representative workload approaches the interval. Do not claim unbounded capacity.

Proposed external service: Healthchecks.io Hobbyist ($0, 20 checks as verified 27 November 2026).
- Create one private production check, period 5 minutes, grace 5 minutes.
- Enable and verify email integration to jurezaki@gmail.com. Alerts are sent by Healthchecks, independently of application Resend.
- Store its https://hc-ping.com/<UUID> URL as sensitive CONTACT_HEARTBEAT_URL, Production scope only.
- Success ping is sent only after healthy drain, including database projection and queue checks. Unhealthy drain sends /fail with no body. Timeout, unavailable Vercel, missing cron and failed ping delivery cause missing-heartbeat alarms externally.
- This replaces the proposed VPS monitor: radio.ju-tan.com and all Hetzner services must remain untouched.
- Before release, prove delivery of a failure and missing-heartbeat alarm using a separate synthetic check; do not stop the production worker. After approved deployment verify three scheduled runs and recovery state.
- A fresh check must be armed; a never-started check is not proof of monitoring. Do not mark monitoring active before the first ping and confirmed email route.

References:
https://vercel.com/docs/cron-jobs/usage-and-pricing
https://healthchecks.io/pricing/
https://healthchecks.io/docs/http_api/
https://healthchecks.io/docs/configuring_notifications/

## Production configuration inventory and gates

Read-only inventory of project prj_x1kQsWKu7jQAh3fouKiXue0hsJJN (ju-tan-web), team team_5X7MNLnGgm7FIEv1JLKVdpKe:
RESEND_API_KEY and EMAIL_FROM exist, each shared between Preview/Production. This corrects the older PR body which reported them absent.
New CONTACT_* variables are absent. Office CRON_SECRET, license secrets and database remain present and unchanged.
The generic DATABASE_* integration uses store_y5UuWIAjRNEk3RMO across Preview/Production; BLOB_READ_WRITE_TOKEN uses store_4ECzLVubTgDoVLqy across Production/Preview/Development. Do not repurpose these stores for contact intake.
The isolated project ju-tan-web-p0-test uses a different Neon integration store_6OlYSRD53mGHC4YM and Blob metadata store_cTKLZRnXhJF4c2P0. Its CONTACT_DATABASE_URL is shared within that test project's Preview/Production scopes. That project's Production scope is NOT ju-tan.com production.
Separate env records alone do not prove unequal secret values or distinct underlying stores; no secrets were decrypted for this inventory.

Required Production-only inputs on ju-tan-web:
- CONTACT_DATABASE_URL: dedicated production contact database and least-privilege role, verified TLS, no Office/test fallback. Apply reviewed additive SQL only to that identified database; record schema/role evidence.
- CONTACT_INBOX_BLOB_TOKEN: dedicated private production Blob store, distinct from test and Office stores.
- CONTACT_INBOX_ENCRYPTION_KEY: independently generated 32-byte hex key; securely retain for rollback/recovery. Do not rotate while retained records require it.
- CONTACT_WORKER_SECRET and CONTACT_MONITOR_SECRET: independent random >=32-byte values, distinct from CRON_SECRET/test.
- CONTACT_DURABLE_INBOX=1.
- CONTACT_EMAIL_TO: verified production recipient.
- CONTACT_HEARTBEAT_URL: verified external production check.
- RESEND_API_KEY: production sending key; configure separate test-project key without mutating Office/shared existing services blindly.
- EMAIL_FROM: verified sender; preserve existing verified production address.
- NEXT_PUBLIC_VERCEL_ENV must resolve to production from Vercel System Environment Variables at production build time. NEXT_PUBLIC_GOOGLE_ADS_LOCAL_TEST must be absent/0.

Do not copy test database URL, test Blob token, encryption keys or test recipients into production. Do not recreate or rotate existing Office secrets. No production DDL, new paid resource or deploy is performed by this candidate.

## Ads and consent

Code retains AW-18531808239/YQbkCOaJz7gdEO_n04RF. Only production environment + exact ju-tan.com/www.ju-tan.com + explicit Ads consent can load/send. Default consent denied; revocation clears pending; private tool paths excluded. Both forms require confirmed server receipt and use transaction_id; queued/error paths never count as conversions.
Reuse the prior 50 browser test results for unchanged behavior; full CI will exercise them once for the final changed candidate. No live Google Ads conversion or campaign change is authorized/performed here.
Production build variables and actual production Tag Assistant observation remain release checks; source tests are not proof of Ads ingestion. Prefer an approved isolated measurement target for synthetic positive checks.

## Rollback

Recorded current READY production deployment: dpl_CiL7LsayuyvnDwAzkK86RBkAu3xp, commit 908a06f72ca47f6014350f036d1de4adbfc6eb15, https://ju-tan-ed5cvdrho-ju-tan-studio.vercel.app.
Recheck active aliases immediately before release and record the approved new deployment ID/SHA.
1. For failed rollout or sustained unhealthy worker, freeze new contact intake at the routing layer while preserving Office routes and license cron. Record queue/receipt/projection state without PII.
2. Stop only the contact schedule if required; never disable all project crons (license-backup must run). Keep external monitoring enabled and annotate planned incident.
3. Retain private Blob intents, receipts, idempotency/tombstones, encryption key and additive contact tables. Never DROP/TRUNCATE or replay already confirmed mail.
4. Prefer forward repair or a previous inbox-compatible deployment. The old 908a06f predates durable inbox: do NOT blindly restore its contact endpoint while pending/ambiguous messages exist. If emergency UI rollback to the recorded deployment is needed, keep contact intake isolated/disabled and use the reviewed worker against retained storage until reconciliation completes.
5. Reconcile ambiguous delivery attempts with Resend before any manual resend, especially past the 23-hour automatic retry window. Rebuild database projection from receipts without resending mail.
6. Re-enable contact intake only after healthy queue/counter/projection and approved compatible release. Verify Office licensing/download and unchanged backup schedule using non-destructive checks. Resume auto-assignment only deliberately: Vercel rollback can disable automatic domain assignment.

## Final GO conditions

Exact candidate passes full CI/security review; PR93 points to it; production-only resources and keys independently verified; external alarm delivered and armed; Pro cron config accepted; rollback/contact-freeze method concrete and available; explicit owner approval for merge AND production deploy.
Until then: NO-GO. Do not mark a proposed service, missing secret or draft runbook as an activated capability.
