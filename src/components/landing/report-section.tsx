import { UserX, Sparkles, MapPin, BellRing } from "lucide-react";

import { FadeIn } from "@/components/motion/fade-in";
import { Eyebrow } from "@/components/shared/section";
import { QuickReportForm } from "@/components/forms/quick-report-form";

const assurances = [
  {
    icon: UserX,
    title: "No account required",
    description: "Report in the open — no sign-up, no login, no waiting.",
  },
  {
    icon: Sparkles,
    title: "AI does the routing",
    description:
      "Beacon classifies severity, flags duplicates and picks the owning department.",
  },
  {
    icon: MapPin,
    title: "Pinned on the live map",
    description:
      "Your report joins the national hotspot map the moment it's submitted.",
  },
  {
    icon: BellRing,
    title: "Track with a code",
    description:
      "Get a public tracking code to follow progress from acknowledged to resolved.",
  },
];

export function ReportSection() {
  return (
    <section id="report" className="scroll-mt-16 py-20 sm:py-28">
      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 items-start gap-10 px-5 sm:px-8 lg:grid-cols-[0.85fr_1fr] lg:gap-12">
        <FadeIn className="lg:sticky lg:top-24">
          <Eyebrow>Report in seconds</Eyebrow>
          <h2 className="mt-4 font-heading text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
            Spotted a problem? Report it right here.
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground text-balance">
            No apps, no forms to hunt down. Fill in a few details and Beacon
            takes it from there — you don’t even need an account.
          </p>

          <ul className="mt-8 flex flex-col gap-5">
            {assurances.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.title} className="flex gap-3.5">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="size-[18px]" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold">{item.title}</p>
                    <p className="mt-0.5 text-sm leading-relaxed text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>

          <p className="mt-8 text-sm text-muted-foreground">
            Need to place a precise pin on the map?{" "}
            <a
              href="/report"
              className="font-medium text-primary underline-offset-4 hover:underline"
            >
              Use the guided flow
            </a>
            .
          </p>
        </FadeIn>

        <FadeIn delay={0.1}>
          <QuickReportForm />
        </FadeIn>
      </div>
    </section>
  );
}
