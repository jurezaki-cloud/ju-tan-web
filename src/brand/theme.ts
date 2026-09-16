export const brandName = "JU-TAN";
export const brandShort = "JU-TAN";
export const brandColor = "#16A34A";
export const brandDark = "#050816";
export const brandLight = "#F8FAFC";
export const logoHeight = 48;
export const headerLogoHeight = {
  mobile: 38,
  desktop: 44,
} as const;
export const footerLogoHeight = 40;
export const markSize = 24;

export const brandAssets = {
  logo: "/brand/logo.svg",
  logoPng: "/brand/logo.png",
  logoDark: "/brand/logo-dark.svg",
  logoLight: "/brand/logo-light.svg",
  mark: "/brand/mark.svg",
  favicon: "/brand/favicon.svg",
  favicon16: "/brand/favicon-16.png",
  favicon32: "/brand/favicon-32.png",
  appleTouch: "/brand/apple-touch-icon.png",
  og: "/brand/og-image.png",
  twitter: "/brand/og-image.png",
  browserconfig: "/brand/browserconfig.xml",
} as const;

export type BrandAsset = (typeof brandAssets)[keyof typeof brandAssets];
