import Image from "next/image";
import Link from "next/link";
import { getMessages } from "@/lib/i18n/messages";

export default function Logo() {
  const copy = getMessages().header;

  return (
    <Link
      href="/#home"
      aria-label={copy.logoAria}
      className="flex min-h-11 min-w-11 shrink-0 items-center gap-2 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 sm:gap-3"
    >
      <Image
        src="/logo/ju-tan-studio.png"
        alt={copy.logoAlt}
        width={140}
        height={48}
        sizes="140px"
        className="h-9 w-auto sm:h-10"
        priority
        fetchPriority="high"
      />
      <span className="hidden text-lg font-bold tracking-wide text-white min-[400px]:inline light:text-slate-900">
        {copy.brand}
      </span>
    </Link>
  );
}
