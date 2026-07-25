"use client";

import { useState } from "react";

import { AdminSidebar } from "@/components/layout/admin-sidebar";
import { AdminTopbar } from "@/components/layout/admin-topbar";
import { cn } from "@/lib/utils";

export function AdminShell({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <a
        href="#admin-content"
        className="fixed left-4 top-3 z-[70] -translate-y-20 rounded-lg bg-teal-300 px-4 py-2 text-sm font-semibold text-slate-950 shadow-xl transition focus:translate-y-0 focus:outline-none focus:ring-2 focus:ring-white"
      >
        Skip to admin content
      </a>
      <AdminSidebar collapsed={collapsed} mobileOpen={mobileOpen} onCollapse={() => setCollapsed((value) => !value)} onMobileClose={() => setMobileOpen(false)} />
      <div className={cn("min-h-screen transition-[padding] duration-200", collapsed ? "lg:pl-[76px]" : "lg:pl-64")}>
        <AdminTopbar onMenuOpen={() => { setCollapsed(false); setMobileOpen(true); }} />
        <div id="admin-content" tabIndex={-1} className="outline-none">
          {children}
        </div>
      </div>
    </div>
  );
}
