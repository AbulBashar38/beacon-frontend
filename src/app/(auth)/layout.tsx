import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  Fingerprint,
  LockKeyhole,
  RadioTower,
  Route,
  ShieldCheck,
} from "lucide-react";

import { GuestOnly } from "@/components/auth/guest-only";
import { BeaconWordmark } from "@/components/shared/beacon-mark";

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
    noarchive: true,
  },
};

const accessSteps = [
  {
    icon: Fingerprint,
    title: "Credentials checked",
    description: "Your sign-in details are validated through Beacon’s authentication API.",
  },
  {
    icon: ShieldCheck,
    title: "Role-aware access",
    description: "Citizens and administrators enter the workspace built for them.",
  },
  {
    icon: Route,
    title: "Work stays connected",
    description: "Reports, tracking history, and operational actions remain in context.",
  },
];

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <GuestOnly>
      <div className="landing-page grid min-h-svh bg-[var(--landing-paper)] lg:grid-cols-[1.02fr_.98fr]">
        <aside className="relative hidden min-h-svh overflow-hidden bg-[var(--landing-ink)] px-10 py-9 text-white lg:flex lg:flex-col xl:px-14 xl:py-11">
          <div aria-hidden className="landing-grid absolute inset-0 opacity-35 [mask-image:linear-gradient(to_bottom,black,transparent_92%)]" />
          <div aria-hidden className="landing-noise absolute inset-0 opacity-20" />
          <div
            aria-hidden
            className="absolute -bottom-40 -left-32 size-[34rem] rounded-full border border-white/8 shadow-[0_0_0_70px_oklch(1_0_0/2%),0_0_0_140px_oklch(1_0_0/1.4%)]"
          />
          <div
            aria-hidden
            className="absolute -right-40 top-20 size-[28rem] rounded-full bg-[radial-gradient(circle,var(--landing-signal)_0%,transparent_70%)] opacity-10 blur-2xl"
          />

          <div className="relative flex items-center justify-between">
            <Link href="/" aria-label="Beacon home">
              <BeaconWordmark className="[&>span:last-child]:text-white" />
            </Link>
            <span className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.13em] text-white/58">
              <span className="size-1.5 rounded-full bg-[var(--landing-signal)] shadow-[0_0_10px_var(--landing-signal)]" />
              Secure access
            </span>
          </div>

          <div className="relative my-auto max-w-xl py-14">
            <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.17em] text-[var(--landing-signal)]">
              Beacon / Account layer
            </p>
            <h2 className="mt-5 font-heading text-4xl font-semibold leading-[1.02] tracking-[-0.05em] text-balance xl:text-5xl">
              One secure doorway into your civic workspace.
            </h2>
            <p className="mt-5 max-w-lg text-base leading-7 text-white/62">
              Sign in to manage your reports, follow public progress, or enter
              the government operations environment assigned to your role.
            </p>

            <div className="relative mt-10 overflow-hidden rounded-[1.6rem] border border-white/10 bg-white/[0.045] p-2">
              <div className="rounded-[1.2rem] border border-white/8 bg-[color-mix(in_oklch,var(--landing-ink),black_10%)] p-5 xl:p-6">
                <div className="flex items-center justify-between border-b border-white/8 pb-4">
                  <div className="flex items-center gap-2 text-[var(--landing-signal)]">
                    <RadioTower className="size-4" />
                    <span className="text-[9px] font-bold uppercase tracking-[0.15em]">
                      Access route
                    </span>
                  </div>
                  <span className="font-mono text-[9px] text-white/45">
                    AUTHENTICATED SESSION
                  </span>
                </div>

                <ol className="mt-1">
                  {accessSteps.map((step, index) => {
                    const Icon = step.icon;
                    return (
                      <li key={step.title} className="relative flex gap-4 py-4">
                        {index < accessSteps.length - 1 ? (
                          <span
                            aria-hidden
                            className="absolute left-[1.15rem] top-12 h-[calc(100%-1.5rem)] w-px bg-gradient-to-b from-[var(--landing-signal)]/35 to-white/8"
                          />
                        ) : null}
                        <span className="relative z-10 grid size-9 shrink-0 place-items-center rounded-xl border border-white/10 bg-white/[0.055] text-[var(--landing-signal)]">
                          <Icon className="size-4" aria-hidden="true" />
                        </span>
                        <div>
                          <p className="text-sm font-semibold text-white/88">{step.title}</p>
                          <p className="mt-1 text-xs leading-5 text-white/55">{step.description}</p>
                        </div>
                      </li>
                    );
                  })}
                </ol>
              </div>
            </div>
          </div>

          <div className="relative grid grid-cols-2 gap-3">
            <TrustNote icon={LockKeyhole} title="Protected sessions" detail="JWT authentication" />
            <TrustNote icon={CheckCircle2} title="Validated access" detail="Role-based routing" />
          </div>
        </aside>

        <main className="relative flex min-h-svh flex-col overflow-hidden bg-[var(--landing-paper)]">
          <div
            aria-hidden
            className="absolute -right-28 -top-28 size-72 rounded-full border border-black/[0.035] shadow-[0_0_0_44px_oklch(0.2_0.02_190/1.5%),0_0_0_88px_oklch(0.2_0.02_190/1%)]"
          />

          <header className="relative flex h-[4.5rem] items-center justify-between border-b border-black/6 px-5 sm:px-8 lg:px-10">
            <Link href="/" className="lg:hidden" aria-label="Beacon home">
              <BeaconWordmark />
            </Link>
            <span className="hidden font-mono text-[9px] uppercase tracking-[0.14em] text-muted-foreground lg:block">
              Civic identity portal
            </span>
            <Link
              href="/"
              className="ml-auto inline-flex min-h-11 items-center gap-2 rounded-xl px-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-black/[0.035] hover:text-foreground"
            >
              <ArrowLeft className="size-4" />
              Back to Beacon
            </Link>
          </header>

          <div className="relative flex flex-1 items-center justify-center px-5 py-10 sm:px-8 lg:px-10">
            <div className="auth-card w-full max-w-[29rem] rounded-[1.7rem] border border-black/8 bg-white p-6 shadow-[0_30px_80px_-52px_oklch(0.2_0.03_190/60%)] sm:p-8 [&_[data-slot=input]]:h-12 [&_[data-slot=input]]:rounded-xl [&_[data-slot=input]]:bg-[var(--landing-paper)]">
              {children}
            </div>
          </div>

          <footer className="relative flex flex-col items-center justify-between gap-2 border-t border-black/6 px-5 py-5 text-[10px] text-muted-foreground sm:flex-row sm:px-8 lg:px-10">
            <span>Beacon · Civic infrastructure intelligence</span>
            <span className="font-mono uppercase tracking-[0.1em]">
              Privacy-aware access
            </span>
          </footer>
        </main>
      </div>
    </GuestOnly>
  );
}

function TrustNote({
  icon: Icon,
  title,
  detail,
}: {
  icon: typeof LockKeyhole;
  title: string;
  detail: string;
}) {
  return (
    <div className="rounded-2xl border border-white/8 bg-white/[0.035] p-4">
      <Icon className="size-4 text-[var(--landing-signal)]" aria-hidden="true" />
      <p className="mt-3 text-xs font-semibold text-white/75">{title}</p>
      <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.1em] text-white/45">{detail}</p>
    </div>
  );
}
