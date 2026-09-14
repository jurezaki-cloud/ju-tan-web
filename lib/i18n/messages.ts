import { defaultLocale, type Locale } from "@/i18n/config";
import sl from "@/messages/sl.json";

const catalogs = {
  sl,
} as const;

export type Messages = typeof sl;

export function getLocale(): Locale {
  return defaultLocale;
}

export function getMessages(): Messages {
  return catalogs.sl;
}
