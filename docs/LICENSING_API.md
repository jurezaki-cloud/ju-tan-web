# JU-TAN Office licensing API

Desktop endpoints:

- POST /api/v1/licenses/activate
- POST /api/v1/licenses/validate
- POST /api/v1/licenses/deactivate

Vercel requires LICENSING_DATABASE_URL, JU_TAN_LICENSE_TOKEN_SECRET, and
JU_TAN_LICENSE_KEY_PEPPER. The two secrets must be different and at least 32
characters long. DATABASE_URL is used when LICENSING_DATABASE_URL is omitted.

The PostgreSQL schema is created idempotently on first use. License keys are
stored only as keyed hashes. Device identifiers are hashed again server-side,
activation tokens are random and stored only as keyed hashes, and device-limit
checks are transactional.

No production license is created automatically. Provision licenses only
through an authenticated admin workflow or a controlled one-off script.
