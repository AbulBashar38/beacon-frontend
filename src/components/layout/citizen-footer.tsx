import Link from "next/link";
import { AlertTriangle, ArrowUpRight, RadioTower } from "lucide-react";

import { BeaconWordmark } from "@/components/shared/beacon-mark";

const footerNav = [
  {
    heading: "Citizen services",
    links: [
      { label: "Report an issue", href: "#quick-report" },
      { label: "Track a report", href: "/track" },
      { label: "How it works", href: "#how-it-works" },
    ],
  },
  {
    heading: "Platform",
    links: [
      { label: "Issue categories", href: "#categories" },
      { label: "Public impact", href: "#impact" },
      { label: "Admin sign in", href: "/login" },
    ],
  },
];

export function CitizenFooter() {
  return (
    <footer className="border-t border-white/8 bg-[color-mix(in_oklch,var(--landing-ink),black_12%)] text-white">
      <div className="mx-auto w-full max-w-7xl px-5 py-14 sm:px-8 lg:px-10 lg:py-16">
        <div className="grid gap-12 md:grid-cols-[1.3fr_.7fr_.7fr]">
          <div>
            <BeaconWordmark className="[&>span:last-child]:text-white" />
            <p className="mt-5 max-w-md text-sm leading-6 text-white/48">
              AI-assisted civic infrastructure reporting that helps citizens
              create clear public records and helps government teams review,
              map, and manage them.
            </p>
            <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-[var(--landing-signal)]/18 bg-[var(--landing-signal)]/[0.07] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.13em] text-[var(--landing-signal)]">
              <RadioTower className="size-3.5" />
              Civic response network
            </div>
          </div>

          {footerNav.map((group) => (
            <nav key={group.heading} aria-label={group.heading}>
              <h2 className="text-[10px] font-semibold uppercase tracking-[0.15em] text-white/35">
                {group.heading}
              </h2>
              <div className="mt-4 flex flex-col items-start gap-3">
                {group.links.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="inline-flex items-center gap-1 text-sm text-white/58 transition-colors hover:text-white"
                  >
                    {link.label}
                    {link.href.startsWith("/") ? <ArrowUpRight className="size-3" /> : null}
                  </Link>
                ))}
              </div>
            </nav>
          ))}
        </div>

        <div className="mt-12 flex items-start gap-3 border-t border-white/8 pt-6 text-xs leading-5 text-white/35">
          <AlertTriangle className="mt-0.5 size-4 shrink-0 text-[var(--landing-sun)]" />
          <p>
            Beacon is for non-emergency civic infrastructure reports. For an
            immediate threat to life or public safety, contact the appropriate
            emergency service.
          </p>
        </div>
      </div>

      <div className="border-t border-white/8">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-2 px-5 py-5 text-[10px] uppercase tracking-[0.1em] text-white/28 sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-10">
          <span>© {new Date().getFullYear()} Beacon · AI &amp; API Hackathon 2026</span>
          <span className="font-mono normal-case tracking-normal">
            Maps powered by Mapbox
          </span>
        </div>
      </div>
    </footer>
  );
}
