import type { Metadata } from "next";
import CtaLink from "@/components/navbar/CtaLink";
import { bodyClass, kickerClass } from "@/design";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Stran ne obstaja",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <main
      id="main"
      className="flex min-h-dvh flex-col items-center justify-center px-[max(1.5rem,env(safe-area-inset-left,0px))] pt-[env(safe-area-inset-top,0px)] pb-[max(1.5rem,env(safe-area-inset-bottom,0px))] text-center"
    >
      <p className={cn(kickerClass, "justify-center")}>
        <span className="tabular-nums text-green-600/80">404</span>
      </p>
      <h1 className="heading-display mt-3.5 font-heading font-semibold tracking-[-0.038em] text-white light:text-slate-900">
        Stran ne obstaja
      </h1>
      <p className={cn(bodyClass, "mt-3.5 max-w-[40rem] light:text-slate-600")}>
        Naslov ni veljaven ali je bil premaknjen. Vrnite se na domačo stran.
      </p>
      <CtaLink href="/" className="mt-8">
        Na domov
      </CtaLink>
    </main>
  );
}
