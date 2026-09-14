export default function Loading() {
  return (
    <main
      id="main"
      className="min-h-screen px-6 pt-[calc(5.5rem+env(safe-area-inset-top,0px))]"
      aria-busy="true"
      aria-live="polite"
    >
      <p className="sr-only">Nalaganje …</p>
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="h-4 w-40 animate-pulse rounded-full bg-white/10" />
        <div className="h-10 w-3/4 max-w-md animate-pulse rounded-xl bg-white/10" />
        <div className="h-24 w-full animate-pulse rounded-2xl bg-white/5" />
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="h-11 animate-pulse rounded-xl bg-white/10" />
          <div className="h-11 animate-pulse rounded-xl bg-white/10" />
        </div>
      </div>
    </main>
  );
}
