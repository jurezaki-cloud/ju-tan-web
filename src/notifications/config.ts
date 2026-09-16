export const notificationConfig = {
  senderName: "JU-TAN",
  companyName: "JU-TAN",
  supportNote: "Če niste pričakovali tega sporočila, ga ignorirajte.",
  maxRetries: 3,
  emailEnabled: process.env.JU_TAN_EMAIL_DELIVERY === "1",
  webhookEnabled: process.env.JU_TAN_WEBHOOK_DELIVERY === "1",
  webhookSecret: process.env.JU_TAN_WEBHOOK_SECRET ?? "",
};

export function relativeInviteLink(link: string) {
  if (link.startsWith("/")) return link;
  try {
    return new URL(link).pathname || "/invite";
  } catch {
    return "/invite";
  }
}

export function hashValue(value: string) {
  let hash = 2166136261;
  for (const byte of new TextEncoder().encode(value)) {
    hash ^= byte;
    hash = Math.imul(hash, 16777619);
  }
  return `ntf:${(hash >>> 0).toString(16)}:${value.length}`;
}

