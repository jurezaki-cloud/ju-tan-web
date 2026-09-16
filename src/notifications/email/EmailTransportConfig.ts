export type EmailTransportConfig = {
  enabled: boolean;
  host: string;
  port: number;
  secure: boolean;
  username: string;
  password: string;
  from: string;
  replyTo: string;
  connectionTimeoutMs: number;
  sendTimeoutMs: number;
};

export function loadEmailTransportConfig(): EmailTransportConfig {
  const secure = process.env.SMTP_SECURE === "1";
  return {
    enabled: process.env.JU_TAN_EMAIL_DELIVERY === "1",
    host: process.env.SMTP_HOST ?? "",
    port: Number(process.env.SMTP_PORT ?? (secure ? 465 : 587)),
    secure,
    username: process.env.SMTP_USER ?? "",
    password: process.env.SMTP_PASSWORD ?? "",
    from: process.env.SMTP_FROM ?? "",
    replyTo: process.env.SMTP_REPLY_TO ?? "",
    connectionTimeoutMs: Number(process.env.SMTP_CONNECTION_TIMEOUT_MS ?? 10_000),
    sendTimeoutMs: Number(process.env.SMTP_SEND_TIMEOUT_MS ?? 20_000),
  };
}

export function smtpReady(config = loadEmailTransportConfig()) {
  return config.enabled && Boolean(config.host) && Boolean(config.from);
}
