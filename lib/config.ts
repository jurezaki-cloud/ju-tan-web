function resolveSiteUrl() {
  const fallback = "https://ju-tan.com";
  const raw = process.env.NEXT_PUBLIC_SITE_URL ?? fallback;

  try {
    return new URL(raw).origin;
  } catch {
    return fallback;
  }
}

export const siteConfig = {
  name: "JU-TAN",
  url: resolveSiteUrl(),
  locale: "sl_SI",
  language: "sl",
  copyrightYear: 2026,
} as const;
