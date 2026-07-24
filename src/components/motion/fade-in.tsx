"use client";

import { motion, type HTMLMotionProps } from "motion/react";

import { fadeUp } from "@/lib/motion";

type FadeInProps = HTMLMotionProps<"div"> & {
  /** Delay before the reveal, in seconds. */
  delay?: number;
  /** Reveal on scroll into view (default) or immediately on mount. */
  once?: boolean;
};

/**
 * Single-element scroll reveal. Respects reduced-motion via the global CSS
 * override and Framer's viewport gating.
 */
export function FadeIn({ delay = 0, once = true, ...props }: FadeInProps) {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={{ once, margin: "-80px" }}
      transition={{ delay }}
      {...props}
    />
  );
}
