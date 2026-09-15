export const locales = ["sl"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "sl";

export const localeNames = {
  sl: "Slovenščina",
} as const satisfies Record<Locale, string>;
