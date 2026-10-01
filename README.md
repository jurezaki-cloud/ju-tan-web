# JU-TAN

Production marketing site for JU-TAN, a Slovenian software engineering studio: custom software, process automation, web applications, and AI agents.

Stack: Next.js App Router, React 19, TypeScript (strict), Tailwind CSS, Resend, Vercel.

## Product (now)

- Slovenian B2B homepage with sticky header, hero, services, process, technologies, projects, about, booking CTA, contact, privacy
- Contact API with Zod validation, GDPR consent, honeypot, rate limiting, HTML-escaped mail
- Production boot asserts Resend config; preview and `next dev` do not (the contact route still returns 503 if mail is unset)
- SEO: metadata, Open Graph, JSON-LD, sitemap, robots, canonical URLs
- Design tokens in `src/design/`

## Local development

```bash
npm install
cp .env.example .env.local
npm run dev
```

Required for contact mail: `RESEND_API_KEY` and `EMAIL_FROM` (or `FROM_EMAIL`). See `.env.example`.

```bash
npm run lint
npm run typecheck
npm run build
```

## Architecture notes

- App routes live in `app/`. UI in `components/`. Shared logic in `lib/`.
- Do not add product surfaces (CRM, admin, portal) until the marketing site is the lead engine and those products have a real backend.
- UI copy is Slovenian-only.

## Deploy

Vercel. Set `NEXT_PUBLIC_SITE_URL` to the production origin.

## License administration credentials and login limits

Before deploying the isolated license administration login, configure **unique** server-side values in Vercel for `JU_TAN_LICENSE_ADMIN_PASSWORD` (at least 16 characters) and `JU_TAN_LICENSE_ADMIN_SESSION_SECRET` (at least 32 characters). Do not reuse `JU_TAN_DOWNLOAD_PASSWORD` or `JU_TAN_DOWNLOAD_SESSION_SECRET`. Existing admin sessions become invalid after this change. The admin login deliberately returns 503 until the new values are configured.

Authentication attempts use PostgreSQL across serverless instances. In production configure `JU_TAN_AUTH_RATE_LIMIT_DATABASE_URL`, `LICENSING_DATABASE_URL`, or a working `DATABASE_URL`; the login and download authorization routes return 503 if none exists or the rate-limit database is unavailable. The database user needs permission to create and use `ju_tan_auth_attempts`. Client IP bucketing prefers Vercel’s `x-vercel-forwarded-for` so spoofed `x-real-ip` / `x-forwarded-for` values cannot rotate the limit key. Local development without a database uses an in-memory limit. Consider an additional Vercel WAF rate limit at the edge.

Run `npm run lint`, `npm run typecheck`, `npm run test:hardening`, and `npm run build` before deployment.
