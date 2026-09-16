export const radius = {
  sm: "0.5rem",
  md: "0.625rem",
  lg: "0.625rem",
  xl: "0.875rem",
  card: "1.5rem",
  control: "0.625rem",
  check: "4px",
  pill: "999px",
} as const;

export type RadiusToken = keyof typeof radius;
