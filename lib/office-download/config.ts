import {
  OFFICE_DOWNLOAD_FILENAME,
  OFFICE_DOWNLOAD_SESSION_TTL_MS,
} from "./constants";

const DEFAULT_OFFICE_INSTALLER_URL =
  "https://github.com/jurezaki-cloud/JU-TAN-Office/releases/download/v1.0.0/JU-TAN-Office-Setup.exe";

function readSecret(name: string): string | undefined {
  const value = process.env[name]?.trim();
  return value ? value : undefined;
}

export type OfficeDownloadConfig = {
  password: string;
  sessionSecret: string;
  installerUrl: string;
  githubToken?: string;
  sessionTtlMs: number;
  filename: string;
};

export function getOfficeDownloadConfig(): OfficeDownloadConfig | null {
  const password = readSecret("JU_TAN_DOWNLOAD_PASSWORD");
  const sessionSecret = readSecret("JU_TAN_DOWNLOAD_SESSION_SECRET");
  const installerUrl =
    readSecret("JU_TAN_OFFICE_INSTALLER_URL") ?? DEFAULT_OFFICE_INSTALLER_URL;

  if (!password || !sessionSecret) {
    return null;
  }

  if (sessionSecret.length < 32) {
    return null;
  }

  try {
    const parsed = new URL(installerUrl);
    if (parsed.protocol !== "https:" && parsed.protocol !== "http:") {
      return null;
    }
  } catch {
    return null;
  }

  return {
    password,
    sessionSecret,
    installerUrl,
    githubToken: readSecret("JU_TAN_GITHUB_TOKEN"),
    sessionTtlMs: OFFICE_DOWNLOAD_SESSION_TTL_MS,
    filename: OFFICE_DOWNLOAD_FILENAME,
  };
}

export function isOfficeDownloadConfigured(): boolean {
  return getOfficeDownloadConfig() !== null;
}
