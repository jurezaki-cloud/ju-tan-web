# PR93 contact worker — isolated test candidate

Scope: `fix/pr93-readiness-security-test`, protected `ju-tan-web-p0-test` Preview only. No production deployment, Office changes, Ads changes, paid service or live schedule is enabled by these files.

## Projection to the dedicated contact database

After verifying the approved **test** Neon target, apply `scripts/sql/contact-inbox-projection.sql` manually. Runtime never runs DDL. Only `CONTACT_DATABASE_URL` is used; existing verified TLS requirements still apply. Use `sslmode=verify-full` for remote connections. No fallback to Office or generic database credentials.

The worker replays confirmed receipts into `contact_inbox_confirmed`, using the intent hash as the primary key and `ON CONFLICT DO NOTHING`. `contact_inbox_daily` counts rows by original service and the day of first server acceptance in Europe/Ljubljana. Neither browser time nor delivery day determines the day. The table holds no form body or contact details. It is separate from legacy `site_inquiry_daily`.

Every run replays all receipts, so a database outage or restoration can be repaired without re-sending mail. Projection failure returns 503 with `projectionPending`; intake and mail delivery remain independent. The immutable Blob daily records remain a separate confirmation count. No marker in Blob is treated as proof that a database row still exists.

## Protected execution and independent alarms

`node scripts/contact-runner.mjs worker` performs one authenticated POST; `monitor` performs a read-only GET with a separate secret. Both reject redirects and unexpected hosts. Provide secrets via the process environment, never CLI arguments or logs:

- `CONTACT_PREVIEW_ORIGIN`: exact protected Preview origin, HTTPS, no path/query.
- `CONTACT_ALLOWED_PREVIEW_HOST`: independently verified exact deployment hostname.
- `CONTACT_PROTECTION_BYPASS`: project-scoped Vercel protection bypass secret.
- `CONTACT_WORKER_SECRET` and `CONTACT_MONITOR_SECRET`: independent random values of at least 32 characters. The same names must exist on the Preview server.
- `CONTACT_ALERT_WEBHOOK` and `CONTACT_ALERT_ALLOWED_HOST`: approved independent HTTPS alarm receiver, not Resend. No receiver is provisioned or selected automatically.

An existing approved scheduler can call each command every five minutes. Alternatively `worker --repeat` or `monitor --repeat` runs sequentially with a five-minute delay between checks. Run the monitor independently of the worker; a process supervisor must alert if the monitor itself stops. Do not start both on a single failure domain and call that independent monitoring. The repeat mode reports failures to the webhook and stderr; one-shot mode also exits 1. Provisioning/activation and channel choice remain separate owner steps; no paid service is needed by the adapter itself.

Monitor alarms on 503, unsuccessful heartbeat at ten minutes, stale queue, reconciliation or projection failure, malformed responses and network errors. Alert payloads contain only event and mode. If the webhook fails, stderr reports its failure without exposing response bodies or secrets. External supervision must handle that failure too.

After 23 hours from the first actual delivery attempt, automatic re-delivery stops for manual provider reconciliation. Items beyond the batch limit do not prematurely start this clock. A stable Resend idempotency key protects overlapping calls and ambiguous responses within that window; this is not a claim of unlimited exactly-once delivery.

## Activation evidence still required

Verify the exact isolated database and Preview candidate before applying SQL/deploying. Then prove 2 confirmed + 1 queued → 2, recovery → 3, repeated drain → 3; three consecutive scheduled runs; stopped worker alarm; provider outage alarm; and restoration with no duplicate receipt. Local tests establish software behavior, not live Neon/Preview/scheduler availability. Do not disable Deployment Protection or enable hosted Ads local-test mode to make a test pass.
