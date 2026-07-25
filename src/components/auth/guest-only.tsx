"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { LoaderCircle } from "lucide-react";

import { useAuth } from "@/contexts/auth-context";
import { BeaconMark } from "@/components/shared/beacon-mark";

export function GuestOnly({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && user) {
      router.replace(user.role === "admin" ? "/admin/dashboard" : "/dashboard");
    }
  }, [loading, router, user]);

  if (loading || user) {
    return (
      <div className="landing-page grid min-h-svh place-items-center bg-[var(--landing-ink)] text-white">
        <div role="status" aria-live="polite" className="flex flex-col items-center gap-4">
          <BeaconMark className="size-11" />
          <span className="flex items-center gap-2 text-xs text-white/48">
            <LoaderCircle className="size-4 animate-spin text-[var(--landing-signal)]" />
            Checking your session
          </span>
        </div>
      </div>
    );
  }
  return children;
}
