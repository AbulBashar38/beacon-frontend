import Link from "next/link";
import { ArrowLeft, ShieldCheck, MapPinned, Clock } from "lucide-react";

import { BeaconWordmark } from "@/components/shared/beacon-mark";

const points = [
  { icon: ShieldCheck, text: "AI-triaged reports routed to the right team" },
  { icon: MapPinned, text: "Every issue mapped on the live national grid" },
  { icon: Clock, text: "Avg. resolution down to 3.4 days" },
];

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-1">
      {/* Brand panel */}
      <aside className="relative hidden w-[46%] max-w-2xl flex-col justify-between overflow-hidden bg-console p-10 text-console-foreground lg:flex xl:p-12">
        <div
          aria-hidden
          className="bg-grid text-console-foreground/40 absolute inset-0 [mask-image:radial-gradient(ellipse_70%_60%_at_30%_20%,black,transparent)]"
        />
        <div
          aria-hidden
          className="absolute -bottom-32 -left-20 size-96 rounded-full bg-primary/25 blur-3xl"
        />
        <div
          aria-hidden
          className="absolute -top-24 right-0 size-80 rounded-full bg-accent/15 blur-3xl"
        />

        <div className="relative">
          <Link
            href="/"
            className="text-console-foreground"
            aria-label="Beacon home"
          >
            <BeaconWordmark />
          </Link>
        </div>

        <div className="relative flex flex-col gap-8">
          <h2 className="max-w-md font-heading text-3xl font-semibold leading-tight tracking-tight text-balance xl:text-4xl">
            One platform for cleaner, safer, better-run streets.
          </h2>
          <ul className="flex flex-col gap-4">
            {points.map((p) => {
              const Icon = p.icon;
              return (
                <li key={p.text} className="flex items-center gap-3">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-console-elevated/70 text-primary ring-1 ring-console-border/60">
                    <Icon className="size-[18px]" />
                  </span>
                  <span className="text-sm text-console-foreground/85">
                    {p.text}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="relative flex items-center gap-6">
          <Stat value="48k+" label="Reports resolved" />
          <span className="h-8 w-px bg-console-border/60" />
          <Stat value="64" label="Districts live" />
          <span className="h-8 w-px bg-console-border/60" />
          <Stat value="92%" label="Satisfaction" />
        </div>
      </aside>

      {/* Form area */}
      <main className="flex flex-1 flex-col">
        <header className="flex items-center justify-between px-5 py-5 sm:px-8">
          <Link href="/" className="lg:hidden" aria-label="Beacon home">
            <BeaconWordmark />
          </Link>
          <Link
            href="/"
            className="ml-auto inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            Back to site
          </Link>
        </header>

        <div className="flex flex-1 items-center justify-center px-5 py-10 sm:px-8">
          <div className="w-full max-w-sm">{children}</div>
        </div>

        <footer className="px-5 py-6 text-center text-xs text-muted-foreground sm:px-8">
          Beacon · AI &amp; API Hackathon 2026
        </footer>
      </main>
    </div>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col">
      <span className="font-heading text-xl font-bold tracking-tight">
        {value}
      </span>
      <span className="text-xs text-console-foreground/60">{label}</span>
    </div>
  );
}
