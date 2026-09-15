export const duration = {
  fast: "200ms",
  base: "250ms",
  slow: "300ms",
} as const;

export const easing = {
  out: "cubic-bezier(0.16, 1, 0.3, 1)",
} as const;

export const motion = {
  duration,
  easing,
} as const;
