export default function ReportsLoading() {
  return (
    <main className="min-h-[calc(100vh-4rem)] bg-slate-950 p-6">
      <div className="mx-auto max-w-[1600px] animate-pulse">
        <div className="h-8 w-52 rounded-lg bg-white/5" />
        <div className="mt-2 h-4 w-96 max-w-full rounded bg-white/[0.035]" />
        <div className="mt-6 grid gap-5 xl:grid-cols-[320px_1fr]"><div className="h-[680px] rounded-2xl bg-white/[0.035]" /><div className="h-[980px] rounded-sm bg-white/90" /></div>
      </div>
    </main>
  );
}
