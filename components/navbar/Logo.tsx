import Image from "next/image";
import Link from "next/link";

export default function Logo() {
  return (
    <Link
      href="/"
      aria-label="JU-TAN — domov"
      className="flex min-h-11 min-w-11 shrink-0 items-center gap-2 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 sm:gap-3"
    >
      <Image
        src="/logo/ju-tan-studio.png"
        alt="Logotip JU-TAN"
        width={140}
        height={48}
        sizes="140px"
        className="h-9 w-auto sm:h-10"
        priority
        fetchPriority="high"
      />

      <span className="hidden text-xl font-bold tracking-wide text-white min-[400px]:inline light:text-slate-900">
        JU-TAN
      </span>
    </Link>
  );
}
