"use client";

import Image from "next/image";
import { FadeIn } from "@/components/animations";
import { cn } from "@/lib/utils";
import {
  OFFICE_SHOT_H,
  OFFICE_SHOT_W,
  officeShots,
  type OfficeShot,
} from "@/components/office-page/officeAssets";

function ShotFrame({
  shot,
  className,
  imageClassName,
  sizes,
  priority = false,
}: {
  shot: OfficeShot;
  className?: string;
  imageClassName?: string;
  sizes: string;
  priority?: boolean;
}) {
  return (
    <figure
      className={cn(
        "overflow-hidden rounded-[1.05rem] border border-white/12 bg-[#0a1012]",
        "shadow-[0_22px_48px_rgba(0,0,0,0.34)]",
        "light:border-slate-200/90 light:bg-white light:shadow-[0_18px_40px_rgba(15,23,42,0.1)]",
        className,
      )}
    >
      <Image
        src={shot.src}
        alt={shot.alt}
        width={OFFICE_SHOT_W}
        height={OFFICE_SHOT_H}
        sizes={sizes}
        priority={priority}
        loading={priority ? undefined : "lazy"}
        className={cn("object-cover object-top", imageClassName)}
      />
      <figcaption className="sr-only">{shot.label}</figcaption>
    </figure>
  );
}

/**
 * Single DOM tree of four screenshots. Breakpoints only rearrange layout —
 * no duplicate desktop/tablet/mobile image mounts.
 */
export default function OfficeInterface() {
  const { dashboard, invoices, warehouse, customers } = officeShots;

  return (
    <div className="relative mx-auto w-full max-w-[68rem]">
      <div
        className="pointer-events-none absolute inset-[10%] rounded-full bg-[radial-gradient(circle,rgba(22,163,74,0.09),transparent_68%)] blur-3xl light:bg-[radial-gradient(circle,rgba(22,163,74,0.06),transparent_68%)]"
        aria-hidden
      />

      {/*
        Mobile: vertical sequence.
        Tablet+: dashboard dominant, supports in a calm row/grid.
        Desktop (xl): dashboard stays dominant; supports shift into a light editorial stack under/beside via grid — still one tree.
      */}
      <div className="relative grid gap-4 md:gap-5 xl:gap-5">
        <FadeIn>
          <ShotFrame
            shot={dashboard}
            priority
            sizes="(min-width: 1280px) 980px, (min-width: 768px) 90vw, 100vw"
            className="relative aspect-[4/3] md:aspect-[16/9.5] xl:aspect-[16/9]"
            imageClassName="absolute inset-0 h-full w-full max-w-none object-cover object-[18%_12%] scale-[1.55] md:scale-100 md:object-[center_14%]"
          />
        </FadeIn>

        <div className="grid gap-4 md:grid-cols-3 md:gap-4 xl:gap-5">
          <FadeIn delay={0.05}>
            <ShotFrame
              shot={invoices}
              sizes="(min-width: 1280px) 340px, (min-width: 768px) 30vw, 100vw"
              className="relative aspect-[4/3] md:aspect-[16/10] xl:aspect-[16/11]"
              imageClassName="absolute inset-0 h-full w-full max-w-none object-cover object-[72%_28%] scale-[1.7] md:scale-100 md:object-[center_38%]"
            />
          </FadeIn>
          <FadeIn delay={0.08}>
            <ShotFrame
              shot={warehouse}
              sizes="(min-width: 1280px) 340px, (min-width: 768px) 30vw, 100vw"
              className="relative aspect-[4/3] md:aspect-[16/10] xl:aspect-[16/11]"
              imageClassName="absolute inset-0 h-full w-full max-w-none object-cover object-[74%_22%] scale-[1.7] md:scale-100 md:object-[center_26%]"
            />
          </FadeIn>
          <FadeIn delay={0.11}>
            <ShotFrame
              shot={customers}
              sizes="(min-width: 1280px) 340px, (min-width: 768px) 30vw, 100vw"
              className="relative aspect-[4/3] md:aspect-[16/10] xl:aspect-[16/11]"
              imageClassName="absolute inset-0 h-full w-full max-w-none object-cover object-[20%_18%] scale-[1.65] md:scale-100 md:object-[center_22%]"
            />
          </FadeIn>
        </div>
      </div>
    </div>
  );
}
