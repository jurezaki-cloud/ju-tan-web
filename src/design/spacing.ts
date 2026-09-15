export const spacing = {
  8: "0.5rem",
  16: "1rem",
  24: "1.5rem",
  32: "2rem",
  48: "3rem",
  64: "4rem",
  96: "6rem",
  128: "8rem",
} as const;

export type SpacingToken = keyof typeof spacing;
