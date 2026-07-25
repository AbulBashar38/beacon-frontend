"use client";

import { Activity, Database, RadioTower } from "lucide-react";

import { AnimatedNumber } from "@/components/motion/animated-number";
import { Stagger, StaggerItem } from "@/components/motion/stagger";
import { Section } from "@/components/shared/section";
import { useLandingData } from "@/contexts/landing-data-context";

export function ImpactStats() {
  const data = useLandingData();
  if (!data || data.totalReports === 0) return null;

  const resolutionRate = Math.round((data.resolvedReports / data.totalReports) * 100);
  const supportingStats = [
    { label: "Total civic signals", value: data.totalReports, note: "Accepted by the platform API" },
    { label: "Currently active", value: data.activeReports, note: "Pending review or in progress" },
    { label: "Location verified", value: data.mappedReports, note: "Reports with usable coordinates" },
  ];

  return (
    <Section id="impact" className="relative scroll-mt-16 overflow-hidden bg-[var(--landing-ink)] text-white">
      <div aria-hidden className="landing-grid absolute inset-0 opacity-25 [mask-image:radial-gradient(ellipse_80%_70%_at_100%_0%,black,transparent)]" />

      <div className="relative grid gap-10 lg:grid-cols-[.8fr_1.2fr] lg:gap-16">
        <div className="flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 font-mono text-[10px] font-semibold uppercase tracking-[0.17em] text-[var(--landing-signal)]">
              <RadioTower className="size-3.5" />
              04 / Public operations ledger
            </div>
            <h2 className="mt-5 max-w-xl font-heading text-4xl font-semibold leading-[1.04] tracking-[-0.045em] text-balance sm:text-5xl">
              Progress you can see, not promises you have to trust.
            </h2>
            <p className="mt-5 max-w-lg text-base leading-7 text-white/52">
              These figures come from Beacon&apos;s live reporting system and
              reflect the current lifecycle of submitted civic reports.
            </p>
          </div>

          <div className="mt-10 flex items-center gap-3 border-t border-white/10 pt-5 text-xs text-white/40">
            <Database className="size-4 text-[var(--landing-signal)]" />
            Live platform API · refreshed automatically
          </div>
        </div>

        <div className="overflow-hidden rounded-[1.7rem] border border-white/10 bg-white/[0.045]">
          <div className="grid gap-5 border-b border-white/10 p-6 sm:grid-cols-[1fr_auto] sm:items-end sm:p-8">
            <div>
              <p className="font-mono text-[9px] font-semibold uppercase tracking-[0.15em] text-white/38">
                Resolution rate
              </p>
              <div className="mt-2 font-heading text-6xl font-semibold tracking-[-0.06em] text-[var(--landing-signal)] tabular-nums sm:text-7xl">
                <AnimatedNumber value={resolutionRate} suffix="%" />
              </div>
            </div>
            <div className="max-w-52">
              <p className="text-sm font-semibold text-white">
                {data.resolvedReports} reports resolved
              </p>
              <p className="mt-1 text-xs leading-5 text-white/42">
                Based on all reports currently recorded by Beacon.
              </p>
            </div>
          </div>

          <Stagger className="grid sm:grid-cols-3">
            {supportingStats.map((stat) => (
              <StaggerItem
                key={stat.label}
                className="border-b border-white/8 p-5 last:border-b-0 sm:border-b-0 sm:border-r sm:last:border-r-0 sm:p-6"
              >
                <Activity className="size-4 text-white/28" aria-hidden="true" />
                <div className="mt-5 font-heading text-3xl font-semibold tracking-tight tabular-nums">
                  <AnimatedNumber value={stat.value} />
                </div>
                <p className="mt-2 text-xs font-semibold text-white/72">{stat.label}</p>
                <p className="mt-1 text-[10px] leading-4 text-white/32">{stat.note}</p>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </div>
    </Section>
  );
}
