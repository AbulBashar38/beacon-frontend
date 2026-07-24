import type { Variants, Transition } from "motion/react";

/** Centralized easing + timing so motion feels like one system. */
export const ease = [0.22, 1, 0.36, 1] as const;

export const durations = {
  micro: 0.16,
  component: 0.24,
  overlay: 0.3,
  page: 0.4,
} as const;

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: durations.component, ease } },
};

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: durations.overlay, ease } },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.96 },
  show: {
    opacity: 1,
    scale: 1,
    transition: { duration: durations.component, ease },
  },
};

export const staggerContainer = (stagger = 0.08, delay = 0): Variants => ({
  hidden: {},
  show: {
    transition: { staggerChildren: stagger, delayChildren: delay },
  },
});

export const staggerItem: Variants = fadeUp;

export const cardHover: Transition = { duration: durations.micro, ease };
