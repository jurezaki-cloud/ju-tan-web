export const locales = ["sl", "hr", "en", "de", "it"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "sl";

export const localeNames = {
  sl: "Slovenščina",
  hr: "Hrvatski",
  en: "English",
  de: "Deutsch",
  it: "Italiano",
} as const satisfies Record<Locale, string>;
