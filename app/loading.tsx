export default function Loading() {
  return (
    <main
      id="main"
      className="flex min-h-screen items-center justify-center px-6"
      aria-busy="true"
      aria-live="polite"
    >
      <p className="text-[14px] font-medium uppercase tracking-[0.16em] text-green-400">
        Nalaganje …
      </p>
    </main>
  );
}
