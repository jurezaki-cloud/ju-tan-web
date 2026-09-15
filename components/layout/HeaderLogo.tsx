import Image from "next/image";
import Link from "next/link";
import { getMessages } from "@/lib/i18n/messages";

export default function HeaderLogo() {
  const copy = getMessages().header;

  return (
    <Link
      href="/#home"
      aria-label={copy.logoAria}
      className="flex min-h-11 min-w-11 shrink-0 items-center gap-2 rounded-[10px] opacity-100 transition-opacity duration-200 ease-out hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600 sm:gap-3"
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
      <span className="sr-only">{copy.brand}</span>
    </Link>
  );
}
