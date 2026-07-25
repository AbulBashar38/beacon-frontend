"use client";

import { ArrowUpRight, Menu, RadioTower, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import { BeaconWordmark } from "@/components/shared/beacon-mark";
import { Button } from "@/components/ui/button";
import { navLinks } from "@/lib/landing-data";
import { cn } from "@/lib/utils";

export function CitizenHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [open]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b text-white transition-all duration-300",
        scrolled
          ? "border-white/10 bg-[color-mix(in_oklch,var(--landing-ink),transparent_5%)] shadow-[0_10px_40px_-24px_black] backdrop-blur-xl"
          : "border-white/8 bg-[var(--landing-ink)]",
      )}
    >
      <div className="mx-auto flex h-[4.5rem] w-full max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-10">
        <Link href="/" aria-label="Beacon home">
          <BeaconWordmark className="[&>span:last-child]:text-white" />
        </Link>

        <nav className="hidden items-center gap-1 rounded-full border border-white/8 bg-white/[0.035] p-1 lg:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="rounded-full px-3.5 py-2 text-[13px] font-medium text-white/60 transition-colors hover:bg-white/6 hover:text-white"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <span className="mr-2 hidden items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-white/45 xl:flex">
            <RadioTower className="size-3.5 text-[var(--landing-signal)]" />
            Civic network online
          </span>
          <Button asChild variant="ghost" size="lg" className="text-white/70 hover:bg-white/8 hover:text-white">
            <Link href="/login">
              Sign in
              <ArrowUpRight className="size-3.5" />
            </Link>
          </Button>
          <Button
            asChild
            size="lg"
            className="bg-[var(--landing-signal)] text-[var(--landing-ink)] shadow-none hover:bg-[color-mix(in_oklch,var(--landing-signal),white_10%)]"
          >
            <Link href="#quick-report">Report an issue</Link>
          </Button>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="citizen-mobile-navigation"
          className="inline-flex size-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white md:hidden"
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {open ? (
        <div id="citizen-mobile-navigation" className="border-t border-white/8 bg-[var(--landing-ink)] shadow-2xl md:hidden">
          <nav className="mx-auto flex w-full max-w-7xl flex-col gap-1 px-5 py-5">
            <div className="mb-3 flex items-center gap-2 rounded-xl border border-white/8 bg-white/[0.035] px-3 py-2.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-white/50">
              <span className="size-1.5 rounded-full bg-[var(--landing-signal)] shadow-[0_0_12px_var(--landing-signal)]" />
              Bangladesh civic network online
            </div>
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-xl px-3 py-3 text-sm font-medium text-white/65 transition-colors hover:bg-white/6 hover:text-white"
              >
                {link.label}
              </a>
            ))}
            <div className="mt-2 flex flex-col gap-2">
              <Button asChild variant="outline" size="lg">
                <Link href="/login" className="border-white/12 bg-white/5 text-white hover:bg-white/10">
                  Sign in
                </Link>
              </Button>
              <Button asChild size="lg" className="bg-[var(--landing-signal)] text-[var(--landing-ink)]">
                <Link href="#quick-report">Report an issue</Link>
              </Button>
            </div>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
