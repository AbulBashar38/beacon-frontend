"use client";

import { useMemo, useState } from "react";
import {
  CheckCircle2,
  Clock3,
  Mail,
  MoreHorizontal,
  Search,
  ShieldCheck,
  UserPlus,
  Users,
  UserX,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { adminUsers, userRoles, userStatuses, type AdminUser, type UserRole, type UserStatus } from "@/lib/admin-users";
import { cn } from "@/lib/utils";

const avatarTones = ["from-teal-300 to-cyan-600", "from-violet-300 to-indigo-600", "from-amber-300 to-orange-600", "from-rose-300 to-red-600"];

export function UsersWorkspace() {
  const [users, setUsers] = useState(adminUsers);
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("All roles");
  const [status, setStatus] = useState("All statuses");
  const [inviteOpen, setInviteOpen] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return users.filter((user) =>
      (!query || [user.name, user.email, user.organization, user.district].some((value) => value.toLowerCase().includes(query))) &&
      (role === "All roles" || user.role === role) &&
      (status === "All statuses" || user.status === status)
    );
  }, [role, search, status, users]);

  const metrics = [
    { label: "Total users", value: users.length, detail: "Across 8 divisions", icon: Users, tone: "text-cyan-300 bg-cyan-400/10" },
    { label: "Active now", value: users.filter((user) => user.status === "Active").length, detail: "2 online currently", icon: CheckCircle2, tone: "text-emerald-300 bg-emerald-400/10" },
    { label: "Pending invites", value: users.filter((user) => user.status === "Invited").length, detail: "Awaiting activation", icon: Clock3, tone: "text-amber-300 bg-amber-400/10" },
    { label: "Suspended", value: users.filter((user) => user.status === "Suspended").length, detail: "Access disabled", icon: UserX, tone: "text-red-300 bg-red-400/10" },
  ];

  function changeStatus(user: AdminUser) {
    const next: UserStatus = user.status === "Suspended" ? "Active" : "Suspended";
    setUsers((current) => current.map((item) => item.id === user.id ? { ...item, status: next } : item));
    showNotice(`${user.name} ${next === "Active" ? "reactivated" : "suspended"}.`);
  }

  function showNotice(message: string) {
    setNotice(message);
    window.setTimeout(() => setNotice(null), 2200);
  }

  function addUser(input: { name: string; email: string; role: UserRole; organization: string }) {
    const names = input.name.trim().split(/\s+/);
    const initials = names.slice(0, 2).map((name) => name[0]).join("").toUpperCase();
    setUsers((current) => [{
      id: `USR-${String(current.length + 103).padStart(4, "0")}`,
      name: input.name,
      initials,
      email: input.email,
      role: input.role,
      organization: input.organization,
      district: "Pending assignment",
      status: "Invited",
      lastActive: "Invitation pending",
      joinedAt: "24 Jul 2026",
    }, ...current]);
    setInviteOpen(false);
    showNotice(`Invitation sent to ${input.email}.`);
  }

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-[radial-gradient(circle_at_15%_0%,rgba(20,184,166,.06),transparent_28%)] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1600px]">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-teal-400">Access administration</p>
            <h1 className="font-heading text-2xl font-bold tracking-tight text-white sm:text-3xl">Users &amp; permissions</h1>
            <p className="mt-1 text-sm text-slate-500">Manage government operators and departmental access.</p>
          </div>
          <Button className="bg-teal-400 text-slate-950 hover:bg-teal-300" onClick={() => setInviteOpen(true)}><UserPlus /> Invite user</Button>
        </div>

        <section className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4" aria-label="User metrics">
          {metrics.map((metric) => {
            const Icon = metric.icon;
            return <article key={metric.label} className="rounded-2xl border border-white/8 bg-slate-900/75 p-4"><div className="flex items-start justify-between"><div><p className="text-[11px] font-medium text-slate-500">{metric.label}</p><p className="mt-2 font-heading text-2xl font-bold text-white">{metric.value}</p></div><span className={cn("grid size-8 place-items-center rounded-lg", metric.tone)}><Icon className="size-4" /></span></div><p className="mt-2 text-[10px] text-slate-600">{metric.detail}</p></article>;
          })}
        </section>

        <section className="mt-4 overflow-hidden rounded-2xl border border-white/8 bg-slate-900/75 shadow-2xl shadow-black/10">
          <div className="flex flex-col gap-3 border-b border-white/7 p-4 lg:flex-row">
            <label className="relative min-w-0 flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-600" />
              <span className="sr-only">Search users</span>
              <input value={search} onChange={(event) => setSearch(event.target.value)} className="h-10 w-full rounded-lg border border-white/8 bg-slate-950/60 pl-9 pr-3 text-xs text-slate-200 outline-none placeholder:text-slate-600 focus:border-teal-400/40 focus:ring-2 focus:ring-teal-400/10" placeholder="Search by name, email, organization or district…" />
            </label>
            <div className="grid grid-cols-2 gap-2">
              <FilterSelect label="Role" value={role} options={userRoles} onChange={setRole} />
              <FilterSelect label="Status" value={status} options={userStatuses} onChange={setStatus} />
            </div>
          </div>

          <div className="hidden overflow-x-auto lg:block">
            <table className="w-full min-w-[980px] text-left">
              <thead className="border-b border-white/7 text-[9px] font-semibold uppercase tracking-[0.14em] text-slate-600"><tr><th className="px-5 py-3">User</th><th className="px-3 py-3">Role</th><th className="px-3 py-3">Organization</th><th className="px-3 py-3">District</th><th className="px-3 py-3">Status</th><th className="px-3 py-3">Last active</th><th className="w-12 px-3 py-3"><span className="sr-only">Actions</span></th></tr></thead>
              <tbody className="divide-y divide-white/6">{filtered.map((user, index) => <UserRow key={user.id} user={user} index={index} onStatusChange={() => changeStatus(user)} />)}</tbody>
            </table>
          </div>

          <div className="divide-y divide-white/7 lg:hidden">
            {filtered.map((user, index) => <UserCard key={user.id} user={user} index={index} onStatusChange={() => changeStatus(user)} />)}
          </div>

          {!filtered.length && <div className="px-6 py-20 text-center"><Users className="mx-auto size-7 text-slate-700" /><h2 className="mt-3 text-sm font-semibold text-slate-300">No users found</h2><p className="mt-1 text-xs text-slate-600">Try a different search or access filter.</p><Button size="sm" variant="outline" className="mt-4 border-white/10 bg-white/[0.035] text-slate-300" onClick={() => { setSearch(""); setRole("All roles"); setStatus("All statuses"); }}>Clear filters</Button></div>}

          <footer className="border-t border-white/7 px-4 py-3 text-[10px] text-slate-600">Showing {filtered.length} of {users.length} government accounts</footer>
        </section>
      </div>

      {inviteOpen && <InviteDialog onClose={() => setInviteOpen(false)} onInvite={addUser} />}
      {notice && <div role="status" className="fixed bottom-5 right-5 z-[70] flex items-center gap-2 rounded-xl border border-emerald-300/15 bg-slate-900 px-4 py-3 text-xs text-emerald-300 shadow-2xl"><CheckCircle2 className="size-4" />{notice}</div>}
    </main>
  );
}

function UserRow({ user, index, onStatusChange }: { user: AdminUser; index: number; onStatusChange: () => void }) {
  return <tr className="group transition hover:bg-white/[0.025]"><td className="px-5 py-3"><UserIdentity user={user} index={index} /></td><td className="px-3 py-3"><RoleBadge role={user.role} /></td><td className="max-w-[220px] px-3 py-3 text-[10px] text-slate-400"><span className="line-clamp-2">{user.organization}</span></td><td className="px-3 py-3 text-[11px] text-slate-400">{user.district}</td><td className="px-3 py-3"><UserStatusBadge status={user.status} /></td><td className="px-3 py-3 text-[10px] text-slate-500">{user.lastActive}</td><td className="px-3 py-3"><button onClick={onStatusChange} title={user.status === "Suspended" ? "Reactivate user" : "Suspend user"} className="grid size-8 place-items-center rounded-lg text-slate-600 opacity-0 transition hover:bg-white/5 hover:text-white group-hover:opacity-100" aria-label={`${user.status === "Suspended" ? "Reactivate" : "Suspend"} ${user.name}`}><MoreHorizontal className="size-4" /></button></td></tr>;
}

function UserCard({ user, index, onStatusChange }: { user: AdminUser; index: number; onStatusChange: () => void }) {
  return <article className="p-4"><div className="flex items-start justify-between gap-3"><UserIdentity user={user} index={index} /><button onClick={onStatusChange} className="grid size-8 shrink-0 place-items-center rounded-lg text-slate-500 hover:bg-white/5 hover:text-white" aria-label={`${user.status === "Suspended" ? "Reactivate" : "Suspend"} ${user.name}`}><MoreHorizontal className="size-4" /></button></div><div className="mt-3 flex flex-wrap gap-2"><RoleBadge role={user.role} /><UserStatusBadge status={user.status} /></div><div className="mt-3 grid grid-cols-2 gap-3 text-[10px]"><div><p className="text-slate-600">Organization</p><p className="mt-1 text-slate-400">{user.organization}</p></div><div><p className="text-slate-600">Last active</p><p className="mt-1 text-slate-400">{user.lastActive}</p></div></div></article>;
}

function UserIdentity({ user, index }: { user: AdminUser; index: number }) {
  return <div className="flex items-center gap-3"><span className={cn("grid size-9 shrink-0 place-items-center rounded-lg bg-gradient-to-br text-[11px] font-bold text-slate-950", avatarTones[index % avatarTones.length])}>{user.initials}</span><div className="min-w-0"><p className="truncate text-xs font-semibold text-slate-200">{user.name}</p><p className="mt-0.5 truncate text-[10px] text-slate-600">{user.email}</p></div></div>;
}

function RoleBadge({ role }: { role: UserRole }) {
  return <span className="inline-flex items-center gap-1.5 rounded-md border border-violet-300/10 bg-violet-400/[0.07] px-2 py-1 text-[10px] font-medium text-violet-300"><ShieldCheck className="size-3" />{role}</span>;
}

function UserStatusBadge({ status }: { status: UserStatus }) {
  const styles: Record<UserStatus, string> = { Active: "bg-emerald-400/10 text-emerald-300 border-emerald-300/15", Invited: "bg-amber-400/10 text-amber-300 border-amber-300/15", Suspended: "bg-red-400/10 text-red-300 border-red-300/15" };
  return <span className={cn("inline-flex items-center gap-1.5 rounded-md border px-2 py-1 text-[10px] font-semibold", styles[status])}><span className="size-1.5 rounded-full bg-current" />{status}</span>;
}

function FilterSelect({ label, value, options, onChange }: { label: string; value: string; options: readonly string[]; onChange: (value: string) => void }) {
  return <label><span className="sr-only">{label}</span><select value={value} onChange={(event) => onChange(event.target.value)} className="h-10 min-w-36 rounded-lg border border-white/8 bg-slate-950/60 px-3 text-xs text-slate-300 outline-none focus:border-teal-400/40">{options.map((option) => <option key={option}>{option}</option>)}</select></label>;
}

function InviteDialog({ onClose, onInvite }: { onClose: () => void; onInvite: (input: { name: string; email: string; role: UserRole; organization: string }) => void }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<UserRole>("Department officer");
  const [organization, setOrganization] = useState("");
  const valid = name.trim().length > 2 && email.includes("@") && organization.trim().length > 2;

  return (
    <div className="fixed inset-0 z-[60] grid place-items-center bg-black/65 p-4 backdrop-blur-sm" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <section role="dialog" aria-modal="true" aria-labelledby="invite-title" className="w-full max-w-md overflow-hidden rounded-2xl border border-white/10 bg-slate-900 shadow-2xl">
        <header className="flex items-start justify-between border-b border-white/7 px-5 py-4"><div><div className="flex items-center gap-2 text-teal-300"><Mail className="size-4" /><h2 id="invite-title" className="font-heading text-sm font-semibold text-white">Invite government user</h2></div><p className="mt-1 text-[10px] text-slate-500">They will receive an email to activate their account.</p></div><button onClick={onClose} className="grid size-8 place-items-center rounded-lg text-slate-500 hover:bg-white/5 hover:text-white" aria-label="Close invite dialog"><X className="size-4" /></button></header>
        <form className="space-y-4 p-5" onSubmit={(event) => { event.preventDefault(); if (valid) onInvite({ name, email, role, organization }); }}>
          <DialogField label="Full name"><input value={name} onChange={(event) => setName(event.target.value)} autoFocus placeholder="e.g. Amina Rahman" className="user-dialog-input" /></DialogField>
          <DialogField label="Official email"><input value={email} onChange={(event) => setEmail(event.target.value)} type="email" placeholder="name@agency.gov.bd" className="user-dialog-input" /></DialogField>
          <DialogField label="Role"><select value={role} onChange={(event) => setRole(event.target.value as UserRole)} className="user-dialog-input">{userRoles.slice(1).map((item) => <option key={item}>{item}</option>)}</select></DialogField>
          <DialogField label="Organization"><input value={organization} onChange={(event) => setOrganization(event.target.value)} placeholder="Government agency or department" className="user-dialog-input" /></DialogField>
          <div className="flex justify-end gap-2 pt-2"><Button type="button" variant="ghost" className="text-slate-400 hover:bg-white/5 hover:text-white" onClick={onClose}>Cancel</Button><Button type="submit" disabled={!valid} className="bg-teal-400 text-slate-950 hover:bg-teal-300"><Mail /> Send invitation</Button></div>
        </form>
      </section>
    </div>
  );
}

function DialogField({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block"><span className="mb-1.5 block text-[11px] font-medium text-slate-300">{label}</span>{children}</label>;
}
