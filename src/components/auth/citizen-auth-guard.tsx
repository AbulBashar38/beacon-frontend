"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

import { authApi } from "@/lib/api/report-api";
import { clearAuthSession, getAccessToken } from "@/lib/auth-session";

export function CitizenAuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    if (!getAccessToken()) {
      router.replace("/login");
      return;
    }

    void authApi.me().then((user) => {
      if (user.role === "admin") {
        router.replace("/admin/dashboard");
        return;
      }
      setAllowed(true);
    }).catch(() => {
      clearAuthSession();
      router.replace("/login");
    });
  }, [router]);

  if (!allowed) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex items-center gap-2 text-sm text-muted-foreground" role="status">
          <Loader2 className="size-4 animate-spin" />
          Loading your reports…
        </div>
      </main>
    );
  }

  return children;
}
