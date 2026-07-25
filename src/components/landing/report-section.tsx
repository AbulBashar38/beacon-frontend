import {
  ArrowUpRight,
  BellRing,
  MapPin,
  ShieldCheck,
  Sparkles,
  UserX,
} from "lucide-react";

import { QuickReportForm } from "@/components/forms/quick-report-form";
import { FadeIn } from "@/components/motion/fade-in";
import { Eyebrow } from "@/components/shared/section";

const assurances = [
  {
    icon: UserX,
    title: "Open to everyone",
    description: "No account or app download required.",
  },
  {
    icon: Sparkles,
    title: "AI-assisted triage",
    description: "Category, priority, and duplicates are checked.",
  },
  {
    icon: MapPin,
    title: "Location verified",
    description: "A precise place helps the right team respond.",
  },
  {
    icon: BellRing,
    title: "Progress stays public",
    description: "A tracking code follows the case to resolution.",
  },
];

export function ReportSection() {
  return (
    <section
      id="report"
      className="relative scroll-mt-16 bg-[var(--landing-paper)] py-20 sm:py-28 lg:py-32"
    >
      <div aria-hidden className="absolute inset-x-0 top-0 h-px bg-black/6" />
      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 items-start gap-12 px-5 sm:px-8 lg:grid-cols-[.76fr_1.24fr] lg:gap-16 lg:px-10">
        <FadeIn className="lg:sticky lg:top-28">
          <Eyebrow>01 / Send a report</Eyebrow>
          <h2 className="mt-5 max-w-xl font-heading text-4xl font-semibold leading-[1.04] tracking-[-0.045em] text-balance sm:text-5xl">
            Turn what you see into a civic response.
          </h2>
          <p className="mt-5 max-w-lg text-base leading-7 text-muted-foreground text-balance sm:text-lg">
            Give Beacon the essentials: what happened, where it is, and any
            evidence you have. The platform handles the operational handoff.
          </p>

          <div className="mt-8 grid gap-x-6 gap-y-5 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            {assurances.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="flex gap-3">
                  <span className="grid size-9 shrink-0 place-items-center rounded-xl border border-primary/12 bg-primary/6 text-primary">
                    <Icon className="size-[17px]" aria-hidden="true" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold">{item.title}</p>
                    <p className="mt-0.5 text-xs leading-5 text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-9 overflow-hidden rounded-2xl bg-[var(--landing-ink)] p-5 text-white shadow-[0_24px_50px_-32px_black]">
            <div className="flex items-center gap-2 text-[var(--landing-signal)]">
              <ShieldCheck className="size-4" />
              <span className="text-[9px] font-bold uppercase tracking-[0.15em]">
                Public-service promise
              </span>
            </div>
            <p className="mt-3 text-sm leading-6 text-white/62">
              Public tracking never exposes citizen contact details or internal
              government notes.
            </p>
            <a
              href="#quick-report"
              className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-white transition-colors hover:text-[var(--landing-signal)]"
            >
              Jump directly to the report form
              <ArrowUpRight className="size-3.5" />
            </a>
          </div>
        </FadeIn>

        <FadeIn delay={0.08}>
          <QuickReportForm />
        </FadeIn>
      </div>
    </section>
  );
}
