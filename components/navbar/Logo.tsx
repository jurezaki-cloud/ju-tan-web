import Image from "next/image";
import Link from "next/link";

export default function Logo() {
  return (
    <Link
      href="/"
      aria-label="JU-TAN — domov"
      className="flex items-center gap-3 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500"
    >
      <Image
        src="/logo/ju-tan-studio.png"
        alt="Logotip JU-TAN"
        width={140}
        height={48}
        sizes="140px"
        className="h-10 w-auto"
        priority
        fetchPriority="high"
      />

      <span className="text-xl font-bold tracking-wide text-white light:text-slate-900">
        JU-TAN
      </span>
    </Link>
  );
}
