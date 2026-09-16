function resolveSiteUrl() {
  const fallback = "https://ju-tan.com";
  const raw = process.env.NEXT_PUBLIC_SITE_URL ?? fallback;

  try {
    return new URL(raw).origin;
  } catch {
    return fallback;
  }
}

function optionalHttpsUrl(raw: string | undefined) {
  if (!raw) return undefined;
  try {
    const url = new URL(raw);
    if (url.protocol !== "https:" && url.protocol !== "http:") return undefined;
    return url.toString();
  } catch {
    return undefined;
  }
}

export const siteConfig = {
  name: "JU-TAN",
  url: resolveSiteUrl(),
  locale: "sl_SI",
  language: "sl",
  copyrightYear: 2026,
  github: optionalHttpsUrl(process.env.NEXT_PUBLIC_GITHUB_URL),
  linkedin: optionalHttpsUrl(process.env.NEXT_PUBLIC_LINKEDIN_URL),
} as const;
