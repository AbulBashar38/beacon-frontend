"use client";

import Link from "next/link";
import { motion } from "motion/react";
import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  MapPinned,
  Search,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import { BangladeshMapVisual } from "@/components/landing/bangladesh-map-visual";
import { AnimatedNumber } from "@/components/motion/animated-number";
import { Eyebrow } from "@/components/shared/section";
import { Button } from "@/components/ui/button";
import { useLandingData } from "@/contexts/landing-data-context";
import { fadeUp, staggerContainer, staggerItem } from "@/lib/motion";

const servicePromises = [
  { icon: Clock3, label: "Submit in under a minute" },
  { icon: ShieldCheck, label: "Privacy-aware public tracking" },
  { icon: MapPinned, label: "Bangladesh-wide location intelligence" },
];

export function Hero() {
  const data = useLandingData();
  const averageDays = data?.averageResolutionTimeHours
    ? data.averageResolutionTimeHours / 24
    : null;

  return (
    <section className="relative isolate overflow-hidden bg-[var(--landing-ink)] text-white">
      <div aria-hidden className="landing-grid absolute inset-0 -z-20 opacity-45 [mask-image:linear-gradient(to_bottom,black,transparent_88%)]" />
      <div aria-hidden className="landing-noise absolute inset-0 -z-20 opacity-25" />
      <div
        aria-hidden
        className="absolute -left-48 top-12 -z-10 size-[36rem] rounded-full border border-white/8 shadow-[0_0_0_70px_oklch(1_0_0/2%),0_0_0_140px_oklch(1_0_0/1.5%)]"
      />
      <div
        aria-hidden
        className="absolute right-[-10rem] top-[-12rem] -z-10 size-[42rem] rounded-full bg-[radial-gradient(circle,var(--landing-signal)_0%,transparent_68%)] opacity-[0.12] blur-2xl"
      />

      <div className="mx-auto w-full max-w-7xl px-5 pb-10 pt-12 sm:px-8 sm:pb-12 sm:pt-16 lg:px-10 lg:pb-16 lg:pt-20">
        <div className="grid items-center gap-14 lg:grid-cols-[1.04fr_.96fr] lg:gap-12">
          <motion.div
            variants={staggerContainer(0.09)}
            initial="hidden"
            animate="show"
            className="relative z-10 flex flex-col items-start"
          >
            <motion.div variants={staggerItem}>
              <Eyebrow className="border-white/12 bg-white/6 text-[var(--landing-signal)]">
                Bangladesh&apos;s civic response network
              </Eyebrow>
            </motion.div>

            <motion.h1
              variants={staggerItem}
              className="mt-6 max-w-3xl font-heading text-[clamp(2.85rem,7vw,5.4rem)] font-semibold leading-[0.96] tracking-[-0.055em] text-balance"
            >
              Your street sends a signal.
              <span className="mt-2 block text-[var(--landing-signal)]">
                The right team gets to work.
              </span>
            </motion.h1>

            <motion.p
              variants={staggerItem}
              className="mt-7 max-w-2xl text-base leading-7 text-white/62 text-balance sm:text-lg sm:leading-8"
            >
              Report damaged roads, broken lights, water leaks, and public hazards
              in one simple flow. Beacon uses AI and location intelligence to
              verify, prioritize, and route every civic signal.
            </motion.p>

            <motion.div
              variants={staggerItem}
              className="mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row"
            >
              <Button
                asChild
                size="xl"
                className="h-14 bg-[var(--landing-signal)] px-6 text-[var(--landing-ink)] shadow-[0_18px_45px_-20px_var(--landing-signal)] hover:-translate-y-0.5 hover:bg-[color-mix(in_oklch,var(--landing-signal),white_10%)]"
              >
                <a href="#quick-report">
                  Send a civic signal
                  <ArrowRight data-icon="inline-end" />
                </a>
              </Button>
              <Button
                asChild
                size="xl"
                variant="glass"
                className="h-14 border-white/12 bg-white/[0.055] px-6 text-white hover:bg-white/10"
              >
                <Link href="/track">
                  <Search data-icon="inline-start" />
                  Track a report
                </Link>
              </Button>
            </motion.div>

            <motion.ul
              variants={staggerItem}
              className="mt-8 grid w-full gap-3 border-t border-white/10 pt-6 sm:grid-cols-3"
              aria-label="Service assurances"
            >
              {servicePromises.map(({ icon: Icon, label }) => (
                <li key={label} className="flex items-center gap-2.5 text-xs leading-5 text-white/52">
                  <Icon className="size-4 shrink-0 text-[var(--landing-signal)]" aria-hidden="true" />
                  {label}
                </li>
              ))}
            </motion.ul>
          </motion.div>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            transition={{ delay: 0.14 }}
            className="relative mx-auto w-full max-w-[36rem] lg:ml-auto"
          >
            <ConsolePanel mappedReports={data?.mappedReports ?? null} />
          </motion.div>
        </div>

        <div className="landing-hairline mt-12 h-px lg:mt-16" />

        <div className="grid gap-6 pt-8 sm:grid-cols-[1fr_auto] sm:items-center">
          <div className="flex items-center gap-3">
            <span className="grid size-9 place-items-center rounded-full border border-[var(--landing-signal)]/25 bg-[var(--landing-signal)]/10 text-[var(--landing-signal)]">
              <Sparkles className="size-4" />
            </span>
            <div>
              <p className="text-sm font-semibold text-white">From public report to accountable response</p>
              <p className="mt-0.5 text-xs text-white/45">Every signal receives a public tracking code and visible progress history.</p>
            </div>
          </div>

          {data && data.totalReports > 0 ? (
            <dl className="grid grid-cols-3 gap-6 sm:gap-8">
              <Stat value={data.totalReports} label="Submitted" />
              <Stat value={data.resolvedReports} label="Resolved" />
              {averageDays != null ? (
                <Stat value={averageDays} decimals={1} suffix="d" label="Avg. response" />
              ) : (
                <Stat value={data.activeReports} label="In motion" />
              )}
            </dl>
          ) : null}
        </div>
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
      <dt className="order-2 mt-1 text-[9px] font-semibold uppercase tracking-[0.14em] text-white/38">
        {label}
      </dt>
      <dd className="order-1 font-heading text-xl font-semibold tracking-[-0.03em] text-white tabular-nums sm:text-2xl">
        <AnimatedNumber value={value} suffix={suffix} decimals={decimals} />
      </dd>
    </div>
  );
}

function ConsolePanel({ mappedReports }: { mappedReports: number | null }) {
  return (
    <div className="relative rounded-[2rem] border border-white/12 bg-white/[0.055] p-2.5 shadow-[0_45px_100px_-45px_black] backdrop-blur">
      <div className="overflow-hidden rounded-[1.55rem] border border-white/10 bg-[color-mix(in_oklch,var(--landing-ink),black_14%)]">
        <div className="flex items-center justify-between border-b border-white/8 px-4 py-3.5 sm:px-5">
          <div className="flex items-center gap-2.5">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-[var(--landing-signal)] opacity-55" />
              <span className="relative inline-flex size-2 rounded-full bg-[var(--landing-signal)]" />
            </span>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-white/72">
                National issue grid
              </p>
              <p className="mt-0.5 font-mono text-[9px] text-white/35">LIVE · BD / CIVIC / 2026</p>
            </div>
          </div>
          <span className="rounded-full border border-white/8 bg-white/5 px-2.5 py-1 font-mono text-[9px] text-white/45">
            {mappedReports == null ? "SYNCING" : `${mappedReports} MAPPED`}
          </span>
        </div>

        <div className="relative p-2.5 sm:p-3">
          <div className="absolute left-5 top-5 z-20 hidden max-w-[10rem] rounded-xl border border-white/12 bg-[var(--landing-ink)]/92 p-3 shadow-xl backdrop-blur sm:block">
            <div className="flex items-center gap-2">
              <span className="size-1.5 rounded-full bg-red-400" />
              <span className="text-[8px] font-bold uppercase tracking-[0.14em] text-red-300">Priority signal</span>
            </div>
            <p className="mt-2 text-[11px] font-medium leading-4 text-white/85">Drainage hazard detected</p>
            <p className="mt-1 font-mono text-[8px] text-white/35">AI confidence 94%</p>
          </div>

          <BangladeshMapVisual />

          <div className="absolute bottom-7 right-5 z-20 hidden rounded-xl border border-[var(--landing-signal)]/20 bg-[var(--landing-ink)]/92 p-3 shadow-xl backdrop-blur sm:block">
            <div className="flex items-center gap-2 text-[var(--landing-signal)]">
              <CheckCircle2 className="size-3.5" />
              <span className="text-[9px] font-bold uppercase tracking-[0.13em]">Route confirmed</span>
            </div>
            <p className="mt-1.5 text-[10px] text-white/55">Assigned to civic engineering</p>
          </div>
        </div>

        <div className="grid grid-cols-3 divide-x divide-white/8 border-t border-white/8">
          <ConsoleMetric label="AI triage" value="Active" />
          <ConsoleMetric label="Map layer" value="Density" />
          <ConsoleMetric label="Refresh" value="30 sec" />
        </div>
      </div>
    </div>
  );
}

function ConsoleMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="px-3 py-3 text-center">
      <p className="text-[8px] font-semibold uppercase tracking-[0.12em] text-white/28">{label}</p>
      <p className="mt-1 font-mono text-[9px] text-white/65">{value}</p>
    </div>
  );
}
