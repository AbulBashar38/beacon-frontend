import { ArrowRight, ShieldCheck } from "lucide-react";

import { Stagger, StaggerItem } from "@/components/motion/stagger";
import { Section } from "@/components/shared/section";
import { howItWorks } from "@/lib/landing-data";

const stageLabels = ["Citizen signal", "Beacon intelligence", "Public resolution"];

export function HowItWorks() {
  return (
    <Section
      id="how-it-works"
      className="relative scroll-mt-16 overflow-hidden bg-[var(--landing-ink)] text-white"
    >
      <div aria-hidden className="landing-grid absolute inset-0 opacity-30 [mask-image:linear-gradient(to_bottom,transparent,black_30%,black_70%,transparent)]" />

      <div className="relative grid gap-8 border-b border-white/10 pb-10 lg:grid-cols-[.7fr_1.3fr] lg:items-end">
        <div>
          <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.17em] text-[var(--landing-signal)]">
            02 / Response route
          </p>
          <h2 className="mt-4 font-heading text-4xl font-semibold leading-[1.04] tracking-[-0.045em] text-balance sm:text-5xl">
            One clear route from report to response.
          </h2>
        </div>
        <p className="max-w-2xl text-base leading-7 text-white/55 lg:justify-self-end lg:text-lg">
          Beacon structures the citizen report, adds AI-assisted context, and
          keeps the public record visible while government teams review and act.
        </p>
      </div>

      <Stagger
        stagger={0.1}
        className="relative mt-10 grid gap-0 lg:grid-cols-3"
      >
        {howItWorks.map((step, index) => {
          const Icon = step.icon;
          return (
            <StaggerItem
              key={step.step}
              className="group relative border-b border-white/10 py-7 last:border-b-0 lg:border-b-0 lg:border-r lg:px-8 lg:first:pl-0 lg:last:border-r-0 lg:last:pr-0"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--landing-signal)]">
                  {step.step} · {stageLabels[index]}
                </span>
                {index < howItWorks.length - 1 ? (
                  <ArrowRight className="hidden size-4 text-white/25 lg:block" aria-hidden="true" />
                ) : null}
              </div>
              <span className="mt-8 grid size-12 place-items-center rounded-2xl border border-white/10 bg-white/[0.055] text-[var(--landing-signal)] transition-colors group-hover:bg-[var(--landing-signal)] group-hover:text-[var(--landing-ink)]">
                <Icon className="size-5" aria-hidden="true" />
              </span>
              <h3 className="mt-5 font-heading text-xl font-semibold tracking-tight">
                {step.title}
              </h3>
              <p className="mt-2 max-w-sm text-sm leading-6 text-white/48">
                {step.description}
              </p>
            </StaggerItem>
          );
        })}
      </Stagger>

      <div className="relative mt-10 flex flex-col gap-3 rounded-2xl border border-[var(--landing-signal)]/18 bg-[var(--landing-signal)]/[0.07] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <span className="flex items-center gap-2.5 text-sm font-semibold">
          <ShieldCheck className="size-4 text-[var(--landing-signal)]" />
          Human teams remain responsible for every operational decision.
        </span>
        <span className="font-mono text-[9px] uppercase tracking-[0.13em] text-white/35">
          AI assists · officials review · citizens track
        </span>
      </div>
    </Section>
  );
}
