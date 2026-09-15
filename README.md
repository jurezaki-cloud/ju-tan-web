# JU-TAN

Production marketing site for JU-TAN, a Slovenian AI studio: agents, process automation, custom software, and web applications.

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
