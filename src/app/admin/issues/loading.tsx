export default function IssuesLoading() {
  return (
    <main className="min-h-[calc(100vh-4rem)] bg-slate-950 p-6">
      <div className="mx-auto max-w-[1600px] animate-pulse">
        <div className="h-8 w-52 rounded-lg bg-white/5" />
        <div className="mt-2 h-4 w-80 max-w-full rounded bg-white/[0.035]" />
        <div className="mt-6 rounded-2xl border border-white/8 bg-slate-900/70 p-4">
          <div className="h-10 rounded-lg bg-white/[0.035]" />
          <div className="mt-5 space-y-3">{Array.from({ length: 7 }).map((_, index) => <div key={index} className="h-16 rounded-lg bg-white/[0.025]" />)}</div>
        </div>
      </div>
    </main>
  );
}
