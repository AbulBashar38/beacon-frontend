"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

import { BeaconWordmark } from "@/components/shared/beacon-mark";
import { useAuth } from "@/contexts/auth-context";

export function CitizenAuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (loading) return;
    if (!user) router.replace("/login");
    else if (user.role === "admin") router.replace("/admin/dashboard");
  }, [loading, router, user]);

  if (loading || !user || user.role === "admin") {
    return (
      <main className="landing-page relative flex min-h-svh items-center justify-center overflow-hidden bg-[var(--landing-paper)] px-5">
        <div
          aria-hidden
          className="bg-grid absolute inset-0 text-[var(--landing-ink)] opacity-[0.035]"
        />
        <div
          aria-hidden
          className="absolute -right-24 -top-24 size-72 rounded-full border border-black/[0.035] shadow-[0_0_0_44px_oklch(0.2_0.03_187/1.2%),0_0_0_88px_oklch(0.2_0.03_187/.8%)]"
        />
        <div
          className="relative w-full max-w-sm overflow-hidden rounded-[1.6rem] bg-[var(--landing-ink)] p-7 text-white shadow-[0_30px_80px_-50px_oklch(0.2_0.04_187/70%)]"
          role="status"
        >
          <div aria-hidden className="landing-grid absolute inset-0 opacity-20" />
          <div className="relative">
            <BeaconWordmark className="[&>span:last-child]:text-white" />
            <div className="mt-8 flex items-center gap-3 border-t border-white/8 pt-5">
              <span className="grid size-10 place-items-center rounded-xl border border-white/9 bg-white/[0.055] text-[var(--landing-signal)]">
                <Loader2 className="size-[18px] animate-spin" />
              </span>
              <span>
                <span className="block text-sm font-semibold">
                  Opening your workspace
                </span>
                <span className="mt-0.5 block text-xs text-white/45">
                  Verifying your secure citizen session…
                </span>
              </span>
            </div>
          </div>
        </div>
      </main>
    );
  }
  return children;
}
