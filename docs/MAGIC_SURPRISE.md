# JU-TAN MAGIC SURPRISE

Public `/magic` MVP: animated cards, click-to-reveal messages, digital gift notes and invitations. Three themes, live preview, replay, native share sheet, clipboard and manual copy fallback. No login, new dependency, paid API or content database.

## Sharing and privacy

Versioned, Zod-validated UTF-8 JSON is base64url encoded in the URL fragment. The fragment is not sent in HTTP requests. This is **not encryption**: anyone with the link can read, edit or forward it. Links cannot be revoked and have no expiry. Do not use for sensitive information. User text is rendered by React as text, never HTML. No draft persistence. Changing a field invalidates the generated link. Invitations show event-local time, not a converted timezone; there is no RSVP or scheduled delivery.

The existing first-party daily page counter records only `/magic`, after analytics consent and subject to DNT/GPC. It stores aggregate counts, no card text or recipient details. It reuses the existing licensing PostgreSQL configuration and admin reporting; without that configuration analytics may fail but the app works. Vercel Analytics/Speed Insights are not mounted on this route. Sentry is not initialized for direct `/magic` loads. Infrastructure still handles normal HTTP requests and may keep access logs. No new analytics service or subscription is introduced.

SEO: static server-rendered landing content, canonical URL, generic Open Graph/Twitter metadata and sitemap entry. Shared messages stay out of metadata. The existing shared brand image is reused. Homepage footer links to the app.

## Verification

`npx --no-install tsx --test tests/magic.test.ts`

`npm run typecheck`

`npm run test:hardening`

`npm run build`

Manual/browser flow: create each type; edit a field after link creation; open link in a fresh tab; reveal and replay; invalid fragment; clipboard fallback; 390px viewport; keyboard focus; reduced motion; reject analytics and verify no visit request. Do not publish production without owner approval. Preview links point to the preview origin and should be regenerated after production release.
