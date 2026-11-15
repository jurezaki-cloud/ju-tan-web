# Contact form Google Ads conversion

Destination: `AW-18531808239/YQbkCOaJz7gdEO_n04RF`, value `1`, currency `EUR`.
The label and value were visually verified in the event-snippet screenshot from
the user's “Pregled Google Ads kampanje” conversation on 2026-11-15. Do not infer
a new label from the Ads ID.

The audited source had no Google tag or GTM installation. This change installs
one direct Google tag, not the previously mentioned `GTM-NGXMDBSM` container.
Do not add a second GTM conversion trigger for the same submission. Any external
GTM configuration or Ads account settings remain unverified.

`/api/contact` returns `conversionId` only after Resend accepts the message.
Honeypot responses deliberately omit it. ContactForm emits only after HTTP success
and `success: true`; validation failures, failed requests and page views never
emit. A synchronous ref prevents concurrent submissions, and receipt IDs dedupe
events in the page and populate Google's `transaction_id`. Separate successful
submissions count separately. This is accepted delivery, not proof of inbox arrival.
Automatic network retries are not implemented.

Ads needs a separate explicit choice (`ju-tan-ads-v1`); existing analytics consent
does not grant it. The script is blocked until opt-in. Consent Mode defaults deny
all categories, then grants only ad storage and ad user data for measurement.
Personalization remains denied. No form contents are sent to Google. Settings
can be reopened to revoke consent. In-flight conversions wait for script load;
revocation discards them, and later opt-in never replays denied submissions.
Private tool routes remain excluded. Blocked scripts do not prevent form success.

## Checks

- `npm run test:ads`: consent/receipt/deduplication tests and mocked mail API tests.
- `npx playwright install chromium`, then `npm run test:ads:browser`: real contact
  UI, double submission, error response, consent migration and honeypot success.
  Mail and Google requests are intercepted; no live lead or conversion is sent.
- `npm run typecheck`, `npm run lint`, `npm run build`.
- `NEXT_TEST_DIST_DIR` optionally isolates build output for local verification;
  the browser suite uses `.next-verify-browser` and Webpack.

Before an approved production release, use Tag Assistant to verify the live
destination, consent changes and one conversion per accepted test inquiry. Check
that the Ads conversion action uses the intended lead counting setting and that
there is no parallel GTM or URL-based conversion rule. No production publication
or merge is authorized by this change.

References: [Consent Mode](https://developers.google.com/tag-platform/security/guides/consent),
[Google Ads CSP requirements](https://developers.google.com/tag-platform/security/guides/csp),
[Google tag conversion measurement](https://developers.google.com/tag-platform/devguides/conversions).
