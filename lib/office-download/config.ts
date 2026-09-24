import {
  OFFICE_DOWNLOAD_FILENAME,
  OFFICE_DOWNLOAD_SESSION_TTL_MS,
} from "./constants";

function readSecret(name: string): string | undefined {
  const value = process.env[name]?.trim();
  return value ? value : undefined;
}

export type OfficeDownloadConfig = {
  password: string;
  sessionSecret: string;
  sessionTtlMs: number;
  filename: string;
};

export function getOfficeDownloadConfig(): OfficeDownloadConfig | null {
  const password = readSecret("JU_TAN_DOWNLOAD_PASSWORD");
  const sessionSecret = readSecret("JU_TAN_DOWNLOAD_SESSION_SECRET");

  if (!password || !sessionSecret) {
    return null;
  }

  if (sessionSecret.length < 32) {
    return null;
  }

  return {
    password,
    sessionSecret,
    sessionTtlMs: OFFICE_DOWNLOAD_SESSION_TTL_MS,
    filename: OFFICE_DOWNLOAD_FILENAME,
  };
}

export function isOfficeDownloadConfigured(): boolean {
  return getOfficeDownloadConfig() !== null;
}
