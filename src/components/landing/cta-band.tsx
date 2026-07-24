import Link from "next/link";
import { ArrowRight, Search } from "lucide-react";

import { Section } from "@/components/shared/section";
import { FadeIn } from "@/components/motion/fade-in";
import { Button } from "@/components/ui/button";

export function CtaBand() {
  return (
    <Section>
      <FadeIn className="relative overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/10 via-surface to-accent/10 px-6 py-14 text-center sm:px-12 sm:py-16">
        <div
          aria-hidden
          className="bg-grid text-primary/40 absolute inset-0 [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,black,transparent)]"
        />
        <div className="relative mx-auto flex max-w-2xl flex-col items-center gap-6">
          <h2 className="font-heading text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
            See something broken? Beacon it.
          </h2>
          <p className="text-base leading-relaxed text-muted-foreground text-balance sm:text-lg">
            Your report takes under a minute and puts a real problem on the map
            for the people who can fix it.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
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
          </div>
        </div>
      </FadeIn>
    </Section>
  );
}
