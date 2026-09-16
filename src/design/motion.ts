export const duration = {
  hover: 0.22,
  reveal: 0.55,
} as const;

/** Shared easing — same curve as CSS `--ease-premium`. */
export const easeOut = [0.16, 1, 0.3, 1] as const;

export const easeInOut = [0.45, 0, 0.55, 1] as const;

export const easing = {
  out: "cubic-bezier(0.16, 1, 0.3, 1)",
  hover: "ease-out",
  inOut: "cubic-bezier(0.45, 0, 0.55, 1)",
} as const;

export const motion = {
  duration,
  easing,
  easeOut,
  easeInOut,
} as const;
