export const OFFICE_DOWNLOAD_COOKIE = "ju_tan_office_dl";
export const OFFICE_DOWNLOAD_FILENAME = "JU-TAN-Office-Setup.exe";
export const OFFICE_DOWNLOAD_SESSION_TTL_MS = 5 * 60 * 1000;
export const OFFICE_DOWNLOAD_COOKIE_PATH = "/api/office/download";

export const OFFICE_DOWNLOAD_NO_STORE = {
  "Cache-Control": "no-store, no-cache, must-revalidate, private",
  Pragma: "no-cache",
  Expires: "0",
} as const;

export const OFFICE_DOWNLOAD_GENERIC_ERROR = "Geslo ni pravilno.";
export const OFFICE_DOWNLOAD_UNAVAILABLE = "Prenos trenutno ni na voljo.";
export const OFFICE_DOWNLOAD_UNAUTHORIZED = "Prenos ni dovoljen.";
