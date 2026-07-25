"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { LogOut, Mail, Menu, ShieldCheck } from "lucide-react";

import { useAuth } from "@/contexts/auth-context";

export function AdminTopbar({ onMenuOpen }: { onMenuOpen: () => void }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const profileButtonRef = useRef<HTMLButtonElement>(null);
  const initials = (user?.name ?? "Administrator")
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
  const context = getRouteContext(pathname);

  useEffect(() => {
    if (!profileOpen) return;

    function closeOnOutsidePress(event: PointerEvent) {
      if (!profileRef.current?.contains(event.target as Node)) {
        setProfileOpen(false);
      }
    }

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setProfileOpen(false);
        profileButtonRef.current?.focus();
      }
    }

    document.addEventListener("pointerdown", closeOnOutsidePress);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOnOutsidePress);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [profileOpen]);

  async function signOut() {
    await logout();
    router.replace("/login");
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-white/7 bg-slate-950/85 px-4 backdrop-blur-xl sm:px-6">
      <button onClick={onMenuOpen} className="grid size-9 place-items-center rounded-lg text-slate-400 hover:bg-white/5 lg:hidden" aria-label="Open menu">
        <Menu className="size-5" />
      </button>
      <div className="hidden min-w-0 sm:block">
        <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-teal-400">{context.eyebrow}</p>
        <p className="mt-0.5 truncate text-xs font-medium text-slate-300">{context.title}</p>
      </div>
      <div className="ml-auto flex items-center gap-2">
        <div ref={profileRef} className="relative">
          <button
            ref={profileButtonRef}
            onClick={() => setProfileOpen((open) => !open)}
            className="flex items-center gap-2 rounded-lg p-1 pr-2 hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-300/50"
            aria-label="Open profile menu"
            aria-expanded={profileOpen}
            aria-haspopup="menu"
            aria-controls="admin-profile-menu"
          >
            <span className="grid size-8 place-items-center rounded-lg bg-gradient-to-br from-teal-300 to-cyan-600 text-xs font-bold text-slate-950">{initials}</span>
            <span className="hidden max-w-40 text-left md:block"><span className="block truncate text-xs font-medium text-slate-200">{user?.name ?? "Administrator"}</span><span className="block text-[10px] text-slate-500">Administrator</span></span>
          </button>
          {profileOpen ? (
            <div id="admin-profile-menu" role="menu" className="absolute right-0 top-11 z-50 w-64 overflow-hidden rounded-xl border border-white/10 bg-slate-900 shadow-2xl">
              <div className="border-b border-white/8 p-4">
                <p className="truncate text-sm font-semibold text-white">{user?.name ?? "Administrator"}</p>
                <p className="mt-1 flex items-center gap-2 truncate text-[11px] text-slate-400"><Mail className="size-3" />{user?.email ?? "Authenticated account"}</p>
                <p className="mt-2 inline-flex items-center gap-1.5 rounded-md bg-teal-400/10 px-2 py-1 text-[10px] font-medium text-teal-300"><ShieldCheck className="size-3" />Administrator</p>
              </div>
              <div className="p-2">
                <button
                  role="menuitem"
                  onClick={() => void signOut()}
                  className="flex h-10 w-full items-center gap-2 rounded-lg px-3 text-xs font-medium text-slate-300 transition hover:bg-red-400/10 hover:text-red-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-300/40"
                >
                  <LogOut className="size-4" />
                  Sign out
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}

function getRouteContext(pathname: string) {
  if (pathname.startsWith("/admin/map")) return { eyebrow: "Geospatial intelligence", title: "Live national map" };
  if (pathname.startsWith("/admin/issues/")) return { eyebrow: "Case management", title: "Issue detail" };
  if (pathname.startsWith("/admin/issues")) return { eyebrow: "Case management", title: "Infrastructure issues" };
  if (pathname.startsWith("/admin/users")) return { eyebrow: "Access directory", title: "User accounts" };
  return { eyebrow: "National operations", title: "Overview" };
}
