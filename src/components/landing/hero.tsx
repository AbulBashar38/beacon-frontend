"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight, Search, Activity, CheckCircle2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Eyebrow } from "@/components/shared/section";
import { AnimatedNumber } from "@/components/motion/animated-number";
import { BangladeshMapVisual } from "@/components/landing/bangladesh-map-visual";
import { staggerContainer, staggerItem, fadeUp } from "@/lib/motion";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* ambient background */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-grid text-foreground/60 [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,black,transparent)]" />
        <div className="absolute -top-24 left-1/2 size-[38rem] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute top-40 right-0 size-96 rounded-full bg-accent/10 blur-3xl" />
      </div>

      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-12 px-5 py-16 sm:px-8 lg:grid-cols-[1.05fr_1fr] lg:gap-8 lg:py-24">
        <motion.div
          variants={staggerContainer(0.1)}
          initial="hidden"
          animate="show"
          className="flex flex-col items-start gap-6"
        >
          <motion.div variants={staggerItem}>
            <Eyebrow>AI &amp; API Hackathon 2026</Eyebrow>
          </motion.div>

          <motion.h1
            variants={staggerItem}
            className="font-heading text-4xl font-bold tracking-tight text-balance sm:text-5xl lg:text-6xl"
          >
            Report a problem.{" "}
            <span className="text-primary">Watch your city respond.</span>
          </motion.h1>

          <motion.p
            variants={staggerItem}
            className="max-w-xl text-lg leading-relaxed text-muted-foreground text-balance"
          >
            Beacon turns everyday civic problems into resolved cases. Snap,
            locate and submit in under a minute — our AI triages severity, maps
            the hotspot and routes it to the right department.
          </motion.p>

          <motion.div
            variants={staggerItem}
            className="flex flex-col gap-3 sm:flex-row"
          >
            <Button asChild size="xl" variant="hero">
              <a href="#report">
                Report an issue
                <ArrowRight data-icon="inline-end" />
              </a>
            </Button>
            <Button asChild size="xl" variant="outline">
              <Link href="/track">
                <Search data-icon="inline-start" />
                Track a report
              </Link>
            </Button>
          </motion.div>

          <motion.dl
            variants={staggerItem}
            className="mt-2 flex flex-wrap items-center gap-x-8 gap-y-4 border-t border-border/70 pt-6"
          >
            <Stat value={48250} suffix="+" label="Issues resolved" />
            <Stat value={64} label="Districts live" />
            <Stat value={3.4} decimals={1} suffix="d" label="Avg. resolution" />
          </motion.dl>
        </motion.div>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          transition={{ delay: 0.15 }}
          className="relative"
        >
          <ConsolePanel />
        </motion.div>
      </div>
    </section>
  );
}

function Stat({
  value,
  label,
  suffix,
  decimals,
}: {
  value: number;
  label: string;
  suffix?: string;
  decimals?: number;
}) {
  return (
    <div className="flex flex-col">
      <dd className="font-heading text-2xl font-bold tracking-tight tabular-nums">
        <AnimatedNumber value={value} suffix={suffix} decimals={decimals} />
      </dd>
      <dt className="text-xs font-medium text-muted-foreground">{label}</dt>
    </div>
  );
}

function ConsolePanel() {
  return (
    <div className="relative rounded-3xl border border-console-border/60 bg-console p-3 shadow-[0_30px_80px_-30px_oklch(0.2_0.03_235/60%)]">
      <div className="rounded-[1.35rem] border border-console-border/50 bg-console-elevated/60 p-4">
        {/* console header */}
        <div className="flex items-center justify-between px-1 pb-3">
          <div className="flex items-center gap-2">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-success opacity-70" />
              <span className="relative inline-flex size-2 rounded-full bg-success" />
            </span>
            <span className="text-xs font-medium text-console-foreground">
              Live national grid
            </span>
          </div>
          <span className="font-mono text-[10px] uppercase tracking-widest text-console-muted">
            Beacon Ops
          </span>
        </div>

        <div className="relative rounded-xl bg-[color-mix(in_oklch,var(--console),black_18%)] p-2">
          <div className="bg-grid text-console-foreground/50 absolute inset-2 rounded-lg [mask-image:radial-gradient(ellipse_70%_70%_at_50%_50%,black,transparent)]" />
          <BangladeshMapVisual />

          {/* floating status cards */}
          <FloatingCard
            className="left-3 top-6"
            delay={0}
            icon={<Activity className="size-3.5 text-warning" />}
            title="New report"
            value="Waterlogging · Mirpur"
          />
          <FloatingCard
            className="right-3 bottom-16"
            delay={1.1}
            icon={<CheckCircle2 className="size-3.5 text-success" />}
            title="Resolved"
            value="Streetlight · Agrabad"
          />
        </div>

        {/* legend */}
        <div className="flex items-center justify-between px-1 pt-3">
          <div className="flex items-center gap-3">
            <Legend color="var(--map-heat-high)" label="Critical" />
            <Legend color="var(--map-heat-medium)" label="Moderate" />
            <Legend color="var(--map-heat-low)" label="Low" />
          </div>
          <span className="font-mono text-[10px] text-console-muted">
            MapLibre · OpenFreeMap
          </span>
        </div>
      </div>
    </div>
  );
}

function FloatingCard({
  className,
  icon,
  title,
  value,
  delay,
}: {
  className?: string;
  icon: React.ReactNode;
  title: string;
  value: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: [0, -6, 0] }}
      transition={{
        opacity: { delay: 0.9 + delay, duration: 0.4 },
        y: { delay: 1 + delay, duration: 4, repeat: Infinity, ease: "easeInOut" },
      }}
      className={`absolute flex items-center gap-2.5 rounded-xl border border-console-border/70 bg-console-elevated/95 px-3 py-2 shadow-lg backdrop-blur ${className}`}
    >
      <span className="flex size-7 items-center justify-center rounded-lg bg-[color-mix(in_oklch,var(--console),white_8%)]">
        {icon}
      </span>
      <span className="flex flex-col">
        <span className="text-[10px] font-medium uppercase tracking-wide text-console-muted">
          {title}
        </span>
        <span className="text-xs font-medium text-console-foreground">
          {value}
        </span>
      </span>
    </motion.div>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <span className="flex items-center gap-1.5">
      <span
        className="size-2 rounded-full"
        style={{ backgroundColor: color }}
      />
      <span className="text-[10px] font-medium text-console-muted">
        {label}
      </span>
    </span>
  );
}
