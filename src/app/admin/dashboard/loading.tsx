export default function DashboardLoading() {
  return (
    <main className="min-h-[calc(100vh-4rem)] bg-slate-950 p-6">
      <div className="mx-auto max-w-[1600px] animate-pulse">
        <div className="h-8 w-64 rounded-lg bg-white/5" />
        <div className="mt-2 h-4 w-96 max-w-full rounded bg-white/[0.035]" />
        <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4 xl:grid-cols-7">
          {Array.from({ length: 7 }).map((_, index) => <div key={index} className="h-32 rounded-2xl bg-white/[0.035]" />)}
        </div>
        <div className="mt-4 grid gap-4 xl:grid-cols-[1.7fr_.7fr]"><div className="h-[480px] rounded-2xl bg-white/[0.035]" /><div className="h-[480px] rounded-2xl bg-white/[0.035]" /></div>
      </div>
    </main>
  );
}
