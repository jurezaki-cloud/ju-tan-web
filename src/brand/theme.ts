export const brandName = "JU-TAN";
export const brandShort = "JU-TAN";
export const brandColor = "#00D67A";
export const brandDark = "#080F0E";
export const brandLight = "#FBFAF9";
export const logoHeight = 48;
export const headerLogoHeight = {
  mobile: 28,
  desktop: 32,
} as const;
export const footerLogoHeight = 32;
export const markSize = 24;

export const brandAssets = {
  logos: {
    horizontal: {
      dark: "/brand/logo-horizontal-dark.svg",
      light: "/brand/logo-horizontal-light.svg",
      darkPng: "/brand/logo-horizontal-dark.png",
      lightPng: "/brand/logo-horizontal-light.png",
    },
    symbol: {
      dark: "/brand/symbol-dark.svg",
      light: "/brand/symbol-light.svg",
      darkPng: "/brand/symbol-dark.png",
      lightPng: "/brand/symbol-light.png",
    },
  },
  icons: {
    favicon: "/favicon.ico",
    faviconSource: "/brand/favicon.ico",
    favicon16: "/brand/favicon-16.png",
    favicon32: "/brand/favicon-32.png",
    favicon64: "/brand/favicon-64.png",
    favicon128: "/brand/favicon-128.png",
    favicon256: "/brand/favicon-256.png",
    appleTouch: "/brand/apple-touch-icon.png",
    android192: "/brand/android-chrome-192.png",
    android512: "/brand/android-chrome-512.png",
  },
  browserconfig: "/brand/browserconfig.xml",
  logoDark: "/brand/logo-horizontal-dark.svg",
  logoLight: "/brand/logo-horizontal-light.svg",
  logoDarkPng: "/brand/logo-horizontal-dark.png",
  logoLightPng: "/brand/logo-horizontal-light.png",
  markDark: "/brand/symbol-dark.svg",
  markLight: "/brand/symbol-light.svg",
  markDarkPng: "/brand/symbol-dark.png",
  markLightPng: "/brand/symbol-light.png",
  logoPng: "/brand/logo-horizontal-dark.png",
  logo: "/brand/logo-horizontal-dark.svg",
  mark: "/brand/symbol-dark.svg",
  favicon: "/favicon.ico",
  favicon16: "/brand/favicon-16.png",
  favicon32: "/brand/favicon-32.png",
  appleTouch: "/brand/apple-touch-icon.png",
} as const;

export type BrandAsset = string;
