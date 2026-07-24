import Link from "next/link";

import { BeaconWordmark } from "@/components/shared/beacon-mark";

const footerNav = [
  {
    heading: "Platform",
    links: [
      { label: "Report an issue", href: "/report" },
      { label: "Track a report", href: "/track" },
      { label: "How it works", href: "#how-it-works" },
    ],
  },
  {
    heading: "For government",
    links: [
      { label: "Admin sign in", href: "/login" },
      { label: "Live map", href: "/admin/map" },
      { label: "Analytics", href: "/admin/analytics" },
    ],
  },
  {
    heading: "About",
    links: [
      { label: "Categories", href: "#categories" },
      { label: "Impact", href: "#impact" },
      { label: "Success stories", href: "#stories" },
    ],
  },
];

export function CitizenFooter() {
  return (
    <footer className="mt-auto border-t border-border bg-surface-muted/50">
      <div className="mx-auto grid w-full max-w-6xl grid-cols-2 gap-10 px-5 py-14 sm:px-8 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
        <div className="col-span-2 flex flex-col gap-4 md:col-span-1">
          <BeaconWordmark />
          <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
            AI-powered civic infrastructure reporting — connecting citizens and
            government to fix public problems faster.
          </p>
          <p className="text-xs text-muted-foreground/70">
            Built for the AI &amp; API Hackathon 2026.
          </p>
        </div>

        {footerNav.map((group) => (
          <nav key={group.heading} className="flex flex-col gap-3">
            <span className="text-xs font-semibold uppercase tracking-wide text-foreground/70">
              {group.heading}
            </span>
            {group.links.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        ))}
      </div>

      <div className="border-t border-border">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-2 px-5 py-5 text-xs text-muted-foreground sm:flex-row sm:px-8">
          <span>© {new Date().getFullYear()} Beacon. All rights reserved.</span>
          <span className="font-mono text-[11px]">
            MapLibre GL JS · OpenFreeMap
          </span>
        </div>
      </div>
    </footer>
  );
}
