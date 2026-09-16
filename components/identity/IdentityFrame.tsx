import type { ReactNode } from "react";
import BrandLogo from "@/components/common/BrandLogo";
import { cardSurface, cardBodyClass } from "@/design";

export default function IdentityFrame({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <main id="main" className="flex min-h-screen items-center justify-center px-4 py-16">
      <div className={`${cardSurface} w-full max-w-md p-8`}>
        <BrandLogo variant="header" />
        <h1 className="mt-6 font-heading text-[22px] font-semibold tracking-[-0.03em] text-white light:text-slate-900">
          {title}
        </h1>
        <p className={`mt-1 ${cardBodyClass}`}>Notranja platforma</p>
        <div className="mt-6">{children}</div>
      </div>
    </main>
  );
}
