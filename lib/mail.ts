export function getMailConfig(): { apiKey: string; from: string } | null {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const from =
    process.env.EMAIL_FROM?.trim() || process.env.FROM_EMAIL?.trim();

  if (!apiKey || !from) {
    return null;
  }

  return { apiKey, from };
}

export function shouldAssertMailOnBoot(): boolean {
  if (process.env.VERCEL_ENV === "preview") return false;
  if (process.env.NODE_ENV !== "production") return false;
  return true;
}

export function assertMailConfig(): { apiKey: string; from: string } {
  const config = getMailConfig();

  if (!config) {
    throw new Error(
      "Manjkata RESEND_API_KEY in EMAIL_FROM (ali FROM_EMAIL). Nastavite ju v okolju strežnika.",
    );
  }

  return config;
}
