"use client";

import { motion, type HTMLMotionProps } from "motion/react";

import { staggerContainer, staggerItem } from "@/lib/motion";

type StaggerProps = HTMLMotionProps<"div"> & {
  stagger?: number;
  delay?: number;
  once?: boolean;
};

/** Reveals children in sequence as the container enters the viewport. */
export function Stagger({
  stagger = 0.08,
  delay = 0,
  once = true,
  ...props
}: StaggerProps) {
  return (
    <motion.div
      variants={staggerContainer(stagger, delay)}
      initial="hidden"
      whileInView="show"
      viewport={{ once, margin: "-60px" }}
      {...props}
    />
  );
}

/** A single item inside <Stagger>. */
export function StaggerItem(props: HTMLMotionProps<"div">) {
  return <motion.div variants={staggerItem} {...props} />;
}
