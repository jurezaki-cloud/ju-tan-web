export const duration = {
  fast: 0.2,
  base: 0.32,
  slow: 0.55,
} as const;

/** Shared easing — same curve as CSS `--ease-premium`. */
export const easeOut = [0.16, 1, 0.3, 1] as const;

export const easing = {
  out: "cubic-bezier(0.16, 1, 0.3, 1)",
} as const;

export const motion = {
  duration,
  easing,
  easeOut,
} as const;
