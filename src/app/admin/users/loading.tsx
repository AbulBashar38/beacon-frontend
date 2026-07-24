export default function UsersLoading() {
  return (
    <main className="min-h-[calc(100vh-4rem)] bg-slate-950 p-6">
      <div className="mx-auto max-w-[1600px] animate-pulse">
        <div className="h-8 w-64 rounded-lg bg-white/5" />
        <div className="mt-2 h-4 w-96 max-w-full rounded bg-white/[0.035]" />
        <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">{Array.from({ length: 4 }).map((_, index) => <div key={index} className="h-28 rounded-2xl bg-white/[0.035]" />)}</div>
        <div className="mt-4 rounded-2xl bg-white/[0.035] p-4"><div className="h-10 rounded-lg bg-white/[0.04]" /><div className="mt-4 space-y-3">{Array.from({ length: 7 }).map((_, index) => <div key={index} className="h-14 rounded-lg bg-white/[0.025]" />)}</div></div>
      </div>
    </main>
  );
}
