"use client";

import {
  ChevronLeft,
  LayoutDashboard,
  Map,
  ShieldCheck,
  Users,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { BeaconMark } from "@/components/shared/beacon-mark";
import { cn } from "@/lib/utils";

const routes = [
  { label: "Overview", href: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Live map", href: "/admin/map", icon: Map },
  { label: "Issues", href: "/admin/issues", icon: ShieldCheck },
  { label: "Users", href: "/admin/users", icon: Users },
];

export function AdminSidebar({
  collapsed,
  mobileOpen,
  onCollapse,
  onMobileClose,
}: {
  collapsed: boolean;
  mobileOpen: boolean;
  onCollapse: () => void;
  onMobileClose: () => void;
}) {
  const pathname = usePathname();

  return (
    <>
      {mobileOpen && (
        <button
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={onMobileClose}
          aria-label="Close navigation"
        />
      )}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 border-r border-white/8 bg-slate-950 transition-[width,transform] duration-200",
          collapsed ? "lg:w-[76px]" : "lg:w-64",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        )}
      >
        <div className="flex w-full flex-col p-3">
          <div className="flex h-14 items-center justify-between px-2">
            <Link
              href="/"
              className="flex items-center gap-3 overflow-hidden text-white"
              aria-label="Beacon home"
            >
              <BeaconMark className="size-9 shrink-0" />
              {!collapsed && (
                <span className="font-heading text-lg font-bold tracking-tight">
                  Beacon <span className="text-teal-400">Ops</span>
                </span>
              )}
            </Link>
            <button
              onClick={onMobileClose}
              className="grid size-9 place-items-center rounded-lg text-slate-400 hover:bg-white/5 lg:hidden"
              aria-label="Close menu"
            >
              <X className="size-4" />
            </button>
          </div>

          <div className="mt-5 px-2">
            {!collapsed && (
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-600">
                Operations
              </p>
            )}
          </div>
          <nav className="mt-2 space-y-1" aria-label="Admin navigation">
            {routes.map((route) => {
              const active = pathname === route.href || pathname.startsWith(`${route.href}/`);
              const Icon = route.icon;
              return (
                <Link
                  key={route.href}
                  href={route.href}
                  title={collapsed ? route.label : undefined}
                  onClick={onMobileClose}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "flex h-11 items-center rounded-xl text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-300/50",
                    collapsed ? "justify-center px-0" : "gap-3 px-3",
                    active
                      ? "bg-teal-400/12 text-teal-300 ring-1 ring-inset ring-teal-300/10"
                      : "text-slate-400 hover:bg-white/5 hover:text-slate-100",
                  )}
                >
                  <Icon className="size-[18px] shrink-0" />
                  {!collapsed && <span className="flex-1">{route.label}</span>}
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto">
            {!collapsed && (
              <div className="mb-3 rounded-xl border border-teal-300/10 bg-teal-400/5 p-3">
                <div className="flex items-center gap-2 text-xs font-semibold text-teal-300">
                  <ShieldCheck className="size-3.5" />
                  Protected operations
                </div>
                <p className="mt-1.5 text-[10px] leading-relaxed text-slate-500">
                  Administrator workspace · Bangladesh coverage
                </p>
              </div>
            )}
            <button
              onClick={onCollapse}
              className="hidden h-10 w-full items-center justify-center rounded-xl text-slate-500 hover:bg-white/5 hover:text-slate-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-300/50 lg:flex"
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              <ChevronLeft
                className={cn(
                  "size-4 transition-transform",
                  collapsed && "rotate-180",
                )}
              />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
