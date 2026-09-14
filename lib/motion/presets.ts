import type { Transition, Variants } from "framer-motion";

export const motionEase = [0.16, 1, 0.3, 1] as const;

export const motionDuration = {
  fast: 0.15,
  base: 0.25,
  slow: 0.5,
} as const;

export const defaultTransition: Transition = {
  duration: motionDuration.base,
  ease: motionEase,
};

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: defaultTransition },
};

export const fadeDown: Variants = {
  hidden: { opacity: 0, y: -24 },
  show: { opacity: 1, y: 0, transition: defaultTransition },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.96 },
  show: { opacity: 1, scale: 1, transition: defaultTransition },
};

export const reveal: Variants = {
  hidden: { opacity: 0, y: 32, filter: "blur(8px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { ...defaultTransition, duration: motionDuration.slow },
  },
};

export const floatTransition: Transition = {
  duration: 4.5,
  repeat: Infinity,
  repeatType: "mirror",
  ease: "easeInOut",
};

export const staggerContainer = (stagger = 0.12, delay = 0): Variants => ({
  hidden: {},
  show: {
    transition: {
      staggerChildren: stagger,
      delayChildren: delay,
    },
  },
});

export const hoverLift = {
  y: -8,
  scale: 1.02,
  transition: defaultTransition,
};

export const hoverGlow = {
  boxShadow: "var(--shadow-glow)",
  transition: defaultTransition,
};

export const reducedMotion = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.01 } },
} satisfies Variants;
