import { BeaconWordmark } from "@/components/shared/beacon-mark";

export default function TrackPageLoading() {
  return (
    <main className="landing-page relative flex min-h-svh items-center justify-center overflow-hidden bg-[var(--landing-paper)] px-5">
      <div
        aria-hidden
        className="bg-grid absolute inset-0 text-[var(--landing-ink)] opacity-[0.035]"
      />
      <div
        className="relative w-full max-w-sm overflow-hidden rounded-[1.6rem] bg-[var(--landing-ink)] p-7 text-white shadow-[0_30px_80px_-50px_oklch(0.2_0.04_187/70%)]"
        role="status"
      >
        <div aria-hidden className="landing-grid absolute inset-0 opacity-20" />
        <div className="relative">
          <BeaconWordmark className="[&>span:last-child]:text-white" />
          <div className="mt-8 border-t border-white/8 pt-5">
            <span className="block h-3 w-28 animate-pulse rounded bg-white/8" />
            <span className="mt-3 block h-6 w-4/5 animate-pulse rounded-md bg-white/9" />
            <span className="mt-3 block h-4 w-full animate-pulse rounded bg-white/6" />
          </div>
          <span className="sr-only">Opening the public tracker…</span>
        </div>
      </div>
    </main>
  );
}
