"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Bell, CalendarDays, LogOut, Mail, Menu, Search, ShieldCheck } from "lucide-react";

import { useAuth } from "@/contexts/auth-context";

export function AdminTopbar({ onMenuOpen }: { onMenuOpen: () => void }) {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [profileOpen, setProfileOpen] = useState(false);
  const initials = (user?.name ?? "Administrator")
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  async function signOut() {
    await logout();
    router.replace("/login");
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-white/7 bg-slate-950/85 px-4 backdrop-blur-xl sm:px-6">
      <button onClick={onMenuOpen} className="grid size-9 place-items-center rounded-lg text-slate-400 hover:bg-white/5 lg:hidden" aria-label="Open menu">
        <Menu className="size-5" />
      </button>
      <label className="relative hidden max-w-md flex-1 sm:block">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-500" />
        <span className="sr-only">Search reports, locations, or citizens</span>
        <input className="h-9 w-full rounded-lg border border-white/8 bg-white/[0.035] pl-9 pr-3 text-xs text-slate-200 outline-none placeholder:text-slate-600 focus:border-teal-400/40 focus:ring-2 focus:ring-teal-400/10" placeholder="Search reports, IDs or locations…" />
      </label>
      <div className="ml-auto flex items-center gap-2">
        <button className="hidden h-9 items-center gap-2 rounded-lg border border-white/8 bg-white/[0.035] px-3 text-xs text-slate-300 hover:bg-white/[0.06] sm:flex">
          <CalendarDays className="size-3.5 text-slate-500" />
          Last 30 days
        </button>
        <button className="relative grid size-9 place-items-center rounded-lg border border-white/8 bg-white/[0.035] text-slate-400 hover:text-white" aria-label="Notifications">
          <Bell className="size-4" />
          <span className="absolute right-2 top-2 size-1.5 rounded-full bg-red-400 ring-2 ring-slate-950" />
        </button>
        <div className="relative">
          <button onClick={() => setProfileOpen((open) => !open)} className="flex items-center gap-2 rounded-lg p-1 pr-2 hover:bg-white/5" aria-label="Open profile menu" aria-expanded={profileOpen}>
            <span className="grid size-8 place-items-center rounded-lg bg-gradient-to-br from-teal-300 to-cyan-600 text-xs font-bold text-slate-950">{initials}</span>
            <span className="hidden max-w-40 text-left md:block"><span className="block truncate text-xs font-medium text-slate-200">{user?.name ?? "Administrator"}</span><span className="block text-[10px] text-slate-500">Administrator</span></span>
          </button>
          {profileOpen ? (
            <div className="absolute right-0 top-11 z-50 w-64 overflow-hidden rounded-xl border border-white/10 bg-slate-900 shadow-2xl">
              <div className="border-b border-white/8 p-4">
                <p className="truncate text-sm font-semibold text-white">{user?.name}</p>
                <p className="mt-1 flex items-center gap-2 truncate text-[11px] text-slate-400"><Mail className="size-3" />{user?.email}</p>
                <p className="mt-2 inline-flex items-center gap-1.5 rounded-md bg-teal-400/10 px-2 py-1 text-[10px] font-medium text-teal-300"><ShieldCheck className="size-3" />Administrator</p>
              </div>
              <button onClick={() => void signOut()} className="flex w-full items-center gap-2 px-4 py-3 text-left text-xs text-slate-300 transition hover:bg-white/5 hover:text-white"><LogOut className="size-4" />Sign out</button>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}
