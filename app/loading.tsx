export default function Loading() {
  return (
    <main
      id="main"
      className="min-h-dvh px-[max(1.5rem,env(safe-area-inset-left,0px))] pt-[calc(5.5rem+env(safe-area-inset-top,0px))] pb-[max(2rem,env(safe-area-inset-bottom,0px))]"
      aria-busy="true"
      aria-live="polite"
    >
      <p className="sr-only">Nalaganje …</p>
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="h-8 w-48 animate-pulse rounded-full bg-white/10" />
        <div className="h-12 w-3/4 max-w-lg animate-pulse rounded-xl bg-white/10" />
        <div className="h-24 w-full animate-pulse rounded-2xl bg-white/5" />
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="h-11 animate-pulse rounded-xl bg-white/10" />
          <div className="h-11 animate-pulse rounded-xl bg-white/10" />
        </div>
        <div className="grid auto-rows-fr gap-4 sm:grid-cols-2">
          <div className="min-h-[10rem] animate-pulse rounded-2xl bg-white/5" />
          <div className="min-h-[10rem] animate-pulse rounded-2xl bg-white/5" />
        </div>
      </div>
    </main>
  );
}
