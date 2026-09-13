import Image from "next/image";
import Link from "next/link";

export default function Logo() {
  return (
    <Link href="/" className="flex items-center gap-3">
      <Image
        src="/logo/ju-tan-studio.png"
        alt="JU-TAN Studio"
        width={48}
        height={48}
        priority
      />

      <span className="text-xl font-bold tracking-wide text-white">
        JU-TAN STUDIO
      </span>
    </Link>
  );
}