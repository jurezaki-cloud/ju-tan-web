export const radius = {
  sm: "0.5rem",
  md: "0.625rem",
  lg: "0.625rem",
  xl: "0.625rem",
  pill: "999px",
} as const;

export type RadiusToken = keyof typeof radius;