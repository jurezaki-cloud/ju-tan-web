export const colors = {
  background: "#050816",
  surface: "#0B1220",
  primary: "#22C55E",
  primaryHover: "#16A34A",
  text: "#FFFFFF",
  textSecondary: "#CBD5E1",
  muted: "#94A3B8",
  border: "rgba(255,255,255,.08)",
} as const;

export type ColorToken = keyof typeof colors;
