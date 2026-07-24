"use client";

import { useEffect, useRef } from "react";
import {
  useInView,
  useMotionValue,
  useSpring,
  useTransform,
  motion,
} from "motion/react";

type AnimatedNumberProps = {
  value: number;
  /** Decimal places to render. */
  decimals?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
};

/** Counts up to `value` when scrolled into view. */
export function AnimatedNumber({
  value,
  decimals = 0,
  prefix = "",
  suffix = "",
  className,
}: AnimatedNumberProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const motionValue = useMotionValue(0);
  const spring = useSpring(motionValue, { duration: 1100, bounce: 0 });
  const display = useTransform(spring, (latest) => {
    const formatted = latest.toLocaleString("en-US", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
    return `${prefix}${formatted}${suffix}`;
  });

  useEffect(() => {
    if (inView) motionValue.set(value);
  }, [inView, value, motionValue]);

  return (
    <span ref={ref} className={className}>
      <motion.span>{display}</motion.span>
    </span>
  );
}
