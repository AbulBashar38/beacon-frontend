"use client";

import { useCallback, useDeferredValue, useEffect, useState } from "react";
import { CheckCircle2, ChevronLeft, ChevronRight, Loader2, RefreshCw, Search, ShieldCheck, UserRound, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import { getApiErrorMessage } from "@/lib/api/client";
import { userApi, type ApiUser, type UserListResult } from "@/lib/api/user-api";
import { cn } from "@/lib/utils";

const avatarTones = ["from-teal-300 to-cyan-600", "from-violet-300 to-indigo-600", "from-amber-300 to-orange-600", "from-rose-300 to-red-600"];

export function UsersWorkspace() {
  const [result, setResult] = useState<UserListResult | null>(null);
  const [search, setSearch] = useState("");
  const deferredSearch = useDeferredValue(search);
  const [role, setRole] = useState<"all" | "user" | "admin">("all");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setResult(await userApi.list({ search: deferredSearch.trim() || undefined, role: role === "all" ? undefined : role, page, limit: 10 }));
    } catch (reason) {
      setError(getApiErrorMessage(reason, "Unable to load users."));
    } finally {
      setLoading(false);
    }
  }, [deferredSearch, page, role]);

  useEffect(() => {
    let active = true;
    void userApi.list({ search: deferredSearch.trim() || undefined, role: role === "all" ? undefined : role, page, limit: 10 })
      .then((data) => { if (active) setResult(data); })
      .catch((reason) => { if (active) setError(getApiErrorMessage(reason, "Unable to load users.")); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [deferredSearch, page, role]);

  const users = result?.users ?? [];

  const metrics = [
    { label: "Total accounts", value: result?.stats.totalUsers ?? "—", detail: "Registered users", icon: Users, tone: "text-cyan-300 bg-cyan-400/10" },
    { label: "Citizens", value: result?.stats.citizenUsers ?? "—", detail: "Citizen accounts", icon: UserRound, tone: "text-emerald-300 bg-emerald-400/10" },
    { label: "Administrators", value: result?.stats.adminUsers ?? "—", detail: "Operations access", icon: ShieldCheck, tone: "text-violet-300 bg-violet-400/10" },
    { label: "Reports owned", value: result?.stats.totalOwnedReports ?? "—", detail: "Signed-in submissions", icon: CheckCircle2, tone: "text-amber-300 bg-amber-400/10" },
  ];

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-[radial-gradient(circle_at_15%_0%,rgba(20,184,166,.06),transparent_28%)] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1600px]">
        <div>
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-teal-400">Account directory</p>
          <h1 className="font-heading text-2xl font-bold tracking-tight text-white sm:text-3xl">Users &amp; permissions</h1>
          <p className="mt-1 text-sm text-slate-500">Registered citizen and administrator accounts in Beacon.</p>
        </div>

        {error ? <div role="alert" className="mt-5 flex items-center gap-3 rounded-xl border border-red-300/15 bg-red-400/[0.06] px-4 py-3 text-xs text-red-300"><span className="flex-1">{error}</span><Button size="sm" variant="ghost" onClick={() => void load()}><RefreshCw />Retry</Button></div> : null}

        <section className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4" aria-label="User metrics">
          {metrics.map((metric) => {
            const Icon = metric.icon;
            return <article key={metric.label} className="rounded-2xl border border-white/8 bg-slate-900/75 p-4"><div className="flex items-start justify-between"><div><p className="text-[11px] font-medium text-slate-500">{metric.label}</p><p className="mt-2 font-heading text-2xl font-bold text-white">{metric.value}</p></div><span className={cn("grid size-8 place-items-center rounded-lg", metric.tone)}><Icon className="size-4" /></span></div><p className="mt-2 text-[10px] text-slate-600">{metric.detail}</p></article>;
          })}
        </section>

        <section className="mt-4 overflow-hidden rounded-2xl border border-white/8 bg-slate-900/75 shadow-2xl shadow-black/10">
          <div className="flex flex-col gap-3 border-b border-white/7 p-4 sm:flex-row">
            <label className="relative min-w-0 flex-1"><Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-600" /><span className="sr-only">Search users</span><input value={search} onChange={(event) => { setSearch(event.target.value); setPage(1); }} className="h-10 w-full rounded-lg border border-white/8 bg-slate-950/60 pl-9 pr-3 text-xs text-slate-200 outline-none placeholder:text-slate-600 focus:border-teal-400/40" placeholder="Search by name or email…" /></label>
            <select value={role} onChange={(event) => { setRole(event.target.value as typeof role); setPage(1); }} className="h-10 rounded-lg border border-white/8 bg-slate-950/60 px-3 text-xs text-slate-300"><option value="all">All roles</option><option value="user">Citizens</option><option value="admin">Administrators</option></select>
          </div>

          {loading ? <div className="flex items-center justify-center gap-2 p-16 text-xs text-slate-400"><Loader2 className="size-4 animate-spin" />Loading accounts…</div> : (
            <>
              <div className="hidden overflow-x-auto lg:block">
                <table className="w-full min-w-[820px] text-left"><thead className="border-b border-white/7 text-[9px] font-semibold uppercase tracking-[0.14em] text-slate-600"><tr><th className="px-5 py-3">User</th><th className="px-3 py-3">Role</th><th className="px-3 py-3">Owned reports</th><th className="px-3 py-3">Admin updates</th><th className="px-3 py-3">Joined</th></tr></thead><tbody className="divide-y divide-white/6">{users.map((user, index) => <UserRow key={user.id} user={user} index={index} />)}</tbody></table>
              </div>
              <div className="divide-y divide-white/7 lg:hidden">{users.map((user, index) => <UserCard key={user.id} user={user} index={index} />)}</div>
              {!users.length ? <div className="px-6 py-16 text-center text-xs text-slate-500">No users match this search.</div> : null}
              <footer className="flex items-center justify-between gap-3 border-t border-white/7 px-4 py-3 text-[10px] text-slate-600">
                <span>Showing {users.length ? (result!.meta.page - 1) * result!.meta.limit + 1 : 0}–{Math.min(result!.meta.page * result!.meta.limit, result!.meta.total)} of {result!.meta.total} accounts</span>
                <span className="flex items-center gap-2"><button disabled={result!.meta.page <= 1} onClick={() => setPage((value) => Math.max(1, value - 1))} className="grid size-8 place-items-center rounded-lg border border-white/8 disabled:opacity-30" aria-label="Previous users page"><ChevronLeft className="size-4" /></button><span className="font-mono">Page {result!.meta.page} / {result!.meta.totalPages}</span><button disabled={result!.meta.page >= result!.meta.totalPages} onClick={() => setPage((value) => Math.min(result!.meta.totalPages, value + 1))} className="grid size-8 place-items-center rounded-lg border border-white/8 disabled:opacity-30" aria-label="Next users page"><ChevronRight className="size-4" /></button></span>
              </footer>
            </>
          )}
        </section>
      </div>
    </main>
  );
}

function UserRow({ user, index }: { user: ApiUser; index: number }) {
  return <tr className="transition hover:bg-white/[0.025]"><td className="px-5 py-3"><Identity user={user} index={index} /></td><td className="px-3 py-3"><Role role={user.role} /></td><td className="px-3 py-3 font-mono text-xs text-slate-300">{user.reportCount}</td><td className="px-3 py-3 font-mono text-xs text-slate-300">{user.updateCount}</td><td className="px-3 py-3 text-[10px] text-slate-500">{formatDate(user.createdAt)}</td></tr>;
}

function UserCard({ user, index }: { user: ApiUser; index: number }) {
  return <article className="p-4"><Identity user={user} index={index} /><div className="mt-3 flex items-center justify-between"><Role role={user.role} /><span className="text-[10px] text-slate-500">{user.reportCount} reports · Joined {formatDate(user.createdAt)}</span></div></article>;
}

function Identity({ user, index }: { user: ApiUser; index: number }) {
  const initials = user.name.split(/\s+/).slice(0, 2).map((part) => part[0]).join("").toUpperCase();
  return <div className="flex items-center gap-3"><span className={cn("grid size-9 shrink-0 place-items-center rounded-lg bg-gradient-to-br text-[11px] font-bold text-slate-950", avatarTones[index % avatarTones.length])}>{initials}</span><div className="min-w-0"><p className="truncate text-xs font-semibold text-slate-200">{user.name}</p><p className="mt-0.5 truncate text-[10px] text-slate-600">{user.email}</p></div></div>;
}

function Role({ role }: { role: ApiUser["role"] }) {
  return <span className="inline-flex items-center gap-1.5 rounded-md border border-violet-300/10 bg-violet-400/[0.07] px-2 py-1 text-[10px] font-medium text-violet-300"><ShieldCheck className="size-3" />{role === "admin" ? "Administrator" : "Citizen"}</span>;
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-BD", { dateStyle: "medium" }).format(new Date(value));
}
