import Link from "next/link";
import { ArrowRight, RadioTower, Search } from "lucide-react";

import { FadeIn } from "@/components/motion/fade-in";
import { Section } from "@/components/shared/section";
import { Button } from "@/components/ui/button";

export function CtaBand() {
  return (
    <Section className="bg-[var(--landing-paper-deep)] pt-8 sm:pt-12 lg:pt-16">
      <FadeIn className="relative overflow-hidden rounded-[1.8rem] bg-[var(--landing-ink)] px-6 py-12 text-white shadow-[0_35px_90px_-54px_black] sm:px-10 sm:py-14 lg:px-14">
        <div aria-hidden className="landing-grid absolute inset-0 opacity-35 [mask-image:linear-gradient(90deg,black,transparent_78%)]" />
        <div aria-hidden className="absolute -right-28 -top-28 size-80 rounded-full border border-[var(--landing-signal)]/15 shadow-[0_0_0_52px_oklch(1_0_0/2%),0_0_0_104px_oklch(1_0_0/1.5%)]" />

        <div className="relative grid gap-9 lg:grid-cols-[1.1fr_.9fr] lg:items-center">
          <div>
            <div className="flex items-center gap-2 font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--landing-signal)]">
              <RadioTower className="size-3.5" />
              Open civic channel
            </div>
            <h2 className="mt-4 max-w-2xl font-heading text-4xl font-semibold leading-[1.03] tracking-[-0.045em] text-balance sm:text-5xl">
              If it affects public life, put it on the record.
            </h2>
            <p className="mt-4 max-w-xl text-base leading-7 text-white/52">
              A precise report helps reviewers understand the problem and start
              the right response sooner.
            </p>
          </div>

          <div className="flex flex-col gap-3 lg:items-end">
            <Button
              asChild
              size="xl"
              className="h-14 w-full bg-[var(--landing-signal)] text-[var(--landing-ink)] hover:bg-[color-mix(in_oklch,var(--landing-signal),white_10%)] sm:w-auto"
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
              className="h-14 w-full border-white/12 bg-white/[0.05] sm:w-auto"
            >
              <Link href="/track">
                <Search data-icon="inline-start" />
                Check an existing report
              </Link>
            </Button>
          </div>
        </div>
      </FadeIn>
    </Section>
  );
}
