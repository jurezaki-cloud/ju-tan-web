import { siteConfig } from "@/lib/config";

/**
 * CSRF defense for cookie-setting POSTs: require same-origin Origin/Referer
 * (or Sec-Fetch-Site same-origin when Origin is absent).
 */
export function isAllowedOfficeDownloadOrigin(request: Request): boolean {
  const host = request.headers.get("host")?.toLowerCase();
  if (!host) return false;

  const allowedHosts = new Set<string>([host]);
  try {
    allowedHosts.add(new URL(siteConfig.url).host.toLowerCase());
  } catch {
    // ignore invalid site config
  }

  const origin = request.headers.get("origin");
  if (origin) {
    try {
      return allowedHosts.has(new URL(origin).host.toLowerCase());
    } catch {
      return false;
    }
  }

  const referer = request.headers.get("referer");
  if (referer) {
    try {
      return allowedHosts.has(new URL(referer).host.toLowerCase());
    } catch {
      return false;
    }
  }

  const fetchSite = request.headers.get("sec-fetch-site")?.toLowerCase();
  return fetchSite === "same-origin";
}
